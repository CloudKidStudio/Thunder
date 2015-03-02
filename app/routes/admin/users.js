var router = require('express').Router();

router.get('/', function(req, res)
{
	res.render('admin/users');
});

module.exports = router;