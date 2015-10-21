require.config({
	baseUrl: '/smartcf/',
	paths: {
		"jquery": "lib/jquery-2.1.4.min",
		"underscore": "lib/underscore",
		"backbone": "lib/backbone.min",
		"interface": "js/interface",
		'jquery-gridly': 'lib/jquery.gridly/javascripts/jquery.gridly',
		"app-model": "js/model/app-model",
		"app-collection": "js/collection/app-collection",
		"app-view": "js/view/app-view",
		'global-view': 'js/view/global-view',
		'app-tpl': 'js/tpl/app-tpl'
	},
	//加载非AMD规范模块
	shim: {
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: ['jquery', 'underscore'],
			exports: 'Backbone'
		}
	}
});

require(['jquery', 'underscore', 'global-view'], function(jquery, _, globalView) {
	
	var global = new globalView;
	
	//var app = new appModel;
	//app.set({title: ''});
	//app.save();
	
	/*app.fetch({
		url:'json/test.json',
	    success:function(model, response){
	        alert(model.get('title'));
	    },error:function(){
	        alert('error');
	    }
	});*/
})