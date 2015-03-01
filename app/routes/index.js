module.exports = function(app)
{
    // Add the user to whatever template
    app.use(function(req, res, next)
    {
        res.locals.fullYear = new Date().getFullYear();
        res.locals.bytesToSize = require('../helpers/filesize');
        res.locals.user = req.user;
        res.locals.privilege = {
            subscriber: 0,
            editor: 1,
            admin: 2  
        };
        next();
    });

    //home is synonym for index, since index is already used
    //as is '/' for index
    app.use('/', require('./home'));

    app.use('/download', require('./download'));
    app.use('/login', require('./login'));
    app.use('/logout', require('./logout'));
    app.use('/register', require('./register'));
    app.use('/sound', require('./sound'));
    app.use('/tag', require('./tag'));
    app.use('/favorites', require('./favorites'));
    app.use('/category', require('./category'));
    app.use('/admin', require('./admin'));

    app.all('*', function(req, res)
    {
        res.status(404).render('404');
    });
};