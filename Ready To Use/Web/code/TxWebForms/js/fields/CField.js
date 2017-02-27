//class CField

var fdmRead = "fdmRead",
    fdmWrite = "fdmWrite",
    fdmLock = "fdmLock";

function CField(aSettings) {
    this.field = aSettings.field;
    this.iUniqueId = aSettings.iUniqueId;
    this.idTabSelected = aSettings.idTabSelected;
    this.wdow = aSettings.wdow;
    this.wdowDrag = aSettings.wdowDrag;
    this.wdowContainer = aSettings.wdowContainer;
    this.tabbar = aSettings.tabbar;
    this.btnBar = aSettings.btnBar;
    this.parentDiv = J(aSettings.htmlDiv);
    this.fctCheckValidForm = aSettings.fctCheckValidForm;
    this.bTemplate = getValue(aSettings.bTemplate, false);
    this.bValid = true;
    this.bVisible = true;
    this.bDelete = false;
    this.bHasOCG = false;
    this.bUpdate = getValue(this.field.bUpdate, false);
    this.bIgnoreRights = getValue(this.field.bIgnoreRights, false);
    this.bMandatory = getValue(this.field.bMandatory, false);
    this.bFilteredLinks = false;
    this.bLocked = false;
    this.bInFullScreen = false;
    this.bMaxWidth = false; // this attribute is true if the field is a TextAtt or AssoAtt in a group where there is only this kind of components.
    this.idAttribute = parseInt(this.field.ID);
    this.sFirstValue = getFormatedString(aSettings.sDataValue);
    this.sValue = this.sFirstValue;
    this.sName = this.field.sName;
    this.openCloseGroups;
    this.attributeIdsToFilter;
    this.idActiveTabbar = aSettings.idActiveTabbar;
    this.sIdDivParent = getValue(this.parentDiv.attr('id'), getUniqueId());
    this.iParentDivWidth = getValue(this.parentDiv.width(), 0);
    this.iParentDivHeight = getValue(this.parentDiv.height(), 0);
    this.sWidthData = J("#" + this.sIdDivParent).css("width");
    this.iParentDivWidth = (this.iParentDivWidth > 0 && this.bTemplate) ? this.iParentDivWidth : iTxFormComponentsWidth;
    this.iParentDivHeight = (this.iParentDivHeight > 0 && this.bTemplate) ? this.iParentDivHeight : iTxFormComponentsHeight;
    this.bWriteMode = aSettings.bWriteMode;
    this.bInitialized = aSettings.bInitialized;
    this.formTab = aSettings.formTab;
}

CField.prototype.toString = function () {
    return "CField";
}

CField.prototype.unloadComponents = function () {
    if (this.combo)
        this.combo.unload();

    if (this.grid)
        this.grid.unload();
}

CField.prototype.updateFullScreenField = function () {
    //nothing virtual
}

CField.prototype.displayInFullSreen = function (aFullScreen) {
    this.disableInterfaceForFullScreen(aFullScreen);
    if (this.bInFullScreen) {
        J("#" + this.sIdDivParent).css({
            "position": "absolute",
            "top": "0px",
            "left": "0px",
            "z-index": "1",
            "width": "100%",
            "height": "100%",
            "background": "white"
        });
        var iWidth = J("#" + this.sIdDivParent).width();
        J("#" + this.sIdDivParent).css("width", qc(iWidth, "px"));
    } else {
        J("#" + this.sIdDivParent).css({
            "position": "",
            "top": "",
            "left": "",
            "z-index": "",
            "width": this.sWidthData,
            "height": "",
            "background": ""
        });
        if (this.bMaxWidth)
            this.adjustSizeFromParent();
    }
    
}

CField.prototype.disableInterfaceForFullScreen = function (aFullScreen) {
    this.bInFullScreen = getValue(aFullScreen);
    this.tabbar.setAllTabsEnable(!aFullScreen);

    if (this.btnBar)
        this.btnBar.setAllButtonsEnable(!aFullScreen);

    if (!aFullScreen && this.bWriteMode) {
        this.fctCheckValidForm();
    }
}

CField.prototype.show = function () {
    J("#" + this.sIdDivParent).css("display", "block");
}

CField.prototype.hide = function () {
    J("#" + this.sIdDivParent).css("display", "none");
}

CField.prototype.getDataToSave = function () {
    return;
    //virtual abstract
}

CField.prototype.lock = function (aLocked) {
    this.bLocked = getValue(aLocked, true);
}

CField.prototype.adjustSizeFromParent = function (aInit) {
    this.bMaxWidth = true;

    var divGeneric = J("#" + this.sIdDivParent).parent(),
        divLabel = J(divGeneric).children()[0],
        divData = J(divGeneric).children()[1],
        iSize = (getValue(aInit, false) ? 5 : 0);

    if (this.fieldGroup)
        this.iWidthGroupParent = J("#" + this.fieldGroup.sId).width();
    else
        this.iWidthGroupParent = J("#background" + this.idTabSelected + "_" + this.iUniqueId).width() - 20;

    this.iWidthLabel = J(divLabel).width() - iSize;
    this.iWidthData = this.iWidthGroupParent - this.iWidthLabel - 10;
    this.iHeightData = iTxFormComponentsMaxHeight;
    J(divGeneric).css("width", this.iWidthGroupParent);
    J(divLabel).css("width", this.iWidthLabel + "px");
    J(divData).css("width", this.iWidthData + "px");
}

CField.prototype.closeField = function () {
    //nothing
}

CField.prototype.applyMandatoryCss = function (aApply) {
    aApply = getValue(aApply, true);
    //switch the label color to red
    var sColor = aApply ? "red" : getValue(this.sColor, "black");

    if (this.fieldGroup) {
        this.fieldGroup.applyMandatoryCss(this.fieldGroup);
    }
}