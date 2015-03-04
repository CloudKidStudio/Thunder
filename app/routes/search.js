var router = require('express').Router();
var Tag = require('../models/tag');

router.post('/', function(req, res)
{
	req.checkBody('search', 'Search terms required').notEmpty();
	var errors = req.validationErrors();
	if (errors)
	{
		res.send(errors);
		return;
	}
	
    res.send(
        Tag.getBySearch(req.body.search, 0, 10)
    );
});

module.exports = router;