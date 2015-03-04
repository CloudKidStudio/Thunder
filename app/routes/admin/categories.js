var router = require('express').Router();
var Category = require('../../models/category');
var Sound = require('../../models/sound');

var template = 'admin/categories';

router.get('/', function(req, res)
{
	res.render(template, 
	{
		categories: Category.getAllEditable(),
		success: req.flash('success'),
		category: {
			name: "",
			uri: ""
		}
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
			categories: Category.getAllEditable(),
			category: values
		});
		return;
	}

	var category = new Category(values);

	category.save(function(err)
	{
		res.render(template,
		{
			success: 'Category added!',
			categories: Category.getAllEditable(),
			category: {
				name: "",
				uri: ""
			}
		});
	});
});

module.exports = router;