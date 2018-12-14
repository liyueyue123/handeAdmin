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
        url: APP_URL+"/show_details",
        data: {
            authToken: token,
            Id :customerId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
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
                    <td align="center">计划成单日期</td>${moment(data.dreCustomer.planfinishtime).format("YYYY年MM月DD日")}<td></td>
                    <td align="center">邮箱</td>${data.dreCustomer.email}<td></td>
                </tr>
                <tr>
                    <td align="center">联系方式</td><td>${data.phones[0].phone}</td>
                    <td align="center">地址</td><td>${data.dreCustomer.address}</td>
                </tr>
                <tr>
                    <td align="center">网址</td><td>${data.dreCustomer.webUrl}</td>
                    <td align="center">微信</td><td>${data.dreCustomer.wechat}</td>
                </tr>
                <tr>
                    <td align="center">分组名称</td>${data.group.groupName}<td></td>
                    <td align="center">标签</td>td>${data.dreCustomer.tags}</td>
                </tr>
                <tr>
                    <td align="center">相关讨论组</td><td></td>
                    <td align="center">相关商机</td><td>${data.opportunity}</td>
                </tr>
                <tr>
                    <td align="center">信息来源</td>
                    <td colspan="3"><textarea name="desc" id="desc" cols="45" rows="5" class="form-control" datatype="*" nullmsg="请填写沟通记录"
                        style="width:100%;height:200px; margin:10px 0px;" value="" readonly></textarea></td>
                </tr>
                <tr>
                    <td align="center" style="font-weight: normal;line-height: 30px;padding: 15px;"></td>
                    <td colspan="3" style="padding: 15px;line-height: 28px;"></td>
                </tr>
            `;
            $(".add-box tbody").html(str);
        },
        error:function(err){
            console.log(err);
        }
        
    });
}