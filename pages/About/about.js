$(function () {
    $.showLoading('加载中');
    aboutDetail(); // 关于我们详情
});

// 关于我们详情
function aboutDetail() {
    var ue = UE.getEditor('help_content');
    var token = sessionStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/about/aboutp",
        data: {
            authToken: token
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 0) {
                $.closeLoading();
                ue.ready(function () { //编辑器初始化完成再赋值  
                    ue.setContent(res.data.message); //赋值给UEditor  
                    editAbout(ue); // 编辑关于我们
                });
            }
            if (res.code == "909090") {
                $.show({
                    title: '操作提示',
                    content: '您已掉线,请重新登录!',
                    closeCallback: function () {
                        if (window != top) {
                            top.location.href = "../../login.html";
                        }
                    }
                });
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}


// 修改关于我们
function editAbout(ue) {
    $("#saveButton").click(function () {
        var message = ue.getContent("help_content");
        $.ajax({
            type: "GET",
            url: APP_URL + "/about/updateAbout",
            data: {
                authToken: token,
                id: 1,
                message: message
            },
            dataType: "json",
            success: function (res) {
                console.log(res);
                if (res.code == 0) {
                    $.show({
                        title: '操作提示',
                        content: '内容更新成功！',
                        closeCallback: function () {
                            aboutDetail(); // 更新关于我们
                        }
                    });
                } else if (res.code == "909090") {
                    $.show({
                        title: '操作提示',
                        content: '您已掉线,请重新登录!',
                        closeCallback: function () {
                            if (window != top) {
                                top.location.href = "../../login.html";
                            }
                        }
                    });
                } else {
                    $.show({
                        title: '操作提示',
                        content: '内容更新失败！',
                        closeCallback: function () {
                            aboutDetail(); // 更新关于我们
                        }
                    });
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    });
}