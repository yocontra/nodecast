[![NPM version](https://badge.fury.io/js/nodecast.png)](http://badge.fury.io/js/nodecast)

## Information

<table>
<tr>
<td>Package</td><td>nodecast</td>
</tr>
<tr>
<td>Description</td>
<td>Node interface to nodecast</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.4</td>
</tr>
</table>

This library has been tested with a ChromeCast emulator until mine arrives. Theoretically it should work with your physical one just fine.

## How this works

![Chromecast SSDP](http://geeknizer.com/wp-content/uploads/2013/07/dial-discovery.jpg)

ChromeCast uses DIAL, RAMP, and some REST protocols. This library aims to mash all of those together into one interface.

## Usage

```javascript
var nodecast = require('nodecast');

var devices = nodecast.find();

devices.once('device', function(device) {
	device.reboot(function(err) {
		// triggers a device reboot
	});

	device.volume(0.5, function(err) {
		// change volume
	});

	device.mute(function(err) {
		// mute the thing
	});

	device.video.launch("http://site.com/video.mp4", function(err) {
		// play a video
	});

	device.video.on('progress', function(status) {
		// monitor play progress for a video
	});

	// these control videos currently playing
	device.video.play(function (err){});
	device.video.setPosition(function (err){});
	device.video.pause(function (err){});

	// you can use your own custom apps too
	device.write("com.you.android.yourapp", {"test": "your custom data here"});

	// and you can listen for events from your apps
	device.on("command:com.you.android.yourapp", function(msg) {

	});

});
```

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
