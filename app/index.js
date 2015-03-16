#!/usr/bin/env node

// Include libraries
var express = require('express'),
	colors = require('colors'),
	errorHandler = require('errorhandler'),
	bodyParser = require('body-parser'),
	zip = require('express-zip'),
	fs = require('fs'),
	dotenv = require('dotenv'),
	validator = require('express-validator'),
	multer = require('multer');

// Load the environment file
dotenv.load();

// Create sever
var app = express();

// Get the configuration
var config = require('./config/environment.js')[app.get('env')];

// Change the working directory to here
process.chdir(__dirname);

// Setup the app
var port = process.env.PORT || 3000;
app.listen(port);

// Middleware for Express
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(multer({ dest: './uploads/'}));
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
console.log(('Thunder running on ').green + ('http://localhost:' + port).blue);

// Check for the settings
if (!process.env.MONGO_DATABASE)
{
	app.use(require('./routes/install'));
}
else
{
	// bootstrap the database connection
	require('./helpers/database')(app);
}