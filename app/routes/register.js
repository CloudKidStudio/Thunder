var router = require('express').Router(),
    passport = require('passport');

router.get('/', function(req, res){
    res.render('register', {message: req.flash('message')});
});

router.post('/', passport.authenticate('register', {
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash: true
}));

module.exports = router;