var router = require('express').Router();
var Tag = require('../models/tag');
var Sound = require('../models/sound');
var Category = require('../models/category');

router.get('/:uri([a-z\-0-9]+)', function(req, res)
{
    Tag.getByUri(req.params.uri, function(err, tag)
    {
        if (!tag)
        {
            res.redirect('/');
        }
        else
        {
            res.render('sounds',
            {
                sounds: Sound.getByTag(tag._id),
                categories: Category.getAll(),
                title: 'Sounds » #' + tag.name
            });
        }
    });
});

module.exports = router;