$(function () {
    $.showLoading('加载中');
    fieldList(1); //列表
});

// 弹性域列表
function fieldList(pageNum) {
    var token = sessionStorage.getItem("token");
    var companyId = sessionStorage.getItem("companyId");
    $.ajax({
        type: "GET",
        url: APP_URL + "/fieldNameList",
        data: {
            comid: companyId,
            authToken: token,
            limit: 10,
            page: pageNum
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
            $.closeLoading();
            var data = res.data;
            var pages = 10 * (pageNum - 1);
            var str = "";
            if (res.code == "0") {
                $.each(data, function (index, val) {
                    str += `
                     <tr>
                        <td><input type="checkbox" name="del_listID" id="del_listID" data-name="multi-select" value="${val.id}" /></td>
                        <td>${pages+index+1}</td>
                        <td>${val.fieldname}</td>
                        <td><a class="btn ${val.state==0?'btn-danger':'btn-success'}" href="javascript:void(0);">${val.state==0?'禁用':'启用'}</a></td>
                    </tr>
                     `;
                });
                $("#fieldList").html(str);
                getPage(res.count, 'fieldList', pageNum); //分页
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}