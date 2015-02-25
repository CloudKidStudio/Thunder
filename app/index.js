#!/usr/bin/env node

// Include libraries
var express = require('express'),
	colors = require('colors'),
	errorHandler = require('errorhandler'),
	bodyParser = require('body-parser'),
	routes = require('./routes');

// Create sever
var app = express();

// Get the configuration
var config = require('./config/environment.js')[app.get('env')];

// Change the working directory to here
process.chdir(__dirname);

// Setup the app
app.listen(config.port);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('json spaces', config.spaces);
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'jade');

// Setup the error handler
app.use(errorHandler(config.errorHandlerOptions));

// Start the server
console.log(('Thunder running on http://localhost:' + config.port).green);

// Route-accessible globals
global.config = config;

// Load all the routes
routes(app);