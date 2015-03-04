var User = require('../models/user');
var LocalStrategy = require('passport-local');
var hash = require('./hash');

module.exports = function(passport)
{
	// Passport also needs to serialize and deserialize 
	// user instance from a session store in order to 
	// support login sessions, so that every subsequent 
	// request will not contain the user credentials. 
	// It provides two method: 
	passport.serializeUser(function(user, done){
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});

	passport.use('login', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done)
		{ 
			// check in mongo if a user with username exists or not
			User.findOne({ 'username' :  username }, 
				function(err, user)
				{
					// In case of any error, return using the done method
					if (err) return done(err);

					// Username does not exist, log error & redirect back
					if (!user)
					{
						console.log('User Not Found with username '+username);
						return done(null, false, req.flash(
							'error', 
							'User Not found.'
						));                 
					}
					// User exists but wrong password, log the error 
					if (!hash.compare(user, password))
					{
						console.log('Invalid Password');
						return done(null, false, req.flash(
							'error', 
							'Invalid Password'
						));
					}
					// User and password both match, return user from 
					// done method which will be treated like success
					return done(null, user);
				}
			);
		})
	);

	// Handle the signup process
	passport.use('register', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done)
		{
			function findOrCreateUser()
			{
				// find a user in Mongo with provided username
				User.findOne({username: username},function(err, user){
					// In case of any error return
					if (err)
					{
						//console.log('Error in SignUp: ' + err);
						return done(err);
					}
					// already exists
					if (user)
					{
						//console.log('Username already exists!');
						return done(null, false, req.flash(
							'error', 
							'User Already Exists'
						));
					}
					else 
					{
						// if there is no user with that email
						// create the user
						var newUser = new User({
							username: username,
							password: hash.create(password),
							email: req.body.email,
							name: req.body.name, 
							privilege: req.body.privilege || 0
						});
	 
						// save the user
						newUser.save(function(err){
							if (err)
							{
								//console.log('Error in Saving user: '+err);  
								throw err;  
							}
							//console.log('User Registration succesful');    
							return done(null, newUser);
						});
					}
				});
			}
			 
			// Delay the execution of findOrCreateUser and execute 
			// the method in the next tick of the event loop
			process.nextTick(findOrCreateUser);
		})
	);
};