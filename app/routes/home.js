var router = require('express').Router();
var Sound = require('../models/sound');
var Category = require('../models/category');

// '/' is the index page
router.get('/', function(req, res)
{
    // pagination vars 
    var pageStart = 0;
    var itemsPerPage = 20;

    Sound.getTotal(function(err, count)
    {
        res.render('home', 
        {
            totalItems: count,
            sounds: Sound.getAll(pageStart, itemsPerPage),
            categories: Category.getAll(),
            message: req.flash('message')
        });
    });
});

module.exports = router;