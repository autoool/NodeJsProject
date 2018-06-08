var express = require('express');
var router = express.Router();
var httpApi = require('../lib/httpapi');
var credentials = require('../credentials');


router.post('/getOpenId',function(req,res){
	try{
		var code = req.body.code;
		httpApi.getOpenIdFromWechat(code,credentials.miniProgram.appId,
		credentials.miniProgram.appSecret,new function(){
			
		})
	}catch(err){
		res.json({
		code:0,
		message:err.message,
		});
	}
});

module.exports = router;