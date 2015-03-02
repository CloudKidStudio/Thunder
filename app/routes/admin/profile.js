var router = require('express').Router();

router.get('/', function(req, res)
{
	render(res);
});

router.post('/', function(req, res)
{
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('username', 'Username is required').notEmpty().isAlpha();
	req.checkBody('email', 'Email needs to be valid email address').isEmail();
	var errors = req.validationErrors();
	
	if (errors)
	{
		render(res, errors);
		return;
	}
	
	req.user.update({
		name: req.body.name,
		username: req.body.username,
		email: req.body.email
	}, function(err, user)
	{
		render(res, null, 'Profile saved!');
	});
});

function render(res, errors, success)
{
	res.render('admin/profile', {
		errors: errors || [], 
		success: success || null
	});
}

module.exports = router;