var router = require('express').Router(),
    passport = require('passport'),
    isAnonymous = require('../helpers/access').isAnonymous;

router.get('/', isAnonymous, function(req, res)
{
    res.render('register',
    {
        message: req.flash('message')
    });
});

router.post('/', isAnonymous, passport.authenticate('register',
{
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash: true
}));

module.exports = router;