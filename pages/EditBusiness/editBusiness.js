$(function () {
  var url = window.location.href; //首先获取到你的URL地址;
  var arr = url.split("="); //用“&”将URL分割成2部分每部分都有你需要的东西;
  var id = arr[1];
  console.log(id)
  if (url.indexOf('=') != -1) {
    getBusinessDetail(id);
  }
});
function getBusinessDetail(id) {
  var token = sessionStorage.getItem("token");
  $.ajax({
    type: "GET",
    url: APP_URL + "/getOpportunityDetails",
    data: {
      authToken: token,
      opportunityId: id
    },
    dataType: "json",
    success: function (res) {
      console.log('businessInfo', res);
      var data = res.data;
      var str = "";
            str = `
                <tr>
                    <td align="center">公司名称</td>
                    <td><input type="text" id='companyName'  class="form-control" value="${data.companyName}"></td>
                </tr>
                <tr>
                    <td align="center">金额</td>
                    <td><input type="text" id="price"  class="form-control" value="${data.price}"></td>
                </tr>
                <tr>
                    <td align="center">城市</td>
                    <td colspan="3">
                        <div>${data.provines} ${data.area} ${data.city}      (在下可以进行修改)</div>
                        <select class="form-control getPCD" id="allProvinces" name="provinceid" datatype="*" nullmsg="请输入所在省份">
                            <!-- <option value="110000"></option> -->
                        </select>
                        <select class="form-control getPCD" id="allCity" name="cityid" datatype="*" nullmsg="请输入所在城市">
                            <!-- <option value="120100"></option> -->
                        </select>
                        <select class="form-control getPCD" id="allArea" name="districtid" datatype="*" nullmsg="请输入所在地区" >
                            <!-- <option value="120101"></option> -->
                        </select>
                    </td>
                </tr>
                <tr>
                    <td align="center">日期</td>
                    <td><input name="time"  type="text" id="time" class="form-control"  placeholder="请输入日期" datatype="/^[1-9]\d{3}\/(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])$/" errormsg="日期格式不正确,年/月/日" value="${moment(data.time).format("YYYY/MM/DD")}" style="width:33.03%"/></td>
                </tr>
                <tr>
                    <td align="center">阶段</td>
                    <td><input type="text" id="stage"  class="form-control" value="${data.stage}"></td>
                </tr>
                <tr>
                    <td align="center">分组名称</td>
                    <td>${data.group}</td>
                </tr>
                <tr>
                    <td align="center">概述</td>
                    <td><input type="text" id="remark"  class="form-control" value="${data.remark}"></td>
                </tr>
                <tr>
                    <td align="center">联系人</td>
                    <td class="tabTd">
                        <table class="innerTab">
                            <tr>
                                <td width="7%">关键联系人</td>
                                <td class="contactTd">
                `;
            if (data.links != '') {
                $.each(data.links, function (index, val) {
                    str += `
                                ${val.isKey==1?` <div class="contact">${val.companyName} ${val.position} ${val.name}</div>`:''}
                             `;
                });
            }
            str += `
                                </td>
                                </tr>
                            <tr>
                                <td width="7%">其他联系人</td>
                                <td class="contactTd">
                `;
            if (data.links != '') {
                $.each(data.links, function (i, v) {
                    str += `
                            ${v.isKey==0?`<div class="contact">${v.companyName} ${v.position} ${v.name}</div>`:''}
                        `;
                });
            }
            str += `
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td align="center">负责人</td>
                    <td class="contactTd"
                    >
                `;
            if (data.principals != '') {
                $.each(data.principals, function (il, vl) {
                    str += `<div class="contact"><img style="width:2%;" src="${vl.icon}"/>${vl.departMent} ${vl.name} : ${vl.phone}</div>`;
                });
            }
            str += `
                    </td>
                </tr>
                <tr>
                    <td align="center">标签</td>
                    <td>
                `;
            if (data.tags != '') {
                data.tags = [{
                    name: 'mingcheng',
                    num: '1'
                }, {
                    name: 'mingcheng',
                    num: '1'
                }, {
                    name: 'mingcheng',
                    num: '1'
                }, {
                    name: 'mingcheng',
                    num: '1'
                }, {
                    name: 'mingcheng',
                    num: '1'
                }, ]
                $.each(data.tags, function (til, tvl) {
                    str += `<div class="contact">标签名称:${tvl.name},标签数量:${tvl.num}</div>`;
                });
            } 
            str += `
                </tr>
                <tr>
                    <td align="center">讨论组</td>
                    <td>${data.stage}</td>
                </tr>
                <tr>
                    <td align="center">弹性域字段</td>
                    <td>${data.stage}</td>
                </tr>
                <tr>
                    <td align="center">操作历史</td>
                    <td>${data.stage}</td>
                </tr>
                <tr>
                    <td align="center">附件</td>
                    <td>
                `;
            if (data.files != "") {
                $.each(data.files, function (dex, va) { 
                    str += `<a style="text-decoration:underline;color: #428bca;" target="_blank" href="${va.filename}">附件${dex+1}</a>  `;
                });
            }
            str += `
                    </td>
                </tr>
                <tr>
                    <td align="center">信息来源</td>
                    <td>${data.stage}</td>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                    <td>
                        <button type="submit" class="btn btn-success" id="saveButton"><i class="fa fa-save" aria-hidden="true"></i> 修改</button>
                        <button type="button" class="btn btn-default" id="cancelButton"><i class="fa fa-times" aria-hidden="true"></i> 取消</button>
                    </td>
                </tr>
            `;
            $(".businessDetail").html(str);
            getAllProvinces(); //获取省份
            getCity(); //获取市
            getArea(); //获取所在区
            $("#cancelButton").click(function () {
                window.history.back(-1);
            });
    },
    error: function (err) {
      console.log(err);
    }
  });
}

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
