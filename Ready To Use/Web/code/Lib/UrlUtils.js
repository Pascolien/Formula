function _url(aUrl) {
    if (aUrl.indexOf("/") != 0 || aUrl.indexOf(sIISApplicationName) === 0)
        return aUrl;

    return sIISApplicationName + aUrl;
}

function redirect(aLocation, aFilePath, aParameters) {
    var sParameters = "";

    if (isAssigned(aParameters))
        aParameters.forEach(function (aParam) {
            if (!isAssigned(aParam[1]))
                return;

            sParameters = qcFmt(sParameters, "#1=#2", [aParam[0], aParam[1]], "&");
        });

    if (!isEmpty(sParameters))
        sParameters = qc("?", sParameters);

    aLocation.href = aFilePath + sParameters;
}

function saveContent(fileContents, fileName) {
    var link = document.createElement('a');
    link.download = fileName;
    link.href = 'data:text/csv,' + encodeURIComponent(fileContents);
    link.click();
}

function formatTxURL(aUrl) {
    if ((aUrl.substring(0, 6) !== 'ftp://') && (aUrl.substring(0, 7) !== 'http://') && (aUrl.substring(0, 8) !== 'https://') && (aUrl.substring(0, 2) !== '..') && (aUrl.substring(0, 2) !== '\\'))
        return "http://" + aUrl;
    else
        return aUrl;
}

function getURLParameter(aName, aUrl) {
    if (!aUrl) aUrl = location.search;
    return decodeURIComponent((new RegExp('[?|&]' + aName + '=' + '([^&;]+?)(&|#|;|$)').exec(aUrl) || [, ""])[1].replace(/\+/g, '%20')) || null;
}