$(function () {
    //添加电话
    $("#addphone").click(function () {
        var phoneList = $("#addTelText li").length;
        if (phoneList < 5) {
            var str = "";
            str += `
            <li class="pro-section">
                <div class="input-group">
                    <input type="text" class="form-control formPhone" placeholder="请输入电话号码">
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
    getAllProvinces(); //获取省份
    getCity(); //获取市
    getArea(); //获取所在区
    var url = window.location.href;
    if (url.indexOf("=") == -1) {
        $(".addForm").attr("action", APP_URL + "/addCompany");
        $("#companyId").val("");
        // $("#company_password").attr("ajaxurl", APP_URL + "/addCompany");  //验证账号是否重复
        addCompany(); //新增公司
    } else {
        var id = url.split("=")[1];
        showDetails(id); //显示公司详情
    }


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

// 添加公司
function addCompany() {
    ajax({
        type: "POST",
        success: function (res) {
            // console.log(JSON.stringify(res));
            window.location.href = '../CompanyList/index.html';
        }
    });
}

// 获取公司详情
function showDetails(id) {
    var token = sessionStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/showDetails",
        data: {
            authToken: token,
            companyId: id
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            if (res.code == 0) {
                $("#companyId").val(id);
                $(".addForm").attr("action", APP_URL + "/editCompany");
                $("#changeTitle").html("编辑");
                $("#saveButton").html('<i class="fa fa-save" aria-hidden="true"></i>保存');
                $("#company_account").val(data.account); //账号
                $("#company_password").val(data.password); //密码
                $("#company_name").val(data.companyname); //公司名称
                $("#company_user").val(data.principalName); //负责人姓名
                if (data.dreTelephone.length > 0) {
                    $("#attrPhone").val(data.dreTelephone[0].phone); //电话
                    // 多组电话
                    if (data.dreTelephone.length > 1) {
                        var phones = "";
                        for (var i = 1; i < data.dreTelephone.length; i++) {
                            phones += `
                            <li class="pro-section">
                                <div class="input-group">
                                    <input type="text" class="form-control formPhone" placeholder="请输入电话号码" value="${data.dreTelephone[i].phone}">
                                </div> 
                                <button type="button" class="btn btn-danger pro-removeSection"><i class="fa fa-minus" aria-hidden="true"></i> 移除电话</button>
                            </li>
                        `;
                        }
                        $("#addTelText").append(phones);
                    }
                }
                $("#allProvinces").find("option[value=" + data.provinceid + "]").attr("selected", true); //省
                cityList(data.provinceid, data.cityid); //获取城市 
                districtList(data.cityid, data.districtid); //获取地区
                $("#company_address").val(data.address); //详细地址
                // $("#overTime").val(moment(data.deadline).format("YYYY年MM月DD日"));  //截止时间
                $("#company_num").val(data.lastAccountCount); //最终账号数量
                editCompany(); //编辑公司
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}


//获取市列表
function cityList(provinceId, cityId) {
    var token = sessionStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/findCityById",
        data: {
            authToken: token,
            provincesId: provinceId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var city = "";
            city += `<option value="" selected="">---请选择市---</option>`;
            $.each(data, function (index, val) {
                city += `
                    <option value="${val.cityid}" selected="${val.cityid==cityId?'selected':''}">${val.city}</option>
                 `;
            });
            $("#allCity").html(city);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// 获取地区列表
function districtList(cityId, districtId) {
    var token = sessionStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/findAreaByCityId",
        data: {
            authToken: token,
            cityId: cityId
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var area = "";
            area += `<option value="" selected="">---请选择区---</option>`;
            $.each(data, function (index, val) {
                area += `
                    <option value="${val.areaid}" selected="${val.cityid==districtId?selected:''}">${val.area}</option>
                 `;
            });
            $("#allArea").html(area);
        }
    });

}

// 编辑公司
function editCompany() {
    ajax({
        type: "GET",
        success: function (res) {
            // console.log(JSON.stringify(res));
            window.location.href = '../CompanyList/index.html';
        }
    });
}