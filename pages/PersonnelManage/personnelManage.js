$(function () {
  $.showLoading('加载中');
  personnelManageList(1);
});

//人员列表
function personnelManageList(pageNum, roleName) {
  $.ajax({
    type: "GET",
    url: APP_URL + "/console/user/all",
    data: {
      authToken: token,
      limit: 10,
      page: pageNum,
      roleName: roleName
    },
    dataType: "json",
    success: function (res) {
      console.log('personnelList', res);
      $.closeLoading();
      var data = res.data;
      var str = "";
      var pages = 10 * (pageNum - 1);
      if (res.code == 0) {
        $.each(data, function (index, val) {
          if (val.lastlogintime == "") {
            var lasrlogintime = val.lastlogintime;
          } else {
            var lasrlogintime = moment(val.lastlogintime).format("YYYY年MM月DD日");
          }
          if (val.iconurl == '') {
            var src = ''
          } else {
            var src = "src=" + val.iconurl
          }
          str += `
               <tr>
              <td><input type="checkbox" name="del_listID" id="del_listID" data-name="multi-select" value="${val.id}" data-role="${val.roleid}" /></td>
              <td>${pages+(index+1)}</td>
              <td>${val.name}</td>
              <td><img ${src} width="70px" height="70px" alt="暂无用户头像"></td>
              <td>${val.roleName}</td>
              <td>${val.account}</td>
              <td>${val.password}</td>
              <td>${moment(val.createtime).format("YYYY年MM月DD日")}</td>
              <td>${lasrlogintime}</td>
              <td><a class="btn ${val.status==1?'btn-success':'btn-danger'}" data-table="user" data-id="${val.id}" data-status="0" data-text1="禁用" data-text2="启用" href="javascript:void(0);"  onclick="operate(${val.status},${val.id},${pageNum})">${val.status == 0 ?"禁用":"启用"}</a></td>
              </tr>
            `;
        });
        $(".personnelList").html(str);
        $('input[data-name=multi-select]').iCheck({
          checkboxClass: 'icheckbox_flat-blue',
          radioClass: 'iradio_flat-blue'
        });
        getPage(res.count, 'personnelManageList', pageNum); //分页
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
    }
  });
}

//停用用户
function operate(status, userId, pageNum) {
  var token = sessionStorage.getItem("token");
  if (status == 0) {
    var url = APP_URL + "/console/stopUser";
  } else {
    var url = APP_URL + "/console/useUser";
  }
  $.ajax({
    type: "GET",
    url: url,
    data: {
      authToken: token,
      id: userId
    },
    dataType: "json",
    success: function (res) {
      if (res.code == 0) {
        personnelManageList(pageNum);
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

//点击搜索按钮
$('#search_btn').live('click', function () {
  var roleName = $('#search_roleName').val();
  personnelManageList(1, roleName);
})

//点击修改按钮,判断是否有权限修改
$("#edit-button").click(function () {
  var checkBox = $("input[name=del_listID]:checked");
  // var roleid = checkBox.data('role');
  if (checkBox.length == 1) {
    isAdmin();
  } else if (checkBox.length > 1) {
    $.show({
      title: '操作提示',
      content: '只能同时编辑一条数据！'
    });
  } else {
    $.show({
      title: '操作提示',
      content: '请至少选中一条数据！'
    });
  }
})

//判断是超级管理员
function isAdmin() {
  $.ajax({
    type: "GET",
    url: APP_URL + "/message/isAdmin",
    data: {
      authToken: token,
    },
    dataType: 'json',
    success: function (res) {
      if (res.code == 0) {
        var isAdmin = res.isAdmin;
        if (isAdmin == true) {
          editData('../AddPersonnel/index.html');
        } else {
            $.show({
              title: '操作提示',
              content: '您没有修改权限,请选择其他人员',
              closeCallback: function () {
                $("input[name=del_listID]").attr({
                  'checked': false
                })
              }
            });
        }
      }
    }
  })
}