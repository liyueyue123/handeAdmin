$(function () {
    stageList(1); //阶段列表
});

// 阶段管理  
function stageList(pageNum) {
    var token = sessionStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/permission/stageList",
        data: {
            authToken: token,
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            // var pages = 10 * (pageNum - 1);
            var str = "";
            var data = res.data;
            $.each(data, function (index, val) {
                str += `
                    <tr>
                        <td><input type="checkbox" name="del_listID" id="del_listID" data-name="multi-select" value="${val.id}" /></td>
                        <td>${index+1}</td>
                        <td>${val.stagename}</td>
                        <td><a class="btn ${val.enable==1?'btn-success':'btn-danger'}" data-table="user" data-id="59" data-status="0" data-text1="禁用" data-text2="启用" href="javascript:void(0);" onclick="ebableStage(${val.enable==1?'0':'1'},'${val.id}')">${val.enable==1?'启用':'禁用'}</a></td>
                    </tr>
                 `;
            });
            $(".list-box tbody").html(str);
        }
    });
}

//启用、禁用
function ebableStage(enable,atageid) {
    var token = sessionStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/permission/ebableStage",
        data: {
            authToken: token,
            enable: enable,
            stageId: atageid
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if(res.code==0){
                stageList();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}