$(function () {
    $(".addForm").attr("action", APP_URL + "/permission/addStage");
    companyList(); //获取公司下拉列表
    var userstate = sessionStorage.getItem("userstate");
    if (userstate == 1) {
        $("#platformCan").show();
        addStage(); //新增阶段
    }
    var url = window.location.href;
    // var indexNum = parseInt(url.split("=")[1]) + 1;
    sessionStorage.setItem("indexNum", 10);
});

// 新增阶段
function addStage() {
    ajax({
        type: "GET",
        success: function (res) {
            console.log(JSON.stringify(res));
            var indexNum = sessionStorage.getItem("indexNum");
            sessionStorage.removeItem("indexNum");
            window.location.href = '../StageManage/index.html?indexNum=' + indexNum;
        }
    });
}

// 获取公司下拉列表
function companyList() {
    var token = sessionStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/companySelect",
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
                        if (window != top) {
                            top.location.href = "../../login.html";
                        }
                    }
                });
            }
            var data = res.data;
            var str = "";
            str += `<option value="" selected="">选择公司进行搜索</option>`;
            $.each(data, function (index, val) {
                str += `<option value="${val.id}">${val.companyname}</option>`;
            });
            $("#companySelect").html(str);
        },
        error: function (err) {
            console.log(err);
        }
    });
}