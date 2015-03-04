var router = require('express').Router();
var Tag = require('../../models/tag');
var Sound = require('../../models/sound');
var template = 'admin/tags-edit';

router.post('/', function(req, res)
{
	if (req.body.tag)
	{
		res.render(template, 
		{
			tag: Tag.getById(req.body.tag)
		});
	}
	else if (req.body.id)
	{
		if (req.body.action == "delete")
		{
			// Remove all tags
			Sound.removeTag(req.body.tag, function(err)
			{
				// Remove tag
				Tag.remove({_id: req.body.id}, function(err)
				{
					req.flash('success', 'Successfully removed tag');
					res.redirect('/admin/tags');
				});
			});
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
					tag: Tag.getById(req.body.id)
				});
				return;
			}

			Tag.update({_id: req.body.id}, 
			{
				uri: req.body.uri,
				name: req.body.name
			}, 
			function(err, tag)
			{
				res.render(template,
				{
					success: 'Tag has been updated',
					tag: Tag.getById(req.body.id)
				});
			});
		}
	}
});

module.exports = router;