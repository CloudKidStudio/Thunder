var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');

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
    var Category = this;
    var promise = new mongoose.Promise();
    if (callback) promise.onFulfill(callback);
    this.model('Sound').aggregate({ 
            $group: { 
                _id : "$category", 
                count : { $sum : 1 }
            }
        }, 
        function(err, rows)
        {
            var totals = _.indexBy(rows, '_id');
            Category.find().sort('name').exec(function(err, categories)
            {
                _.each(categories, function(category)
                {
                    var total = totals[category._id];
                    category.total = total ? total.count : 0;
                });
                promise.fulfill(categories);
            });
        }
    );
    return promise;
};

CategorySchema.statics.getAllSimple = function(callback)
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
    var Sound = this.model('Sound');
    var promise = new mongoose.Promise();
    if (callback) promise.onFulfill(callback);

    this.findOne({ uri: uri }, function(err, category)
    {
        if (!category) return promise.error(err);

        Sound.count({ category : category._id }, function(err, count)
        {
            category.total = count;
            promise.fulfill(category);
        });
    });
    return promise; 
};

module.exports = mongoose.model('Category', CategorySchema);