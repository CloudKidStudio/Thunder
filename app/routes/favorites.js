var router = require('express').Router();
var Sound = require('../models/sound');
var Category = require('../models/category');
var isAuthenticated = require('../helpers/access').isAuthenticated;

router.get('/:page(page)?/:number([0-9]+)?', isAuthenticated, function(req, res)
{
	req.user.getTotalFavorites(function(err, count)
	{
		res.render('favorites',
		{
			sounds: req.user.getFavorites(0, 20),
			categories: Category.getAll(),
			count: count,
			pagination: {}
		});
	});
});

router.post('/', isAuthenticated, function(req, res)
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