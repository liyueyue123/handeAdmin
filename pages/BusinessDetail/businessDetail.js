$(function () {
    var url = window.location.href;
    var a = url.split('&')[0];
    var b = url.split('&')[1];
    // console.log(a,b)
    var id = a.split('=')[1];
    var $index = b.split('=')[1];
    // console.log(id , $index)
    $.showLoading();
    businessDetail(id, $index);
});

function businessDetail(id, $index) {
    var token = sessionStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/getOpportunityDetails",
        data: {
            authToken: token,
            opportunityId: id
        },
        dataType: "json",
        success: function (res) {
            console.log('businessInfo', res);
            $.closeLoading();   
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
            var data = res.data;
            if (data.histories != ''){
                var histories = '';
               $.each(data.histories, function (historiesIndex, historiesVal) {
                    histories += `
                                <div>时间:  ${moment(historiesVal.time).format("YYYY年MM月DD日")} ,历史信息:  ${historiesVal.message}, 历史商机:  ${historiesVal.opportunitesid} ,操作用户:  ${historiesVal.userName} ,操作用户的id:${historiesVal.userid}</div>
                             `;
                });
            }else{
                var  histories = '';
            }
            var str = "";
            str = `
                <tr>
                    <td align="center">序号</td>
                    <td>${$index}</td>
                </tr>
                <tr>
                    <td align="center">公司名称</td>
                    <td>${data.companyName}</td>
                </tr>
                <tr>
                    <td align="center">金额</td>
                    <td>${data.price}</td>
                </tr>
                <tr>
                    <td align="center">城市</td>
                    <td>${data.provines} ${data.city} ${data.area}</td>
                </tr>
                <tr>
                    <td align="center">日期</td>
                    <td>${moment(data.time).format("YYYY年MM月DD日")}</td>
                </tr>
                <tr>
                    <td align="center">阶段</td>
                    <td>${data.stage}</td>
                </tr>
                <tr>
                    <td align="center">分组名称</td>
                    <td>${data.group.groupName != undefined ? data.group.groupName : ''}</td>
                </tr>
                <tr>
                    <td align="center">概述</td>
                    <td>${data.remark}</td>
                </tr>
                <tr>
                    <td align="center">联系人</td>
                    <td class="tabTd">
                        <table class="innerTab">
                            <tr>
                                <td width="7%">关键联系人</td>
                                <td class="contactTd">
                `;
            if (data.links != '') {
                $.each(data.links, function (index, val) {
                    str += `
                                ${val.isKey==1?` <div class="contact">${val.companyName} ${val.position} ${val.name}</div>`:''}
                             `;
                });
            }
            str += `
                                </td>
                                </tr>
                            <tr>
                                <td width="7%">其他联系人</td>
                                <td class="contactTd">
                `;
            if (data.links != '') {
                $.each(data.links, function (i, v) {
                    str += `
                            ${v.isKey==0?`<div class="contact">${v.companyName} ${v.position} ${v.name}</div>`:''}
                        `;
                });
            }
            str += `
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td align="center">负责人</td>
                    <td class="contactTd"
                    >
                `;
            if (data.principals != '') {
                $.each(data.principals, function (il, vl) {
                    str += `<div class="contact"><img style="width:2%;" src="${vl.icon}"/>${vl.departMent} ${vl.name} : ${vl.phone}</div>`;
                });
            }
            str += `
                    </td>
                </tr>
                <tr>
                    <td align="center">标签</td>
                    <td>
                `;
            if (data.tags != '') {
                $.each(data.tags, function (til, tvl) {
                    str += `<div class="contact"><span style="font-weight: bold;">标签名称: </span>${tvl.tagName},   <span style="font-weight: bold;">标签数量: </span>${tvl.count}</div>`;
                });
            } 
            str += `
                </tr>
                <tr>
                    <td align="center">讨论组</td>
                    <td></td>
                </tr>
                <tr>
                    <td align="center">弹性域字段</td>
                    <td></td>
                </tr>
                <tr>
                    <td align="center">操作历史</td>
                    <td><div style="overflow-x:auto;height:200px;">${histories}</div></td>
                </tr>
                <tr>
                    <td align="center">附件</td>
                    <td>
                    <div style="overflow-x:auto;height:150px;">
                `;
            if (data.files != "") {
                $.each(data.files, function (dex, va) { 
                    str += `<a style="text-decoration:underline;color: #428bca;display:block;" target="_blank" href="${va.filename}">附件${dex+1}: ${va.filename}</a>  `;
                });
            }
            str += `
                </div>
                    </td>
                </tr>
                <tr>
                    <td align="center">信息来源</td>
                    <td>创建用户Id: ${data.createUserId},  创建用户名称:${data.createUserName}</td>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                    <td>
                        <button type="button" class="btn btn-default" id="cancelButton"><i class="fa fa-times" aria-hidden="true"></i> 取消</button>
                    </td>
                </tr>
            `;
            $(".businessDetail").html(str);
            $("#cancelButton").click(function () {
                window.history.back(-1);
            });
        },
        error: function (err) {
            console.log(err);
        }
    });
}
