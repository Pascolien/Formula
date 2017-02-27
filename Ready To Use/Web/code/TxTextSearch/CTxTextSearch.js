// JavaScript Document

/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @requires CGrid.js, CTabbar.js
 * @param 
        aSettings.fctSelectObject *** mandatory ***
        aSettings.idOT
        aSettings.sAndWords
        aSettings.sOrWords
        aSettings.sWithoutWords
        aSettings.iMinLengthSearchWord
        aSettings.bMultiSearch
        aCallBack
        aDummyData
 * @returns CPopup object.
 */

var sUrlTxtextSearchAjax = _url('/code/TxTextSearch/TxTextSearchAjax.asp');

var CTxTextSearch = function (aSettings, aCallBack, aDummyData) {
    checkMandatorySettings(aSettings, ["fctSelectObject"]);
    this.idTextSearchManager = 0;
    this.bMultiSearch = getValue(aSettings.bMultiSearch, false);
    this.callBack = aCallBack;
    this.settings = aSettings;
    this.iCounterIE8 = 1;
    this.sIdDivSearch = "idDivSearch";
    this.fctSelectObject = aSettings.fctSelectObject;
    this.iMinLengthSearchWord = getValue(aSettings.iMinLengthSearchWord, 1);
    this.sAndWords = getValue(aSettings.sAndWords);
    this.sOrWords = getValue(aSettings.sOrWords);
    this.sWithoutWords = getValue(aSettings.sWithoutWords);
    this.idOTToSelect = aSettings.idOT;
    this.bMultiSearch = getValue(aSettings.bMultiSearch, false);
    this.bSearchInData = getValue(aSettings.bSearchInData, true);
    this.callBack = aCallBack;
    this.iFilter = 0;
    this.iPageNumber;

    var self = this, // this variable permit to call public function in others contexts
        bTextSearchInFilesActive = false,
        bTextSearchInExternalServersActive = false,
        mainDiv = J("<div id='" + this.sIdDivSearch + "'></div>");
    
    //initialize search
    J.ajax({
        url: sUrlTxtextSearchAjax,
        cache: false,
        async: false,
        data: {
            sFunctionName: 'wGetTextSearchSettings'
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                bTextSearchInFilesActive = results[1];
                bTextSearchInExternalServersActive = results[2];
            } else
                msgDevError(results[0], "CTxTextSearch.wGetTextSearchSettings");
        }
    });

    // init window
    J.ajax({
        url: _url("/code/TxTextSearch/TxTextSearch.asp"),
        async: false,
        cache: false,
        success: function (aResult) {
            mainDiv.append(aResult);
            J(document.body).append(mainDiv);
        }
    });

    this.wdow = new CWindow({
        sName: "wSearch",
        iWidth: 730,
        iHeight: 590,
        bDenyResize: true,
        bModal: false,
        sIcon: 'temp_resources/theme/img/btn_titre/search-16.png',
        sHeader: _("Recherche textuelle"),
        sObjectAttached: this.sIdDivSearch,
        onMaximize: function () { self.onWindowMaximize() },
        onMinimize: function () { self.onWindowMinimize() },
        onResizeFinish: function () { self.onWindowResizeFinish() }
    });
    this.wdow.getWindow("wSearch").attachEvent("onClose", function () {
        self.onClose(); return true;
    });

    //init interface
    J.ajax({
        url: sUrlTxtextSearchAjax,
        cache: false,
        async: false,
        data: {
            sFunctionName: 'wGetTextSearchSettings'
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                bTextSearchInFilesActive = results[1] == -1;
                bTextSearchInExternalServersActive = results[2] == -1;
            } else
                msgDevError(results[0], "CTxTextSearch.wGetTextSearchSettings");
        }
    });

    //init ButtonBar
    this.buttonBar = new CButtonBar({
        btns: [
            { sId: "idBtnShowAdvancedSettings", sCaption: _("Afficher les paramètres avancés"), onClick: function () { self.showAdvancedSettings(true) } },
            { sId: "idBtnHideAdvancedSettings", bHidden: true, sCaption: _("Cacher les paramètres avancés"), onClick: function () { self.showAdvancedSettings(false) } },
            { sId: "idBtnSearchInTeexma", sCaption: _("Rechercher"), onClick: function () { self.searchInTeexma(true) } },
            { sId: "idBtnCloseSearch", sCaption: _("Fermer"), onClick: function () { self.wdow.close() } }
        ],
        sIdDivParent: 'idDivButtons'
    });

    // Init Tabbar
    this.tabbar = new CTabbar({
        sIdDivTabbar: "idDivTabbar",
        tabs: [
            { ID: "tabData", sName: _("Données"), iWidth: "100px", bActive: true },
            { ID: "tabFile", sName: _("Fichiers"), iWidth: "100px", bHidden: !bTextSearchInFilesActive },
            { ID: "tabExternalFile", sName: _("Fichiers Externes"), iWidth: "120px", bHidden: !bTextSearchInExternalServersActive }
        ],
        onSelect: function (aId, aLastId) {
            self.onTabSelected(aId, aLastId, true);
            return true;
        }
    });

    //set inputs
    J("#idTextAndWord").val(this.sAndWords);
    J("#idTextOrWord").val(this.sOrWords);
    J("#idTextWithoutWord").val(this.sWithoutWords);
    J("#idLabelAllWords").html(_("Tous les mots suivants :"));
    J("#idLabelAtLeastOneWord").html(_("Au moins un des mots suivants :"));
    J("#idLabelSearchInData").html(_("Rechercher dans les données en plus des noms d'Entités"));
    J("#idLabelNoneWords").html(_("Aucun des mots suivants :"));

    //manage events.
    J("#idTextAndWord").on("keyup", function () { self.onKeyUp() });
    J("#idTextOrWord").on("keyup", function () { self.onKeyUp() });
    J("#idTextWithoutWord").on("keyup", function () { self.onKeyUp() });

    //init layouts
    this.layout = new CLayout({
        sPattern: "2U",
        sParent: "idTabData",
        onPanelResizeFinish: function () { self.onLayoutResizeFinish() },
        cellsSettings: [
            { sHeight: "60", sIdDivAttach: "idDivCellA" },
            { sHeight: "*", sIdDivAttach: "idDivCellB" }
        ]
    });
    this.layout.setAutoSize("a;b", "a;b");

    // Init Grid OT for TEEXMA Data Result
    this.gridOT = new CGrid({
        sIdDivGrid: "idDivGridOT",
        iWidth: 334,
        iHeight: 442,
        cols: [
            { sHeader: _("Type d'Entités"), sWidth: "*", sColSorting: "str", sColAlign: "left" },
            { sHeader: " ", sWidth: "50", sColSorting: "", sColAlign: "right" }
        ],
        onRowSelect: function () { self.onFilterChange() }
    });

    // Init Tree Object for TEEXMA Data Result
    this.treeObject = new CTree({
        sIdDivTree: "idDivTreeObjects",
        onDblClick: function () { self.onDblClick() }
    });

    this.toolbarObject = new CToolbar({
        sIdDivToolbar: "idDivToolbarObjects",
        btns: [
           { sId: "btnFirst", iBtnType: tbtSimple, sHint: _("Afficher la première page"), sImgEnabled: "first.gif", sImgDisabled: "firstDisabled.gif", bDisabled: true },
           { sId: "btnPrev", iBtnType: tbtSimple, sHint: _("Afficher la page précédente"), sImgEnabled: "prev.gif", sImgDisabled: "prevDisabled.gif", bDisabled: true },
           { sId: "btnNext", iBtnType: tbtSimple, sHint: _("Afficher la page suivante"), sImgEnabled: "next.gif", sImgDisabled: "nextDisabled.gif", bDisabled: true },
           { sId: "btnLast", iBtnType: tbtSimple, sHint: _("Afficher la dernière page"), sImgEnabled: "last.gif", sImgDisabled: "lastDisabled.gif", bDisabled: true, bAddSpacer: true },
           { sId: "btnSelectPage", iBtnType: tbtSelect, sHint: _("Selectionnez une page"), sCaption: format(_("Page n°#1"), ["1"]), options: [{ sId: '1', sCaption: format(_("Page n°#1"), ["1"]) }] },
           { sId: "btnSelectContext", iBtnType: tbtSelect, sHint: _("Selectionnez une page / toute(s) les page(s)"), sCaption: _("Pages"), options: [{ sId: 'optionPages', sCaption: _("Pages") }, { sId: 'optionAll', sCaption: _("Tous") }] }
        ],
        onClick: function (aId) { self.onToolbarButtonClick(aId, true); }
    });

    this.updateBtnsearchInTeexma();
    if (!isEmpty(this.sAndWords)) {
        this.searchInTeexma(true);
    }

    this.updateTabIndex();

    if (this.bSearchInData)
        J("#idCheckboxData").attr("checked", "checked");
    else
        J("#idCheckboxData").removeAttr("checked");

    return this;
}
    
CTxTextSearch.prototype.toString = function() {
    return "CTxTextSearch";
}

CTxTextSearch.prototype.onClose = function (aDummyData) {
    var self = this,
        idTextSearchManager = this.idTextSearchManager;
    J.ajax({
        url: sUrlTxtextSearchAjax,
        cache: false,
        async: false,
        data: {
            sFunctionName: "wFreeTextSearchResults",
            idTextSearchManager: idTextSearchManager
        },
        success: function () {
            if (self.callBack)
                self.callBack(aDummyData);
        }
    });
}

CTxTextSearch.prototype.onWindowMaximize = function () {
    var iWidth = J("#idDivInputSearch").width() - 190 - 180, // 190 : button Width , 180 : slabel width
        hInput = J("#idDivInputSearch").height(),
        h = J("#idDivTabbar").height(),
        hGrid = (h - hInput) + 15,
        dim = this.wdow.getWidth();

    this.tabbar.adjustOuterSize();
    this.layout.setSizes();
    this.layout.setCellWidth("a", 700);
    this.layout.setCellWidth("b", 700);

    J('#idDivInputSearch input[type="text"]').css("width", iWidth + "px");
    J("#idDivTabbar").css("height", (hGrid + 40) + "px");
    J("#idDivGridOT").css("height", hGrid + "px");
    J("#idDivGridOT").css("width", "675px");
    J("#idDivTreeObjects").css("width", "675px");
    J("#idDivToolbarObjects").css("width", "667px");
    this.gridOT.setColWidth(0, "650");
}

CTxTextSearch.prototype.onWindowMinimize = function () {
    var dim = this.wdow.getWidth(),
        w = J("#idDivInputSearch").width() - 190 - 180;

    J('#idDivInputSearch input[type="text"]').css("width", w + "px");
    this.wdow.setWidth(dim[0]);
    this.tabbar.adjustOuterSize();
    this.layout.setSizes();
    this.layout.setCellWidth("a",dim[0] / 2);
    this.layout.setCellWidth("b", dim[0] / 2);

    J("#idDivTabbar").css("width", (dim[0] - 30) + "px");
    J("#idTabData").css("width", (dim[0] - 30) + "px");
    J("#idDivGridOT").css("width", "340px");
    J("#idDivTreeObjects").css("width", "320px");
    J("#idDivToolbarObjects").css("width", "335px");
    this.gridOT.setColWidth(0, "300");
}

CTxTextSearch.prototype.onWindowResizeFinish = function () {
    var iWidth,
        dim = this.wdow.getWidth();
    this.wdow.setWidth(dim[0]);

    this.tabbar.adjustOuterSize();
    this.layout.setSizes();
    this.layout.setCellWidth("a", dim[0] / 2);
    this.layout.setCellWidth("b", dim[0] / 2);

    iWidth = dim[0] - 190 - 180;
    if (dim[0] < 728)
        this.wdow.setMinDimension(520, null);

    this.layout.setCellWidth("a", dim[0] / 2);
    J("#idDivGridOT").css({
        "width": (dim[0] / 2) - 10 + "px",
        "height": "97%"
    });
    J('#idDivInputSearch input[type="text"]').css("width", iWidth + "px");
    this.gridOT.setColWidth(0, "650");
}

CTxTextSearch.prototype.onKeyUp = function (aEvent) {
    this.sAndWords = J("#idTextAndWord").val();
    this.sOrWords = J("#idTextOrWord").val();
    this.sWithoutWords = J("#idTextWithoutWord").val();
    this.updateBtnsearchInTeexma();

    if (event.keyCode == 13) {
        this.searchInTeexma(true);
    }
}

CTxTextSearch.prototype.search = function (aSearchValue) {
    J("#idTextAndWord").val(aSearchValue);
    this.sAndWords = aSearchValue;
    this.updateBtnsearchInTeexma();
    if (!isEmpty(aSearchValue)) {
        this.searchInTeexma(true);
    }
};

CTxTextSearch.prototype.searchInTeexma = function (aReloadOT) {
    this.onTabSelected(this.tabbar.getActiveTabId(), "", aReloadOT);
}

CTxTextSearch.prototype.onTabSelected = function (aIdCurrentTab, aIdLastTab, aReloadOT) {
    if (J("#idBtnSearchInTeexma").attr("disabled") == "disabled")
        return;

    switch (aIdCurrentTab) {
        case "tabData":
            this.doSearchIntoObjects(aReloadOT);
            break;
        case "tabFile":
            this.doSearchIntoObjectsFiles(aReloadOT);
            break;
        case "tabExternalFile":
            this.doSearchIntoExternalServers(aReloadOT);
            break;
    }
}

CTxTextSearch.prototype.onFilterChange = function () {
    this.iFilter = this.gridOT.getSelectedRowId();
    this.onPageChange(1);
    this.reloadPager(this.iPageNumber);
}

CTxTextSearch.prototype.doReloadResults = function (aFunctionName, aReloadOTs) {
    var self = this,
        idOT = isEmpty(this.gridOT.getSelectedRowId()) || aReloadOTs ? this.idOTToSelect : this.gridOT.getSelectedRowId();

    this.layout.progressOn();
    this.treeObject.clear();

    J.ajax({
        url: sUrlTxtextSearchAjax,
        async: true,
        cache: false,
        data: {
            sFunctionName: aFunctionName,
            idTextSearchManager: this.idTextSearchManager,
            sAndWords: getValue(this.sAndWords),
            sOrWords: getValue(this.sOrWords),
            sWithoutWords: getValue(this.sWithoutWords),
            bSearchIntoData: this.isCheckboxDataChecked(),
            idOT: idOT
        },
        success: function (aResult) {
            var results = aResult.split("|");
            self.layout.progressOff();
            if (results[0] == sOk) {
                self.idTextSearchManager = results[1];
                self.iFilter = results[5];

                // load grid OT if the grid is empty.
                if (aReloadOTs) {
                    var searchData = JSON.parse(results[2]);
                    searchData[0].ID = 0;
                    J.each(searchData, function (aIndex, aData) {
                        iIcon = getValue(aData.iIcon, aIndex);
                        iNbResult = getValue(aData.iNbResults, 0);
                        aData.data = [format("<img src='" + _url("/temp_resources/theme/img/png/#1.png") + "'/>#2", [iIcon, aData.sName]), iNbResult];
                    });
                    self.gridOT.reloadFromTxObjects(searchData);
                }

                // reload the object Tree.
                self.treeObject.reloadFromTxObjects(JSON.parse(results[4]));

                // select the grid OT line from iFilter.
                if (isEmpty(self.gridOT.getSelectedRowId()) || self.gridOT.getSelectedRowId() != self.iFilter)
                    self.gridOT.selectRow(self.iFilter);

                //manage toolbar option page.
                self.reloadPager(parseInt(results[3]));
            } else {
                msgWarning(results[0]);
                self.gridOT.clear();
                self.reloadPager(1);
            }

            self.layout.progressOff();
        }
    });
}

CTxTextSearch.prototype.reloadPager = function (aNbPage) {
    if (this.toolbarObject.getListOptionNumber("btnSelectPage") != aNbPage) {
        var options = [];
        for (var i = 1 ; i < aNbPage + 1 ; i++)
            options.push({ sId: i, sCaption: format(_("Page n°#1"), [i]) });

        this.toolbarObject.reloadListOptions("btnSelectPage", options);
        this.toolbarObject.setListOptionSelected("btnSelectContext", "optionPages");
        this.onToolbarButtonClick(1, false);
    }
}

CTxTextSearch.prototype.searchIntoObjects = function () {
    this.doSearchIntoObjects(false);
}

CTxTextSearch.prototype.doSearchIntoObjects = function (aReloadOTs) {
    this.doReloadResults("wSearchIntoObjects", aReloadOTs);
}

CTxTextSearch.prototype.searchIntoObjectsFiles = function () {
    this.doSearchIntoObjectsFiles(false);
}

CTxTextSearch.prototype.doSearchIntoObjectsFiles = function (aReloadOTs) {
    this.doReloadResults("wSearchIntoObjectsFiles", aReloadOTs);
}

CTxTextSearch.prototype.searchIntoExternalServers = function () {
    this.doSearchIntoObjectsFiles(false);
}

CTxTextSearch.prototype.doSearchIntoExternalServers = function (aReloadOTs) {
    this.doReloadResults("wSearchIntoExternalServers", aReloadOTs);
}

CTxTextSearch.prototype.onPageChange = function (aPageIndex) {
    var self = this;
    J.ajax({
        url: sUrlTxtextSearchAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "wOnPageOrFilterChange",
            idTextSearchManager: this.idTextSearchManager,
            iFilter: this.iFilter,
            iPageIndex: aPageIndex - 1
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                self.iPageNumber = parseInt(results[1]);
                self.treeObject.reloadFromTxObjects(JSON.parse(results[2]));
            } else
                msgDevError(results[0], "CTxTextSearch.onPageChange");
        }
    });
}

CTxTextSearch.prototype.onToolbarButtonClick = function (aIdBtn, aLoadPage) {
    var iPageCount = this.toolbarObject.getListOptionNumber("btnSelectPage"),
        iCurrentPage = getValue(parseInt(this.toolbarObject.getListOptionSelected("btnSelectPage")), 1);
    //intialize pager
    this.toolbarObject.disableBtns(["btnFirst", "btnPrev", "btnNext", "btnLast"]);
    this.toolbarObject.enableItem("btnSelectPage");
    this.toolbarObject.setListOptionSelected("btnSelectPage", 1);
    if (iPageCount > 1) {
        this.toolbarObject.enableBtns(["btnFirst", "btnPrev", "btnNext", "btnLast", "btnSelectPage"]);
        switch (aIdBtn) {
            case "btnFirst":
                iCurrentPage = 1;
                this.toolbarObject.disableBtns(["btnFirst", "btnPrev"]);
                this.toolbarObject.enableBtns(["btnNext", "btnLast"]);
                this.toolbarObject.setListOptionSelected("btnSelectPage", iCurrentPage);

                break;
            case "btnPrev":
                iCurrentPage -= 1;
                this.toolbarObject.enableBtns(["btnNext", "btnLast"]);
                this.toolbarObject.setListOptionSelected("btnSelectPage", iCurrentPage);
                if (iCurrentPage == 1)
                    this.toolbarObject.disableBtns(["btnFirst", "btnPrev"]);

                break;
            case "btnNext":
                iCurrentPage += 1;
                this.toolbarObject.setListOptionSelected("btnSelectPage", iCurrentPage);
                if (iCurrentPage == iPageCount)
                    this.toolbarObject.disableBtns(["btnNext", "btnLast"]);

                break;
            case "btnLast":
                iCurrentPage = iPageCount;
                this.toolbarObject.disableBtns(["btnNext", "btnLast"]);
                this.toolbarObject.setListOptionSelected("btnSelectPage", iCurrentPage);
                break;
            case "optionAll":
                iCurrentPage = 0;
                //disable all btns
                this.toolbarObject.disableBtns(["btnFirst", "btnPrev", "btnNext", "btnLast", "btnSelectPage"]);
                this.toolbarObject.setItemText("btnSelectPage", format(_("Page n°#1"), [1]));
                break;
            case "optionPages":
                this.toolbarObject.disableBtns(["btnFirst", "btnPrev"]);
                break;
            default:
                //click on page
                this.toolbarObject.setListOptionSelected("btnSelectPage", iCurrentPage);
                switch (parseInt(aIdBtn)) {
                    case 1:
                        this.toolbarObject.disableBtns(["btnFirst", "btnPrev"]);
                        break;
                    case iPageCount:
                        this.toolbarObject.disableBtns(["btnNext", "btnLast"]);
                        break;
                }
                break;
        }
        // load object for the current page.
        if (aLoadPage) {
            this.onPageChange(iCurrentPage);
        }
    }
}

CTxTextSearch.prototype.isCheckboxDataChecked = function () {
    return J("#idCheckboxData").is(":checked");
}

CTxTextSearch.prototype.updateBtnsearchInTeexma = function () {
    var bAndOrWordEmpty = this.sAndWords.length < this.iMinLengthSearchWord && this.sOrWords.length < this.iMinLengthSearchWord,
        bWithoutWordEmpty = this.sWithoutWords.length < this.iMinLengthSearchWord;

    if (bAndOrWordEmpty || (bAndOrWordEmpty && bWithoutWordEmpty))
        J("#idBtnSearchInTeexma").attr("disabled", "disabled");
    else
        J("#idBtnSearchInTeexma").removeAttr("disabled");
}

CTxTextSearch.prototype.onDblClick = function () {
    switch (this.tabbar.getActiveTabId()) {
        case "tabExternalFile":
            var sDescription = this.treeObject.getSelectedItemAttributeValue("sDescription");
            window.open(sDescription, '_blank');
            break;
        default:
            this.fctSelectObject(this.treeObject.getTxIdSelected());
            break;
    }
}

CTxTextSearch.prototype.updateTabIndex = function () {
    if (J("#idBtnHideAdvancedSettings").is(":visible")) {
        J("#idTextAndWord").attr("tabindex", 1);
        J("#idTextOrWord").attr("tabindex", 2);
        J("#idTextWithoutWord").attr("tabindex", 3);
        J("#idBtnSearchInTeexma").attr("tabindex", 4);
        J("#close").attr("tabindex", 5);
    } else {
        J("#idTextAndWord").attr("tabindex", 1);
        J("#idBtnSearchInTeexma").attr("tabindex", 2);
        J("#close").attr("tabindex", 3);
    }
}

/** Manage window responsive **/
CTxTextSearch.prototype.showAdvancedSettings = function (aShow) {
    this.buttonBar.setButtonVisible("idBtnHideAdvancedSettings", aShow, true);
    this.buttonBar.setButtonVisible("idBtnShowAdvancedSettings", !aShow, true);

    J("#idTableAdvancedSettings").css("display", aShow ? "block" : "none");
    J("#idDivTabbar").css("top", aShow ? "100px" : "35px");
    J("#idDivComponents").css("top", aShow ? "120px" : "55px");

    this.layout.setSizes();
    J("#idDivGridOT").css("height", aShow ? "376px" : "442px");
    J(".objbox").css("height", aShow ? "351px" : "417px");
    J("#idDivToolbarObjects").css("bottom", aShow ? "5px" : "5px");
    J("#idDivTreeObjects").css("height", aShow ? "351px" : "417px");

    this.updateTabIndex();
}

CTxTextSearch.prototype.hideAdvancedSettings = function () {
    J("#idBtnHideAdvancedSettings").hide();
    J("#idBtnShowAdvancedSettings").show();
    J("#idTableAdvancedSettings").hide();
    J("#idDivTabbar").css("top", "35px");
    J("#idDivComponents").css("top", "55px");

    this.layout.setSizes();
    J("#idDivGridOT").css("height", "442px");
    J(".objbox").css("height", "417px");
    J("#idDivToolbarObjects").css("bottom", "5px");
    J("#idDivTreeObjects").css("height", "417px");

    this.updateTabIndex();
}

CTxTextSearch.prototype.onLayoutResizeFinish = function () {
    var iTabDataWidth = J("#idTabData").width(),
        iCellBWidth = this.layout.getCellWidth("b"),
        iCellAWidth = iTabDataWidth - iCellBWidth;

    this.layout.setCellWidth("a", iCellAWidth);
    J("#idDivGridOT").css("width", (iCellAWidth - 15) + "px");
    J("#idDivTreeObjects").css("width", (iCellBWidth - 15) + "px");
    J("#idDivToolbarObjects").css("width", (iCellBWidth - 23) + "px");
    this.gridOT.setColWidth(0, "650");
}


