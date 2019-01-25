$(function () {
    var userstate = sessionStorage.getItem("userstate");
    $.showLoading('加载中');
    if (userstate == 3) {
        $("#editroleBtn").hide();
        $("#addroleBtn").hide();
    }
    var url = window.location.href;
    if (url.indexOf('=') != -1) {
        var index = url.split('=')[1];
        var indexNum = Math.ceil(index / 10);
        // console.log(indexNum);
        getRole(1) //获取角色列表
    } else {
        getRole(1) //获取角色列表
    }
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
                $("#addroleBtn").attr("data-num", res.count);
                $.each(data, function (index, val) {
                    str += `
                    <tr>
                        <td><input type="checkbox" name="del_listID" id="del_listID" data-name="multi-select" value="${val.id}" data-index="${pages+(index+1)}"/></td>
                        <td>${pages+(index+1)}</td>
                        <td>${val.rolename}</td>
                        <td>${val.userstate==1?'平台管理员':val.userstate==2?'公司管理员':val.userstate==3?'一般职员':''}</td>
                        <td>${moment(val.createtime).format("YYYY年MM月DD日")}</td>
                        <td>${val.isSysinner}</td>
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