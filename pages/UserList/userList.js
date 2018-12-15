$(function () {
  userList();
});
function userList(){
  var token = sessionStorage.getItem("token");
  console.log(token)
  $.ajax({
    type: "GET",
    url: APP_URL + "/user/all",
    data: {
      authToken: token,
      limit: 10,
      page: 1,
      search:"admin"
    },
    dataType: "json",
    success: function (res) {
      console.log('userList',res);
      var data = res.data;
      var str = "";
      $.each(data, function (index, val) {
        str += `
          <tr>
            <td><input type="checkbox" name="del_listID" id="del_listID" data-name="multi-select" value="<{$vo.id}>" /></td>
            <td>${val.id}</td>
            <td>${val.name}</td>
            <td><a href="javascript:;">${val.phone}</a></td>
            <td>${val.departname}</td>
            <td></td>
            <td></td>
            <td></td>
            <td>${val.companyname}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        `;
      });
      $(".userList").html(str);
    }
  });
};
$('#btn-search').click(function(){
  console.log('search');
})