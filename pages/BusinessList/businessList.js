$(function () {
  $.showLoading('加载中');
  businessList(1);
});

// 获取商机列表
function businessList(pageNum, companyName, linkMan, responsible, id, price, stage, startTime, city) {
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
      id:id,
      price: price,
      stage: stage,
      startTime: startTime,
      city: city
    },
    dataType: "json",
    success: function (res) {
      console.log('businessList', res);
      $.closeLoading();
      var data = res.data;
      var str = '';
      var pages = 10 * (pageNum - 1);
      $.each(data, function (index, val) {
        str += `
                <tr>
                <td><input type="checkbox" name="del_listID" id="del_listID" data-index="${pages+index+1}"data-name="multi-select" value="${val.id}" /></td>
                <td>${pages+index+1}</td>
                <td>${val.id}</td>
                <td>${val.companyname}</td>
                <td>${val.price}</td>
                <td>${val.provinesName}${val.cityName}${val.areaName}</td>
                <td>${moment(val.time).format('YYYY年MM月DD日')}</td>
                <td>${val.stage}</td>
                <td>${val.groupid}</td>
                <td>${val.source}</td>
                <td width="300">
                <div class="btn btn-success navbar-btn" id="search_details" data-id="${val.id}" data-index="${pages+index+1}"> 查看详情</div>
                <div class="btn btn-info navbar-btn" style="position:relative;" id="upload_file" style="margin-left:20px;" data-id="${val.id}" data-index="${pages+index+1}">
                   <div>上传附件<div>
                   <div style="position:absolute;left:0;top:0;opacity:0;"><input type='file' height='34.5' multiple="multiple"></div>
                </div>
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
$('#upload_file').live("change", function (e) {
  //上传单个文件
  if (e.target.files.length <= 1) {
    var file = e.target.files[0];
    var token = sessionStorage.getItem("token");
    // console.log("file",file)
    var form = new FormData();
    form.append('file', file);
    form.append('authToken', token);
    $.ajax({
      processData: false, //告诉jquery不要去处理发送的数据
      contentType: false, //告诉jquery不要去设置Content-Type请求头
      type: "POST",
      url: APP_URL + "/uploadOne",
      data: form,
      dataType: "json",
      success: function (res) {
        console.log(res)
        if(res.code==0){
          alert('附件上传成功!')
        }
      }
    });
  }else{
    var form = new FormData();
    for (var i = 0; i < e.target.files.length;i++){
      form.append('files', e.target.files[i]);
    }
    var token = sessionStorage.getItem("token");
    form.append('authToken', token);
    $.ajax({
      processData: false, //告诉jquery不要去处理发送的数据
      contentType: false, //告诉jquery不要去设置Content-Type请求头
      type: "POST",
      url: APP_URL + "/upload",
      data: form,
      dataType: "json",
      success: function (res) {
        console.log(res)
        if (res.code == 0) {
          alert('附件上传成功!')
        }
      }
    });
  }
});

//点击查看详情
$('#search_details').live('click', function (e) {
  console.log('id',e.target.dataset.id)
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
  // console.log(id);
  businessList(1, companyName, linkMan, responsible, id);
})
//点击筛选按钮
$('#filter_btn').live('click', function () {
  var companyName = '';
  var linkMan = '';
  var responsible = $('#filter_responsible').val();
  var id = '';
  var price = $('#filter_price').val();
  var stage = $('#filter_stage').val();
  var startTime = $('#filter_startTime').val();
  var city = $('#filter_city').val();
  businessList(1, companyName, linkMan, responsible, id, price, stage, startTime, city);
})