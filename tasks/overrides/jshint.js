module.exports = {
	main: [
		'Gruntfile.js',
		'<%= project.js.main %>',
		'app/config/*.js',
		'app/models/*.js',
		'app/routes/*.js',
		'app/*.js'
	]
};