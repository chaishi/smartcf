/* 
 * ======================================================================
 * @description 我的桌面对应js
 * @author luoxue
 * @time 20151012-20151016
 * ======================================================================
 */

var appsDesk = {};

(function(page){
	//弹框DOM
	var appManagerDom = document.getElementById("appManager");
	//触发弹框的button
	var moreAppDom = document.getElementById('moreApp');
	//关闭弹框button
	var closeAppMngrDom = document.getElementById("closeAppMngr");
	//小圆点父节点Dom
	var $circlesParent = $('.app-guide');
	//弹框左侧app分类列表父节点
	var $sidebarMiddle = $('.sidebar-middle');
	//弹框中，“应用设置”和”分屏设置“父节点
	var $dialogGuide = $('.dialog-guide');
	//app分类列表上一批下一批
	var $recUp = $('.rec-up');
	var $recDown = $('.rec-down');
	//弹框中app列表Dom
	var $dialogAppList = $('.dialog-app-list');
	//桌面上app列表Dom
	var $appList = $('.app-list');
	//弹框中分屏设置Dom
	var $screenSetting = $('.screen-setting');
	//弹框中，分屏设置，提示信息显示Dom
	var $warningInfo = $('.warning-info');
	var $content = $('#content');
	//flag用于标记弹框中，当前分组列表是第几批
	var flag = 0;
	//flagMax 表示分组列表一共有多少批
	var flagMax = 0;
	//当前是第几屏
	var nowScreen = 0;
	//屏幕总数数
	var screenNum = 2;
	//小圆点图片
	var imgUrls = [
					//紫色，当前屏幕为选中状态的小圆点
					'http://42.96.175.100/static/theme/15/images/slidebox/2.png', 
					//灰色，当前屏幕为非选中状态的小圆点
					'http://42.96.175.100/static/theme/15/images/slidebox/3.png'  
				  ];
	
	//页面初始化函数
	page.init = function() {
		page.bindEvent();
		showScreenApps(0);
		showScreenApps(1);
		setMarginLeft(0);
		setScreenSetting();
	}
	
	//初始化拖拽
	function initDrag() {
		$( ".app-list" ).sortable();//初始化拖拽控件
    	$( ".app-list" ).disableSelection();//禁止选择
	}
	 
	/* ====================================================================================
	 * @description 事件处理程序
	 ====================================================================================*/
	
	//事件处理函数
	page.bindEvent = function() {
		moreAppDom.onclick = alertAppList;
		closeAppMngrDom.onclick = hidePannel;
		$recUp.click(function(){lastAppGroup();});
		$recDown.click(function(){nextAppGroup();});
		circleEvent();
		appGroupEvent();
		dialogFuncChangeEvent();
		dialogSideBarEvent();
		dialogAppListEvent();
		
		$appList.on('click', '.delete-btn',function(event){
			event = event || window.event;
			if(event.stopPropagation){
				event.stopPropagation();
			}else if(event.cancelBubble) {
				event.cancelBubble();
			}
			$(this).parent().remove();
		});
		
		addHoverEvent();
		addClickToApp();
	}
	
	//弹框中，分屏设置，鼠标悬停在屏幕上时，出现删除按钮
	function screenHoverEvent() {
		$('.screen-num-in').hover(function(){
			$(this).find('button').show();
		},function(){
			$(this).find('button').hide();
		});
	}
	
	//弹框中，分屏设置，用户点击删除按钮事件
	function screenDeleteEvent() {
		$screenSetting.unbind('click'); //先清除之前的点击事件
		$screenSetting.on('click', 'button', function(){
			var index = $(this).index();
			if(confirm('确认删除该屏幕吗？')) {
				$(this).parent().parent().remove();	
				deleteScreen(index);
			}
		});
	}
	
	//鼠标悬浮在某个app上面时，出现删除按钮
	function addHoverEvent() {
		$('.app-demo').hover(function(){
			$(this).find('.delete-btn').show();	
		},function() {
			$(this).find('.delete-btn').hide();	 
		});
	}
	
	//为APP应用添加点击事件
	function addClickToApp() {
		$appList.unbind('dblclick');
		$appList.on('dblclick', '.app-demo',function(){
			var title = $(this).find('.app-title').html();
			index.addTab(title);
		});
	}
	
	//为小圆点代理事件处理程序，点击小圆点，app列表跳转到对应屏幕
	function circleEvent() {
		$circlesParent.on('click', 'img', function(){
			var index = $(this).index();
			if(index < $('.app-guide img').length - 1) { // 因为最后一张图片不是小圆点，所以过滤掉
				nowScreen = index - 1; //记录当前是第几屏
				showScreenApps(index - 1); //因为第一张图片不是小圆点，所以减1
				setMarginLeft(index - 1);
				//对应小圆点显示为紫色
				setActiveCircle(index - 1);
				
				initDrag();
			}
		});
	}
	
	//为app分类列表添加代理处理程序，点击app分类时，对应分类背景色变白，右侧出现对应类别的app列表
	function appGroupEvent() {
		$sidebarMiddle.on('click', 'li', function(){
			var index = $(this).index();
			setActiveAppGroup(index);
			findApplistByGroup(index);
		});
	}
	
	//弹框功能切换，“应用设置”和”分屏设置“，添加事件处理程序
	function dialogFuncChangeEvent() {
		$dialogGuide.on('click', 'img', function(){
			var index = $(this).index();
			if(index === 0){
				showAppSetting();
			}else {
				showScreenSetting();
			}
		});
	}
	
	//为弹框侧边栏添加滚动事件
	function dialogSideBarEvent() {
		$sidebarMiddle[0].onmousewheel = function(event){
			var event = event || window.event;
			if(event.wheelDelta){
				if(event.wheelDelta === 120){
					lastAppGroup();
				}else {
					nextAppGroup();
				}
			}else if(event.detail){
				if(event.detail === -2) {
					lastAppGroup();
				}else {
					nextAppGroup();
				}
			}
		};
	}
	
	//为弹框中，appList添加事件代理，点击某一个app即可将 其添加到当前屏幕
	function dialogAppListEvent() {
		$dialogAppList.on('click', '.group-one-app', function() {
			var me = $(this);
			var imgUrl = me.find('img').attr('src');
			var appTitle = me.find('.one-app-title').html();
			me.remove();
			addAppToScreen(imgUrl, appTitle);
		});
	}
	
	/* ====================================================================================
	 * @description content应用程序
	 ====================================================================================*/
	
	//添加app应用到屏幕
	function addAppToScreen(imgUrl, appTitle){
		var appPages = $('.app-page');
		var appList = $(appPages[nowScreen]).find('.app-list');
		if(appList.find('.app-demo').length >= 21) {
			alert("该屏幕数量已经超过21，不能再添加！");
			return;
		}
		var html = '<div class="app-demo">'
				 +		'<button class="delete-btn">移除</button>'
				 +		'<div class="app-img">'
				 +			'<img src="'+imgUrl+'" alt="'+appTitle+'" />'
				 +		'</div>'
				 +		'<div class="app-title">'+appTitle+'</div>'
				 +	'</div>';
		appList.append(html);
		addHoverEvent();
		addClickToApp();
		initDrag();
	}
	
	//页面一开始，隐藏app列表管理； 点击关闭按钮，立即关闭app应用管理弹框
	function hidePannel() {
		appManagerDom.style.visibility = 'hidden';
	}
	
	//点击更多应用图标，弹出app列表管理框，并加载分类列表
	function alertAppList() {
		appManagerDom.style.visibility = 'visible';
		getAppGroupList();
		showAppSetting();
	}
	
	/*
	 * @description 根据屏幕下标显示对应的app列表
	 * @param {number} index = 0, margin-left = -100% 显示低易品； index = 1, margin-left = -200%，显示第二屏……
	 */
	function showScreenApps(index) {
		
		//获取applist
		$.getJSON(
			interfaces.getApps,
			{
				index: index
			}, 
			function(data) {
				var appList = $($('.app-page')[index]).find('.app-list');
				var html = '';
				var htmlArr = [];
				var list = data.img;
				for(var i = 0, len = list.length; i < len; i++) {
					html = '<div class="app-demo">'
						 +		'<button class="delete-btn">移除</button>'
						 +		'<div class="app-img">'
						 +			'<img src="'+list[i].imgUrl+'" alt="'+list[i].imgTitle+'" />'
						 +		'</div>'
						 +		'<div class="app-title">'+list[i].imgTitle+'</div>'
						 +	'</div>';
					htmlArr.push(html);
				}
				appList.html(htmlArr.join(''));
				addHoverEvent();
				addClickToApp();
				initDrag();
			}
		);
	}
	
	//设置左外边距
	function setMarginLeft(index) {
		var marginLeft = index * -100;
		var $appPages = $('.app-pages');
		$appPages.animate({'marginLeft': marginLeft + '%'});
	}
	
	/*
	 * @description 点击小圆点时，激活当前圆点，颜色变为紫色，其它小圆点颜色变为灰色
	 * @param {number} index 小圆点下标
	 */
	function setActiveCircle(index) {
		var $imgs = $('.app-guide img');
		$imgs.each(function(i){
			if(i > 0 && i < $imgs.length - 1) {
				if(( i - 1) === index) {	
					$(this).attr('src', imgUrls[0]);
				}else {
					$(this).attr('src', imgUrls[1]);
				}
			}
		});
	}
	
	//显示应用设置
	function showAppSetting() {
		$('.app-setting').show();
		$('.screen-setting').hide();
	}
	
	//显示分屏设置
	function showScreenSetting() {
		$('.app-setting').hide();
		$('.screen-setting').show();
	}
	
	/*=================================================================================
	 * @description 弹框中，应用设置相关函数
	 ==================================================================================*/
	
	//获取app分类列表
	function getAppGroupList() {
		$.getJSON(
			interfaces.getAppGroupList,
			function(data){
				var html = '';
				var htmlArr = ['<ul>'];
				var list = data.groups;
				for(var i = 0, len = list.length; i < len; i++) {
					html = '<li><img src="'+list[i].iconUrl+'"/>'+list[i].groupTitle+'</li>';
					htmlArr.push(html);
				}
				htmlArr.push('</ul>');
				$('.sidebar-middle').html(htmlArr.join(''));
				setActiveAppGroup(0);
				flagMax = Math.ceil(len / 6);
			}
		);
	}
	
	//用户点击某个分类时，背景色变白
	function setActiveAppGroup(index) {
		$('.sidebar-middle li').each(function(i){
			if(i === index) {
				$(this).addClass('sidebar-bg-active');
			}else {
				$(this).removeClass('sidebar-bg-active');
			}
		});
	}
	
	//根据app分类Id， 查询app列表
	function findApplistByGroup() {
		$.getJSON(
			interfaces.getApps,
			function(data) {
				var html = '';
				var htmlArr = [];
				var list = data.img;
				for(var i = 0, len = list.length; i < len; i++) {
					html = '<div class="group-one-app">'
						 +		'<div class="one-app-img">'
						 +				'<img src="http://42.96.175.100/static/theme/15/images/app_icons/calendar.png" align="日程安排">'
						 +			'</div>'
						 +			'<div class="one-app-title">日程安排</div>'
						 +		'</div>';
					htmlArr.push(html);
				}
				$('.dialog-app-list').html(htmlArr.join(''));
			}
		);
	}
	
	//上一批app分类列表
	function lastAppGroup() {
		if(flag > 0){
			flag--;
			showGroupList(flag * -286 + 'px');
		}
	}
	
	//下一批app分类列表
	function nextAppGroup() {
		if(flag < flagMax - 1){
			flag++;
			showGroupList(flag * -286 + 'px');
		}
	}
	
	/*
	 * @description 显示用户滚动或者选择的groupList
	 * @param {string} marginTop,如 100px
	 */
	function showGroupList(marginTop) {
		$('.sidebar-middle ul').animate({'margin-top': marginTop});
	}
	
	/*=================================================================================
	 * @description 弹框中，分屏设置相关函数
	 ==================================================================================*/
	
	
	//弹框中，屏幕设置，显示屏幕数量
	function setScreenSetting() {
		var html = '';
		var htmlArr = [];
		for(var i = 0; i < screenNum; i++) {
			html = '<div class="screen-num">'
				+		'<div class="screen-num-in">'
				+			'<button>删除</button>'
				+			'<span>'+(i + 1)+'</span>'
				+		'</div>'
				+	'</div>';
			htmlArr.push(html);		
		}
		htmlArr.push('<div class="screen-add">+</div>');
		$('.screen-setting').html(htmlArr.join(''));
		$('.screen-add').click(function(){addScreen();});
		//添加浮动事件
		screenHoverEvent();
		//给删除按钮添加事件
		screenDeleteEvent();
	}
	
	//添加屏幕
	function addScreen() {
		if(screenNum < 6) {
			screenNum++; //屏幕总数加1
			nowScreen = screenNum - 1;
		}else {
			alert('屏幕数量已超限，不能再添加！')
			return;
		}
		html = '<div class="screen-num">'
				+		'<div class="screen-num-in">'
				+			'<button>删除</button>'
				+			'<span>'+screenNum+'</span>'
				+		'</div>'
				+	'</div>';
		$('.screen-add').before(html);
		
		addCircle();
		//对应小圆点显示为紫色
		setActiveCircle(screenNum - 1);
		
		//增加$('.app-pages')宽度，每一屏的宽度为 1/screenNum
		$('.app-pages').width(screenNum * 100 + '%');
		
		//在桌面上面添加新的屏幕
		$('#app-pages').append('<div class="app-page"><div class="gridly app-list"></div></div>');
		$('.app-page').width(Math.floor(1/screenNum * 100) + '%');
		
		//设置左外边距，即设置显示哪一个屏幕
		var marginLeft = (screenNum - 1) * -100;
		var $appPages = $('.app-pages');
		$appPages.animate({'marginLeft': marginLeft + '%'});
		
		//添加浮动事件
		screenHoverEvent();
		//给删除按钮添加事件
		screenDeleteEvent();
		
		$warningInfo.html('屏幕添加成功！');
	}
	
	//删除屏幕
	function deleteScreen(index) {
		screenNum--;
		$warningInfo.html('屏幕删除成功！');
		setScreenSetting();
		//移除桌面上的屏幕
		$($('.app-page')[index]).remove();
		//移除小圆点
		removeCircle(index + 1);
		setActiveCircle(index);
		//屏幕数量改变之后，样式需要重新调整
		$('.app-pages').width(screenNum * 100 + '%');
		$('.app-page').width(Math.floor(1/screenNum * 100) + '%');
		var marginLeft = (screenNum - 1) * -100;
		var $appPages = $('.app-pages');
		$appPages.animate({'marginLeft': marginLeft + '%'});
	}
	
	//添加屏幕的同时，增加小圆点
	function addCircle() {
		var img = document.createElement('img');
		img.src = imgUrls[1];
		moreAppDom.parentNode.insertBefore(img, moreAppDom);
	}
	
	/*
	 * @description 删除屏幕时，移除小圆点
	 * @param {number} index 待删除小圆点的下标
	 * @example removeCircle(1) 删除第一个小圆点
	 */
	function removeCircle(index) {
		var parentDom = moreAppDom.parentNode;
		var imgs = document.getElementsByTagName('img');
		parentDom.removeChild(imgs[index]);
	}
	
	page.init();
	
})(appsDesk);


