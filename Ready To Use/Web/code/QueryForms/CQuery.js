
var CQuery = function(aSettings, aCallBackFunction, aDummyData) {
    this.sOk = getValue(aSettings.sOk, "Ok");
    this.sNo = getValue(aSettings.sNo);
    this.sCancel = getValue(aSettings.sCancel, _("Annuler"));
    this.dummyData = aDummyData;
    this.wContainer = aSettings.wContainer;
    this.callback = aCallBackFunction;
    this.valueReturned = "";
    this.bButtonClicked = false;
    this.sIdLabel = getValue(this.sIdLabel,"idLabelQuery");
    this.sLabel = getValue(aSettings.sLabel);
    this.wdow;
    this.iWdowWidth = getValue(aSettings.iWidth, 360);
    this.iWdowHeight = getValue(aSettings.iHeight, 110);
    this.sHtml = "";

    var self = this,
        sButtonNo = "";
        wdowSettings = {
            sName: "wQuery",
            sHeader: getValue(aSettings.sCaption, _("Confirmer")),
            sIcon: 'resources/theme/img/icon-16.png',
            iWidth: this.iWdowWidth,
            iHeight: this.iWdowHeight,
            bDenyResize: true,
            bHidePark: true
        };

    //initialize pop-up
   if (isAssigned(this.wContainer))
       this.wdow = this.wContainer.addWindow(wdowSettings);
    else {
       this.wContainer = new CWindow(wdowSettings);
       this.wdow = this.wContainer.getWindow("wQuery");
       this.wdow.bringToTop();
   }
   this.wdow.attachEvent("onClose", function () {
       self.afterClose();
       return true;
   });

    this.wdow.attachHTMLString('<div id="mainDiv"></div>');

    if (!isEmpty(this.sNo))
        sButtonNo = "<input type='button' class='cl_btn_action' style='margin-right:6px' id='no' value='" + this.sNo + "'/>";

    this.updateHTML();
    this.sHtml +=
        "<input type='button' class='cl_btn_action' style='margin-right:6px' id='ok' value='" + this.sOk + "'/>" +
        sButtonNo +
        "<input type='button' class='cl_btn_action' id='cancel' value='" + this.sCancel + "'/>";

    J("#mainDiv").append(this.sHtml);
    J("#mainDiv").find("input[type=button]").wrapAll('<div id="id_div_btns" />');

    //associate event with button ok
    J("#ok").click(function () { self.onClick(this); });

    //associate event with button cancel
    J("#cancel").click(function () { self.onClick(this); });

    //associate event with button no
    if (!isEmpty(this.sNo))
        J("#no").click(function () { self.onClick(this); });

    this.updateEvents();
}

CQuery.prototype.updateHTML = function () {
    if (!isEmpty(this.sLabel))
        this.sHtml = "<label id='" + this.sIdLabel + "' style='margin-left:6px;text-align=center' for='Input'></label>";
}

CQuery.prototype.updateEvents = function () {
    //indicate the label
    if (isAssigned(this.sIdLabel) && (!isEmpty(this.sLabel)))
        J("#" + this.sIdLabel).html(this.sLabel);
}

CQuery.prototype.onClick = function (aInput) {
    this.bButtonClicked = true;
    this.close();
    if (isAssigned(this.callback))
        this.callback(aInput.id, this.valueReturned, this.dummyData);
}

CQuery.prototype.close = function () {
    this.wdow.close();
}

CQuery.prototype.afterClose = function () {
    // if ok or cancel button, callback is already execute,
    // if close by the cross : need to execute the callback
    if (!this.bButtonClicked && isAssigned(this.callback))
        this.callback('cancel', this.valueReturned, this.dummyData);
}



