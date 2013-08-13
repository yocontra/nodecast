var nodecast = require('../');

var stream = nodecast.find();

stream.on('device', function(device) {
	// Filter for our chromecast device
	// This library works fine with other DIAL devices but this is a demo
	if (device.info.modelName !== "Eureka Dongle") return;

	console.log('Found ChromeCast', device.name);

	var youtube = device.app('YouTube');

	youtube.start('v=oHg5SJYRHA0', function(err) {
		if (err) console.log('error starting', err);
		console.log('Started');
	});
});