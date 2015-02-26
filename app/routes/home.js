var router = require('express').Router();

// '/' is the index page
router.get('/', function(req, res)
{
    var sound = require('../models/sound');
    var category = require('../models/category');
    var tag = require('../models/tag');

    // add references to functions necessary for each
    // .jade file by attaching them to res.locals
    res.locals.bytesToSize = require('../helpers/filesize');

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //    Sounds!
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    sound.find()
        .populate('category tags')
        .skip(0)
        .limit(20)
        .exec(function(err, soundFindResults)
        {
            category.find()
                .exec(function(err, categoryFindResults)
                {
                    res.render('index',
                    {
                        soundFindResults:soundFindResults,
                        categoryFindResults: categoryFindResults
                    });
                });

        });
});

module.exports = router;