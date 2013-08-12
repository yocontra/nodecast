[![Build Status](https://travis-ci.org/wearefractal/nodecast.png?branch=master)](https://travis-ci.org/wearefractal/nodecast)

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

## Usage

```javascript
var nodecast = require('nodecast');

var devices = nodecast.find();

devices.on('device', function(device) {
	// device contains the device config and the ip address
});
```

## Examples

You can view more examples in the [example folder.](https://github.com/wearefractal/nodecast/tree/master/examples)

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
