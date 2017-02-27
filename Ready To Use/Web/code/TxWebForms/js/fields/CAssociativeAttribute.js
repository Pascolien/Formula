
function CAssociativeAttribute(aSettings) {
    var sIdDivParent = getValue(J(aSettings.htmlDiv).attr('id'), getUniqueId()),
        self = this;

    this.sId = "idDivAsso" + sIdDivParent;
    this.rootObjects = aSettings.rootObjects;

    aSettings.sInput = '<div id="' + this.sId + '" ></div>';
    CAttributeField.call(this, aSettings);

    //update dynamic info
    if (isAssigned(aSettings.dynamicInformations)) {
        aSettings.dynamicInformations.find(function (aDynamicInformation) {
            if (parseInt(aDynamicInformation.idAtt) === self.idAttribute) {
                //manage open close group and filtered links
                self.openCloseGroups = getValue(aDynamicInformation.openCloseGroups, []);
                self.attributeIdsToFilter = getValue(aDynamicInformation.attributeIdsToFilter, []);
                self.bHasOCG = self.openCloseGroups.length > 0;
                self.bFilteredLinks = self.attributeIdsToFilter.length > 0;
                return true;
            }
        });
    }
}

//inheritage
CAssociativeAttribute.prototype = createObject(CAttributeField.prototype);
CAssociativeAttribute.prototype.constructor = CAssociativeAttribute;

CAssociativeAttribute.prototype.toString = function () {
    return "CAssociativeAttribute";
}

CAssociativeAttribute.prototype.initField = function () {
    var self = this,
        sCheckType = this.field.Associativity.bMultiple ? ctCheckboxes : ctRadioboxes,
        idParentFiltering = this.field.Associativity.idParentFiltering,
        idOTRight = this.field.Associativity.idOTRight;

    this.filteredObjects = [];

    this.sWidthLabel = J("#" + this.sIdDivParent).parent("div").children(".GenericLabel").css("width");
    this.sWidthParent = J("#" + this.sIdDivParent).parent("div").css("width");

    if (!isEmpty(this.rootObjects)) {
        this.rootObjects.forEach(function (aObject) {
            if (aObject.ID_OT == idOTRight && getValue(aObject.ID_Parent, 0) == idParentFiltering)
                self.filteredObjects.push({ ID: aObject.ID, bParent: aObject.bParent, bFolder: aObject.bFolder, ID_Parent: aObject.ID_Parent, sName: aObject.sName, iIcon: aObject.iIcon });
        });
    }

    if (this.filteredObjects.length < 1)
        this.filteredObjects = null;

    this.iParentDivHeight = (this.iParentDivHeight > 0 && this.bTemplate) ? this.iParentDivHeight : iTxFormGridsHeight;

    this.grid = new CGridAsso({
        sIdDivGrid: this.sId,
        gridAssoInfo: this.field,
        idObject: this.idObject,
        idAttribute: this.idAttribute,
        filteredObjects: this.filteredObjects,
        sCheckType: sCheckType,
        data: this.field.Data,
        wdowContainer: this.wdowContainer,
        bReadOnly: this.bReadOnly || !this.bWriteMode,
        bIgnoreRights: this.bIgnoreRights,
        bCliquableLinks: !this.bWriteMode,
        iWidth: this.iParentDivWidth,
        iHeight: this.iParentDivHeight,
        sIdDivContainer: this.bTemplate ? null : this.sIdDivParent,
        onAddRow: function () { self.updateField(); },
        onDelRow: function () { self.updateField(); },
        onFullScreen: function (aFullScreen) { self.displayInFullSreen(aFullScreen) }
    });
    this.sHeightData = J("#" + this.sIdDivParent).outerHeight();

    // maj field validity in case of mandatory and data already present.
    if (this.bMandatory) {
        this.bValid = this.grid.hasRowChecked();
    }
}

CAssociativeAttribute.prototype.updateFullScreenField = function () {
    this.grid.displayInFullScreen(true);
}

CAssociativeAttribute.prototype.updateField = function () {
    if (!this.grid)
        return;

    this.bValid = this.bMandatory ? this.grid.hasRowChecked() : true;

    CAttributeField.prototype.updateField.call(this);
}

CAssociativeAttribute.prototype.getDataToSave = function () {
    return this.grid.getSavedData();
}

CAssociativeAttribute.prototype.reload = function (aObjects, aFullOT) {
    this.grid.reloadFilteredLink(aObjects, aFullOT);
}

CAssociativeAttribute.prototype.lock = function (aLocked) {
    CAttributeField.prototype.lock.call(this, aLocked);

    if (!this.bReadOnly)
        this.grid.lock(this.bLocked);
}

CAssociativeAttribute.prototype.adjustSizeFromParent = function (aInit) {
    CAttributeField.prototype.adjustSizeFromParent.call(this, aInit);

    this.grid.iHeight = this.iHeightData;
    this.grid.iWidth = this.iWidthData;
    J("#" + this.grid.sIdDivGrid).css({
        "width": qc(this.iWidthData, "px"),
        "height": qc(this.iHeightData, "px")
    });

    if (this.grid.toolbar)
        J("#" + this.grid.toolbar.sIdDiv).css("width", qc(this.iWidthData - 8, "px"));
}
