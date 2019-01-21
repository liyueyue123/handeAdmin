$(function () {
  $.showLoading('加载中');
  messageList(1);
});

function messageList(pageNum, startPublishTime, title) {
  var token = sessionStorage.getItem("token");
  $.ajax({
    type: "GET",
    url: APP_URL + "/message/getList",
    data: {
      authToken: token,
      limit: 10,
      page: pageNum,
      startPublishTime: startPublishTime,
      title: title
    },
    dataType: "json",
    success: function (res) {
      console.log('messageList', res);
      $.closeLoading();
      var data = res.data;
      var str = "";
      var pages = 10 * (pageNum - 1);
      if(res.code == 0){
        $.each(data, function (index, val) {
          str += `
            <tr>
              <td><input type="checkbox" name="del_listID" id="${val.id}" data-name="multi-select" value="${val.id}" /></td>
              <td>${pages+(index+1)}</td>
              <td>${val.id}</td>
              <td>${val.title}</td>
              <td>${val.context}</td>
              <td>${moment(val.publishtime).format('YYYY年MM月DD日 hh:mm:ss')}</td>
              <td><a class="btn btn-success navbar-btn" href="../MessageDetail/index.html?id=${val.id}">查看推送详情</a></td>
            </tr>
          `;
        });
        $(".messageList").html(str);
        $('input[data-name=multi-select]').iCheck({
          checkboxClass: 'icheckbox_flat-blue',
          radioClass: 'iradio_flat-blue'
        });
        getPage(res.count, 'messageList', pageNum); //分页
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
};

//点击搜索按钮
$('#search_btn').live('click', function () {
  var title = $('#search_title').val();
  var startPublishTime = $('#search_startPublishTime').val();
  messageList(1, startPublishTime, title);
})
