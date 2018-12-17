$(function () {
  personnelManageList();
});
function personnelManageList(){
  $.ajax({
    type: "GET",
      url: APP_URL + "/console/user/allUser",
      data: {
        authToken: token
      },
      dataType: "json",
      success: function (res) {
        console.log('personnelList', res);
        var data = res.data;
        var str = "";
        $.each(data, function (index, val) {
          str += `
          //重新写
            // <tr>
            //     <td><input type="checkbox" name="del_listID" id="del_listID" data-name="multi-select" value="${val.id}" /></td>
            //     <td>${index+1}</td>
            //     <td>${val.id}</td>
            //     <td>${val.status==1?'使用中':val.status==2?'已到期':val.status==3?'已冻结':''}</td>
            //     <td>${val.province}</td>
            //     <td>${val.address}</td>
            //     <td>${val.companyname}</td>
            //     <td class="sortTD" name="Case">${val.principalName}</td>
            //     <td></td>
            //     <td>${moment(val.openaccounttime).format("YYYY年MM月DD日")}</td>
            //     <td>${moment(val.deadline).format("YYYY年MM月DD日")}</td>
            //     <td>${val.account}</td>
            //     <td></td>
            // </tr>
          `;
        });
        $(".personnelList").html(str);
      }
    });
}