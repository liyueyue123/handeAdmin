$(function () {
    var url = window.location.href;
    var id = url.split("=")[1];
    $.showLoading('加载中');
    messageDetail(1, id);
});

// 详情
function messageDetail(pageNum, id) {
    var token = sessionStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/message/showMessageDetails",
        data: {
            authToken: token,
            id: id,
            limit: 10,
            page: pageNum
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            $.closeLoading();
            var data = res.data;
            var pages = 10 * (pageNum - 1);
            var str = "";
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
            if (res.code == 0) {
                $.each(data, function (index, val) {
                    str += `
                     <tr>
                        <td>${pages+(index+1)}</td>
                        <td>${val.id}</td>
                        <td><img src="${val.icon}" style="width:60px;height:60px;margin:10px;"/></td>
                        <td>${val.name}</td>
                        <td>${val.gender}</td>
                        <td>${val.companyname}</td>
                        <td>${val.departname}</td>
                        <td>${val.phone}</td>
                        <td>${val.address}</td>
                    </tr>
                     `;
                });
                $(".DetailList").html(str);
                getPage(res.count, 'messageDetail', pageNum); //分页
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}