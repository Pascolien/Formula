function CQueryTree(aSettings, aCallBackFunction, aDummyData) {
    this.sCheckType = getValue(aSettings.sCheckType, ctCheckboxes);
    this.sIdsChecked = getValue(aSettings.sIdsChecked, "");
    this.sIdsDisabled = getValue(aSettings.sIdsDisabled, "");
    this.bFolderCheckable = getValue(aSettings.bFolderCheckable, true);
    this.iTreeWidth = getValue(aSettings.iTreeWidth, 328);
    this.iTreeHeight = getValue(aSettings.iTreeHeight, 170);
    this.toolbarSettings = aSettings.toolbarSettings;
    this.txObjects = aSettings.txObjects;
    this.sIdLabel = "idLabelQueryTree";
    this.sIdDivTree = "idDivQueryTree";
    this.sIdDivToolbar = isAssigned(this.toolbarSettings) || !isEmpty(this.sIdDivToolbar) ? "idDivQueryToolbar" : "";

    aSettings.iHeight = getValue(aSettings.iHeight, 300);

    CQuery.call(this, aSettings, aCallBackFunction, aDummyData);
}

//inheritage
CQueryTree.prototype = createObject(CQuery.prototype);
CQueryTree.prototype.constructor = CQueryTree;

CQueryTree.prototype.updateHTML = function () {
    CQuery.prototype.updateHTML.call(this);
    this.sHtml = "<div id='" + this.sIdDivTree + "' style='margin-left:6px;margin-top:6px;'></div>" +
        "<div id='" + this.sIdDivToolbar + "' style='margin-left:6px;'></div>";
}

CQueryTree.prototype.updateEvents = function () {
    CQuery.prototype.updateEvents.call(this);

    //init the combo
    this.tree = new CTree({
        sIdDivTree: this.sIdDivTree,
        sIdDivToolbar: this.sIdDivToolbar,
        sCheckType: this.sCheckType,
        sIdsChecked: this.sIdsChecked,
        sIdsDisabled: this.sIdsDisabled,
        bFolderCheckable: this.bFolderCheckable,
        iWidth: this.iTreeWidth,
        iHeight: this.iTreeHeight,
        txObjects: this.txObjects
    });

    J("#" + this.sIdDivTree).css("border", "1px solid #A4BED4 ");
}

CQueryTree.prototype.onClick = function (aInput) {
    this.valueReturned = this.tree.getCheckedNodes();

    CQuery.prototype.onClick.call(this, aInput);
}


