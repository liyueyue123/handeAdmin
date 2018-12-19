$(function () {
    allMenu(); //获取所有菜单项
    var url = window.location.href;
    if (url.indexOf("=") == -1) {
        $("#form1").attr("action", APP_URL + "/permission/powerCreateRole");
        addRole(); //新增角色
    } else {
        $("#form1").attr("action", APP_URL + "/permission/editPowerRoles");
        var roleId = url.split("=")[1];
        roleDetail(roleId); //角色详情
    }



});

// 获取所有菜单项
function allMenu() {
    var token = sessionStorage.getItem("token");
    $.ajax({
        type: "GET",
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
                 <label style="margin-right:1%"><input type="checkbox" name="menuIds" class="menuCheckBox" value="${val.id}"/>${val.menuName}</label>
                `;
            });
            $("#menuList").html(str);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

//新增角色
function addRole() {
    ajax({
        type: "GET",
        success: function (res) {
            console.log(JSON.stringify(res));
            window.location.href = '../RoleManage/index.html';
        }
    });
}

// 获取角色详情
function roleDetail(id) {
    var token = sessionStorage.getItem("token");
    $.ajax({
        type: "POST",
        url: APP_URL + "/role/roleDetails",
        data: {
            authToken: token,
            id: id
        },
        dataType: "json",
        success: function (res) {
            console.log(res);
        }
    });
}