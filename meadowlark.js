var express = require('express');
var app = express();

var fortunes = [
    "Conquer your fears or they will conquer you.",
    "Rivers need springs.",
    "Do not fear what you don't know.",
    "You will have a pleasant surprise.",
    "Whenever possible, keep it simple.",
];

var handlebars = require('express-handlebars')
    .create({
        defaultLayout: 'main'
    });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

//静态文件目录
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.render('home');
});
app.get('/about', function (req, res) {
    var randoeFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    res.render('about', {
        fortune: randoeFortune
    });
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
app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + ': prss Ctrl+C to terminate');
});