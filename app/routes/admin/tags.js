var router = require('express').Router();

router.get('/', function(req, res)
{
	res.render('admin/tags');
});

module.exports = router;