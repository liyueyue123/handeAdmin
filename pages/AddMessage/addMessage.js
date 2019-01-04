$(function () {
  var ue = UE.getEditor('message_content');
  $.showLoading('加载中');
  isAdmin(ue); //是否是超级管理员
});

// 获取是否是超级管理员
function isAdmin(ue) {
  var token = sessionStorage.getItem("token");
  $.ajax({
    type: "GET",
    url: APP_URL + "/message/isAdmin",
    data: {
      authToken: token
    },
    dataType: "json",
    success: function (res) {
      console.log(res);
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
      var str = "";
      str += `
        ${res.isAdmin==true?`
        <select class="form-control" id="acceptSelect">
            <option value="" selected="">---请选择接收用户---</option>
            <option value="1">平台用户</option>
            <option value="2">公司名称</option>
        </select>`:"平台用户"}   
      `;
      $("#acceptMan").html(str);
      $("#acceptSelect").change(function () {
        var selectVal = $("#acceptSelect>option:selected").val();
        console.log(selectVal);
        if (selectVal == 1) {
          userList(1); //用户列表
        } else if (selectVal == 2) {
          companyList(); //公司列表
        }
        addMessage(ue); //添加消息
      });
    },
    error: function (err) {
      console.log(err);
    }
  });
}

// 获取选择收用户
function userList(pageNum) {
  var token = sessionStorage.getItem("token");
  $.ajax({
    type: "GET",
    url: APP_URL + "/user/all",
    data: {
      authToken: token,
      limit: 999999999,
      page: pageNum,
    },
    dataType: "json",
    success: function (res) {
      console.log('userList', res);
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
      str += `
        <td align="center">&nbsp;</td>
        <td class="tabTd">
            <div style="height:500px;overflow-x:auto;">
                <table class="innerTab">
                    <thead>
                        <tr>
                            <th class="thStyle">选择</th>
                            <th class="thStyle">序号</th>
                            <th class="thStyle">ID</th>
                            <th class="thStyle">姓名</th>
                            <th class="thStyle">手机号</th>
                            <th class="thStyle">公司名称</th>
                            <th class="thStyle">部门</th>
                            <th class="thStyle">头像</th>
                        </tr>
                    </thead>
                    <tbody class="userList">
        `;
      $.each(data, function (index, val) {
        str += `
            <tr>
              <td><input type="checkbox" name="del_listID" id="${val.id}" data-name="multi-select" value="${val.id}" /></td>
              <td>${index+1}</td>
              <td>${val.id}</td>
              <td>${val.name}</td>
              <td>${val.phone}</td>
              <td>${val.companyname}</td>
              <td>${val.departname}</td>
              <td><img style="width:60px;height:60px;margin:10px;" src="${val.icon}"/></td>
            </tr>
          `;
      });
      str += `

                    </tbody>
                </table>
            </div>
        </td>
      `;
      $("#acceptManList").html(str);
    },
    error: function (err) {
      console.log(err);
    }
  });
};

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
      str += `
          <td align="center">&nbsp;</td>
          <td>
              <select class="form-control" id="companySel">
                  <option value="" selected="">---请选择公司名称---</option>
          `;
      $.each(data, function (index, val) {
        str += `<option value="${val.id}">${val.companyname}</option>`;
      });
      str += `
              <option value="=0">公司名称1</option>
          </select>
      </td>
      `;
      $("#acceptManList").html(str);
    },
    error: function (err) {
      console.log(err);
    }
  });
}

function addMessage(ue) {
  // 添加消息
  $("#saveButton").click(function () {
    var token = sessionStorage.getItem("token");
    var title = $('#message_title').val(); //标题
    var message = ue.getContent("message_content"); //消息内容
    console.log(message);
    var data = {};
    data.authToken = token;
    data.message = message;
    data.title = title;
    // 选择用户
    if ($(".userList").length != 0) {
      var num = "";
      $.each($("input[name=del_listID]:checked"), function () {
        num += $(this).val() + ',';
      });
      var userIds = num.substring(0, num.length - 1);
      data.userIds = userIds;
    }
    // 选择公司
    if ($("#companySel").length != 0) {
      var company = parseInt($("#companySel>option:selected").val());
      data.companyId = company;
      data.userIds = "";
    }
    // console.log(data);
    $.ajax({
      type: "GET",
      url: APP_URL + "/message/pushMessage",
      data: data,
      dataType: "json",
      success: function (res) {
        console.log(res);
        if (res.code == 0) {
          alert('消息添加成功');
          window.location.href = '../MessageManage/index.html'
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
  });
}