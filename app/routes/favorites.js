var router = require('express').Router();
var Sound = require('../models/sound');
var Category = require('../models/category');

router.get('/', require('../helpers/protected'), function(req, res)
{
    res.render('sounds',
    {
        sounds: req.user.getFavorites(),
        categories: Category.getAll(),
        title: 'Favorites'
    });
});

module.exports = router;