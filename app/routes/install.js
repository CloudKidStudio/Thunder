var router = require('express').Router();
var fs = require('fs');
var _ = require('lodash');
var bash = require('bash-vars');

router.get('*',  function(req, res, next)
{
	if (process.env.MONGO_DATABASE)
		return next();

	res.render('install', {
		port: process.env.PORT || 3000
	});
});

router.post('*', function(req, res, next)
{
	if (process.env.MONGO_DATABASE)
		return next();

	req.checkBody('port', 'Port must be a valid number').isInt();
	req.checkBody('mongoDatabase', 'Database must be a valid URL end-point').notEmpty();
	req.checkBody('secretKey', 'Secret is required').notEmpty();
	req.checkBody('gmailUser', 'Gmail user must be a full email address').isEmail();
	req.checkBody('gmailPassword', 'Gmail password is required').notEmpty();

	var errors = req.validationErrors();
	
	if (errors)
	{
		return res.render('install', {
			errors: errors,
			port: process.env.PORT || 3000
		});
	}

	var env = {
		PORT: req.body.port,
		MONGO_DATABASE: req.body.mongoDatabase,
		SECRET_KEY: req.body.secretKey,
		GMAIL_USER: req.body.gmailUser,
		GMAIL_PASSWORD: req.body.gmailPassword
	};

	// Save the environmental variables this will
	// be later loaded by dotenv, but for not we'll
	// redirect back home
	fs.writeFile('../.env', bash.stringify(env), function()
	{
		res.redirect('/');

		// Manually add the site envonmental variables
		_.extend(process.env, env);

		// Finish bootstrapping connection
		require('../helpers/database')(req.app);
	});
});

module.exports = router;