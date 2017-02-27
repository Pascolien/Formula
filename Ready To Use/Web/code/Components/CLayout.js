/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.sPattern : There is some examples here : http://docs.dhtmlx.com/layout__patterns.html *** MANDATORY ***
        aSettings.cellsSettings : the json structure which permit to parameter the layout with : 
            "sIdDivAttach": the div id attach to the layout cell, 
            "sWidth": a number (not required), 
            "sHeight": a number or "*" (not required), 
            "bFixWidth": true/false (not required),  
            "bFixHeight": true/false (not required), 
        aSettings.sImagePath : by default the img path is "'/resources/theme/img/dhtmlx/layout/'"
        aSettings.sParent : by default document.body
        aSettings.onPanelResizeFinish : the javascript function to call when resize layout finish.
 * @returns CLayout object.
 */

var CLayout = function(aSettings){
    checkMandatorySettings(aSettings, ["sPattern"]);

    var sParent = getValue(aSettings.sParent, document.body),
        sImagePath = getValue(aSettings.sImagePath, _url('/resources/theme/img/dhtmlx/layout/'));

    // initialize the layout
    if (aSettings.bAttachToObject) {
        var dhxObject = aSettings.parentObject;
        this.layout = dhxObject.attachLayout(aSettings.sPattern);
    } else {
        this.layout = new dhtmlXLayoutObject(sParent, aSettings.sPattern);
    }
    this.layout.setImagePath(sImagePath);
    this.layout.setEffect("resize", true);
    this.layout._minHeight = 22;
    this.attachedObjects = [];

    //create cells
    if (isAssigned(aSettings.cellsSettings))
        this.initCells(aSettings.cellsSettings);

    if (isAssigned(aSettings.onPanelResizeFinish))
        this.layout.attachEvent("onPanelResizeFinish", aSettings.onPanelResizeFinish);

    this.layout.attachEvent("onCollapse", function (aIdCell) {
        if (isAssigned(aSettings.onCollapse))
            aSettings.onCollapse(aIdCell);

        this.setSizes();
    });

    this.layout.attachEvent("onExpand", function (aIdCell) {
        if (isAssigned(aSettings.onExpand))
            aSettings.onExpand(aIdCell);

        this.setSizes();
    });


}

CLayout.prototype.initCells = function (aCellsParameters) {
    var self = this;

    aCellsParameters.forEach(function (aCell, i) {
        var cell = self.layout.items[i],
			sHeight = getValue(aCell.sHeight,"*");

        cell.setHeight(sHeight);

        if (!isEmpty(aCell.sWidth))
            cell.setWidth(aCell.sWidth);

        if (aCell.bShowHeader == null || !aCell.bShowHeader)
            cell.hideHeader();

		if (!isEmpty(aCell.sHeaderText)) {
            cell.setText(aCell.sHeaderText);
            self.layout.setCollapsedText(cell.getId(), aCell.sHeaderText);
        }
		
        if (aCell.bFixWidth != null && aCell.bFixHeight != null)
            cell.fixSize(aCell.bFixWidth, aCell.bFixHeight);

        if (aCell.sIdDivAttach != null)
            cell.attachObject(aCell.sIdDivAttach);
    });
}

CLayout.prototype.getAttachObject = function (aIdCell) {
    var attachedObject;
    this.attachedObjects.find(function (aObj) {
        if (aObj.idCell == aIdCell) {
            attachedObject = aObj;
            return true;
        }
    });
    return attachedObject;
}

CLayout.prototype.progressOn = function () {
    this.layout.progressOn();
}

CLayout.prototype.progressOff = function () {
    this.layout.progressOff();
}

CLayout.prototype.setAutoSize = function (aIdCellsHor, aIdCellsVer) {
    this.layout.setAutoSize(aIdCellsHor, aIdCellsVer);
}

CLayout.prototype.setSizes = function () {
    this.layout.setSizes();
}

CLayout.prototype.getCellWidth = function (aIdCell) {
    return this.layout.cells(aIdCell).getWidth();
}

CLayout.prototype.setCellWidth = function (aIdCell, aWidth) {
    this.layout.cells(aIdCell).setWidth(aWidth);
}

CLayout.prototype.fixSizes = function (aIdCell, aFixWidth, aFixHeight) {
    this.layout.items[aIdCell].fixSize(aFixWidth, aFixHeight);
}

CLayout.prototype.unload = function () {
    this.layout.unload();
    this.layout = null;
}