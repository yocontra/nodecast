function ChromeCast() {
}

ChromeCast.modelName = /^Eureka Dongle$/;

ChromeCast.prototype.reboot = function(cb) {
	request.post("http://"+this.address+"/setup/reboot", {json:{params:"now"}}, cb);
};

module.exports = ChromeCast;