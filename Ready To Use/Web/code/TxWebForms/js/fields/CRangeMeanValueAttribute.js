
function CRangeMeanValueAttribute(aSettings, aDummydata) {
    var sIdDivParent = getValue(J(aSettings.htmlDiv).attr('id'), getUniqueId());

    this.idMin = 'minVal' + sIdDivParent;
    this.idMax = 'maxVal' + sIdDivParent;
    this.idMean = 'meanVal' + sIdDivParent;
    this.inputs = [
        { sId: this.idMin },
        { sId: this.idMax },
        { sId: this.idMean }
    ];

    var self = this,
        sUnitName = "";

    if (!aSettings.field.SecondaryUnits && !isEmpty(aSettings.field.Unit))
        sUnitName = aSettings.field.Unit.sName;
    
    aSettings.sInput = '<div style="float:left;">' + (aSettings.bWriteMode ?
            '<input class="point clInput" id="' + this.idMin + '" type = "text"/> ' + _("à") +
            ' <input class="point clInput" id="' + this.idMax + '" type = "text"/>' +
            '<input class="point clInput" style="margin-left:6px;" id="' + this.idMean + '" type = "text"/>'
            :
            '<label id="' + this.idMin + '"></label> ' + _("à") +
            ' <label id="' + this.idMax + '"></label>' +
            '<label style="margin-left:6px;" id="' + this.idMean + '"></label>'
        ) + sUnitName + '</div>';
    CPointAttribute.call(this, aSettings, null, aDummydata);
}

CRangeMeanValueAttribute.prototype = createObject(CPointAttribute.prototype);
CRangeMeanValueAttribute.prototype.constructor = CRangeMeanValueAttribute;

CRangeMeanValueAttribute.prototype.toString = function () {
    return "CRangeMeanValueAttribute";
}

CRangeMeanValueAttribute.prototype.initFields = function () {
    var self = this,
        inputs = J("#" + this.idMin + ",#" + this.idMax + ",#" + this.idMean);

    if (!this.bWriteMode) {
        this.inpMin.html(round(this.field.Data.fMin, this.iDgts));
        this.inpMax.html(round(this.field.Data.fMax, this.iDgts));
        this.inpMean.html(round(this.field.Data.fMean, this.iDgts));
        return;
    }

    if (this.field.Data) {
        this.inpMin.val(this.field.Data.fMin);
        this.inpMax.val(this.field.Data.fMax);
        this.inpMean.val(this.field.Data.fMean);
    }

    inputs.keyup(function () {
        if (self.inpMin.val() != "" || self.inpMax.val() != "" || self.inpMean.val() != "") {
            var fMin = self.inpMin.val(),
                fMax = self.inpMax.val(),
                fMean = self.inpMean.val() || fMin,
                sPxSize = isIE() ? "1px" : "2px";

            if (isAssigned(self.combo) && self.idUnitCurrent != self.idUnitRef) {
                fMin = convert(self.idUnitCurrent, self.idUnitRef, fMin);
                fMax = convert(self.idUnitCurrent, self.idUnitRef, fMax);
                fMean = convert(self.idUnitCurrent, self.idUnitRef, fMean);
            }

            if (!isNumeric(fMin) || !isNumeric(fMax) || !isNumeric(fMean)) {
                if (!isNumeric(fMin))
                    self.inpMin.css("border", sPxSize+" solid red");

                if (!isNumeric(fMax))
                    self.inpMax.css("border", sPxSize + " solid red");

                if (!isNumeric(fMean))
                    self.inpMean.css("border", sPxSize + " solid red");

                self.updateField();
                return;
            }

            var fMin = parseFloatExt(fMin),
                fMax = parseFloatExt(fMax),
                fMean = parseFloatExt(fMean) || fMin;

            if (fMin >= fMax)
                J("#" + self.idMin + ",#" + self.idMax).css("border", sPxSize+" solid red");
            else {
                if ((fMean <= fMax) && (fMean >= fMin)){
                    self.inpMean.css("border", sPxSize + " solid green");
                    self.updateField(fMin, fMax, fMean);
                } else {
                    self.inpMean.css("border", sPxSize + " solid red");
                    self.updateField();
                }

                if (self.field.fLB == '-INF' || (fMin > parseFloatExt(self.field.fLB) && !self.field.bLB_Inclusive) || (fMin >= parseFloatExt(self.field.fLB) && self.field.bLB_Inclusive)) {
                    self.inpMin.css("border", sPxSize + " solid green");
                    self.updateField(fMin, fMax, fMean);
                } else {
                    self.inpMin.css("border", sPxSize + " solid red");
                    self.updateField();
                }

                if (self.field.fUB == 'INF' || (fMax < parseFloatExt(self.field.fUB) && !self.field.bUB_Inclusive) || (fMax <= parseFloatExt(self.field.fUB) && self.field.bUB_Inclusive)){
                    self.inpMax.css("border", sPxSize + " solid green");
                    self.updateField(fMin, fMax, fMean);
                } else {
                    self.inpMax.css("border", sPxSize + " solid red");
                    self.updateField();
                }
            }
        } else {
            if (isIE())
                inputs.css("border-color", "black");
            else
                inputs.css("border", "");
            self.updateField();
        }
    });

    J('#' + this.idMin + ',#' + this.idMax).change(function () {
        var fMin = self.inpMin.val() || parseFloat(self.inpMax.val()) - 1,
            fMax = self.inpMax.val() || parseFloat(fMin) + 1;

        if (isEmpty(J('#' + self.idMin).val())) {
            J('#' + self.idMin).val(fMin);
        }

        if (isEmpty(J('#' + self.idMax).val())) {
            J('#' + self.idMax).val(fMax);
        }
    });

    inputs.change(function () {
        if (self.inpMean.val() == "" && self.inpMin.val() != "" && self.inpMax.val() != "") {
            self.inpMean.val((parseFloatExt(self.inpMin.val()) + parseFloatExt(self.inpMax.val())) / 2);
            self.updateField(self.inpMin.val(), self.inpMax.val(), self.inpMean.val());
        }
    });    
}
