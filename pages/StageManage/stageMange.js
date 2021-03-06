$(function () {
    $.showLoading('加载中');
    stageList(); //阶段列表
    // var url = window.location.href;
    // if (url.indexOf('=') != -1) {
    //     var index = url.split('=')[1];
    //     var indexNum = Math.ceil(index / 10);
    //     console.log(indexNum);
    //     stageList(indexNum); //阶段列表
    // } else {
    //     stageList(1); //阶段列表
    // }
});

// 阶段管理  
function stageList() {
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
            $("#addButton").attr('data-num', res.data.length);
            $.closeLoading();
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
            // var pages = 10 * (pageNum - 1);
            var str = "";
            var data = res.data;
            $.each(data, function (index, val) {
                str += `
                    <tr>
                        <td><input type="checkbox" name="del_listID" id="del_listID" data-name="multi-select" value="${val.id}" /></td>
                        <td>${index+1}</td>
                        <td>${val.stagename}</td>
                        <td>${val.dreCompany!=''?val.dreCompany.companyname:''}</td>
                        <td><a class="btn ${val.enable==1?'btn-success':'btn-danger'}" href="javascript:void(0);" onclick="ebableStage(${val.enable==1?'0':'1'},'${val.id}')">${val.enable==1?'启用':'禁用'}</a></td>
                    </tr>
                 `;
            });
            $(".list-box tbody").html(str);
            var pages = "";
            pages += ` 
                <li><a>共${data.length}条记录</a></li>
                <li><a>第1页/共1页</a></li>
            `;
            $(".pagination").html(pages);
            $('input[data-name=multi-select]').iCheck({
                checkboxClass: 'icheckbox_flat-blue',
                radioClass: 'iradio_flat-blue'
            });
        }
    });
}

//启用、禁用
function ebableStage(enable, atageid) {
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
            if (res.code == 0) {
                stageList();
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
}