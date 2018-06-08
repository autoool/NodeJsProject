var express = require('express');
var router = express.Router();

router.get('/routeruser', function (req, res) {
    res.send("success");
});

router.get('/:id', function (req, res) {
    console.log(req.params.id);
    res.send('ok');
})

module.exports = router;