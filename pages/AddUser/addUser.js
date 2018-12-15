$(function () {
  //获取token
  getToken();
  //获取公司的下拉选框
  getCompanySelect()
});


// 获取token
function getToken() {
  var token = sessionStorage.getItem("token");
  $('#authToken').val(token);
}


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
  var form = new FormData();
  // console.log("file",file)
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
        "src": APP_URL+'/'+res.data
      });
    }
  });

  // var reader = new FileReader();
  // reader.readAsDataURL(file);
  // reader.onload = function () {
  //   imgSrc = this.result;
  //   $("#icon-image").find("img").attr({
  //     "src": imgSrc
  //   });
  // };
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


// 获取部门
$("#company").change(function () {
  var companyId = $('#company option:selected').val();
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
    }
  });
})


//点击添加用户,提交表单 
// $("#saveButton").click(function(){
//     alert('baocun')
//     // $.ajax({
//     //     type: "GET",
//     //     url: APP_URL + "/register",
//     //     data: {
//     //     authToken: token,
//     //     company:
//     //     },
//     //     dataType: "json",
//     //     success: function (res) {
//     //         console.log('departmentList',res);
//     //         var data = res.data;
//     //         var str = "<option value='' selected>---请选择部门---</option>";
//     //     $.each(data, function (index, val) {
//     //         str += `
//     //             <option value="${val.id}">${val.departname}</option>
//     //         `;
//     //         });
//     //         // console.log('str',str)
//     //         $("#department").html(str);
//     //     }
//     // });
// })