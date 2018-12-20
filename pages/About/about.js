var ue = UE.getEditor('help_content');
$(function () {
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
                ue.ready(function () { //编辑器初始化完成再赋值  
                    ue.setContent(res.data.message); //赋值给UEditor  
                });
            }
        },
        error: function (err) {
            console.log(err);
        }

    });
    //接口地址
    $("#form1").attr("action", APP_URL + "/about/updateAbout");
    editAbout(); //修改关于我们
});

// 修改关于我们
function editAbout() {
    ajax({
        type: 'GET',
        success: function (res) {
            // console.log('success', JSON.stringify(res));
            window.location.reload();
        }
    });
}