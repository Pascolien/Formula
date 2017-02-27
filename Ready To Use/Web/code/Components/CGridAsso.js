/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        <aSettings from CGrid>
        aSettings.sIdDivToolbar,
        aSettings.gridAssoInfo,
        aSettings.data,
        aSettings.idAttribute,
        aSettings.idOT,
        aSettings.wdowContainer: the window container permit to manage modals windows,
        aSettings.sCheckType,

 * @returns CGridAsso object.
 */

//assoformType
var aft1Form = "aft1Form",
    aftNForm = "aftNForm",
    aftNoForm = "aftNoForm";

//contextMenu options
var optModifyData = "optModifyData",
    optCheckAll = "optCheckAll",
    optUnCheckAll = "optUnCheckAll";

//btns
var btnAddLink = "btnAddLink",
    btnEditLink = "btnEditLink";

var CGridAsso = function (aSettings) {
    this.gridAssoInfo = aSettings.gridAssoInfo;
    this.data = aSettings.data;
    this.idAttribute = aSettings.idAttribute;
    this.idOT = aSettings.idOT;
    this.idObject = aSettings.idObject;
    this.sCheckType = aSettings.sCheckType;
    this.onAdjustSizeRightLeft = aSettings.onAdjustSizeRightLeft;
    this.wdowContainer = aSettings.wdowContainer;
    this.bDisplayGreenArrow = getValue(aSettings.bDisplayGreenArrow, false);
    this.bIgnoreRights = getValue(aSettings.bIgnoreRights, false);
    this.bCliquableLinks = getValue(aSettings.bCliquableLinks, false);
    this.filteredObjects = getValue(aSettings.filteredObjects, []);
    this.idParentFiltering = getValue(aSettings.idParentFiltering, 0);
    this.iLaft = this.gridAssoInfo.LinkType.iFilter_Type_Inv;
    this.bFilteredGrid = this.iLaft > laftNone;

    var iHeightTemp = getValue(aSettings.iHeight, 0),
        self = this;

    //todo : manage edition in grid like txTableView
    aSettings.iHeight = (iHeightTemp > 0 ? iHeightTemp - 27 : aSettings.iHeight);
    aSettings.bResizeDivAfterModif = true;
    aSettings.bEnableEdition = false;
    aSettings.onBeforeContextMenu = function () { self.onBeforeContextMenu };
    aSettings.contextMenuSettings = {
        sIdDivContextMenu: aSettings.sIdDivGrid,
        options: [
            { sId: optModifyData, sName: _("Modifier une donnée associative"), bAddSeparator: true },
            { sId: optCheckAll, sName: _("Cocher toutes les Entités") },
            { sId: optUnCheckAll, sName: _("Décocher toutes les Entités") }
        ],
        onClick: function (aIdOption, aContextZone, aKeysPressed) { self.contextMenuOnClick(aIdOption, aContextZone, aKeysPressed); },
        onBeforeContextMenu: function (aContextZone, aEvent) { self.contextMenuOnBeforeContextMenu(aContextZone, aEvent); }
    }

    var self = this,
        bHideButtonCheck = aSettings.sCheckType != ctCheckboxes,
        bHideButtonFullScreen = !isAssigned(aSettings.sIdDivContainer);

    aSettings.toolbarSettings = {
        sIdDivToolbar: aSettings.sIdDivGrid + "dhxToolbar",
        btns: [
            { sId: btnAddLink, iBtnType: tbtSimple, sHint: _("Ajouter un lien associatif..."), sImgEnabled: "../btn_form/ajout_element.png" },
            { sId: btnEditLink, iBtnType: tbtSimple, sHint: _("Modifier une donnée associative..."), sImgEnabled: "../btn_form/Structure-18x18.png", sImgDisabled: "../btn_form/Structure-18x18_disabled.png", bAddSeparator: true },
            { sId: btnCheckAll, iBtnType: tbtSimple, sHint: _("Cocher toutes les Entités"), sImgEnabled: "check.png", sImgDisabled: "checkDisabled.png", bHide: bHideButtonCheck },
            { sId: btnUnCheckAll, iBtnType: tbtSimple, sHint: _("Décocher toutes les Entités"), sImgEnabled: "uncheck.png", sImgDisabled: "uncheckDisabled.png", bAddSpacer: true },
            { sId: btnSearchLabel, iBtnType: tbtText, sCaption: _("Rechercher :") },
            { sId: btnSearchInput, iBtnType: tbtInput, sHint: _("Appuyer sur la touche 'Entrée' pour lancer la recherche"), bAddSeparator: !bHideButtonFullScreen },
            { sId: btnFullScreen, iBtnType: tbtTwoState, sHint: _("Plein écran"), sImgEnabled: "fullscreen.png", bHide: bHideButtonFullScreen }
        ],
        onClick: function (aId) { self.toolbarOnClick(aId) },
        onStateChange: function (aId, aPressed) { self.toolbarOnStateChange(aId, aPressed) },
        onEnter: function (aId, aValueSearch) { self.toolbarOnEnter(aId, aValueSearch) }
    };

    CGrid.call(this, aSettings);

    if (this.bReadOnly) {
        //disable some buttons
        this.toolbar.hideBtns([btnAddLink, btnEditLink, btnCheckAll, btnUnCheckAll, btnSearchLabel, btnSearchInput])
        this.setColumnHidden(0);
        J("#" + this.sIdDivGrid).css("width", qc(this.iWidth, "px"));
    }
    
    this.onClickOut();
};

//inheritage
CGridAsso.prototype = createObject(CGrid.prototype);
CGridAsso.prototype.constructor = CGridAsso;

CGridAsso.prototype.toString = function() {
    return "CGridAsso";
}

CGridAsso.prototype.getRowFromIdObject = function (aId) {
    var row;
    this.rows.find(function (aRow) {
        if (aRow.ObjectRight.ID == aId) {
            row = aRow;
            return true;
        }
    });
    return row;
}

CGridAsso.prototype.loadRoot = function () {
    var self = this;

    if (isAssigned(this.gridAssoInfo)) {
        this.sCheckType = this.gridAssoInfo.Associativity.bMultiple ? ctCheckboxes : ctRadioboxes;
        this.bStrongFilter = this.gridAssoInfo.Associativity.bStrongFilter;
        this.fillGrid(this.gridAssoInfo, this.data);
    } else {
        J.ajax({
            url: sPathFileComponentsAjax,
            async: false,
            cache: false,
            data: {
                sFunctionName: "assoToJSON",
                idObject: this.idObject,
                idAttribute: this.idAttribute
            },
            success: function (aResult) {
                var results = aResult.split("|");
                if (results[0] == sOk) {
                    self.gridAssoInfo = JSON.parse(results[1]);
                    self.sCheckType = self.gridAssoInfo.Associativity.bMultiple ? ctCheckboxes : ctRadioboxes;
                    self.bStrongFilter = self.gridAssoInfo.Associativity.bStrongFilter;
                    if (results.length > 2)
                        self.data = JSON.parse(results[2]);

                    self.fillGrid(self.gridAssoInfo, self.data);
                } else
                    msgWarning(results[0]);
            }
        });
    }
}

CGridAsso.prototype.fillGrid = function (aGridAssoInfo, aData, aClearAll) {
    aClearAll = getValue(aClearAll, false);

    var self = this,
        cols = [{ sWidth: 20, sColType: this.sCheckType == ctCheckboxes ? ctCh : ctRa, bAllowResize: false }, { sHeader: _("Entité"), sColType: this.bCliquableLinks ? ctLink : ctEd }],
        rows = [],
        iNumberValue = 1;

    this.idOT = aGridAssoInfo.Associativity.idOTRight;
    this.RightLinkAtt = aGridAssoInfo.Associativity.RightLinkAtt;
    aGridAssoInfo.Associativity.AssociativeAttributes.forEach(function (aCol) {
        var sColType,
            idOT;
        switch (aCol.sType) {
            case 'ShortString':
            case 'LongString':
                sColType = ctEd;
                break;
            case 'Url':
            case 'Url {}':
                sColType = ctEd;
                break;
            case 'Email':
            case 'Email {}':
                sColType = ctEd;
                break;
            case 'Bool':
                sColType = ctEd;
                break;
            case 'SingleValue':
                sColType = ctEd;
                break;
            case 'RangeOfValues':
                sColType = ctEd;
                break;
            case 'Range+MeanValue':
                sColType = ctEd;
                break;
            case 'Date':
            case 'DateAndTime':
                sColType = ctEd;
                break;
            case 'File':
            case 'File {}':

                break;
            case 'Table':

                break;
            case "DirectLink 1":
            case "DirectLink N":
            case "Enumeration 1":
            case "Enumeration N":
                sColType = ctEd;
                idOT = aCol.LinkType.ID_OT_Dest;
                break;
            default:
                sColType = ctRo;
        }
        cols.push({ sHeader: aCol.sName, sWidth: 100, sColAlign: "center", sHeaderStyle: "text-align:center", idAttribute: parseInt(aCol.ID), sColType: sColType, idOT: idOT, attribute: aCol });
    });

    if (isAssigned(aData)) {
        aData.LkdObjects.forEach(function (aObj) {
            var objectRight,
                iIndexToDelete = -1;

            if (!isAssigned(aObj.Data))
                return;

            aObj.Data.find(function (aData, j) {
                if (aData.ID_Att == self.RightLinkAtt.ID) {
                    iIndexToDelete = j;
                    objectRight = aData.LkdObjects[0];
                    return true;
                }
            });

            if (!isAssigned(objectRight))
                return;

            var row = {
                ObjectRight: objectRight,
                ObjectAsso: aObj,
                data: [true, format("<img src='"+ _url("/temp_resources/theme/img/png/#1.png") +"'/> ", [objectRight.iIcon]) + (self.bCliquableLinks ? objectRight.sName + "^javascript:txASP.displayObject("+objectRight.ID+");^_self" : objectRight.sName)]
            },
            values = [];

            cols.find(function (aCol, i) {
                if (i < 2)
                    return false;

                var sValue = "";

                aObj.Data.find(function (aData) {
                    if (parseInt(aData.ID_Att) == aCol.idAttribute) {
                        aData.sType = aCol.attribute.sType;
                        sValue = self.getDataValue(aData);
                        return true;
                    }
                })

                values.push(sValue);
            });

            values.forEach(function (aValue) {
                row.data.push(aValue);
            });

            rows.push(row);

            if (iIndexToDelete > -1)
                aObj.Data.splice(iIndexToDelete, 1);
        });
    }

    if (aClearAll)
        this.clearAll(true);

    this.loadStructure(cols, rows);
}

CGridAsso.prototype.getDatasValue = function (aIdAttribute, aData) {
    var self = this,
        sValue = "";

    aData.find(function (aData) {
        if (aIdAttribute === aData.ID_Att) {
            sValue = self.getDataValue(aData);
            return true;
        }
    });
    return sValue;
}

CGridAsso.prototype.getDataValue = function (aData) {
    var sValue = "";

    switch (aData.sType) {
        case 'ShortString':
            sValue = aData.sVal;
            break;
        case 'LongString':
            sValue = J(aData.sVal).text();
            break;
        case 'Url':
        case 'Url {}':
            sValue = aData.sVal.replace("<br>", " ; ");
            break;
        case 'Email':
        case 'Email {}':
            sValue = aData.sVal.replace("<br>", " ; ");
            break;
        case 'Bool':
            var bValue = getbValue(aData.abVal);
            if (bValue)
                sValue = _("Oui")
            else if (bValue != undefined)
                sValue = _("Non");
            break;
        case 'SingleValue':
            sUnitName = getValue(aData.sUnitName, aData.Unit ? aData.Unit.sName : "");
            sValue = qc(aData.fMin, getValue(aData.sUnitName, sUnitName), " ");
            break;
        case 'RangeOfValues':
            sUnitName = getValue(aData.sUnitName, aData.Unit ? aData.Unit.sName : "");
            sValue = format(_("de #1 à #2"), [aData.fMin, qc(aData.fMax, sUnitName, " ")]);
            break;
        case 'Range+MeanValue':
            sUnitName = getValue(aData.sUnitName, aData.Unit ? aData.Unit.sName : "");
            sValue = format(_("de #1 à #2 - Moyenne : #3"), [aData.fMin, qc(aData.fMax, sUnitName, " "), qc(aData.fMean, sUnitName, " ")]);
            break;
        case 'Date':
        case 'DateAndTime':
            sValue = floatToDateStr(aData.fVal);
            break;
        case 'File':
        case 'File {}':
            aData.Files.forEach(function (aFile) {
                sValue = qc(sValue, aFile.AF.sLeft_Ext, " ; ");
            });
            break;
        case 'Table':
            aData.Series.forEach(function (aSerie) {
                sSerieTypeName = isAssigned(aSerie.SeriesTypes.sName) ? aSerie.SeriesTypes.sName + " " : "";
                sSerieTypeName = isAssigned(aSerie.SeriesTypes.jUnit) ? qc(sSerieTypeName, aSerie.SeriesTypes.jUnit.sName) + " " : sSerieTypeName;
                sSerieName = isAssigned(aSerie.sName) ? aSerie.sName + " " : "";
                sValue = qc(sValue, sSerieTypeName + sSerieName + aSerie.Values.join(" "), " ; ");
            });
            break;
        case "InverseLink 1":
        case "InverseLink N":
        case "DirectLink 1":
        case "DirectLink N":
        case "Enumeration 1":
        case "Enumeration N":
        case "BidirectionalLink 1":
        case "BidirectionalLink N":
            aData.LkdObjects.forEach(function (aObj) {
                sValue = qc(sValue, aObj.sName, " ; ");
            });
            break;
    }
    return sValue;
}

CGridAsso.prototype.setDataValue = function (aData, aValue) {
    switch (aData.sType) {
        case 'ShortString':
        case 'LongString':
        case 'Url':
        case 'Url {}':
        case 'Email':
        case 'Email {}':
            aData.sVal = aValue;
            break;
        case 'Bool':
            aData.abVal = aValue;
            break;
        case 'SingleValue':
            aData.fMin = aValue;
            break;
        case 'RangeOfValues':
            aData.fMin = aValue;
            aData.fMax = aValue;
            break;
        case 'Range+MeanValue':
            aData.fMin = aValue;
            aData.fMax = aValue;
            aData.fMean = aValue;
            break;
        case 'Date':
        case 'DateAndTime':
            aData.fVal = aValue;
            break;
        case 'File':
        case 'File {}':
            aData.arrFile.forEach(function (aFileName) {
                aFileName = aValue;
            });
            break;
        case 'Table':
            aData.Series = [];
            break;
        case "DirectLink 1":
        case "DirectLink N":
        case "Enumeration 1":
        case "Enumeration N":
        case "BidirectionalLink 1":
        case "BidirectionalLink N":
            aData.LkdObjects = [];
            break;
    }
    return sValue;
}

CGridAsso.prototype.onXLE = function () {
    J("#" + this.sIdDivGrid).css("width", format("#1px", [this.iWidth]));
}

CGridAsso.prototype.onClickOut = function () {
    CGrid.prototype.onClickOut.call(this);
    if (isAssigned(this.toolbar))
        this.toolbar.setButtonEnable(btnEditLink, false);
}

CGridAsso.prototype.onRowSelect = function () {
    this.toolbar.setButtonEnable(btnEditLink);
}

CGridAsso.prototype.onCheck = function (aIdRow, aColIndex, aState) {
    CGrid.prototype.onCheck.call(this, aIdRow, aColIndex, aState);

    if (aState) {
        if (this.fctOnAddRow)
            this.fctOnAddRow();
    } else {
        if (this.fctOnDelRow)
            this.fctOnDelRow();
    }
}

CGridAsso.prototype.reloadFilteredLink = function (aObjects, aFullOT) {
    this.bFullOT = aFullOT;
    this.bFilteredGrid = !aFullOT;

    if (this.bFullOT)
        this.filteredObjects = [];
    else
        this.filteredObjects = aObjects;

    //clear the rows without data and unchecked
    this.cleanRows();

    //display filteredObjects
    this.displayFilteredObjects();
}

CGridAsso.prototype.displayFilteredObjects = function () {
    var self = this,
        rowsToAdd = [];

    this.filteredObjects.forEach(function (aObj) {
        var bAdd = true;
        self.rows.find(function (aRow) {
            if (aRow.ObjectRight.ID === aObj.ID) {
                bAdd = false;
                return true;
            }
        });

        if (bAdd)
            rowsToAdd.push({ ID: 0, ObjectRight: aObj, ID_OT: self.RightLinkAtt.ID_OT, iIcon: self.RightLinkAtt.iIcon });
    });

    if (rowsToAdd.length > 0)
        this.addAssociativeRow(rowsToAdd, null, false);
}

CGridAsso.prototype.cleanRows = function () {
    var self = this,
        rowsIdToDelete = [];
    //delete rows unchecked and without data
    this.rows.forEach(function (aRow) {
        var filteredRow = self.filteredObjects.find(function (aObj) { return aObj.ID == aRow.ID });
        if (!self.isRowChecked(aRow.ID) && (!self.isRowHasData(aRow.ID, [0, 1])) && !filteredRow)
            rowsIdToDelete.push(aRow.ID);
    });

    rowsIdToDelete.forEach(function (aIdRow) {
        self.deleteRow(aIdRow);
    });
}

/* bottom toolbar functions*/
CGridAsso.prototype.checkAll = function (aChecked) {
    aChecked = getValue(aChecked, true);

    var self = this,
        sIds = getValue(this.getSelectedRowId()),
        selectedIds = isEmpty(sIds) ? [] : sIds.split(","),
        bAll = selectedIds.length == 0;

    if (bAll) {
        this.setCheckedRows(0, aChecked);
    } else {
        selectedIds.forEach(function (aIdRow) {
            self.setCellValue(aIdRow, 0, aChecked);
        });
    }

    if (aChecked) {
        if (this.fctOnAddRow)
            this.fctOnAddRow();
    } else {
        if (this.fctOnDelRow)
            this.fctOnDelRow();
    }
}

CGridAsso.prototype.toolbarOnClick = function (aIdBtn) {
    switch (aIdBtn) {
        case btnAddLink:
            this.addAssociativeData();
            break;
        case btnEditLink:
            this.editAssociativeData();
            break;
        case btnCheckAll:
            this.checkAll();
            break;
        case btnUnCheckAll:
            this.checkAll(false);
            break;
    }
}

CGridAsso.prototype.toolbarOnStateChange = function (aId, aPressed) {
    switch (aId) {
        case btnFullScreen:
            this.displayInFullScreen(aPressed);
            break;
    }
}

CGridAsso.prototype.toolbarOnEnter = function (aIdBtn, aValueSearch) {
    var self = this,
        results = this.findCell(aValueSearch, 1);

    if (isEmpty(aValueSearch)) {
        //clear the rows without data and unchecked
        this.cleanRows();

        this.displayFilteredObjects();
    } else {
        var foundObjects = [],
            rowsToAdd = [];

        if (this.bStrongFilter && this.bFilteredGrid && this.idParentFiltering < 1) {
            this.filteredObjects.forEach(function (aObj) {
                if (inStr(aObj.sName, aValueSearch, true))
                    foundObjects.push(aObj);
            });
        } else {
            foundObjects = getObjectsFromSearchedValue(this.idOT, aValueSearch, this.idAtt);
        }

        //delete rows unchecked and without data
        this.cleanRows();

        //add objects searched
        foundObjects.forEach(function (aObj) {
            var bAdd = true;
            self.rows.find(function (aRow) {
                if (aRow.ObjectRight.ID === aObj.ID) {
                    bAdd = false;
                    return true;
                }
            });

            if (bAdd)
                rowsToAdd.push({ ID: 0, ObjectRight: aObj, ID_OT: self.RightLinkAtt.ID_OT, iIcon: self.RightLinkAtt.iIcon });
        });

        if (rowsToAdd.length > 0)
            this.addAssociativeRow(rowsToAdd,null,false);
    }
}

/*right side toolbar functions*/
CGridAsso.prototype.addAssociativeData = function () {
    var self = this,
        sIdsObjectChecked = "",
        rowsId = this.getCheckedRows(0).split(",");

    if (!isEmpty(rowsId))
        rowsId.forEach(function (aId) {
            var row = self.getRow(aId);
            sIdsObjectChecked = qc(sIdsObjectChecked, row.ObjectRight.ID, ";");
        });

    this.txAddAssociative = new CTxAddAssociative({
        idOT: this.idOT,
        filteredObjects: this.filteredObjects,
        bFilteredTree: this.bFilteredGrid,
        sCheckType: this.sCheckType,
        sIdsObjectChecked: sIdsObjectChecked,
        bStrongFilter: this.bStrongFilter,
        bFullOT: this.bFullOT,
        wdowContainer : this.wdowContainer,
        onValidate: function (aObjects, aFormType) {
            var assoObjects = [];

            aObjects.forEach(function (aObj) {
                assoObjects.push({ ID: 0, ObjectRight: aObj, ID_OT: self.RightLinkAtt.ID_OT, iIcon: self.RightLinkAtt.iIcon });
            });
            
            self.modifyAssociativeData(assoObjects, aFormType);
        }
    });
}

CGridAsso.prototype.editAssociativeData = function () {
    var assoObjects = [],
        rows = this.getSelectedRow(),
        defaultValues = [];

    if (rows.length < 1)
        return;

    rows.forEach(function (aRow) {
        assoObjects.push({ ID: aRow.ObjectAsso.ID, ObjectRight: aRow.ObjectRight, ID_OT: aRow.ObjectAsso.ID_OT, sName: aRow.ObjectAsso.sName, iIcon: aRow.ObjectAsso.iIcon });
        defaultValues = defaultValues.concatObjectArray(defaultValues, aRow.ObjectAsso.Data, "ID_Att");
    });

    var indexes = [];
    defaultValues.forEach(function (aValue, i) {
        if (aValue.sAction == dbaDel)
            indexes.push(i);
    });

    indexes.reverse();
    indexes.forEach(function (aIndex) {
        defaultValues.splice(aIndex, 1);
    });

    this.modifyAssociativeData(assoObjects, aft1Form, { Data: defaultValues });
}

CGridAsso.prototype.modifyAssociativeData = function (aAssoObjects, aFormType, aDefaultValues) {
    var self = this;
    switch (aFormType) {
        case aftNoForm:
            this.addAssociativeRow(aAssoObjects);
            break;
        case aft1Form:
            var assoObject = aAssoObjects[0],
                sWdowCaption = "";

            if (!isAssigned(assoObject))
                return;

            aAssoObjects.forEach(function (aObj) {
                sWdowCaption = qcFmt(sWdowCaption, "#1 ", [aObj.ObjectRight.sName], " , ");
            });

            var attributesId = [];
            this.cols.forEach(function (aCol) {
                if (isAssigned(aCol.idAttribute))
                    attributesId.push(aCol.idAttribute);
            });
            new CTxForm({
                idOT: assoObject.ID_OT,
                object: assoObject.ObjectRight,
                idObject: assoObject.ID,
                sWindowCaption: sWdowCaption,
                bReturnAttributesValue: true,
                bDisplayBanner : true,
                bIgnoreRights: this.bIgnoreRights,
                sType: "aptId",
                sData: attributesId,
                sDefaultValues: aDefaultValues,
                wdowContainer: this.wdowContainer,
                fctDisplayObject: function (aId) { self.displayObject(aId); },
                sIcon: format("temp_resources/theme/img/png/#1.png", [assoObject.iIcon])
            }, function (aValidate, aInstructions, aDummyData) {
                if (aValidate)
                    self.addAssociativeRow(aAssoObjects, aDummyData.modifiedFields);
            });
            break;
        case aftNForm:
            var attributesId = [];

            this.cols.forEach(function (aCol) {
                if (isAssigned(aCol.idAttribute))
                    attributesId.push(aCol.idAttribute);
            });
            this.displayMultipleForm(attributesId, aAssoObjects);
            break;
    }
}

CGridAsso.prototype.displayMultipleForm = function (aAttributesIds, aAssoObjects, aData) {
    var self = this,
        assoObject;

    if (isAssigned(aData)) {
        self.addAssociativeRow([aAssoObjects[0]], aData);
        aAssoObjects.splice(0, 1);
    }
    assoObject = aAssoObjects[0];

    if (!isAssigned(assoObject))
        return;

    new CTxForm({
        idOT: assoObject.ID_OT,
        object : assoObject.ObjectRight,
        bDisplayBanner: true,
        sWindowCaption: assoObject.ObjectRight.sName,
        bReturnAttributesValue: true,
        sType: "aptId",
        sData: aAttributesIds,
        bIgnoreRights: this.bIgnoreRights,
        wdowContainer: this.wdowContainer,
        fctDisplayObject: function (aId) { self.displayObject(aId); },
        sIcon: format("temp_resources/theme/img/png/#1.png", [assoObject.iIcon])
    }, function (aValidate, aInstructions, aDummyData) {
        if (aValidate) {
            self.displayMultipleForm(aAttributesIds, aAssoObjects, aDummyData.modifiedFields);
        }
    });
}

CGridAsso.prototype.addAssociativeRow = function (aAssoObjects, aData, aChecked) {
    function addRow(aObj, aCols, aData) {
        var dataList = [aChecked, format("<img src='"+ _url("/temp_resources/theme/img/png/#1.png") +"' /> ", [aObj.ObjectRight.iIcon]) + aObj.ObjectRight.sName];

        if (isAssigned(aData))
            aCols.find(function (aCol, i) {
                if (i < 2)
                    return false;

                var sValue = self.getDatasValue(aCol.idAttribute, aData);
                dataList.push(sValue);
            });

        var data = getValue(aData, []);

        return {
            data: dataList, ObjectRight: aObj.ObjectRight, ObjectAsso: {
                Data: data, ID: 0, ID_Obj_Left: self.idObject, ID_Obj_Right: aObj.ObjectRight.ID, ID_OT: aObj.ID_OT, iIcon: aObj.iIcon
            }
        };
    }

    function modifyRow(aRow, aCols, aData) {
        self.setCellValue(aRow.ID, 0, true);

        if (isAssigned(aData)) {
            if (aData.length > 0) {
                //update grid cells
                aData.forEach(function (aData) {
                    var col = self.getColFromField("idAttribute", aData.ID_Att);
                    aRow.ObjectAsso.Data.deleteElement("ID_Att", aData.ID_Att);
                    var sValue = self.getDataValue(aData);

                    self.setCellValue(aRow.ID, col.iIndex, sValue);
                });
                aRow.ObjectAsso.Data = aRow.ObjectAsso.Data.concatObjectArray(aRow.ObjectAsso.Data, aData, "ID_Att");
            }
        }
    }

    var self = this,
        rows = [];

    aChecked = getValue(aChecked, true);

    aAssoObjects.forEach(function (aObj) {
        var row = self.getRowFromIdObject(aObj.ObjectRight.ID);
        if (isAssigned(row)) {
            modifyRow(row, self.cols, aData);
        } else {
            rows.push(addRow(aObj, self.cols, aData));
        }
    });

    if (rows.length > 0) {
        if (this.getRowsNum() < 1)
            this.reloadFromTxObjects(rows);
        else
            this.addRowsJS(rows);

        if (aChecked) {
            if (this.fctOnAddRow)
                this.fctOnAddRow();
        } else {
            if (this.fctOnDelRow)
                this.fctOnDelRow();
        }
    }

    this.displayInFullScreen(this.toolbar.isPressed(btnFullScreen));
}

CGridAsso.prototype.displayObject = function (aIdObject) {
    txASP.displayObject(aIdObject);
}

/*context menu functions*/
CGridAsso.prototype.onBeforeContextMenu = function (aIdRow, aIdCol) {
    this.selectRowById(aIdRow,this.bCtrlClicked);
    this.updateOptionsState();
}

CGridAsso.prototype.contextMenuOnClick = function (aIdOption) {
    switch (aIdOption) {
        case optModifyData:
            this.editAssociativeData();
            break;
        case optCheckAll:
            this.checkAll();
            break;
        case optUnCheckAll:
            this.checkAll(false);
            break;
    }
}

CGridAsso.prototype.contextMenuOnBeforeContextMenu = function (aContextZone, aEvent) {
    this.clearSelection();
    this.updateOptionsState();
}

CGridAsso.prototype.updateOptionsState = function () {
    var bRowSelected = this.isRowSelected() && !this.bLocked;
    this.contextMenu.setOptionEnable(optModifyData, bRowSelected);
    this.contextMenu.setOptionEnable(optCheckAll, !this.bLocked);
    this.contextMenu.setOptionEnable(optUnCheckAll, !this.bLocked);
}

/*save*/
CGridAsso.prototype.getCheckedIds = function () {
    var checkedRows = this.getRowsChecked(),
        checkedIds = [];

    checkedRows.forEach(function (aRow) {
        checkedIds.push(aRow.ObjectRight.ID);
    });

    return checkedIds;
}

CGridAsso.prototype.getRowsChecked = function () {
    var self = this,
        rows = [],
        sIdChecked = this.getCheckedRows(0),
        checkedIds = isEmpty(sIdChecked) ? [] : sIdChecked.split(",");

    if (checkedIds.length > 0)
        checkedIds.forEach(function (aId) {
            var row = self.getRow(aId);
            rows.push(row);
        });

    return rows;
}

CGridAsso.prototype.getSavedData = function(){
    var self = this,
        data = { ID_Obj: this.idObject, ID_Att: this.idAttribute, LkdObjects: [], sAction : dbaModif },
        bOk = false;

    this.rows.forEach(function (aRow) {
        var bChecked = self.isRowChecked(aRow.ID),
            assoObject = J.extend({}, aRow.ObjectAsso);

        assoObject.ID_Obj_Left = self.idObject;
        assoObject.ID_Obj_Right = aRow.ObjectRight.ID;
        assoObject.sAction = bChecked ? assoObject.ID == 0 ? dbaAdd : dbaModif : dbaDel;

        if (assoObject.sAction == dbaDel) {
            //remove data
            delete assoObject.Data
        }

        data.LkdObjects.push(assoObject);
    });

    return data;
}

CGridAsso.prototype.save = function () {
    var self = this,
        data = this.getSavedData();

    if (!isAssigned(data))
        return;

    J.ajax({
        url: sPathFileComponentsAjax,
        async: false,
        cache: false,
        type:"post",
        data: {
            sFunctionName: "saveAsso",
            sData: JSON.stringify(data),
            idObj : this.idObject,
            idAtt : this.idAttribute
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] != sOk) 
                msgWarning(results[0]);
        }
    });
}
