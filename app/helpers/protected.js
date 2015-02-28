// Function to protect a route
module.exports = function (req, res, next) 
{
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
};