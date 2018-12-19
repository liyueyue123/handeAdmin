$(function () {
  personnelManageList();
});
function personnelManageList(){
  $.ajax({
    type: "GET",
      url: APP_URL + "/console/user/all",
      data: {
        authToken: token,
        limit:10,
        page:1,
      },
      dataType: "json",
      success: function (res) {
        console.log('personnelList', res);
        var data = res.data;
        var str = "";
        $.each(data, function (index, val) {
          if(val.lastlogintime == ""){
            var lasrlogintime = val.lastlogintime;
          }else{
            var lasrlogintime = moment(val.lastlogintime).format("YYYY年MM月DD日");
          }
          if (val.iconurl == ''){
            var src = ''
          }else{
            var src = "src="+val.iconurl
          }
          str += `
             <tr>
            <td><input type="checkbox" name="del_listID" id="del_listID" data-name="multi-select" value="${val.id}" /></td>
            <td>${index}</td>
            <td>${val.name}</td>
            <td><img ${src} width="70px" height="70px" alt="暂无用户头像"></td>
            <td>${val.roleName}</td>
            <td>${val.account}</td>
            <td>${val.password}</td>
            <td>${moment(val.createtime).format("YYYY年MM月DD日")}</td>
            <td>${lasrlogintime}</td>
            <td><a class="btn ${val.status==1?'btn-success':'btn-danger'}" data-table="user" data-id="${val.id}" data-status="0" data-text1="禁用" data-text2="启用" href="javascript:void(0);"  onclick="operate(${val.status},${val.id})">${val.status == 0 ?"禁用":"启用"}</a></td>
            </tr>
          `;
        });
        $(".personnelList").html(str);
      }
    });
}

//停用用户
function operate(status, userId) {
  var token = sessionStorage.getItem("token");
  if (status == 0) {
    console.log(status)
    var url = APP_URL + "/console/stopUser";
  } else {
    // var url = APP_URL + "/unRelieveUser";
  }
  $.ajax({
    type: "GET",
    url: url,
    data: {
      authToken: token,
      userId: userId
    },
    dataType: "json",
    success: function (res) {
      if (res.code == 0) {
        personnelManageList();
      }
    },
    error: function (err) {
      console.log(err);
    }
  });
}