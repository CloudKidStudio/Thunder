var router = require('express').Router();
var Sound = require('../models/sound');
var Category = require('../models/category');
var Pagination = require('../helpers/pagination');

router.get('/:page(page)?/:number([0-9]+)?', function(req, res)
{
	var nav = new Pagination(
		'/favorites',
		req.user.favorites.length, 
		req.params.number
	);

	res.render('favorites',
	{
		sounds: req.user.getFavorites(nav.start, nav.itemsPerPage),
		categories: Category.getAll(),
		pagination: nav.result
	});
});

router.post('/', function(req, res)
{
	req.user.toggleFavorite(req.body.id, function(err, user)
	{
		if (err)
		{
			res.send(
			{
				success: false,
				error: err
			});
		}
		else
		{
			res.send(
			{
				success: true
			});
		}
	});
});

module.exports = router;