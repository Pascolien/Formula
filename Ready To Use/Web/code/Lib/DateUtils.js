function dateToFloat(aDate, aTime) {
    if (aDate == null || isNaN(aDate.getDate()))
        return 0;

    var fDate = 0,
        sFormatedDate = aDate.getDate() + "|" + (aDate.getMonth() + 1) + "|" + aDate.getFullYear();

    if (aTime)
        sFormatedDate = sFormatedDate + "|" + aDate.getHours() + "|" + aDate.getMinutes() + "|" + aDate.getSeconds();

    J.ajax({
        url: _url("/code/asp/framework_bassetti.asp"),
        async: false,
        cache: false,
        data: {
            sFunctionName: "DateStrToFloat",
            sValue: sFormatedDate,
            bTime: aTime
        },
        success: function (aResult) {
            fDate = aResult;
        }
    });

    return fDate;
}

function floatToDateStr(aFloatDate) {
    var value = floatToDate(aFloatDate).toLocaleString();
    return value.substring(0, value.indexOf(" ") > -1 ? value.indexOf(" ") : value.length);
}

function floatToDate(aFloatDate) {
    return new Date(0, 0, 0, 0, 0, parseFloatExt(aFloatDate) * 24 * 60 * 60 - 24 * 60 * 60);
}

// Convert a string date to a Javascript date object
function strToDate(aStrDate, aTime) {
    var dateDetails = aStrDate.split(/\/|\s/),
        newDate, iYear, iMonth, iDay;

    // replace day and month with format date
    if (sTxDateFormat == 'dd/mm/yy') {
        iDay = parseInt(dateDetails[0]);
        iMonth = parseInt(dateDetails[1]);
        iYear = parseInt(dateDetails[2]);
    } else if (sTxDateFormat == 'mm/dd/yy') {
        iDay = parseInt(dateDetails[1]);
        iMonth = parseInt(dateDetails[0]);
        iYear = parseInt(dateDetails[2]);
    } else { // 'yy/mm/dd'
        iDay = parseInt(dateDetails[2]);
        iMonth = parseInt(dateDetails[1]);
        iYear = parseInt(dateDetails[0]);
    }

    // construct new date with time or not
    if (aTime) {
        timeDetails = dateDetails[3].split(/:/);
        newDate = new Date(iYear, iMonth - 1, iDay, timeDetails[0], timeDetails[1], timeDetails[2]);
    } else
        newDate = new Date(iYear, iMonth - 1, iDay);
    return newDate;
}

// Convert a string date to a Javascript date object and return the float value
function strToDateToFloat(aStrDate, aTime) {
    var d = strToDate(aStrDate, aTime);
    return dateToFloat(d, aTime);
}
