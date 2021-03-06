$(function () {
    $.showLoading('加载中');
    var url = window.location.href;
    if (url.indexOf('=') != -1) {
        var index = url.split('=')[1];
        var indexNum = Math.ceil(index / 10);
        console.log(indexNum);
        fieldList(indexNum); //列表
    } else {
        fieldList(1); //列表
    }

});

// 弹性域列表
function fieldList(pageNum) {
    var token = sessionStorage.getItem("token");
    var companyId = sessionStorage.getItem("companyId");
    // console.log(companyId);
    $.ajax({
        type: "GET",
        url: APP_URL + "/fieldNameList",
        data: {
            comid: companyId,
            authToken: token,
            limit: 10,
            page: pageNum
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            $("#addButton").attr("data-num",res.count);
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
            var data = res.data;
            var pages = 10 * (pageNum - 1);
            var str = "";
            if (res.code == "0") {
                $.each(data, function (index, val) {
                    str += `
                     <tr>
                        <td><input type="checkbox" name="del_listID" id="del_listID" data-name="multi-select" value="${val.id}" data-index="${pages+index+1}" /></td>
                        <td>${pages+index+1}</td>
                        <td>${val.fieldname}</td>
                        <td>${val.company!=''?val.company.companyname:''}</td>
                        <td><a class="btn ${val.state==0?'btn-success':'btn-danger'}" onclick="fieldDisable('${val.id}',${val.state==0?'1':'0'})">${val.state==0?'启用':'禁用'}</a></td>
                    </tr>
                     `;
                });
                $("#fieldList").html(str);
                $('input[data-name=multi-select]').iCheck({
                    checkboxClass: 'icheckbox_flat-blue',
                    radioClass: 'iradio_flat-blue'
                });
                getPage(res.count, 'fieldList', pageNum); //分页
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// 禁用弹性字段
function fieldDisable(id, state) {
    // console.log(state);
    var token = sessionStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: APP_URL + "/fieldNameEdit",
        data: {
            authToken: token,
            id: id,
            state: state
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            if (res.code == 0) {
                fieldList(1);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}