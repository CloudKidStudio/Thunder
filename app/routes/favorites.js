var router = require('express').Router();
var Sound = require('../models/sound');
var Category = require('../models/category');

router.get('/:page(page)?/:number([0-9]+)?', function(req, res)
{
	res.render('favorites',
	{
		sounds: req.user.getFavorites(0, 20),
		categories: Category.getAll(),
		count: req.user.favorites.length,
		pagination: {}
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