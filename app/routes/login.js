var router = require('express').Router(),
    passport = require('passport'),
    isAnonymous = require('../helpers/access').isAnonymous;

router.post('/', isAnonymous, passport.authenticate('login',
{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/', isAnonymous, function(req, res)
{
    res.render('login',
    {
        message: req.flash('message')
    });
});

module.exports = router;