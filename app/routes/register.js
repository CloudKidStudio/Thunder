var router = require('express').Router(),
    passport = require('passport');

router.get('/', function(req, res)
{
    res.render('register',
    {
        error: req.flash('error')
    });
});

router.post('/', passport.authenticate('register',
{
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash: true
}));

module.exports = router;