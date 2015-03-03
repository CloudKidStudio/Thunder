var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema(
{
    name: String,
    uri:
    {
        type: String,
        match: /^[a-z\-0-9]+$/,
        unique: true
    },
    total: Number,
    created: Date,
    updated: Date
});

CategorySchema.plugin(require('mongoose-unique-validator'));

CategorySchema.statics.getAll = function(callback)
{
    return this.find({}, callback);
};

CategorySchema.statics.getAllEditable = function(callback)
{
    return this.find({uri: {$ne: "uncategorized"}}, callback);
};

CategorySchema.statics.getEmpty = function(callback)
{
    return this.findOne({uri: "uncategorized"}, callback);
};

CategorySchema.statics.getByUri = function(uri, callback)
{
    return this.findOne(
    {
        uri: uri
    }, callback);
};

CategorySchema.statics.getById = function(id, callback)
{
    return this.findOne(
    {
        _id: id
    }, callback);
};

module.exports = mongoose.model('Category', CategorySchema);