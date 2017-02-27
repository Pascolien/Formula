function CQueryTreeObject(aSettings, aCallBackFunction, aDummyData) {
    this.idOT = aSettings.idOT;
    this.idParentFiltering = aSettings.idParentFiltering;
    this.checkedObjects = aSettings.checkedObjects;
    this.toolbarSettings = aSettings.toolbarSettings;
    this.bEnableContextMenu = getValue(aSettings.bEnableContextMenu, false);
    
    this.sIdLabel = "idLabelQueryTreeObject";
    this.sIdDivTree = "idDivQueryTreeObject";
    this.sIdDivToolbar = "idDivQueryToolbar";

    CQueryTree.call(this, aSettings, aCallBackFunction, aDummyData);
}

//inheritage
CQueryTreeObject.prototype = createObject(CQueryTree.prototype);
CQueryTreeObject.prototype.constructor = CQueryTreeObject;

CQueryTreeObject.prototype.updateEvents = function () {
    CQuery.prototype.updateEvents.call(this);

    //init the combo
    this.tree = new CTreeObject({
        idOT: this.idOT,
        idParentFiltering: this.idParentFiltering,
        checkedObjects: this.checkedObjects,
        sIdDivTree: this.sIdDivTree,
        sIdDivToolbar: this.sIdDivToolbar,
        sIdDivToolbar: this.sIdDivToolbar,
        sCheckType: this.sCheckType,
        sIdsChecked: this.sIdsChecked,
        bFolderCheckable: this.bFolderCheckable,
        bEnableContextMenu: this.bEnableContextMenu,
        iWidth: this.iTreeWidth,
        iHeight: this.iTreeHeight,
        txObjects: this.txObjects
    });

    J("#" + this.sIdDivTree).css("border", "1px solid #A4BED4 ");
}

