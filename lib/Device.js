var util = require('util');
var EventEmitter = require('events').EventEmitter;
var App = require('./App');
var superagent = require('superagent');
var toArray = require('to-array');
var urljoin = require('url-join');

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
		this._apps[appName] = new this.App(this, appName);
	}
	return this._apps[appName];
};

Device.prototype.is = function(deviceName) {
	return this.types.indexOf(deviceName.toLowerCase()) !== -1;
};

Device.prototype.url = function() {
	var args = toArray(arguments);
  args.unshift(this.httpBase);

  return urljoin.apply(null, toArray(args));
};

Device.prototype.App = App;

module.exports = Device;