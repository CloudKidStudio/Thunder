var router = require('express').Router();
var fs = require('fs');

router.get('*', function(req, res)
{
    res.render('install');
});

router.post('*', function(req, res)
{
    req.checkBody('db', 'Database must be a valid URL end-point').notEmpty();
    req.checkBody('secret', 'Secret is required').notEmpty();
    req.checkBody('gmailUser', 'Gmail user must be a full email address').isEmail();
    req.checkBody('gmailPassword', 'Gmail password is required').notEmpty();

    var errors = req.validationErrors();
    
    if (errors)
    {
        return res.render('install', { errors: errors });
    }

    var data = "module.exports = " + JSON.stringify(req.body, null, "\t") + ";";
    fs.writeFile('./config/settings.js', data, function()
    {
        res.render('install',
        {
            completed: true
        });
    });
});

module.exports = router;