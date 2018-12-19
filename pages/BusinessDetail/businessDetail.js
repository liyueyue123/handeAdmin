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
      console.log(res);
      var data = res.data;
      var str = `<tr>
                    <td align="center">序号</td>
                    <td>${index}</td>
                </tr>
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
                    <td align="center">分组名称</td>
                    <td>${data.group.groupName}</td>
                </tr>
                <tr>
                    <td align="center">概述</td>
                    <td>${data.companyName}</td>
                </tr>
                <tr>
                    <td align="center">联系人</td>
                    <td>李明</td>
                </tr>
                <tr>
                    <td align="center">负责人</td>
                    <td>李华</td>
                </tr>
                <tr>
                    <td align="center">标签</td>
                    <td>${data.tags}</td>
                </tr>
                <tr>
                    <td align="center">讨论组</td>
                    <td>${data.companyName}</td>
                </tr>
                <tr>
                    <td align="center">弹性字段</td>
                    <td>${data.companyName}</td>
                </tr>
                <tr>
                    <td align="center">操作历史</td>
                    <td>${data.histories}</td>
                </tr>
                <tr>
                    <td align="center">附件</td>
                    <td>${data.files}</td>
                </tr>
                <tr>
                    <td align="center">信息来源</td>
                    <td>${data.companyName}</td>
                </tr>
        `;
      $(".businessDetail").html(str);
    },
    error: function (err) {
      console.log(err);
    }
  });
}