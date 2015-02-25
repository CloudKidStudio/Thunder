#!/usr/bin/env node

// Include libraries
var express = require('express'),
	colors = require('colors'),
	errorHandler = require('errorhandler'),
	mongoose = require('mongoose'),
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

// Rendering engine for mark-up
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Expose the "public" folder
app.use(express.static(__dirname + '/public'));

// Setup the error handler
app.use(errorHandler(config.errorHandlerOptions));

// Start the server
console.log(('Thunder running on http://localhost:' + config.port).green);

// Connect to database
mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'.red));

// Route-accessible globals
global.config = config;

// Load all the routes
routes(app);