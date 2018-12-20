$(function () {
  businessList(1);
});

// 获取商机列表
function businessList(pageNum, companyName, linkMan, responsible, id) {
  var token = sessionStorage.getItem("token");
  $.ajax({
    type: "GET",
    url: APP_URL + "/console/opportunityList",
    data: {
      authToken: token,
      limit: 10,
      page: pageNum,
      companyName: companyName,
      linkMan: linkMan,
      responsible: responsible,
      id:id
    },
    dataType: "json",
    success: function (res) {
      console.log('businessList', res);
      var data = res.data;
      var str = '';
      var pages = 10 * (pageNum - 1);
      $.each(data, function (index, val) {
        str += `
                <tr>
                <td><input type="checkbox" name="del_listID" id="del_listID" data-name="multi-select" value="${val.id}" /></td>
                <td>${pages+index+1}</td>
                <td>${val.companyname}</td>
                <td>${val.price}</td>
                <td>${val.provinesName}${val.cityName}${val.areaName}</td>
                <td>${moment(val.time).format('YYYY年MM月DD日')}</td>
                <td>${val.stage}</td>
                <td>${val.groupid}</td>
                <td>${val.source}</td>
                <td width="300">
                <a class="btn btn-success navbar-btn" id="search_details" data-id="${val.id}" data-index="${index+1}"> 查看详情</a>
                <a class="btn btn-warning files" id="search_file" style="margin-left:20px;" data-id="${val.id}" data-index="${index+1}">
                   <span>上传附件</span><input style="opacity:0;width:120%;" type="file" id='uploadFile' multiple="multiple"/>
                </a>
                </td>
                </tr>
              `;
      });
      $(".businessList").html(str);
      getPage(res.count, 'businessList', pageNum); //分页
    },
    error: function (err) {
      //console.log(err);
    }
  });
}
$('#uploadFile').live("change",function(e){
  // if(e.target.files.length < 1){
    var file = e.target.files[0];
    // var imgSrc;
    var token = sessionStorage.getItem("token");
    // console.log("file",file)
    var form = new FormData();
    form.append('file', file)
    form.append('authToken', token)
    $.ajax({
      processData: false, //告诉jquery不要去处理发送的数据
      contentType: false, //告诉jquery不要去设置Content-Type请求头
      type: "POST",
      url: APP_URL + "/uploadOne",
      data: form,
      dataType: "json",
      success: function (res) {
        console.log(res)
      }
    });
  // }
});

//点击查看详情
$('#search_details').live('click', function (e) {
  // console.log('id',e.target.dataset.id)
  var id = e.target.dataset.id;
  var index = e.target.dataset.index;
  openAddData('../BusinessDetail/index.html?id='+id+'&index='+index)
})

//点击搜索按钮
$('#search_btn').live('click', function () {
  var companyName = $('#search_companyName').val();
  var linkMan = $('#search_linkMan').val();
  var responsible = $('#search_responsible').val();
  var id = $('#search_id').val();
  console.log(id);
  businessList(1, companyName, linkMan, responsible, id);
})
