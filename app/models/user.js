var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Email = mongoose.SchemaTypes.Email;
var unique = require('mongoose-unique-validator');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
	username: {
		type: String,
		unique: true
	},
	password: String,
	privilege: 
	{
		type: Number,
		default: 0
	},
	email: {
		type: Email,
		unique: true
	},
	favorites: 
	[{
		type: Schema.Types.ObjectId,
		ref: 'Sound'
	}],
	name: String,
	resetPasswordToken: String,
	resetPasswordExpires: Date
});

UserSchema.plugin(require('mongoose-unique-validator'));

UserSchema.methods.getFavorites = function(skip, limit, callback)
{
	return this.model('Sound')
		.find({_id: {"$in": this.favorites }})
		.skip(skip)
		.limit(limit)
		.populate('category tags')
		.exec(callback);
};

UserSchema.methods.getAllFavorites = function(callback)
{
	return this.model('Sound')
		.find({_id: {"$in": this.favorites }})
		.populate('category tags')
		.exec(callback);
};

UserSchema.methods.removeFavorites = function(callback)
{
	return this.update({favorites: []}, callback);
};

UserSchema.methods.toggleFavorite = function(soundId, callback)
{
	if (this.favorites.indexOf(soundId) > -1)
	{
		// remove the sound id
		return this.update(
			{$pull: { favorites : soundId }}, 
			callback
		);
	}
	else
	{
		// add the sound id
		return this.update(
			{$push: { favorites : soundId }}, 
			callback
		);
	}
};

UserSchema.statics.getAll = function(excludeId, callback)
{
	return this.find({_id: {$ne: excludeId}})
		.sort('name')
		.exec(callback);
};

UserSchema.statics.getById = function(id, callback)
{
    return this.findOne({ _id : id }, callback);
};

UserSchema.statics.getByToken = function(token, callback)
{
	return this.findOne({ 
		resetPasswordToken: token,
		resetPasswordExpires: { $gt: Date.now() } 
	}, callback);
};

UserSchema.pre('save', function(next)
{
	if (this.isModified('password'))
	{
		this.password = bcrypt.hashSync(
			this.password, 
			bcrypt.genSaltSync(10), 
			null
		);
	}
	return next();
});

UserSchema.methods.comparePassword = function(candidatePassword, callback)
{
	return bcrypt.compareSync(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);