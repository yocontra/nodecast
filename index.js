module.exports = nodecast = {
	find: function(filter){
		return new nodecast.Finder(filter);
	},
	Finder: require('./lib/Finder'),
	Device: require('./lib/Device'),
	App: require('./lib/App')
};