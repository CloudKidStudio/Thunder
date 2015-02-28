var router = require('express').Router();
var Sound = require('../models/sound');
var Category = require('../models/category');

router.get('/:uri([a-z\-0-9]+)', function(req, res)
{
    Category.getByUri(req.params.uri, function(err, category)
    {
        if (!category || !category.total)
        {
            res.redirect('/');
        }
        else
        {
            res.render('sounds',
            {
                sounds: Sound.getByCategory(category._id),
                categories: Category.getAll(),
                title: 'Sounds » ' + category.name
            });
        }
    });
});

module.exports = router;