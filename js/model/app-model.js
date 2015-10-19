
define(['backbone', 'interface'], function(Backbone, interfaces) {
	
	return App = Backbone.Model.extend({
		defaults: {
			"imgId": "1",
			"imgUrl": "http://42.96.175.100/static/theme/15/images/app_icons/calendar.png",
			"imgTitle": "日程安排"
		}
	});
	
});
