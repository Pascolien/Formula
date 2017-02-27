
function CDateAttribute(aSettings) {
    var sIdDivParent = getValue(J(aSettings.htmlDiv).attr('id'), getUniqueId());

    this.sId = 'date' + sIdDivParent;
    this.field = aSettings.field;
    this.datepicker;
    this.bTime = getValue(this.bTime, false);

    var self = this,
        sDataValue = isEmpty(this.field.Data) ? null : this.field.Data.fVal;

    aSettings.sInput = aSettings.bWriteMode ? '<input type="text" class="clInput" id="' + this.sId + '"/>' : '<label>' + floatToDateStr(sDataValue) + '</label>';
    aSettings.sDataValue = sDataValue;
    CAttributeField.call(this, aSettings);
}

CDateAttribute.prototype = createObject(CAttributeField.prototype);
CDateAttribute.prototype.constructor = CDateAttribute;

CDateAttribute.prototype.toString = function () {
    return "CDateAttribute";
}

CDateAttribute.prototype.initField = function () {
    if (!this.bWriteMode)
        return;

    var self = this,
        bValid,
        fVal;

    this.iParentDivWidth = (this.iParentDivWidth > 0 && this.bTemplate) ? this.iParentDivWidth - 28 : iTxFormDatepickerWidth;

    if (this.field.Data) {
        fVal = this.field.Data.fVal;
    }

    this.datepicker = new CDatePicker({
        sIdInputDate: this.sId,
        sDateFormat: sTxDateFormat,
        sTimeFormat: sTxTimeFormat,
        bTime: this.bTime,
        iWidth: this.iParentDivWidth,
        setDateValue: fVal,
        bShowOtherMonths: true,
        bSelectOtherMonths: true,
        bReadOnly: this.bReadOnly,
        bCancelButton: true,
        onChange: function (aValue) {
            self.updateField(aValue);
        },
        onCancel: function () {
            if (J(self.htmlDiv).attr('Mandatory')) {
                bValid = false;
            }
            self.updateField("");
        }
    });
}

CDateAttribute.prototype.getDataToSave = function () {
    var data = CAttributeField.prototype.getDataToSave.call(this);
    if (this.bUpdate) {
        delete data.sVal;
        data.fVal = parseFloatExt(""+this.sValue);
    }

    return data;
}

CDateAttribute.prototype.lock = function (aLocked) {
    CAttributeField.prototype.lock.call(this, aLocked);

    if (!this.bReadOnly && isAssigned(this.datepicker))
        this.datepicker.lock(this.bLocked);
}

CDateAttribute.prototype.closeField = function () {
    //close the datepicker if it's opened
    if (this.datepicker)
        this.datepicker.hide();
}