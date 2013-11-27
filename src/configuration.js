module.exports = (function(){
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

	return {
		create: function(options) { return new Configuration(options); }
	};

})();