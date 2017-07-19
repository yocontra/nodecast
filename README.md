[![NPM version](https://badge.fury.io/js/nodecast.svg)](http://badge.fury.io/js/nodecast)

## Information

<table>
<tr>
<td>Package</td><td>nodecast</td>
</tr>
<tr>
<td>Description</td>
<td>Node interface to DIAL/RAMP/ChromeCast</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.4</td>
</tr>
</table>

This library fully supports any device that uses the DIAL discovery protocol. Support for custom device functionality is supported in some cases (See Custom Devices section below). This library has been tested with ChromeCast, Roku, and a Panasonic Viera TV. Any device that lets you send YouTube videos to it will have the DIAL protocol.

## Example

```javascript
var nodecast = require('nodecast');

var devices = nodecast.find();

devices.once('device', function(device) {
	var yt = device.app('YouTube');

	yt.start('v=12345', function(err) {
		// starts the app on the device
		// also optionally takes data to pass to the app
		// (for example: youtube takes v=id to launch with a video)
	});
});
```

## Finder(filter)

Returns an EventEmitter that emits all devices on the network. Optional filter to match only certain devices.

Example:

```javascript
var network = nodecast.find('chromecast');

network.on('device', function(device){
	
});
```

### .end()

Cancels SSDP search for devices.

## Device

### .is(type)

Returns true or false if the device inherits the custom class of (type).

Example:

```javascript
var network = nodecast.find();

network.on('device', function(device){
	console.log(device.is('roku')); // true
});
```

### .app(name)

Returns a reference to an application

Example:

```javascript
var network = nodecast.find();

network.on('device', function(device){
	var yt = device.app('YouTube');
});
```

## Application

### .info(cb)

Callback is optional. Result data is the parsed XML of whatever the device vendor and application vendor chose to put on their page.

Example:

```javascript
var network = nodecast.find();

network.on('device', function(device){
	var yt = device.app('YouTube');

	yt.info(function(err, info){

	});
});
```

### .start(data, cb)

Data and callback are both optional. The format of data may depend on the device or the app you are interfacing with.

Example:

```javascript
var network = nodecast.find();

network.on('device', function(device){
	var yt = device.app('YouTube');

	// all below are valid
	yt.start('v=12345', function(err){

	});

	yt.start({v:"12345"}, function(err){

	});

	yt.start(function(err){

	});

	yt.start();
});
```

### .stop(cb)

Callback is optional. Stops the app. Some devices do not support this.

Example:

```javascript
var network = nodecast.find();

network.on('device', function(device){
	var yt = device.app('YouTube');

	// all below are valid
	yt.stop(function(err){

	});

	yt.stop();
});
```

## Custom Devices

If you look in `./lib/devices` you can see we have custom support for certain devices. Every vendor has their own spin on DIAL so we try to support the cool stuff they add on top of it. ChromeCast for example, has it's own RAMP protocol. Roku has an interface that lets you emulate a remote. This custom functionality is mixed into the generic DIAL device if support is detected.

## Examples

You can view more examples in the [example folder.](https://github.com/wearefractal/nodecast/tree/master/examples)

## Testing

To run the tests you either need to run the ChromeCast emulator locally. Mute your speakers because it will pop up videos and close them.

## LICENSE

(MIT License)

Copyright (c) 2013 Fractal <contact@wearefractal.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
