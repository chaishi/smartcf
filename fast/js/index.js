/* 
 * ==================================================================
 * @author luoxue 
 * @time 20151020
 * @description 首页js
 * ==================================================================
 */

var index = {};

(function(index){
	
	var $content = $('#content');
	var timeAreaDom = document.getElementById('time_area');
	var dateDom = document.getElementById("date");
	var mdateDom = document.getElementById("mdate");
	var $taskbarHide = $('.taskbar-hide');
	var $north = $('#north');
	var $taskbar = $('#taskbar');
	var $taskbarCenter = $('#taskbar-tab-list');
	var $menueList = $('#menue-list');
	var $menueGroupList = $('.menue-group-list');
	//用来计数，判断 northDom的 隐藏与显示
	var northCount = 0;
	//用来TAB翻页
	var nowTab = 0;
	
	function init() {
		setNowDate();
		bindEvent();
		getMenueGroup();
		showTagContent('#content', '我的桌面');
	}
	
	function bindEvent() {
		
		$taskbarHide.click(function(){ 
			if(northCount % 2 === 0) {
				hideNorthDom(); 
			}else {
				showNorthDom();
			}
			northCount++;
		});
		
		$taskbarCenter.on('click', '.taskbar-tab', function(){
			var index0 = $(this).index();
			index.setActiveTab(index0);
		});
		
		$('.menue-content-left').on('click', '.one-first-munue', function() {
			var index0 = $(this).index();
			setActiveMenue(index0);
			getAppsByGroup( $(this).find('span').html() );
		});
		
		$('.menue-content-right').on('click', '.one-fast-app', function() {
			var title = $(this).find('.fast-app-title').html();
			index.addTag(title);
		});
		
		$('.menue-content-center').on('click', '.menue-one-app', function() {
			var title = $(this).html();
			index.addTag(title);
		});
		
		$taskbarCenter.on('click', 'span', deleteTab);
		
		$('.menue-group-list')[0].onmousewheel = function(event){
			var event = event || window.event;
			if(event.wheelDelta){
				if(event.wheelDelta === 120){
					menueScrollUp();
				}else {
					menueScrollDown();
				}
			}else if(event.detail){
				if(event.detail === -2) {
					menueScrollUp();
				}else {
					menueScrollDown();
				}
			}
		};
		
		document.body.onclick = function(event){
			event = event || window.event;
			event.target = event.target || event.srcElement;
			
			var domClass = event.target.getAttribute('class');
			switch(domClass) {
				case 'preTab': {lastTab();}break;
				case 'nextTab': {nextTab();}break;
				case 'taskbar-exit': {confirm('确定注销登录吗?');}break;
				case 'scroll-down': {menueScrollDown();}break;
				case 'scroll-up': {menueScrollUp();}break;
				default: break;
			}
			
			var domId = event.target.getAttribute('id');
			if(domClass == undefined) {
				domClass = 'none';
			}
			if($menueList.css('display') !== 'none' &&  //菜单列表已经展开才能收起
				$menueList.find('.' + domClass.split(' '))[0] == undefined) {//点击菜单列表本身，不收起
				$menueList.slideUp(200);
			}else if( domId === 'taskbar-menu' ) {
				$menueList.slideDown(200);
			}
		}
		
	}
	
	/**
	 * @param {String} select 选择器
	 * @param {String} title title不同加载的content 内容便不同
	 */
	function showTagContent(select, title) {
		var interfaceHtml = '';
		switch(title) {
			case '我的桌面': interfaceHtml = interfaces.myDeskHtml;break;
			case '日程安排': interfaceHtml = interfaces.dailyHtml;break;
			case '投票': interfaceHtml = interfaces.ticketsHtml;break;
			default: interfaceHtml = interfaces.nothingHtml;break;
		}
		$.ajax({
			type:"get",
			url:interfaceHtml, //interfaces.myDeskHtml,
			success: function(data) {
				$(select).html(data);
			},
			error: function() {
				alert('我的桌面加载失败！');
			}
		});
	}
	
	//设置当前日历
	function setNowDate() {
		var date = calendar.GetDateString();
		var lunar = '农历' + calendar.GetcDateString().slice(7, 13);
		var tmp = new Date;
		var time = tmp.getHours() + ':' + (tmp.getMinutes() < 10 ? '0' +  tmp.getMinutes() : tmp.getMinutes());
		timeAreaDom.innerHTML = time;
		dateDom.innerHTML = date;
		mdateDom.innerHTML = lunar;
		setTimeout(function(){setNowDate();}, 60000)
	}
	
	//隐藏顶部
	function hideNorthDom() {
		$taskbar.animate({marginTop: 0}, 'fast');
		$north.hide();
		$taskbarHide.css({'background-position': '-144px 0px'});
	}
	
	//显示顶部
	function showNorthDom() {
		$taskbar.animate({marginTop: '78px'}, 'fast');
		$north.show();
		$taskbarHide.css({'background-position': '-117px 0px'});
	}
	
	//下一批
	function nextTab() {
		nowTab--;			
		var margin = nowTab * 80;
		var len = $('.taskbar-tab').length;
		var tmp = (len - 1) * 83 + 103 - $('.taskbar-tab-wrap').width();
		if(margin * (-1) > tmp) {
			margin = tmp;
			margin *= (-1);
		}
		$taskbarCenter.animate({marginLeft: margin + 'px'});
	}
	
	//上一批
	function lastTab() {
		nowTab = 0;
		$taskbarCenter.animate({marginLeft: 0});
	}
	
	//激活某一个tab
	index.setActiveTab = function(index) {
		$('.taskbar-tab').each(function(i){
			if(i === index) {
				$(this).addClass('taskbar-tab-active');
				$(this).find('span').addClass('tab-close');
			}else {
				$(this).removeClass('taskbar-tab-active');
				$(this).find('span').removeClass('tab-close');
			}
		});
		var title = $($('.taskbar-tab')[index]).find('a').html();
		showTagContent('#content', title);
	}
	
	//删除TAB
	function deleteTab(event) {
		//.taskbar-tab 中包含span， 需要阻止事件冒泡
		event = event || window.event;
		if(event.stopPropagation){
			event.stopPropagation();
		}else if(event.cancelBubble) {
			event.cancelBubble();
		}
		
		var index0 = $(this).parent().index();
		$(this).parent().remove();
		if(index0 !== 0) {
			index0--;
		}
		index.setActiveTab(index0);
		
		if( $('#taskbar-center').width() <= $('.taskbar-tab-wrap').width() ) {
			$('.preTab').css({visibility: 'visible'});
			$('.nextTab').css({visibility: 'visible'});
		}
	}
	
	//添加一个Tab
	index.addTag = function(title) {
		//首先判断是否已经添加过
		var flag = false;
		$('.taskbar-tab').each(function() {
			if($(this).find('a').html() == title ) {
				flag = true;
				return;
			}
		});
		if(flag) {
			alert('该窗口已经添加！')
			return;
		}
		var html = '<div class="taskbar-tab"><a class="tab">'+title+'</a><span></span></div>';
		$taskbarCenter.append(html);
		
		var len = $('.taskbar-tab').length;
		index.setActiveTab(len - 1);
		
		//判断已经添加的TAB数量是否超出能够显示的范围
		if( $('#taskbar-center').width() <= $('.taskbar-tab-wrap').width() ) {
			$('.preTab').css({visibility: 'visible'});
			$('.nextTab').css({visibility: 'visible'});
		}
		$(window).resize(function() {
			//判断已经添加的TAB数量是否超出能够显示的范围
			if( $('#taskbar-center').width() <= $('.taskbar-tab-wrap').width() ) {
				$('.preTab').css({visibility: 'visible'});
				$('.nextTab').css({visibility: 'visible'});
				nowTab = 0;
				$taskbarCenter.css({marginLeft: 0});
			}else {
				$('.preTab').css({visibility: 'hidden'});
				$('.nextTab').css({visibility: 'hidden'});
			}
			
		});
		
		var tmp = (len - 1) * 83 + 103 - $('.taskbar-tab-wrap').width();
		$taskbarCenter.animate({marginLeft: '-' + tmp + 'px'});
		nowTab = Math.ceil(tmp / 80) * (-1);
	}
	
	//menue
	function setActiveMenue(index0) {
		$('.one-first-munue').each(function(i){
			if(i === index0) {
				$(this).addClass('active-menue');
			}else {
				$(this).removeClass('active-menue');
			}
		});
	}
	
	//获取菜单分组
	function getMenueGroup() {
		$.getJSON(
			interfaces.getAppGroupList,
			function(data) {
				var html = '';
				var htmlArr = [];
				var list = data.groups;
				for(var i = 0, len = list.length; i < len; i++) {
					html = 	'<div class="one-first-munue">'
						+		'<img class="img" src="'+list[i].iconUrl+'" />'
						+		'<span class="title">'+list[i].groupTitle+'</span>'
						+	'</div>';
						htmlArr.push(html);
				}
				$('.menue-group-list').html(htmlArr.join(''));
				getAppsByGroup(list[0].groupTitle);
			}
		);
	}
	
	function menueScrollUp() {
		var margin = $menueGroupList.css('marginTop');
		var dis = parseInt( margin.slice(0, margin.length - 2) ) + 388;
		if(dis > -6) {
			dis = -6;
		}
		$menueGroupList.animate({marginTop: dis + 'px' }, 'fast');			
	}
	
	function menueScrollDown() {
		var margin = $menueGroupList.css('marginTop');
		var dis = parseInt( margin.slice(0, margin.length - 2) ) - 388;
		var tmp = $menueGroupList.height() - $('.menue-group-list-wrap').height();
		if( tmp  < dis * -1) {
			dis = tmp * (-1);
		}
		$menueGroupList.animate({marginTop: dis + 'px'}, 'fast');
	}
	
	//根据左侧分组获取app列表
	function getAppsByGroup(title) {
		$.getJSON(
			interfaces.getApps,
			/*{
				groupTitle: title
			},*/
			function(data) {
				var list = data.img;
				var html = '';
				var htmlArr = [];
				for(var i = 0, len = list.length; i < len; i++) {
					html = '<div class="menue-one-app">'+list[i].imgTitle+'</div>';
					htmlArr.push(html);
				}
				$('.menue-content-center').html(htmlArr.join(''));
			}
		);
	}
	
	$(function(){
		init();		
	});
})(index);
