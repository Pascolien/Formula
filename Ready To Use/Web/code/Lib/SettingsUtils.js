function checkMandatorySettings(aSettings, aMandatories) {
    sMessage = "";
    J.each(aMandatories, function (aIndex, aValue) {
        if (aSettings[aValue] == null)
            sMessage = qcFmt(sMessage, "#1: mandatory argument not found", [aValue], "<br>");
    });

    if (sMessage != "")
        throw msgDevError(sMessage, "SettingsUtils.js - checkMandatorySettings");

}

function checkMandatoryParam(aContext,aParam, aMandatories) {
    sMessage = "";
    J.each(aMandatories, function (aIndex, aValue) {
        if (!isAssigned(aParam[aIndex]))
            sMessage = qcFmt(sMessage, "#1: mandatory argument not found", [aValue], "<br>");
    });

    if (sMessage != "")
        throw msgDevError(format("error in #1 : <br>#2", [aContext, sMessage]), "SettingsUtils.js - checkMandatoryParam");

}

function getApplicationName() {
    var sTemp = "";
    J.ajax({
        url: "code/StartupAjax.asp",
        async: false,
        cache: false,
        data: {
            sFunctionName: "getApplicationName"
        },
        success: function (aResult) {
            sTemp = aResult;
        }
    });
    return sTemp;
}

function resizeHeight(AHeight) {
    return (window.innerHeight < AHeight) ? window.innerHeight - 50 : AHeight;
}

function resizeWidth(AWidth) {
    return (window.innerWidth < AWidth) ? window.innerWidth - 50 : AWidth;
}