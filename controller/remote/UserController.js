const utils = require('../../lib/util');
const userModel = require('../../models/user');
const httpApi = require('../../lib/httpapi');
const credentials = require('../../credentials');
const responseFunc = require('../../lib/responseFunc');
const formidable = require('formidable');
const WXBizDataCrypt = require('../../lib/WXBizDataCrypt')
const _ = require('lodash')

class User {
    constructor() {

    }
    getOpenIdAction(req, res, next) {
        try {
            let code = req.body.code;
            if (_.isEmpty(code)) {
                throw Error('code不能为空');
            }
            httpApi.getOpenIdFromWechat(code,
                    credentials.miniProgram.appId,
                    credentials.miniProgram.appSecret)
                .then(function (response) {
                    //获取unionId    
                    if (undefined != response.data.errcode) {
                        throw Error(response.data.errmsg)
                    }        
                    let openId = response.data.openid;
                    let sessionKey = response.data.session_key;              
                    var userObj = {
                        openId: openId,
                        sessionKey: sessionKey
                    }
                    let userQuery = userModel.find({
                        'openId': openId
                    });
                    userQuery.exec(function (err, users) {
                        if (err) {
                            let resSendData = responseFunc.renderApiErr(res, 0, err.message);
                            res.json(resSendData);
                        } else {
                            if (users.length == 0) {
                                var newUser = new userModel(userObj);
                                newUser.save();
                                let resSendData = responseFunc.renderApiData(res, 1, "", newUser);
                                res.json(resSendData);
                            } else if (users.length == 1) {
                                let userData = users[0];
                                userData.sessionKey = sessionKey;
                                userData.save();
                                let resSendData = responseFunc.renderApiData(res, 1, "", userData);
                                res.json(resSendData);
                            } else {
                                let resSendData = responseFunc.renderApiErr(res, 0, "用户信息异常");
                                res.json(resSendData);
                            }
                        }
                    })

                }).catch(function (err) {
                    let resSendData = responseFunc.renderApiErr(res, 0, err.message);
                    res.json(resSendData);
                })

        } catch (err) {
            let resSendData = responseFunc.renderApiData(res, 0, err.message);
            res.json(resSendData);
        }
    }
    //根据openid 更新头像 昵称 unionId
    updateUserAction(req, res, next) {
        console.log('updateUserAction')
        console.log(req.body)
        try {
            let openId = req.body.openId;
            if (_.isEmpty(openId)) {
                throw Error('openId不能为空');
            }
            let encryptedData = req.body.encryptedData;
            if (_.isEmpty(encryptedData)) {
                throw Error('encryptedData不能为空');
            }
            let iv = req.body.iv;
            if (_.isEmpty(iv)) {
                throw Error('iv不能为空');
            }
            let avatar = req.body.avatar;
            let nickname = req.body.nickname;
            let userQuery = userModel.find({
                'openId': openId
            });
            userQuery.exec(function (err, users) {
                if (err) {
                    let resSendData = responseFunc.renderApiErr(res, 0, err.message);
                    res.json(resSendData);
                } else {
                    if (users.length == 0) {
                        let resSendData = responseFunc.renderApiErr(res, 0, "用户不存在");
                        res.json(resSendData);
                    } else if (users.length == 1) {
                        let userData = users[0];
                        let sessionKey = userData.sessionKey;
                        let unionId = "";
                        try {
                            let pc = new WXBizDataCrypt(credentials.miniProgram.appId, sessionKey)
                            let data = pc.decryptData(encryptedData, iv)
                            if (undefined != jsonObj.unionId) {
                                unionId = jsonObj.unionId;
                            }
                        } catch (err) {
                            console.log(err)
                        }
                        userData.avatar = avatar;
                        userData.nickname = nickname;
                        userData.unionId = unionId;
                        userData.save();
                        let resSendData = responseFunc.renderApiData(res, 1, "", userData);
                        res.json(resSendData);
                    } else {
                        let resSendData = responseFunc.renderApiData(res, 0, "用户信息异常");
                        res.json(resSendData);
                    }
                }
            })
        } catch (err) {
            let resSendData = responseFunc.renderApiData(res, 0, err.message);
            res.json(resSendData);
        }
    }


    getUserInfo(req, res, next) {
        console.log(req.body);
        let userId = req.body.userId;
        if (_.isEmpty(userId)) {
            throw Error('userId不能为空');
        }
        let userQuery = userModel.find({
            '_id': userId
        });
        userQuery.exec(function (err, users) {
            if (err) {
                let resSendData = responseFunc.renderApiErr(res, 0, err.message);
                res.json(resSendData);
                return;
            }
            if (users.length == 0) {
                let resSendData = responseFunc.renderApiErr(res, 0, "用户不存在");
                res.json(resSendData);
            } else if (users.length == 1) {
                let userData = users[0];
                let resSendData = responseFunc.renderApiData(res, 1, "", userData);
                res.json(resSendData);
            } else {
                let resSendData = responseFunc.renderApiData(res, 0, "用户信息异常");
                res.json(resSendData);
            }
        });
    }
}

module.exports = new User();