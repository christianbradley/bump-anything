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

To create a configured "bumper", you pass options to the `configure` method that will override the default configuration.

```javascript
var myBumper = require("bump-anything").configure(options);
```

To create a "bumper" with the default configuration, omit the options, or pass `undefined` or `null`.

```javascript
var bumper = require("bump-anything").configure();
```

### Configuration options

Any of the following options can be overriden. Take care to match the interface of the default methods.

#### readContent({string} locator) => {string} content

Returns the content from the location specified by `locator`.

By default, uses `fs.readFileSync` with encoding set to "utf8".

---

#### writeContent({string} locator, {string} content) => void

Write `content` to the location specified by `locator`.

By default, uses `fs.writeFileSync` with encoding set to "utf8".

---

#### getVersion({string} content) => {string} version

Return the `version` found in `content`.

By default, parses `content` as JSON and returns the top-level `version` property.

---

#### setVersion({string} content, {string} version) => {string} newContent

Return `content`, modified to reflect the new `version`.

By default, parses `content` as JSON and updates the top-level `version` property, then returns "pretty" JSON stringified with 2 spaces.

---

#### increment({string} version, {string} type) => {string} newVersion

Increment `version` using semantic type `type`, returning `newVersion`.

By default, uses npm's own [semver][] package `inc` method.

---

#### pipeline({array} methods, [{string} args...]) => {promise}

Returns a promise by "piping" each method's result to the next.

By default, uses cujojs's [when][] library's [pipeline][] implementation.

# API

#### .configure([{configuration} options]) => Bumper

Create a "bumper" with the given configuration `options`.
If `options` are omitted, sane defaults will be used.

---

#### Bumper#bump({string} locator, {string} type) => Promise

Bump the resource specified by `locator` with the given version `type`.
The `type` must be one of: "major", "minor", or "patch".

The `promise` resolves with the following object:

* locator: The `locator` specified in the call
* type: The `type` specified in the call
* oldVersion: The original version found in `content`
* newVersion: The incremented version

---

#### Bumper#major({string} locator) => Promise

Convenience method, calls `bump` with `type` set to "major".

---

#### Bumper#minor({string} locator) => Promise

Convenience method, calls `bump` with `type` set to "minor".

---

#### Bumper#patch({string} locator) => Promise

Convenience method, calls `bump` with `type` set to "patch".


# Examples

Here are just a few examples of how to configure `bump-anything` for various tasks:

#### Change the location when writing

```javascript

function writeContent(locator, content) {
  fs.writeFileSync(locator + ".new", content);
}

var bumper = require("bump-anything").configure({ writeContent: writeContent });
bumper.bump("package.json").done(); // bumps to "package.json.new"
```

#### Write pretty JSON with custom spacing

```javascript
function setVersion(content, version) {
	var data = JSON.parse(content),
		indent = 5;

	data.version = version;
	return JSON.stringify(data, null, indent);
}
```

#### A unique JSON file format

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

[semver]: https://npmjs.org/doc/misc/semver.html
[when]: https://github.com/cujojs/when/
[pipeline]: https://github.com/cujojs/when/blob/master/docs/api.md#whenpipeline
