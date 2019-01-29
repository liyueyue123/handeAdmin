$(function () {
  var userstate = sessionStorage.getItem("userstate");
  var companyId = sessionStorage.getItem('companyId');
  // console.log(userstate)
  if (userstate == 1) {
    roleState(); //用户身份为平台管理员时调用的
  }
  if (userstate == 2) {
    $('#company').attr('disabled', 'disabled');
  }
  var url = window.location.href; // 首先获取到你的URL地址;
  if (url.indexOf('&') != -1) {
    $("#cancelButton").hide();
    $("#cancelButtonEdit").show();
    var arr = url.split("&"); // 用“&”将URL分割成2部分每部分都有你需要的东西;
    var id = arr[0].split("=")[1];
    var indexNum = arr[1].split("=")[1];
    $("#cancelButtonEdit").attr("data-index", indexNum);
    sessionStorage.setItem("indexNum", indexNum);
    $('.addForm').attr('action', APP_URL + "/editUser");
    $('#changeTitle').text('修改');
    $('#changeTxt').text('修改');
    $('#changeTxt').prev().removeClass("fa-check");
    $('#changeTxt').prev().addClass("fa-save");
    $.showLoading('加载中');
    getUserInfo(id);
  } else {
    $("#cancelButton").show();
    $("#cancelButtonEdit").hide();
    // var indexNum = parseInt(url.split("=")[1]) + 1;
    sessionStorage.setItem("indexNum", 10);
    $('.addForm').attr('action', APP_URL + "/register");
    if (userstate != 1) {
      getCompanySelect(companyId); // 获取公司的下拉选框 
    } else {
      getCompanySelect(); // 获取公司的下拉选框
    }
    getRoleSelect(); // 获取角色列表 
    // getUserStateSelectAdd(); // 获取用户身份 (添加人员时)
    getDepartmentSelect(companyId); // 获取部门的下拉选框
  }
  submit()
});


function getUserInfo(id) { //获取用户详情
  var token = sessionStorage.getItem("token");
  $.ajax({
    type: "GET",
    url: APP_URL + "/getUser",
    data: {
      authToken: token,
      userId: id
    },
    dataType: "json",
    success: function (res) {
      console.log('uerInfo', res)
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
      $('#user_id').val(data.id)
      $("#user_loginname").val(data.loginname);
      $("#user_name").val(data.name);
      $("#user_passwd").val(data.passwd);
      $("#user_phone").val(data.phone);
      if (data.icon.length > 30) {
        $("#icon-image").find("img").attr({
          "src": data.icon
        })
        // 显示头像
        $('#icon-image').show();
        var iconval = data.icon.slice(23, data.icon.length);
        $("#icon").attr({
          'value': iconval
        });
        console.log($('#icon').val())
      }
      getCompanySelect(data.company); // 获取公司的下拉选框
      getDepartmentSelect(data.company, data.department); // 获取部门的下拉选框
      // getUserStateSelect(data.userstate); // 获取用户身份
      getRoleSelect(data.roleId, data.userstate); // 获取角色列表
    }
  });
}


$('#user_phone').blur(function () { //当点击手机号的时候，loginname赋值
  var value = $(this).val();
  $('#user_loginname').val(value);
})


$('#user_passwd').focus(function () { //当点击密码框的时候清空
  this.value = '';
})

$('#icon-image').hide(); // 隐藏空白头像

$('#iconfile').change(function (e) { // 上传头像
  var path = $(this).val(),
    extStart = path.lastIndexOf('.'),
    ext = path.substring(extStart, path.length).toUpperCase();
  // console.log(path);
  let url = window.URL || window.webkitURL;
  console.log(url.createObjectURL(this.files[0])); //this.files[0]为选中的文件(索引为0因为是单选一个),这里是图片
  let img = new Image(); //手动创建一个Image对象
  img.src = url.createObjectURL(this.files[0]); //创建Image的对象的url
  img.onload = function () {
    console.log('height:' + this.height + '----width:' + this.width)
    var w = this.width;
    var h = this.height;
    if (ext !== null) {
      //判断图片格式
      if (ext !== '.PNG' && ext !== '.JPG' && ext !== '.JPEG' && ext !== '.GIF') {
        alert('请上传正确格式的图片');
        $('#icon-image').hide();
        $("#icon-image").find("img").attr({
          "src": ''
        })
        return false;
      }
      // //获取图片大小，注意使用this，而不是$(this)
      // var size = this.files[0].size / 1024;
      // if (size > 10240) {
      //   alert('图片大小不能超过10M');
      //   return false;
      // }
      console.log(w, h)
      if (w != h) {
        $("#iconfile").val('')
        $("#icon-image").find("img").attr({
          "src": ''
        })
        alert('请选择宽高相等的图片作为头像');
        return false;
      }
      if (w < 200 || h < 200) {
        $("#iconfile").val('')
        $("#icon-image").find("img").attr({
          "src": ''
        })
        alert('请选择宽高大于200px的图片作为头像');
        return false;
      }
      var imgBox = e.target;
      uploadImg(imgBox)
    }
  }
});


function uploadImg(tag) { //上传图片时调用的接口
  var file = tag.files[0];
  // var imgSrc;
  var token = sessionStorage.getItem("token");
  console.log("file", file)
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
      $("#icon-image").find("img").attr({
        "src": APP_IMAGE_URL + res.data
      });
      $("#icon").attr({
        'value': res.data
      });
      console.log($('#icon').val())
    }
  });
  $('#icon-image').show(); // 显示头像
}


function getCompanySelect(c) { // 获取公司 下拉选框
  var token = sessionStorage.getItem("token");
  $.ajax({
    type: "GET",
    url: APP_URL + "/companySelect",
    data: {
      authToken: token
    },
    dataType: "json",
    success: function (res) {
      console.log('companyList', res);
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
      var str = "<option value='' selected>---请选择公司---</option>";
      $.each(data, function (index, val) {
        str += `
                <option value="${val.id}">${val.companyname}</option>
            `;
      });
      $("#company").html(str);
      if (c) {
        $("#company").find("option[value=" + c + "]").attr("selected", true);
        $("#companyInput").val(c);
      }
      submit();
    }
  });
}


$("#company").change(function () { //当公司的 下拉选框发生改变时
  var companyId = $('#company option:selected').val();
  $("#companyInput").val(companyId);
  getDepartmentSelect(companyId);
  submit();
})


$('#addDepartment-btn').live('click', function () { // 添加部门
  var val = $('#addDepartment').val();
  if (val) {
    var token = sessionStorage.getItem("token");
    var companyId = $('#company option:selected').val();
    if (companyId) {
      $.ajax({
        type: "post",
        url: APP_URL + "/addDepartment",
        data: {
          authToken: token,
          companyId: companyId,
          departname: val
        },
        dataType: "json",
        success: function (res) {
          console.log(res)
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
          $('#addDepartment').val('');
          alert(res.message)
          getDepartmentSelect(companyId);
        },
        fail: function (res) {
          alert(res.message)
        }
      });
    } else {
      alert('--请选择公司--');
    }
  }
})


function getDepartmentSelect(c, d) { // 获取部门 下拉选框
  if (c != '') {
    var token = sessionStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: APP_URL + "/departmentSelect",
      data: {
        authToken: token,
        companyId: c
      },
      dataType: "json",
      success: function (res) {
        console.log('departmentList', res);
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
        var str = "<option value='' selected>---请选择部门---</option>";
        $.each(data, function (index, val) {
          str += `
                    <option value="${val.id}">${val.departname}</option>
                `;
        });
        // console.log('str',str)
        $("#department").html(str);
        if (d) {
          $("#department").find("option[value=" + d + "]").attr("selected", true);
        }
      }
    });
  }
}


function getRoleSelect(r,s) { //获取角色 下拉选框
  var token = sessionStorage.getItem("token");
  var userstate = sessionStorage.getItem("userstate");
  console.log(userstate);
  $.ajax({
    type: "GET",
    url: APP_URL + "/role/list",
    data: {
      authToken: token,
      limit: 10,
      page: 1
    },
    dataType: "json",
    success: function (res) {
      console.log('roleId', res);
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
      var str = '<option value="" selected>---请选择角色---</option>';
      $.each(data, function (index, val) {
        if (userstate <= val.userstate) {
          str += `
                <option value="${val.id}" data-userstate="${val.userstate}">${val.rolename}</option>
              `;
        }
      });
      $("#roleId").html(str);
      if (r) {
        $("#roleId").find("option[value=" + r + "]").attr("selected", true);
      }
      if(s == 1){
        $("#company").find("option:selected").removeAttr("selected");
        $('#companyInput').val('');
        $("#company").val('');
        $('#department').find("option:selected").removeAttr("selected");
        $('#department').val('');
        $('#company').attr('disabled', 'disabled');
        $('#addDepartment').attr('disabled', 'disabled');
        $('#department').attr('disabled', 'disabled');
        $('#company').removeAttr('nullmsg');
        $('#department').removeAttr('nullmsg');
        $('#company').removeAttr('datatype');
        $('#department').removeAttr('datatype');
      }
      submit();
    },
    error: function (err) {
      console.log(err);
    }
  });
}

function roleState() { //用户身份为平台管理员时调用的 //不选择公司
  $("#roleId").change(function () { //当角色 下拉选框发生改变时
    var roleId = $('#roleId option:selected').attr('data-userstate');
    if (roleId == 1) {
      // $('.cabout').attr('disabled','disabled');  //不选择公司
      $("#company").find("option:selected").attr("selected", false);
      $('#companyInput').val('');
      $('#department').val('');
      $('#company').attr('disabled', 'disabled');
      $('#addDepartment').attr('disabled', 'disabled');
      $('#department').attr('disabled', 'disabled');
      $('#company').removeAttr('nullmsg');
      $('#department').removeAttr('nullmsg');
      $('#company').removeAttr('datatype');
      $('#department').removeAttr('datatype');
    } else {
      //  $('.cabout').removeAttr('disabled');
      $('#company').removeAttr('disabled');
      $('#addDepartment').removeAttr('disabled');
      $('#department').removeAttr('disabled');
      $('#company').attr('nullmsg', '请选择公司名称');
      $('#department').attr('nullmsg', '请选择部门名称');
      $('#company').attr('datatype', '*');
      $('#department').attr('datatype', '*');
    }
  })
}

function getUserStateSelect(s) { //获取用户身份 下拉选框
  var userstate = sessionStorage.getItem("userstate");
  var userId = sessionStorage.getItem("userId");
  var id = $('#user_id').val();
  console.log(userstate)
  console.log(userId);
  console.log(id)
  var str = '<option value="">---请选择用户身份---</option>';
  if (userstate == 1) {
    str += `
              <option value="1">平台管理员</option>
              <option value="2">公司管理员</option>
              <option value="3">一般职员</option>
            `;
  }
  if (userstate == 2) {
    if (userId == id) {
      str += `
              <option value="2">公司管理员</option>
              <option value="3">一般职员</option>
            `;
    } else {
      str += `
              <option value="3">一般职员</option>
            `;
    }
  }
  if (userstate == 3) {
    str += `
              <option value="3">一般职员</option>
            `;
  }
  $("#userstate").html(str);
  if (s) {
    $("#userstate").find("option[value=" + s + "]").attr("selected", true);
  }
  submit();
}

function getUserStateSelectAdd() { //获取用户身份 下拉选框(添加人员时调用)
  var userstate = sessionStorage.getItem("userstate");
  var str = '<option value="">---请选择用户身份---</option>';
  if (userstate == 1) {
    str += `
                <option value="2">公司管理员</option>
                <option value="3">一般职员</option>
              `;
  }
  if (userstate == 2) {
    str += `
                <option value="3">一般职员</option>
              `;
  }
  $("#userstate").html(str);
}


function submit() { //提交表单
  var roleId = sessionStorage.getItem("roleId");
  var role = $("#roleId").val();
  var userId = sessionStorage.getItem("userId");
  var id = $('#user_id').val();
  // console.log(roleId)
  // console.log(role)
  // console.log(userId);
  // console.log(id)
  if (role == roleId && userId == id) {
    ajax({
      type: 'post',
      success: function (res) {
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
        if (res.code == "0") {
          $.show({
            title: '操作提示',
            content: '您的信息已修改,需重新登录!',
            closeCallback: function () {
              if (window != top) {
                top.location.href = "../../login.html";
              }
            }
          });
        }
      }
    })
  } else {
    ajax({
      type: 'post',
      success: function (res) {
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
        console.log('success', JSON.stringify(res));
        var indexNum = sessionStorage.getItem("indexNum");
        sessionStorage.removeItem("indexNum");
        window.location.href = '../UserList/index.html?indexNum=' + indexNum;
      }
    })
  }
}