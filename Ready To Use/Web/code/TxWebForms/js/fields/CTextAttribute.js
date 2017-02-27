
function CTextAttribute(aSettings, aDummydata) {
    this.field = aSettings.field;
    var sDataValue = isEmpty(this.field.Data) ? null : this.field.Data.sVal,
        sIdDivParent = getValue(J(aSettings.htmlDiv).attr('id'), getUniqueId());

    this.bUseRichText = getValue(this.field.bUseRichText, false);
    this.sId = 'text' + sIdDivParent;
    this.name = 'textName' + sIdDivParent;
    this.tinyMceClass = 'tiny' + sIdDivParent;
    this.htmlDiv = aSettings.htmlDiv;
    var iCols = this.bUseRichText ? 60 : 67;

    if (this.bUseRichText && sDataValue) {
        sDataValue = sDataValue.replace(/target="frame_blanc"/g, 'target = "hiddenFrame"');
    }

    aSettings.sInput = aSettings.bWriteMode ? '<textarea name="' + this.name + '" id="' + this.sId + '" class="' + this.tinyMceClass + '"></textarea>' : '<label>' + sDataValue + '</label>';
    aSettings.sDataValue = sDataValue;

    CAttributeField.call(this, aSettings);
}

CTextAttribute.prototype = createObject(CAttributeField.prototype);
CTextAttribute.prototype.constructor = CTextAttribute;

CTextAttribute.prototype.toString = function () {
    return "CTextAttribute";
}

CTextAttribute.prototype.initField = function () {
    if (!this.bWriteMode)
        return;

    var self = this;

    if (this.field.Data) {
        if (this.field.Data.sVal) {
            var sValue = replaceAll("<br>", "\n", this.field.Data.sVal.replace());
            J(this.htmlDiv).find("#" + this.sId).val(sValue);
        }
    }
    J("#" + this.sId).css("width", this.iParentDivWidth + "px");

    J("#" + this.sId).css("width", this.iParentDivWidth + "px");
    if (this.bReadOnly) {
        J("#" + this.sId).attr("disabled", "disabled");
        return;
    }
    if (this.bUseRichText) {
        this.loadTinyMCE();
    }

    //manage update
    J("#" + this.sId).keyup(function () {
        self.updateField();
    });

}

CTextAttribute.prototype.loadTinyMCE = function () {
    var self = this;
    tinymce.EditorManager.execCommand('mceRemoveEditor', true, this.name);
    tinymce.EditorManager.execCommand('mceAddEditor', true, this.name);

    this.iParentDivWidth = (this.iParentDivWidth > 0 && this.bTemplate) ? this.iParentDivWidth : null;
    this.iParentDivHeight = (this.iParentDivHeight > 0 && this.bTemplate) ? this.iParentDivHeight -28 : null;

    initTinyMCE({
        sClassName: this.tinyMceClass,
        sLang: _("fr"),
        fctOnChange: function (aValue) { self.updateField(aValue) },
        fctOnFullScreen: function (aFullScreen) { self.disableInterfaceForFullScreen(aFullScreen); },
        iWidth: this.iParentDivWidth,
        iHeight: this.iParentDivHeight
    }); // call method in temp_resources/text and illustration/tinymce/custom.js
}

CTextAttribute.prototype.disableInterfaceForFullScreen = function (aFullScreen) {
    CAttributeField.prototype.disableInterfaceForFullScreen.call(this, aFullScreen);

    if (aFullScreen) {
        var iHeight = J("#background" + this.idTabSelected + "_" + this.iUniqueId).height() - 28;
        J("#" + this.sId + "_ifr").css("height", iHeight + "px");
    } else
        J("#" + this.sId + "_ifr").css("height", this.iParentDivHeight + "px");

}

CTextAttribute.prototype.updateField = function (aValue) {
    var sValue;
    if (this.bUseRichText){
        sValue = aValue.replace(/\|/g, "");
        sValue = sValue.replace('<p><br data-mce-bogus="1"></p>', "");
        sValue = sValue.replace("<p></p>", "");
        sValue = sValue.replace("<p><br></p>", "");
        sValue = removeLineBreakInSpecificElement(sValue, "table");
    } else
        sValue = J("#" + this.sId).val();

    CAttributeField.prototype.updateField.call(this, sValue);
}

CTextAttribute.prototype.lock = function (aLocked) {
    CAttributeField.prototype.lock.call(this, aLocked);

    if (!this.bReadOnly) {
        if (this.bUseRichText)
            tinymce.get(this.sId).getBody().setAttribute('contenteditable', !this.bLocked);

        if (this.bLocked){
            J("#" + this.sId).attr("disabled", "disabled");
        } else {
            J("#" + this.sId).removeAttr("disabled");
        }
    }
}

CTextAttribute.prototype.adjustSizeFromParent = function (aInit) {
    var self = this,
        childrens = J("#" + this.sIdDivParent).children();

    if (childrens.length < 2) {
        setTimeout(function () {
            self.adjustSizeFromParent(aInit);
        }, 500);
        return;
    }
    CAttributeField.prototype.adjustSizeFromParent.call(this, aInit);

    var tinyDiv = childrens[0];
        
    J(tinyDiv).css("width", (this.iWidthData));
    J("#" + this.sId + "_ifr").css("height", this.iHeightData);
}