var router = require('express').Router();
var Tag = require('../../models/tag');
var template = 'admin/tags';

router.get('/', function(req, res)
{
	res.render(template, {
		tag: {
			name: "",
			uri: ""
		},
		success: req.flash('success')
	});
});

router.post('/', function(req, res)
{
	req.checkBody('uri', 'URI is required').notEmpty();
	req.checkBody('name', 'Name is required').notEmpty();

	var errors = req.validationErrors();

	var values = {
		uri: req.body.uri,
		name: req.body.name 
	};

	if (errors)
	{
		res.render(template,
		{
			errors: errors,
			tag: values
		});
		return;
	}

	var tag = new Tag(values);

	tag.save(function(err)
	{
		res.render(template,
		{
			success: 'Tag added!',
			tag: {
				name: "",
				uri: ""
			}
		});
	});
});

module.exports = router;