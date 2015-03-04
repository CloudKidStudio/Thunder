var router = require('express').Router();
var User = require('../../models/user'),
    passport = require('passport');

router.get('/', function(req, res)
{
	res.render('admin/users',
	{
		users: User.getAll(req.user._id)
	});
});

router.post('/', passport.authenticate('register',
{
    successRedirect: '/admin/users',
    failureRedirect: '/admin/users',
    failureFlash: true
}));

module.exports = router;