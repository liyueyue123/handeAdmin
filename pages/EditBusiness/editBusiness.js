$(function () {
  var url = window.location.href; //首先获取到你的URL地址;
  var arr = url.split("="); //用“&”将URL分割成2部分每部分都有你需要的东西;
  var id = arr[1];
  console.log(id);
  if (url.indexOf('=') != -1) {
    //商机详情
    $.showLoading('加载中');
    getBusinessDetail(id);
  }
  //获取负责人选框
  getALLPrincipals(id);
  //商机详情
  function getBusinessDetail(id) {
    var token = sessionStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: APP_URL + "/console/getOpportunityDetails",
      data: {
        authToken: token,
        opportunityId: id
      },
      dataType: "json",
      success: function (res) {
        console.log('businessInfo', res);
        $.closeLoading('加载中');
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
        $('#opportunityId').val(data.id);
        $('#companyName').val(data.companyName);
        $('#price').val(data.price);
        $('#citylist').text(data.provines + '  ' + data.city + '  ' + data.area + "(在下可修改)");
        $('#time').val(moment(data.time).format("YYYY/MM/DD  hh:mm:ss"));
        $('#stage').val(data.stage);
        $('#remark').val(data.remark);
        if (data.links != '') {
          var linksKey = '';
          var linksOther = '';
          var k = [];
          var o = [];
          $.each(data.links, function (i, v) {
            if (v.isKey == 0) {
              linksOther += `<div class="contact">${v.companyName} ${v.position} ${v.name}  <button  data-id="${v.id}" type="button" class="btn btn-danger pro-removeSection dellink" style="margin-right:55%;float:right;margin-top:10px;"><i class="fa fa-minus" aria-hidden="true"></i> 移除</button> </div> </div>`;
              k.push(v.id)
            } else {
              linksKey += `<div class="contact">${v.companyName} ${v.position} ${v.name}  <button  data-id="${v.id}" type="button" class="btn btn-danger pro-removeSection dellink" style="margin-right:55%;float:right;margin-top:10px;"><i class="fa fa-minus" aria-hidden="true"></i> 移除</button> </div> </div>`;
              o.push(v.id)
            }
          });
          console.log(linksKey)
          $('#linksKey').html(linksKey);
          $('#linksOther').html(linksOther);
          if (linksKey) {
            $('#linksKeyOld').val(k);
          }else{
             $('#linksKeyOld').val('');
          };
          if (linksOther) {
            $('#linksOtherOld').val(o);
          }else{
            $('#linksOtherOld').val('');
          }
        }else{
          $('#linksKey').html('');
          $('#linksOther').html('');
        }
        if (data.principals != '') {
          var principals = '';
          $.each(data.principals, function (il, vl) {
            principals += `<div class="contact"><img style="width:2%;margin-right:10px;" src="${vl.icon}"/><span width="150px;">姓名:${vl.name}</span><span width="150px;">手机号:${vl.phone}</span><span width="150px;">部门:${vl.departMent}</span> <button  data-id="${vl.id}" type="button" class="btn btn-danger pro-removeSection delPrincipal" style="margin-right:57.5%;float:right;margin-top:10px;"><i class="fa fa-minus" aria-hidden="true"></i> 移除</button></div>`;
          });
          $('#PrincipalsList').html(principals);
        }else{
           $('#PrincipalsList').html('');
        }
        if (data.files != "") {
          var fujian = '';
          var f = [];
          $('#fileDataOld').val('');
          $.each(data.files, function (dex, va) {
            fujian += `<div><a style="text-decoration:underline;color: #428bca;" target="_blank" href="${va.filename}">附件${dex+1}: ${va.filename}</a> <button  data-id="${va.id}" type="button" class="btn btn-danger pro-removeSection delFile" style="margin-right:35%;float:right;margin-top:10px;"><i class="fa fa-minus" aria-hidden="true"></i> 移除</button> </div> `;
            f.push(va.filename.slice(23, va.filename.length));
          });
          $('#fileDataOld').val(f);
          $('#filesList').html(fujian);
        }else{
          $('#filesList').html('');
          $('#fileDataOld').val('')
        }
        getAllProvinces(); //获取省份
        getCity(); //获取市
        getArea(); //获取所在
      },
      error: function (err) {
        console.log(err);
      }
    });
  }
  $('#form1').attr('action', APP_URL + "/console/updateInfo");
  //提交基本信息
  $('#saveButton').click(function(){
    ajax({
      type: 'post',
      success: function (res) {
        console.log('success', JSON.stringify(res));
        $.show({
          title: '操作成功',
          content: res.message
        });
        getBusinessDetail(id);
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
      }
    })
  })
  //修改概述
  $('#saveRemark').click(function(){
    var token = sessionStorage.getItem("token");
    var remark = $('#remark').val();
    console.log(remark);
    $.ajax({
      type: "post",
      url: APP_URL + "/console/updateRemark",
      data: {
        authToken: token,
        opportunityId: id,
        remark: remark
      },
      dataType: "json",
      success: function (res) {
        $.show({
          title: '操作成功',
          content: res.message
        });   
        getBusinessDetail(id);
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
  })
  //获取联系人下拉选框
  function getALLPrincipals(id) {
    var token = sessionStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: APP_URL + "/linksList",
      data: {
        authToken: token,
        limit: 999999,
        page: 1,
        opportunityId: 30
      },
      dataType: "json",
      success: function (res) {
        console.log('Principals', res);
        var data = res.data;
        var str = "";
        $.each(data, function (index, val) {
          if (data.links != '') {
            $.each(data.links, function (i, v) {
              str += `
                  ${v.isKey==0?`<div class="contact">${v.companyName} ${v.position} ${v.name}</div>`:''}
              `;
            });
          }
          // str += `
          //   <div><input type="checkbox" name="del_listID" id="${val.id}" data-name="multi-select" value="${val.id}" />  <span width="150px;">姓名:${val.name}</span><span width="150px;">手机号:${val.phone}</span><span width="150px;">部门:${val.departMent}</span></div>
          // `;
        });
        // $("#PrincipalsSelect").html(str);
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
  //修增加关键联系人
  $('#saveLinksKey').click(function () {
    var token = sessionStorage.getItem("token");
    var isKeys = 1;
    var ln = [];
    $("input[name=links_ID]:checked").each(function () {
      ln.push(parseInt($(this).val()));
    });
    var lo = $('#linksKeyOld').val();
    var linkIds = lo.concat(ln);
    console.log(linkIds)
    $.ajax({
      type: "post",
      url: APP_URL + "/console/saveLinkInfo",
      data: {
        authToken: token,
        opportunityId: id,
        isKeys: isKeys,
        linkIds: linkIds
      },
      dataType: "json",
      success: function (res) {
        console.log(res)
        $.show({
          title: '操作成功',
          content: res.message
        });
        getBusinessDetail(id);
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
        $.show({
          title: '操作失败',
          content: err
        });
        console.log(err)
      }
    });
  })
  //修增加其他联系人
  $('#saveLinksOther').click(function () {
    var token = sessionStorage.getItem("token");
    var isKeys = 0;
    var ln = [];
    $("input[name=links_ID]:checked").each(function () {
      ln.push(parseInt($(this).val()));
    });
    var lo = $('#linksOtherOld').val();
    var linkIds = lo.concat(ln);
    console.log(linkIds)
    $.ajax({
      type: "post",
      url: APP_URL + "/console/saveLinkInfo",
      data: {
        authToken: token,
        opportunityId: id,
        isKeys: isKeys,
        linkIds: linkIds
      },
      dataType: "json",
      success: function (res) {
        console.log(res)
        $.show({
          title: '操作成功',
          content: res.message
        });
        getBusinessDetail(id);
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
        $.show({
          title: '操作失败',
          content: err
        });
        console.log(err)
      }
    });
  })
  //删除联系人
  $('.dellink').live('click', function (e) {
    // console.log(e.target.dataset.id)
    var linkId = e.target.dataset.id;
    var token = sessionStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: APP_URL + "/deleteLinks",
      data: {
        authToken: token,
        opportunityId: id,
        linkId: linkId
      },
      dataType: "json",
      success: function (res) {
        alert(res.message)
        getBusinessDetail(id);
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
  })
  
  //修改负责人
  $('#savePrincipals').click(function () {
    var token = sessionStorage.getItem("token");
    // var principals = $('#remark').val();
    var principal = [];
    $("input[name=del_listID]:checked").each(function () {
      principal.push(parseInt($(this).val()));
    });
    var str = principal.join(',');
    console.log(str)
    $.ajax({
      type: "post",
      url: APP_URL + "/console/updatePrincipals",
      data: {
        authToken: token,
        opportunityId: id,
        principals: str
      },
      dataType: "json",
      success: function (res) {
        $.show({
          title: '操作成功',
          content: res.message
        });
        getBusinessDetail(id);
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
  })
  //删除负责人
  $('.delPrincipal').live('click',function(e){
    // console.log(e.target.dataset.id)
    var principalId = e.target.dataset.id;
    var token = sessionStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: APP_URL + "/deletePrincipals",
      data: {
        authToken: token,
        opportunityId: id,
        principalId: principalId
      },
      dataType: "json",
      success: function (res) {
        console.log('删除成功',res);
        getBusinessDetail(id);
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
  })
  //修改附件
  function clickSaveFiles(e){
    if(e == 'true'){
      $('#saveFiles').live("click", function () {
        var token = sessionStorage.getItem("token");
        var fileDataOld = $('#fileDataOld').val();
        var fileDataNow = $('#fileDataNow').val();
        console.log('fff',fileDataOld)
        if (fileDataOld != ''){
          var fileData = fileDataOld.concat(',' + fileDataNow) + '';
        }else{
           var fileData = fileDataNow;
        }
        console.log(fileData)
        if (fileData) {
          $.ajax({
            type: "POST",
            url: APP_URL + "/console/updateFiles",
            data: {
              authToken: token,
              opportunityId: id,
              files: fileData
            },
            dataType: "json",
            success: function (res) {
              console.log(res)
              if (res.code == 0) {
                alert('附件上传成功!')
                getBusinessDetail(id);
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
            }
          });
        } else {
          alert('增加附件失败');
        }
      });
    }
  }
  //删除附件
  $('.delFile').live('click', function (e) {
    console.log(e.target.dataset.id)
    var fileId = e.target.dataset.id;
      $.ajax({
        type: "POST",
        url: APP_URL + "/console/deleteFiles",
        data: {
          authToken: token,
          opportunityId: id,
          fileId: fileId
        },
        dataType: "json",
        success: function (res) {
          console.log(res)
          if (res.code == 0) {
            alert('附件删除成功!')
            getBusinessDetail(id);
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
        fail: function(res){
          alert('附件删除失败!')
        }
      });
  })
  //上传附件
  $('#upload_file').live("change", function (e) {
    //上传单个文件
    if (e.target.files.length <= 1) {
      var file = e.target.files[0];
      var token = sessionStorage.getItem("token");
      // console.log("file",file)
      var form = new FormData();
      form.append('file', file);
      form.append('authToken', token);
      $.ajax({
        processData: false, //告诉jquery不要去处理发送的数据
        contentType: false, //告诉jquery不要去设置Content-Type请求头
        type: "POST",
        url: APP_URL + "/uploadOne",
        data: form,
        dataType: "json",
        success: function (res) {
          console.log(res)
          if (res.code == 0) {
            // alert('附件上传成功!')
            $('#fileDataNow').val(res.data);
            clickSaveFiles('true');
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
        }
      });
    } else {
      var form = new FormData();
      for (var i = 0; i < e.target.files.length; i++) {
        form.append('files', e.target.files[i]);
      }
      var token = sessionStorage.getItem("token");
      form.append('authToken', token);
      $.ajax({
        processData: false, //告诉jquery不要去处理发送的数据
        contentType: false, //告诉jquery不要去设置Content-Type请求头
        type: "POST",
        url: APP_URL + "/upload",
        data: form,
        dataType: "json",
        success: function (res) {
          console.log(res)
          if (res.code == 0) {
            // alert('附件选择成功,请按增加按钮!')
            $('#fileDataNow').val(res.data);
            clickSaveFiles('true');
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
        }
      });
    }
  });
  // 获取所有省份
  function getAllProvinces() {
    var token = sessionStorage.getItem("token");
    var str = "";
    str += `<option value="" selected="">---请选择省份---</option>`;
    $.ajax({
      type: "GET",
      url: APP_URL + "/findAllProvinces",
      data: {
        authToken: token,
      },
      dataType: "json",
      success: function (res) {
        // console.log(res);
        var data = res.data;
        $.each(data, function (index, val) {
          str += `<option value="${val.provinceid}">${val.province}</option>`;
        });
        $("#allProvinces").html(str);
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
  // 获取市
  function getCity() {
    var token = sessionStorage.getItem("token");
    var str1 = "";
    str1 += `<option value="" selected="">---请选择市---</option>`;
    $("#allProvinces").change(function () {
      var provinceid = $("#allProvinces>option:selected").val();
      if (provinceid) {
        $.ajax({
          type: "GET",
          url: APP_URL + "/findCityById",
          data: {
            authToken: token,
            provincesId: provinceid
          },
          dataType: "json",
          success: function (res) {
            // console.log(res);
            var data = res.data;
            $.each(data, function (index, val) {
              str1 += `
                              <option value="${val.cityid}">${val.city}</option>
                          `;
            });
            $("#allCity").html(str1);
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
    });
    $("#allCity").html(str1);
  }
  // 获取所在区
  function getArea() {
    var token = sessionStorage.getItem("token");
    var str2 = "";
    str2 += `<option value="" selected="">---请选择区---</option>`;
    $("#allCity").change(function () {
      var cityid = $("#allCity>option:selected").val();
      if (cityid) {
        $.ajax({
          type: "GET",
          url: APP_URL + "/findAreaByCityId",
          data: {
            authToken: token,
            cityId: cityid
          },
          dataType: "json",
          success: function (res) {
            // console.log(res);
            var data = res.data;
            $.each(data, function (index, val) {
              str2 += `
                              <option value="${val.areaid}">${val.area}</option>
                          `;
            });
            $("#allArea").html(str2);
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
    });
    $("#allArea").html(str2);
  }
  //返回商机列表页
  $('#back').click(function(){
    window.history.back(-1);
  })

  // 获取用户表格()
  function userList(pageNum) {
    var token = sessionStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: APP_URL + "/user/all",
      data: {
        authToken: token,
        authTokn: token,
        limit: 999999999,
        page: pageNum,
      },
      dataType: "json",
      success: function (res) {
        console.log('userList', res);
        var data = res.data;
        var str = "";
        var pages = 10 * (pageNum - 1);
        if(res.count != 0 && res.code == 0) {
          $('.userListDiv').css('display','block');
          $.each(data, function (index, val) {
            str += `
              <tr>
                <td><input type="checkbox" name="del_listID" id="${val.id}" data-name="multi-select" value="${val.id}" /></td>
                <td>${pages+(index+1)}</td>
                <td>${val.id}</td>
                <td>${val.name}</td>
                <td><a href="javascript:;">${val.phone}</a></td>
                <td>${val.departname}</td>
                <td><img style="width:60px;height:60px;margin:10px;" src="${val.icon}"/></td>
              </tr>
            `;
          });
          $(".userList").html(str);
        }else{
          str += `<div style="padding-left: 6px;color:gray;">暂无数据,无法修改负责人</div>`;
          $('.principalsTd').html(str);
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
        var str = `<div style="padding-left: 6px;color:gray;">暂无数据,无法修改负责人</div>`;
        $('.principalsTd').html(str);
      }
    });
  };
  userList(1);

  // 获取客户表格
  function getCustomerList(pageNum) {
    var token = sessionStorage.getItem("token");
    var userId = sessionStorage.getItem("userId");
    var data = {};
    data.authToken = token;
    data.limit = 999999999;
    data.page = pageNum;
    data.userId = userId;
    $.ajax({
      type: "POST",
      url: APP_URL + "/customerList",
      data: data,
      dataType: "json",
      success: function (res) {
        console.log(res);
        var data = res.data;
        var pages = 10 * (pageNum - 1);
        var str = "";
        if(res.count != 0 && res.code == 0){
          $('.customerListDiv').css('display', 'block');
          $.each(data, function (index, val) {
            str += `
                  <tr>
                      <td><input type="checkbox" name="links_ID" id="del_listID" data-name="multi-select" value="${val.id}"/></td>
                      <td>${pages+(index+1)}</td>
                      <td>${val.id}</td>
                      <td>${val.customerName}</td>
                      <td>${val.company}</td>`;
            if (val.position) {
              str += `<td>${val.position}</td>`
            }
            str += `</tr>`;
          });
          $(".customerList").html(str);
        }else{
          str += `<div style="padding-left: 6px;color:gray;">暂无数据,无法修改负责人</div>`;
          $('.linksTd').html(str);
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
        var str = `<div style="padding-left: 6px;color:gray;">暂无数据,无法修改负责人</div>`;
        $('.linksTd').html(str);
        $('input[data-name=multi-select]').iCheck({
          checkboxClass: 'icheckbox_flat-blue',
          radioClass: 'iradio_flat-blue'
        });
      }
    });
  }
  getCustomerList(1)
});