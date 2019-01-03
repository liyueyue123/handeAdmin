$(function () {
    getCustomerList(1); //获取客户列表
    companyList(); //获取公司列表
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
    var startTime = $("#openTime").val(); //开户时间
    var overTime = $("#overTime").val(); //结束时间
    var data = {};
    data.authToken = token;
    data.limit = 10;
    data.page = pageNum;
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
            if (res.code == 0) {
                $.closeLoading();
                var data = res.data;
                var pages = 10 * (pageNum - 1);
                var str = "";
                $.each(data, function (index, val) {
                    str += `
                 <tr>
                    <td><input type="checkbox" name="del_listID" id="del_listID" data-name="multi-select" value="${val.id}"/></td>
                    <td>${pages+(index+1)}</td>
                    <td>${val.id}</td>
                    <td><img src='${APP_IMAGE_URL+val.cardcasephoto}' style="width:60px;height:60px;"/></td>
                    <td>${val.customerName}</td>
                    <td>${val.gender}</td>
                    <td>${val.position}</td>
                    <td>${val.company}</td>
                    <td>${val.planfinishtime !=""?moment(val.planfinishtime).format("YYYY年MM月DD日"):''}</td>
                    <td>${val.email}</td>
                    <td>${val.messagesource}</td>
                    <td>${moment(val.createtime).format("YYYY年MM月DD日")}</td>
                    <td><a class="btn btn-success navbar-btn" href="../CustomerDetail/index.html?id=${val.id}">详情</a></td>
                 </tr>
                 `;
                });
                $(".list-box>table>tbody").html(str);
                getPage(res.count, 'getCustomerList', pageNum); //分页
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