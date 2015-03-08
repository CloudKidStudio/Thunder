var router = require('express').Router();
var fs = require('fs');

router.get('*', function(req, res)
{
    res.render('install', {
        title: 'Installation',
        completed: fs.existsSync('../.env')
    });
});

router.post('*', function(req, res)
{
    req.checkBody('port', 'Port must be a valid number').isInt();
    req.checkBody('mongoDatabase', 'Database must be a valid URL end-point').notEmpty();
    req.checkBody('secretKey', 'Secret is required').notEmpty();
    req.checkBody('gmailUser', 'Gmail user must be a full email address').isEmail();
    req.checkBody('gmailPassword', 'Gmail password is required').notEmpty();

    var errors = req.validationErrors();
    
    if (errors)
    {
        return res.render('install', { errors: errors });
    }

    var env = "PORT=" + req.body.port + "\n" +
        "MONGO_DATABASE=" + req.body.mongoDatabase + "\n" +
        "SECRET_KEY=" + req.body.secretKey + "\n" +
        "GMAIL_USER=" + req.body.gmailUser + "\n" +
        "GMAIL_PASSWORD=" + req.body.gmailPassword;

    fs.writeFile('../.env', env, function()
    {
        res.render('install', { completed: true });
    });
});

module.exports = router;