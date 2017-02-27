function msgYesNo(aMessage, aCallBack, aDummyData) {
    dhtmlx.confirm({
        title: _("Confirmation"),
        text: aMessage,
        ok: _("Oui"),
        cancel: _("Non"),
        callback: function (aResult) {
            if (aCallBack != null)
                aCallBack(aResult, aDummyData)
        }
    });
}

function msgYesNoExt(aMessage, aSettings, aCallBack, aDummyData) {
    var sYes = getValue(aSettings.sYes, _("Oui")),
        sNo = getValue(aSettings.sNo, _("Non")),
        sTitle = getValue(aSettings.sTitle, _("Confirmation"));

    dhtmlx.confirm({
        title: sTitle,
        text: aMessage,
        ok: sYes,
        cancel: sNo,
        callback: function (aResult) {
            if (aCallBack != null)
                aCallBack(aResult, aDummyData)
        }
    });
}

function msgOkCancel(aMessage, aCallBack, aDummyData) {
    dhtmlx.confirm({
        title: _("Confirmation"),
        text: aMessage,
        ok: _("Ok"),
        cancel: _("Annuler"),
        callback: function (aResult) {
            if (aCallBack != null && aResult)
                aCallBack(aResult, aDummyData);
        }
    });
}

function msgError(aMessage, aCallBack, aDummyData) {
    dhtmlx.alert({
        title: _("Erreur"),
        type: "alert-error",
        text: aMessage,
        callback: function () {
            if (aCallBack != null)
                aCallBack(aDummyData)
        }
    });
}

function msgDevError(aMessage, aContext) {
    if (aContext)
        aMessage = "[" + aContext + "] " + aMessage;
    dhtmlx.alert({
        title: "Development Error",
        type: "alert-error",
        text: aMessage
    });
}

function msgWarning(aMessage, aCallBack, aDummyData) {
    dhtmlx.alert({
        title: _("Information"),
        text: aMessage,
        callback: function () {
            if (aCallBack != null)
                aCallBack(aDummyData)
        }
    });
}

function msgYesNoFmt(aMessage, aParams,aCallBack, aDummyData) {
    msgYesNo(format(aMessage, aParams), aCallBack, aDummyData);
}

function msgOkCancelFmt(aMessage, aCallBack, aDummyData) {
    msgOkCancel(format(aMessage, aParams), aCallBack, aDummyData);
}

function msgErrorFmt(aMessage, aCallBack, aDummyData) {
    msgError(format(aMessage, aParams), aCallBack, aDummyData);
}

function msgWarningFmt(aMessage, aCallBack, aDummyData) {
    msgWarning(format(aMessage, aParams), aCallBack, aDummyData);
}