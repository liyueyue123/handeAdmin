$(function(){
    stageList(); //阶段列表
});

// 阶段管理  
function stageList(){
    var token = sessionStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL+"/permission/stageList",
        data: {
            authToken :token,
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var str = "";
            var data = res.data;
            $.each(data, function (index, val) { 
                 str += `
                    <tr>
                        <td><input type="checkbox" name="del_listID" id="del_listID" data-name="multi-select" value="" /></td>
                        <td>${index+1}</td>
                        <td>${val.stagename}</td>
                        <td><a class="btn ${val.enable==0?'btn-success':'btn-danger'}" data-table="user" data-id="59" data-status="0" data-text1="禁用" data-text2="启用" href="javascript:void(0);">${val.enable==0?'启用':'禁用'}</a></td>
                    </tr>
                 `;
            });
            $(".list-box tbody").html(str);
        }
    });
}