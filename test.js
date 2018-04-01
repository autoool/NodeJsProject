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

Promise.resolve('foo').then(function (response) {
    console.log(response);
    return Promise.resolve('bar');
}).then(function (result) {
    console.log(result);
});