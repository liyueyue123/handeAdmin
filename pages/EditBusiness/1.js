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
      $('#opportunityId').val(data.id);
      $('#companyName').val(data.companyName);
      $('#price').val(data.price);
      $('#citylist').text(data.provines + data.area + data.city +"(在下可修改)");
      $('#time').val(moment(data.time).format("YYYY/MM/DD"));
      $('#stage').val(data.stage);
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
$('#form1').attr('action', APP_URL + "/updateInfo");
ajax({
  type: 'post',
  success: function (res) {
    console.log('success', JSON.stringify(res));
    // window.location.href = '../PersonnelManage/index.html'
  }
})
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
