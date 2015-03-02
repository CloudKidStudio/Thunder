var router = require('express').Router();
var Sound = require('../models/sound');
var Category = require('../models/category');

router.get('/:uri([a-z\-0-9]+)/:page(page)?/:number([0-9]+)?', function(req, res)
{
    Category.getByUri(req.params.uri, function(err, category)
    {
        if (!category || !category.total)
        {
            res.redirect('/');
        }
        else
        {
            res.render('category',
            {
                sounds: Sound.getByCategory(category._id, 0, 20),
                categories: Category.getAll(),
                category: category, 
                count: category.total,
                pagination: {}
            });
        }
    });
});

module.exports = router;