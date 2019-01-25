$(function () {
    $(".addForm").attr("action", APP_URL + "/fieldNameEdit");
    var userstate = sessionStorage.getItem("userstate");
    // console.log(userstate);
    var url = window.location.href;
    console.log(url);
    if (userstate == 1) {
        $("#platformCan").show();
        if (url.indexOf("&") == -1) {
            $("#cancelButton").show();
            $("#cancelButtonEdit").hide();
            var indexNum = parseInt(url.split("=")[1]) + 1;
            sessionStorage.setItem("indexNum", indexNum);
            var companyId = sessionStorage.getItem("companyId");
            companyList(); //获取公司下拉列表
            fieldNameAdd(); //新增
        } else {
            $("#cancelButton").hide();
            $("#cancelButtonEdit").show();
            var id = url.split("&")[0].split("=")[1];
            var indexNum = url.split("&")[1].split("=")[1];
            sessionStorage.setItem("indexNum", indexNum);
            $("#cancelButtonEdit").attr("data-index", indexNum);
            fieldNameEdit(id); //编辑
        }
    } else {
        if (url.indexOf("&") == -1) {
            $("#cancelButton").show();
            $("#cancelButtonEdit").hide();
            var indexNum = parseInt(url.split("=")[1]) + 1;
            sessionStorage.setItem("indexNum", indexNum);
            var companyId = sessionStorage.getItem("companyId");
            $("#companyId").val(companyId); //公司id
            fieldNameAdd(); //新增
        } else {
            $("#cancelButton").hide();
            $("#cancelButtonEdit").show();
            var id = url.split("&")[0].split("=")[1];
            var indexNum = url.split("&")[1].split("=")[1];
            sessionStorage.setItem("indexNum", indexNum);
            $("#cancelButtonEdit").attr("data-index", indexNum);
            fieldNameEdit(id); //编辑
        }
    }

});

//新增
function fieldNameAdd() {
    ajax({
        type: "GET",
        success: function (res) {
            console.log(JSON.stringify(res));
            var indexNum = sessionStorage.getItem("indexNum");
            sessionStorage.removeItem("indexNum");
            window.location.href = '../FieldManage/index.html?indexNum=' + indexNum;
        }
    });
}
// 编辑
function fieldNameEdit(id) {
    var token = sessionStorage.getItem("token");
    var userstate = sessionStorage.getItem("userstate");
    $.ajax({
        type: "GET",
        url: APP_URL + "/showfieldName",
        data: {
            authToken: token,
            id: id
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            if (res.code == 0) {
                $("#fieldId").val(id);
                $("#fieldName").val(data.fieldname);
                if (userstate == 1) {
                    $("#platformCan").show();
                    companyList(data.comid);
                } else {
                    $("#companyId").val(data.comid);
                }
                fieldNameAdd(); //修改完成
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// 获取公司下拉列表
function companyList(cid) {
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
                str += `<option value="${val.id}" ${val.id==cid?'selected':''}>${val.companyname}</option>`;
            });
            $("#companySelect").html(str);
        },
        error: function (err) {
            console.log(err);
        }
    });
}