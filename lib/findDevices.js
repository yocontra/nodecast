var EventEmitter = require('events').EventEmitter;
var ssdp = require('node-ssdp');
var request = require('request');
var client = new ssdp({log: false});
var createDevice = require('./createDevice');
var xmlson = require('xmlson');

module.exports = function() {
	var EE = new EventEmitter();

	var addDevice = function(msg, info){
		var locHead = String(msg).match(/Location: (.*)/i);
		if (!locHead || !locHead[1]) return; // not a chromecast
		var location = locHead[1].trim();
		request(location, function(err, res, body) {
			if (err) return EE.emit('error', err);
			var parsedBody = xmlson.toJSON(body);
			var deviceArgs = {
				name: parsedBody.root.device[0].friendlyName[0].text,
				address: info.address,
				appsUrl: res.headers['application-url']
			};
			createDevice(deviceArgs, function(err, device) {
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