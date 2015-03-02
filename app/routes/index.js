module.exports = function(app)
{
	// Add the user to whatever template
	app.use(function(req, res, next)
	{
		res.locals.fullYear = new Date().getFullYear();
		res.locals.bytesToSize = require('../helpers/filesize');
		res.locals.user = req.user;
		res.locals.isActive = function(url, undefined)
		{
			return url == req.originalUrl ? 'active' : undefined;
		};
		res.locals.privilege = {
			subscriber: 0,
			editor: 1,
			admin: 2  
		};
		next();
	});

	var access = require('../helpers/access');

	//home is synonym for index, since index is already used
	//as is '/' for index
	app.use('/', require('./home'));

	app.use('/download', require('./download'));
	app.use('/login', access.isAnonymous, require('./login'));
	app.use('/logout', require('./logout'));
	app.use('/register', access.isAnonymous, require('./register'));
	app.use('/sound', require('./sound'));
	app.use('/tag', require('./tag'));
	app.use('/favorites', access.isAuthenticated, require('./favorites'));
	app.use('/category', require('./category'));
	app.use('/admin/profile', access.isAuthenticated, require('./admin/profile'));
	app.use('/admin/password', access.isAuthenticated, require('./admin/password'));
	app.use('/admin/sounds', access.isEditor, require('./admin/sounds'));
	app.use('/admin/categories', access.isEditor, require('./admin/categories'));
	app.use('/admin/tags', access.isEditor, require('./admin/tags'));
	app.use('/admin/users', access.isAdmin, require('./admin/users'));

	app.all('*', function(req, res)
	{
		res.status(404).render('404');
	});
};