var router = require('express').Router();
var Sound = require('../models/sound');
var Category = require('../models/category');

// '/' is the index page
router.get('/', function(req, res)
{
    /**
     * Will populate one Category schema is finished
     * @param {Array} categories
     */
    var categories = null;
    Category.find()
        .exec(function(err, foundCategories)
        {
            categories = foundCategories;
            findSounds();
        });

    function findSounds()
    {
        // pagination vars 
        var pageStart = 0;
        var totalItems = null;
        var itemsPerPage = 20;

        // Find all items for the Sound schema
        var query = Sound.find();

        if (totalItems === null)
        {
            // Get the count of the items so we can store for 
            // lazy loading or pagination purposes.
            query.find().count(function(err, count)
            {
                if (err)
                {
                    console.log((err).red);
                }
                else
                {
                    totalItems = count;
                    console.log(('totalItems ' + totalItems).green);
                }
            });
        }

        // The query that will actually display.
        query.find()
            .skip(pageStart)
            .limit(itemsPerPage)
            .populate('category tags')
            .exec(function(err, sounds)
            {
                res.render('index',
                {
                    totalItems: totalItems,
                    sounds: sounds,
                    categories: categories,
                    message: req.flash('message')
                });
            });
    }
});

module.exports = router;