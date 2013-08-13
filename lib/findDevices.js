var EventEmitter = require('events').EventEmitter;
var ssdp = require('node-ssdp');
var request = require('request');
var xml2json = require('xml2json');
var client = new ssdp({log: false});
var createDevice = require('./createDevice');

module.exports = function() {
	var EE = new EventEmitter();

	var addDevice = function(msg, info){
		var locHead = String(msg).match(/Location: (.*)/i);
		if (!locHead || !locHead[1]) return; // not a valid device
		var location = locHead[1].trim();

		request(location, function(err, res, body) {
			if (err) return EE.emit('error', err);
			var parsedBody = xml2json.toJson(body, {object: true});
			
			//if (parsedBody.root.device.modelName !== 'Eureka Dongle') return; // not a chromecast

			var deviceArgs = {
				name: parsedBody.root.device.friendlyName,
				info: parsedBody.root.device,
				address: info.address,
				appsBase: res.headers['application-url']
			};
			EE.emit('device', createDevice(deviceArgs));
		});
	};

	// ChromeCast + Emulator uses DIAL
	// DIAL = DIscovery And Launch
	// This ID is from the ChromeCast config XML
	client.on('response', addDevice);
	client.search('urn:dial-multiscreen-org:service:dial:1');

	return EE;
};