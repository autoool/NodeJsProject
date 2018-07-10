var express = require('express');
var router = express.Router();
var utils = require('../lib/util');
var userModel = require('../models/user');
var httpApi = require('../lib/httpapi');
var credentials = require('../credentials');
const User= require('../controller/UserController');

router.post('/getOpenId',User.getOpenIdAction);

router.post('/updateUser',User.updateUserAction);

router.post('/getUserInfo',User.getUserInfo);

router.post('sendMessage',function(req,res){
	var openId = req.body.openId;
	var formId = req.body.formId;
	try{
		if(utils.isEmpty(req.body.openId)){
			throw Error("openId不能为空");
		}
		if(utils.isEmpty(req.body.formId)){
			throw Error("formId不能为空");
		}	
		httpApi.sendMessageMP(openId,formId)
		.then(function(response){
	
		}).catch(function(err){
	
		})
	}catch(err){

	}
	
})

router.post('/getOpenId', function (req, res) {
	try {
		var code = req.body.code;
		httpApi.getOpenIdFromWechat(code,
			credentials.miniProgram.appId,
			credentials.miniProgram.appSecret,
			function (err) {
				throw err;
			},
			function (response) {
				var result = {
					sessionKey: response.session_key,
					openId: response.openid
				};
				res.json({
					code: 1,
					data: result
				});
			});
	} catch (err) {
		res.json({
			code: 0,
			message: err.message,
		});
	}
});

module.exports = router;