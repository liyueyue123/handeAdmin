$(function () {
     /* 验证 */
    // 账号
    

    // addCompany()  //新增
});

function addCompany() {
    var token = sessionStorage.getItem("token");
    $.ajax({
        type: "POST",
        url: APP_URL + "/addCompany",
        data: {
            authToken: token,
            address: "长安街",
            cityid: "北京",
            companyname: "北京中国航天",
            deadline: "2018-12-10",
            districtid: "宣武区",
            lastAccountCount: "100",
            openaccounttime: "2018-10-22",
            principalName: "小花",
            provinceid: "北京"
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
        }
    });
}

function delCompany() {
    var token = sessionStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/deleteCompany",
        data: {
            authToken: token,
            companyId: 9
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
        }
    });
}