var router = require('express').Router();
var Category = require('../../models/category');
var Sound = require('../../models/sound');
var async = require('async');

var template = 'admin/categories-edit';

router.post('/', function(req, res)
{
	if (req.body.category)
	{
		res.render(template, 
		{
			category: Category.getById(req.body.category)
		});
	}
	else if (req.body.id)
	{
		if (req.body.action == "delete")
		{
			async.waterfall([
					// Get the empty category
					function(done)
					{
						Category.getEmpty(done);
					},
					// Replace all categories with the new one
					function(category, done)
					{
						Sound.replaceCategory(req.body.id, category._id, function(err)
						{
							done(err);
						});
					},
					// Remove category
					function(done)
					{
						Category.remove({_id: req.body.id}, done);
					}
				], 
				function(err)
				{
					req.flash('success', 'Successfully removed category');
					res.redirect('/admin/categories');
				}
			);
		}
		else
		{
			req.checkBody('uri', 'URI is required').notEmpty();
			req.checkBody('name', 'Name is required').notEmpty();

			var errors = req.validationErrors();
		
			if (errors)
			{
				res.render(template,
				{
					errors: errors,
					category: Category.getById(req.body.id)
				});
				return;
			}

			Category.update({_id: req.body.id}, 
			{
				uri: req.body.uri,
				name: req.body.name
			}, 
			function(err, category)
			{
				res.render(template,
				{
					success: 'Category has been updated',
					category: Category.getById(req.body.id)
				});
			});
		}
	}
});

module.exports = router;