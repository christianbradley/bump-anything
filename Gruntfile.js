module.exports = function(grunt) {
	"use strict";

	var config = {
		jshint: {
			options: { jshintrc: true },
			all: ["Gruntfile.js", "src/**/*.js", "spec/**/*.js"]
		},
		jsonlint: {
			all: ["package.json", ".jshintrc"]
		}
	};

	// Initialize the configuration
	grunt.initConfig(config);

	// Load tasks
	grunt.loadNpmTasks('grunt-jsonlint');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// Register the default task
	grunt.registerTask('default', ['jsonlint', 'jshint']);
};