var router = require('express').Router();
var Tag = require('../models/tag');
var Sound = require('../models/sound');
var Category = require('../models/category');
var Pagination = require('../helpers/pagination');

router.get('/:uri([a-z\-0-9]+)/:page(page)?/:number([0-9]+)?', function(req, res)
{
	Tag.getByUri(req.params.uri, function(err, tag)
	{
		if (!tag)
		{
			res.status(404).render('404');
		}
		else
		{
			Sound.getTotalByTag(tag._id, function(err, count)
			{
				var nav = new Pagination(
					'/tag/' + tag.uri, 
					count, 
					req.params.number
				);

				res.render('tag',
				{
					count: count,
					sounds: Sound.getByTag(tag._id, nav.start, nav.itemsPerPage),
					categories: Category.getAll(),
					tag: tag,
					pagination: nav.result,
					totals: Sound.getCategoryTotals()
				});
			});
		}
	});
});

module.exports = router;