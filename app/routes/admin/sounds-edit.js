var router = require('express').Router();
var Sound = require('../../models/sound');
var Category = require('../../models/category');
var template = 'admin/sounds-edit';

router.post('/', function(req, res)
{
	if (req.body.sound)
	{
		res.render(template, 
		{
			sound: Sound.findById(req.body.sound),
			categories: Category.getAll()
		});
	}
	else if (req.body.id)
	{
		if (req.body.action == "delete")
		{
			// Remove sound
			Sound.remove({ _id: req.body.sound }, function(err)
			{
				req.flash('success', 'Successfully removed sound');
				res.redirect('/admin/sounds');
			});
		}
		else
		{
			req.checkBody('uri', 'URI is required').notEmpty();
			req.checkBody('name', 'Name is required').notEmpty();
			req.checkBody('category', 'Category is required').notEmpty();

			var errors = req.validationErrors();
		
			if (errors)
			{
				res.render(template,
				{
					errors: errors,
					sound: Sound.findById(req.body.id),
					categories: Category.getAll()
				});
				return;
			}

			Sound.update({_id: req.body.id}, 
			{
				uri: req.body.uri,
				name: req.body.name,
				category: req.body.category
			}, 
			function(err, tag)
			{
				res.render(template,
				{
					success: 'Tag has been updated',
					sound: Sound.findById(req.body.id),
					categories: Category.getAll()
				});
			});
		}
	}
});

module.exports = router;