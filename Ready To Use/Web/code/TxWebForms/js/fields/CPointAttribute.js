
function CPointAttribute(aSettings) {
    var sIdDivParent = getValue(J(aSettings.htmlDiv).attr('id'), getUniqueId());
        
    var field = aSettings.field;
    this.idUnitCurrent = isAssigned(field.Data) ? isAssigned(field.Data.Unit) ? field.Data.Unit.ID : field.Data.ID_Unit : 0;
    this.idUnitRef = field.Unit ? field.Unit.ID : null;
    this.fMinFirstValue = isAssigned(field.Data) ? field.Data.fMin : null;
    this.fMin = this.fMinFirstValue;
    this.fMaxFirstValue = isAssigned(field.Data) ? field.Data.fMax : this.fMin;
    this.fMax = this.fMaxFirstValue;
    this.fMeanFirstValue = isAssigned(field.Data) ? field.Data.fMean : this.fMin;
    this.fMean = this.fMeanFirstValue;
    this.idCancel = "cancel" + sIdDivParent;
    this.htmlDiv = aSettings.htmlDiv;
    this.iPrec = getValue(field.iPrec,0);
    this.iDgts = getValue(field.iDgts, 0);
    this.sValue = isAssigned(field.Data) ? "something" : "";

    aSettings.sInput = aSettings.sInput;
    CAttributeField.call(this, aSettings);
}

CPointAttribute.prototype = createObject(CAttributeField.prototype);
CPointAttribute.prototype.constructor = CPointAttribute;

CPointAttribute.prototype.toString = function () {
    return "CPointAttribute";
}

CPointAttribute.prototype.initField = function () {
    var self = this;

    this.inpMin = J("#" + this.idMin);
    this.inpMax = J("#" + this.idMax);
    this.inpMean = J("#" + this.idMean);

    this.initFields();

    if (this.bReadOnly) {
        this.lock();
        return;
    }

    if (this.bMandatory) {
        if (isEmpty(this.fMin) || isEmpty(this.fMax) || isEmpty(this.fMean))
            this.bValid = false;
        else if (!isAssigned(this.fMin) || (!isAssigned(this.fMax)) || (!isAssigned(this.fMean)))
            this.bValid = false;
        else
            this.bValid = true;
    }

    if (this.field.SecondaryUnits) {
        //init the combo units
        var options = this.field.SecondaryUnits;
        options.insert(0, this.field.Unit);

        if (this.idUnitCurrent < 1)
            this.idUnitCurrent = options[0].ID;

        this.combo = new CComboBox({
            sIdDivCombo: J(this.htmlDiv).attr('id'),
            iWidth: 90,
            txObjects: options,
            bReadOnly: this.bReadOnly,
            iDefaultValueSelected: this.idUnitCurrent,
            onChange: function () { self.changeUnit() }
        });

        J(this.htmlDiv).find('.dhx_combo_box').css({
            "float": "left",
            "margin-left": "6px"
        });

        //convert values if unit selected is not the default unit
        if (this.idUnitCurrent != this.idUnitRef)
            this.changeUnit(this.idUnitRef, this.idUnitCurrent);
    }

    if (!this.bReadOnly && this.bWriteMode) {
        J(this.htmlDiv).append('<div style="float:left;"><img id="' + this.idCancel + '" class="clIcon" src="'+ _url("/resources/theme/img/btn_form/16x16_false.png") +'" style="vertical-align:sub;"  title="' + _("Supprimer la donnée") + '" /></div>');
        var cancelImg = J('#' + this.idCancel);

        cancelImg.click(function () {
            J(this).css("display", "none");
            self.inputs.forEach(function (aInput) {
                J("#" + aInput.sId).val("");
            });

            if (isIE()){
                self.inpMin.css("border-color", "black");
                self.inpMax.css("border-color", "black");
                self.inpMean.css("border-color", "black");
            } else {
                self.inpMin.css("border", "");
                self.inpMax.css("border", "");
                self.inpMean.css("border", "");
            }

            self.updateField("");
        });
        if (this.field.Data)
            cancelImg.css("display", "block");
        else
            cancelImg.css("display", "none");
    }
}

CPointAttribute.prototype.initFields = function () {
    //virtual abstract
}

CPointAttribute.prototype.changeUnit = function (aUnitSrc, aUnitDest) {
    var self = this,
        bUpdate = !isAssigned(aUnitDest),
        idUnitSrc = getValue(aUnitSrc, this.idUnitCurrent),
        idUnitDest = getValue(aUnitDest, this.combo.getSelectedValue());

    if (idUnitDest == idUnitSrc)
        return;

    //convert input(s) values
    this.inputs.forEach(function (aInput) {
        //the round digits are applied in case of read form.
        var sValue = parseFloatExt(self.bWriteMode ? getValue(J("#" + aInput.sId).val(), 0) : getValue(J("#" + aInput.sId).html(), 0)),
            fValue = self.bWriteMode ? sValue : J("#" + aInput.sId).attr("fValue");

        if (sValue == 0)
            return;

        if (!fValue)
            fValue = parseFloat(sValue);

        if (idUnitSrc != self.combo.options[0].ID && idUnitDest != self.combo.options[0].ID) {
            fValue = convert(idUnitSrc, self.combo.options[0].ID, fValue)
            idUnitSrc = self.combo.options[0].ID;
        }

        var fValueConverted = convert(idUnitSrc, idUnitDest, fValue),
            fRoundValueConverted = round(fValueConverted, self.iDgts);

        if (self.bWriteMode)
            J("#" + aInput.sId).val(fRoundValueConverted);
        else
            J("#" + aInput.sId).html(fRoundValueConverted);

        J("#" + aInput.sId).attr("fValue", fValueConverted)
    });
    this.idUnitCurrent = idUnitDest;
    if (bUpdate)
        this.bUpdate = true;
}

CPointAttribute.prototype.updateField = function (aMinValue, aMaxValue, aMeanValue) {
    aMaxValue = getValue(aMaxValue, aMinValue);
    aMeanValue = getValue(aMeanValue, aMinValue);

    this.bDelete = false;
    this.bUpdate = false;
    this.fMin = aMinValue;
    this.fMax = aMaxValue;
    this.fMean = aMeanValue;
    if (isAssigned(this.combo))
        this.combo.enable();

    if ((!isEmpty(this.fMinFirstValue) && (isEmpty(this.fMin))) || (!isEmpty(this.fMaxFirstValue) && (isEmpty(this.fMax))) || (!isEmpty(this.fMeanFirstValue) && (isEmpty(this.fMean))) || (isEmpty(this.fMin)) || (isEmpty(this.fMax)) || (isEmpty(this.fMean))) {
        this.bDelete = true;
        this.sValue = "";
    } else if (this.fMinFirstValue != this.fMin || this.fMaxFirstValue != this.fMax || this.fMeanFirstValue != this.fMean) {
        this.bUpdate = true;
        this.sValue = "something";
    }

    if ((isEmpty(this.fMin) && this.bMandatory) || (isEmpty(this.fMax) && this.bMandatory) || (isEmpty(this.fMean) && this.bMandatory))
        this.bValid = false;
    else if (!isAssigned(this.fMin) || (!isAssigned(this.fMax)) || (!isAssigned(this.fMean))) {
        if (isAssigned(this.combo))
            this.combo.disable();
        this.bValid = false;
    } else
        this.bValid = true;

    if (!isEmpty(this.inpMin.val()) || !isEmpty(this.inpMax.val()) || !isEmpty(this.inpMean.val()))
        J('#' + this.idCancel).css("display", "block");
    else
        J('#' + this.idCancel).css("display", "none");

    //permit to launch the fields control
    CAttributeField.prototype.updateField.call(this);
}

CPointAttribute.prototype.getDataToSave = function () {
    var data = CAttributeField.prototype.getDataToSave.call(this);

    if (this.bUpdate) {
        delete data.sVal;
        data.fMin = parseFloatExt(this.fMin);
        data.fMax = parseFloatExt(this.fMax);
        data.fMean = parseFloatExt(this.fMean);
        if (this.idUnitCurrent) {
            if (this.combo)
                data.Unit = this.combo.getSelectedOption();
            else if (this.field.Unit)
                data.Unit = this.field.Unit

            data.ID_Unit = parseInt(this.idUnitCurrent);
        } else if (this.field.Unit) {
            data.Unit = this.field.Unit;
        }
    } 
    return data;
}

CPointAttribute.prototype.lock = function (aLocked) {
    CAttributeField.prototype.lock.call(this, aLocked);

    var self = this;
    if (isAssigned(this.combo))
        this.combo.lock(this.bLocked);

    if (!this.bReadOnly) {
        if (this.bLocked) {
            this.inpMin.attr("disabled", "disabled");
            this.inpMax.attr("disabled", "disabled");
            this.inpMean.attr("disabled", "disabled");
            J("#" + this.idCancel).unbind("click");
        } else {
            this.inpMin.removeAttr("disabled");
            this.inpMax.removeAttr("disabled");
            this.inpMean.removeAttr("disabled");
            J("#" + this.idCancel).click(function () {
                J(this).css("display", "none");
                J(self.htmlDiv).find('input').val('');
                J(this).parent().find('input').css("border", "");
                self.inpMin.css("border", "");
                self.inpMax.css("border", "");
                self.inpMean.css("border", "");
                if (!isEmpty(self.combo))
                    self.combo.selectOption(0);
                self.updateField("");
            });
        }
    }
}