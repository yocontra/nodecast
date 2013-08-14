var Device = require('../Device');
var util = require('util');
var superagent = require('superagent');

function ChromeCast(opt) {
	Device.call(this, opt);
	this.types.push('chromecast');
}
util.inherits(ChromeCast, Device);

ChromeCast.prototype.reboot = function(cb) {
	var request = superagent.post("http://"+this.address+"/setup/reboot");
	request.buffer();
	request.type('json');
	request.end(function(err, res) {
		cb(err, res);
	});
};

ChromeCast.matches = function(device) {
	return device.info.modelName === "Eureka Dongle";
};

module.exports = ChromeCast;