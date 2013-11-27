module.exports = function(grunt) {
	"use strict";

	var config = {
		jshint: {
			options: { jshintrc: true },
			all: ["Gruntfile.js", "src/**/*.js", "spec/**/*.js"]
		},
		jsonlint: {
			all: ["package.json", ".jshintrc"]
		},
		simplemocha: {
			options: {
				require: ["should"],
				ui: "bdd",
				reporter: "spec"
			},
			all: { src: ["spec/**/*-spec.js"] }
		}
	};

	// Initialize the configuration
	grunt.initConfig(config);

	// Load tasks
	grunt.loadNpmTasks('grunt-jsonlint');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-simple-mocha');

	// Aliases
	grunt.registerTask('lint', ['jsonlint', 'jshint']);
	grunt.registerTask('test', ['simplemocha']);
	grunt.registerTask('default', ['lint', 'test']);
};