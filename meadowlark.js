function getWeatherData() {
    return {
        locations: [{
                name: 'Portland',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)',
            },
            {
                name: 'Bend',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)',
            },
            {
                name: 'Manzanita',
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Light Rain',
                temp: '55.0 F (12.8 C)',
            },
        ],
    };
}

var express = require('express');
var fortune = require('./lib/fortune.js');
var app = express();

function startServer() {
    app.listen(app.get('port'), function () {
        console.log('start in ' + app.get('env') + ' mode on http://localhost: ' + app.get('port'));
    });
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
        layoutDir: app.get('views') + '/layouts',
        partialsDir: [app.get('views') + '/partials']
    });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(function (req, res, next) {
    var cluster = require('cluster');
    if (cluster.isWorker) {
        console.log("Worker %d", cluster.worker.id);
    }
    next();
});

//静态文件目录
app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
    if (!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weather = getWeatherData();
    next();
});

app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

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
if (require.main == module) {
    startServer();
} else {
    module.exports = startServer;
}
// app.listen(app.get('port'), function () {
//     console.log('start in ' + app.get('env') + ' mode on http://localhost: ' + app.get('port'));
// });