function ChromeCast() {
	this.type = 'chromecast';
}

ChromeCast.prototype.reboot = function(cb) {
	request.post("http://"+this.address+"/setup/reboot", {json:{params:"now"}}, cb);
};

ChromeCast.matches = function(device) {
	return device.info.modelName === "Eureka Dongle";
};

module.exports = ChromeCast;