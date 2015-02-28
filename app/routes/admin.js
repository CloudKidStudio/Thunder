var router = require('express').Router();

router.get('/', require('../helpers/protected'), function(req, res)
{
    res.render('admin');
});

module.exports = router;