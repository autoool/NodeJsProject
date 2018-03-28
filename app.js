var express = require('express');
var bodyParese = require('body-parser')


var app = express();

// json类型 body
app.use(bodyParese.json());

//query string 类型 bodu
app.use(bodyParese.urlencoded({
	extended:false
}));

//静态文件目录
app.use(express.static(__dirname+'/public'));

//路由与业务逻辑
app.use('/user',require('./routes/users.js'));

app.listen(80);