#!/usr/bin/env node

// Include libraries
var express = require('express'),
	colors = require('colors'),
	errorHandler = require('errorhandler'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	routes = require('./routes'),
	flash = require('connect-flash'),
	passport = require('passport'),
	mongooseTypes = require('mongoose-types'),
	session = require('express-session'),
	zip = require('express-zip'),
	fs = require('fs'),
	validator = require('express-validator'),
	multer = require('multer');

// Create sever
var app = express();

// Get the configuration
var config = require('./config/environment.js')[app.get('env')];

// Change the working directory to here
process.chdir(__dirname);

// Setup the app
app.listen(config.port);

app.use(bodyParser.urlencoded(
{
	extended: false
}));
app.use(bodyParser.json());
app.use(multer({ dest: './uploads/'}));
app.use(flash());
app.set('json spaces', config.spaces);

// Rendering engine for mark-up
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Custom validators
app.use(validator(
{
	customValidators:
	{
		isURI: function(value)
		{
			return /^[a-z0-9\-]{3,}$/.test(value);
		}
	}
}));

// Expose the "public" folder
app.use(express.static(__dirname + '/public'));

// Setup the error handler
app.use(errorHandler(config.errorHandlerOptions));

// Start the server
console.log(('Thunder running on ').green + ('http://localhost:' + config.port).blue);

// Check for the settings
if (!fs.existsSync('./config/settings.js'))
{
	app.use('*', require('./routes/install'));
}
else
{
	// load the settings
	global.settings = require('./config/settings');

	// Connect to database
	mongoose.connect(settings.db);
	mongooseTypes.loadTypes(mongoose);
	require('express-mongoose');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'.red));

	// Include models once
	require('./models/category');
	require('./models/tag');
	require('./models/sound');
	require('./models/user');

	// Authentication stuff
	app.use(session(
	{
		secret: settings.secret,
		saveUninitialized: true,
		resave: true
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	require('./helpers/auth')(passport);

	// Load all the routes
	routes(app);
}