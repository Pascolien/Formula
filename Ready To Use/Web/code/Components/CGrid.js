/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.sIdDivGrid *** MANDATORY ***
        aSettings.sImgPath 
        aSettings.sSkin : "dhx_skyblue" by default.
        aSettings.iWidth,
        aSettings.iHeight,
        aSettings.bHideHeader,
        aSettings.bReadOnly,
        aSettings.bEnableEdition,
        aSettings.cols : Json columns parameters.
            cols = [
                {"sHeader":"", "sWidth":"", sBackgroundColor : "", sColType : "" "sColSorting":"", "sColAlign":""}
            ];
        aSettings.rows : Json columns parameters.
            cols = [
                {data:[]}
            ];
        aSettings.sTxObjects : generic JSON structure, it has to be transform to the dhtmlxCombo need.
        aSettings.txObjects : generic JSON structure, it has to be transform to the dhtmlxCombo need.
        aSettings.sObjects : JSON structure corresponding to a dhtmlxCombo object.
        aSettings.objects : JSON structure corresponding to a dhtmlxCombo object.
        aSettings.onRowSelect : the javascript function to call when a row is selected.
        aSettings.onXLE : the javascript function to call when the grid structure is loaded.
 * @returns CGrid object.
 */

// enum of columnTypes
var ctEd = "ed", //a simple column with editable cells
    ctEdTxt = "edtxt", //a column with editable text cells that treat data values as plain text, so HTML isn't allowed and any special char must be set without escaping
    ctEdN = "edn", //a column with editable numeric cells that allow formatting values through the setNumberFormat method
    ctRo = "ro", //a column with simple read-only cells without the possibility to edit the content
    ctRoTxt = "rotxt", //a column with read-only text cells that treat data values as plain text, so HTML isn't allowed and any special char must be set without escaping
    ctRoN = "ron", //a column with read-only numeric cells that allow formatting values through the setNumberFormat method
    ctTxt = "txt", //a simple column with a multiline editor
    ctTxtTxt = "txttxt", //a column with a multi-line editor that treats data values as plain text, so HTML isn't allowed and any special char must be set without escaping
    ctRa = "ra", //a column-oriented radio button
    ctRaRow = "ra_str", //a row-oriented radio button with this method : mygrid.setRowExcellType("1","ra_str");
    ctCo = "co", //an editable select box
    ctCoro = "coro", //a not editable select box
    ctCombo = "combo", //an editable select box presented by DHTMLX combo
    ctCList = "clist", //a multi- selection select box
    ctCalendar = "dhxCalendar", //a simple date picker (presented by the DHTMLX calendar)
    ctCalendarA = "dhxCalendarA", // a date picker with a possibility to input date manually (presented by the DHTMLX calendar)
    ctCp = "cp",
    ctLink = "link",
    ctImg = "img",
    ctPrice = "price",
    ctDyn = "dyn",
    ctContext = "context",
    ctTree = "stree",
    ctGrid = "grid",
    ctCh = "ch",
    ctTxTree = "txTree",
    ctTxCombo = "txCombo",
    ctTxBoolean = "txBoolean",
    ctTxInput = "txInput";

var csAdded = "csAdded",
    csModified = "csModified",
    csNone = "csNone",
    csDeleted = "csDeleted";

var CGrid = function (aSettings) {
	if (aSettings.sIdDiv)
        aSettings.sIdDivGrid = aSettings.sIdDiv;
    checkMandatorySettings(aSettings, ["sIdDivGrid"]);
    this.grid;
    this.rows = [];
    this.cols = [];
    this.iCount = 1;
    this.fctOnEditCell = aSettings.onEditCell;
    this.fctOnAddRow = aSettings.onAddRow;
    this.fctOnDelRow = aSettings.onDelRow;
    this.iWidth = getValue(aSettings.iWidth, 500);
    this.iHeight = getValue(aSettings.iHeight, 125);
    this.sCssSizeFormat = getValue(aSettings.sCssSizeFormat, "px");
    this.bEnableClickOut = getValue(aSettings.bEnableClickOut, true);
    this.bHideHeader = getValue(aSettings.bHideHeader, false);
    this.sIdDivGrid = aSettings.sIdDivGrid;
    this.bCtrlClicked = false;
    this.bReadOnly = getValue(aSettings.bReadOnly, false);
    this.bLocked = getValue(aSettings.bLocked, false);
    this.bEnableEdition = !this.bReadOnly && getValue(aSettings.bEnableEdition, true);
    this.onFullScreen = aSettings.onFullScreen;
    this.sIdDivContainer = aSettings.sIdDivContainer;
    this.bResizeDivAfterModif = getValue(aSettings.bResizeDivAfterModif, false);

    var sImgPath = getValue(aSettings.sImgPath, _url('/resources/theme/img/dhtmlx/grid/')),
        sSkin = getValue(aSettings.sSkin, 'dhx_skyblue'),
        self = this,
        iMaxWidth = getValue(aSettings.iMaxWidth, 500),
        bEnableRowHover = getValue(aSettings.bEnableRowHover, true),
        bEnableSelection = getValue(aSettings.bEnableSelection, true),
        bEnableAutoWidth = getValue(aSettings.bEnableAutoWidth, true),
        bEnableMultiselection = getValue(aSettings.bEnableMultiselection, true);

    J("#" + this.sIdDivGrid).css({
        width: format("#1#2", [this.iWidth, this.sCssSizeFormat]),
        height: format("#1#2", [this.iHeight, this.sCssSizeFormat])
    });

    this.grid = new dhtmlXGridObject(this.sIdDivGrid);
    this.grid.setImagePath(sImgPath);
    this.grid.setSkin(sSkin);
    this.grid.enableEditEvents(this.bEnableEdition, this.bEnableEdition, this.bEnableEdition);
    this.grid.enableSmartRendering(true);
    this.grid.enableAutoHeight(false);
    if (bEnableAutoWidth)
        this.grid.enableAutoWidth(true, iMaxWidth);
    this.grid.enableMultiselect(bEnableMultiselection);
    this.grid.enableBlockSelection(false);

    if (!bEnableSelection)
        this.grid.setStyle("", "", "", "background: transparent; ");

    if (!bEnableRowHover)
        this.grid.enableRowsHover(true, "");

    if (isAssigned(aSettings.cols))
        this.loadStructure(aSettings.cols, aSettings.rows);

    if (this.bHideHeader)
        this.grid.detachHeader(0);

    if (!isEmpty(aSettings.sTxObjects))
        this.addRows(JSON.parse(aSettings.sTxObjects));
    else if (!isEmpty(aSettings.txObjects))
        this.addRows(aSettings.txObjects);
    else if (!isEmpty(aSettings.sObjects))
        this.doLoad(JSON.parse(aSettings.sObjects));
    else if (!isEmpty(aSettings.objects))
        this.doLoad(aSettings.objects);
    else
        this.loadRoot();

    var bClicked;

    if (this.bEnableClickOut) {
        J("#" + this.sIdDivGrid + " .objbox").unbind("click");
        J("#" + this.sIdDivGrid + " .objbox").click(function () {
            if (!bClicked) {
                self.onClickOut();
                if (!isEmpty(aSettings.onClickOut))
                    aSettings.onClickOut();
            } else
                bClicked = false;
        });
    }

    if (!this.bReadOnly) {
        this.grid.attachEvent("onRowSelect", function () {
            self.onRowSelect();
            bClicked = true;

            if (!isEmpty(aSettings.onRowSelect))
                aSettings.onRowSelect();

            return true;
        });

        this.grid.attachEvent("onXLE", function () {
            self.onXLE();

            if (!isEmpty(aSettings.onXLE))
                aSettings.onXLE();
        });

        this.grid.attachEvent("onEditCell", function (aStep, aIdRow, aIndexCell, aNewValue, aOldValue) {
            var bOk = self.onEditCell(aStep, aIdRow, aIndexCell, aNewValue, aOldValue);

            if (aSettings.onEditCell)
                aSettings.onEditCell(aStep, aIdRow, aIndexCell, aNewValue, aOldValue);

            return bOk;
        });

        this.grid.attachEvent("onSelectStateChanged", function (aIdRow, aIdCell) {
            if (!isEmpty(aSettings.onSelectStateChanged))
                aSettings.onSelectStateChanged(aIdRow, aIdCell);
        });

        this.grid.attachEvent("onRightClick", function (aIdRow, aColIndex, aEvent) {
            self.bCtrlClicked = aEvent.ctrlKey;
            return true;
        });

        this.grid.attachEvent("onCheck", function (aIdRow, aColIndex, aState) {
            self.onCheck(aIdRow, aColIndex, aState);
            if (aSettings.onCheck)
                aSettings.onCheck(aIdRow, aColIndex, aState);
        });

        this.grid.attachEvent("onBeforeSorting", function (aIdRow, aType, aDirection) {
            return !isIE()
        });

        this.grid.attachEvent("onMouseOver", function (aIdRow, aIndexCol) {
            return self.onMouseOver(aIdRow, aIndexCol);
        });

    }

    this.grid.attachEvent("onResizeEnd", function (aGrid) {
        self.onResizeEnd(aGrid);
    });

    this.grid.attachEvent("onAfterSorting", function (aColIndex, aSortingType, aDirection) {
        self.onAfterSorting(aColIndex, aSortingType, aDirection);
    });

    // initialize contextMenu
    if (!isEmpty(aSettings.contextMenuSettings) && !this.bReadOnly) {
        this.contextMenu = new CContextMenu(aSettings.contextMenuSettings);
        this.grid.enableContextMenu(this.contextMenu.getContextMenu());

        this.grid.attachEvent("onBeforeContextMenu", function (aIdRow, aIdCol) {
            self.onBeforeContextMenu(aIdRow, aIdCol);

            if (!isEmpty(aSettings.onBeforeContextMenu))
                aSettings.onBeforeContextMenu(aIdRow, aIdCol);

            return true;
        });
    }

    if (isAssigned(aSettings.toolbarSettings)) {
        //add div according to toolbar
        var dhxToolbar = J("<div id='" + aSettings.toolbarSettings.sIdDivToolbar + "'></div>");
        J("#" + this.sIdDivGrid).after(dhxToolbar);
        J("#" + this.sIdDivGrid).css({ "border-bottom": "0px", width: format("#1px", [this.iWidth]), height: format("#1px", [this.iHeight]) });

        this.toolbar = new CToolbar(aSettings.toolbarSettings);
        J("#" + aSettings.toolbarSettings.sIdDivToolbar).css({
            "width": format("#1px", [(this.iWidth - 8)])
        });
    }

    setTimeout(function () {
        self.iWidthContainer = isAssigned(self.sIdDivContainer) ? J("#" + self.sIdDivContainer).width() : self.iWidth;
    }, 500);
};

CGrid.prototype.toString = function() {
    return "CGrid";
}

CGrid.prototype.getCol = function (aIndexCol) {
    var column;
    this.cols.find(function (aCol, i) {
        if (i == aIndexCol) {
            column = aCol;
            return true;
        }
    });
    return column;
}

CGrid.prototype.getColFromField = function (aField, aValue) {
    var column;
    this.cols.find(function (aCol) {
        if (aCol[aField] == aValue) {
            column = aCol;
            return true;
        }
    });
    return column;
}

CGrid.prototype.getRow = function (aId) {
    var row = this;
    this.rows.find(function (aRow) {
        if (aRow.ID == aId) {
            row = aRow;
            return true;
        }
    });
    return row;
}

CGrid.prototype.getRowIndexFromId = function (aId) {
    var iIndex = 0;
    this.rows.find(function (aRow, i) {
        if (aRow.ID == aId) {
            iIndex = i;
            return true;
        }
    });
    return iIndex;
}

CGrid.prototype.getRowFromAttr = function (aAttr, aValue) {
    var row;
    this.rows.find(function (aRow) {
        if (aRow[aAttr] == aValue) {
            row = aRow;
            return true;
        }
    });
    return row;
}

CGrid.prototype.getCell = function (aIdRow, aIndexColumn) {
    return this.grid.cells(aIdRow, aIndexColumn);
}

CGrid.prototype.loadRoot = function () {
    //virtual abstract
}

CGrid.prototype.loadStructure = function (aCols, aRows) {
    var self = this,
        sHeaders = "",
        sWidths = "",
        sColsSorting = "",
        sColsAlign = "",
        sColTypes = "",
        sColResizingMode = "",
        sBackgroundColors = "",
        headerStyles = [];

    aCols.forEach(function (aCol, i) {
        var col = self.addCol(aCol, i),
            sHeader = getValue(col.sHeader);

        if (!isEmpty(sHeader))
            sHeader = (""+sHeader).replace(/,/g, "\\,") // the "," has to be replace because its the dhtmlxgrid character which permit to separate columns

        headerStyles.push(col.sHeaderStyle);
        sHeaders = qc(sHeaders, sHeader, ',');
        sBackgroundColors = qc(sBackgroundColors, col.sBackgroundColor, ',');
        sColResizingMode = qc(sColResizingMode, col.bAllowResize, ',');
        sWidths = qc(sWidths, col.sWidth, ',');
        sColsSorting = qc(sColsSorting, col.sColSorting, ',');
        sColsAlign = qc(sColsAlign, col.sColAlign, ',');
        sColTypes = qc(sColTypes, col.sColType, ',');
        //col.iIndex = i;
        //self.cols.push(col);
    });

    if (isIE()) {
        sColsSorting = "";
        this.grid.enableStableSorting(true);
    }

    this.setHeader(sHeaders, null, headerStyles);
    this.setInitWidths(sWidths);
    this.setColSorting(sColsSorting);
    this.setColAlign(sColsAlign);
    this.setColTypes(sColTypes);
    this.setColumnColor(sBackgroundColors);
    this.enableResizing(sColResizingMode);
    this.grid.init();

    if (isAssigned(aRows))
        this.reloadFromTxObjects(aRows,true);
}

CGrid.prototype.reloadFromTxObjects = function (aRows, aFirstInit) {
    this.clear();
    this.addRows(aRows, aFirstInit);
}

CGrid.prototype.clear = function () {
    this.iCount = 1;
    this.clearAll();
}

CGrid.prototype.clearAll = function (aClearHeaders) {
    this.rows = [];
    this.grid.clearAll(getValue(aClearHeaders, false));
}

CGrid.prototype.reload = function (aRows) {
    this.clear();
    this.doLoad(JSON.parse(aRows));
}

CGrid.prototype.displayInFullScreen = function (aPressed) {
    var bToolbarAssigned = isAssigned(this.toolbar);

    if (isAssigned(this.onFullScreen))
        this.onFullScreen(aPressed);

    this.iWidthContainer = isAssigned(this.sIdDivContainer) ? J("#" + this.sIdDivContainer).width() : this.iWidth;
    this.iHeightContainer = (isAssigned(this.sIdDivContainer) && aPressed) ? J("#" + this.sIdDivContainer).height() - (bToolbarAssigned ? 28 : 0) : this.iHeight;

    if (bToolbarAssigned)
        J("#" + this.toolbar.sIdDiv).css("width", qc(this.iWidthContainer - 8, "px"));

    if (aPressed)
        this.grid.enableAutoWidth(true, (this.iWidthContainer));
    else
        this.grid.enableAutoWidth(false);

    J("#" + this.sIdDivGrid).css({
        "width": qc(this.iWidthContainer, "px"),
        "height": qc(this.iHeightContainer, "px")
    });
    this.setSizes();
}

CGrid.prototype.addCol = function (aCol, aIndex) {
    aIndex = getValue(aIndex,this.cols.length);
    var col = J.extend({
        sHeaderStyle: getValue(aCol.sHeaderStyle, " "),
        sHeader: getValue(aCol.sHeader, " "),
        sBackgroundColor: getValue(aCol.sBackgroundColor, ""),
        sWidth: getValue(aCol.sWidth, "70"),
        sColSorting: getValue(aCol.sColSorting, "str"),
        sColAlign: getValue(aCol.sColAlign, "center"),
        sColType: getValue(aCol.sColType, ctRo),
        bAllowResize: getValue(aCol.bAllowResize, true),
        iIndex : aIndex
    }, aCol);

    if (col.sColType != ctLink)
        col.sColType = this.bReadOnly ? ctRo : col.sColType;

    this.cols.insert(aIndex, col);

    return col;
}

CGrid.prototype.unload = function () {
    this.grid.destructor();

    if (this.toolbar)
        this.toolbar.unload();
}

// this function is used to add manually rows, not used with initialisation
CGrid.prototype.addRowsJS = function (aRows, aIndex) {
    var rows = this.buildRows(aRows),
        self = this;

    rows.forEach(function (aRow) {
        self.addRow(aRow.id, aRow.data, aRow.iNextSibling, aRow.idParent);
    });
}

CGrid.prototype.cellsToData = function (aIdRow) {
    var self = this,
        row = this.getRow(aIdRow),
        data = [];

    row.cells.forEach(function (aCell) {
        data.push(aCell.sValue);
    });

    return data;
}

CGrid.prototype.addRows = function (aRows, aFirstInit) {
    var rows = this.buildRows(aRows, aFirstInit),
        data = { rows: [] };

    rows.forEach(function (aRow) {
        data.rows.push(aRow);
    });
    this.doLoad(data);
}

CGrid.prototype.buildRows = function (aRows, aFirstInit) {
    var rows = [],
        self = this;

    aFirstInit = getValue(aFirstInit, false);

    aRows.forEach(function (aRow) {
        var iIndex = self.rows.length;
        aRow.ID = getValue(aRow.ID, self.iCount);
        row = {
            id: aRow.ID,
            data: aRow.data,
            iNextSibling: aRow.iNextSibling,
            idParent: aRow.idParent
        }

        if (aRow.iTrueNextSibling)
            iIndex = aRow.iTrueNextSibling;
        else if (aRow.iNextSibling)
            iIndex = self.getRowIndexFromId(aRow.iNextSibling) + 1;

        aRow.cells = [];

        self.cols.forEach(function (aCol) {
            aRow.cells.push(self.addCell("", aFirstInit));
        });

        if (aRow.data.length > 0)
            aRow.data.forEach(function (aData,j) {
                aRow.cells[j].sValue = aData;
                if (aFirstInit)
                    aRow.cells[j].sFirstValue = aData;
            });

        if (!isAssigned(aRow.sAction))
            if (aFirstInit)
                aRow.sAction = dbaNone;
            else
                aRow.sAction = dbaAdd;

        delete aRow.data;
        self.rows.insert(iIndex, aRow);
        rows.push(row);
        self.iCount++;
    });
    return rows;
}

CGrid.prototype.addCell = function (aData, aFirstInit) {
    return {
        sFirstValue: aFirstInit ? aData : "",
        sValue: aData,
        sCellState: aFirstInit ? csNone : csAdded
    }
}

CGrid.prototype.doLoad = function (aRows) {
    this.grid.parse(aRows, "json");
}

CGrid.prototype.addRow = function (aIdRow, aData, aIndex, aIdParent) {
    this.grid.addRow(aIdRow, aData, aIndex, aIdParent);
}

CGrid.prototype.getValues = function () {
    var lines = [],
        self = this;

    this.rows.forEach(function (aRow) {
        var line = [];
        aRow.cells.forEach(function (aCell) {
            var sValue = getValue(aCell.sValue);
            line.push(sValue);
        });
        lines.push(line);
    });

    return lines.transpose();
}

CGrid.prototype.getSelectedRow = function () {
    var self = this,
        rows = [],
        sIds = this.getSelectedRowId(),
        rowIds;

    if (isEmpty(sIds))
        return [];

    rowIds = sIds.split(",");

    rowIds.forEach(function (aId) {
        rows.push(self.getRow(aId));
    });

    return rows;
}

CGrid.prototype.getSelectedRowId = function () {
    return this.grid.getSelectedRowId();
}

CGrid.prototype.isRowSelected = function () {
    return !isEmpty(this.getSelectedRowId());
}

CGrid.prototype.isRowChecked = function (aIdRow, aIndexCheckedCol) {
    return this.grid.cells(aIdRow,getValue(aIndexCheckedCol, 0)).getValue() == 1;
}

CGrid.prototype.isRowHasData = function (aIdRow, aColumnIndexesToExcept) {
    aColumnIndexesToExcept = getValue(aColumnIndexesToExcept, []);
    var row = this.getRow(aIdRow),
        bHasData = false;

    if (!isAssigned(row))
        return bHasData;

    row.cells.forEach(function (aCell, i) {
        if (inArray(aColumnIndexesToExcept, i))
            return;

        if (!isEmpty(aCell.sValue)) {
            bHasData = true;
            return false;
        }
    });

    return bHasData;
}

CGrid.prototype.hasRows = function () {
    return this.rows.length > 0;
}

CGrid.prototype.hasRowChecked = function (aIndexCol) {
    var self = this,
        bRowChecked = false;

    this.rows.find(function (aRow){
        bRowChecked = self.isRowChecked(aRow.ID, aIndexCol);
        return bRowChecked
    });
    return bRowChecked;
}

CGrid.prototype.getSelectedCellIndex = function () {
    return this.grid.getSelectedCellIndex();
};

CGrid.prototype.getColumnsNum = function () {
    return this.grid.getColumnsNum();
}

CGrid.prototype.getRowIndex = function (aIdRow) {
    return this.grid.getRowIndex(aIdRow);
}

CGrid.prototype.getRowIndexExt = function (aIdRow) {
    var iIndex = -1;

    this.rows.find(function (aRow, i) {
        if (aIdRow == aRow.ID) {
            iIndex = i;
            return true;
        }
    });

    return iIndex;
}

CGrid.prototype.getRowsNum = function () {
    return this.grid.getRowsNum();
}

CGrid.prototype.getCheckedRows = function (aIndexColumn) {
    return this.grid.getCheckedRows(aIndexColumn);
}

CGrid.prototype.selectRow = function (aIdRow) {
    this.clearSelection();
    this.selectRowById(aIdRow);
}

CGrid.prototype.selectRowById = function (aIdRow, aPreserve, aShow, aCall) {
    this.grid.selectRowById(aIdRow, aPreserve, aShow, aCall)
}

CGrid.prototype.selectCol = function (aColor,aIdCol) {
    this.clearSelection();
    this.grid.forEachRow(function (aId) {
        this.forEachCell(aId, function (aCellObj, aInd) {
            if (aInd == aIdCol)
                aCellObj.setBgColor(aColor);
            else if (aInd > 0)
                aCellObj.setBgColor('transparent');
        });
    });
}

CGrid.prototype.clearSelection = function () {
    this.grid.clearSelection();
}

CGrid.prototype.selectRowFromIndex = function (aIndex) {
    this.clearSelection();
    this.grid.selectRow(aIndex);
}

CGrid.prototype.insertColumn = function (aIndexFrom, aName, aType, aWidth, aSortingType, aColAlign) {
    var self = this;
    aIndexFrom = getValue(aIndexFrom, this.getColumnsNum());
    aType = getValue(aType, "ed");
    aWidth = getValue(aWidth, 50);
    aSortingType = getValue(aSortingType, "str");
    aColAlign = getValue(aColAlign, "center");

    this.grid.insertColumn(aIndexFrom, aName, aType, aWidth, aSortingType, aColAlign);
    this.grid.forEachRow(function (aIdRow) {
        var row = self.getRow(aIdRow);
        row.cells.insert(aIndexFrom, self.addCell("",true));
    });

    this.addCol({ sHeader: aName, sColType: aType }, aIndexFrom);

    this.setSizes();
}

CGrid.prototype.deleteColumn = function (aIdCol) {
    var self = this;
    this.grid.forEachRow(function (aIdRow) {
        var row = self.getRow(aIdRow);
        row.sAction = dbaModif;
        row.cells.splice(aIdCol, 1);
    });

    this.cols.splice(aIdCol, 1);

    this.grid.deleteColumn(aIdCol);
    if (isAssigned(this.fctOnEditCell))
        this.fctOnEditCell(this.rows);
}

CGrid.prototype.setSizes = function () {
    this.grid.setSizes();

    if (this.bResizeDivAfterModif) {
        //it's reexecuted because if there is not enaugh columns in fullscreen mode the grid seems not to be in fullScreen mode. 
        this.grid.enableAutoWidth(true, getValue(this.iWidthContainer, this.iWidth));
        J("#" + this.sIdDivGrid).css({
            "width": qc(getValue(this.iWidthContainer,this.iWidth), "px"),
            "height": qc(getValue(this.iHeightContainer, this.iHeight), "px")
        });
    }
};

CGrid.prototype.setColWidth = function (aIdRow,aWidth){
    this.grid.setColWidth(aIdRow, aWidth);
};

CGrid.prototype.setColumnColor = function (aColors) {
    this.grid.setColumnColor(aColors);
}

CGrid.prototype.setColumnsVisibility = function (aList) {
    this.grid.setColumnsVisibility(aList);
}

CGrid.prototype.setColumnHidden = function (aIndexCol, aHidden) {
    this.grid.setColumnHidden(aIndexCol, getValue(aHidden, true));
}

CGrid.prototype.setCheckedRows = function (aIdColumn, aChecked) {
    this.grid.setCheckedRows(aIdColumn, aChecked);
}

CGrid.prototype.setHeader = function (aHeader, aSplitSign, sHeaderStyles) {
    this.grid.setHeader(aHeader, aSplitSign, sHeaderStyles);
}

CGrid.prototype.setNewColLabel = function (aColIndex, aLabel) {
    this.grid.setColLabel(aColIndex, aLabel);
}

CGrid.prototype.setInitWidths = function (aWidths) {
    this.grid.setInitWidths(aWidths);
}

CGrid.prototype.setColSorting = function (aColsSorting) {
    this.grid.setColSorting(aColsSorting);
}

CGrid.prototype.setColAlign = function (aColsAlign) {
    this.grid.setColAlign(aColsAlign);
}

CGrid.prototype.setColTypes = function (aColTypes) {
    this.grid.setColTypes(aColTypes);
}

CGrid.prototype.setCellTextStyle = function (aRowId, aColIndex, aStyle) {
    this.grid.setCellTextStyle(aRowId, aColIndex, aStyle);
}

CGrid.prototype.setCellValue = function (aIdRow, aIndexColumn, aValue) {
    var row = this.getRow(aIdRow),
        cell = row.cells[aIndexColumn];

    cell.sValue = aValue;

    if (aValue == cell.sFirstValue)
        cell.sCellState = csNone;
    else if (isEmpty(aValue)) {
        if (!isEmpty(cell.sFirstValue))
            cell.sCellState = csDeleted;
    } else if (!isEmpty(cell.sFirstValue))
        cell.sCellState = csModified;
    else
        cell.sCellState = csAdded;

    var dhxCell = this.getCell(aIdRow, aIndexColumn);
    dhxCell.setValue(aValue);

    return cell;
}

CGrid.prototype.clearColValues = function (aIdCol) {
    var self = this;
    this.grid.forEachRow(function (aIdRow) {
        this.forEachCell(aIdRow, function (aCellObj, aInd) {
            if (aInd === aIdCol) {
                var row = self.getRow(aIdRow);
                row.sAction = dbaModif;
                row.cells[aIdCol].sValue = "";
                aCellObj.setValue("");
            }
        });
    });
}

CGrid.prototype.deleteRow = function (aIdRow, aRealDelete) {
    aRealDelete = getValue(aRealDelete, true);

    if (aRealDelete) {
        var iRowIndex = this.getRowIndexFromId(aIdRow);
        this.rows.splice(iRowIndex, 1);
    } else {
        var row = this.getRow(aIdRow);
        row.sAction = dbaDel;
    }
    this.grid.deleteRow(aIdRow);
    if (isAssigned(this.fctOnEditCell))
        this.fctOnEditCell(this.rows);
}

CGrid.prototype.clearRowValues = function (aIdRow, aExceptCols) {
    var row = this.getRow(aIdRow);
    row.sAction = dbaDel;

    this.grid.forEachCell(aIdRow, function (aCellObj, aIdCol) {
        if (!inArray(aExceptCols, aIdCol)) {
            row.cells[aIdCol].sValue = "";
            aCellObj.setValue("");
        }
    });

    if (isAssigned(this.fctOnEditCell))
        this.fctOnEditCell(this.rows);
}

CGrid.prototype.clearAllRowsValues = function (aExceptCols) {
    var self = this;
    this.grid.forEachRow(function (aIdRow) {
        self.clearRowValues(aIdRow, aExceptCols);
    });
}

CGrid.prototype.cleanRows = function () {
    var self = this,
        rowsIdToDelete = [];
    //delete rows unchecked and without data
    this.rows.forEach(function (aRow) {
        if (!self.isRowChecked(aRow.ID) && (!self.isRowHasData(aRow.ID, [0, 1])))
            rowsIdToDelete.push(aRow.ID);
    });

    rowsIdToDelete.forEach(function (aIdRow) {
        self.deleteRow(aIdRow);
    });
}

CGrid.prototype.findCell = function (aValue, aColIndex, aFirst) {
    return this.grid.findCell(aValue, aColIndex, aFirst);
}

CGrid.prototype.enableResizing = function (aColsResizingMode) {
    this.grid.enableResizing(aColsResizingMode);
}

CGrid.prototype.lock = function (aLocked) {
    var self = this;
    this.bLocked = getValue(aLocked, true);

    if (this.bLocked)
        this.grid.enableEditEvents(false, false, false);
    else
        this.grid.enableEditEvents(this.bEnableEdition, this.bEnableEdition, this.bEnableEdition);

    if (isAssigned(this.toolbar))
        this.toolbar.setEnableAllBtns(!this.bLocked);
}

CGrid.prototype.lockRow = function (aId, aLocked) {
    this.grid.lockRow(aId, getValue(aLocked, true));
}

CGrid.prototype.serializeToCSV = function (aTextOnly) {
    return this.grid.serializeToCSV(getValue(aTextOnly, true));
}

/* events */
CGrid.prototype.onXLE = function () {
    this.setSizes();
}

CGrid.prototype.onEditCell = function (aStep, aIdRow, aIndexCell, aNewValue, aOldValue) {
    if (this.bLocked)
        return false;

    var self = this;
    switch (aStep) {
        case 0: //before start

            break;
        case 1: //the editor is opened

            break;
        case 2: //the editor is closed
            row = this.getRow(aIdRow);
            row.sAction = dbaModif;
            //column = this.getCol(aIndexCell);

            //switch (column.sColType) {
            //    case ctTxTree:
            //        sIdObjects = "";
            //        if (!isEmpty(row.data[aIndexCell])) {
            //            if (inArrayFromField(row.txData, "idAttribute", column.idAttribute))
            //                sIdObjects = row.txData();
            //        }

            //        new CQueryTreeObject({
            //            idOT: column.idOT,
            //            sIdsChecked: sIdObjects
            //        }, function (aId, aValue, aDummyData) {
            //            if (aId == sOk)
            //                self.onAfterEditCell(column, row, aIndexCell, aValue);
            //        });
            //        break;
            //}

            //if (row.data.length < aIndexCell) {
            //    for (var i = 0 ; i < aIndexCell ; i++) {
            //        if (!isAssigned(row.data[i]))
            //            row.data[i] = "";
            //    }
            //}

            this.setCellValue(aIdRow, aIndexCell, aNewValue);

            if (isAssigned(this.fctOnEditCell))
                this.fctOnEditCell(this.rows);
            break;
    }

    return true;
}

CGrid.prototype.onClickOut = function () {
    this.clearSelection();
}

CGrid.prototype.onRowSelect = function () {
    //virtual abstract
}

CGrid.prototype.onCheck = function (aIdRow, aColIndex, aState) {
    this.setCellValue(aIdRow, aColIndex, aState);
}

CGrid.prototype.onMouseOver = function (aIdRow, aIndexCol) {
    return true;
}

CGrid.prototype.onResizeEnd = function (aGrid) {
    this.setSizes();
}

CGrid.prototype.onAfterSorting = function (aGrid) {
    this.setSizes();
}

/*Cutoms colTypes*/
CGrid.prototype.onAfterEditCell = function (aCol, aRow, aIndexCell, aValue) {

}

function eXcell_txTree(aCell) { //the eXcell name is defined here
    if (aCell) {                //the default pattern, just copy it
        this.cell = aCell;
        this.grid = this.cell.parentNode.grid;
        eXcell_ed.call(this); //uses methods of the "ed" type
    }
}
eXcell_txTree.prototype = new eXcell;

function eXcell_txBoolean(aCell) { //the eXcell name is defined here
    if (aCell) {                //the default pattern, just copy it
        this.cell = aCell;
        this.grid = this.cell.parentNode.grid;
        eXcell_ed.call(this); //uses methods of the "ed" type
    }
}
eXcell_txBoolean.prototype = new eXcell;