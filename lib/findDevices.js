var EventEmitter = require('events').EventEmitter;
var url = require('url');
var ssdp = require('node-ssdp');
var superagent = require('superagent');
var xml2json = require('xml2json');
var client = new ssdp({log: false});
var Device = require('./Device');
var path = require('path');
var requireDir = require('require-dir');
var customDevices = requireDir(path.join(__dirname, './devices'));

module.exports = function(filter) {
	if (!filter) filter = 'generic'; // match all
	var EE = new EventEmitter();

	var addDevice = function(msg, info){
		var locHead = String(msg).match(/Location: (.*)/i);
		if (!locHead || !locHead[1]) return; // not a valid device
		var location = locHead[1].trim();
		var urlParts = url.parse(location);

		var request = superagent.get(location);
		request.buffer();
		request.type('xml');
		request.end(function(err, res) {
			if (err) return EE.emit('error', err);
			var parsedBody = xml2json.toJson(res.text, {object: true});
			
			urlParts.pathname = urlParts.path = url.parse(res.headers['application-url']).path+"/";

			var deviceArgs = {
				name: parsedBody.root.device.friendlyName,
				info: parsedBody.root.device,
				address: info.address,
				port: urlParts.port,
				appsBase: url.format(urlParts),
				httpBase: urlParts.host
			};

			// check for custom devices
			var customs = Object.keys(customDevices).map(function(k){
				return customDevices[k];
			}).filter(function(custom){
				return custom.matches(deviceArgs);
			});

			var dev;
			if (customs[0]){
				dev = new customs[0](deviceArgs);
			} else { // generic device
				dev = new Device(deviceArgs);
			}

			if (dev.is(filter)) {
				EE.emit('device', dev);
			}
		});
	};

	client.on('response', addDevice);
	client.search('urn:dial-multiscreen-org:service:dial:1');

	return EE;
};