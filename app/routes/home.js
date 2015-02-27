var router = require('express').Router();
var Sound = require('../models/sound');
var Category = require('../models/category');

// '/' is the index page
router.get('/', function(req, res)
{
    // add references to functions necessary for each
    // .jade file by attaching them to res.locals
    res.locals.bytesToSize = require('../helpers/filesize');

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //    Sounds!
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Sound.find()
        .populate('category tags')
        .skip(0)
        .limit(20)
        .exec(function(err, sounds)
        {
            Category.find()
                .exec(function(err, categories)
                {
                    res.render('index',
                    {
                        soundFindResults: sounds,
                        categoryFindResults: categories,
                        message: req.flash('message')
                    });
                });
        });
});

module.exports = router;