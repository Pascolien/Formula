"use strict";
/**
 * @class : a TableView
 * @requires CTableViewData.js
 * @requires CTableViewFilter.js
 * @requires CTableViewPopupFilter.js
 * @requires CLinkTree.js
 * @requires CNumericUnique.js
 * @requires CNumericRangeMean.js
 * @requires dhtmlxCustomColType.js
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param
        aSettings.sIdDivParent *** Widget Mode : to insert the table view in the specified element ***
        aSettings.idTable
        aSettings.sIdTable
        aSettings.bIsWidget
        aSettings.sSkin
        aSettings.onClickObjectName
 * @returns CTableView object.
 */

var sPathFileTableViewAjaxASP = _url("/temp_resources/models/TxTableView/TxTableViewAjax.asp");

var CTableView = function (aSettings, aCallBackFunction, aDummyData) {

    // privileged variables
	this.idOT
    this.idTable = getValue(aSettings.idTable, 0);
    this.sIdTable = getValue(aSettings.sIdTable, '');
    this.sTableViewName;
    this.sIdDivParent = aSettings.sIdDivParent;
    this.sIdDivGrid = "id_div_TxTableGrid";
    this.sIdDivToolbar = "id_div_TxTableGridToolbar";
    this.onClickObjectName = aSettings.onClickObjectName;
    this.mainToolbar;
    this.dhxGrid;
    this.dhxToolbar;
    this.dhxContextMenu;
    this.dhxMainLayout;
    this.popupFilter;
    this.sSkin = getValue(aSettings.sSkin, "dhx_skyblue");
    this.iColCount;
    this.sHeaders = '';
    this.sColumnTypes;
    this.sWidth;
    this.sSortDirection = "asc";
    this.iCurrentColSorted = 0;
    this.sMultiline;
    this.sTextAlign;
    this.iObjectsPreselectionType;
    this.iNbRowPerPage;
    this.iNbFixedColumns;
    this.iPageCount;
    this.iCurrentPage = 0;
    this.iVisibleRowsCount;
    this.iRowsTotalCount;
    this.iTotalNbOTObjects;
    this.sNameRL;
    this.jTableViewData;
    this.bDisplayFilters;
    this.indexCheckboxColumn = -1;
    this.arrTableViewFilter = [];
    this.arrDefaultFilterTypes;
    this.arrColIndexApplyFilters;
    this.arrTableViewData = []; // Edition mode : array of cells edited
    this.bIsEditionMode;
    this.bIsWidget = getValue(aSettings.bIsWidget, false);
    // initialize heartbeat timer
    this.heartbeatTimer;
    this.iSessionTimeout;
    // reload grid 
    this.bReloadState = false;
    
    //private variables
    var self = this;
    
    // Create popup for edit filters
    this.popupFilter = new CTableViewPopupFilter();

    if (!this.bIsWidget) {
        this.dhxMainLayout = new dhtmlXLayoutObject({
            parent: document.body,
            pattern: '3E',
            skin: self.sSkin
        });
        this.dhxMainLayout.attachEvent("onResizeFinish", function () {
            self.dhxGrid.setSizes();
        });
        this.dhxMainLayout.setAutoSize("a;b;c", "b");

        var cellA = this.dhxMainLayout.cells('a');
        cellA.attachObject("id_div_cell_a");
        cellA.hideHeader();
        cellA.setHeight(40);
        cellA.fixSize(true, true);

        var cellB = this.dhxMainLayout.cells('b');
        cellB.hideHeader();
        cellB.attachObject("id_div_cell_b");

        var cellC = this.dhxMainLayout.cells('c');
        cellC.attachObject("id_div_cell_c");
        cellC.hideHeader();
        cellC.setHeight(28);
        cellC.fixSize(true, true);

        // Fix size toolbar
        J('#id_div_cell_c').parent().parent().parent().height(28).parent().height(28);
        var newHeight = J('#id_div_cell_b').height()+12;
        J('#id_div_cell_b').parent().height(newHeight).parent().height(newHeight).parent().height(newHeight).parent().height(newHeight);
    }

    if (this.bIsWidget) {
        J("#" + this.sIdDivParent).html('<div id="divLayoutWidget_' + this.sIdTable + '" class="layout_Widget_Table">' +
                                            '<img src="' + _url("/resources/theme/img/dhtmlx/layout/dhxlayout_progress.gif") + '" class="imgLoadingWidget"/>' +
                                            '<div class="dataLoadingsInfo">' + _("Chargements des données...") + '</div>' +
                                        '</div>');
        J("#divLayoutWidget_" + this.sIdTable).fadeIn(500);
    } else {
        this.activeProgressLayout();
    }

    J.ajax({
        url: sPathFileTableViewAjaxASP,
        async: true,
        cache: false,
        dataType: 'html',
        data: {
            sFunctionName: 'AddNewTableView',
            ID: self.idTable,
            sID: self.sIdTable,
            bIsWidget: self.bIsWidget
        },
        success: function (data) {
            var arrResult = data.split("|");
            if (arrResult[0] == sOk) {
                var jsonResult = JSON.parse(arrResult[1]);
                // Init Variables
                self.initTableViewVariables(jsonResult);

                initializeDhxGrid();

                self.getJsonGridData();
                // callBack that return TableView object created.
                if (isAssigned(aCallBackFunction))
                    aCallBackFunction(self);
            } else {
                self.desactiveProgressLayout();
                msgError(arrResult[0]);
            }
        }
    });

    function initializeDhxGrid() {
        self.dhxContextMenu = new dhtmlXMenuObject();
        self.dhxContextMenu.renderAsContextMenu();
        self.dhxContextMenu.attachEvent("onClick", function (sId, zoneId, cas) {
            var data = sId.split('_');
            if (data[0] === "file")
                openDataFileFile(data[1]);
            else if (data[0] === "link")
                self.displayObject(data[1]);
        });

        self.initDhxGrid();

        Initialize_dhxToolbar();
    }

    function Initialize_dhxToolbar() {
        self.dhxToolbar = new dhtmlXToolbarObject(self.sIdDivToolbar);
        self.dhxToolbar.setSkin(self.sSkin);
        self.dhxToolbar.setIconsPath(_url('/resources/theme/img/toolbar/'));
        self.dhxToolbar.addButton("first", 1, "", "../iconsToolbar/first.gif", "../iconsToolbar/firstDisabled.gif");
        self.dhxToolbar.setItemToolTip("first", _("Sélectionner la première page"));
        self.dhxToolbar.addButton("prev", 2, "", "../iconsToolbar/prev.gif", "../iconsToolbar/prevDisabled.gif");
        self.dhxToolbar.setItemToolTip("prev", _("Sélectionner la page précédente"));
        self.dhxToolbar.addButton("next", 3, "", "../iconsToolbar/next.gif", "../iconsToolbar/nextDisabled.gif");
        self.dhxToolbar.setItemToolTip("next", _("Sélectionner la page suivante"));
        self.dhxToolbar.addButton("last", 4, "", "../iconsToolbar/last.gif", "../iconsToolbar/lastDisabled.gif");
        self.dhxToolbar.setItemToolTip("last", _("Sélectionner la dernière page"));
        self.dhxToolbar.addButtonSelect("pages", 5, _("Page n°") + "1", [], "../png/leaf.gif", "", true, false, 20);
        self.dhxToolbar.setItemToolTip("pages", _("Sélectionner une page"), "", "", false, false);
        self.dhxToolbar.addSeparator("rowCountSeparator", 6);
        self.dhxToolbar.addText("pageCount", 7, _("Nombre de page(s) :") + self.iPageCount);
        self.dhxToolbar.addSeparator("pagesSeparator", 8);
        var sText_RowCount = format(_("#1 Entités affichées sur #2 filtrées sur un total de #3 Entités"), [0, self.iVisibleRowsCount, self.iRowsTotalCount]);
        self.dhxToolbar.addText("rowCount", 9, sText_RowCount);

        J('#' + self.sIdDivToolbar).addClass('div_TxTableGridToolbar');

        if (self.bIsWidget)
            self.applyGridAndToolbarCss();

        self.dhxToolbar.attachEvent("onClick", function (sId) {
            switch (sId) {
                case "first":
                    self.onClickBtnFirstPage();
                    break;
                case "prev":
                    self.onClickBtnPrevPage();
                    break;
                case "next":
                    self.onClickBtnNextPage();
                    break;
                case "last":
                    self.onClickBtnLastPage();
                    break;
                case "pages":
                    //nothing
                    break;
                default:
                    //self.dhxToolbar.setItemText("pages", _("Page n°") + (parseInt(sId) + 1));
                    self.onClickBtnSpecificPage(sId);
                    break;
            }
        });
        self.updateButtonsState("first");
    }


    /*** Page Events ***/
    if (this.bIsWidget) {
        // Save modified data before page change for widget mode (the unload event doesn't work for iframe change)
        J(window).on('pagehide', function () {
            if (self.isOneOrMoreAttObjectModified()) {
                self.dosaveModifiedData(true, {});
            }
            self.freeTableView();
        });
    } else {
        // Save modified data before quit the page.
        J(window).on('beforeunload', function () {
            if (self.isOneOrMoreAttObjectModified()) {
                self.dosaveModifiedData(true, {});
            }
        });
        // Free table view when quit the page
        J(window).unload(function () {
            self.freeTableView();
        });
    }

    this.startHeartBeat();
};

CTableView.prototype.initDhxGrid = function () {
    var arrAttachHeader = [],
        sColMinWidth = '',
        arrColType = this.sColumnTypes.split(','),
        iSplitColumns = 0,
        self = this;

    this.dhxGrid = new dhtmlXGridObject(this.sIdDivGrid);
    this.dhxGrid.setImagePath(_url("/resources/theme/img/dhtmlx/grid/"));
    this.dhxGrid.setHeader(this.sHeaders);
    if (this.bDisplayFilters) {
        for (var i = 0 ; i < this.iColCount ; i++) {
            var sFilterType = this.arrDefaultFilterTypes[i];
            var sHtmlHeader = '#rspan';
            var sHint = "";
            if (sFilterType != 0) {
                switch (sFilterType) {
                    case "0":
                        sHint = _("Aucun filtre");
                        break;
                    case "1":
                        sHint = _("Contient ET");
                        break;
                    case "2":
                        sHint = _("Contient OU");
                        break;
                    case "3":
                        sHint = _("Commence par");
                        break;
                    case "4":
                        sHint = _("Egal à");
                        break;
                    case "6":
                        sHint = _("Bornes");
                        break;
                }
                sHtmlHeader = "<div class='cl_div_filter_value'>\
										<input type='text' id='id_text_filter_" + this.idTable + "_" + i + "' iFilterType='" + sFilterType + "' title='" + sHint + "' class='cl_input_filter' />\
										<div id='id_div_combo_" + this.idTable + "_" + i + "' style='display:none;'></div>\
									</div>\
									<div class='idDivBtnSorting'>\
										<div class='idDivSortAsc'>\
											<input id='id_btn_sortAsc_" + this.idTable + "_" + i + "' type='image' title='" + _("Tri ascendant") + "' src='" + _url('/resources/theme/img/dhtmlx/grid/sort_asc.gif') + "'/>\
										</div>\
										<div class='idDivSortDesc'>\
											<input id='id_btn_sortDesc_" + this.idTable + "_" + i + "' type='image' title='" + _("Tri descendant") + "' src='" + _url('/resources/theme/img/dhtmlx/grid/sort_desc.gif') + "'/>\
										</div>\
									</div>\
									<div class='cl_div_btn_filter'>\
										<input id='id_img_filter_" + this.idTable + "_" + i + "' type='image' title='" + _("Appliquer un filtre") + "' src='" + _url('/resources/theme/img/dhtmlx/grid/module_mcs-16_disabled.png') + "' class='cl_btn_filter' />\
									</div>"
            }
            iSplitColumns = this.iNbFixedColumns;
            if (this.bIsEditionMode)
                iSplitColumns += 3;
            if (i < iSplitColumns && sHtmlHeader == "#rspan")
                arrAttachHeader.push('');
            else
                arrAttachHeader.push(sHtmlHeader);

            if (arrColType[i] == "img") {
                sColMinWidth = qc(sColMinWidth, "25", ",");
            } else {
                sColMinWidth = qc(sColMinWidth, "45", ",");
            }
        }
        this.dhxGrid.attachHeader(arrAttachHeader);
        // if display filters, check for minimum columns width
        var arrColWidth = this.sWidth.split(',');
        this.sWidth = '';
        for (var j = 0; j < arrColWidth.length; j++) {
            if (!this.bIsEditionMode || (this.bIsEditionMode && j > 2)) {
                var sNewWidth = arrColWidth[j];
                if (arrColType[j] != "img" && parseInt(arrColWidth[j]) < 45)
                    sNewWidth = "45";
                this.sWidth = qc(this.sWidth, sNewWidth, ",");
            } else {
                this.sWidth = qc(this.sWidth, arrColWidth[j], ",");
            }
        }
    }
    if (this.sColumnTypes != '')
        this.dhxGrid.setColTypes(this.sColumnTypes);
    this.dhxGrid.setInitWidths(this.sWidth);
    this.dhxGrid.setColumnMinWidth(sColMinWidth);
    this.dhxGrid.setColAlign(this.sTextAlign);
    this.dhxGrid.enableSmartRendering(true);
    this.dhxGrid.enableMultiselect(true);

    // Test for enable or not multiline (only if no Edition = conflicts...)
    if (!this.bIsEditionMode && this.iNbFixedColumns === 0) {
        var sArrMulitline = this.sMultiline.split(',');
        if (sArrMulitline.indexOf('-1') > -1) {
            this.dhxGrid.enableMultiline(true);
        }
    } else {
        var sEnableResizing = "";
        for (var i = 0; i < this.iColCount - 1; i++) {
            if (i < iSplitColumns)
                sEnableResizing = qc(sEnableResizing, "false", ",");
            else
                sEnableResizing = qc(sEnableResizing, "true", ",");
        }
        this.dhxGrid.enableResizing(sEnableResizing);
    }

    this.dhxGrid.setSkin(this.sSkin);
    this.dhxGrid.enableContextMenu(this.dhxContextMenu);
    this.dhxGrid.moveToVisible = function () { };
    this.dhxGrid.init();
    if (iSplitColumns > 0) {
        this.dhxGrid.splitAt(iSplitColumns);
        this.dhxGrid._fake.moveToVisible = function () { };
    }
    if (this.bIsWidget && !this.bDisplayFilters) J("#" + this.sIdDivGrid).addClass("widgetWithoutFilter");
    if (this.bDisplayFilters) {
        // initialize default filter
        for (var i = 0 ; i < this.iColCount ; i++) {
            var sFilterType = this.arrDefaultFilterTypes[i];
            if (sFilterType != 0) {
                var bLoadFilter = false;
                // load filters already apply
                for (var j = 0; j < this.arrColIndexApplyFilters.length - 1; j++) {
                    if (parseInt(this.arrColIndexApplyFilters[j]) == i) {
                        bLoadFilter = true;
                        break;
                    }
                }
                var settingsFilter = {
                    tableView: this,
                    idColumn: i,
                    iDefaultFilterType: parseInt(this.arrDefaultFilterTypes[i]),
                    bLoadFilter: bLoadFilter
                }
                this.arrTableViewFilter.push(new CTableViewFilter(settingsFilter));
                // attach onclick event
                J("#id_img_filter_" + this.idTable + "_" + i).click(addOnClickFilter(i));
                J("#id_btn_sortAsc_" + this.idTable + "_" + i).click(addOnClickSort(i, true));
                J("#id_btn_sortDesc_" + this.idTable + "_" + i).click(addOnClickSort(i, false));
            }
        }
    }

    self.dhxGrid.attachEvent("onXLE", function () {
        // Update Column header resize
        var arrColWith = self.sWidth.split(",");
        for (var i = 0 ; i < self.iColCount ; i++) {
            var iColWidth = this.getColWidth(i);
            if (isNaN(iColWidth)) {
                iColWidth = parseInt(arrColWith[i]);
            }
            if (iColWidth < 80) {
                J("#id_text_filter_" + self.idTable + "_" + i).hide();
                J("#id_div_combo_" + self.idTable + "_" + i).hide();
            }
            J("#id_text_filter_" + self.idTable + "_" + i).css("width", (iColWidth - 55));
            J("#id_div_combo_" + self.idTable + "_" + i).css("width", (iColWidth - 50));
        }
        // Update sort 
        this.setSortImgState(true, self.iCurrentColSorted, self.sSortDirection, 1);
        // Update Page and Objects numbers
        self.updateRowsNbInInterface();
    });
    self.dhxGrid.attachEvent("onRowAdded", function () {
        var sTextRowCount = format(_("#1 Entités affichées sur #2 filtrées sur un total de #3 Entités"), [self.dhxGrid.getRowsNum(), self.iVisibleRowsCount, self.iRowsTotalCount]);
        self.dhxToolbar.setItemText("rowCount", sTextRowCount);
    });
    self.dhxGrid.attachEvent("onResize", function (cInd, cWidth, obj) {
        if (cWidth < 80) {
            J("#id_text_filter_" + self.idTable + "_" + cInd).hide();
            J("#id_div_combo_" + self.idTable + "_" + cInd).hide();
        } else {
            if (self.getFilterType(cInd) == -1) {
                return true;
            } else if (self.getFilterType(cInd) == 5) {
                J("#id_div_combo_" + self.idTable + "_" + cInd).show();
            } else {
                J("#id_text_filter_" + self.idTable + "_" + cInd).show();
            }
            J("#id_text_filter_" + self.idTable + "_" + cInd).css("width", (cWidth - 55));
            J("#id_div_combo_" + self.idTable + "_" + cInd).css("width", (cWidth - 50));
        }
        return true;
    });
    self.dhxGrid.attachEvent("onBeforeContextMenu", function (idRow, indCol) {
        var sCurrentColType = self.dhxGrid.getColType(indCol);
        if ((sCurrentColType === "ro") || (sCurrentColType === "customURL") || (sCurrentColType === "customEmail") || (sCurrentColType === "customFile") || (sCurrentColType === "coro") || (sCurrentColType === "clist") || (sCurrentColType === "customTree") || (sCurrentColType === "listAtt")) {
            self.updateContextMenu(indCol, idRow);
            return true;
        } else {
            return false;
        }
    });
    self.dhxGrid.attachEvent("onRowCreated", function (rId, rObj) {
        self.setCellsMultilineOnRow(rId);
    });
    // Doesn't work : problem with code version of DHTMLX ??
    // TxContextMenu.attachEvent("onClick", function(id, zoneId, cas){
    // 	if(id != "TxTT_nav"){
    // 		TxContextMenu.hideContextMenu();
    // 	}
    // });
    self.dhxGrid.attachEvent("onEditCell", function (aStage, rId, cInd, nValue, oValue) {
        // stage : 0 - before start, 1 - editor is opened, 2 - editor is closed
        // new value and old value only avaliable for stage 2
        if (self.dhxGrid.getColType(cInd) === "ch")
            return true;
        var tableViewData;
        if (aStage == 0) {
            // check if the attribute is already initialize
            if (!self.isDataObjectInit(rId, cInd)) {
                var sValue = self.dhxGrid.cells(rId, cInd).getValue();
                var sType = self.dhxGrid.getColType(cInd);
                var settingsTVData = {
                    tableView: self,
                    idRow: rId,
                    idColumn: cInd,
                    sType: sType,
                    sValue: sValue
                };
                switch (sType) {
                    case "customString":
                    case "customURL":
                    case "customEmail":
                        tableViewData = new CTableViewDataString(settingsTVData);
                        break;
                    case "customCalendar":
                        tableViewData = new CTableViewDataDate(settingsTVData);
                        break;
                    case "customNumRangeMean":
                    case "customNumUnique":
                        tableViewData = new CTableViewDataNumeric(settingsTVData);
                        break;
                    case "customTree":
                        tableViewData = new CTableViewDataLink(settingsTVData);
                        break;
                    default:
                        tableViewData = new CTableViewData(settingsTVData);
                        break;
                }
                self.arrTableViewData.push(tableViewData);
            } else {
                tableViewData = self.getTableViewData(rId, cInd);
                // check if we need to refresh data before edit Cell (in case of reload row data)
                if (tableViewData.bToRefresh) {
                    tableViewData.refreshDataFromAttributesCell(self.dhxGrid.cells(rId, cInd).getValue());
                }
                // else nothing to do (data are up to date)
            }
            // Check Combo Value to retrieve actual value option 
            if (self.dhxGrid.getColType(cInd) === 'coro') {
                var combo = self.dhxGrid.getCombo(cInd);
                if (combo.size() == 0) {
                    // need to retrieve values of combo
                    self.initializeLinkAttLinkableObjects(cInd);
                }
                var sValue = self.dhxGrid.cells(rId, cInd).getValue();
                var arrComboKeys = combo.getKeys();
                var arrComboValues = combo.values;
                for (var i = 0; i < arrComboValues.length; i++) {
                    if (arrComboValues[i] === sValue) {
                        self.dhxGrid.cells(rId, cInd).setValue(arrComboKeys[i]);
                    }
                }
            }
        } else if (aStage == 1) {
            tableViewData = self.getTableViewData(rId, cInd);
            if (tableViewData.bEdited)
                return;
            // set Stage for data edition
            tableViewData.iStage = 1;
            tableViewData.edit();
        } else if (aStage == 2) {
            tableViewData = self.getTableViewData(rId, cInd);
            if (tableViewData.sType === 'customCalendar') {
                if (J("#ui-datepicker-div").is(':visible')) {
                    return true;
                } else {
                    tableViewData.iStage = 1;
                    return true;
                }
            } else if (tableViewData.sType === 'customString' ||
                       tableViewData.sType === 'customURL' ||
                       tableViewData.sType === 'customEmail' ||
                       (tableViewData.sType === 'customNumUnique' && tableViewData.sIdsUnit.split(";").length <= 1)) {
                return true;
            }
            if ((nValue != oValue) && (tableViewData.iStage === 1)) {
                tableViewData.sNewValue = nValue;
                self.afterEditCell(tableViewData);
                tableViewData.iStage = 2;
            }
            return true;
        }
    });
    self.dhxGrid.attachEvent("onRowSelect", function (aRowId, aColInd) {
        // Init event on link & img 
        switch (this.getColType(aColInd)) {
            case "img":
                if (self.bIsEditionMode && aColInd === 1) {
                    self.saveModifiedData(aRowId);
                } else if (self.bIsEditionMode && aColInd === 2) {
                    self.cancelDataModified(aRowId);
                } else {
                    var idMA = this.cells(aRowId, aColInd).getAttribute("idMA");
                    var sObjectDependency = this.cells(aRowId, aColInd).getAttribute("sObjectDependency");
					// save last item clicked
					J.lastMainToolbarItemClicked = this.cells(aRowId, aColInd).cell;
						
                    self.launchModelApplication(idMA, sObjectDependency, [aRowId]);
                }
                break;
            case "customLink":
                if (isAssigned(self.onClickObjectName))
					self.onClickObjectName(aRowId);
				else // if none fonction is defined, use the default one to focus entity on teexma tab
					self.displayObject(aRowId);
				break;
        }
    });
    self.dhxGrid.attachEvent("onCheck", function (aRowId, aColInd, aState) {
        var iState = (aState) ? '1' : '0';
        J.ajax({
            url: sPathFileTableViewAjaxASP,
            async: true,
            cache: false,
            dataType: 'html',
            data: {
                sFunctionName: 'setCellCheckedState',
                idTable: self.idTable,
                idRow: aRowId,
                idColumn: aColInd,
                iState: iState
            },
            success: function (data) {
                var results = data.split('|');
                if (results[0] !== sOk)
                    msgError(results[0]);
            }
        });
    });

    // create a new class to fit content in case of resize (if there are fixed columns)
    var iWidth = J("#" + self.sIdDivGrid + " .gridbox_not_existing_skin").width();
    if (iWidth) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '#' + self.sIdDivGrid + ' .gridbox_not_existing_skin + div { width: calc(100% - ' + iWidth + 'px) !important }';
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    function addOnClickFilter(aIndex) {
        return function () {
            self.popupFilter.show(self, aIndex, this);
        }
    }
    function addOnClickSort(aIndex, aSort) {
        return function () {
            self.sortColumn(aIndex, aSort);
        }
    }
}

CTableView.prototype.initTableViewVariables = function (aVariables) {
    var self = this;

    this.idTable = parseInt(aVariables.id);
    this.idOT = aVariables.idOT;
    this.sTableViewName = aVariables.name;
    this.bIsEditionMode = ("enableEdition" in aVariables) ? aVariables.enableEdition : false;
    if (this.bIsWidget && !this.bReloadState)
        this.createWidgetHtml();
    this.iRowsTotalCount = parseInt(aVariables.rowsTotalCount);
    this.iTotalNbOTObjects = parseInt(aVariables.objTotalCount);
    this.sNameRL = aVariables.nameRL;
    this.arrDefaultFilterTypes = getValue(aVariables.colDefaultFilterType, '').split(',');
    this.iObjectsPreselectionType = aVariables.objPreselectionType;
    this.iNbRowPerPage = parseInt(aVariables.nbRowsPerPage);
    this.iNbFixedColumns = parseInt(getValue(aVariables.nbFixedColumns, '0'));
    this.iPageCount = parseInt(aVariables.pagesCount);
    this.iVisibleRowsCount = parseInt(aVariables.visibleRowsCount);
    this.sSortDirection = aVariables.sortType;
    this.iCurrentColSorted = parseInt(aVariables.orderSortedCol) == -1 ? 0 : parseInt(aVariables.orderSortedCol);
    if (this.bIsEditionMode && (this.iCurrentColSorted == 0)) { this.iCurrentColSorted = 3; }
    this.sWidth = getValue(aVariables.columnWidth, '');
    this.sMultiline = getValue(aVariables.columnMultiline, '');
    // set sHeaders
    var arrHeaders = getValue(aVariables.columnHeaders, '').split('<sep>'),
        sCurrentHeader;
    this.sHeaders = "";
    for (var i = 0; i < arrHeaders.length; i++) {
        var sCurrentHeader = arrHeaders[i].replace(/,/g, "\\,");
        this.sHeaders = qc(this.sHeaders, '<div class="headerCellTableView" title="' + sCurrentHeader + '">' + sCurrentHeader + '</div>', ',');
    }
    this.sColumnTypes = getValue(aVariables.columnTypes, '');
    this.sTextAlign = getValue(aVariables.columnAlign, '');
    this.iColCount = this.sWidth.split(",").length;
    var sColIndexApplyFilters = getValue(aVariables.indexColFiltered, "");
    this.arrColIndexApplyFilters = sColIndexApplyFilters.split('\n');
    var bExportationData = ("enableExportationData" in aVariables) ? aVariables.enableExportationData : false;
    var bIsChechboxColumn = inStr(this.sColumnTypes, 'ch');
    if (bIsChechboxColumn) {
        var columnsType = this.sColumnTypes.split(',');
        for (var i = 0; i < columnsType.length; i++)
            if (columnsType[i] === "ch")
                this.indexCheckboxColumn = i;
    }
    // Parameters for Widget Mode
    if (this.bIsWidget) {
        var bExportIntoANewTab = ("exportIntoNewTab" in aVariables) ? aVariables.exportIntoNewTab : false;
        this.bDisplayFilters = ("displayFilters" in aVariables) ? aVariables.displayFilters : false;
        // vertical toolbar 
        this.mainToolbar = new CToolbar({
            sIdDivToolbar: "mainToolbarTableViewWidget" + this.idTable,
            sIconPath: _url("/temp_resources/models/TxTableView/imgs/"),
            iIconSize: 18,
            btns: [
                { sId: "btnOpenIntoNewTab", iBtnType: tbtSimple, sHint: _("Ouvrir dans un nouvel onglet"), sImgEnabled: "18x18_OpenInNewTab.png", bHide: !bExportIntoANewTab },
                { sId: "btnSave", iBtnType: tbtSimple, sHint: _("Sauvegarder"), sImgEnabled: "24x24_Save.png", sImgDisabled: "24x24_Save-Gray.png", bDisabled: true, bHide: !self.bIsEditionMode },
                { sId: "btnCancel", iBtnType: tbtSimple, sHint: _("Annuler les modifications"), sImgEnabled: "24x24_Cancel.png", sImgDisabled: "24x24_Cancel-Gray.png", bDisabled: true, bHide: !self.bIsEditionMode },
                { sId: "btnRefresh", iBtnType: tbtSimple, sHint: _("Rafraîchir"), sImgEnabled: "24x24_Refresh.png" },
                { sId: "btnExport", iBtnType: tbtSimple, sHint: _("Exporter les Entités affichées..."), sImgEnabled: "24x24_Exportation.png", bHide: !bExportationData },
                { sId: "btnCheckAll", iBtnType: tbtSimple, sHint: _("Cocher toutes les Entités"), sImgEnabled: "24x24_CheckAllObjects.png", bHide: !bIsChechboxColumn },
                { sId: "btnUncheckAll", iBtnType: tbtSimple, sHint: _("Décocher toutes les Entités"), sImgEnabled: "24x24_UncheckAllObjects.png", bHide: !bIsChechboxColumn },
                { sId: "btnSepAppliModel", iBtnType: tbtSeparator, iPos: 20 }
            ],
            onClick: function (aIdButton) { self.onClickMainToolbarButton(aIdButton, this); }
        });
        // Change CSS to make a vertical toolbar
        J("#mainToolbarTableViewWidget" + this.idTable).addClass("wrap_img_OpenTab");
        J("#mainToolbarTableViewWidget" + this.idTable).children(".float_left").children().each(function () {
            if (J(this).hasClass("dhx_toolbar_sep"))
                J(this).addClass("sepButtonVerticalToolbar");
        });
        J("#mainToolbarTableViewWidget" + this.idTable).children(".dhxtoolbar_hdrline_ll, .dhxtoolbar_hdrline_rr, .dhxtoolbar_hdrline_l, .dhxtoolbar_hdrline_r").hide();


    } else { // if not a widget, it's a new tab
        window.parent.document.title = this.sTableViewName;
        J("#id_div_tableName").html(this.sTableViewName);
        this.bDisplayFilters = true;
		if (this.iObjectsPreselectionType == 3 || this.iObjectsPreselectionType == 5) {
			if(this.iObjectsPreselectionType == 3){ // MCS
				J("#id_ind_MCS").children().first().html(format(_("Sélection multicritère : #1. Sélection de #2 Entités sur un total de #3 Entités."), [this.sNameRL, this.iRowsTotalCount, this.iTotalNbOTObjects]));
				J("#id_ind_MCS").children().first().attr("title", "" + _("Activation d'une sélection multicritère à partir du cahier des charges") + " : \"" + this.sNameRL + "\".");
			} else if (this.iObjectsPreselectionType == 5) { // specific query
				J("#id_ind_MCS").children().first().html(format(_("Sélection de #1 Entités sur un total de #2 Entités."), [self.iRowsTotalCount, self.iTotalNbOTObjects]));
			}
			J("#id_ind_MCS").show();
			// init onclick event
			J("#onoffswitch_3").click(function () { self.setMSCIndicator(this); });
		}
        // init main toolbar
        this.mainToolbar = new CToolbar({
            sIdDivToolbar: "MainToolbarButtons",
            sIconPath: _url("/temp_resources/models/TxTableView/imgs/"),
			iIconSize: 24,
			sSkin: "dhx_web",
            btns: [
                { sId: "btnSave", iBtnType: tbtSimple, sHint: _("Sauvegarder"), sImgEnabled: "24x24_Save.png", sImgDisabled: "24x24_Save-Gray.png", bDisabled: true, bHide: !this.bIsEditionMode },
                { sId: "btnCancel", iBtnType: tbtSimple, sHint: _("Annuler les modifications"), sImgEnabled: "24x24_Cancel.png", sImgDisabled: "24x24_Cancel-Gray.png", bDisabled: true, bHide: !this.bIsEditionMode },
                { sId: "btnRefresh", iBtnType: tbtSimple, sHint: _("Rafraîchir"), sImgEnabled: "24x24_Refresh.png" },
                { sId: "btnRemoveFilters", iBtnType: tbtSimple, sHint: _("Supprimer tous les filtres"), sImgEnabled: "24x24_Remove_Filters.png" },
                { sId: "btnExport", iBtnType: tbtSimple, sHint: _("Exporter les Entités affichées..."), sImgEnabled: "24x24_Exportation.png", bHide: !bExportationData },
                { sId: "btnCheckAll", iBtnType: tbtSimple, sHint: _("Cocher toutes les Entités"), sImgEnabled: "24x24_CheckAllObjects.png", bHide: !bIsChechboxColumn },
                { sId: "btnUncheckAll", iBtnType: tbtSimple, sHint: _("Décocher toutes les Entités"), sImgEnabled: "24x24_UncheckAllObjects.png", bHide: !bIsChechboxColumn },
                { sId: "btnSepAppliModel", iBtnType: tbtSeparator, iPos: 20 }
            ],
            onClick: function (aIdButton) { self.onClickMainToolbarButton(aIdButton, this); }
        });
    }
    if (this.iObjectsPreselectionType === 4)
        this.mainToolbar.hideItem("btnRefresh"); // in "RawData" mode, we can't refresh data
    //add new application models buttons
    var iStartPos = 21;
    var jApplicationModelsButtons = ("jAMButtons" in aVariables) ? aVariables.jAMButtons : [];
    J.each(jApplicationModelsButtons, function (aIndex, aBtn) {
        aBtn.sId = format("applicationModel#1", [aBtn.ID]);
        aBtn.sHint = aBtn.sName;
        if (isAssigned(aBtn.sDescription))
            aBtn.sHint = qc(aBtn.sHint, aBtn.sDescription, "\n");
        var sIcon = getValue(aBtn.sIconRFilePath, "24x24_No_Model.bmp");
        aBtn.sImgEnabled = format("../../../../temp_resources/models/#1", [sIcon]);
        aBtn.iPos = iStartPos;
        self.mainToolbar.addButton(aBtn);
        iStartPos++;
    });
    // SMC buttons
    var bDisplayMCSButton = ("displayMCSButton" in aVariables) ? aVariables.displayMCSButton : false;
    if (!this.bIsWidget && !bDisplayMCSButton) {
        J("#id_ind_MCS").hide();
    }
}

CTableView.prototype.applyGridAndToolbarCss = function () {
    if (this.iRowsTotalCount <= this.iNbRowPerPage) {
        J('#' + this.sIdDivToolbar).hide();
        J('#' + this.sIdDivGrid).addClass('widgetWithoutToolbar');
    } else {
        J('#' + this.sIdDivGrid).addClass('widgetWithToolbar');
    }
}

CTableView.prototype.createWidgetHtml = function () {
    this.sIdDivGrid += "_" + this.idTable;
    this.sIdDivToolbar += "_" + this.idTable;

    var sHtml = '<div class="sousWrapperWidgetTableView">' +
                    '<div class="parent_Widget_Table">' +
                        '<div id="' + this.sIdDivGrid + '" class="div_TxTableGrid div_TxTableGrid_widget" IDTableView="' + this.idTable + '"></div>' +
                        '<div id="' + this.sIdDivToolbar + '" class="div_TxTableGridToolbar"></div>' +
                    '</div>' +
                    '<div id="mainToolbarTableViewWidget' + this.idTable + '"></div>' +
                '</div>' +
                '<div id="divLayoutWidget_' + this.idTable + '" class="layout_Widget_Table">' +
                    '<img src="' + _url("/resources/theme/img/dhtmlx/layout/dhxlayout_progress.gif") + '" class="imgLoadingWidget"/>' +
                    '<div class="dataLoadingsInfo">' + _("Chargements des données...") + '</div>' +
                '</div>';

    J("#" + this.sIdDivParent).html(sHtml);
}

CTableView.prototype.onClickMainToolbarButton = function (aIdButton, aThis) {
    switch (aIdButton) {
        case "btnOpenIntoNewTab":
            this.displayTableViewIntoNewTab();
			break;
        case "btnSave":
            this.saveModifiedData();
            break;
        case "btnCancel":
            this.cancelDataModified();
            break;
        case "btnRefresh":
            this.refresh();
            break;
        case "btnRemoveFilters":
            this.deleteAllFilters();
            break;
        case "btnExport":
            this.displayWebExportation();
            break;
        case "btnCheckAll":
            this.checkAll();
            break;
        case "btnUncheckAll":
            this.uncheckAll();
            break;
        default:
            //case of application Model.
            if (inStr(aIdButton, "applicationModel")) {
                var rBtn = this.mainToolbar.getButton(aIdButton);
                var idApplicationModel = rBtn.ID;
                var sIdObjects = this.dhxGrid.getSelectedRowId();
                if (sIdObjects === null) sIdObjects = '0';
                // save last item clicked
                var elementId = J(aThis)[0].idPrefix + aIdButton;
                var objPull = J(aThis)[0].objPull;
                if (objPull[elementId])
                    J.lastMainToolbarItemClicked = objPull[elementId].obj;

                this.launchModelApplication(rBtn.ID, rBtn.sObjectDependency, sIdObjects.split(","));
            }
            break;
    }
    return true;
}

CTableView.prototype.checkAll = function () {
    var self = this;
    if (this.indexCheckboxColumn !== -1) {
        this.dhxGrid.setCheckedRows(this.indexCheckboxColumn, 1);
        J.ajax({
            url: sPathFileTableViewAjaxASP,
            async: true,
            cache: false,
            dataType: 'html',
            data: {
                sFunctionName: 'setAllCheckedState',
                idTable: self.idTable,
                idColumn: self.indexCheckboxColumn,
                iState: "1"
            },
            success: function (data) {
                var results = data.split('|');
                if (results[0] !== sOk)
                    msgError(results[0]);
            }
        });
    }
}

CTableView.prototype.uncheckAll = function () {
    var self = this;
    if (this.indexCheckboxColumn !== -1) {
        this.dhxGrid.setCheckedRows(this.indexCheckboxColumn, 0);
        J.ajax({
            url: sPathFileTableViewAjaxASP,
            async: true,
            cache: false,
            dataType: 'html',
            data: {
                sFunctionName: 'setAllCheckedState',
                IdTable: self.idTable,
                IdColumn: self.indexCheckboxColumn,
                iState: "0"
            },
            success: function (data) {
                var results = data.split('|');
                if (results[0] !== sOk)
                    msgError(results[0]);
            }
        });
    }
}

CTableView.prototype.getAllChechedRows = function () {
    var self = this,
        sRowIds = '';
    if (this.indexCheckboxColumn !== -1) {
        J.ajax({
            url: sPathFileTableViewAjaxASP,
            async: false,
            cache: false,
            dataType: 'html',
            data: {
                sFunctionName: 'getAllChechedRows',
                IdTable: self.idTable,
                IdColumn: self.indexCheckboxColumn
            },
            success: function (data) {
                var results = data.split('|');
                if (results[0] == sOk) {
                    if (results.length > 1)
                        sRowIds = results[1];
                } else
                    msgError(results[0]);
            }
        });
    }
    return sRowIds;
}

CTableView.prototype.setPageCount = function (aPageCount) {
    if (aPageCount) {
        this.iPageCount = aPageCount;
        if (this.iPageCount < 2)
            this.dhxToolbar.forEachItem(function (aId) {
                this.disableItem(aId);
            });
    }
}

// Get the Filter Object for a specific column (column index)
CTableView.prototype.getFilter = function (aIdColumn) {
    for (var i = 0; i < this.arrTableViewFilter.length; i++) {
        if (this.arrTableViewFilter[i].idColumn == aIdColumn) {
            return this.arrTableViewFilter[i];
        }
    }
}

// Get the Data Object for a specific cell (row id and column index)
CTableView.prototype.getTableViewData = function (aIdRow, aIdColumn) {
    var rTableViewData;
    for (var j = 0; j < this.arrTableViewData.length; j++) {
        rTableViewData = this.arrTableViewData[j];
        if (rTableViewData.idRow === aIdRow && rTableViewData.idColumn === aIdColumn) {
            return rTableViewData;
        }
    }
}

CTableView.prototype.getJsonGridData = function () {
    var self = this;
    this.activeProgressLayout();
    J.ajax({
        url: sPathFileTableViewAjaxASP,
        async: true,
        cache: false,
        dataType: 'json',
        data: {
            sFunctionName: 'LoadTableView',
            IdTable: self.idTable
        },
        success: function (data) {
            self.loadGridData(data);
            self.updateButtonsState("first");
            self.desactiveProgressLayout();
        },
        error: function (a, b, error) {
            msgDevError("Erreur Load Table for ID : " + self.idTable + ". " + error);
            self.desactiveProgressLayout();
        }
    });
}

// Reload grid data with Json
CTableView.prototype.loadGridData = function (aJson) {
    var self = this;
    // Set icons status for edition if data modified 
    var checkEditionImageStatus = function () {
        var rTableViewData;
        for (var j = 0; j < self.arrTableViewData.length; j++) {
            rTableViewData = self.arrTableViewData[j];
            if (rTableViewData.bModified) {
                if (self.dhxGrid.getRowIndex(rTableViewData.idRow) != -1) {
                    J(self.dhxGrid.cells(rTableViewData.idRow, 1).cell).find('img').attr('src', _url('/temp_resources/models/TxTableView/imgs/16x16_Save.png'));
                    J(self.dhxGrid.cells(rTableViewData.idRow, 2).cell).find('img').attr('src', _url('/temp_resources/models/TxTableView/imgs/16x16_Cancel.png'));
                }
            }
        }
    }
    // Remove events on grid from edition of cells AND remove edited status for all cells
    var removeAllEventsFromEdition = function () {
        for (var i = 0; i < self.arrTableViewData.length; i++) {
            if (self.arrTableViewData[i].idEvRS !== null) {
                self.dhxGrid.detachEvent(self.arrTableViewData[i].idEvRS);
                self.arrTableViewData[i].idEvRS = null;
                if (self.arrTableViewData[i].dhxPopupInput)
                    selfis.arrTableViewData[i].dhxPopupInput.hide();
            }
            if (self.arrTableViewData[i].bEdited)
                self.arrTableViewData[i].bEdited = false;
        }
    }

    this.jTableViewData = aJson;
    removeAllEventsFromEdition();
    this.dhxGrid.clearAll();
    this.dhxGrid.parse(aJson, "json");
    // update image status after reload data
    checkEditionImageStatus();
}

CTableView.prototype.updateButtonsState = function (aState) {
    var self = this;
    if (this.iPageCount < 2) {
        this.dhxToolbar.forEachItem(function (aStringId) {
            self.dhxToolbar.disableItem(aStringId);
        });
    } else {
        this.dhxToolbar.forEachItem(function (aStringId) {
            self.dhxToolbar.enableItem(aStringId);
        });
        switch (aState) {
            case "first":
                this.dhxToolbar.disableItem("first");
                this.dhxToolbar.disableItem("prev");
                this.iCurrentPage = 0;
                break;
            case "prev":
                if (this.iCurrentPage == 1) {
                    this.dhxToolbar.disableItem("prev");
                    this.dhxToolbar.disableItem("first");
                }
                this.iCurrentPage -= 1;
                break;
            case "next":
                if (this.iCurrentPage == this.iPageCount - 2) {
                    this.dhxToolbar.disableItem("next");
                    this.dhxToolbar.disableItem("last");
                }
                this.iCurrentPage += 1;
                break;
            case "last":
                this.dhxToolbar.disableItem("last");
                this.dhxToolbar.disableItem("next");
                this.iCurrentPage = this.iPageCount - 1;
                break;
            default:
                var iPageNumber = parseInt(aState);
                if (iPageNumber == 0) {
                    this.dhxToolbar.disableItem("first");
                    this.dhxToolbar.disableItem("prev");
                } else if (iPageNumber == this.iPageCount - 1) {
                    this.dhxToolbar.disableItem("last");
                    this.dhxToolbar.disableItem("next");
                }
                this.iCurrentPage = iPageNumber;
                break;
        }
        this.dhxToolbar.setItemText("pages", _("Page n°") + (this.iCurrentPage + 1));
        this.dhxToolbar.setListOptionSelected("pages", this.iCurrentPage);
    }
}

CTableView.prototype.sortColumn = function (aIdColumn, aSortAsc) {
    var GetSortType = function (aColSort, aDirection) {
        /** TSort_Type = 0:stUndefined | 1:stID_Asc |2:stID_Desc | 3:stOrder_Asc | 4:stOrder_Desc | 5:stName_Asc | 6:stName_Desc | 7:stParent | 8:stParent_Desc **/
        switch (aColSort) {
            case "str":
                if (aDirection == "asc")
                    return 5
                else
                    return 6
                break;
        }
    };

    var self = this,
        sDirection = (aSortAsc) ? "asc" : "desc",
        iSortType = GetSortType("str", sDirection);
    this.sSortDirection = sDirection;
    this.iCurrentColSorted = aIdColumn;
    J.ajax({
        url: sPathFileTableViewAjaxASP,
        async: false,
        cache: false,
        dataType: "html",
        data: {
            sFunctionName: "ApplySorting",
            IdTable: self.idTable,
            IdColumn: aIdColumn,
            iSortType: iSortType
        },
        success: function (data) {
            var arrResult = data.split("|");
            if (arrResult[0] == sOk) {
                self.getJsonGridData();
            } else
                msgError(arrResult[0]);
        }
    });
    this.updateButtonsState("first");
    this.dhxGrid.setSortImgState(true, this.iCurrentColSorted, this.sSortDirection, 1);  
}

CTableView.prototype.clearFilters = function () {
    var rFilter;
    for (var i = 0 ; i < this.arrTableViewFilter.length ; i++) {
        rFilter = this.arrTableViewFilter[i];
        rFilter.clear();
    }
}

// Display of cells according to multiline columns attribute after loading row data
CTableView.prototype.setCellsMultilineOnRow = function (aIdRow) {
    var self = this;
    var sArrMulitline = this.sMultiline.split(',');
    for (var i = 0; i < sArrMulitline.length; i++) {
        if (this.bIsEditionMode || parseInt(sArrMulitline[i]) === 0) {
            this.dhxGrid.cells(aIdRow, i).cell.setAttribute("class", "not_m_line");
        } else {
            this.dhxGrid.cells(aIdRow, i).cell.setAttribute("class", "is_m_line");
            var sCellValue = this.dhxGrid.cells(aIdRow, i).getValue();
            if (sCellValue.length > 100) {
                this.dhxGrid.cells(aIdRow, i).setValue(sCellValue.substring(0, 200) + "...");
                this.dhxGrid.cells(aIdRow, i).setAttribute("title", sCellValue);
            }
        }
    }
}

// Change content of a specific row according to new Json object data
CTableView.prototype.updateRow = function (aJson, aIdObject) {
    var self = this,
        idRow = 0,
        rTableViewData;
    aJson.rows.forEach(function (aRow) {
        for (var i = 0; i < self.dhxGrid.getRowsNum() ; i++) {
            idRow = self.dhxGrid.getRowId(i);
            if (idRow == aRow.id) {
                // Get "data" attribute of "row" attribute in Json variable
                var arrData = aRow.data;
                for (var j = 0; j < arrData.length; j++) {
                    // test if data is a JsonObject or a text value
                    if (typeof arrData[j] == 'object') {
                        self.dhxGrid.cells(idRow, j).setValue(arrData[j].value);
                        // Update specific attributes of cell from Json properties
                        for (var key in arrData[j]) {
                            if (key == "style") {
                                self.dhxGrid.cells(idRow, j).cell.setAttribute("style", arrData[j][key]);
                            } else if (key == "type") {
                                self.dhxGrid.setCellExcellType(idRow, j, arrData[j][key]);
                            } else if (key != "value") {
                                self.dhxGrid.cells(idRow, j).setAttribute(key, arrData[j][key]);
                            }
                        }
                    } else {
                        self.dhxGrid.cells(idRow, j).setValue(arrData[j]);
                    }
                    if (self.isDataObjectInit(idRow, j)) {
                        rTableViewData = self.getTableViewData(idRow, j);
                        rTableViewData.bToRefresh = true;
                    }
                }
                break;
            }
        }
    });
}

// Add a new row in table according to new Json object data
CTableView.prototype.addNewRow = function (aJson) {
    var indexRowSelected = this.dhxGrid.getRowIndex(this.dhxGrid.getSelectedRowId()),
        idRow = aJson.rows[0].id,
        arrData = aJson.rows[0].data,
        arrRowValues = [];

    for (var j = 0; j < arrData.length; j++) {
        // test if data is a JsonObject or a text value
        if (typeof arrData[j] == 'object')
            arrRowValues.push(arrData[j].value);
        else
            arrRowValues.push(arrData[j]);
    }
    // Create new Row with row values, after the row selected
    this.dhxGrid.addRow(aJson.rows[0].id, arrRowValues, indexRowSelected + 1);

    // Update specific attributes of cell from Json properties
    for (var j = 0; j < arrData.length; j++) {
        // test if data is a JsonObject or a text value
        if (typeof arrData[j] == 'object') {
            for (var key in arrData[j]) {
                if (key == "style") {
                    this.dhxGrid.cells(idRow, j).cell.setAttribute("style", arrData[j][key]);
                } else if (key == "type") {
                    this.dhxGrid.setCellExcellType(idRow, j, arrData[j][key]);
                } else if (key != "value") {
                    this.dhxGrid.cells(idRow, j).setAttribute(key, arrData[j][key]);
                }
            }
        }
        // else no attributes
    }
}

// Get Modification in TableView into Json Data
CTableView.prototype.getJsonModifiedData = function (aIdRow) {
    var jsonObj = [],
        rTableViewData,
        itemData, bDeleteData, sNewValue;

    for (var j = 0; j < this.arrTableViewData.length; j++) {
        rTableViewData = this.arrTableViewData[j];
        if ((aIdRow && (inArray(aIdRow, rTableViewData.idRow)) && rTableViewData.bModified) || (!aIdRow && rTableViewData.bModified)) {
            itemData = {}
            bDeleteData = rTableViewData.bToDelete;
            sNewValue = rTableViewData.sNewValue;
            switch (rTableViewData.sType) {
                case "customBool":
                    if (sNewValue == '2') bDeleteData = true;
                    break;
                case "clist":
                    sNewValue = sNewValue.replace(/,/g, ';');
                    break;
                case "customCalendar":
                    sNewValue = rTableViewData.fValue;
                    break;
                case "customTree":
                    sNewValue = rTableViewData.sIdsTreeChecked;
                    break;
                case "customNumRangeMean":
                    itemData.min = parseFloat(rTableViewData.sMin.replace(',', '.'));
                    itemData.max = parseFloat(rTableViewData.sMax.replace(',', '.'));
                    if (rTableViewData.sMean) {
                        itemData.mean = parseFloat(rTableViewData.sMean.replace(',', '.'));
                    }
                    itemData.idUnit = rTableViewData.idUnit;
                    break;
                case "customNumUnique":
                    itemData.idUnit = rTableViewData.idUnit;
                    itemData.min = parseFloat(rTableViewData.sNewValue.replace(',', '.'));
                    break;
                default:
                    if (sNewValue == "") bDeleteData = true;
            }
            itemData.idRow = rTableViewData.idRow;
            itemData.idColumn = rTableViewData.idColumn;
            itemData.data = sNewValue;
            itemData.deleteData = bDeleteData;
            jsonObj.push(itemData);
        }
    }
    return JSON.stringify(jsonObj);
}

CTableView.prototype.removeModifiedStatut = function (aIdRow) {
    var rTableViewData;
    for (var j = 0; j < this.arrTableViewData.length; j++) {
        rTableViewData = this.arrTableViewData[j];
        if ((aIdRow && (rTableViewData.idRow == aIdRow) && rTableViewData.bModified) || (!aIdRow && rTableViewData.bModified)) {
            rTableViewData.bModified = false;
            rTableViewData.sOldValue = rTableViewData.sNewValue;
            switch (rTableViewData.sType) {
                case "customTree":
                    rTableViewData.sOldIdsTreeChecked = rTableViewData.sIdsTreeChecked;
                    break;
                case "customNumRangeMean":
                    rTableViewData.sOldMin = rTableViewData.sMin;
                    rTableViewData.sOldMax = rTableViewData.sMax;
                    rTableViewData.sOldMean = rTableViewData.sMean;
                    rTableViewData.idOldUnit = rTableViewData.idUnit;
                    rTableViewData.fOldLowerBound = rTableViewData.fLowerBound;
                    rTableViewData.fOldUpperBound = rTableViewData.fUpperBound;
                    break;
                case "customNumUnique":
                    rTableViewData.sOldMin = rTableViewData.sMin;
                    rTableViewData.idOldUnit = rTableViewData.idUnit;
                    rTableViewData.fOldLowerBound = rTableViewData.fLowerBound;
                    rTableViewData.fOldUpperBound = rTableViewData.fUpperBound;
                    break;
            }
        }
    }
}

CTableView.prototype.changeDataModifiedByOldValue = function (aIdRow) {
    var jsonObj = [],
        itemData, rTableViewData;
    for (var j = 0; j < this.arrTableViewData.length; j++) {
        rTableViewData = this.arrTableViewData[j];
        if ((aIdRow && (rTableViewData.idRow === aIdRow) && rTableViewData.bModified) || (!aIdRow && rTableViewData.bModified)) {
            rTableViewData.sNewValue = rTableViewData.sOldValue;
            itemData = {}
            if (rTableViewData.sType === 'customBool') {
                this.dhxGrid.cells(rTableViewData.idRow, rTableViewData.idColumn).removeState(rTableViewData.sOldValue);
            } else {
                this.dhxGrid.cells(rTableViewData.idRow, rTableViewData.idColumn).setValue(rTableViewData.sOldValue);
            }
            rTableViewData.bModified = false;
            if (rTableViewData.sType === 'customTree') {
                rTableViewData.sIdsTreeChecked = rTableViewData.sOldIdsTreeChecked;
                itemData.checkedIds = rTableViewData.sIdsTreeChecked;
            } else if (rTableViewData.sType === 'customNumRangeMean') {
                rTableViewData.sMin = rTableViewData.sOldMin;
                rTableViewData.sMax = rTableViewData.sOldMax;
                rTableViewData.sMean = rTableViewData.sOldMean;
                rTableViewData.idUnit = rTableViewData.idOldUnit;
                this.dhxGrid.cells(rTableViewData.idRow, rTableViewData.idColumn).setAttribute('idUnit', rTableViewData.idOldUnit);
                rTableViewData.fLowerBound = rTableViewData.fOldLowerBound;
                rTableViewData.fUpperBound = rTableViewData.fOldUpperBound;
            } else if (rTableViewData.sType === 'customNumUnique') {
                rTableViewData.sMin = rTableViewData.sOldMin;
                rTableViewData.idUnit = rTableViewData.idOldUnit;
                this.dhxGrid.cells(rTableViewData.idRow, rTableViewData.idColumn).setAttribute('idUnit', rTableViewData.idOldUnit);
                rTableViewData.fLowerBound = rTableViewData.fOldLowerBound;
                rTableViewData.fUpperBound = rTableViewData.fOldUpperBound;
            }
            itemData.idRow = rTableViewData.idRow;
            itemData.idColumn = rTableViewData.idColumn;
            itemData.data = rTableViewData.sOldValue;
            jsonObj.push(itemData);
        }
    }
    this.updateCellValue(JSON.stringify(jsonObj));
}

// Check if there is one or more Cell modified in all TableView
CTableView.prototype.isOneOrMoreAttObjectModified = function () {
    for (var i = 0; i < this.arrTableViewData.length; i++) {
        if (this.arrTableViewData[i].bModified) {
            return true;
        }
    }
    return false;
}

// Check if there is one or more Cell modified in the specified row
CTableView.prototype.isOneOrMoreAttObjectModifiedForRows = function (aIdRows) {
    for (var i = 0; i < this.arrTableViewData.length; i++) {
        if (inArray(aIdRows,this.arrTableViewData[i].idRow) && (this.arrTableViewData[i].bModified)) {
            return true;
        }
    }
    return false;
}

CTableView.prototype.afterEditCell = function (aTableViewData) {
    aTableViewData.bModified = true;
    var sIdsChecked = "";
    if (aTableViewData.sType === "customTree") {
        sIdsChecked = aTableViewData.sIdsTreeChecked;
    }
    // We need to update the cell Value to server for filter and paging
    var jsonObj = [{
        idRow: aTableViewData.idRow,
        idColumn: aTableViewData.idColumn,
        data: aTableViewData.sNewValue,
        checkedIds: sIdsChecked
    }];
    this.updateCellValue(JSON.stringify(jsonObj));
    // update Image Status for edition
    this.changeEditionImageStatus(true, aTableViewData.idRow);
}

CTableView.prototype.updateContextMenu = function (aIdColumn, aIdRow) {
    var self = this;
    J.ajax({
        url: sPathFileTableViewAjaxASP,
        async: false,
        cache: false,
        dataType: "html",
        data: {
            sFunctionName: "GetXmlObjectsToBrowse",
            IdTable: self.idTable,
            IdColumn: aIdColumn,
            IdRow: aIdRow
        },
        success: function (data) {
            self.dhxContextMenu.clearAll();
            var arrResult = data.split("|");
            if (arrResult[0] == 'ok') {
                var cellData = JSON.parse(arrResult[1]);
                if (cellData.length > 0) {
                    var xml = J(J.parseXML('<?xml version="1.0" ?><menu />'));
                    var xmlMenu = J('menu',xml),
                        itemAttr;
                    cellData.forEach(function (aItemMenu, aIndexItem) {
                        if (aItemMenu.iTypeData === C_TD_Data_Email) {
                            // add nav item
                            itemAttr = { id: 'navItem', text: _("Envoyer à") + "..." };
                            xmlMenu.append(J('<item />', xml).attr(itemAttr));
                            var mailData = aItemMenu.sRawText.split(' ; ');
                            mailData.forEach(function (aMail, aIndex) {
                                itemAttr = { id: 'mail_' + aIndex, text: aMail };
                                J('#navItem',xmlMenu).append(J('<item />',xml).attr(itemAttr).append(J('<href />', xml).text("mailto:"+aMail)));
                            });
                            return true;
                        } else if (aItemMenu.iTypeData === C_TD_Data_URL) {
                            // add nav item
                            itemAttr = { id: 'navItem', text: _("Aller à") + "..." };
                            xmlMenu.append(J('<item />', xml).attr(itemAttr));
                            var urlData = aItemMenu.sRawText.split(' ; ');
                            urlData.forEach(function (aUrl, aIndex) {
                                itemAttr = { id: 'url' + aIndex, text: aUrl };
                                if (aUrl.substring(0, 4) !== 'http')
                                    aUrl = 'http://' + aUrl;
                                J('#navItem', xmlMenu).append(J('<item />', xml).attr(itemAttr).append(J('<href />', xml).text(aUrl).attr({ target: "blank" })));
                            });
                            return true;
                        } else if (aItemMenu.AF) { // File
                            if (aIndexItem == 0) {// add nav item
                                itemAttr = { id: 'navItem', text: _("Ouvrir") + "..." };
                                xmlMenu.append(J('<item />', xml).attr(itemAttr));
                            }
                            itemAttr = { id: 'file_' + aItemMenu.AF.ID, text: aItemMenu.AF.sFileName };
                            J('#navItem', xmlMenu).append(J('<item />', xml).attr(itemAttr));
                        } else { // Data Link
                            if (aIndexItem == 0) {// add nav item
                                itemAttr = { id: 'navItem', text: _("Aller à") + "..." };
                                xmlMenu.append(J('<item />', xml).attr(itemAttr));
                            }
                            itemAttr = { id: 'link_' + aItemMenu.ID, text: aItemMenu.sName };
                            J('#navItem', xmlMenu).append(J('<item />', xml).attr(itemAttr));
                        }

                    });
                    self.dhxContextMenu.loadXMLString((new XMLSerializer()).serializeToString(xml.context));
                }
                
            } else if (arrResult[0] != 'ko')
                msgError(arrResult[0]);
        }
    });
}

CTableView.prototype.updateToolbarButtons = function () {
    var self = this;
    if (this.iPageCount < 2) {
        this.dhxToolbar.forEachItem(function (AsID) {
            self.dhxToolbar.disableItem(AsID);
        });
    } else {
        this.dhxToolbar.forEachItem(function (AsID) {
            self.dhxToolbar.enableItem(AsID);
        });
        if (this.iCurrentPage == 0) {
            this.dhxToolbar.disableItem("first");
            this.dhxToolbar.disableItem("prev");
        } else if (this.iCurrentPage == (this.iPageCount - 1)) {
            this.dhxToolbar.disableItem("last");
            this.dhxToolbar.disableItem("next");
        }
    }
}

CTableView.prototype.getFilterType = function (aIdColumn) {
    var rFilter;
    for (var i = 0; i < this.arrTableViewFilter.length; i++) {
        if (this.arrTableViewFilter[i].idColumn == aIdColumn) {
            rFilter = this.arrTableViewFilter[i];
            break;
        }
    }
    if (rFilter)
        return rFilter.iFilterType;
    else
        return -1;
}

// Check if the Cell Object is Already initialize (in variable this.arrTableViewData)
CTableView.prototype.isDataObjectInit = function (aIdRow, aIdColumn) {
    for (var i = 0; i < this.arrTableViewData.length; i++) {
        if (this.arrTableViewData[i].idRow == aIdRow && this.arrTableViewData[i].idColumn == aIdColumn) {
            return true;
        }
    }
    return false;
}

// Update the content of a cell to the server (but not in DataBase)
CTableView.prototype.updateCellValue = function (aJson) {
    var self = this;
    J.ajax({
        url: sPathFileTableViewAjaxASP,
        type: 'post',
        async: true,
        cache: false,
        dataType: 'html',
        data: {
            sFunctionName: 'UpdateCellValue',
            idTable: self.idTable,
            JSON: aJson
        },
        success: function (data) {
            var arrResult = data.split("|");
            if (arrResult[0] != "ok") {
                msgError(arrResult[0]);
            }
        }
    });
}

CTableView.prototype.activeProgressLayout = function() {
    if (this.dhxMainLayout) {
        this.dhxMainLayout.progressOn();
    } else {
        J("#divLayoutWidget_" + this.idTable).fadeIn(500);
    }
}

CTableView.prototype.desactiveProgressLayout = function () {
    if (this.dhxMainLayout) {
        this.dhxMainLayout.progressOff();
    } else {
        J("#divLayoutWidget_" + this.idTable).fadeOut(500);
    }
}

CTableView.prototype.refresh = function () {
    var self = this;
    if (this.bIsEditionMode && this.isOneOrMoreAttObjectModified()) {
        msgYesNo(_("Des données ont été modifiées. \nEnregistrer les modifications du tableau avant de rafraîchir ?"), function (aConfirm) {
            self.doSaveAndRefresh(aConfirm);
        }, {});
    } else {
        this.doRefresh();
    }
}

CTableView.prototype.doRefresh = function () {
    var self = this;
    this.activeProgressLayout();
    J.ajax({
        url: sPathFileTableViewAjaxASP,
        async: true,
        cache: false,
        dataType: 'html',
        data: {
            sFunctionName: 'RefreshTableView',
            IdTable: self.idTable
        },
        success: function (data) {
            var arrResults = data.split("|");
            if (arrResults[0] == sOk) {
                // update numbers of rows..
                self.iTotalNbOTObjects = parseInt(arrResults[2]);
                self.iVisibleRowsCount = parseInt(arrResults[3]);
                self.iRowsTotalCount = parseInt(arrResults[4]);
                self.updateRowsNbInInterface();
                // refresh data
                self.loadGridData(JSON.parse(arrResults[1]));
                self.updateButtonsState("first");
            } else {
                msgError(arrResults[0]);
            }
            self.desactiveProgressLayout();
        }
    });
}

CTableView.prototype.doSaveAndRefresh = function (aConfirm) {
    var self = this;
    if (aConfirm) {
        self.activeProgressLayout();
        J.ajax({
            url: sPathFileTableViewAjaxASP,
            type: 'post',
            async: true,
            cache: false,
            dataType: 'html',
            data: {
                sFunctionName: 'SaveAndRefresh',
                IdTable: self.idTable,
                jsonData: self.getJsonModifiedData()
            },
            success: function (data) {
                var arrResults = data.split("|");
                if (arrResults[0] == sOk) {
                    // update numbers of rows..
                    self.iTotalNbOTObjects = parseInt(arrResults[2]);
                    self.iVisibleRowsCount = parseInt(arrResults[3]);
                    self.iRowsTotalCount = parseInt(arrResults[4]);
                    self.updateRowsNbInInterface();
                    // remove modified statut of attributes when saving is successful
                    self.removeModifiedStatut();
                    self.changeEditionImageStatus(false);
                    // reload data
                    self.loadGridData(JSON.parse(arrResults[1]));
                    self.updateButtonsState("first");
                } else {
                    msgError(arrResults[0]);
                }
                self.desactiveProgressLayout();
            }
        });
    } else {
        this.doCancelDataModified(true, {});
        this.doRefresh();
    }
}

CTableView.prototype.updateRowsNbInInterface = function () {
    // Update Pages
    this.dhxToolbar.setItemText("pageCount", _("Nombre de page(s) :") + this.iPageCount);
    var arrPageOptions = [];
    for (var i = 0 ; i < this.iPageCount ; i++) {
        arrPageOptions.push(["" + i, "obj", _("Page n°") + (i + 1), "../png/leaf.gif"]);
    }
    this.dhxToolbar.removeItem("pages");
    this.dhxToolbar.addButtonSelect("pages", 5, _("Page n°") + (this.iCurrentPage + 1), arrPageOptions, "../png/leaf.gif", "", true, false, 20);
    this.dhxToolbar.setItemToolTip("pages", _("Sélectionner une page"), "", "", false, false);
    // Update Objects numbers
    var sTextRowCount = format(_("#1 Entités affichées sur #2 filtrées sur un total de #3 Entités"), [this.dhxGrid.getRowsNum(), this.iVisibleRowsCount, this.iRowsTotalCount]);
    this.dhxToolbar.setItemText("rowCount", sTextRowCount);
    if (!this.bIsWidget && J("#onoffswitch_3").hasClass('On'))
        J("#id_ind_MCS").children().first().html(format(_("Sélection multicritère : #1. Sélection de #2 Entités sur un total de #3 Entités."), [this.sNameRL, this.iRowsTotalCount, this.iTotalNbOTObjects]));
    // Update Toolbar buttons
    this.updateToolbarButtons();
}

CTableView.prototype.displayObject = function (aIdObject) {
    if (this.bIsWidget) {
        if (typeof txASP == "undefined")
            var txASP = window.parent.txASP;
        txASP.displayObject(aIdObject);
    } else {
        window.opener.txASP.displayObject(aIdObject);
        msgWarning(_("L'Entité est focalisée dans l'onglet TEEXMA."));
    }
}

CTableView.prototype.displayTableViewIntoNewTab = function () {
    parent.window.open(_url('/temp_resources/models/TxTableView/TxTableView.asp?ID=') + this.idTable);
}

CTableView.prototype.displayWebExportation = function () {
    var self = this;
    J.ajax({
        url: sPathFileTableViewAjaxASP,
        async: true,
        cache: false,
        dataType: 'html',
        data: {
            sFunctionName: 'GetsKeyExportation',
            IdTable: self.idTable
        },
        success: function (data) {
            var arrResult = data.split("|");
            var opened = false;
            var jSettings = {
                idOT: arrResult[1],
                sSelectedObjectsKey: arrResult[0]
            }
            // Init window
            var wdowExport = new CWindow({
                sName: "wExportation",
                sHeader: _("Exportation"),
                iWidth: 705,
                iHeight: 490,
                bDenyResize: true,
                bHidePark: true,
                onContentLoaded: function () {
                    if (opened) return;
                    var rDhxWindow = wdowExport.getWindow("wExportation");
                    jSettings.wdow = rDhxWindow;
                    rDhxWindow.getFrame().contentWindow.initInterface(jSettings);
                    opened = true;
                },
                sUrlAttached: _url('/code/TxWebExportation/TxWebExportation.asp')
            });
        }
    });
}

CTableView.prototype.deleteAllFilters = function () {
    var self = this;
    this.activeProgressLayout();
    J.ajax({
        url: sPathFileTableViewAjaxASP,
        async:true,
        cache:false,
        dataType:"html",
        data:{
            sFunctionName: "DeleteAllFilters",
            IdTable: self.idTable
        },
        success:function(data){
            var arrResult = data.split("|");
            if (arrResult[0] == "ok") {
                self.iVisibleRowsCount = arrResult[1];
                self.iPageCount = arrResult[2];
                self.clearFilters();
                self.getJsonGridData();
            } else
                msgError(arrResult[0]);
        }	
    });
}

CTableView.prototype.onClickBtnFirstPage = function () {
    this.displayPage(0);
    this.updateButtonsState("first");
}

CTableView.prototype.onClickBtnPrevPage = function () {
    this.displayPage(this.iCurrentPage - 1);
    this.updateButtonsState("prev");
}

CTableView.prototype.onClickBtnNextPage = function () {
    this.displayPage(this.iCurrentPage + 1);
    this.updateButtonsState("next");
}

CTableView.prototype.onClickBtnLastPage = function () {
    this.displayPage(this.iPageCount - 1);
    this.updateButtonsState("last");
}

CTableView.prototype.onClickBtnSpecificPage = function (aPageNumber) {
    this.displayPage(aPageNumber);
    this.updateButtonsState(aPageNumber);
}

CTableView.prototype.displayPage = function (aPageNumber) {
    var self = this;

    this.activeProgressLayout();
    J.ajax({
        url: sPathFileTableViewAjaxASP,
        async:true,
        cache:false,
        dataType:"json",
        data:{
            sFunctionName: "DisplayPage",
            IdTable: self.idTable,
            iPageNumber: aPageNumber
        },
        success: function (data) {
            self.loadGridData(data);
            self.desactiveProgressLayout();
        },
        error:function(a,b,error){
            msgDevError("TxTableView[displayPage] : "+error);
        } 	
    });
}

CTableView.prototype.freeTableView = function (aClearFilters) {
    var bClearFilters = getValue(aClearFilters, false);
    if (this.heartbeatTimer)
        clearTimeout(this.heartbeatTimer);

    if (!this.bIsWidget || bClearFilters)
        J.ajax({
            url: sPathFileTableViewAjaxASP,
            async:true,
            cache:false,
            dataType:"html",
            data:{
                sFunctionName: "FreeTableView",
                IdTable: this.idTable,
                bIsWidget: this.bIsWidget
            }
        });
}

CTableView.prototype.setMSCIndicator = function (aInput) {
    var self = this;

    // callBack after confirm popup
    var doSetMSCIndicator = function (aConfirm){
        if (aConfirm) {
            // Inverse state On / Off
            J(aInput).toggleClass('On').toggleClass('Off');
            // Get ID of the table which corresponds to the MCS
            var bUseMCS = (J(aInput).hasClass('On')) ? true : false;
            self.activeProgressLayout();
            J.ajax({
                url: sPathFileTableViewAjaxASP,
                async:true,
                cache:false,
                dataType:"html",
                data:{
                    sFunctionName: "SetTableViewMCS",
                    IdTable: self.idTable,
                    bUseMCS: bUseMCS
                },
                success:function(data){
                    var arrResult = data.split("|");
                    if (arrResult[0] == sOk) {
                        // Update number of pages
                        self.iVisibleRowsCount = arrResult[1];
                        self.iRowsTotalCount = arrResult[2];
                        self.iPageCount = arrResult[3];
                        self.updateRowsNbInInterface(); 
                        // Update data
                        self.getJsonGridData();
                        // Update MCS indications
                        if(!bUseMCS){
                            J(aInput).parent().prev().html("" + _("Aucune sélection multicritère n'est appliquée aux données") + ".");
                            J(aInput).parent().prev().attr("title","");
                            J(aInput).parent().attr("title", _("Rétablir la sélection multicritère"));
                        } else if (self.iObjectsPreselectionType == 3 || self.iObjectsPreselectionType == 4) {
							if(self.iObjectsPreselectionType == 3){ // MCS
								J(aInput).parent().prev().html(format(_("Sélection MultiCritère : #1. Sélection de #2 Entités sur un total de #3 Entités."), [self.sNameRL, self.iRowsTotalCount, self.iTotalNbOTObjects]));
								J(aInput).parent().prev().attr("title", _("Activation d'une sélection multicritère à partir du cahier des charges") + " : \"" + self.sNameRL + "\".");
							} else if (self.iObjectsPreselectionType == 4) { // specific query
								J(aInput).parent().prev().html(format(_("Sélection de #1 Entités sur un total de #2 Entités."), [self.iRowsTotalCount, self.iTotalNbOTObjects]));
							}
							J(aInput).parent().attr("title", _("Désactiver la sélection multicritère"));
                        }
                    } else
                        msgError(ArrResult[0]);
                }
            });	
        }
    }

    // Check for popup
    if (this.iTotalNbOTObjects > 1000 && J(aInput).hasClass('On')) {
        msgOkCancel(_("Désactiver la sélection multicritère ? L'ensemble des Entités de ce type sera chargé."), doSetMSCIndicator);
    } else {
        doSetMSCIndicator(true);
    }
}

CTableView.prototype.saveModifiedData = function (aIdRow) {
    var self = this,
        sMessageConfirm = '';
    if (aIdRow) {
        var sSrcImg = J(this.dhxGrid.cells(aIdRow, 1).cell).find('img').attr('src');
        if (sSrcImg.substring(sSrcImg.length - 8) === "Gray.png") { // don't continue if saving is disable 
            return;
        }
        sMessageConfirm = _("Enregistrer les modifications pour la ligne ?");
    } else {
        if (!this.mainToolbar.isEnabled("btnSave"))
            return;
        sMessageConfirm = _("Enregistrer les modifications pour le tableau ?");
    }
    msgOkCancel(sMessageConfirm, function (aConfirm, aDummyData) {
        self.dosaveModifiedData(aConfirm, aDummyData);
    }, {idRow: aIdRow});
}

CTableView.prototype.dosaveModifiedData = function (aConfirm, aDummyData) {
    var self = this;
    if (aConfirm) {
        var aIdRow = (aDummyData.idRow) ? [aDummyData.idRow] : null;
        var jsonData = self.getJsonModifiedData(aIdRow);
        if (!aIdRow) {
            aIdRow = 0;
        }
        // Execute request only if there data into JSON to save
        if (jsonData != '[]') {
            self.activeProgressLayout();
            J.ajax({
                url: sPathFileTableViewAjaxASP,
                type: 'post',
                async:true,
                cache:false,
                dataType:'json',
                data:{
                    sFunctionName: 'SaveModifiedData',
                    idTable: self.idTable,
                    jsonData: jsonData
                },
                success: function (data) {
                    // remove modified statut of data when saving is successful
                    self.removeModifiedStatut(aIdRow);
                    // update Image Status for edition
                    self.changeEditionImageStatus(false, aIdRow);
                    // If there is new data to load
                    if (data.rows) {
                        // Update the row(s) content with the new Json Data
                        self.updateRow(data);	
                    }
                    self.desactiveProgressLayout();
                },
                error: function(a,b,error) {
                    msgDevError("Erreur 'saveModifiedData'. "+error);
                }
            });
        }
    }	
}

CTableView.prototype.cancelDataModified = function (aIdRow) {
    var self = this,
        sMessageConfirm = '';
    if (aIdRow) {
        var sSrcImg = J(this.dhxGrid.cells(aIdRow, 2).cell).find('img').attr('src');
        if (sSrcImg.substring(sSrcImg.length - 8) == "Gray.png") { // don't continue if canceling is disable 
            return;
        }
        sMessageConfirm = _("Annuler les modifications pour la ligne ?");         
    } else {
        if (!this.mainToolbar.isEnabled("btnCancel"))
            return;
        sMessageConfirm = _("Annuler les modifications pour le tableau ?");
    }
    var dummyData = {
        idRow: aIdRow
    };
    msgOkCancel(sMessageConfirm, function (aConfirm, aDummyData) {
        self.doCancelDataModified(aConfirm, aDummyData);
    }, dummyData);
}

CTableView.prototype.doCancelDataModified = function (aConfirm, aDummyData) {
    var self = this;
    if (aConfirm) {
        // cancel all the modification for table or Row
        self.changeDataModifiedByOldValue(aDummyData.idRow);
        // update Image Status for edition 
        self.changeEditionImageStatus(false, aDummyData.idRow);
    }
}

// Update the status for edition images 
CTableView.prototype.changeEditionImageStatus = function (aIsSaving, aIdRow) {
    var isOneOrMoreModified = false;
    // if we need to save : activate image status (color)
    if (aIsSaving) {
        if (aIdRow) { // activate Row images for saving / canceling
            var sSrcImgRow = J(this.dhxGrid.cells(aIdRow, 1).cell).find('img').attr('src');
            if (sSrcImgRow.substring(sSrcImgRow.length - 8) === "Gray.png") {
                J(this.dhxGrid.cells(aIdRow, 1).cell).find('img').attr('src', _url('/temp_resources/models/TxTableView/imgs/16x16_Save.png'));
                J(this.dhxGrid.cells(aIdRow, 2).cell).find('img').attr('src', _url('/temp_resources/models/TxTableView/imgs/16x16_Cancel.png'));
            }
        }
        // and in any case, activate Table images
        if (!this.mainToolbar.isEnabled("btnSave")) {
            this.mainToolbar.setButtonEnable("btnSave", true);
            this.mainToolbar.setButtonEnable("btnCancel", true);
        }
    } else { // or desactivate image status
        if (aIdRow) { // desactivate Row images for saving / canceling
            var sSrcImgRow = J(this.dhxGrid.cells(aIdRow, 1).cell).find('img').attr('src');
            if (sSrcImgRow.substring(sSrcImgRow.length - 8) !== "Gray.png") {
                J(this.dhxGrid.cells(aIdRow, 1).cell).find('img').attr('src', _url('/temp_resources/models/TxTableView/imgs/16x16_Save-Gray.png'));
                J(this.dhxGrid.cells(aIdRow, 2).cell).find('img').attr('src', _url('/temp_resources/models/TxTableView/imgs/16x16_Cancel-Gray.png'));
            }
            isOneOrMoreModified = this.isOneOrMoreAttObjectModified();
        } else { // // desactivate Row images for all rows
            this.dhxGrid.forEachRow(function (aIdCurrentRow) {
                var sSrcImgRow = J(this.cells(aIdCurrentRow, 1).cell).find('img').attr('src');
                if (sSrcImgRow.substring(sSrcImgRow.length - 8) !== "Gray.png") {
                    J(this.cells(aIdCurrentRow, 1).cell).find('img').attr('src', _url('/temp_resources/models/TxTableView/imgs/16x16_Save-Gray.png'));
                    J(this.cells(aIdCurrentRow, 2).cell).find('img').attr('src', _url('/temp_resources/models/TxTableView/imgs/16x16_Cancel-Gray.png'));
                }
            });
        }
        if (!isOneOrMoreModified && this.mainToolbar.isEnabled("btnSave")) {
            this.mainToolbar.setButtonEnable("btnSave", false);
            this.mainToolbar.setButtonEnable("btnCancel", false);
        }
    }
}

CTableView.prototype.launchModelApplication = function (aIdModelApplication, aObjectDependency, aIdObjects) {
    var self = this;
    if (aObjectDependency == "odNone" || !(this.bIsEditionMode && this.isOneOrMoreAttObjectModifiedForRows(aIdObjects)))
        this.doLaunchModelApplication(aIdModelApplication, aObjectDependency, aIdObjects);
    else {
        var dummyData = {
            idModelApplication: aIdModelApplication,
            sObjectDependency: aObjectDependency,
            idObjects: aIdObjects
        }
        if (aIdObjects.length == 1) {
            msgOkCancel(_("Des données ont été modifiées. \nEnregistrer les modifications de la ligne et exécuter le modèle maintenant ?"), function (aConfirm, aDummyData) {
                self.doSaveAndLaunchModelApplication(aConfirm, aDummyData);
            }, dummyData);
        } else {
            msgOkCancel(_("Des données ont été modifiées. \nEnregistrer les modifications des lignes sélectionnées et exécuter le modèle pour l'ensemble des lignes maintenant ?"), function (aConfirm, aDummyData) {
                self.doSaveAndLaunchModelApplication(aConfirm, aDummyData);
            }, dummyData);
        }
    }
}

CTableView.prototype.doSaveAndLaunchModelApplication = function (aConfirm, aDummyData) {
    var self = this,
        aIdObjects = aDummyData.idObjects;

    if (aConfirm) {
        this.activeProgressLayout();
        // 3 actions : Save, execute Model, Callback (Refresh row / message) 
        var jsonData = this.getJsonModifiedData(aIdObjects);
        J.ajax({
            url: sPathFileTableViewAjaxASP,
            type: 'post',
            async: true,
            cache: false,
            dataType: "html",
            data: {
                sFunctionName: "SaveAndLaunchModelApplication",
                idTable: self.idTable,
                sObjectIds: aIdObjects.join(";"),
                idModelApplication: aDummyData.idModelApplication,
                jsonData: jsonData
            },
            success: function (data) {
                var arrResults = data.split("|");
                if (arrResults[0] == sOk) {
                    // remove modified statut of attributes when saving is successful
                    aIdObjects.forEach(function (aIdObj) {
                        self.removeModifiedStatut(parseInt(aIdObj));
                        self.changeEditionImageStatus(false, parseInt(aIdObj));
                    });
                    // launch model
                    var modAppExec = new CModelApplicationExecution({
                        idModelApplication: aDummyData.idModelApplication,
                        sObjectDependency: aDummyData.sObjectDependency,
                        sObjectIds: aIdObjects.join(";"),
						idObjectType: self.idOT,
                        bLaunchExecution: false
                    }, function (aResult, aData) {
                        self.afterLaunchModelApplication(aResult, aData)
                    }, aDummyData);
                    var sTypeModel = arrResults[1],
                        jsonResult = JSON.parse(arrResults[2]);
                    modAppExec.treatModelApplicationExecution(sTypeModel, jsonResult);
                    if (sTypeModel == "WebModel") {
                        J.each(jsonResult, function () {
                            // If there is new data to load for row
                            if (this.rows) {
                                // Update the row content with the new Json Data
                                self.updateRow(this, this.idObj);
                            }
                        });
                    }
                } else {
                    msgError(arrResults[0]);
                }
            }
        });
    }
}

CTableView.prototype.doLaunchModelApplication = function (aIdModelApplication, aObjectDependency, aIdObjects) {
    var self = this;
    //Initialize the settings for model application execution 
    var settings = {
        idModelApplication: aIdModelApplication,
        sObjectDependency: aObjectDependency,
        sObjectIds: aIdObjects.join(";"),
        idObjectType: this.idOT
    }
    //launch the model application
    this.activeProgressLayout();
    var modAppExec = new CModelApplicationExecution(settings, function (aResult, aData) {
        self.afterLaunchModelApplication(aResult, aData);
    }, {
        idObjects: aIdObjects,
        desactiveProgressLayout: function () {
            self.desactiveProgressLayout();
        }
	});
}

CTableView.prototype.afterLaunchModelApplication = function (aResult, aData) {
    var self = this;
    // for moment in tableView we don't pay attention to aResult.executionType
    if (!(J.isEmptyObject(aResult))) {
        // Get the instructions to execute after model application
        if (!J.isArray(aResult))
            aResult = [].push(aResult);

        // if Object that launch model application is not in Json instructions, Add action to refresh the object
        // Specific to tableView : actions only avaliable on current OT.
        var savedObjects = [];
        aData.idObjects.forEach(function (idObj) {
            savedObjects.push({ updateObject: { ID: parseInt(idObj) } });
        });
        
        aResult = mergeWebModelJsonInstructions(savedObjects, aResult);

        this.manageModelApplicationResults(aResult, aData);
    } else
        this.desactiveProgressLayout();
}

CTableView.prototype.manageModelApplicationResults = function (aActions, aData) {
    // Test for reload tableView
    if (aActions.bReloadTableView === true) {
        this.reloadTableView(aActions);
        return;
    }

    // Display msg if needed
    J.each(aActions, function (aIndex, aAction) {
        if (("sMsg" in aAction) && (aAction.sMsg != "")) {
            msgWarning(aAction.sMsg);
        }
    });
    
    var self = this,
        iNbAddRow = 0,
        bUpdateNumbersInterface = false;
   
    //Reload Data of Rows
    J.ajax({
        url: sPathFileTableViewAjaxASP,
        type: 'post',
        async: true,
        cache: false,
        dataType: "json",
        data: {
            sFunctionName: "TreatModelApplicationMessages",
            idTable: self.idTable,
            jsonObjects: JSON.stringify(aActions)
        },
        success: function (data) {
            J.each(data, function (aIndex, aResult) {
                if (aResult.rows) {
                    if (aResult.bNewRow) { // add new row to table
                        self.addNewRow(aResult);
                        bUpdateNumbersInterface = true;
                        self.iTotalNbOTObjects++;
                        iNbAddRow++;
                    } else { // Update the row content with the new Json Data
                        self.updateRow(aResult);
                    }
                } else {
                    // No data to load for row...
                }
            });
            // Update number of rows in interface
            if (bUpdateNumbersInterface) {
                self.iVisibleRowsCount += iNbAddRow;
                self.iRowsTotalCount += iNbAddRow;
                self.updateRowsNbInInterface();
            }
            self.desactiveProgressLayout();
        },
        error: function (a, b, error) {
            msgDevError("Erreur 'manageModelApplicationResults'. " + error);
        }
    });
}

CTableView.prototype.reloadTableView = function (aJsonTableView) {
    var self = this;
    console.log('reloadTableView');
    console.log(aJsonTableView);
    J.ajax({
        url: sPathFileTableViewAjaxASP,
        type: 'post',
        async: true,
        cache: false,
        dataType: "html",
        data: {
            sFunctionName: "reloadTableView",
            idTable: self.idTable,
            jsonObject: JSON.stringify(aJsonTableView)
        },
        success: function (data) {
            var results = data.split("|");
            if (results[0] == sOk) {
                self.bReloadState = true;
                self.initTableViewVariables(JSON.parse(results[1]));
                self.initDhxGrid();
                if (self.bIsWidget)
                    self.applyGridAndToolbarCss();
                self.loadGridData(JSON.parse(results[2]));
                self.updateButtonsState("first");
                self.desactiveProgressLayout();
                self.bReloadState = false;
            } else
                msgError(results[0]);
        }
    });
}

CTableView.prototype.initializeLinkAttLinkableObjects = function (aColumnIndex) {
    var self = this;
    J.ajax({
        url: sPathFileTableViewAjaxASP,
        async: false,
        cache: false,
        dataType: 'html',
        data: {
            sFunctionName: 'GetLinkAttLinkableObjects',
            idTable: self.idTable,
            idColumn: aColumnIndex
        },
        success: function (data) {
            var arrResult = data.split("|");
            if (arrResult[0] == "ok") {
                var jsonComboOptions = JSON.parse(arrResult[1]);
                var combo = self.dhxGrid.getCombo(aColumnIndex);
                jsonComboOptions.forEach(function (aComboOption) {
                    combo.put(aComboOption.ID, aComboOption.sName);
                });
                // Add empty option
                combo.put(0, '');
            } else
                msgError(arrResult[0]);
        }
    });
}

CTableView.prototype.startHeartBeat = function () {
    var self = this;

    if (!this.iSessionTimeout)
        J.ajax({
            url: _url("/code/TxASP/TxASPAjax.asp"),
            async: false,
            cache: false,
            dataType: 'html',
            data: {
                sFunctionName: 'getSessionTimeout'
            },
            success: function (data) {
                self.iSessionTimeout = 60000 * (parseInt(data) - 5);
            }
        });

    // pulse every Session.timeout
    if (this.heartbeatTimer == null)
        this.heartbeatTimer = setInterval(function () {
            if (self.bIsWidget) {
                if (typeof txASP == "undefined")
                    var txASP = window.parent.txASP;
                txASP.heartBeat();
            } else {
                window.opener.txASP.heartBeat();
            }
        }, this.iSessionTimeout);
}

/******************************************************/
/***************[ Initialize TableView ]***************/
/******************************************************/

function initTabTableView(aIdTable, aStringIdTable) {
    translate();
    sPathFileTableViewAjaxASP = "TxTableViewAjax.asp";

    var settingsTableView = {
        idTable: getValue(aIdTable,0),
        sIdTable: getValue(aStringIdTable,''),
        bIsWidget: false
    }
    var tableView = new CTableView(settingsTableView);
}

function Init_Widget(aParams, aCallback, aDummyData) {
    translate();
    sPathFileTableViewAjaxASP = _url("/temp_resources/models/TxTableView/TxTableViewAjax.asp");

    var sIdDivParent, sIdTable;
    J('.wrapperWidgetTableView').each(function () {
        sIdTable = J(this).attr('sTagTableView');
        if (!sIdTable) {
            msgWarning('Veuillez renseigner un attribut "sTagTableView" correspondant à l\'identifiant de la vue tableau au niveau de l\'élément "div" la déclarant.');
            return;
        }
        sIdDivParent = J(this).attr('id');

        var settingsTableView = {
            idTable: 0,
            sIdTable: sIdTable,
            sIdDivParent: sIdDivParent,
            bIsWidget: true
        }
        if (aParams && aParams.sSkin) settingsTableView.sSkin = aParams.sSkin;
        var tableView = new CTableView(settingsTableView, aCallback, aDummyData);
    });
}