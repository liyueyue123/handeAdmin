$(function () {
  $.showLoading('加载中');
  var url = window.location.href;
  if (url.indexOf('=') != -1) {
    var index = url.split('=')[1];
    var indexNum = Math.ceil(index / 10);
    // console.log(indexNum);
    businessList(indexNum); //商机列表
  } else {
    businessList(1); // 商机列表
  }
});

// 获取商机列表
function businessList(pageNum) {
  var token = sessionStorage.getItem("token");
  var companyName = $('#search_companyName').val();
  var linkMan = $('#search_linkMan').val();
  var responsiblef = $('#filter_responsible').val();
  var responsibles = $('#search_responsible').val();
  var id = $('#search_id').val();
  var price = $('#filter_price').val();
  var stage = $('#filter_stage').val();
  var startTime = $('#filter_startTime').val();
  var city = $('#filter_city').val();
  var data = {};
  data.authToken = token;
  data.page = pageNum;
  data.limit = 10;
  if (companyName != "") {
    data.companyName = companyName;
  }
  if (linkMan != "") {
    data.linkMan = linkMan;
  }
  if (responsiblef != "") {
    data.responsible = responsiblef;
  }
  if (responsibles != "") {
    data.responsible = responsibles;
  }
  if (id != "") {
    data.id = id;
  }
  if (price != "") {
    data.price = price;
  }
  if (stage != "") {
    data.stage = stage;
  }
  if (startTime != "") {
    data.startTime = startTime;
  }
  if (city != "") {
    data.city = city;
  }
  $.ajax({
    type: "GET",
    url: APP_URL + "/console/opportunityList",
    data: data,
    dataType: "json",
    success: function (res) {
      $.closeLoading();
      console.log('businessList', res);
      if (res.code == "909090") {
        $.show({
          title: '操作提示',
          content: '您已掉线,请重新登录!',
          closeCallback: function () {
            if (window != top) {
              top.location.href = "../../login.html";
            }
          }
        });
      }
      var data = res.data;
      var str = '';
      var pages = 10 * (pageNum - 1);
      $.each(data, function (index, val) {
        str += `
                <tr>
                <td><input type="checkbox" name="del_listID" id="del_listID" data-index="${pages+index+1}"data-name="multi-select" value="${val.id}" data-index="${pages+index+1}"/></td>
                <td>${pages+index+1}</td>
                <td>${val.id}</td>
                <td>${val.companyname}</td>
                <td>${val.price}</td>
                <td>${val.provinesName}${val.cityName}${val.areaName}</td>
                <td>${moment(val.createtime).format('YYYY年MM月DD日')}</td>
                <td>${val.stage}</td>
                <td>${val.group == '' ? '' :val.group.groupName}</td>
                <td>${val.source}</td>
                <td width="300">
                <a class="btn btn-success navbar-btn" href="../BusinessDetail/index.html?id=${val.id}&indexNum=${pages+(index+1)}">查看详情</a>
                </td>
                </tr>
              `;
      });
      $(".businessList").html(str);
      $('input[data-name=multi-select]').iCheck({
        checkboxClass: 'icheckbox_flat-blue',
        radioClass: 'iradio_flat-blue'
      });
      getPage(res.count, 'businessList', pageNum); //分页
    },
    error: function (err) {
      //console.log(err);
    }
  });
}

// $('#upload_file').live("change", function (e) {
//   //上传单个文件
//   if (e.target.files.length <= 1) {
//     var file = e.target.files[0];
//     var token = sessionStorage.getItem("token");
//     // console.log("file",file)
//     var form = new FormData();
//     form.append('file', file);
//     form.append('authToken', token);
//     $.ajax({
//       processData: false, //告诉jquery不要去处理发送的数据
//       contentType: false, //告诉jquery不要去设置Content-Type请求头
//       type: "POST",
//       url: APP_URL + "/uploadOne",
//       data: form,
//       dataType: "json",
//       success: function (res) {
//         console.log(res)
//         if(res.code==0){
//           alert('附件上传成功!')
//         }
//       }
//     });
//   }else{
//     var form = new FormData();
//     for (var i = 0; i < e.target.files.length;i++){
//       form.append('files', e.target.files[i]);
//     }
//     var token = sessionStorage.getItem("token");
//     form.append('authToken', token);
//     $.ajax({
//       processData: false, //告诉jquery不要去处理发送的数据
//       contentType: false, //告诉jquery不要去设置Content-Type请求头
//       type: "POST",
//       url: APP_URL + "/upload",
//       data: form,
//       dataType: "json",
//       success: function (res) {
//         console.log(res)
//         if (res.code == 0) {
//           alert('附件上传成功!')
//         }
//       }
//     });
//   }
// });

//点击搜索按钮
$('#search_btn').live('click', function () {
  $('#filter_responsible').val('');
  $('#filter_price').val('');
  $('#filter_stage').val('');
  $('#filter_startTime').val('');
  $('#filter_city').val('');
  $.showLoading('加载中');
  businessList(1);
})
//点击筛选按钮
$('#filter_btn').live('click', function () {
  $('#search_companyName').val('');
  $('#search_linkMan').val('');
  $('#search_responsible').val('');
  $('#search_id').val('');
  $.showLoading('加载中');
  businessList(1);
})