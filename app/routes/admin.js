var router = require('express').Router();
var access = require('../helpers/access');

router.get('/', access.isAuthenticated, function(req, res)
{
    res.render('admin');
});

module.exports = router;