var EventEmitter = require('events').EventEmitter;
var url = require('url');
var util = require('util');
var path = require('path');
var ssdp = require('node-ssdp');
var superagent = require('superagent');
var xml2json = require('xml2json');
var Device = require('./Device');

var requireDir = require('require-dir');
var customDevices = requireDir(path.join(__dirname, './devices'));

function Finder(filter) {
	EventEmitter.call(this);
	this.filter = filter || 'generic';

	this.client = new ssdp({log: false});
	this.client.on('response', this.add.bind(this));
	this.start();
}
util.inherits(Finder, EventEmitter);

Finder.prototype.start = function(){
	this.client.search('urn:dial-multiscreen-org:service:dial:1');
	return this;
};

Finder.prototype.end = function(){
	this.client.stop();
	return this;
};

Finder.prototype.add = function(msg, info){
	var that = this;

	// Parse location header
	var locHead = String(msg).match(/Location: (.*)/i);
	if (!locHead || !locHead[1]) return; // ignore - not a valid device
	var location = locHead[1].trim();
	var urlParts = url.parse(location);

	// Request config url
	var request = superagent.get(location);
	request.buffer();
	request.type('xml');
	request.end(function(err, res) {
		if (err) return that.emit('error', err);

		var parsedBody = xml2json.toJson(res.text, {object: true});
		
		// Get app base url
		var appUrl = res.headers['application-url'];
		if (!appUrl) return; // not a media device, something else?
		urlParts.pathname = urlParts.path = url.parse(appUrl).path+"/";

		var deviceArgs = {
			name: parsedBody.root.device.friendlyName,
			info: parsedBody.root.device,
			address: info.address,
			port: urlParts.port,
			appsBase: url.format(urlParts),
			httpBase: (urlParts.protocol+"//"+urlParts.host)
		};

		// Check for custom devices
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

		if (dev.is(that.filter)) {
			that.emit('device', dev);
		}
	});
	return this;
};

module.exports = Finder;