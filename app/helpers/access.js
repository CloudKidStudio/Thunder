var privileges = {
	subscriber: 0,
	editor: 1,
	admin: 2  
};

module.exports = {

	// User privileges
	privileges: privileges,

	// If the user is logged in
	isAuthenticated : function(req, res, next) 
	{
		if (req.isAuthenticated())
			return next();
		req.flash('redirect', req.originalUrl);
		res.redirect('/login');
	},

	// Access function if user is not logged in
	isAnonymous: function(req, res, next)
	{
		if (!req.isAuthenticated())
			return next();
		res.redirect('/');
	},

	// Access function if user is logged in is admin
	isAdmin: function(req, res, next)
	{
		if (req.isAuthenticated() && req.user.privilege == privileges.admin)
			return next();
		req.flash('redirect', req.originalUrl);
		res.redirect('/login');
	},

	// Access function if user logged in is Editor
	isEditor: function(req, res, next)
	{
		if (req.isAuthenticated() && req.user.privilege >= privileges.editor)
			return next();
		req.flash('redirect', req.originalUrl);
		res.redirect('/login');
	}
};