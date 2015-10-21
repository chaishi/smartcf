define(['app-collection', 'app-view', 'interface', 'jquery-gridly'], 
	function(appCollection, appView, interfaces, gridly) {
	
	var appList = new appCollection;
	
	return globalView = Backbone.View.extend({
		el: 'body',
		initialize: function() {
			this.screenNum = 2;
			this.nowScreen = 0;
			this.applistDom = $(this.$('.app-list')[this.nowScreen]);
			//弹框Dom
			this.appManagerDom = document.getElementById("appManager");
			
			this.listenTo(appList, 'add', this.addOneApp);
			this.listenTo(appList, 'reset', this.addAllApps);
			
			appList.fetch({url: interfaces.getAppList});//{url: interfaces.getAppList}
			//appList.reset();
		},
		render: function() {
			
		},
		events: {
			'click .app-guide img': 'showScreenApps',
			'click .app-demo': 'showNewTag',
			'click #moreApp': 'alertAppMngr',
			'click #closeAppMngr': 'closeAppMngr'
		},
		addHoverToApp: function() {
			$('.app-demo').hover(function(){
				$(this).find('.delete-btn').show();	
			},function() {
				$(this).find('.delete-btn').hide();	 
			});
		},
		addOneApp: function(oneApp) {
			var view = new appView({model: oneApp});
			this.applistDom.append(view.render().el);
			this.initDrag();
			this.addHoverToApp();
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
		showScreenApps: function(event){
			event = event || window.event;
			event.target = event.target || event.srcElement;
			//具有属性data-index的 img才是小圆点
			var index = event.target.getAttribute('data-index'); 
			if(index){
				//将所有小圆点变成灰色
				this.circleDom = $('.app-guide img');
				var len = this.circleDom.length;
				this.circleDom.each(function(i){
					if(i > 0 && i < len - 1) {
						$(this).attr({src: interfaces.circles[1]});					
					}
				});
				//将当前屏幕的小圆点设置为激活状态
				event.target.setAttribute('src', interfaces.circles[0]);
				
				//applist列表
				this.nowScreen = index;
				this.applistDom = $(this.$('.app-list')[this.nowScreen]);
				this.applistDom.empty();
				appList.fetch({url: interfaces.getAppList});
				
				//屏幕滑动切换
				var marginLeft = index * -100;
				var $appPages = $('.app-pages');
				$appPages.animate({'marginLeft': marginLeft + '%'});
			}
		},
		showNewTag: function() {
			alert()
		},
		alertAppMngr: function() {
			this.appManagerDom.style.display = 'block';
		},
		closeAppMngr: function() {
			this.appManagerDom.style.display = 'none';
		}
	});
	
});