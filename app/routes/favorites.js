var router = require('express').Router();
var Sound = require('../models/sound');
var Category = require('../models/category');
var Pagination = require('../helpers/pagination');
var _ = require('lodash');

router.get('/:page(page)?/:number([0-9]+)?', function(req, res)
{
	var total = req.user.favorites.length;

	var nav = new Pagination(
		'/favorites',
		total, 
		req.params.number
	);

	res.render('favorites',
	{
		sounds: total ? req.user.getFavorites(nav.start, nav.itemsPerPage) : [],
		categories: Category.getAll(),
		pagination: nav.result,
		totals: Sound.getCategoryTotals()
	});
});

router.post('/', function(req, res)
{
	// Download all uncompressed files
	if (req.body.action == "download")
	{
		req.user.getAllFavorites(function(err, sounds)
		{
			if (!sounds)
			{
				res.status(404).render('404');
			}
			else
			{
				var files = [];
				_.each(sounds, function(sound){
					files.push({
						path: './public/sounds/original/' + sound.assetId + '.' + sound.type,
						name: sound.uri + '.' + sound.type
					});
				});
				res.zip(files, 'favorites.zip');
			}
		});
	}
	// Remove all the favorites
	else if (req.body.action == "remove")
	{
		req.user.removeFavorites(function(err)
		{
			res.redirect(req.originalUrl);
		});
	}
	// Toggle a sound in favorites
	else if (req.body.id)
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
	}
});

module.exports = router;