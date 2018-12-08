$(function () {
    addCompany()
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
            deadline: "hello",
            districtid: "宣武区",
            lastAccountCount: "100",
            openaccounttime: "hello",
            principalName: "李xx",
            provinceid: "北京"
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
        }
    });
}