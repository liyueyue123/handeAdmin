$(function () {
    getCustomerList();
});

function getCustomerList() {
    var token = sessionStorage.getItem("token");
    $.ajax({
        type: "POST",
        url: APP_URL + "/customerList",
        data: {
            authToken: token,
            limit: 10,
            page: 1
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var str = "";
            $.each(data, function (index, val) { 
                 str +=`
                 <tr>
                    <td><input type="checkbox" name="del_listID" id="del_listID" data-name="multi-select" /></td>
                    <td>${val.id}</td>
                    <td></td>
                    <td>${val.customerName}</td>
                    <td>${val.gender}</td>
                    <td>${val.position}</td>
                    <td>${val.company}</td>
                    <td>${val.planfinishtime}</td>
                    <td>${val.email}</td>
                    <td>${val.messagesource}</td>
                    <td>${val.createtime}</td>
                    <td><a class="btn btn-success navbar-btn" href="../CustomerDetail/index.html?id=${val.id}">详情</a></td>
                 </tr>
                 `;
            });
            $(".list-box>table>tbody").html(str);
        },
        error:function(err){
            console.log(err);
        }
    });
}