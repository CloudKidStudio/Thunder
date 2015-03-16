module.exports = function(app)
{
	var access = require('../helpers/access');

	// Add the user to whatever template
	app.use(function(req, res, next)
	{
		res.locals.fullYear = new Date().getFullYear();
		res.locals.bytesToSize = require('../helpers/filesize');
		res.locals.user = req.user;
		res.locals.url = req.originalUrl;
		res.locals.uploadSuccess = req.flash('uploadSuccess');
		res.locals.uploadError = req.flash('uploadError');
		res.locals.isActive = function(url, undefined)
		{
			return url == req.originalUrl ? 'active' : undefined;
		};
		res.locals.privilege = access.privileges;
		next();
	});

	//home is synonym for index, since index is already used
	//as is '/' for index
	app.use('/', require('./home'));

	app.use('/download', require('./download'));
	app.use('/login', access.isAnonymous, require('./login'));
	app.use('/logout', require('./logout'));
	app.use('/register', access.isAnonymous, require('./register'));
	app.use('/forgot', access.isAnonymous, require('./forgot'));
	app.use('/reset', access.isAnonymous, require('./reset'));
	app.use('/sound', require('./sound'));
	app.use('/tag', require('./tag'));
	app.use('/favorites', access.isAuthenticated, require('./favorites'));
	app.use('/category', require('./category'));
	app.use('/search', require('./search'));
	app.use('/upload', access.isEditor, require('./upload'));
	app.use('/admin/profile', access.isAuthenticated, require('./admin/profile'));
	app.use('/admin/password', access.isAuthenticated, require('./admin/password'));
	app.use('/admin/sound', access.isEditor, require('./admin/sound'));
	app.use('/admin/categories', access.isEditor, require('./admin/categories'));
	app.use('/admin/categories/edit', access.isEditor, require('./admin/categories-edit'));
	app.use('/admin/tags', access.isEditor, require('./admin/tags'));
	app.use('/admin/tags/edit', access.isEditor, require('./admin/tags-edit'));
	app.use('/admin/users', access.isAdmin, require('./admin/users'));
	app.use('/admin/users/edit', access.isAdmin, require('./admin/users-edit'));

	app.all('*', function(req, res)
	{
		res.status(404).render('404');
	});
};