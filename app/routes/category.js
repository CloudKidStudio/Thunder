var router = require('express').Router();
var Sound = require('../models/sound');
var Category = require('../models/category');
var Pagination = require('../helpers/pagination');

router.get('/:uri([a-z\-0-9]+)/:page(page)?/:number([0-9]+)?', function(req, res)
{
    Category.getByUri(req.params.uri, function(err, category)
    {
        if (!category || !category.total)
        {
            res.status(404).render('404');
        }
        else
        {
            var nav = new Pagination(
                '/category/' + category.uri, 
                category.total, 
                req.params.number
            );

            res.render('category',
            {
                sounds: Sound.getByCategory(category._id, nav.start, nav.itemsPerPage),
                categories: Category.getAll(),
                category: category,
                pagination: nav.result,
                totals: Sound.getCategoryTotals()
            });
        }
    });
});

module.exports = router;