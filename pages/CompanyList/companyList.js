$(function () {
    companyList(1); //公司列表
});

// 获取公司列表
function companyList(pageNum) {
    var token = sessionStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/companyList",
        data: {
            authToken: token,
            limit: 10,
            page: pageNum
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            // if (e) {
            //     $(e).addClass("active").siblings("li").removeClass("active");
            // }
            var data = res.data;
            var str = "";
            $.each(data, function (index, val) {
                str += `
                    <tr>
                        <td><input type="checkbox" name="del_listID" id="del_listID" data-name="multi-select" value="${val.id}" /></td>
                        <td>${index+1}</td>
                        <td>${val.id}</td>
                        <td>${val.status==1?'使用中':val.status==2?'已到期':val.status==3?'已冻结':''}</td>
                        <td>${val.province}</td>
                        <td>${val.address}</td>
                        <td>${val.companyname}</td>
                        <td class="sortTD" name="Case">${val.principalName}</td>
                        <td></td>
                        <td>${moment(val.openaccounttime).format("YYYY年MM月DD日")}</td>
                        <td>${moment(val.deadline).format("YYYY年MM月DD日")}</td>
                        <td>${val.account}</td>
                        <td></td>
                    </tr>
                `;
            });
            $(".list-box>table>tbody").html(str);
            getPage(res.count, 'companyList', pageNum); //分页
        },
        error: function (err) {
            console.log(err);
        }

    });
}