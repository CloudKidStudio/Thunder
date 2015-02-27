module.exports = function(app)
{

    // Add the user to whatever template
    app.use(function(req, res, next)
    {
        res.locals.fullYear = new Date().getFullYear();
        console.log('fullYear ' +     res.locals.fullYear );
        res.locals.bytesToSize = require('../helpers/filesize');
        res.locals.user = req.user;
        next();
    });

    //home is synonym for index, since index is already used
    //as is '/' for index
    app.use('/', require('./home'));

    app.use('/login', require('./login'));
    app.use('/logout', require('./logout'));
    app.use('/register', require('./register'));
    app.use('/sound', require('./sound'));
    app.use('/tag', require('./tag'));
    app.use('/favorites', require('./favorites'));
    app.use('/admin', require('./admin'));

    app.all('*', function(req, res)
    {
        res.status(404).render('404');
    });
};