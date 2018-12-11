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
	$('.com-hmUl>li').live("click", function () {
		var thisID = $(this).find(".com-TopMenu").attr('data-id');
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
		var $index = $(this).attr("data-res");
		getChildMenus($index);
	});

});

function getChildMenus(i) {
	var token = sessionStorage.getItem("token");
	// console.log(token)
	$.ajax({
		type: "GET",
		url: APP_URL + "/roleMenu",
		data: {
			authToken: token
		},
		dataType: "json",
		success: function (res) {
			console.log(res);
			var data = res.data;
			var str = "";
			$(".com-rightBox>iframe").attr("src",data[i].childMenus[0].actionPath);
			$.each(data[i].childMenus, function (index, val) {
				if (val != []) {
					str += `
						<li>
							<a class="com-TopMenu" data-id="${val.id}" href="${val.actionPath}" target="right">
								<i class="fa>"></i>
								${val.menuName}
							</a>
						</li>
					`;
				}
			});
			$(".com-leftBox>.com-leftMenu").html(str);
		}
	});
}