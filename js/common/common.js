APP_URL = 'http://hande.icpnt.com';
var options = {
  type: "POST", //请求方式：get或post
  dataType: "json", //数据返回类型：xml、json、script
  beforeSerialize: function() {
    //alert("tttt");
  },
  //data:{'icpnt':icpnt},//自定义提交的数据
  beforeSubmit: function() {
    if (CONTROLLER_NAME == 'Login') {
      $.showLoading('正在登陆……');
    } else {
      $.showLoading('正在提交……');
    }
  },
  success: function(json) { //表单提交成功回调函数
    //console.log(JSON.stringify(json));
    if (typeof(json.url) != "undefined") {
      if (json.url == '/Index/index') {
        window.location.href = json.url;
      } else {
        $.closeLoading(function() {
          window.location.href = APP + '/' + CONTROLLER_NAME + '/' + json.url;
        });
      }
    } else {
      alert(json.info);
      $.closeLoading();
    }
    $(".addForm").resetForm();
  },
  error: function(err) {
    alert("表单提交异常！点击确定显示错误信息！");
    $.closeLoading();
    var errHtml = err.responseText;
    var errWin = window.open('about:blank');
    errWin.document.write(errHtml);
    errWin.document.close();
  }
};
$(document).ready(function(e) {
  $.Tipmsg.r = null;
  $(".addForm").Validform({
    tiptype: function(msg) {
      //$.loginTip(msg);
      alert(msg);
    },
    tipSweep: true
  });
  $(".addForm").ajaxForm(options);

  //给排序单元格添加功能按钮
  $('td.sortTD').each(function(index, element) {
    var sortHtml = $(this).html();
    $(this).html('<i class="fa fa-arrow-circle-up faSort" aria-hidden="true" title="升序"></i> ' + sortHtml + ' <i class="fa fa-arrow-circle-down faSort" aria-hidden="true" title="降序"></i>');
  });
  //升降序操作
  $('i.faSort').click(function() {
    if ($(this).hasClass('fa-arrow-circle-up')) {
      var action = 'dataAsc';
    } else {
      var action = 'dataDesc';
    }
    var table = $(this).parent('td.sortTD').attr('name');
    var dataID = $(this).parents('tr').find('input#del_listID').val();
    if (typeof(table) != "undefined") {
      $.post(APP + '/Common/dataSort', {
        table: table,
        dataID: dataID,
        action: action
      }, function() {
        window.location.href = APP + '/' + CONTROLLER_NAME + '/' + ACTION_NAME;
      });
    } else {
      $.show({
        title: '操作提示',
        content: '没有找到指定的name值！'
      });
    }
  });
  //添加数据页面取消按钮
  $("button#cancelButton").click(function() {
    window.history.back(-1);
  });

  //全站复选框美化
  $('input[data-name=multi-select]').iCheck({
    checkboxClass: 'icheckbox_flat-blue',
    radioClass: 'iradio_flat-blue'
});


});

//打开添加数据页面
function openAddData(src) {
  if (typeof(src) != "undefined") {
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
    window.location.href = APP + '/' + CONTROLLER_NAME + '/' + src + '/id/' + checkBoxVal;
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

//编辑数据页面加载数据
function getEditData(callback) {
  var table = $('form.addForm').attr('data-table');
  var isD = $('form.addForm').attr('data-d');
  var editID = $("input#id").val();
  if (editID != '') {
    if (typeof(table) == 'undefined') {
      $.show({
        title: '错误提示',
        content: '缺少必要的id或表名，请检查form表单是否设置了自定属性data-table',
        closeCallback: function() {
          window.history.back();
        }
      });
      return false;
    }
    $.showLoading('正在加载……');
    $("#changeTitle").html('编辑');
    $("#saveButton").html('<i class="fa fa-floppy-o"></i> 保存');
    $.ajax({
        url: APP + '/Common/getEditDate',
        type: 'POST',
        data: {
          table: table,
          id: editID,
          isD: isD
        }
      })
      .done(function(data) {
        var jdata = data[0];
        $("form.addForm input[type!=checkbox],textarea,select").each(function(index, element) {
          var thisIdName = $(this).attr("id");
          $("#" + thisIdName).val(eval("jdata." + thisIdName));
        });
        $.closeLoading();
        if (typeof callback === "function") {
          callback(jdata);
        }
      })
      .fail(function(err) {
        $.closeLoading();
        $.show({
          title: '错误提示',
          content: '程序发生了不可预见的错误，点击关闭显示详细错误信息',
          closeCallback: function() {
            window.history.back();
            var errHtml = err.responseText;
            var errWin = window.open('about:blank');
            errWin.document.write(errHtml);
            errWin.document.close();
          }
        });
      })
      .always(function() {
        //console.log("complete");
      });
  }
  //opt.callback();
}

//列表页面点击删除按钮
function deleteData(table) {
  var delID = '';
  $("input[name=del_listID]:checked").each(function() {
    delID += $(this).val() + ",";
  });
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
      callback: function() {
        $.post(APP + '/Common/deleteData', {
          delID: delID,
          table: table
        }, function() {
          window.location.href = APP + '/' + CONTROLLER_NAME + '/' + ACTION_NAME;
        });
      }
    });
  }
}

//删除已上传的图片
function delImg(that) {
  var url = $(that).parents('div.upload-ldButton').attr('data-url');
  var parent = $(that).parents('div.upload-listDiv');
  $.show({
    title: '删除图片',
    content: '确定要删除吗？',
    isConfirm: true,
    callback: function() {
      $.post(APP + '/Common/deleteUploadImg', {
        imgUrl: url
      }, function() {
        parent.remove();
        $('input[value="' + url + '"]').val('');
      });
    }
  });
}