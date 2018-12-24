$(function () {
    companyList(1); //公司列表
    // 搜索
    $("#searchBtn").click(function () {
        companyList(1);
    });
    // 筛选
    $("#selectBtn").click(function () {
        companyList(1);
    });
});

// 获取公司列表
function companyList(pageNum) {
    var token = sessionStorage.getItem("token");
    var city = $("#citySearch").val(); //地区
    var openTime = $("#openTime").val(); //开户时间
    var overTime = $("#overTime").val(); //截止时间
    var status = $("#status option:selected").val(); //状态
    var id = $("#IdkeyWord").val(); //编号
    var data = {};
    data.authToken = token;
    data.limit = 10;
    data.page = pageNum;
    if (city != '') {
        data.address = city;
    }
    if (openTime != '') {
        data.opentimeStart = openTime;
    }
    if (overTime != '') {
        data.deadlineStart = overTime;
    }
    if (status != '') {
        data.status = status;
    }
    if (id != '') { 
        data.id = id;
    }
    $.ajax({
        type: "GET",
        url: APP_URL + "/companyList",
        data: data,
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var pages = 10 * (pageNum - 1);
            var str = "";
            $.each(data, function (index, val) {
                str += `
                    <tr>
                        <td><input type="checkbox" name="del_listID" id="del_listID" data-name="multi-select" value="${val.id}" /></td>
                        <td>${pages+(index+1)}</td>
                        <td>${val.id}</td>
                        <td>${val.status==1?'使用中':val.status==2?'已到期':val.status==3?'已冻结':''}</td>
                        <td>${val.province}${val.city}${val.area}</td>
                        <td>${val.address}</td>
                        <td>${val.companyname}</td>
                        <td>${val.principalName}</td>
                        <td>${moment(val.openaccounttime).format("YYYY年MM月DD日")}</td>
                        <td>${moment(val.deadline).format("YYYY年MM月DD日")}</td>
                        <td>${val.account}</td>
                        <td></td>
                        <td>
                            <a class="btn btn-success" data-table="user" data-id="3"  href="javascript:void(0);">冻结</a>
                            <a class="btn btn-danger" data-table="user" data-id="3"  href="javascript:void(0);">解冻</a>
                        </td>
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