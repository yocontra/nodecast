var EventEmitter = require('events').EventEmitter;
var ssdp = require('node-ssdp');
var request = require('request');
var client = new ssdp();
var createDevice = require('./createDevice');

// make ssdp module shut the fuck up
var noop = function(){};
var fakeLogger = {
	error: noop,
	warning: noop,
	notice: noop,
	info: noop
};
client.logger = fakeLogger;

module.exports = function() {
	var EE = new EventEmitter();

	var addDevice = function(msg, info){
		var locHead = String(msg).match(/Location: (.*)/i);
		if (!locHead || !locHead[1]) return; // not a chromecast
		var location = locHead[1].trim();
		request(location, function(err, res, body) {
			var wsUrl = location;
			createDevice(info.address, wsUrl, function(err, device) {
				if (err) return EE.emit('error', err);
				EE.emit('device', device);
			});
		});
	};

	// ChromeCast + Emulator uses DIAL
	// DIAL = DIscovery And Launch
	// This ID is from the ChromeCast config XML
	client.on('response', addDevice);
	client.search('urn:dial-multiscreen-org:service:dial:1');

	return EE;
};