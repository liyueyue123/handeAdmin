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
      //联系人
      var links_key = '';
      var links = '';
      $.each(data.links, function (index, val) {
          if(val.iskey == 1){
            links_key +=`
                <div>
                    <span style='margin-left:20px;'>姓名:${val.name}</span>
                    <span style='margin-left:20px;'>公司:${val.companyName}</span> 
                    <span style='margin-left:20px;'>职位:${val.position}</span> 
                </div>
            `;
          }else{
              links +=`
                <div>
                    <span style='margin-left:20px;'>姓名:${val.name}</span>
                    <span style='margin-left:20px;'>公司:${val.companyName}</span> 
                    <span style='margin-left:20px;'>职位:${val.position}</span> 
                </div>
              `;
          }
          principals += `
            <div>
                <span>头像:</span>
                <div style="display:inline-block;width:60px;height:60px;">
                    <img src="${val.icon}" alt="" width='60' height='60'>
                </div>
                <span style='margin-left:20px;'>姓名:${val.name}</span>
                <span style='margin-left:20px;'>部门:${val.departMent}</span> 
                <span style='margin-left:20px;'>手机号:${val.phone}</span> 
            </div>
         `;
      })
      //负责人
      var principals = '';
      $.each(data.principals,function(index,val){
         principals +=`
            <div>
                <span>头像:</span>
                <div style="display:inline-block;width:60px;height:60px;">
                    <img src="${val.icon}" alt="" width='60' height='60'>
                </div>
                <span style='margin-left:20px;'>姓名:${val.name}</span>
                <span style='margin-left:20px;'>部门:${val.departMent}</span> 
                <span style='margin-left:20px;'>手机号:${val.phone}</span> 
            </div>
         `;
      })
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
                    <td>
                        <div style='border-bottom:1px solid #e6e6e6;'>
                            <div><span>关键联系人</span><div style='border-top:1px solid #e6e6e6;background:#e6e6e6;'>${links_key}</div></div>
                        </div>
                        <div>
                            <div><span>其他联系人<span><div style='border-top:1px solid #e6e6e6;background:#e6e6e6;'>${links}</div></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td align="center">负责人</td>
                    <td>${principals}</td>
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