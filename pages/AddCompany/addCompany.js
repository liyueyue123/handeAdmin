$(function () {
    getCompany(); //获取公司
    getAllProvinces(); //获取省份
    getCity(); //获取市
    getArea(); //获取所在区

    //添加电话
    $("#addphone").click(function () {
        var phoneList = $("#addTelText li").length;
        if (phoneList < 5) {
            var str = "";
            str += `
            <li class="pro-section">
                <div class="input-group">
                    <input type="text" class="form-control" name="phones[]" id="attrPhone" placeholder="请输入电话号码">
                </div> 
                <button type="button" class="btn btn-danger pro-removeSection"><i class="fa fa-minus" aria-hidden="true"></i> 移除电话</button>
            </li> 
            `;
            $("#addTelText").append(str);
        }
    });
    // 删除电话
    $("#addTelText .pro-removeSection").live("click", function () {
        $(this).parent(".pro-section").remove();
    });
    addCompany() //新增
});

// 获取所有省份
function getAllProvinces() {
    var token = sessionStorage.getItem("token");
    var str = "";
    str += `<option value="" selected="">---请选择省份---</option>`;
    $.ajax({
        type: "GET",
        url: APP_URL + "/findAllProvinces",
        data: {
            authToken: token,
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            $.each(data, function (index, val) {
                str += `<option value="${val.provinceid}">${val.province}</option>`;
            });
            $("#allProvinces").html(str);
        },
        error: function (err) {
            console.log(err);
        }
    });
}
// 获取市
function getCity() {
    var token = sessionStorage.getItem("token");
    var str1 = "";
    str1 += `<option value="" selected="">---请选择市---</option>`;
    $("#allProvinces").change(function () {
        var provinceid = $("#allProvinces>option:selected").val();
        if (provinceid) {
            $.ajax({
                type: "GET",
                url: APP_URL + "/findCityById",
                data: {
                    authToken: token,
                    provincesId: provinceid
                },
                dataType: "json",
                success: function (res) {
                    console.log(res);
                    var data = res.data;
                    $.each(data, function (index, val) {
                        str1 += `
                            <option value="${val.cityid}">${val.city}</option>
                         `;
                    });
                    $("#allCity").html(str1);
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
    });
    $("#allCity").html(str1);
}

// 获取所在区
function getArea() {
    var token = sessionStorage.getItem("token");
    var str2 = "";
    str2 += `<option value="" selected="">---请选择区---</option>`;
    $("#allCity").change(function () {
        var cityid = $("#allCity>option:selected").val();
        if (cityid) {
            $.ajax({
                type: "GET",
                url: APP_URL + "/findAreaByCityId",
                data: {
                    authToken: token,
                    cityId: cityid
                },
                dataType: "json",
                success: function (res) {
                    console.log(res);
                    var data = res.data;
                    $.each(data, function (index, val) {
                        str2 += `
                            <option value="${val.areaid}">${val.area}</option>
                         `;
                    });
                    $("#allArea").html(str2);
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
    });
    $("#allArea").html(str2);
}

// 获取公司
function getCompany() {
    var token = sessionStorage.getItem("token");
    var str3 = "";
    str3 += `<option value="" selected="">---请选择公司---</option>`;
    $.ajax({
        type: "GET",
        url: APP_URL + "/companySelect",
        data: {
            authToken: token,
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            $.each(data, function (index, val) {
                str3 += `
                    <option value="${val.id}">${val.companyname}</option>
                `;
            });
            $("#allCompany").html(str3);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// 添加公司
function addCompany() {
    $("#saveButton").click(function () {
        var companyAccount = $('#company_account').val(); //账号
        var company_password = $('#company_password').val(); //密码
        var company_name = $('#company_name').val(); //公司名称
        var company_user = $('#company_user').val(); //负责人姓名
        var phones = '13245671234';
        var allProvinces = $('#allProvinces').val();
        var allCity = $('#allCity').val();
        var allArea = $('#allArea').val();
        var company_address = $('#company_address').val();
        var startTime = $('#startTime').val();
        var overTime = $('#overTime').val();
        var company_num = $('#company_num').val();
        var token = sessionStorage.getItem("token");
        $.ajax({
            type: "POST",
            url: APP_URL + "/addCompany",
            data: {
                authToken: token,
                account: companyAccount,
                password: company_password,
                companyname: 7,
                address: company_address,
                cityid: allCity,
                deadline: overTime,
                districtid: allArea,
                lastAccountCount: company_num,
                openaccounttime: startTime,
                principalName: company_user,
                provinceid: allProvinces,
                phones: phones
            },
            dataType: "json",
            success: function (res) {
                console.log(res);
            }
        });

    });
}