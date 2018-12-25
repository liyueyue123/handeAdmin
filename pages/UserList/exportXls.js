function JSONToExcelConvertor(JSONData, FileName, ShowLabel, Sheet) {
    //先转化json
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var excel = '<table>';

    //设置表头
    var row = "<tr>";
    for (var i = 0, l = ShowLabel.length; i < l; i++) {
        row += "<td>" + ShowLabel[i].value + '</td>';
    }

    //换行
    excel += row + "</tr>";

    //设置数据
    for (var i = 0; i < arrData.length; i++) {
        var row = "<tr>";
        for (var index in arrData[i]) {
            var value = arrData[i][index].value === "." ? "" : arrData[i][index].value;
            if(isNumber(value)){
                row += '<td style="mso-number-format:\'\\@\';">' + value + '</td>';
            }else{
                row += '<td>' + value + '</td>';
            }
        }
        excel += row + "</tr>";
    }

    excel += "</table>";

    var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
    excelFile += '; charset=UTF-8">';
    excelFile += "<head>";
    excelFile += "<!--[if gte mso 9]>";
    excelFile += "<xml>";
    excelFile += "<x:ExcelWorkbook>";
    excelFile += "<x:ExcelWorksheets>";
    excelFile += "<x:ExcelWorksheet>";
    excelFile += "<x:Name>";
    excelFile += Sheet;
    excelFile += "</x:Name>";
    excelFile += "<x:WorksheetOptions>";
    excelFile += "<x:DisplayGridlines/>";
    excelFile += "</x:WorksheetOptions>";
    excelFile += "</x:ExcelWorksheet>";
    excelFile += "</x:ExcelWorksheets>";
    excelFile += "</x:ExcelWorkbook>";
    excelFile += "</xml>";
    excelFile += "<![endif]-->";
    excelFile += "</head>";
    excelFile += "<body>";
    excelFile += excel;
    excelFile += "</body>";
    excelFile += "</html>";

    var link = document.createElement("a");

    // var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile); //大于2M就受限制了
    // link.href = uri;

    var blob = new Blob(["\ufeff" + excelFile], {type: 'application/vnd.ms-excel'}); //解决大文件下载失败
    link.setAttribute("href", URL.createObjectURL(blob));

    link.style = "visibility:hidden";
    link.download = FileName + ".xls";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * 是否是数字
 * @param val
 * @returns {boolean}
 */
function isNumber(val){
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val) || regNeg.test(val)){
        return true;
    }else{
        return false;
    }

}