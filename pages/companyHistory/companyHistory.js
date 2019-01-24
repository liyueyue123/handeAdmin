$(function () {
    var url = window.location.href; // 首先获取到你的URL地址;
    var arr = url.split("="); // 用“&”将URL分割成2部分每部分都有你需要的东西;
    var id = arr[1];
    getHistoryList(1,id) //获取角色列表
});

//获取角色
function getHistoryList(pageNum,id) {
    var token = sessionStorage.getItem("token");
    // var userId = sessionStorage.getItem("userId");
    $.ajax({
        type: "GET",
        url: APP_URL + "/searchEnsearchs",
        data: {
            authToken: token,
            limit: 10,
            page: pageNum,
            userid: id,
        },
        dataType: "json",
        success: function (res) {
            console.log('history',res);
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
                        <td class="hideCompany">${val.search}</td>
                        <td>${moment(val.createtime).format("YYYY年MM月DD日")}</td>
                    </tr>
                    `;
                });
                $(".list-box tbody").html(str);
                $('input[data-name=multi-select]').iCheck({
                    checkboxClass: 'icheckbox_flat-blue',
                    radioClass: 'iradio_flat-blue'
                });
                getPage(res.count, 'getRole', pageNum); //分页
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