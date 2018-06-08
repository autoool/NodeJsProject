var axios = require('axios');
var config = require('./config');

function getOpenIdFromWechat(code, appId, appSecret) {
    var path = config.miniProgram.openUrl +
        'appid=' + appId + '&secret=' + appSecret + '&grant_type=authorization_code' + '&js_code=' + code;
        console.log("getOpenIdFromWechat:"+path)
    return axios.post(path);
}

function getUnionId(scriptData,sessionKey,iv){

}

function getAccessToken(appId, appSecret) {
    var path = config.miniProgram.assceetokenuUrl + 'grant_type=client_credential&appid=' + appId + '&secret=' + appSecret;
    return new Promise((resolve, reject) => {
        request.post({
            url: path
        }, function (err, res, body) {
            if (err) {
                reject(err);
            } else if (res == undefined) {
                reject(Error(body));
            } else {
                var resp = JSON.parse(body);
                if (undefined == resp.errcode) {
                    resolve(body);
                } else {
                    reject(Error(resp.errmsg));
                }
            }
        });
    });
}

function sendMessageMP(openId, formId) {
    getAccessToken(config.miniProgram.appId,config.miniProgram.appSecret)
    .then(function(res){
        var path = config.miniProgram.sendmessageUrl + 'access_token=' + accessToken;
        return new Promise((resolve, reject) => {
            request.post({
                url: path,
                form: {
                    access_token: accessToken,
                    touser: openId,
                    template_id: config.miniProgram.templateId,
                    form_id: formId,
                }
            }, function (err, res, body) {
                if (err) {
                    reject(err);
                } else if (res == undefined) {
                    reject(Error(body));
                } else {
                    var resp = JSON.parse(body);
                    if (undefined == resp.errcode) {
                        resolve(body);
                    } else {
                        reject(Error(resp.errmsg));
                    }
                }
            });
        });
    }); 
}

module.exports = {
    getOpenIdFromWechat,
    sendMessageMP
};