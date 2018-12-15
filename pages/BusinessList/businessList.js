$(function () {
  businessList();
});

// 获取商机列表
function businessList() {
  var token = sessionStorage.getItem("token");
  $.ajax({
    type: "GET",
    url: APP_URL + "/opportunityList",
    data: {
      authToken: token,
    },
    dataType: "json",
    success: function (res) {
      
    },
    error: function (err) {
      //console.log(err);
    }

  });
}