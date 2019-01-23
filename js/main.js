// JavaScript Document
$(document).ready(function (e) {
	$(".topLogOut").click(function () {
		var token = sessionStorage.getItem("token");
		console.log(token);
		$.show({
			title: '退出系统',
			content: '确定要退出系统吗？',
			isConfirm: true,
			callback: function () {
				$.ajax({
					type: "GET",
					url: APP_URL + '/logout',
					data: {
						authToken: token
					},
					dataType: "json",
					success: function (res) {
						console.log(res);
						if (res.code == '0') {
							window.location.href = "../login.html";
							sessionStorage.clear();
						}

					},
					error: function (err) {
						console.log(err);
					}
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
				width: "10%"
			});
			$(".com-rightBox").animate({
				marginLeft: "10%"
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
		var num = $(this).find('.com-TopMenu').attr('data-child');
		if (num > 1) {
			$(".com-leftBox").animate({
				width: "10%"
			});
			$(".com-rightBox").animate({
				marginLeft: "10%"
			});
			$(".com-hideIcon").css({
				"transform": "rotate(90deg)",
				"top": "15px"
			});
			$(".com-hideIcon").attr("title", "隐藏左侧菜单");
			$(".com-hideIcon").attr("data-state", "open");
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
			$('.com-hideIcon').attr("title", "展开左侧菜单");
			$('.com-hideIcon').attr("data-state", "hide");
			$('.com-hideIcon').css({"transform":" rotate(0deg)"},{"top":"17px"});
		}
		var $index = $(this).attr("data-res");
		getChildMenus($index);
	});
});

//获取左侧菜单模块
function getChildMenus(i) {
	var token = sessionStorage.getItem("token");
	$.ajax({
		type: "GET",
		url: APP_URL + "/roleMenu",
		data: {
			authToken: token
		},
		dataType: "json",
		success: function (res) {
			console.log(res);
			if (res.code == "909090") {
				$.show({
					title: '操作提示',
					content: '您已掉线,请重新登录!',
					closeCallback: function () {
						window.location.href = "../login.html";
					}
				});
			}
			var data = res.data;
			var str = "";
			$(".com-rightBox>iframe").attr("src", data[i].childMenus[0].actionPath);
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