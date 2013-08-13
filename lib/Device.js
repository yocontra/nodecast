var util = require('util');
var EventEmitter = require('events').EventEmitter;
var path = require('path');
var requireDir = require('require-dir');

var App = require('./App');
var customDevices = requireDir(path.join(__dirname, './devices'));

function Device(opt) {
	EventEmitter.call(this);
	this.name = opt.name;
	this.info = opt.info;
	this.address = opt.address;
	this.appsBase = opt.appsBase;
	this.apps = {};
}
util.inherits(Device, EventEmitter);

Device.prototype.app = function(appName) {
	if (!this.apps[appName]) {
		this.apps[appName] = new App(this, appName);
	}
	return this.apps[appName];
};

module.exports = Device;