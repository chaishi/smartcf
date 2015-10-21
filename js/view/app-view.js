define(['backbone', 'app-tpl'], function(Backbone, appTpl) {
	
	//加载模板
	var script = document.createElement('script');
	script.type = 'text/template';
	script.id = 'oneAppTemplate';
	script.innerHTML = appTpl;
	document.body.appendChild(script);
	
	//定义appView
	return AppView = Backbone.View.extend({
		className: 'brick app-demo',
		template: _.template($('#oneAppTemplate').html()),
		initialize: function() {
			this.render();
			//执行this.model.destroy后触发，此处属于DOM操作
			this.listenTo(this.model, 'destroy', this.remove);
		},
		render: function() {
			this.$el.html(this.template( this.model.toJSON() ));
			return this;
		},
		events: {
			'click .delete-btn': 'deleteApp'
		},
		//弹出桌面Tagv
		alertDeskTag: function() {
			alert('已弹出！');
		},
		//删除某一个app
		deleteApp: function() {
			this.model.destroy();
		}
	});
});