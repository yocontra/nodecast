var ws = require('ws');

module.exports = function(address, configUrl, cb) {
	var device = {
		address: address
	};
	cb(null, device);
};