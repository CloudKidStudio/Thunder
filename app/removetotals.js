#!/usr/bin/env node

// Include libraries
var mongoose = require('mongoose');
var colors = require('colors');
var mongooseTypes = require('mongoose-types');

// Connect to database
mongoose.connect('mongodb://localhost/thunder');
mongooseTypes.loadTypes(mongoose);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'.red));

// Include models once
var Category = require('./models/category');

console.log("Remove totals field from database".green);

Category.update({}, {$unset: {total: 1}}, {multi: true}).exec(function(err)
{
	if (err) console.log(String(err).red);
	console.log("Removed totals".green);
	process.exit();
});

