var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var soundSchema = new Schema({
	name: String,
	uri: {
		type: String,
		trim: true,
		match: /^[a-z\-0-9]+$/
	},
	assetId: {
		type: String,
		trim: true,
		match: /^[a-z\-0-9]+$/
	},
	type: {
		type: String,
		trim: true,
		enum: ['wav', 'aif']
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category'
	},
	tags: [{
		type: Schema.Types.ObjectId,
		ref: 'Tag'
	}],
	size: Number, 
	created: Date,
	update: Date
});

module.exports = mongoose.model('Sound', soundSchema);