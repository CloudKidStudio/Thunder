module.exports = function(app)
{
    // Add the user to whatever template
    app.use(function(req, res, next) {
        res.locals.user = req.user;
        next();
    });

    //home is synonym for index, since index is already used
    app.use('/', require('./home'));
    app.use('/login', require('./login'));
    app.use('/logout', require('./logout'));
    app.use('/register', require('./register'));
    app.use('/tag', require('./tag'));
    app.all('*', function(req, res)
    {
        res.status(404).render('404');
    });
};