$(function () {
    companyList(1); //公司列表
    // 搜索
    $("#searchBtn").click(function () {
        $("#citySearch").val("");
        $("#openTime").val("");
        $("#overTime").val("");
        $("#status option:selected").val("");
        companyList(1);
    });
    // 筛选
    $("#selectBtn").click(function () {
        $("#IdkeyWord").val("");
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
    $.showLoading('加载中');
    $.ajax({
        type: "GET",
        url: APP_URL + "/companyList",
        data: data,
        dataType: "json",
        success: function (res) {
            $.closeLoading();
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
                        <td class='hideCompany'>${val.companyname}</td>
                        <td class='hideName'>${val.principalName}</td>
                        <td width="10%">${val.telPhones}</td>
                        <td>${val.openaccounttime!=''?moment(val.openaccounttime).format("YYYY年MM月DD日"):''}</td>
                        <td>${val.deadline!=''?moment(val.deadline).format("YYYY年MM月DD日"):''}</td>
                        <!-- <td>${val.account}</td> -->
                        <!--<td>${val.lastlogintime!=''?moment(val.lastlogintime).format("YYYY年MM月DD日"):''}</td>-->
                        <td>
                            <a class="btn ${val.status=='3'?'btn-success':'btn-danger'}"  onclick="${val.status=='3'?'unfreeze('+val.id+')':'freeze('+val.id+')'}" href="javascript:void(0);">${val.status=='3'?'解冻':'冻结'}</a>
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

//冻结
function freeze(id) {
    var token = sessionStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/freeze",
        data: {
            authToken: token,
            id: id
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 0) {
                companyList(1);
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

//解冻
function unfreeze(id) {
    console.log(id);
    var token = sessionStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/unfreeze",
        data: {
            authToken: token,
            id: id
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 0) {
                companyList(1);
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