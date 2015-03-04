var router = require('express').Router();
var Sound = require('../models/sound');
var Category = require('../models/category');

router.get('/:uri([a-z\-0-9]+)', function(req, res)
{
	Sound.getByUri(req.params.uri, function(err, sound)
	{
		if (!sound)
		{
			res.status(404).render('404');
		}
		else
		{
			res.render('sound',
			{
				sound: sound,
				categories: Category.getAll(),
				totals: Sound.getCategoryTotals()
			});
		}
	});
});

module.exports = router;