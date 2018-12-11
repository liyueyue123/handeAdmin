$(function () {
    var url = window.location.href;
    var id = url.split("=")[1];
    // console.log(url);
    customerDetail(id);
});

function customerDetail() {
    $.ajax({
        type: "method",
        url: "url",
        data: "data",
        dataType: "dataType",
        success: function (response) {
            
        }
    });
}