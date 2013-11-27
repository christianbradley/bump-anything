module.exports = function(config) {
	"use strict";

	function Configuration(options) {
		for(var key in options) {
			if(options.hasOwnProperty(key)) this[key] = options[key];
		}
	}

	Configuration.prototype = {
		constructor: Configuration,
		readContent: function(locator) {
			return require("fs").readFileSync(locator, "utf8");
		},
		writeContent: function(locator, content) {
			return require("fs").writeFileSync(locator, content, "utf8");
		},
		getVersion: function(content) {
			return JSON.parse(content).version;
		},
		increment: function(version, type) {
			return require("semver").inc(version, type);
		},
		setVersion: function(content, version) {
			var data = JSON.parse(content);
			data.version = version;
			return JSON.stringify(data, null, 2);
		},
		pipeline: function() {
			var args = Array.prototype.slice.call(arguments);
			return require("when/pipeline").apply(void 0, args);
		}
	};

	var $ = new Configuration(config);

	function bump(locator, type) {
		var stored = {}, results = {}, promise;

		function readContent()
		{ return $.readContent(locator); }

		function storeContent(content)
		{ return (stored.content = content); }

		function getVersion(content)
		{ return $.getVersion(content); }

		function storeOldVersion(version)
		{ return (results.oldVersion = version); }

		function increment(version)
		{ return $.increment(version, type); }

		function storeNewVersion(version)
		{ return (results.newVersion = version); }

		function setVersion(version)
		{ return $.setVersion(stored.content, version); }

		function writeContent(content)
		{ return $.writeContent(locator, content); }

		function resolve()
		{ return results; }

		promise = $.pipeline([
			readContent,
			storeContent,
			getVersion,
			storeOldVersion,
			increment,
			storeNewVersion,
			setVersion,
			writeContent,
			resolve
		]);

		return promise;
	}

	return {
		bump: bump,
		major: function(locator) { return bump(locator, "major"); },
		minor: function(locator) { return bump(locator, "minor"); },
		patch: function(locator) { return bump(locator, "patch"); }
	};
};