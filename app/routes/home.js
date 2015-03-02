var router = require('express').Router();
var Sound = require('../models/sound');
var Category = require('../models/category');
var Pagination = require('../helpers/pagination');

router.get('/:local(page)?/:number([0-9]+)?', function(req, res)
{
	Sound.getTotal(function(err, count)
	{
		var nav = new Pagination('', count, req.params.number);

		res.render('home',
		{
			totalItems: count,
			sounds: Sound.getAll(nav.start, nav.itemsPerPage),
			categories: Category.getAll(),
			message: req.flash('message'),
			pagination: nav.result
		});
	});
});

module.exports = router;