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
      limit:10,
      page:1
    },
    dataType: "json",
    success: function (res) {
      console.log('businessList',res);
      var data = res.data;
      var str = '';
      $.each(data, function (index, val) {
        str += `
                <tr>
                <td><input type="checkbox" name="del_listID" id="del_listID" data-name="multi-select" value="${val.id}" /></td>
                <td>${index+1}</td>
                <td>${val.companyname}</td>
                <td>${val.price}</td>
                <td>${val.provinesName}-${val.cityName}-${val.areaName}</td>
                <td>${moment(val.time).format('YYYY年MM月DD日')}</td>
                <td>${val.stage}</td>
                <td>${val.groupid}</td>
                <td>${val.source}</td>
                <td><a class="btn btn-success navbar-btn" id="search_details" data-id="${val.id}" data-index="${index+1}"> 查看详情</a></td>
                </tr>
              `;
      });
      $(".businessList").html(str);
    },
    error: function (err) {
      //console.log(err);
    }
  });
}

//点击查看详情
$('#search_details').live('click',function(e){
  // console.log('id',e.target.dataset.id)
  var id = e.target.dataset.id;
  var index = e.target.dataset.index;
  openAddData('../BusinessDetail/index.html?id='+id+'&index='+index)
})