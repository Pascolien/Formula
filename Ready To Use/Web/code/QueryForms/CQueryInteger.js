function CQueryInteger(aSettings, aCallBackFunction, aDummyData) {
    var self = this;
    this.fLowerBound = getValue(aSettings.fLowerBound);
    this.fUpperBound = getValue(aSettings.fUpperBound);
    this.sIdLabel = "idLabelQueryInteger";
    this.sIdInput = "idTextQueryInteger";
    this.dhxPopupInput = new dhtmlXPopup({ mode: "right" });

    CQueryString.call(this, aSettings, function (aModalResult, aValue, aData) {
        if (self.dhxPopupInput) self.dhxPopupInput.unload();
        aCallBackFunction(aModalResult, aValue, aData);
    }, aDummyData);

    J("#" + this.sIdInput).focus();
}

//inheritage
CQueryInteger.prototype = createObject(CQueryString.prototype);
CQueryInteger.prototype.constructor = CQueryInteger;

CQueryInteger.prototype.updateHTML = function () {
    CQuery.prototype.updateHTML.call(this);
    this.sHtml = "<input style='margin:6px;width:" + this.sInputWidth + "; height:18px;' type='number' id='" + this.sIdInput + "'/>";
}

CQueryInteger.prototype.updateEvents = function () {
    CQueryString.prototype.updateEvents.call(this);
    var self = this;

    this.checkInputValidity();

    J("#" + this.sIdInput).change(function () {
        self.checkInputValidity();
    });
    J("#" + this.sIdInput).keyup(function (event) {
        self.checkInputValidity();
        if (!J('#ok').prop('disabled') && event.which == 13) {
            self.onClick(J('#ok')[0]);
        }
    });

    J("#" + this.sIdInput).focus();
}

CQueryInteger.prototype.checkInputValidity = function () {
    var input = document.getElementById(this.sIdInput),
                x = getAbsoluteLeft(input),
                y = getAbsoluteTop(input),
                w = input.offsetWidth,
                h = input.offsetHeight;
    if (this.fLowerBound != "" && (J("#" + this.sIdInput).val() < this.fLowerBound)) { // lower bound invalid
        J("#ok").attr('disabled', 'disabled');
        this.dhxPopupInput.attachHTML("<span class='textPopupValidation'>" + format(_("La valeur doit être supérieure à la borne inférieur : #1."), [this.fLowerBound]) + "</span>");
        this.dhxPopupInput.show(x, y, w, h);
    } else if (this.fUpperBound != "" && (J("#" + this.sIdInput).val() > this.fUpperBound)) { // upper bound invalid
        J("#ok").attr('disabled', 'disabled');
        this.dhxPopupInput.attachHTML("<span class='textPopupValidation'>" + format(_("La valeur doit être inférieure à la borne supérieure : #1."), [this.fUpperBound]) + "</span>");
        this.dhxPopupInput.show(x, y, w, h);
    } else {
        J("#ok").removeAttr('disabled');
        this.dhxPopupInput.hide();
    }
}



