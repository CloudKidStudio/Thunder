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
    session = require('express-session');

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
app.use(flash());
app.set('json spaces', config.spaces);

// Rendering engine for mark-up
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Expose the "public" folder
app.use(express.static(__dirname + '/public'));

// Setup the error handler
app.use(errorHandler(config.errorHandlerOptions));

// Start the server
console.log(('Thunder running on ').green + ('http://localhost:' + config.port).blue);

// Connect to database
mongoose.connect(config.db);
mongooseTypes.loadTypes(mongoose);
require('express-mongoose');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'.red));

// Include models once.
// ~szk: essentially we are init'ing the namespaces within, and for, mongoose.
//      ex: module.exports = mongoose.model('Tag', tagSchema);
// Now, because Tag is exported, the Sound schema can recognize tagSchema
// and populate a tag database-item within a Sound item, etc. 
require('./models/category');
require('./models/tag');
require('./models/sound');
require('./models/user');

// Authentication stuff
app.use(session({
	secret: 'cloudkid', 
	saveUninitialized: true,
	resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
require('./helpers/auth')(passport);

// Route-accessible globals
global.config = config;

// Load all the routes
routes(app);