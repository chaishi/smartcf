define(['app-model', 'interface'], function(appModel, interfaces) {
	
	return AppList = Backbone.Collection.extend({
		model: appModel
	});
	
});
