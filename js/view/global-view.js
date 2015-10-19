define(['app-collection', 'app-view', 'interface', 'jquery-gridly'], 
	function(appCollection, appView, interfaces, gridly) {
	
	var appList = new appCollection;
	
	return globalView = Backbone.View.extend({
		el: 'body',
		initialize: function() {
			this.applistDom = $(this.$('.app-list')[0]);
			
			this.listenTo(appList, 'add', this.addOneApp);
			this.listenTo(appList, 'reset', this.addAllApps);
			
			appList.fetch({url: interfaces.getAppList});//{url: interfaces.getAppList}
			//appList.reset();
		},
		render: function() {
			
		},
		events: {
			
		},
		addOneApp: function(oneApp) {
			var view = new appView({model: oneApp});
			this.applistDom.append(view.render().el);
			this.initDrag();
		},
		addAllApps: function() {
			appList.each(this.addOneApp, this);
			this.initDrag();
		},
		initDrag: function() {
			$('.gridly').gridly({
			    base: 30, // px 
			    gutter: 15, // px
			    columns: 18
			});
		}
	});
	
});