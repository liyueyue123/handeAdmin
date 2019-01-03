$(function () {
    $.showLoading('加载中');
    var ue = UE.getEditor('help_content');
    // 获取关于我们详情
    var token = sessionStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/about/about",
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
                                // if(res.code==0){
                                //     window.location.reload();
                                // }
                            },
                            error: function (err) {
                                console.log(err);
                            }
                        });
                    });
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
});
