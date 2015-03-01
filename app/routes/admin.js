var router = require('express').Router();
var access = require('../helpers/access');

router.get('/sounds', access.isEditor, function(req, res)
{
	res.render('admin/sounds');
});

router.get('/categories', access.isEditor, function(req, res)
{
	res.render('admin/categories');
});

router.get('/tags', access.isEditor, function(req, res)
{
	res.render('admin/tags');
});

router.get('/users', access.isAdmin, function(req, res)
{
	res.render('admin/users');
});

router.get('/profile', access.isAuthenticated, function(req, res)
{
	res.render('admin/profile');
});

module.exports = router;