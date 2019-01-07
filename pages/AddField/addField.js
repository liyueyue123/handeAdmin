$(function () {
    $(".addForm").attr("action", APP_URL + "/fieldNameEdit");
    var url = window.location.href;
    if (url.indexOf("=") == -1) {
        var companyId = sessionStorage.getItem("companyId");
        $("#companyId").val(companyId); //公司id
        fieldNameAdd(); //新增
    } else {
        var id = url.split("=")[1];
        // console.log(id);
        fieldNameEdit(id); //编辑
    }
});

//新增
function fieldNameAdd() {
    ajax({
        type: "GET",
        success: function (res) {
            console.log(JSON.stringify(res));
            window.location.href = '../FieldManage/index.html';
        }
    });
}
// 编辑
function fieldNameEdit(id) {
    var token = sessionStorage.getItem("token");
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
                $("#companyId").val(data.comid);
                fieldNameAdd();  //修改完成
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}