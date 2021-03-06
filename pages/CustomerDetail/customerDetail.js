$(function () {
    var url = window.location.href;
    var id = url.split("&")[0].split("=")[1];
    var indexNum = url.split("&")[1].split("=")[1];
    $.showLoading('加载中');
    customerDetail(id,indexNum);
});

function customerDetail(customerId,indexNum) {
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
            var arr1 = [];
            if (data.phones != "") {
                $.each(data.phones, function (index, val) {
                    if (val.phone != "") {
                        arr1.push(val.phone);
                    }
                });
                var tels = arr1.toString();
            } else {
                var tels = "";
            }
            var arr2 = [];
            if (data.dreTags != "") {
                $.each(data.dreTags, function (index, val) {
                    if (val.tagName != "") {
                        arr2.push(val.tagName);
                    }
                });
                var tags = arr2.toString();
            } else {
                var tags = "";
            }
            var arr3 = [];
            if (data.disUsers != "") {
                $.each(data.disUsers, function (index, val) {
                    if (val.name != "") {
                        arr3.push(val.name);
                    }
                });
                var disUser = arr3.toString();
            } else {
                var disUser =""; 
            }
            var str = "";
            str += `
                <tr>
                    <td align="center">名片照片</td><td><img src="${APP_IMAGE_URL+ data.dreCustomer.cardcasephoto}" style="width:60px;height:60px;margin:10px;"/></td>
                    <td align="center">ID</td><td width="38%">${data.dreCustomer.id}</td>
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
                    <td align="center">计划成单日期</td><td>${data.dreCustomer.planfinishtime !=""?moment(data.dreCustomer.planfinishtime).format("YYYY年MM月DD日"):''}</td>
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
                    <td align="center">标签名称</td><td>${tags}</td>
                    <td align="center">标签总数</td><td>${data.dreTags.length}</td>
                </tr>
                <tr >
                    <td align="center">分组名称</td><td>${data.group!=""?data.group.groupName:""}</td>
                    <td align="center">信息来源</td>
                    <td style="padding:0;">
                        <div class="box1">
                            <div class="inlineDiv">用户名称</div>
                            <div class="divContent">${data.user.name}</div>
                        </div>
                        <div class="box2">
                            <div class="inlineDiv">用户ID</div>
                            <div class="divContent">${data.user.id}</div>
                        </div>
                   </td>
                </tr>
                <tr>
                    <td align="center">相关讨论组</td>
                    ${data.disUsers.length==0?'<td></td>':
                    `<td class="contactTd">
						<table width="100%" cellspacing="0" cellpadding="0">
                            <tbody>
                                <tr>
									<td class="tdStyle1" >名称</td>
									<td class="tdStyle">${data.dreDiscussion!=""?data.dreDiscussion.discussionName:""}</td>
								</tr>
								<tr>
									<td class="tdStyle1">组内人数</td>
									<td class="tdStyle">${data.disUsers.length}</td>
								</tr>
								<tr>
									<td class="tdStyle1">成员</td>
									<td class="tdStyle">${disUser}</td>
								</tr>
							</tbody>
						</table>
                    </td>`
                    }
                    <td align="center">相关商机</td>
                    <td colspan="3">
                    `;
                    $.each(data.opportunity, function (i, vl) {
                        str += `<a style="text-decoration:underline;color: #428bca;"  href="../BusinessDetail/index.html?id=${vl.id}&index=${i+1}">商机${i+1}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>`;
                    });
                    str += `
                    </td>
                </tr>
                <tr>
                    <td align="center" style="font-weight: normal;line-height: 30px;padding: 15px;"></td>
                    <td colspan="3" style="padding: 15px;line-height: 28px;">
                         <button type="button" class="btn btn-default" id="cancelButton"><i class="fa fa-times" aria-hidden="true"></i> 返回</button>
                    </td>
                </tr>
            `;
            $(".add-box tbody").html(str);
            $("#cancelButton").click(function () {
                $(window).attr("location","../CustomerList/index.html?indexNum="+indexNum);
            });
        },
        error: function (err) {
            console.log(err);
        }

    });
}