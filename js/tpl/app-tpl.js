/*
 * ==========================================================
 * @description 某一个app在桌面中的内容
 * @type text/template
 * @templateId oneAppTemplate
 * @author luoxue 
 * @time 20151019
 * ==========================================================
 */
define(function(){
	/*<script type="text/template" id="oneAppTemplate">*/
	
	//<!--<div class="brick app-demo"> app-view.js会自动创建此div-->
	
	return '<button class="delete-btn">移除</button>'
			+	'<div class="app-img">'
			+		'<img src="<%= imgUrl %>" alt="<%= imgTitle %>" />'
			+	'</div>'
			+	'<div class="app-title"><%= imgTitle%></div>';
		//<!--</div>-->
		
	/*</script>*/
})
