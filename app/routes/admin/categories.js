var router = require('express').Router();

router.get('/', function(req, res)
{
	res.render('admin/categories');
});

module.exports = router;