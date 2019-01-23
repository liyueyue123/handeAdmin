var APP_URL = 'http://hande.icpnt.com';
// var APP_URL= 'HTTP://192.168.0.192:8080';
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
function deleteData(table, method, id, isDel) {
  var token = sessionStorage.getItem("token");
  var delID = [];
  $("input[name=del_listID]:checked").each(function () {
    delID.push($(this).val());
  });
  var data = {};
  var a = id;
  var b = delID.toString();
  var data = {}
  data[a] = b;
  data.authToken = token;
  if (isDel) {
    data.isdel = isDel;
  }
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
        $.showLoading('加载中');
        $.ajax({
          type: method,
          url: APP_URL + table,
          data: data,
          dataType: "json",
          success: function (res) {
            $.closeLoading();
            console.log(res);
            if (res.code == 0) {
              $.show({
                title: '操作成功',
                content: '已删除',
              });
              window.location.reload();
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
    });
  }
}


//分页
function getPage(count, list, pageNum) {
  var sum = Math.ceil(count / 10);
  var pages = "";
  if (sum > 1) {
    for (var i = 0; i < sum; i++) {
      pages += `<li class="${(i+1)==pageNum?'active':''}" onclick="${list}('${i+1}')"><a>${i+1}</a></li>`;
    }
  }
  pages += `
        ${sum>1?`<li id="nextPages"><a>下一页</a></li>`:''}
        <li><a>共${count}条记录</a></li>
        <li><a>第<span id="nowPages">${sum==1?'1':''}</span>页/共${sum}页</a></li>
    `;
  $(".pagination").html(pages);
  var nowNum = $(".pagination>.active>a").html();
  $("#nowPages").html(nowNum);
  // 下一页
  $("#nextPages").click(function () {
    var num = $("#nowPages").html();
    num++;
    if (num <= sum) {
      test(list, num);
    } else {
      return;
    }
  });
}
// 调用传过来的函数
function test(list, num) {
  if (typeof (eval(list)) == "function") {
    eval(list + "(" + num + ");");
  } else {
    // 函数不存在
  }
}