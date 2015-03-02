var router = require('express').Router();
var Tag = require('../models/tag');
var Sound = require('../models/sound');
var Category = require('../models/category');

router.get('/:uri([a-z\-0-9]+)/:page(page)?/:number([0-9]+)?', function(req, res)
{
	Tag.getByUri(req.params.uri, function(err, tag)
	{
		if (!tag)
		{
			res.redirect('/');
		}
		else
		{
			Sound.getTotalByTag(tag._id, function(err, count)
			{
				res.render('tag',
				{
					count: count,
					sounds: Sound.getByTag(tag._id, 0, 20),
					categories: Category.getAll(),
					tag: tag,
					pagination: {}
				});
			});
		}
	});
});

module.exports = router;