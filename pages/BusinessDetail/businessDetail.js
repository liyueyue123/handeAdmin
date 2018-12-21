$(function () {
    var url = window.location.href;
    var id = url.split("=")[1].slice(0, 1);
    var $index = url.split("=")[2]
    // console.log(id , index)
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
            var data = res.data;
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
                    <td align="center">概述</td>
                    <td>${data.companyName}</td>
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
                    <td align="center">附件</td>
                    <td>
                `;
            if (data.files != "") {
                $.each(data.files, function (dex, va) { 
                    str += `<a style="text-decoration:underline;color: #428bca;" target="_blank" href="${va.filename}">附件${dex+1}</a>  `;
                });
            }
            str += `
                    </td>
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