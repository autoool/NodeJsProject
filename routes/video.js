var express = require('express');
var router = express.Router();
const Video= require('../controller/server/VideoController');

router.post('/insert',Video.insertVideo);

router.post('/update',Video.updateVideo);

router.post('/getVideosPage',Video.getVideosPage);

module.exports = router;