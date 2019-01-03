$(function () {
  $.showLoading('加载中');
  userList(1);
});

function userList(pageNum, phone, name, Id, department) {
  var token = sessionStorage.getItem("token");
  $.ajax({
    type: "GET",
    url: APP_URL + "/user/all",
    data: {
      authToken: token,
      limit: 10,
      page: pageNum,
      phone: phone,
      name: name,
      Id: Id,
      department: department
    },
    dataType: "json",
    success: function (res) {
      console.log('userList', res);
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
            <td><input type="checkbox" name="del_listID" id="${val.id}" data-name="multi-select" value="${val.id}" /></td>
            <td>${pages+(index+1)}</td>
            <td>${val.id}</td>
            <td>${val.name}</td>
            <td><a href="javascript:;">${val.phone}</a></td>
            <td>${val.departname}</td>
            <td><img style="width:60px;height:60px;margin:10px;" src="${val.icon}"/></td>
            <td>${val.customerCount}</td>
            <td>${val.opportunityCount}</td>
            <td>${val.companyname}</td>
            <td></td>
            <td></td>
            <td></td>
            <td>${val.passwd}</td>
            <td></td>
            <td>${val.customerCount}</td>
            <td><a class="btn ${val.isLock==1?'btn-success':'btn-danger'}" data-table="user" data-id="${val.id}" data-status="0" data-text1="禁用" data-text2="启用" href="javascript:void(0);"  onclick="operate(${val.isLock},${val.id},${pageNum})">${val.isLock == 0 ?"禁用":"启用"}</a></td>
          </tr>
        `;
      });
      $(".userList").html(str);
      getPage(res.count, 'userList', pageNum); //分页
    },
    error: function (err) {
      console.log(err);
    }
  });
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
  var phone = $('#search_phone').val();
  var name = $('#search_name').val();
  var Id = $('#search_Id').val();
  userList(1, phone, name, Id);
})
$('#filter_btn').live('click', function () {
  var phone = '';
  var name = '';
  var Id = '';
  var department = $('#filter_department').val();
  userList(1, phone, name, Id, department);
})
//点击导出按钮
$('#export').live('click', function () {
  var p = confirm("由于数据存在关联查询， 导出Exce可能需要1 - 3 分钟的时间， 确定要导出吗（ 确定后请勿刷新页面或关闭浏览器） ?")
  if (p == true) {
    var token = sessionStorage.getItem("token");
    window.location.href = 'http://hande.icpnt.com/export?authToken=' + token;
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
}
//全不选
function nochecked() {
  $("input[name=del_listID]").attr({
    'checked': false
  })
}