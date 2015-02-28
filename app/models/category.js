var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema(
{
    name: String,
    uri:
    {
        type: String,
        match: /^[a-z\-0-9]+$/
    },
    total: Number,
    created: Date,
    updated: Date
});

CategorySchema.statics.getAll = function(callback)
{
	return this.find().exec(callback);
};

CategorySchema.statics.getByUri = function(uri, callback)
{
	return this.findOne({uri: uri}, callback);
};

module.exports = mongoose.model('Category', CategorySchema);