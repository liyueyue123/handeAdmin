var APP_URL = 'http://hande.icpnt.com';
var APP_IMAGE_URL = 'http://hdimg.icpnt.com/';
var token = sessionStorage.getItem("token");
$(document).ready(function (e) {
  $.Tipmsg.r = null;
  $(".addForm").Validform({
    tiptype: function (msg) {
      $.show({
        title: '操作提示',
        content: msg
      });
    },
    tipSweep: true
  });

  //添加数据页面取消按钮
  $("button#cancelButton").click(function () {
    window.history.back(-1);
  });

  //全站复选框美化
  $('input[data-name=multi-select]').iCheck({
    checkboxClass: 'icheckbox_flat-blue',
    radioClass: 'iradio_flat-blue'
  });
});

//jQueryForm封装
function ajax(obj) {
  $(".addForm").ajaxForm({
    type: obj.type, //请求方式：get或post
    dataType: "json", //数据返回类型：xml、json、script
    //beforeSerialize: function() {},
    data: {
      authToken: token,
      token: token
    }, //自定义提交的数据
    beforeSubmit: function () {
      // 新增公司处理多组电话
      if ($(".formPhone").length != "") {
        var arr = [];
        $.each($(".formPhone"), function () {
          arr.push($(this).val());
        });
        var phones = arr.toString();
        $("#formPhones").val(phones);
      }
      //新增角色，处理多选菜单项
      // var checkBox = $("input[name=menuIds]:checked");
      // $.each(checkBox, function () { 
      //    console.log($(this).val());
      // });
      // if ($(".menuCheckBox").length != "") {
      //   var menuCheck = [];
      //   $.each($(".menuCheckBox"), function (index, val) {
      //     if (val.checked) {
      //       menuCheck.push(val.value);
      //     }
      //   });
      //   var menuIds = menuCheck.join(",");
      //   $("#formMenuIds").val(menuIds);
      //   console.log($("#formMenuIds").val());
      // }
      $.showLoading('正在提交……');
    },
    success: function (res) { //表单提交成功回调函数
      if (res.success) {
        if (typeof (obj.success) == 'function') {
          obj.success(res);
        }
      } else {
        $.show({
          title: '操作失败',
          content: res.message
        });
      }
      $.closeLoading();
      $(".addForm").resetForm();
    },
    error: function (err) {
      alert("表单提交异常！点击确定显示错误信息！");
      $.closeLoading();
      var errHtml = err.responseText;
      var errWin = window.open('about:blank');
      errWin.document.write(errHtml);
      errWin.document.close();
    }
  });
}

//打开添加数据页面
function openAddData(src) {
  if (typeof (src) != "undefined") {
    window.location.href = src;
  } else {
    $.show({
      title: '操作提示',
      content: '未检测到指定页面！'
    });
  }
}


//列表页面点击修改按钮
function editData(src) {
  var checkBox = $("input[name=del_listID]:checked");
  var checkBoxVal = checkBox.val();

  if (checkBox.length == 1) {
    window.location.href = src + '?id=' + checkBoxVal;
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
}


//列表页面点击删除按钮
function deleteData(table, method, id) {
  var token = sessionStorage.getItem("token");
  var delID = [];
  $("input[name=del_listID]:checked").each(function () {
    delID.push($(this).val());
  });
  var data = {};;
  var a = id;
  var b = delID.toString();
  var data = {}
  data[a] = b;
  data.authToken = token;
  // console.log(data);
  if (delID.length <= 0) {
    $.show({
      title: '操作提示',
      content: '请选择要删除的数据！'
    });
  } else {
    $.show({
      title: '删除数据',
      content: '确定要删除吗？',
      isConfirm: true,
      callback: function () {
        $.ajax({
          type: method,
          url: APP_URL + table,
          data: data,
          dataType: "json",
          success: function (res) {
            console.log(res);
            if (res.code == 0) {
              window.location.reload();
            }
          },
          error: function (err) {
            console.log(err);
          }
        });

      }
    });
  }
}