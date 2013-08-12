var EventEmitter = require('events').EventEmitter;
var ssdp = require('node-ssdp');
var xmlson = require('xmlson');
var request = require('request');
var client = new ssdp();

// make ssdp module shut the fuck up
var noop = function(){};
var fakeLogger = {
	error: noop,
	warning: noop,
	notice: noop,
	info: noop
};
client.logger = fakeLogger;

var getConfig = function(url, cb) {
	request.get(url, function(err, res, body) {
		if (err) return cb(err);
		console.log(body);
		var parsed = xmlson.toJSON(body);
	});
};

module.exports = function() {
	var EE = new EventEmitter();

	var addDevice = function(msg, info){
		var locHead = String(msg).match(/Location: (.*)/i);
		if (!locHead || !locHead[1]) return; // not a chromecast
		var location = locHead[1].trim();

		EE.emit('device', {
			address: info.address,
			config: location
		});

		/*
		getConfig(location, function(err, config) {
			if (err) return EE.emit('error', err);
			EE.emit('device', {
				address: info.address,
				config: config
			});
		});
		*/

	};

	client.on('response', addDevice);

	// ChromeCast + Emulator uses DIAL
	// DIAL = DIscovery And Launch
	// This ID is from the ChromeCast config XML
	client.search('urn:dial-multiscreen-org:service:dial:1');

	return EE;
};