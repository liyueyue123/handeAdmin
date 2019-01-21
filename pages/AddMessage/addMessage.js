$(function () {
  var ue = UE.getEditor('message_content');
  var userstate = sessionStorage.getItem("userstate");
  var companyId = sessionStorage.getItem('companyId');
  var str = "";
  str += `
        ${userstate==1?`
        <select class="form-control" id="acceptSelect">
            <option value="" selected="">---请选择接收用户---</option>
            <option value="1">平台用户</option>
            <option value="2">公司名称</option>
        </select>`:"公司名称"}   
      `;
  $("#acceptMan").html(str);
  if (userstate == 2) {
    $.showLoading('加载中');
    companyList(companyId); //所在公司名称
  } else {
    $("#acceptSelect").change(function () {
      var selectVal = $("#acceptSelect>option:selected").val();
      if (selectVal == 1) {
        $.showLoading('加载中');
        userList(1); //用户列表
      } else if (selectVal == 2) {
        $.showLoading('加载中');
        companyList(); //公司列表
      }
    });
  }
  addMessage(ue); //添加消息
});


// 获取选择收用户
function userList(pageNum) {
  var token = sessionStorage.getItem("token");
  $.ajax({
    type: "GET",
    url: APP_URL + "/user/all",
    data: {
      authToken: token,
      authTokn: token,
      limit: 999999999,
      page: pageNum,
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
function companyList(companyId) {
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
      str += `
          <td align="center">&nbsp;</td>
          <td>
              <select class="form-control" id="companySel">
                  <option value="" selected="">---请选择公司名称---</option>
          `;
      $.each(data, function (index, val) {
        if (val.id == companyId) {
          str += `
            <option value="${val.id}" selected>${val.companyname}</option>
          `;
        } else {
          str += `
              <option value="${val.id}">${val.companyname}</option>
            `;
        }
      });
      str += `
          </select>
      </td>
      `;
      $("#acceptManList").html(str);
      if (companyId) {
        $("#companySel").attr("disabled", true);
      }
    },
    error: function (err) {
      console.log(err);
    }
  });
}
  // 添加消息
function addMessage(ue) {
  $("#saveButton").click(function () {
    var token = sessionStorage.getItem("token");
    var title = $('#message_title').val(); //标题
    var message = ue.getContent("message_content"); //消息内容
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