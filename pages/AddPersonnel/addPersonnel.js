$(function () {
  var url = window.location.href; //首先获取到你的URL地址;
  var arr = url.split("="); //用“&”将URL分割成2部分每部分都有你需要的东西;
  var id = arr[1];
  console.log(id)
  if (url.indexOf('=') != -1) {
    $('#form1').attr('action', APP_URL + "/console/update");
    $('#changeTitle').text('编辑')
    $('#changeTxt').text('保存')
    $('#changeTxt').prev().removeClass("fa-check");
    $('#changeTxt').prev().addClass("fa-save");
    getPersonnelInfo(id);
    //提交表单
    ajax({
      type: 'get',
      success: function (res) {
        console.log('success', JSON.stringify(res));
        window.location.href = '../PersonnelManage/index.html'
      }
    })
  } else {
    $('.addForm').attr('action', APP_URL + "/console/addConsoleUser");
    $('#person_id').removeAttr('name');
    //提交表单
    ajax({
      type: 'post',
      success: function (res) {
        console.log('success', JSON.stringify(res));
        window.location.href = '../PersonnelManage/index.html'
      }
    })
  }
})

function getPersonnelInfo(id) {
  var token = sessionStorage.getItem("token");
  $.ajax({
    type: "GET",
    url: APP_URL + "/console/userDetails",
    data: {
      authToken: token,
      id: id
    },
    dataType: "json",
    success: function (res) {
      console.log('personnelInfo', res)
      var data = res.data;
      $('#person_id').val(data.id) //注意
      $("#name").val(data.name);
      $("#roleid").find("option[value=" + data.roleid + "]").attr("selected", true);
      console.log(data.roleid)
      $("#account").val(data.account);
      $("#business_passwd").val(data.password);
      if (data.iconurl.length != 0) {
        $("#icon-image").find("img").attr({
          "src": data.iconurl
        })
        // 显示头像
        $('#icon-image').show();
        $('#iconurl').val(data.iconurl);
        console.log('123', $('#iconurl').val())
        // console.log(data.icon.slice(23, data.icon.length))
      }
      $("#account").removeAttr('name');
      $("#account").attr({
        'disabled': true
      });
    }
  });
}


//当点击密码框的时候清空
$('#business_passwd').focus(function () {
  $(this).val("");
});

// 隐藏空白头像
$('#icon-image').hide();

// 上传头像
$('#icon').change(function (e) {
  var path = $(this).val(),
    extStart = path.lastIndexOf('.'),
    ext = path.substring(extStart, path.length).toUpperCase();
    console.log(path);
  if (ext !== null) {
    //判断图片格式
    if (ext !== '.PNG' && ext !== '.JPG' && ext !== '.JPEG' && ext !== '.GIF') {
      alert('请上传正确格式的图片');
      $('#icon-image').hide();
      $("#icon-image").find("img").attr({
        "src": ''
      })
      return false;
    }
    //获取图片大小，注意使用this，而不是$(this)
    var size = this.files[0].size / 1024;
    if (size > 10240) {
      alert('图片大小不能超过10M');
      return false;
    }
    var imgBox = e.target;
    uploadImg(imgBox)
  }
});

//上传图片时调用的接口
function uploadImg(tag) {
  var file = tag.files[0];
  // var imgSrc;
  var token = sessionStorage.getItem("token");
  console.log("file", file)
  var form = new FormData();
  form.append('file', file)
  form.append('authToken', token)
  $.ajax({
    processData: false, //告诉jquery不要去处理发送的数据
    contentType: false, //告诉jquery不要去设置Content-Type请求头
    type: "POST",
    url: APP_URL + "/uploadOne",
    data: form,
    dataType: "json",
    success: function (res) {
      console.log(res)
      $("#icon-image").find("img").attr({
        "src": APP_IMAGE_URL + res.data
      });
      $('#iconurl').val(res.data);
      console.log('222',$('#iconurl').val())
    }
  });
  // 显示头像
  $('#icon-image').show();
}
//获取角色
$.ajax({
  type: "GET",
  url: APP_URL + "/role/list",
  data: {
    authToken: token,
    limit: 10,
    page: 1
  },
  dataType: "json",
  success: function (res) {
    console.log('roleId', res);
    var data = res.data;
    var str = '<option value="" selected>---请选择角色---</option>';
    $.each(data, function (index, val) {
      str += `
              <option value="${val.id}">${val.rolename}</option>
            `;
    });
    $("#roleid").html(str);
  },
  error: function (err) {
    console.log(err);
  }
});