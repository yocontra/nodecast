#!/usr/bin/env node

var nodecast = require('../');
var stream = nodecast.find('roku');

stream.on('device', function(device) {
	console.log('Found device', device.name);

	device.apps(function(err, apps){
		if (err) return console.log(err);
		console.log(apps);
	});
});