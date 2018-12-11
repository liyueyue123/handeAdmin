// JavaScript Document
$.extend({
    //加载状态提示
    showLoading: function(title) {
        var loadingHtml = '';
        loadingHtml += '<div class="loadingMask"></div>';
        loadingHtml += '<div class="loadingBox">';
        loadingHtml += '<img style="float:left;" src="../../js/tools/icpntDialog/images/loading.gif" width="37" height="37">';
        loadingHtml += '<span style="margin-left:10px;">' + title + '</span>';
        loadingHtml += '</div>';
        $("body", window.parent.document).append(loadingHtml);
    },

    //关闭加载状态
    closeLoading: function(callback) {
        $('div.loadingMask,div.loadingBox', window.parent.document).fadeOut(100, function() {
            $(this).remove();
            if (typeof callback === "function") {
                callback();
            }
        });
    },

    //基于bootstrap的封装弹窗
    /***************************************************
    title : 标题
    content : 内容
    isConfirm：是否有确定按钮，true or false
    complete: 窗体打开完成后回调函数
    callback：点击确认按钮回调函数
    closeCallback:点击关闭按钮回调函数
    ***************************************************/
    show: function(opt) {
        var html = '';
        html += '<div class="modal fade icpntDialog_showDiv" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
        if (typeof(opt.width) == 'undefined') {
            html += '<div class="modal-dialog">';
        } else {
            html += '<div class="modal-dialog" style="width:' + opt.width + 'px;">';
        }
        html += '<div class="modal-content">';
        html += '<div class="modal-header">';
        html += '<button type="button" class="close icpntDialog_close">×</button>';
        html += '<h4 class="modal-title" id="myModalLabel">' + opt.title + '</h4>';
        html += '</div>';
        html += '<div class="modal-body">';
        html += '<div class="icpntDialog_content" style="max-height: 305px;overflow-y: auto;">' + opt.content + '</div>';
        html += '</div>';
        html += '<div class="modal-footer">';
        if (opt.isConfirm) {
            html += '<button type="button" class="btn btn-default icpntDialog_close">取消</button>';
            html += '<button type="button" class="btn btn-primary icpntDialog_confirm">确定</button>';
        } else {
            html += '<button type="button" class="btn btn-default icpntDialog_close">关闭</button>';
        }
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        $("body", window.parent.document).append(html);
        $('div#myModal', window.parent.document).modal({
            keyboard: false
        });
        if (typeof(opt.complete) === "function") {
            opt.complete();
        }
        //点击确定按钮操作
        $('button.icpntDialog_confirm', window.parent.document).click(function() {
            $.closeShow(function() {
                opt.callback();
            });
        });
        //点击关闭/取消按钮操作
        $('button.icpntDialog_close', window.parent.document).click(function() {
            $.closeShow(function() {
                if (typeof(opt.closeCallback) === "function") {
                    opt.closeCallback();
                }
            });
        });
    },

		//基于bootstrap的封装弹窗-frame url
    /***************************************************
    title : 标题
    url : 页面链接
    closeCallback:点击关闭按钮回调函数
    ***************************************************/
    showUrl: function(opt) {
        var html = '';
        html += '<div class="modal fade icpntDialog_showDiv" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
        html += '<div class="modal-dialog">';
        html += '<div class="modal-content">';
        html += '<div class="modal-header">';
        html += '<button type="button" class="close icpntDialog_close">×</button>';
        html += '<h4 class="modal-title" id="myModalLabel">' + opt.title + '</h4>';
        html += '</div>';
        html += '<div class="modal-body" style="height:388px;">';
        html += '<iframe name="showFrame" id="icpnt_showFrame" frameborder="0" scrolling="auto" width="100%" height="100%" src="'+opt.url+'"></iframe>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        $("body", window.parent.document).append(html);
        $('div#myModal', window.parent.document).modal({
            keyboard: false
        });
        //点击关闭按钮操作
        $('button.icpntDialog_close', window.parent.document).click(function() {
            $.closeShow(function() {
                if (typeof(opt.closeCallback) === "function") {
                    opt.closeCallback();
                }
            });
        });
    },

    //关闭和删除bootstrap弹窗
    closeShow: function(callback) {
        $('div#myModal', window.parent.document).modal('hide');
        //删除弹窗
        $('div#myModal', window.parent.document).on('hidden.bs.modal', function() {
            $('div.icpntDialog_showDiv', window.parent.document).remove();
            if (typeof callback === "function") {
                callback();
            }
        });
    }

})
