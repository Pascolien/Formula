
function CRangeOfValuesAttribute(aSettings, aDummydata) {
    var sIdDivParent = getValue(J(aSettings.htmlDiv).attr('id'), getUniqueId());

    this.idMin = 'minVal' + sIdDivParent;
    this.idMax = 'maxVal' + sIdDivParent;
    this.inputs = [
        { sId: this.idMin},
        { sId: this.idMax}
    ];

    var self = this,
        sUnitName = "";

    if (!aSettings.field.SecondaryUnits && !isEmpty(aSettings.field.Unit))
        sUnitName = aSettings.field.Unit.sName;

    aSettings.sInput = '<div style="float:left;">' + (aSettings.bWriteMode ?
            '<input class="point clInput" id="' + this.idMin + '" type="text"/> ' + _("à") +
            ' <input class="point clInput" id="' + this.idMax + '" type = "text"/> '
            :
            '<label id="' + this.idMin + '"></label> ' + _("à") +
            ' <label id="' + this.idMax + '"></label> '
        ) + sUnitName + '</div>';
    CPointAttribute.call(this, aSettings, null, aDummydata);
}

CRangeOfValuesAttribute.prototype = createObject(CPointAttribute.prototype);
CRangeOfValuesAttribute.prototype.constructor = CRangeOfValuesAttribute;

CRangeOfValuesAttribute.prototype.toString = function () {
    return "CRangeOfValuesAttribute";
}

CRangeOfValuesAttribute.prototype.initFields = function () {
    var self = this;

    if (!this.bWriteMode) {
        this.inpMin.html(round(this.field.Data.fMin, this.iDgts));
        this.inpMax.html(round(this.field.Data.fMax, this.iDgts));
        return;
    }

    if (this.field.Data) {
        this.inpMin.val(this.field.Data.fMin);
        this.inpMax.val(this.field.Data.fMax);
    }

    /*check input values*/
    J('#' + this.idMin + ',#' + this.idMax).keyup(function () {
        if (self.inpMin.val() != "" || self.inpMax.val() != "") {
            var fMin = self.inpMin.val(),
                fMax = self.inpMax.val() || fMin,
                sPxSize = isIE() ? "1px" : "2px";

            if (isAssigned(self.combo) && self.idUnitCurrent != self.idUnitRef) {
                fMin = convert(self.idUnitCurrent, self.idUnitRef, fMin);
                fMax = convert(self.idUnitCurrent, self.idUnitRef, fMax);
            }

            if (!isNumeric(fMin) || !isNumeric(fMax)) {
                if (!isNumeric(fMin))
                    self.inpMin.css("border", sPxSize+" solid red");

                if (!isNumeric(fMax))
                    self.inpMax.css("border", sPxSize+" solid red");

                self.updateField();
                return;
            }

            var fMin = parseFloatExt(fMin),
                fMax = parseFloatExt(fMax);

            if (fMin >= fMax){
                J('#' + self.idMin + ',#' + self.idMax).css("border", sPxSize+" solid red");
                self.updateField();
            } else {
                if (self.field.fLB == '-INF' || (fMin > parseFloatExt(self.field.fLB) && !self.field.bLB_Inclusive) || (fMin >= parseFloatExt(self.field.fLB) && self.field.bLB_Inclusive)){
                    self.inpMin.css("border", sPxSize+" solid green");
                    self.updateField(fMin, fMax);
                } else {
                    self.inpMin.css("border", sPxSize+" solid red");
                    self.updateField();
                }

                if (self.field.fUB == 'INF' || (fMax < parseFloatExt(self.field.fUB) && !self.field.bUB_Inclusive) || (fMax <= parseFloatExt(self.field.fUB) && self.field.bUB_Inclusive)){
                    self.inpMax.css("border", sPxSize+" solid green");
                    self.updateField(fMin, fMax);
                } else {
                    self.inpMax.css("border", sPxSize+" solid red");
                    self.updateField();
                }
            }
        } else {
            if (isIE())
                J('#' + self.idMin + ',#' + self.idMax).css("border-color", "black");
            else
                J('#' + self.idMin + ',#' + self.idMax).css("border", "");
            self.updateField();
        }
    });

    J('#' + this.idMin + ',#' + this.idMax).change(function () {
        var fMin = self.inpMin.val() || parseFloat(self.inpMax.val()) - 1,
            fMax = self.inpMax.val() || parseFloat(fMin) + 1;

        if (!isNumeric(fMin) || !isNumeric(fMax))
            return;

        if (isEmpty(J('#' + self.idMin).val())) {
            J('#' + self.idMin).val(fMin);
        }

        if (isEmpty(J('#' + self.idMax).val())) {
            J('#' + self.idMax).val(fMax);
        }
    });
}
