$(function () {
    $.showLoading('加载中');
    getRole(1) //获取角色列表
});

//获取角色
function getRole(pageNum) {
    var token = sessionStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/role/list",
        data: {
            authToken: token,
            limit: 10,
            page: pageNum
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            $.closeLoading();
            var data = res.data;
            var pages = 10 * (pageNum - 1);
            var str = '';
            if (res.code == 0) {
                $.each(data, function (index, val) {
                    str += `
                    <tr>
                        <td><input type="checkbox" name="del_listID" id="del_listID" data-name="multi-select" value="${val.id}"/></td>
                        <td>${pages+(index+1)}</td>
                        <td>${val.rolename}</td>
                        <td>${moment(val.createtime).format("YYYY年MM月DD日")}</td>
                        <td>${val.isSysinner}</td>
                    </tr>
                    `;
                });
                $(".list-box tbody").html(str);
                getPage(res.count, 'getRole', pageNum); //分页
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}