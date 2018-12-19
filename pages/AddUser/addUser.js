$(function () {
  //获取公司的下拉选框
  getCompanySelect();
  var url = window.location.href; //首先获取到你的URL地址;
  var arr = url.split("="); //用“&”将URL分割成2部分每部分都有你需要的东西;
  var id = arr[1];
  if(id != undefined){
    $('.addForm').attr('action', APP_URL + "/editUser");
    $('#changeTitle').text('修改')
    $('#changeTxt').text('修改')
    getUserInfo(id) 
  }else{
    $('.addForm').attr('action', APP_URL + "/register");
  }
});
function getUserInfo(id){
  var token = sessionStorage.getItem("token");
  $.ajax({
    type: "GET",
    url: APP_URL + "/getUser",
    data: {
      authToken: token,
      userId:id
    },
    dataType: "json",
    success: function (res) {
      console.log('uerInfo',res)
      var data = res.data;
      $('#user_id').val(data.id)
      $("#user_loginname").val(data.loginname);
      $("#user_name").val(data.name);
      $("#user_passwd").val(data.passwd);
      if(data.gender == '女'){
        var gender = 'woman'
      }else{
        var gender = 'man'
      }
      $("#"+gender).attr('checked',true);
      $("#user_phone").val(data.phone);
      $("#user_wechat").val(data.wechat);
      $("#icon-image").find("img").attr({
        "src": data.icon
      })
      // 显示头像
      $('#icon-image').show();
      $('#icon').val(data.icon.slice(23, data.icon.length));
      // console.log(data.icon.slice(23, data.icon.length))
      $("#user_email").val(data.email);
      $("#company").find("option[value=" + data.company + "]").attr("selected", true);
      //获取部门的下拉选框
      getDepartmentSelect(data.department);
      $("#user_address").val(data.address);
    }
  });
}

//当点击密码框的时候清空
$('#user_passwd').focus(function(){
  this.value=''
})

// 隐藏空白头像
$('#icon-image').hide();


// 上传头像
$('#iconfile').change(function (e) {
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
  console.log("file",file)
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
      $("#icon").attr({
        'value': res.data
      });
    }
  });
  // 显示头像
  $('#icon-image').show();
}


// 获取公司
function getCompanySelect(){
  var token = sessionStorage.getItem("token");
  $.ajax({
    type: "GET",
    url: APP_URL + "/companySelect",
    data: {
      authToken: token
    },
    dataType: "json",
    success: function (res) {
      console.log('companyList', res);
      var data = res.data;
      var str = "<option value='' selected>---请选择公司---</option>";
      $.each(data, function (index, val) {
        str += `
              <option value="${val.id}">${val.companyname}</option>
          `;
      });
      // console.log('str',str)
      $("#company").html(str);
    }
  });
}

//当公司的下拉选框发生改变时
$("#company").change(function () {
  getDepartmentSelect();
})

// 获取部门
function getDepartmentSelect(d){
var companyId = $('#company option:selected').val();
  if ($('#company option:selected').val() != '') {
    var token = sessionStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: APP_URL + "/departmentSelect",
      data: {
        authToken: token,
        companyId: companyId
      },
      dataType: "json",
      success: function (res) {
        console.log('departmentList', res);
        var data = res.data;
        var str = "<option value='' selected>---请选择部门---</option>";
        $.each(data, function (index, val) {
          str += `
                    <option value="${val.id}">${val.departname}</option>
                `;
        });
        // console.log('str',str)
        $("#department").html(str);
        if(d){
          $("#department").find("option[value=" + d + "]").attr("selected", true);
        }
      }
    });
  }
}


//提交表单
ajax({
  type: 'POST',
  success: function (res) {
    console.log('success', JSON.stringify(res));
    window.location.href = '../UserList/index.html'
  }
})