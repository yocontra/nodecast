var util = require('util');
var EventEmitter = require('events').EventEmitter;
var path = require('path');
var requireDir = require('require-dir');

var App = require('./App');
var customDevices = requireDir(path.join(__dirname, './devices'));

function Device(opt) {
	EventEmitter.call(this);
	this.type = 'generic';
	this.name = opt.name;
	this.info = opt.info;
	this.address = opt.address;
	this.port = opt.port;
	this.appsBase = opt.appsBase;
	this.apps = {};

	// merge in device-specific features
	var that = this;
	Object.keys(customDevices).map(function(k){
		return customDevices[k];
	}).filter(function(custom){
		return custom.matches(that);
	}).forEach(function(custom){
		custom.call(that);
	});
}
util.inherits(Device, EventEmitter);

Device.prototype.app = function(appName) {
	if (!this.apps[appName]) {
		this.apps[appName] = new App(this, appName);
	}
	return this.apps[appName];
};

module.exports = Device;