var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tagSchema = new Schema({
	name: String,
	uri: {
		type: String,
		match: /^[a-z\-0-9]+$/
	}
});

module.exports = mongoose.model('Tag', tagSchema);