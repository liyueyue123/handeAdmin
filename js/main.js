// JavaScript Document
$(document).ready(function (e) {
	$(".topLogOut").click(function () {
		$.show({
			title: '退出系统',
			content: '确定要退出系统吗？',
			isConfirm: true,
			callback: function () {
				$.post(APP_URL + '/console/loginOut', '', function (json) {
					window.location.href = "../login.html";
				});
			}
		});
	});

	var bodyHeight = $(window).height() - 110;
	$(".com-leftBox").height(bodyHeight);
	$(".com-rightBox").height(bodyHeight);
	//左侧菜单动画
	$(".com-hideIcon").click(function () {
		var state = $(this).attr("data-state");
		if (state == 'hide') {
			$(".com-leftBox").animate({
				width: "230px"
			});
			$(".com-rightBox").animate({
				marginLeft: "230px"
			});
			$(this).css({
				"transform": "rotate(90deg)",
				"top": "15px"
			});
			$(this).attr("title", "隐藏左侧菜单");
			$(this).attr("data-state", "open");
		} else {
			$(".com-leftBox").animate({
				width: "0px"
			});
			$(".com-rightBox").animate({
				marginLeft: "0px"
			});
			$(this).css({
				"transform": "rotate(0deg)",
				"top": "17px"
			});
			$(this).attr("title", "展开左侧菜单");
			$(this).attr("data-state", "hide");
		}
	});

	//点击主模块获取次模块列表
	$('.com-hmUl>li').live("click",function () {
		// console.log($(this));
		var thisID = $(this).find(".com-TopMenu").attr('data-id');
		console.log(thisID)
		if (thisID != '0') {
			$(".com-leftBox").animate({
				width: "230px"
			});
			$(".com-rightBox").animate({
				marginLeft: "230px"
			});
			$(".com-hideIcon").css({
				"transform": "rotate(90deg)",
				"top": "15px"
			});
			$(".com-hideIcon").attr("title", "隐藏左侧菜单");
			$(".com-hideIcon").attr("data-state", "open");
		}
		
		// $.post(APP + '/Common/getLeftMenuList', {
		// 	moduleTypeID: thisID
		// }, function (data) {
		// 	var html = '';
		// 	if (data != null) {
		// 		for (var i = 0; i < data.length; i++) {
		// 			html += '<li><i class="fa fa-' + data[i].moduleIcon + '"></i> <a data-id="' + data[i].id + '" href="' + APP + data[i].moduleLink + '" target="right">' + data[i].moduleName + '</a></li>';
		// 		}
		// 		$('.com-leftMenu').html(html);
		// 		$('.com-leftMenu a').click(function (event) {
		// 			var thisID = $(this).attr('data-id');
		// 			if (thisID == '40' || thisID == '36') {
		// 				$(".com-leftBox").animate({
		// 					width: "0px"
		// 				});
		// 				$(".com-rightBox").animate({
		// 					marginLeft: "0px"
		// 				});
		// 				$(".com-hideIcon").css({
		// 					"transform": "rotate(0deg)",
		// 					"top": "17px"
		// 				});
		// 				$(".com-hideIcon").attr("title", "展开左侧菜单");
		// 				$(".com-hideIcon").attr("data-state", "hide");
		// 			}
		// 		});
		// 	} else {
		// 		$('.com-leftMenu').html('');
		// 	}
		// });
	});

});