var router = require('express').Router();
var User = require('../../models/user');
var template = 'admin/users-edit';

router.post('/', function(req, res)
{
	if (req.body.user)
	{
		res.render(template, 
		{
			userEdit: User.findById(req.body.user)
		});
	}
	else if (req.body.id)
	{
		if (req.body.action == "delete")
		{
			// Remove user
			User.remove({_id: req.body.id}, function(err)
			{
				req.flash('success', 'Successfully removed user');
				res.redirect('/admin/users');
			});
		}
		else
		{
			req.checkBody('email', 'Email is required').isEmail().notEmpty();
			req.checkBody('name', 'Name is required').notEmpty();
			req.checkBody('username', 'Username is required').isAlpha();
			req.checkBody('privilege', 'Privilege is invalid').isNumeric();

			var errors = req.validationErrors();
		
			if (errors)
			{
				res.render(template,
				{
					errors: errors,
					userEdit: User.findById(req.body.id)
				});
				return;
			}

			var values = {
				email: req.body.email,
				name: req.body.name,
				privilege: req.body.privilege,
				username: req.body.username
			};

			if (req.body.password)
			{
				values.password = req.body.password;
			}

			User.update({_id: req.body.id}, values, function(err, tag)
			{
				res.render(template,
				{
					success: 'User has been updated',
					userEdit: User.findById(req.body.id)
				});
			});
		}
	}
});

module.exports = router;