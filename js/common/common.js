APP_URL = 'http://hande.icpnt.com';
var token = sessionStorage.getItem("token");
$(document).ready(function (e) {
  $.Tipmsg.r = null;
  $(".addForm").Validform({
    tiptype: function (msg) {
      alert(msg);
    },
    tipSweep: true,
  });

  //给排序单元格添加功能按钮
  $('td.sortTD').each(function (index, element) {
    var sortHtml = $(this).html();
    $(this).html('<i class="fa fa-arrow-circle-up faSort" aria-hidden="true" title="升序"></i> ' + sortHtml + ' <i class="fa fa-arrow-circle-down faSort" aria-hidden="true" title="降序"></i>');
  });
  //升降序操作
  $('i.faSort').click(function () {
    if ($(this).hasClass('fa-arrow-circle-up')) {
      var action = 'dataAsc';
    } else {
      var action = 'dataDesc';
    }
    var table = $(this).parent('td.sortTD').attr('name');
    var dataID = $(this).parents('tr').find('input#del_listID').val();
    if (typeof (table) != "undefined") {
      $.post(APP + '/Common/dataSort', {
        table: table,
        dataID: dataID,
        action: action
      }, function () {
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
  $("button#cancelButton").click(function () {
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
    window.location.href = APP_URL + '/' + src + '/id/' + checkBoxVal;
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
    if (typeof (table) == 'undefined') {
      $.show({
        title: '错误提示',
        content: '缺少必要的id或表名，请检查form表单是否设置了自定属性data-table',
        closeCallback: function () {
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
      .done(function (data) {
        var jdata = data[0];
        $("form.addForm input[type!=checkbox],textarea,select").each(function (index, element) {
          var thisIdName = $(this).attr("id");
          $("#" + thisIdName).val(eval("jdata." + thisIdName));
        });
        $.closeLoading();
        if (typeof callback === "function") {
          callback(jdata);
        }
      })
      .fail(function (err) {
        $.closeLoading();
        $.show({
          title: '错误提示',
          content: '程序发生了不可预见的错误，点击关闭显示详细错误信息',
          closeCallback: function () {
            window.history.back();
            var errHtml = err.responseText;
            var errWin = window.open('about:blank');
            errWin.document.write(errHtml);
            errWin.document.close();
          }
        });
      })
      .always(function () {
        //console.log("complete");
      });
  }
  //opt.callback();
}

//列表页面点击删除按钮
function deleteData(table, method, id) {
  var token = sessionStorage.getItem("token");
  var delID = '';
  $("input[name=del_listID]:checked").each(function () {
    delID += $(this).val() + ",";
  });
  console.log(delID);
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
        // $.post(APP_URL + table, {
        //   delID: delID,
        //   authToken: token
        // }, function(res) {
        //   console.log(res);
        //   // window.location.href = APP + '/' + CONTROLLER_NAME + '/' + ACTION_NAME;
        // });

        $.ajax({
          type: method,
          url: APP_URL + table,
          data: {
            authToken: token,
            companyId: delID
          },
          dataType: "json",
          success: function (res) {
            console.log(res);
          },
          error: function (err) {
            console.log(err);
          }
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
    callback: function () {
      $.post(APP + '/Common/deleteUploadImg', {
        imgUrl: url
      }, function () {
        parent.remove();
        $('input[value="' + url + '"]').val('');
      });
    }
  });
}