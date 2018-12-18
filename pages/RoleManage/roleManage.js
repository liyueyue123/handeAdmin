$(function () {
    getRole() //获取角色列表
});

//获取角色
function getRole() {
    var token = sessionStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/role/list",
        data: {
            authToken: token,
            limit: 10,
            page: 1
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var str = '';
            if (res.code == 0) {
                $.each(data, function (index, val) {
                    str += `
                    <tr>
                        <td><input type="checkbox" name="del_listID" id="del_listID" data-name="multi-select" value=""/></td>
                        <td>${index+1}</td>
                        <td>${val.rolename}</td>
                        <td>${moment(val.createtime).format("YYYY年MM月DD日")}</td>
                        <td>${val.isSysinner}</td>
                    </tr>
                    `;
                });
                $(".list-box tbody").html(str);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}