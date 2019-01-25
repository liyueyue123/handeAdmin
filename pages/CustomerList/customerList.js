$(function () {
    companyList(); //获取公司列表
    var url = window.location.href;
    if (url.indexOf('=') != -1) {
        var index = url.split('=')[1];
        var indexNum = Math.ceil(index / 10);
        getCustomerList(indexNum); //获取客户列表
    } else {
        getCustomerList(1); //获取客户列表
    }
    // 关键字搜索
    $("#searchBtn").click(function () {
        $("#openTime").val(""); //开户时间
        $("#overTime").val(""); //结束时间
        getCustomerList(1);
    });
    //筛选
    $("#selectBtn").click(function () {
        $("#IdKeyWord").val("")
        $("#NameKeyWord").val("");
        $("#companySelect option:selected").val(""); //公司名称
        $("#PositonKeyWord").val(""); //职位
        getCustomerList(1);
    });

});

//获取客户列表
function getCustomerList(pageNum) {
    var token = sessionStorage.getItem("token");
    var id = parseInt($("#IdKeyWord").val()); //id
    var name = $("#NameKeyWord").val(); //客户名称
    var company = $("#companySelect option:selected").val(); //公司名称
    var position = $("#PositonKeyWord").val(); //职位
    var startTime = $("#openTime").val(); //开始时间
    var overTime = $("#overTime").val(); //结束时间
    var userId = sessionStorage.getItem("userId");
    var data = {};
    data.authToken = token;
    data.limit = 10;
    data.page = pageNum;
    data.userId = userId;
    if (position != "") {
        data.position = position;
    }
    if (company != "") {
        data.company = company;
    }
    if (id) {
        data.id = id;
    }
    if (name != "") {
        data.customerName = name;
    }
    if (startTime != "") {
        data.startTime = startTime;
    }
    if (overTime != "") {
        data.endTime = overTime;
    }
    $.showLoading('加载中');
    $.ajax({
        type: "POST",
        url: APP_URL + "/customerList",
        data: data,
        dataType: "json",
        success: function (res) {
            console.log(res);
            $.closeLoading();
            if (res.code == 0) {
                var data = res.data;
                var pages = 10 * (pageNum - 1);
                var str = "";
                $.each(data, function (index, val) {
                    str += `
                 <tr>
                    <td><input type="checkbox" name="del_listID" id="del_listID" data-name="multi-select" value="${val.id}" data-index="${pages+(index+1)}"/></td>
                    <td>${pages+(index+1)}</td>
                    <td>${val.id}</td>
                    <td><img src='${APP_IMAGE_URL+val.cardcasephoto}' style="width:60px;height:60px;margin:10px;"/></td>
                    <td class='hideName'>${val.customerName}</td>
                    <td>${val.gender}</td>
                    <td class='hidePosition'>${val.position}</td>
                    <td class='hideCompany'>${val.company}</td>
                    <td>${val.planfinishtime !=""?moment(val.planfinishtime).format("YYYY年MM月DD日"):''}</td>
                    <td>${val.email}</td>
                    <td>${val.messagesource}</td>
                    <td>${moment(val.createtime).format("YYYY年MM月DD日")}</td>
                    <td><a class="btn btn-success navbar-btn" href="../CustomerDetail/index.html?id=${val.id}&indexNum=${pages+(index+1)}">详情</a></td>
                 </tr>
                 `;
                });
                $(".list-box>table>tbody").html(str);
                $('input[data-name=multi-select]').iCheck({
                    checkboxClass: 'icheckbox_flat-blue',
                    radioClass: 'iradio_flat-blue'
                });
                getPage(res.count, 'getCustomerList', pageNum); //分页
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

// 获取公司列表
function companyList() {
    var token = sessionStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/companySelect",
        data: {
            authToken: token
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
            var data = res.data;
            var str = "";
            str += `<option value="" selected="">选择公司进行搜索</option>`;
            $.each(data, function (index, val) {
                str += `<option value="${val.companyname}">${val.companyname}</option>`;
            });
            $("#companySelect").html(str);
        },
        error: function (err) {
            console.log(err);
        }
    });
}