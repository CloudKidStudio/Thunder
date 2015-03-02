var router = require('express').Router();

router.get('/', function(req, res)
{
	render(res);
});

router.post('/', function(req, res)
{
	req.checkBody('oldPassword', 'Current Password is required.').notEmpty();
	req.checkBody('newPassword', 'New Password is required.').notEmpty();
	req.checkBody('repeatPassword', 'Repeat Password must be equal to New Password.')
		.equals(req.body.newPassword);

	var errors = req.validationErrors();
	
	if (errors)
	{
		render(res, errors);
		return;
	}
	render(res, null, 'Password updated!');
});

function render(res, errors, success)
{
	res.render('admin/password', {
		errors: errors || [],
		success: success || null
	});
}

module.exports = router;