// new Promise(function (resolve, reject) {
//     throw new Error('悲剧了，又出 bug 了');
// }).then(function(){
//     throw new Error('悲剧了，又出 bug 2了');
// })
// .catch(function (err) {
//     console.log(err);
// });
// Promise.resolve('foo').then(Promise.resolve('bar')).then(function (result) {
//     console.log(result);
// });

// fetch.GET(app.globalData.appConfig.startpageUrl)
// .then(function (res) {
//   console.log("startpageUrl");
//   if (res.data.success) {
//     console.log("success");
//   } else {
//     throw Error("获取启动页数据失败，请稍后重试");
//   }
//   console.log(res.statusCode);
//   console.log(res);
//   return fetch.POST(app.globalData.appConfig.homeInfoUrl)
// }).then(res => {
//   console.log("首页数据")
//   console.log(res);

// }).catch(err => {
//   console.log(err)
//   wx.showToast({
//     title: err.message,
//     icon: "none"
//   })
// });
// },

// Promise.resolve('foo').then(function (response) {
//     console.log(response);
//     throw Error('test error')
//     return Promise.resolve('bar');
// }).then(function (result) {
//     console.log(result);
// }).catch(err => {
//     console.log(err);
// });

// setImmediate(function(){
//     console.log("setImmediate")
// })
// process.nextTick(function(){
//     console.log("nextTick")
// });
// console.log("normal")

const mysql = require('mysql'); // mysql node driver
const credentials = require('./credentials.js')// mysql配置文件
// const console = require('tracer').colorConsole(); // 增强console

// 初始化数据库配置, mysql端口号默认为3306
const connection = mysql.createConnection({
    host: credentials.mysql.development.host,
    user: credentials.mysql.development.user,
    password: credentials.mysql.development.password,
    database: credentials.mysql.development.database,
});

// 连接数据库
connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ', err);
    }
    console.debug('connected id is', connection.threadId);
});

connection.query('SELECT * FROM user', function (err, results, fields) {
    if (err) {
        console.error(err);
    }
    console.debug('results', results);
});
connection.end();
