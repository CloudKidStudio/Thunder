var mongoose = require('mongoose');
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

SoundSchema.statics.getAll = function(pageStart, itemsPerPage, callback)
{
    return this.find()
        .skip(pageStart)
        .limit(itemsPerPage)
        .populate('category tags')
        .exec(callback);
};

SoundSchema.statics.getByUri = function(uri, callback)
{
    return this.findOne({uri: uri})
        .populate('tags category')
        .exec(callback);
};

SoundSchema.statics.getByTag = function(tagId, callback)
{
    return this.find({tags: {"$in": [tagId]}})
        .populate('tags category')
        .exec(callback);
};

SoundSchema.statics.getByCategory = function(categoryId, callback)
{
    return this.find({category: categoryId})
        .populate('tags category')
        .exec(callback);
};

module.exports = mongoose.model('Sound', SoundSchema);