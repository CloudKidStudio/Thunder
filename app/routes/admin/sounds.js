var router = require('express').Router();
var Category = require('../../models/category');

router.get('/', function(req, res)
{
	res.render('admin/sounds',
	{
		categories: Category.getAll()
	});
});

module.exports = router;