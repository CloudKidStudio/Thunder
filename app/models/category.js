var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
	name: String,
	uri: {
		type: String,
		match: /^[a-z\-0-9]+$/
	},
	total: Number,
	created: Date,
	updated: Date
});

module.exports = mongoose.model('Category', categorySchema);