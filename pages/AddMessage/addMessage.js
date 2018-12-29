$(function () {
  var ue = UE.getEditor('message_content');

  // 获取关于我们详情
  $("#saveButton").click(function () {
    var token = sessionStorage.getItem("token");
    var title = $('#message_title').val();
    var message = ue.getContent("message_content");
    var userIds = 1;
    $.ajax({
        type: "GET",
        url: APP_URL + "/message/pushMessage",
        data: {
            authToken: token,
            message: message,
            userIds: userIds,
            title: title
        },
        dataType: "json",
        success: function (res) {
          console.log(res);
          if(res.code == 0){
            alert('消息添加成功')
            window.location.href = '../MessageManage/index.html'
          }
        },
        error: function (err) {
            console.log(err);
        }
    });
  });

}); 