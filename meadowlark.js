

var express = require('express');
var bodyParese = require('body-parser');
var fortune = require('./lib/fortune.js');
var weather = require('./lib/weather.js');
var formidable = require('formidable');
var credentials = require('/credentials.js');
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
        extname:'.hbs',
        layoutDir: app.get('views') + '/layouts',
        partialsDir: [app.get('views') + '/partials']
    });
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

app.set('port', process.env.PORT || 3000);

// json类型 body
app.use(bodyParese.json());

//query string 类型 bodu
app.use(bodyParese.urlencoded({
	extended:false
}));

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
    res.locals.partials.weather = weather.getWeatherData();
    next();
});

app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

app.get('/contest/vacation-photo',function(req,res){
    var now = new Date();
    res.render('contest/vacation-photo',{
        year:now.getFullYear(),month:now.getMonth()
    });
});

app.post('/contest/vacation-photo/:year/:month',function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        if(err) return res.redirect(303,'/error');
        console.log(fields);
        console.log(files);
        res.redirect(303,'/thanks');
    })
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