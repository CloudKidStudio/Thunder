var router = require('express').Router();
var Sound = require('../models/sound');
var Category = require('../models/category');

// Notice the "|":
// routes for page/# and THEN just the '/' (the index)
router.get('/:local(page)?/:number([0-9]+)?', function(req, res)
{
    //console.log('req.params.number '.green + req.params.number);
    // pagination vars as object to send 
    // through to the pagination html 
    var itemsPerPage = 20;

    Sound.getTotal(function(err, count)
    {
        var total = Math.ceil(count / itemsPerPage);
        var current = parseInt(req.params.number) || 1;
        if (current > total)
            current = total;
        var start = (current - 1) * itemsPerPage;
        
        res.render('home',
        {
            totalItems: count,
            sounds: Sound.getAll(start, itemsPerPage),
            categories: Category.getAll(),
            message: req.flash('message'),
            pagination:
            {
                current: current,
                total: total
            }
        });
    });
});

module.exports = router;