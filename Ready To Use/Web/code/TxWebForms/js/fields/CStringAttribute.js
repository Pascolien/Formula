//class CStringAttribute
function CStringAttribute(aSettings) {
    var field = aSettings.field,
        sDataValue = isEmpty(field.Data) ? null : field.Data.sVal,
        sIdDivParent = getValue(J(aSettings.htmlDiv).attr('id'), getUniqueId());

    this.sId = 'string' + sIdDivParent;
    this.htmlDiv = aSettings.htmlDiv;

    aSettings.sInput = aSettings.bWriteMode ? '<textarea id="' + this.sId + '"></textarea>' : '<label>' + sDataValue + '</label>';
    aSettings.sDataValue = sDataValue;
    CAttributeField.call(this, aSettings);
}

CStringAttribute.prototype = createObject(CAttributeField.prototype);
CStringAttribute.prototype.constructor = CStringAttribute;

CStringAttribute.prototype.toString = function () {
    return "CStringAttribute";
}

CStringAttribute.prototype.initField = function () {
    if (!this.bWriteMode)
        return;

    var self = this;

    if (!isEmpty(this.sFirstValue))
        J(this.htmlDiv).find("#" + this.sId).val(this.sFirstValue);
    
    this.adjustAreaHeight(getValue(this.sFirstValue));

    //manage update
    J("#" + this.sId).keyup(function () {
        self.adjustAreaHeight(this.value);
        self.updateField(this.value);
    });

    //manage readOnly
    if (this.bReadOnly) {
        J("#" + this.sId).attr("disabled", "disabled");
    }

    J("#" + this.sId).css("width", this.iParentDivWidth + "px");
}

CStringAttribute.prototype.changeDisplayMode = function (aDisplayMode) {
    switch (aDisplayMode) {
        case fdmRead:

            break;
        case fdmWrite:

            break;
        case fdmLock:

            break;
    }
}

CStringAttribute.prototype.updateField = function (aValue) {
    CAttributeField.prototype.updateField.call(this, removeForbiddenCharacters(aValue));
}

CStringAttribute.prototype.lock = function (aLocked) {
    CAttributeField.prototype.lock.call(this, aLocked);

    if (!this.bReadOnly) {
        if (this.bLocked)
            J("#" + this.sId).attr("disabled", "disabled");
        else 
            J("#" + this.sId).removeAttr("disabled");
    }
}
