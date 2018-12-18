$(function () {
  userList();
});
function userList(){
  var token = sessionStorage.getItem("token");
  console.log(token)
  $.ajax({
    type: "GET",
    url: APP_URL + "/searchUserList",
    data: {
      authToken: token,
      limit: 10,
      page: 1,
      search:'admin'
    },
    dataType: "json",
    success: function (res) {
      console.log('userList',res);
      var data = res.data;
      var str = "";
      $.each(data, function (index, val) {
        str += `
          <tr>
            <td><input type="checkbox" name="del_listID" id="${val.id}" data-name="multi-select" value="${val.id}" /></td>
            <td>${index+1}</td>
            <td>${val.id}</td>
            <td>${val.name}</td>
            <td><a href="javascript:;">${val.phone}</a></td>
            <td>${val.departname}</td>
            <td><img style="width:60px;height:60px;margin:10px;" src="${val.icon}"/></td>
            <td></td>
            <td></td>
            <td>${val.companyname}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td><a class="btn ${val.isLock==1?'btn-success':'btn-danger'}" data-table="user" data-id="${val.id}" data-status="0" data-text1="禁用" data-text2="启用" href="javascript:void(0);"  onclick="operate(${val.isLock},${val.id})">${val.isLock == 0 ?"禁用":"启用"}</a></td>
          </tr>
        `;
      });
      $(".userList").html(str);
    }
  });
};


// 禁用
function operate(isLock,userId){
  var token = sessionStorage.getItem("token");
  if (isLock == 0){
    var url = APP_URL + "/stopUser";
  }else{
    var url = APP_URL + "/unRelieveUser";
  }
  $.ajax({
      type: "GET",
      url: url,
      data: {
            authToken: token,
            userId:userId
        },
        dataType: "json",
        success: function (res) {
          if(res.code==0){
                userList();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}