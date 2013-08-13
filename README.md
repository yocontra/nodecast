[![NPM version](https://badge.fury.io/js/nodecast.png)](http://badge.fury.io/js/nodecast)

## Information

<table>
<tr>
<td>Package</td><td>nodecast</td>
</tr>
<tr>
<td>Description</td>
<td>Node interface to DIAL/ChromeCast</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.4</td>
</tr>
</table>

This library has been tested with ChromeCast, Roku, and a Panasonic Viera TV. It fully supports any device that uses the DIAL protocol. RAMP support is being worked on for certain ChromeCast functionality.

## How this works

![DIAL](http://geeknizer.com/wp-content/uploads/2013/07/dial-discovery.jpg)

This uses the DIAL discovery protocol over SSDP to discover devices. Once you get a device, you can access applications on it using the DIAL relaxation protocol.

## Client Usage

```javascript
var nodecast = require('nodecast');

var devices = nodecast.find();

devices.once('device', function(device) {
	device.reboot(function(err) {
		// triggers a device reboot
	});

	var yt = device.app('YouTube');

	yt.info(function(err, info){
		// returns info about the app
		// who wrote it, capabilities, etc.
	});

	yt.start(function(err) {
		// starts the app on the chromecast
		// also optionally takes data to pass to the app
		// (for example: youtube takes v=id to launch with a video)
	});
});
```

## ChromeCast

RAMP support is still being worked on. RAMP is DIAL + a WebSocket to do streaming video progress and more.

## Examples

You can view more examples in the [example folder.](https://github.com/wearefractal/nodecast/tree/master/examples)

## Testing

To run the tests you either need a chromecast somewhere on your WiFi or you need to run the emulator.

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
