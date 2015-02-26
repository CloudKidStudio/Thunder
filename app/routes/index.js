module.exports = function(app)
{
    //home is synonym for index, since index is already used
    app.use('/', require('./home'));
    app.use('/tag', require('./tag'));
    app.all('*', function(req, res)
    {
        res.status(404).render('404');
    });
};

/*
var ex = {
    _id: 54e f4ac1145fd3ea20ad8b02,
    name: 'Alert 1',
    uri: 'alert-1',
    assetId: '8e0c3d269a240c67057c2de039cd075a',
    type: 'aif',
    category:
    {
        _id: 54e f4ac1145fd3ea20ad898c,
        name: 'Alerts',
        uri: 'alerts',
        total: 191,
        created: Sat Feb 01 2014 17: 02: 32 GMT - 0500(EST),
        __v: 0
    },
    size: 3539044,
    created: Sat Feb 01 2014 17: 02: 32 GMT - 0500(EST),
    __v: 0,
    tags: [
    {
        _id: 54e f4ac1145fd3ea20ad899d,
        name: 'counter clock',
        uri: 'counter-clock',
        __v: 0
    },
    {
        _id: 54e f4ac1145fd3ea20ad899e,
        name: 'high tech',
        uri: 'high-tech',
        __v: 0
    },
    {
        _id: 54e f4ac1145fd3ea20ad899f,
        name: 'digital',
        uri: 'digital',
        __v: 0
    }]
};
*/