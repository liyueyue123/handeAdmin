$(function () {
    var url = window.location.href;
    var id = url.split("=")[1];
    // console.log(url);
    customerDetail(id);
});

function customerDetail(customerId) {
    var token = sessionStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/show_details",
        data: {
            authToken: token,
            Id: customerId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var arr1 = [];
            $.each(data.phones, function (index, val) {
                arr1.push(val.phone);
            });
            var tels = arr1.toString();
            var arr2 = [];
            $.each(data.dreTags, function (index, val) {
                arr2.push(val.tagName);
            });
            var tags = arr2.toString();
            var str = "";
            str += `
                <tr>
                    <td align="center">ID</td><td width="38%">${data.dreCustomer.id}</td>
                    <td align="center">名片照片</td><td><img src="${data.dreCustomer.cardcasephoto}"/></td>
                </tr>
                <tr>
                    <td align="center">姓名</td><td>${data.dreCustomer.customerName}</td>
                    <td align="center">性别</td><td>${data.dreCustomer.gender}</td>
                </tr>
                <tr>
                    <td align="center">职位</td><td>${data.dreCustomer.position}</td>
                    <td align="center">公司</td><td>${data.dreCustomer.company}</td>
                </tr>
                <tr>
                    <td align="center">计划成单日期</td><td>${moment(data.dreCustomer.planfinishtime).format("YYYY年MM月DD日")}</td>
                    <td align="center">邮箱</td><td>${data.dreCustomer.email}</td>
                </tr>
                <tr>
                    <td align="center">联系方式</td><td>${tels}</td>
                    <td align="center">地址</td><td>${data.dreCustomer.address}</td>
                </tr>
                <tr>
                    <td align="center">网址</td><td>${data.dreCustomer.webUrl}</td>
                    <td align="center">微信</td><td>${data.dreCustomer.wechat}</td>
                </tr>
                <tr>
                    <td align="center">分组名称</td><td>${data.group.groupName}</td>
                    <td align="center">标签</td><td>${tags}</td>
                </tr>
                <tr>
                    <td align="center">信息来源</td><td>${data.dreCustomer.messagesource}</td>
                    <td align="center">相关讨论组</td><td>${data.group.customers}</td>
                </tr>
                <tr>
                    <td align="center">相关商机</td><td colspan="3">${data.opportunity}</td>
                </tr>
                <tr>
                    <td align="center" style="font-weight: normal;line-height: 30px;padding: 15px;"></td>
                    <td colspan="3" style="padding: 15px;line-height: 28px;">
                         <button type="button" class="btn btn-default" id="cancelButton"><i class="fa fa-times" aria-hidden="true"></i> 取消</button>
                    </td>
                </tr>
            `;
            $(".add-box tbody").html(str);
            $("#cancelButton").click(function () {
                window.history.back(-1);
            });
        },
        error: function (err) {
            console.log(err);
        }

    });
}