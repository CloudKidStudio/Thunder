var router = require('express').Router(),
    passport = require('passport');

router.post('/', passport.authenticate('login',
{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/', function(req, res)
{
    res.render('login',
    {
        message: req.flash('message')
    });
});

module.exports = router;