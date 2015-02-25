module.exports = function(app)
{
	app.use('/', require('./home'));
	app.all('*', function(req, res){
		res.status(404).render('404');
	});
};