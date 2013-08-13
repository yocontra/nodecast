var EventEmitter = require('events').EventEmitter;
var createApp = require('./createApp');

module.exports = function(opt, cb) {
	var device = new EventEmitter();
	device.name = opt.name;
	device.info = opt.info;
	device.address = opt.address;
	device.appsBase = opt.appsBase;
	device.apps = {};

	device.app = function(appName) {
		if (!device.apps[appName]) {
			device.apps[appName] = createApp(device, appName);
		}
		return device.apps[appName];
	};

	device.reboot = function(cb) {
		request.post("http://"+opt.address+"/setup/reboot", {json:{params:"now"}}, cb);
	};

	return device;
};