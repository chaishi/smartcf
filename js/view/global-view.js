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
			'click .app-guide img': 'showScreenApps'
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
		},
		//将所有小圆点变成灰色
		circleChange: function() {
			var circleDom = $('.app-guide img');
			circleDom.each(function(i){
				if(i > 0 && i < circleDom.length - 1) {
					$(this).attr({src: interfaces.circles[1]});					
				}
			});
		},
		showScreenApps: function(event) {
			this.circleChange();
			event.target = event.target || event.srcElement;
			event.target.setAttribute('src', interfaces.circles[0]);
		}
	});
	
});