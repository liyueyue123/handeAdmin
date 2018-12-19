$(function () {
    allMenu(); //获取所有菜单项
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
            // if(roleList){}
            $.each(data, function (index, val) {
                str += `
                <td width="10%">
                    <h1 class="select-all-title"><span class="moduletype-${val.id}" data-id="${val.id}">${val.menuName}</span></h1>
                    <div class="selectList">
                `
                $.each(val.childMenus, function (i, v) {
                    str += `
                        <div class="select-all module-${val.id}" data-id="${v.id}" data-moduletypeID="${val.id}">${v.menuName}</div>
                     `;
                });
                str += `
                    </div>
                </td>
                `;
            });
            $("#menuList").append(str);
            //角色权限点击事件
            $('div.select-all').live("click", function () {
                $(this).toggleClass('on');
                var thisID = $(this).attr('data-moduletypeID');
                var isCheck = 0;
                $('div.module-' + thisID).each(function (index) {
                    if ($(this).hasClass('on')) {
                        isCheck = 1;
                    }
                });
                if (parseInt(isCheck) == 1) {
                    $('span.moduletype-' + thisID).addClass("on");
                } else {
                    $('span.moduletype-' + thisID).removeClass("on");
                }
                var ids = '';
                $('.on').each(function () {
                    var id = $(this).attr('data-id');
                    ids += id + ',';
                });
                var roles = ids.substr(0, ids.length - 1);
                $('input#roles').val(roles);
                console.log($('input#roles').val());
            });

            //主模块点击事件
            $('h1.select-all-title>span').live("click", function () {
                $(this).toggleClass('on');
                var thisID = $(this).attr('data-id');
                if ($(this).hasClass('on')) {
                    $('div.module-' + thisID).each(function () {
                        $('div.module-' + thisID).addClass("on");
                    });
                } else {
                    $('div.module-' + thisID).each(function () {
                        $('div.module-' + thisID).removeClass("on");
                    });
                }
                var ids = '';
                $('.on').each(function () {
                    var id = $(this).attr('data-id');
                    ids += id + ',';
                });
                var roles = ids.substr(0, ids.length - 1);
                $('input#roles').val(roles);
            });
            //判断编辑/新增
            isAdd();
        },
        error: function (err) {
            console.log(err);
        }
    });
}
//判断新增编辑
function isAdd() {
    var url = window.location.href;
    if (url.indexOf("=") == -1) {
        $("#form1").attr("action", APP_URL + "/permission/powerCreateRole");
        addRole(); //新增角色
    } else {
        $("#form1").attr("action", APP_URL + "/permission/editPowerRoles");
        $("#changeTitle").html("修改");
        $("#saveButton").html('<i class="fa fa-save" aria-hidden="true"></i>保存');
        var roleId = url.split("=")[1];
        roleDetail(roleId); //角色详情
    }
}

//新增、编辑角色
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
            if (res.code == 0) {
                var data = res.data;
                $("#roleName").val(data.rolename); //阶段名称
                $("#roleId").val(data.id); //阶段ID
                $.each($("#isSuperAdmin>option"), function () {
                    if ($(this).val() == data.isSuperAdmin) {
                        $(this).attr("selected", true);
                    };
                });
                var roleList = data.menuIds;
                var roles = roleList.join(",");
                $('input#roles').val(roles);
                $.each($('div.select-all'), function (index) {
                    for (var i = 0; i < roleList.length; i++) {
                        if ($('div.select-all:eq(' + index + ')').attr('data-id') == roleList[i]) {
                            $('div.select-all:eq(' + index + ')').addClass("on");
                        }
                        if ($('h1.select-all-title>span:eq(' + index + ')').attr('data-id') == roleList[i]) {
                            $('h1.select-all-title>span:eq(' + index + ')').addClass("on");
                        }
                    }
                });
                addRole(); //编辑角色
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}