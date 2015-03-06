var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Email = mongoose.SchemaTypes.Email;
var unique = require('mongoose-unique-validator');
var bcrypt = require('bcrypt-nodejs');

/**
 * The user model
 * @class User
 * @extends mongoose.Schema
 */
var UserSchema = new Schema({
	/**
	 * The username
	 * @property {String} username
	 */
	username: {
		type: String,
		unique: true
	},
	/**
	 * The password hash
	 * @property {String} password
	 */
	password: String,

	/**
	 * The user privilege from 0 (guest), 1 (editor), 2 (admin)
	 * @property {int} privilege
	 */
	privilege: 
	{
		type: Number,
		default: 0
	},
	/**
	 * User's email address for notifications
	 * @property {String} email
	 */
	email: {
		type: Email,
		unique: true
	},

	/**
	 * The collection of favorites
	 * @property {Array} favorites
	 */
	favorites: 
	[{
		type: Schema.Types.ObjectId,
		ref: 'Sound'
	}],

	/**
	 * The user's full name
	 * @property {String} name
	 */
	name: String,

	/**
	 * A random string of characters for resetting password
	 * @property {String} resetPasswordToken
	 */
	resetPasswordToken: String,

	/**
	 * The date when the reset token expires
	 * @property {Date} resetPasswordExpires
	 */
	resetPasswordExpires: Date
});

UserSchema.plugin(require('mongoose-unique-validator'));

/**
 * Get the collection of Sounds favorited by this user
 * @method getFavorites
 * @param {int} skip The index to skip to start
 * @param {int} limit The number of items to return
 * @param {function} callback The callback with result
 * @return {Promise} The promise object for async action
 */
UserSchema.methods.getFavorites = function(skip, limit, callback)
{
	return this.model('Sound')
		.find({_id: {"$in": this.favorites }})
		.skip(skip)
		.limit(limit)
		.populate('category tags')
		.exec(callback);
};

/**
 * Get ALL favorites collection of Sounds favorited by this user
 * @method getAllFavorites
 * @param {function} callback The callback with result
 * @return {Promise} The promise object for async action
 */
UserSchema.methods.getAllFavorites = function(callback)
{
	return this.model('Sound')
		.find({_id: {"$in": this.favorites }})
		.populate('category tags')
		.exec(callback);
};

/**
 * Clear all of the favorited sounds
 * @method removeFavorites
 * @param {function} callback The callback with result
 * @return {Promise} The promise object for async action
 */
UserSchema.methods.removeFavorites = function(callback)
{
	return this.update({favorites: []}, callback);
};

/**
 * Add and remove the sound from the favorites list
 * @method toggleFavorite
 * @param {ObjectId} soundId The sound id
 * @param {function} callback The callback with result
 * @return {Promise} The promise object for async action
 */
UserSchema.methods.toggleFavorite = function(soundId, callback)
{
	var index = this.favorites.indexOf(soundId);
	if (index > -1)
	{
		this.favorites = this.favorites.splice(index, 1);
	}
	else
	{
		this.favorites.push(soundId);
	}
	return this.save(callback);
};

/**
 * Get all the users mine the current one
 * @method getAll
 * @static
 * @param {ObjectId} excludeId The user to exclude from the list
 * @param {function} callback The callback with result
 * @return {Promise} The promise object for async action
 */
UserSchema.statics.getAll = function(excludeId, callback)
{
	return this.find({_id: {$ne: excludeId}})
		.sort('name')
		.exec(callback);
};

/**
 * Get a user by reset token
 * @method getByToken
 * @static
 * @param {string} token The random token to search on
 * @param {function} callback The callback with result
 * @return {Promise} The promise object for async action
 */
UserSchema.statics.getByToken = function(token, callback)
{
	return this.findOne({ 
		resetPasswordToken: token,
		resetPasswordExpires: { $gt: Date.now() } 
	}, callback);
};

// Hash the password after every save of the user
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

/**
 * Compare the password with the current user
 * @method comparePassword
 * @param {string} candidatePassword The password to check (plain, not hash)
 * @param {function} callback The callback with result
 * @return {Promise} The promise object for async action
 */
UserSchema.methods.comparePassword = function(candidatePassword, callback)
{
	return bcrypt.compareSync(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);