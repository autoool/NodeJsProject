var express = require('express');
const formidable = require('formidable'),
    util = require('util'),
    fs = require('fs');
var utils = require('../lib/util');
var httpApi = require('../lib/httpapi');
const responseFunc = require('../lib/responseFunc');
var credentials = require('../credentials');
var router = express.Router();
var AVATAR_UPLOAD_FOLDER = '/avatar/';

router.post('/upload', function (req, res, next) {
    let form = new formidable.IncomingForm();
    form.encoding = 'utf-8';		//设置编辑
    form.keepExtensions = true;	 //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
    form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER;
    form.parse(req, function (err, fields, files) {
        if (err) {
            let resSendData = responseFunc.renderApiErr(res, 0, err.message);
            res.json(resSendData);
            return;
        }
        var extName = "";
        switch (files.file.type) {
            case 'image/pjpeg':
            case 'image/jpeg':
                extName = '.jpg';
                break
            case 'image/png':
            case 'image/x-png':
                extName = '.png';
                break                
        }
        if(extName.length==0){
            let resSendData = responseFunc.renderApiErr(res, 0, '只支持png和jpg格式图片');
            res.json(resSendData);
            return;
        }
        var avatarName = Math.random() + extName;
        var newPath = form.uploadDir + avatarName;
        try {
            fs.renameSync(files.file.path, newPath)
        } catch (err) {
            let resSendData = responseFunc.renderApiErr(res, 0, err.message);
            res.json(resSendData);
            return;
        }
        var imageUrl = "http://localhost:3000"+AVATAR_UPLOAD_FOLDER+avatarName;
        let resSendData = responseFunc.renderApiData(res, 1, '', imageUrl);
        res.json(resSendData);
    });
})


module.exports = router;