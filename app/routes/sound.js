var router = require('express').Router();
var Sound = require('../models/sound');
var Category = require('../models/category');

router.get('/:uri([a-z\-0-9]+)', function(req, res)
{
	res.render('sound',
	{
		sound: Sound.getByUri(req.params.uri),
		categories: Category.getAll()
	});
});

module.exports = router;