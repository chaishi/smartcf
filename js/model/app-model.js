define(function(require, exports, module) {
	var jquery = require('jquery');
	var interfaces = require('interface');
	$.getJSON(
		interfaces.getAppList,
		function(data){
			console.log(data);
		}
	);
});
