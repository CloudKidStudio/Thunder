var router = require('express').Router();

router.get('/:id([a-z\-0-9]+)', function(req, res)
{
    res.locals.bytesToSize = require('../helpers/filesize');
    res.render('index',
    {
        sounds: [
        {
            name: "something?",
            bytes: 30202,
            type: 'mp3',
            uri: 'adfa',
            tags: []
        }]
    });
});

module.exports = router;