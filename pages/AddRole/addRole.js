$(function () {
    $(".addForm").attr("action", APP_URL + "/permission/powerCreateRole");
    allMenu(); //获取所有菜单项
    addRole(); //新增角色
});

// 获取所有菜单项
function allMenu() {
    var token = sessionStorage.getItem("token");
    $.ajax({
        type: "GET",
        // url: APP_URL + "/menuList",
        url: APP_URL + "/roleMenu",
        data: {
            authToken: token,
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
            var data = res.data;
            var str = "";
            $.each(data, function (index, val) {
                str += `
                 <label style="margin-right:1%"><input type="checkbox" class="menuCheckBox" value="${val.id}"/>${val.menuName}</label>
                `;
            });
            $("#menuList").html(str);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function addRole() {
    ajax({
        type: "POST",
        success: function (res) {
            // console.log(JSON.stringify(res));
            window.location.href = '../RoleManage/index.html';
        }
    });
}