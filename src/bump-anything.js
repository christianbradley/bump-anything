module.exports = (function() {
	"use strict";

	function configure(configuration) {

		var $ = require("./configuration").create(configuration);

		function bump(locator, type) {
			var stored = {},
				results = {
					locator: locator,
					type: type
				}, promise;

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
	}

	return { configure: configure };
})();