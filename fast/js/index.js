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
	//用来计数，判断 northDom的 隐藏与显示
	var northCount = 0;
	//用来TAB翻页
	var nowTab = 0;
	
	function init() {
		contentHeight();
		setNowDate();
		bindEvent();
		showTagContent('#content', '我的桌面');
	}
	
	function bindEvent() {
		
		$('.taskbar-exit').click(function() {
			if(confirm("确定注销登录吗？")){
				//注销登录相关操作
				console.log(1);
			}
		});
		
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
		
		$taskbarCenter.on('click', 'span', deleteTab);
		
		$('.preTab').click(function() {
			lastTab();
		});
		
		$('.nextTab').click(function() {
			nextTab();
		});
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
	
	//content 高度自适应兼容性处理
	function contentHeight() {
		/*$content.height() <= 18 表示浏览器不支持css3中的calc()函数 , ie7有最小高度*/
		if($content.height() <= 18){
			var $container = $('#container');
			$content.height($container.height() - 180);
			$(window).resize(function() {
				$content.height($container.height() - 180);
			});
		}
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
				
				/*$('.preTab').click(function() {
					lastTab();
				});
				
				$('.nextTab').click(function() {
					nextTab();
				});*/
			}else {
				$('.preTab').css({visibility: 'hidden'});
				$('.nextTab').css({visibility: 'hidden'});
			}
			
		});
		
		var tmp = (len - 1) * 83 + 103 - $('.taskbar-tab-wrap').width();
		$taskbarCenter.animate({marginLeft: '-' + tmp + 'px'});
		nowTab = Math.ceil(tmp / 80) * (-1);
	}
	
	$(function(){
		init();		
	});
})(index);
