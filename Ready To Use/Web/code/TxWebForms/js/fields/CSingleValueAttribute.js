
function CSingleValueAttribute(aSettings, aDummydata) {
    var sIdDivParent = getValue(J(aSettings.htmlDiv).attr('id'), getUniqueId());

    this.idMin = 'minVal' + sIdDivParent;
    this.inputs = [{ sId: this.idMin }];

    var self = this,
        sUnitName = "";

    if (!aSettings.field.SecondaryUnits && !isEmpty(aSettings.field.Unit))
        sUnitName = aSettings.field.Unit.sName;

    aSettings.sInput = '<div style="float:left;">' + (aSettings.bWriteMode ? '<input class="point clInput" id="' + this.idMin + '" type="text"/> ' : '<label id="' + this.idMin + '"></label> ') + sUnitName + '</div>';
    CPointAttribute.call(this, aSettings, null, aDummydata);
}

CSingleValueAttribute.prototype = createObject(CPointAttribute.prototype);
CSingleValueAttribute.prototype.constructor = CSingleValueAttribute;

CSingleValueAttribute.prototype.toString = function () {
    return "CSingleValueAttribute";
}

CSingleValueAttribute.prototype.initFields = function () {
    var self = this;

    if (!this.bWriteMode) {
        this.inpMin.html(round(this.field.Data.fMin, this.iDgts));

        return;
    }
    if (this.field.Data)
        this.inpMin.val(this.field.Data.fMin);

    this.inpMin.css("outline", "none");

    if (this.field.Data) {
        this.inpMin.val(this.field.Data.fMin);
    }

    //manage readOnly
    if (this.bReadOnly) {
        J("#" + this.idMin).attr("disabled", "disabled");
        return;
    }

    this.inpMin.keyup(function () {
        if (self.inpMin.val() != '') {
            var fMin = self.inpMin.val(),
                sPxSize = isIE() ? "1px" : "2px";

            if (isAssigned(self.combo) && self.idUnitCurrent != self.idUnitRef)
                fMin = convert(self.idUnitCurrent, self.idUnitRef, fMin);

            if (!isNumeric(fMin)) {
                self.inpMin.css("border", sPxSize+" solid red");
                self.updateField();
                return;
            }

            fMin = parseFloatExt(fMin);

            if ((self.field.fUB == 'INF' || (fMin < parseFloatExt(self.field.fUB) && !self.field.bUB_Inclusive) || (fMin <= parseFloatExt(self.field.fUB) && self.field.bUB_Inclusive)) &&
                (self.field.fLB == '-INF' || (fMin > parseFloatExt(self.field.fLB) && !self.field.bLB_Inclusive) || (fMin >= parseFloatExt(self.field.fLB) && self.field.bLB_Inclusive))) {
                self.inpMin.css("border", sPxSize+" solid green");
                self.updateField(fMin);
            } else {
                self.inpMin.css("border", sPxSize+" solid red");
                self.updateField();
            }
        } else {
            if (isIE())
                self.inpMin.css("border-color", "black");
            else
                self.inpMin.css("border", "");
            self.updateField("");
        }
    });
}
