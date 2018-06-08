require('babel-register');
var express = require('express'),
    path = require('path'),
    bodyParese = require('body-parser'),
    fortune = require('./lib/fortune.js'),
    weather = require('./lib/weather.js'),
    formidable = require('formidable'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    credentials = require('./credentials.js'),
    VacationInSeasonListener = require('./models/vacationInSeasonListener.js'),
    Vacation = require('./models/vacation.js'),
    routes = require('./routes/index'),
    users = require('./routes/users'),
    upload = require('./routes/upload');

var app = express();

var dataDir = __dirname + '/data';
var vacationPhotoDir = dataDir + '/vacation-photo';
fs.existsSync(dataDir) || fs.mkdirSync(dataDir);
fs.existsSync(vacationPhotoDir) || fs.mkdirSync(vacationPhotoDir);


Vacation.find(function (err, vacations) {
    if (vacations.length) return;
    new Vacation({
        name: 'Hood River Day Trip',
        slug: 'hood-river-day-trip',
        category: 'Day Trip',
        sku: 'HR199',
        description: 'Spend a day sailing on the Columbia and ' +
            'enjoying craft beers in Hood River!',
        priceInCents: 9995,
        tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'],
        inSeason: true,
        maximumGuests: 16,
        available: true,
        packagesSold: 0,
    }).save();
    new Vacation({
        name: 'Oregon Coast Getaway',
        slug: 'oregon-coast-getaway',
        category: 'Weekend Getaway',
        sku: 'OC39',
        description: 'Enjoy the ocean air and quaint coastal towns!',
        priceInCents: 269995,
        tags: ['weekend getaway', 'oregon coast', 'beachcombing'],
        inSeason: false,
        maximumGuests: 8,
        available: true,
        packagesSold: 0,
    }).save();
    new Vacation({
        name: 'Rock Climbing in Bend',
        slug: 'rock-climbing-in-bend',
        category: 'Adventure',
        sku: 'B99',
        description: 'Experience the thrill of climbing in the high desert.',
        priceInCents: 289995,
        tags: ['weekend getaway', 'bend', 'high desert', 'rock climbing'],
        inSeason: true,
        requiresWaiver: true,
        maximumGuests: 4,
        available: false,
        packagesSold: 0,
        notes: 'The tour guide is currently recovering from a skiing accident.',
    }).save();
});

function saveContestEntry(contestName, email, year, month, photoPath) {
    // TODO
}

function startServer() {
    app.listen(app.get('port'), function () {
        console.log('start in ' + app.get('env') + ' mode on http://localhost: ' + app.get('port'));
    });
}

var opts = {
    keepAlive: true
};

switch (app.get('env')) {
    case 'development':
        mongoose.connect(credentials.mongo.development.connectionString, opts);
        break;
    case 'production':
        mongoose.connect(credentials.mongo.production.connectionString, opts);
        break;
    default:
        throw new Error('Unknown execution environment: ' + app.get('env'));
}


switch (app.get('env')) {
    case 'development':
        app.use(require('morgan')('dev'));
        break;
    case 'production':
        app.use(require('express-logger')({
            path: __dirname + 'log/request.log'
        }));
        break;
}
var handlebars = require('express-handlebars')
    .create({
        defaultLayout: 'main',
        extname: '.hbs',
        layoutDir: app.get('views') + '/layouts',
        partialsDir: [app.get('views') + '/partials']
    });
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

app.set('port', process.env.PORT || 3000);

var session = require('express-session');
var MongoSessionStore = require('connect-mongo')(session);
app.use(require('cookie-parser')(credentials.cookiesSecret));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookiesSecret,
    store: new MongoSessionStore({
        url: credentials.mongo[app.get('env')].connectionString
    }),
}));


// json类型 body
app.use(bodyParese.json());

//query string 类型 bodu
app.use(bodyParese.urlencoded({
    extended: false
}));



app.use(function (req, res, next) {
    var cluster = require('cluster');
    if (cluster.isWorker) {
        console.log("Worker %d", cluster.worker.id);
    }
    next();
});

//静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    if (!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weather = weather.getWeatherData();
    next();
});

app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

app.use('/users', users);
app.use('/files', upload);



app.get('/set-currency/:currency', function (req, res) {
    req.session.currency = req.params.currency;
    return res.redirect(303, '/vacations');
});

function convertFromUSD(value, currency) {
    switch (currency) {
        case 'USD':
            return value * 1;
        case 'GBP':
            return value * 0.6;
        case 'BTC':
            return value * 0.0023707918444761;
        default:
            return NaN;
    }
}

app.get('/vacations', function (req, res) {
    Vacation.find({
        available: true
    }, function (err, vacations) {
        var currency = req.session.currency || 'USD';
        var context = {
            vacations: vacations.map(function (vacation) {
                return {
                    sku: vacation.sku,
                    name: vacation.name,
                    description: vacation.description,
                    price: convertFromUSD(vacation.priceInCents / 100, currency),
                    qty: vacation.qty,
                    inSeason: vacation.inSeason,
                };
            })
        };
        switch (currency) {
            case 'USD':
                context.currencyUSD = 'selected';
                break;
            case 'GBP':
                context.currencyGBP = 'selected';
                break;
            case 'BTC':
                context.currencyBTC = 'selected';
                break;
        }
        res.render('vacations', context);
    });
});

app.get('/notify-me-when-in-season', function (req, res) {
    res.render('notify-me-when-in-season', {
        sku: req.query.sku
    });
});

app.post('/notify-me-when-in-season', function (req, res) {
    VacationInSeasonListener.update({
            email: req.body.email
        }, {
            $push: {
                skus: req.body.sku
            }
        }, {
            upsert: true
        },
        function (err) {
            if (err) {
                console.error(err.stack);
                // req.session.flash = {
                //     type: 'danger',
                //     intro: 'Ooops!',
                //     message: 'There was an error processing your request.',
                // };
                return res.redirect(303, '/vacations');
            }
            // req.session.flash = {
            //     type: 'success',
            //     intro: 'Thank you!',
            //     message: 'You will be notified when this vacation is in season.',
            // };
            return res.redirect(303, '/vacations');
        }
    );
});

app.get('/contest/vacation-photo', function (req, res) {
    var now = new Date();
    res.render('contest/vacation-photo', {
        year: now.getFullYear(),
        month: now.getMonth()
    });
});

app.post('/contest/vacation-photo/:year/:month', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) return res.redirect(303, '/error');
        if (err) {
            res.session.flash = {
                type: 'danger',
                intro: 'Oops!',
                message: 'try again',
            };
            return res.redirect(303, '/contest/vacation-photo');
        }
        var photo = files.photo;
        var dir = vacationPhotoDir + '/' + Date.now();
        var path = dir + '/' + photo.name;
        fs.mkdirSync(dir);
        fs.renameSync(photo.path, dir + '/' + photo.name);
        saveContestEntry("vacation-photo", fields.email, req.params.year, req.params.month, path);
        req.session.flash = {
            type: 'success',
            intro: 'Good Luck',
            message: 'entered',
        };
        return res.redirect(303, '/contest/vacation-photo/entries');
    });
});

app.get('/newsletter', function (req, res) {
    res.render('newsletter', {
        csrf: 'CSRF token goes here'
    });
})

app.post('/process', function (req, res) {
    if (req.xhr || req.accepts('json,html') === 'json') {
        res.send({
            success: true
        })
    } else {
        res.redirect(303, '/thank you');
    }
})

app.get('/epic-fail', function (req, res) {
    process.nextTick(function () {
        throw new Error('Kaboom');
    });
});
app.get('/home', function (req, res) {
    res.render('home');
});
app.get('/about', function (req, res) {
    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js'
    });
});
app.get('/fail', function (req, res) {
    throw new Error('Nope');
});


app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(500);
    res.send('500');
});
// if (require.main == module) {
//     startServer();
// } else {
//     module.exports = startServer;
// }
app.listen(app.get('port'), function () {
    console.log('start in ' + app.get('env') + ' mode on http://localhost: ' + app.get('port'));
});