/**
 * The environment settings are determined by the NODE_ENV
 * environmental variable. By default, node sets this to 
 * "development", for production servers it should be change
 * to "production" which will use different database credentials
 * as well as have better error handling.
 */
module.exports = {
	development: 
	{
		db: 'mongodb://localhost/thunder',
		port: 3000,
		spaces: 4,
		errorHandlerOptions: {
			dumpExceptions: true, 
			showStack: true
		}
	},
	production: 
	{
		db: 'mongodb://localhost/thunder',
		port: 3000,
		spaces: 0,
		errorHandlerOptions: {
			dumpExceptions: false, 
			showStack: false
		}
	}
};