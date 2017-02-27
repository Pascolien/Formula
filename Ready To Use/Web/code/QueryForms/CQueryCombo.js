function CQueryCombo(aSettings, aCallBackFunction, aDummyData) {
    checkMandatorySettings(aSettings, ["options"]);
    var self = this;

    this.options = aSettings.options;
    this.iComboWidth = getValue(aSettings.iComboWidth, 218);
    this.sIdLabel = "idLabelQueryCombo";

    CQuery.call(this, aSettings, aCallBackFunction, aDummyData);

    this.idCloseEvent = this.wdow.attachEvent("onClose", function () {
        self.combo.unload();
        self.wdow.detachEvent(self.idCloseEvent);
        return true;
    });
}

//inheritage
CQueryCombo.prototype = createObject(CQuery.prototype);
CQueryCombo.prototype.constructor = CQueryCombo;

CQueryCombo.prototype.updateHTML = function () {
    CQuery.prototype.updateHTML.call(this);
    this.sHtml += "<div id='idDivQueryCombo' style='margin:6px;'></div>";
}

CQueryCombo.prototype.updateEvents = function () {
    CQuery.prototype.updateEvents.call(this);

    //init the combo
    this.combo = new CComboBox({
        sIdDivCombo: "idDivQueryCombo",
        txObjects: this.options,
        iWidth: this.iComboWidth
    });
}

CQueryCombo.prototype.onClick = function (aInput) {
    this.valueReturned = this.combo.getSelectedOption();

    CQuery.prototype.onClick.call(this, aInput);
}


