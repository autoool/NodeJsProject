var express = require('express');
var router = express.Router();

router.all('/list',function(req,res){
	console.log(req.method);
	console.log(req.baseUrl);
	console.log(req.path);
	console.log(req.headers['user-agent']);
	console.log(req.get['user-agent']);
	console.log(req.query);
	console.log(req.query.id);
	console.log(req.body);
	console.log(req.body.id);


	res.send('list hello');
});

router.get('/:id',function(req,res){
	console.log(req.params.id);
	res.send('ok');
})

module.exports = router;
	
