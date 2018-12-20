$(function(){
  var url = window.location.href;
  var id = url.split("=")[1].slice(0,1);
  var index = url.split("=")[2]
  // console.log(id , index)
  businessDetail(id, index);
});

function businessDetail(id , index){
  var token = sessionStorage.getItem("token");
  $.ajax({
    type: "GET",
    url: APP_URL + "/getOpportunityDetails",
    data: {
      authToken: token,
      opportunityId:id
    },
    dataType: "json",
    success: function (res) {
      console.log('businessInfo',res);
      var data = res.data;
      
      var principals = '';
    //   $.each(data.principals,function(index,val){
    //      principals +=`
         
    //      `;
    //   })
      var str = `
                <tr>
                    <td align="center">公司名称</td>
                    <td>${data.companyName}</td>
                </tr>
                <tr>
                    <td align="center">金额</td>
                    <td>${data.price}</td>
                </tr>
                <tr>
                    <td align="center">城市</td>
                    <td>${data.provines} ${data.city} ${data.area}</td>
                </tr>
                <tr>
                    <td align="center">日期</td>
                    <td>${moment(data.time).format("YYYY年MM月DD日")}</td>
                </tr>
                <tr>
                    <td align="center">阶段</td>
                    <td>${data.stage}</td>
                </tr>
                <tr>
                    <td align="center">概述</td>
                    <td>${data.companyName}</td>
                </tr>
                <tr>
                    <td align="center">联系人</td>
                    <td></td>
                </tr>
                <tr>
                    <td align="center">负责人</td>
                    <td>李华</td>
                </tr>
                <tr>
                    <td align="center">附件</td>
                    <td>${data.files}</td>
                </tr>
        `;
      $(".businessDetail").html(str);
    },
    error: function (err) {
      console.log(err);
    }
  });
}