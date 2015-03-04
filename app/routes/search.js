var router = require('express').Router();
var Tag = require('../models/tag');

router.get('/:search([a-z\-0-9]+)', function(req, res)
{
    res.send(
        Tag.getBySearch(req.params.search, 0, 10)
    );
});

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
        Tag.getAll(req.body.search, 0, 10)
    );
});

module.exports = router;