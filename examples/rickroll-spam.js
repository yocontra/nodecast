#!/usr/bin/env node

var nodecast = require('../');
var stream = nodecast.find();

stream.on('device', function(device) {
	console.log('Found device', device.name);

	var youtube = device.app('YouTube');

	youtube.start('v=oHg5SJYRHA0', function(err) {
		if (err) console.log('error starting', err);
		console.log('Started on', device.name);
	});
});