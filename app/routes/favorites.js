var router = require('express').Router();

router.get('/', function(req, res)
{
    res.locals.bytesToSize = require('../helpers/filesize');
    res.render('index',
    {
        sounds: [
        {
            name: "favorite 1",
            bytes: 30202,
            type: 'mp3',
            uri: 'adfa',
            tags: []
        },
        {
            name: "favorite 2",
            bytes: 30202,
            type: 'mp3',
            uri: 'adfa',
            tags: []
        }]
    });
});

module.exports = router;