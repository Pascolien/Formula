/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        <aSettings from CGrid>
        aSettings.idAttribute,
        aSettings.idObject,
        aSettings.serieType,
        aSettings.data,
        aSettings.wdowContainer,
        aSettings.bDisplayToolbar,
        aSettings.onArrayImportDisplayed,
        aSettings.onArrayImportClosed,

 * @returns CGridArray object.
 */
var optAddCol = "optAddCol",
    optInsertCol = "optInsertCol",
    optClearCol = "optClearCol",
    optRemoveCol = "optRemoveCol",
    optAddSerie = "optAddSerie",
    optInsertSerie = "optInsertSerie",
    optDuplicateSerie = "optDuplicateSerie",
    optClearSerie = "optClearSerie",
    optRemoveSerie = "optRemoveSerie";

var btnDeleteTable = "btnDeleteTable",
    btnImportTable = "btnImportTable",
    btnExportTable = "btnExportTable";

var CGridArray = function (aSettings) {

    this.attr = aSettings.attr;
    this.idAttribute = this.attr ? this.attr.ID : aSettings.idAttribute;
    this.data = this.attr ? this.attr.Data : aSettings.data;
    this.serieType = this.attr ? this.attr.TableType : aSettings.serieType;
    this.idObject = getValue(aSettings.idObject, 0);
    this.bDisplayToolbar = getValue(aSettings.bDisplayToolbar, true);
    this.sFirstColumnColor = "#A4BED4";
    this.sColumnColor = "#FFF1CC";
    this.onArrayImportDisplayed = aSettings.onArrayImportDisplayed;
    this.onArrayImportClosed = aSettings.onArrayImportClosed;
    this.wdowContainer = aSettings.wdowContainer;
    this.bGrapher = this.serieType ? this.serieType.iGrapher == 1 : false;
    this.bDisplayIndexes = this.attr ? this.attr.bDisp_Indexes : getValue(aSettings.bDisplayIndexes, true);
    this.bDisplaySerieName = this.attr ? this.attr.bDisp_SN : getValue(aSettings.bDisplaySerieName, false);
    this.bTranspose = this.attr ? this.attr.bTranspose : getValue(aSettings.bTranspose, false);

    var self = this,
        iHeightTemp = getValue(aSettings.iHeight, 0);

    aSettings.iHeight = (iHeightTemp > 0 ? iHeightTemp - 27 : aSettings.iHeight);
    aSettings.bEnableRowHover = false;
    aSettings.bEnableMultiselection = false;
    aSettings.bEnableSelection = false;
    aSettings.bEnableAutoWidth = false;
    aSettings.bResizeDivAfterModif = true;
    aSettings.onBeforeContextMenu = function () { self.onBeforeContextMenu };
    aSettings.contextMenuSettings = {
        sIdDivContextMenu: aSettings.sIdDivGrid,
        options: [
            { sId: optAddCol, sName: _("Ajouter une colonne") },
            { sId: optInsertCol, sName: _("Insérer une colonne"), bAddSeparator: true },
            { sId: optClearCol, sName: _("Effacer la colonne") },
            { sId: optRemoveCol, sName: _("Supprimer la colonne") },
            { sId: optAddSerie, sName: _("Ajouter une Série") },
            { sId: optInsertSerie, sName: _("Insérer une Série") },
            { sId: optDuplicateSerie, sName: _("Dupliquer une Série"), bAddSeparator: true },
            { sId: optClearSerie, sName: _("Effacer la Série") },
            { sId: optRemoveSerie, sName: _("Supprimer la Série") }
        ],
        onClick: function (aIdOption, aContextZone, aKeysPressed) { self.contextMenuOnClick(aIdOption, aContextZone, aKeysPressed); },
        onBeforeContextMenu: function (aContextZone, aEvent) { self.contextMenuOnBeforeContextMenu(aContextZone, aEvent); }
    }

    if (this.bDisplayToolbar) {
        var self = this,
            bHideButtonFullScreen = !isAssigned(aSettings.sIdDivContainer);

        aSettings.toolbarSettings = {
            sIdDivToolbar: aSettings.sIdDivGrid + "dhxToolbar",
            btns: [
                { sId: btnDeleteTable, iBtnType: tbtSimple, sHint: _("Supprimer la Donnée"), sImgEnabled: "../btn_form/16x16_false.png" },
                { sId: btnImportTable, iBtnType: tbtSimple, sHint: _("Importer un tableau de Données..."), sImgEnabled: "../btn_form/save_html_editor.png" },
                // btn hidden because we have to save data before export, so the export functionality is only available in read form.
                { sId: btnExportTable, iBtnType: tbtSimple, sHint: _("Exporter les Données au format Excel ou tsv"), sImgEnabled: "../btn_form/16x16_exportation.png", bAddSpacer: !bHideButtonFullScreen },
                { sId: btnFullScreen, iBtnType: tbtTwoState, sHint: _("Plein écran"), sImgEnabled: "fullscreen.png", bHide: bHideButtonFullScreen }
            ],
            onClick: function (aId) { self.toolbarOnClick(aId) },
            onStateChange: function (aId, aPressed) { self.toolbarOnStateChange(aId, aPressed) }
        };
    }

    if (!aSettings.bReadOnly) {
        this.bDisplayIndexes = true;
        this.bDisplaySerieName = true;
        this.bTranspose = false;
    }
    CGrid.call(this, aSettings);

    if (!this.bDisplayIndexes)
        if (this.bTranspose)
            this.setColumnHidden(0);
        else
            this.grid.detachHeader(0);

    if (this.bReadOnly && this.bDisplayToolbar) {
        //disable some buttons
        this.toolbar.hideBtns([btnDeleteTable, btnImportTable])
    }

    this.grid.enableLightMouseNavigation(true);
    this.grid.enableRowsHover(false);
    this.iLastColSelected = 0;
}

//inheritage
CGridArray.prototype = createObject(CGrid.prototype);
CGridArray.prototype.constructor = CGridArray;

CGridArray.prototype.toString = function() {
    return "CGridArray";
}

CGridArray.prototype.loadRoot = function () {
    var self = this;

    if (isAssigned(this.serieType)) {
        this.fillGrid(this.serieType, this.data);
    } else {
        J.ajax({
            url: sPathFileComponentsAjax,
            async: false,
            cache: false,
            data: {
                sFunctionName: "getDataTableAndTableType",
                idObject: this.idObject,
                idAttribute: this.idAttribute
            },
            success: function (aResult) {
                var results = aResult.split("|");
                if (results[0] == sOk) {
                    self.serieType = JSON.parse(results[1]);
                    if (results.length > 2)
                        self.data = JSON.parse(results[2]);

                    self.fillGrid(self.serieType, self.data);
                } else
                    msgWarning(results[0]);
            }
        });
    }
}

CGridArray.prototype.fillGrid = function (aSerieTypes, aData, aClearAll, aAction) {
    aClearAll = getValue(aClearAll, false);
    aAction = getValue(aAction, dbaNone);
    if (!isAssigned(aSerieTypes.SeriesType))
        throw msgWarning(format(_("Il n'y a pas de type de série pour le tableau '#1'."), [aSerieTypes.sName]));

    var cols = [{ sHeader: _("Séries"), sBackgroundColor: this.sFirstColumnColor }, { sHeader: _("Nom"), sColType: ctEd }],
        rows = [],
        iNumberValue = 1;

    if (isAssigned(aData)) {
        aSerieTypes.SeriesType.forEach(function (aSerieType) {
            if (aSerieType.ID == 0)
                return;

            var sUnitValue = isAssigned(aSerieType.jUnit) ? format("[#1]", [aSerieType.jUnit.sName]) : "",
                sName = [qc(aSerieType.sName, sUnitValue, " ")],
                bAddedRow = false;

            aData.Series.forEach(function (aSerie) {
                if (!aSerie.SeriesTypes)
                    return;
                if (aSerieType.ID == aSerie.SeriesTypes.ID) {
                    iNumberValue = iNumberValue < parseInt(aSerie.Values.length) ? parseInt(aSerie.Values.length) : iNumberValue;
                    var sUnitValue = isAssigned(aSerie.SeriesTypes.jUnit) ? format("[#1]", [aSerie.SeriesTypes.jUnit.sName]) : "",
                        data = [qc(aSerie.SeriesTypes.sName, sUnitValue, " ")],
                        sName = getValue(aSerie.sName);

                    data.push(sName);

                    aSerie.Values.forEach(function (aValue) {
                        data.push(aValue.sName);
                    });
                    rows.push({ data: data, Serie: aSerie, SeriesTypes: aSerie.SeriesTypes });
                    bAddedRow = true;
                }
            });

            if (!bAddedRow)
                rows.push({ data: sName, SeriesTypes: aSerieType, sAction: aAction });
        });

        for (var i = 0 ; i < iNumberValue ; i++) {
            cols.push({ sHeader: i + 1, sWidth: 50, sColAlign: "center", sHeaderStyle: "text-align:center", sColType: ctEd });
        }
    } else {
        cols.push({ sHeader: iNumberValue, sColType: ctEd });
        aSerieTypes.SeriesType.forEach(function (aSerieType) {
            var sUnitValue = isAssigned(aSerieType.jUnit) ? format("[#1]",[aSerieType.jUnit.sName]) : "",
                sName = [qc(aSerieType.sName, sUnitValue, " ")];

            rows.push({ data: sName, SeriesTypes: aSerieType, sAction : aAction });
        });
    }
    this.grid.enableLightMouseNavigation(true);

    if (aClearAll)
        this.clearAll(true);

    //manage transposition
    if (this.bTranspose) {
        this.transposeData(cols, rows);
        return;
    }

    //resize cols
    this.resizeCols(cols, rows);
    
    //remove serie name column
    if (!this.bDisplaySerieName) {
        cols.splice(1, 1);
        rows.forEach(function (aRow) {
            aRow.data.splice(1, 1);
        });
    }

    this.loadStructure(cols, rows);
}

CGridArray.prototype.resizeCols = function (aCols, aRows) {
    aCols.forEach(function (aCol, i) {
        var iColSize = parseInt(getValue(aCol.sWidth, parseInt(getStringLength(getValue(aCol.sHeader))))) + (i > 1 ? 30 : 20);

        aRows.forEach(function (aRow) {
            var sData = aRow.data[i],
                iDataSize = 0;

            if (!isEmpty(sData)) {
                iDataSize = getStringLength(sData);
            }

            if (iDataSize > iColSize)
                iColSize = iDataSize;
        });
        aCol.sWidth = iColSize;
    });
}

CGridArray.prototype.getSerieType = function(aName){
    var serieType;
    this.serieType.SeriesType.find(function (aSerieType) {
        var sUnitValue = isAssigned(aSerieType.jUnit) ? format("[#1]", [aSerieType.jUnit.sName]) : "",
            sName = [qc(aSerieType.sName, sUnitValue, " ")];

        if (sName == aName) {
            serieType = aSerieType;
            return true;
        }
    });
    return serieType;
}

CGridArray.prototype.transposeData = function (aCols, aRows) {
    var colsTmp = [],
        rowsTmp = [];
    
    //build header
    colsTmp.push({ sHeader: " ", sWidth: 10, sColType: ctRo, sBackgroundColor: this.sFirstColumnColor });
    aRows.forEach(function (aRow) {
        var sHeader = aRow.data[0];
        colsTmp.push({ sHeader: sHeader, sWidth: getStringLength(sHeader) + 10, sColType: ctRo });
    });

    //fill rows
    aCols.forEach(function (aCol, i) {
        if (i == 0)
            return;
        var data = [];

        colsTmp.forEach(function () {
            data.push("");
        });
        data[0] = aCol.sHeader;

        aRows.forEach(function (aRow, j) {
            data[j + 1] = aRow.data[i];
        });

        rowsTmp.push({ data: data });
    });

    this.resizeCols(colsTmp, rowsTmp);
    //remove serie name row
    if (!this.bDisplaySerieName)
        rowsTmp.splice(0, 1);

    this.loadStructure(colsTmp, rowsTmp);
}

/*grid manipulation*/
CGridArray.prototype.insertColumnExt = function () {
    this.insertColumn(this.iLastColSelected, "" + (this.getColumnsNum() - 1));
    this.refreshColsName();
}

CGridArray.prototype.refreshColsName = function () {
    for (var i = 2 ; i < this.getColumnsNum() ; i++) {
        this.grid.setColLabel(i, "" + (i - 1));
    }
}

CGridArray.prototype.clearCol = function (aIdCol) {
    this.clearColValues(aIdCol);
    if (this.fctOnDelRow)
        this.fctOnDelRow();
}

CGridArray.prototype.removeCol = function (aIdCol) {
    var self = this;

    if (aIdCol == 2 && this.getColumnsNum() < 4) {
        // clear the third column
        this.clearCol(aIdCol);
    } else {
        this.deleteColumn(aIdCol);
        this.refreshColsName();
        if (this.fctOnDelRow)
            this.fctOnDelRow();
    }
}

CGridArray.prototype.clearRow = function (aIdRow) {
    this.clearRowValues(aIdRow,[0]);
    if (this.fctOnDelRow)
        this.fctOnDelRow();
}

CGridArray.prototype.removeRow = function (aIdRow) {
    this.deleteRow(aIdRow, false);

    if (this.fctOnDelRow)
        this.fctOnDelRow();
}

CGridArray.prototype.addSerie = function (aInsert, aDuplicate) {
    aInsert = getValue(aInsert, false);
    aDuplicate = getValue(aDuplicate, false);

    var rows = [],
        self = this,
        selectedRow = this.getSelectedRow()[0],
        sSerieName = selectedRow.cells[0].sValue,
        idSerieType = selectedRow.SeriesTypes.ID,
        iNextSibling = 0,
        iTrueNextSibling = 0,
        data = aDuplicate ? this.cellsToData(selectedRow.ID) : [sSerieName];

    if (aInsert){
        iNextSibling = this.getRowIndex(selectedRow.ID);
        iTrueNextSibling = this.getRowIndexExt(selectedRow.ID);
    } else {
        this.grid.forEachRow(function (aIdRow) {
            var row = self.getRow(aIdRow);
            if (row.SeriesTypes.ID == idSerieType) {
                var iNextSiblingTmp = self.getRowIndex(aIdRow),
                    iTrueNextSiblingTmp = self.getRowIndexExt(aIdRow);
                if (iNextSibling < iNextSiblingTmp)
                    iNextSibling = iNextSiblingTmp;

                if (iTrueNextSibling < iTrueNextSiblingTmp)
                    iTrueNextSibling = iTrueNextSiblingTmp;
            }
        });
        iNextSibling++;
        iTrueNextSibling++;
    }

    rows.push({ data: data, SeriesTypes: selectedRow.SeriesTypes, bAdded: true, iNextSibling: iNextSibling, iTrueNextSibling: iTrueNextSibling });
    this.addRowsJS(rows);
    this.setCellTextStyle((this.iCount - 1), 0, format("background:#1;", [this.sFirstColumnColor]));

    if (this.fctOnAddRow)
        this.fctOnAddRow();
}

CGridArray.prototype.getCurrentData = function () {
    var data = { Series: [] };

    this.rows.find(function (aRow) {
        if (aRow.cells.length < 2)
            return false;

        var bAddRow = !isEmpty(aRow.cells[1].sValue),
            values = [];

        aRow.cells.find(function (aValue, j) {
            if (j < 2)
                return false;

            var sValue = aValue.sValue;
            values.push({ sName: sValue });

            if (isEmpty(sValue) || sValue === " ") {
                //if (!bAddRow)
                //    bAddRow = false;
            } else
                bAddRow = true;
        });

        if (bAddRow)
            data.Series.push({ sName: aRow.cells[1].sValue, SeriesTypes: aRow.SeriesTypes, Values: values });
    });

    return data;
}

CGridArray.prototype.getData = function (aData) {
    var self = this,
        data = { Series: [] };

    aData.forEach(function (aValues) {
        var sSerieTypeName = aValues[0],
            sSerieName = aValues[1],
            serieType = self.getSerieType(sSerieTypeName);

        aValues.splice(0, 2);
        var values = [];

        var bAddRow = (!isEmpty(sSerieName) && sSerieName != " ");
        aValues.forEach(function (aValue) {
            values.push({ sName: aValue });
        });
        if (!bAddRow) {
            aValues.forEach(function (aValue) {
                if (isEmpty(aValue) || aValue === " ") {
                    //bAddRow = false;
                } else
                    bAddRow = true;
            });
        }

        if (bAddRow)
            data.Series.push({ sName: sSerieName, SeriesTypes: serieType, Values: values });
    });

    return data;
}

CGridArray.prototype.getSeries = function () {
    var self = this,
        series = [];

    this.rows.forEach(function (aRow) {
        var values = [];

        aRow.cells.find(function (aCell, j) {
            if (j < 2)
                return false;
            values.push(aCell.sValue);
        });
        series.push({
            sName: aRow.cells[1].sValue,
            SeriesTypes: aRow.SeriesTypes,
            Values: values
        });
    });

    return series;
}

/*toolbar buttons*/
CGridArray.prototype.toolbarOnClick = function (aIdBtn) {
    switch (aIdBtn) {
        case btnDeleteTable:
            this.clearArray();
            break;
        case btnImportTable:
            this.importArray();
            break;
        case btnExportTable:
            this.exportArray();
            break;
    }
}

CGridArray.prototype.toolbarOnStateChange = function (aId, aPressed) {
    switch (aId) {
        case btnFullScreen:
            this.displayInFullScreen(aPressed);
            break;
    }
}

CGridArray.prototype.clearArray = function () {
    this.fillGrid(this.serieType, null, true, dbaDel);
    if (this.fctOnEditCell)
        this.fctOnEditCell("");

    if (this.fctOnDelRow)
        this.fctOnDelRow();
}

CGridArray.prototype.importArray = function () {
    var self = this;

    if (isAssigned(this.onArrayImportDisplayed))
        this.onArrayImportDisplayed();

    this.txImportArray = new CTxImportArray({
        idAttribute: this.idAttribute,
        serieType: this.serieType,
        wdowContainer : this.wdowContainer,
        onValidate: function (aData) {
            self.cols = [];
            self.fillGrid(self.serieType, aData, true, dbaModif);
            if (self.fctOnAddRow)
                self.fctOnAddRow();
        },
        onClose: function (aData) {
            if (isAssigned(self.onArrayImportClosed))
                self.onArrayImportClosed();
        },
    });
}

CGridArray.prototype.exportArray = function () {
    J.ajax({
        url: sPathFileComponentsAjax,
        async: false,
        cache: false,
        type:"post",
        data: {
            sFunctionName: "ExportTable",
            idObject: this.idObject,
            idAtt: this.idAttribute,
            sData : JSON.stringify(this.getDataToSave())
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                var sFileName = results[1];
                downloadFile(sFileName);
            } else
                msgWarning(results[0]);
        }
    });
}

/* events */
CGridArray.prototype.onXLE = function () {
    var self = this;
    this.setColumnColor(this.sFirstColumnColor);
    this.grid.forEachRow(function (aId) {
        this.forEachCell(aId, function (aCellObj, aInd) {
            if (aInd == 0)
                aCellObj.setBgColor(self.sFirstColumnColor);
        });
    });
    if (this.fctOnEditCell)
        this.fctOnEditCell(this.rows);
}

CGridArray.prototype.onEditCell = function (aStep, aIdRow, aIndexCell, aNewValue, aOldValue) {
    if (this.bLocked)
        return false;
    if (aStep == 2) {
        var row = this.getRow(aIdRow),
            bNumerical = row.SeriesTypes.bNumerical && aIndexCell != 1;

        if (bNumerical && !isNumber(aNewValue)) {
            msgWarning(format(_("La valeur de cette cellule '#1' n'est pas une valeur numérique."), [aNewValue]));
            return false;
        } else
            CGrid.prototype.onEditCell.call(this, aStep, aIdRow, aIndexCell, aNewValue, aOldValue);

        if (this.fctOnAddRow)
            this.fctOnAddRow();
    }
    return true;
}

CGridArray.prototype.onSelectStateChanged = function (aIdRow, aIdCell) {
    this.selectCol(this.sColumnColor);
}

CGridArray.prototype.onBeforeContextMenu = function (aIdRow, aIdCol) {
    this.iLastColSelected = aIdCol;
    if (aIdCol == 0) {
        this.selectCol(this.sColumnColor);
        this.selectRow(aIdRow);
    } else
        this.selectCol(this.sColumnColor, aIdCol);

    this.updateOptionsState(aIdRow, aIdCol);
}

CGridArray.prototype.contextMenuOnClick = function (aIdOption) {
    switch (aIdOption) {
        case optAddCol:
            this.insertColumn(null, "" + (this.getColumnsNum() - 1));
            break;
        case optInsertCol:
            this.insertColumnExt();
            break;
        case optClearCol:
            this.clearCol(this.iLastColSelected);
            break;
        case optRemoveCol:
            this.removeCol(this.iLastColSelected);
            break;
        case optAddSerie:
            this.addSerie();
            break;
        case optInsertSerie:
            this.addSerie(true);
            break;
        case optDuplicateSerie:
            this.addSerie(false, true);
            break;
        case optClearSerie:
            this.clearRow(this.getSelectedRowId());
            break;
        case optRemoveSerie:
            this.removeRow(this.getSelectedRowId());
            break;
    }
}

CGridArray.prototype.contextMenuOnBeforeContextMenu = function (aContextZone, aEvent) {
    this.iLastColSelected = 0;
    this.updateOptionsState();
}

CGridArray.prototype.updateOptionsState = function (aIdRow, aIdCol) {
    var bShowColOptions = isAssigned(aIdRow) && aIdCol > 1,
        bSerieSelected = aIdCol == 0;

    this.contextMenu.setOptionVisible(optAddSerie, bSerieSelected);
    this.contextMenu.setOptionVisible(optInsertSerie, bSerieSelected);
    this.contextMenu.setOptionVisible(optDuplicateSerie, bSerieSelected);
    this.contextMenu.setOptionVisible(optClearSerie, bSerieSelected);
    this.contextMenu.setOptionVisible(optRemoveSerie, bSerieSelected);

    this.contextMenu.setOptionVisible(optAddCol, !bSerieSelected && bShowColOptions);
    this.contextMenu.setOptionVisible(optInsertCol, !bSerieSelected && bShowColOptions);
    this.contextMenu.setOptionVisible(optClearCol, !bSerieSelected && bShowColOptions);
    this.contextMenu.setOptionVisible(optRemoveCol, !bSerieSelected && bShowColOptions);

    this.contextMenu.setOptionEnable(optClearSerie, !this.bLocked);
    this.contextMenu.setOptionEnable(optAddCol, !this.bLocked);
    this.contextMenu.setOptionEnable(optInsertCol, !this.bLocked);
    this.contextMenu.setOptionEnable(optClearCol, !this.bLocked);
    this.contextMenu.setOptionEnable(optRemoveCol, !this.bLocked);

    if (aIdCol == 0) {
        var row = this.getRow(aIdRow),
            bAllowSerieEditable = row.SeriesTypes.bMultiple && !this.bLocked,
            bAllowRemoveSerie = bAllowSerieEditable && this.getNbSerieFromType(row.SeriesTypes.ID) > 1 && !this.bLocked;

        this.contextMenu.setOptionEnable(optAddSerie, bAllowSerieEditable);
        this.contextMenu.setOptionEnable(optInsertSerie, bAllowSerieEditable);
        this.contextMenu.setOptionEnable(optDuplicateSerie, bAllowSerieEditable);
        this.contextMenu.setOptionEnable(optRemoveSerie, bAllowRemoveSerie);
    }
}

CGridArray.prototype.getNbSerieFromType = function (aIdSerieType) {
    var iNb = 0;

    this.rows.forEach(function (aRow) {
        if (aRow.SeriesTypes.ID == aIdSerieType && aRow.sAction != dbaDel)
            iNb += 1;
    });

    return iNb;
}

/* Save */
CGridArray.prototype.hasDataToSave = function () {
    var data = this.getDataToSave(),
        bHasData = isAssigned(data);

    if (isAssigned(data)) {
        bHasData = false;
        data.Series.find(function (aSerie) {
            if (!isEmpty(aSerie.sName)) {
                bHasData = true;
                return true;
            }
            aSerie.Values.find(function (aValue) {
                if (!isEmpty(aValue)) {
                    bHasData = true;
                    return true;
                }
            });
            return bHasData;
        });
    }

    return bHasData;
}

CGridArray.prototype.getDataToSave = function () {
    var data = { ID_Obj: this.idObject, ID_Att: this.idAttribute, Series: [], sAction: dbaModif, sType: "Table" },
        bDeleteData = true,
        iOrder = 0;

    //check if all rows are deleted
    this.rows.forEach(function (aRow) {
        bDeleteData = bDeleteData && aRow.sAction == dbaDel;
    });

    if (bDeleteData) {
        data.sAction = dbaDel;
        return data;
    }

    this.rows.find(function (aRow) {
        if (aRow.sAction == dbaDel) {
            var idSerie = (aRow.Serie) ? aRow.Serie.ID : null;
            data.Series.push({
                ID: idSerie,
                SeriesTypes: aRow.SeriesTypes,
                Values: [],
                sName: "",
                sAction: dbaDel,
                iOrder: iOrder
            });
            iOrder += 1;
            return false;
        }

        var values = [],
            bAddSerie = true,
            serieCell = aRow.cells[1],
            sSerieName = serieCell.sValue,
            bDataToSave = !isEmpty(serieCell.sValue) || serieCell.sFirstValue != serieCell.sValue,
            idSerie = (aRow.Serie) ? aRow.Serie.ID : null;

        aRow.cells.find(function (aCell, j) {
            if (j < 2)
                return false;

            var id,
                valueToExtend = {};
            if (isAssigned(idSerie)) {
                var value = aRow.Serie.Values[j - 2];
                if (isAssigned(value)){
                    id = value.ID;
                    valueToExtend = value;
                }
            }

            values.push(J.extend(valueToExtend, { ID: id, sName: aCell.sValue }));
            if (!bDataToSave)
                bDataToSave = !isEmpty(aCell.sValue) || (aCell.sFirstValue != aCell.sValue);
        });

        if (bDataToSave) {
            data.Series.push({
                ID: idSerie,
                SeriesTypes: aRow.SeriesTypes,
                Values: values,
                sName: sSerieName,
                sAction: dbaModif,
                iOrder: iOrder
            });
            iOrder += 1;
        }
    });

    if (data.Series.length < 1)
        return null;

    return data;
}

CGridArray.prototype.save = function () {
    checkMandatorySettings({ idAtt: this.idAttribute }, ["idAtt"]);

    var self = this,
        data = this.getDataToSave();

    if (!isAssigned(data))
        return;

    J.ajax({
        url: sPathFileComponentsAjax,
        async: false,
        cache: false,
        type: "post",
        data: {
            sFunctionName: "saveDataTable",
            sData: JSON.stringify(data),
            idObject: this.idObject,
            idAtt: this.idAttribute
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] != sOk)
                msgWarning(results[0]);
        }
    });
}