#!/usr/bin/env node

var nodecast = require('../');
var stream = nodecast.find();

stream.on('device', function(device) {
	console.log('Found', device.name, '-', device.info);
});