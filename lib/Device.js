var util = require('util');
var EventEmitter = require('events').EventEmitter;
var App = require('./App');
var superagent = require('superagent');
var xml2json = require('xml2json');

function Device(opt) {
	EventEmitter.call(this);
	this.types = ['generic'];
	this.name = opt.name;
	this.info = opt.info;
	this.address = opt.address;
	this.port = opt.port;
	this.appsBase = opt.appsBase;
	this.httpBase = opt.httpBase;
	this._apps = {};
}
util.inherits(Device, EventEmitter);

Device.prototype.app = function(appName) {
	if (!this._apps[appName]) {
		this._apps[appName] = new App(this, appName);
	}
	return this._apps[appName];
};

Device.prototype.is = function(deviceName) {
	return this.types.indexOf(deviceName.toLowerCase()) !== -1;
};

module.exports = Device;