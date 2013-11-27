# bump-anything

Bump packages :P or (basically) anything!

## Overview

* Ridiculously customizable, yet easy to use
* Sane default configuration (bumps package.json-like files)
* Supports both synchronous operations and promise-based async
* _No_ (zero, zip, zilch) hard dependencies

## Installation

* `npm install bump-anything`
* (optional) install default dependencies if not customizing:
	- `npm install semver when`

## Simple Example

The default `configure` method will return a "bumper" with the following expectations:

* The locator points to a readable JSON file
* The JSON document contains a "version" property at the root of the document

This works just fine with a standard "package.json" file.

```javascript

var bumper = require("bump-anything").configure(),
	log = console.log,
	err = console.err;

bumper.major("package.json").then(log, err); // or 'minor' or 'patch'

// > { oldVersion: "1.1.1", newVersion: "2.0.0" }
```

## Configuration

Here are the configuration options:

* readContent(locator) - returns the content of the data you are trying to bump
* writeContent(locator, content) - write the content to the location specified
* getVersion(content) - return the version number from the given content
* setVersion(content, version) - return content with its version changed

### Example: Change the location when writing

```javascript

function writeContent(locator, content) {
  fs.writeFileSync(locator + ".new", content);
}

var bumper = require("bump-anything").configure({ writeContent: writeContent });
bumper.bump("package.json").done(); // bumps to "package.json.new"
```

### Example: Write pretty JSON with custom spacing

```javascript
function setVersion(content, version) {
	var data = JSON.parse(content),
		indent = 5;

	data.version = version;
	return JSON.stringify(data, null, indent);
}
```

### Example: A unique JSON file format

```javascript

function getVersion(content) {
  return JSON.parse(content).version.current;
}
function setVersion(content, version) {
  var data = JSON.parse(content);
  content.version.current = version;
  return content;
}

var bumper = require("bump-anything").configure({ getVersion: getVersion, setVersion: setVersion });
bumper.bump("unique-config.json").done();
```
