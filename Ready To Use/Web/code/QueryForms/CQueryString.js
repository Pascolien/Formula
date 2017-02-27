var CQueryString = function(aSettings, aCallBackFunction, aDummyData) {
    this.sInputWidth = getValue(aSettings.sInputWidth, "205px");
    this.sInputValue = aSettings.sInputValue;
    this.bHighlightInput = getValue(aSettings.bHighlightInput, false);
    this.sIdLabel = "idLabelQueryString";
    this.sIdInput = "idTextQueryString";
    this.onEnter = aSettings.onEnter;

    CQuery.call(this, aSettings, aCallBackFunction, aDummyData);
}

//inheritage
CQueryString.prototype = createObject(CQuery.prototype);
CQueryString.prototype.constructor = CQueryString;

CQueryString.prototype.updateHTML = function () {
    CQuery.prototype.updateHTML.call(this);
    this.sHtml = "<input style='margin:6px;width:" + this.sInputWidth + "; height:18px;' type='text' id='" + this.sIdInput + "'/>";
}

CQueryString.prototype.updateEvents = function () {
    CQuery.prototype.updateEvents.call(this);
    var self = this;

    //fill input text
    if (isAssigned(this.sInputValue))
        J("#" + this.sIdInput).val(this.sInputValue);

    //focus and highlight input
    if (this.bHighlightInput)
        J("#" + this.sIdInput).select();

    //manage event onEnter
    if (this.onEnter) {
        J("#" + this.sIdInput).keyup(function (e) {
            if (e.which == 13) {
                self.onEnter();
            }
        });
    }
}

CQueryString.prototype.onClick = function (aInput) {
    this.valueReturned = J(aInput).parent().prev("#" + this.sIdInput).val();

    CQuery.prototype.onClick.call(this, aInput);
}

