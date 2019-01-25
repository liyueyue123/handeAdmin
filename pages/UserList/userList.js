$(function () {
  $.showLoading('加载中');
  var userstate = sessionStorage.getItem("userstate");
  if (userstate == 1) {
    $('#search_compName').show();
  }
  if (userstate != 3) {
    $('#addBtn').show();
  }
  companyList();
  var url = window.location.href;
  if (url.indexOf('=') != -1) {
    var index = url.split('=')[1];
    var indexNum = Math.ceil(index / 10);
    // console.log(indexNum);
    userList(indexNum); //公司列表
  } else {
    userList(1); //公司列表
  }
});
//用户列表
function userList(pageNum, phone, name, Id, compName, department) {
  var token = sessionStorage.getItem("token");
  $.ajax({
    type: "GET",
    url: APP_URL + "/user/all",
    data: {
      authToken: token,
      authTokn: token,
      limit: 10,
      page: pageNum,
      phone: phone,
      name: name,
      Id: Id,
      department: department,
      compName: compName
    },
    dataType: "json",
    success: function (res) {
      console.log('userList', res);
      $("#addBtn").attr("data-num",res.count);
      $.closeLoading();
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
      var str = "";
      var pages = 10 * (pageNum - 1);
      $.each(data, function (index, val) {
        str += `
          <tr>
            <td><input type="checkbox" name="del_listID" id="${val.id}" data-name="multi-select" value="${val.id}" data-index="${pages+(index+1)}"  data-userstate="${val.role == ''? '' : val.role.userstate }"/></td>
            <td>${pages+(index+1)}</td>
            <td>${val.id}</td>
            <td>${val.name}</td>
            <td><a href="javascript:;">${val.phone}</a></td>
            <td>${val.departname}</td>
            <td><img style="width:60px;height:60px;margin:10px;" src="${val.icon}"/></td>
            <td>${val.customerCount}</td>
            <td>${val.opportunityCount}</td>
            <td class="hideCompany">${val.companyname}</td>
            <td>${val.role == ''? '' : val.role.rolename }</td>
            <td style="display:none;"></td>
            <td style="display:none;"></td>
            <td style="display:none;"></td>
            <td style="display:none;">${val.passwd}</td>
            <td width="150" style="display:none;">
                <div class="btn btn-success navbar-btn" id="search_details" data-id="${val.id}" style="display:none;"> 查看搜索历史</div>
            </td>
            <td>${val.customerCount}</td>
            <td><a class="btn ${val.isLock==1?'btn-success':'btn-danger'}" data-table="user" data-id="${val.id}" data-status="0" data-text1="禁用" data-text2="启用" href="javascript:void(0);"  onclick="operate(${val.isLock},${val.id},${pageNum})">${val.isLock == 0 ?"禁用":"启用"}</a></td>
          </tr>
        `;
      });
      $(".userList").html(str);
      $('input[data-name=multi-select]').iCheck({
        checkboxClass: 'icheckbox_flat-blue',
        radioClass: 'iradio_flat-blue'
      });
      getPage(res.count, 'userList', pageNum); //分页
    },
    error: function (err) {
      console.log(err);
    }
  });
  if (compName) {
    $.ajax({
      type: "GET",
      url: APP_URL + "/addEnsearch",
      data: {
        authToken: token,
        userId: userId
      },
      dataType: "json",
      success: function (res) {
        if (res.code == 0) {
          userList(pageNum);
        }
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
      },
      error: function (err) {
        console.log(err);
      }
    });
  }
};
// 禁用
function operate(isLock, userId, pageNum) {
  console.log(pageNum)
  var token = sessionStorage.getItem("token");
  if (isLock == 0) {
    var url = APP_URL + "/stopUser";
  } else {
    var url = APP_URL + "/unRelieveUser";
  }
  $.ajax({
    type: "GET",
    url: url,
    data: {
      authToken: token,
      userId: userId
    },
    dataType: "json",
    success: function (res) {
      if (res.code == 0) {
        userList(pageNum);
      }
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
    },
    error: function (err) {
      console.log(err);
    }
  });
  var token = sessionStorage.getItem("token");
  if (isLock == 0) {
    var url = APP_URL + "/stopUser";
  } else {
    var url = APP_URL + "/unRelieveUser";
  }
  $.ajax({
    type: "GET",
    url: url,
    data: {
      authToken: token,
      userId: userId
    },
    dataType: "json",
    success: function (res) {
      if (res.code == 0) {
        userList(pageNum);
      }
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
    },
    error: function (err) {
      console.log(err);
    }
  });
}
//点击搜索或者筛选按钮
$('#search_btn').live('click', function () {
  $.showLoading('加载中');
  var phone = $('#search_phone').val();
  var name = $('#search_name').val();
  var Id = $('#search_Id').val();
  var compName = $('#search_compName').val();
  userList(1, phone, name, Id, compName);
  $('#export_department').val('');
  $('#export_phone').val(phone);
  $('#export_name').val(name);
  $('#export_Id').val(Id);
  $('#search_compName').val(compName);
})
$('#filter_btn').live('click', function () {
  $.showLoading('加载中');
  var phone = '';
  var name = '';
  var Id = '';
  var compName = '';
  var department = $('#filter_department').val();
  userList(1, phone, name, Id, compName, department);
  $('#export_phone').val('');
  $('#export_name').val('');
  $('#export_Id').val('');
  $('#search_compName').val('');
  $('#export_department').val(department);
})
//点击过搜索或者筛选按钮赋值
//点击导出按钮
$('#export').live('click', function () {
  var p = confirm("由于数据存在关联查询， 导出Exce可能需要1 - 3 分钟的时间， 确定要导出吗（ 确定后请勿刷新页面或关闭浏览器） ?")
  if (p == true) {
    var token = sessionStorage.getItem("token");
    var phone = $('#export_phone').val();
    console.log(phone)
    var name = $('#export_name').val();
    var Id = $('#export_Id').val();
    var department = $('#export_department').val();
    window.location.href = 'http://hande.icpnt.com/export?authToken=' + token + "&phone=" + phone + '&name=' + name + '&department=' + department;
  }
})
var isAll = true;
//点击全选按钮
$('#allChecked').live('click', function () {
  if (isAll == true) {
    allchecked();
    $('#changeTxt').text('取消全选');
    isAll = false;
  } else {
    nochecked();
    isAll = true;
    $('#changeTxt').text('全选');
  }
})

//全选
function allchecked() {
  $("input[name=del_listID]").attr({
    'checked': true
  })
  $('input[data-name=multi-select]').iCheck({
    checkboxClass: 'icheckbox_flat-blue',
    radioClass: 'iradio_flat-blue'
  });
}
//全不选
function nochecked() {
  $("input[name=del_listID]").attr({
    'checked': false
  })
  $('input[data-name=multi-select]').iCheck({
    checkboxClass: 'icheckbox_flat-blue',
    radioClass: 'iradio_flat-blue'
  });
}

//点击查看企业历史
$('#search_details').live('click', function (e) {
  // console.log('id', e.target.dataset.id)
  var id = e.target.dataset.id;
  openAddData('../companyHistory/index.html?id=' + id);
});

// 获取公司列表
function companyList() {
  var token = sessionStorage.getItem("token");
  $.ajax({
    type: "GET",
    url: APP_URL + "/companySelect",
    data: {
      authToken: token
    },
    dataType: "json",
    success: function (res) {
      console.log(res);
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
      var str = "";
      str += `<option value="" selected="">选择公司进行搜索</option>`;
      $.each(data, function (index, val) {
        str += `<option value="${val.id}">${val.companyname}</option>`;
      });
      $("#search_compName").html(str);
    },
    error: function (err) {
      console.log(err);
    }
  });
}