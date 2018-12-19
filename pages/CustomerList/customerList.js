$(function () {
    getCustomerList(1); //获取客户列表
    companyList(); //获取公司列表
});

//获取客户列表
function getCustomerList(pageNum) {
    var token = sessionStorage.getItem("token");
    $.ajax({
        type: "POST",
        url: APP_URL + "/customerList",
        data: {
            authToken: token,
            limit: 10,
            page: pageNum
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var pages = 10 * (pageNum - 1);
            var str = "";
            $.each(data, function (index, val) {
                str += `
                 <tr>
                    <td><input type="checkbox" name="del_listID" id="del_listID" data-name="multi-select" value="${val.id}"/></td>
                    <td>${pages+(index+1)}</td>
                    <td>${val.id}</td>
                    <td></td>
                    <td>${val.customerName}</td>
                    <td>${val.gender}</td>
                    <td>${val.position}</td>
                    <td>${val.company}</td>
                    <td>${moment(val.planfinishtime).format("YYYY年MM月DD日")}</td>
                    <td>${val.email}</td>
                    <td>${val.messagesource}</td>
                    <td>${moment(val.createtime).format("YYYY年MM月DD日")}</td>
                    <td><a class="btn btn-success navbar-btn" href="../CustomerDetail/index.html?id=${val.id}">详情</a></td>
                 </tr>
                 `;
            });
            $(".list-box>table>tbody").html(str);
            getPage(res.count, 'getCustomerList',pageNum); //分页
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
            str += `<option value="" selected="">输入公司进行搜索</option>`;
            $.each(data, function (index, val) {
                str += `<option value="${val.id}">${val.companyname}</option>`;
            });
            $("#companySelect").html(str);
        },
        error: function (err) {
            console.log(err);
        }
    });
}