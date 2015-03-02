var mongoose = require('mongoose');
var _ = require('lodash');
var Schema = mongoose.Schema;

var SoundSchema = new Schema(
{
	name: String,
	uri:
	{
		type: String,
		trim: true,
		match: /^[a-z\-0-9]+$/
	},
	assetId:
	{
		type: String,
		trim: true,
		match: /^[a-z\-0-9]+$/
	},
	type:
	{
		type: String,
		trim: true,
		enum: ['wav', 'aif']
	},
	category:
	{
		type: Schema.Types.ObjectId,
		ref: 'Category'
	},
	tags: [
	{
		type: Schema.Types.ObjectId,
		ref: 'Tag'
	}],
	size: Number,
	created: Date,
	update: Date
});

SoundSchema.statics.getTotal = function(callback)
{
	return this.find().count(callback);
};

SoundSchema.statics.getAll = function(skip, limit, callback)
{
	return this.find()
		.skip(skip || 0)
		.limit(limit)
		.populate('category tags')
		.exec(callback);
};

SoundSchema.statics.getByUri = function(uri, callback)
{
	return this.findOne({uri: uri})
		.populate('tags category')
		.exec(callback);
};

SoundSchema.statics.getByTag = function(tagId, skip, limit, callback)
{
	return this.find({tags: {"$in": [tagId]}})
		.skip(skip)
		.limit(limit)
		.populate('tags category')
		.exec(callback);
};

SoundSchema.statics.getTotalByTag = function(tagId, callback)
{
	return this.find({tags: {"$in": [tagId]}})
		.count(callback);
};

SoundSchema.statics.getByCategory = function(categoryId, skip, limit, callback)
{
	return this.find({category: categoryId})
		.skip(skip)
		.limit(limit)
		.populate('tags category')
		.exec(callback);
};

SoundSchema.statics.getTotalByCategory = function(categoryId, callback)
{
	return this.find({category: categoryId})
		.count(callback);
};

module.exports = mongoose.model('Sound', SoundSchema);