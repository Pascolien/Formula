function CQueryGrid(aSettings, aCallBackFunction, aDummyData) {
    this.iGridWidth = getValue(aSettings.iGridWidth, 310);
    this.iGridHeight = getValue(aSettings.iGridHeight, 215);
    this.bEnableMultiselection = getValue(aSettings.bEnableMultiselection, false);
    this.cols = aSettings.cols;
    this.rows = aSettings.rows;
    this.sIdLabel = "idLabelQueryGrid";
    this.sIdDivGrid = "idDivQueryGrid";
    this.bHideHeader = false;

    if (!this.cols) {
        this.cols = [{ sHeader: "", sWidth: "309px", sColAlign: "left" }];
        this.bHideHeader = true;
    }

    aSettings.iHeight = getValue(aSettings.iHeight, 300);

    CQuery.call(this, aSettings, aCallBackFunction, aDummyData);
}

//inheritage
CQueryGrid.prototype = createObject(CQuery.prototype);
CQueryGrid.prototype.constructor = CQueryGrid;

CQueryGrid.prototype.updateHTML = function () {
    this.sHtml = "<div id='" + this.sIdDivGrid + "' style='margin-left:6px;margin-top:6px;'></div>";
}

CQueryGrid.prototype.updateEvents = function () {
    CQuery.prototype.updateEvents.call(this);

    //init the combo
    this.grid = new CGrid({
        sIdDivGrid: this.sIdDivGrid,
        iWidth: this.iGridWidth,
        iHeight: this.iGridHeight,
        txObjects: this.rows,
        bEnableMultiselection: this.bEnableMultiselection,
        bHideHeader: this.bHideHeader,
        cols: this.cols
    });
}

CQueryGrid.prototype.onClick = function (aInput) {
    this.valueReturned = this.grid.getSelectedRow();

    CQuery.prototype.onClick.call(this, aInput);
}


