var router = require('express').Router();

router.get('/', function(req, res)
{
    res.render('tag',
    {
        test: 100,
        sounds: [
            1,
            2,
            3,
            4
        ]
    });
});

router.get('/:id([a-z\-0-9]+)', function(req, res)
{
    res.render('tag',
    {
        test: req.params.id,
        sounds: [
        {
            name: "eample",
            ogg: "",
            mp3: "",

        }]
    });
});

module.exports = router;