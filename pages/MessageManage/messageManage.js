$(function () {
  $.showLoading('加载中');
  messageList(1);
  messageDetail();
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
      $.each(data, function (index, val) {
        str += `
          <tr>
            <td><input type="checkbox" name="del_listID" id="${val.id}" data-name="multi-select" value="${val.id}" /></td>
            <td>${pages+(index+1)}</td>
            <td>${val.id}</td>
            <td>${val.title}</td>
            <td>${val.context}</td>
            <td>${moment(val.publishtime).format('YYYY年MM月DD日 hh:mm:ss')}</td>
          </tr>
        `;
      });
      $(".messageList").html(str);
      getPage(res.count, 'messageList', pageNum); //分页
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

// 详情
function messageDetail() {
  var token = sessionStorage.getItem("token");
  $.ajax({
    type: "GET",
    url: APP_URL + "/message/showMessageDetails",
    data: {
      authToken: token,
      id: 26,
      limit: 10,
      page: 1
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