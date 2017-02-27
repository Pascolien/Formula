/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings{
            idObject *** MANDATORY ***
            sName
            iIcon
        }
        aCallBackFunction
        aDummyData
 * @returns CTraceabilities object.
 */

var CTraceabilities = function (aSettings, aCallBackFunction, aDummyData) {
    checkMandatorySettings(aSettings, ["idObject"]);

    this.sPathFileTraceabilitiesAjax = _url("/code/TxTraceabilities/TxTraceabilitiesAjax.asp");
    this.idObject = getValue(aSettings.idObject);
    this.sName = getValue(aSettings.sName, '');
    this.iIcon = getValue(aSettings.iIcon, '');
    this.callback = aCallBackFunction;
    this.dummyData = aDummyData;
    this.arrFilters = [];
    this.jData;
    this.jFilteredData;

    this.initWindow();
};

CTraceabilities.prototype.initWindow = function () {
    var self = this;
    // Open window
    var wdowSettings = {
        sName: "wTraceabilities",
        sHeader: format(_("Historique des modifications de l'Entité '#1'"), [this.sName]),
        sIcon: this.iIcon,
        iWidth: 1000,
        iHeight: 550,
        bDenyResize: false,
        bHidePark: true,
        bHideClose: false,
        bModal: true,
        sHTMLAttached: '<div id="bodyTraceabilities"></div>',
        onResizeFinish: function () { self.layout.setSizes(); self.dhxGrid.setSizes(); },
        onMaximize: function () { self.layout.setSizes(); self.dhxGrid.setSizes(); },
        onMinimize: function () { self.layout.setSizes(); self.dhxGrid.setSizes(); }
    };
    this.cWindow = new CWindow(wdowSettings);

    // Init interface
    J("#bodyTraceabilities").append('<div id="gridTraceabilities"></div>' +
                                    '<div id="buttonsBarTraceabilities"></div>');

    this.layout = new CLayout({
        sParent: "bodyTraceabilities",
        sPattern: "1C",
        cellsSettings: [
            {
                sIdDivAttach: "gridTraceabilities",
                bShowHeader: false
            }
        ]
    });

    this.btnBar = new CButtonBar({
        sIdDivParent: "buttonsBarTraceabilities",
        btns: [
            { iBtnType: "btClose", onClick: function () { self.close(); } }
        ]
    });

    this.layout.progressOn();
    // get traceabilities data
    J.ajax({
        url: self.sPathFileTraceabilitiesAjax,
        async: true,
        cache: false,
        dataType: 'html',
        data: {
            sFunctionName: "GetObjectTraceabilities",
            idObject: self.idObject
        },
        success: function (aResult) {
            var arrResults = aResult.split("|");
            if (arrResults[0] === sOk) {
                var jTraceabilities = JSON.parse(arrResults[1]);
                if (jTraceabilities.length > 0)
                    self.loadGrid(jTraceabilities);
                else
                    J("#gridTraceabilities").html('<div class="errorMsgTraceabilities">' + _("Aucune donnée de traçabilité trouvée.") + '</div>');
                self.layout.progressOff();
            } else {
                msgError(arrResults[0]);
            }
        }
    });
}

CTraceabilities.prototype.loadGrid = function (aJsonTraceabilities) {
    this.dhxGrid = new dhtmlXGridObject('gridTraceabilities');
    this.dhxGrid.setImagePath(_url('/resources/theme/img/dhtmlx/grid/'));//the path to images required by grid 
    this.dhxGrid.setSkin("dhx_skyblue");
    this.dhxGrid.setHeader(_("Date de modification") + "," + _("Utilisateur") + "," + _("Caractéristique") + "," + _("Ancienne valeur / lien(s) supprimé(s)") + "," + _("Nouvelle valeur / lien(s) ajouté(s)"));
    // attach filter header :
    var sHtmlHeader,
        arrAttachHeader = [];
    for (var i = 0; i < 5; i++) {
        switch (i) {
            case 0: // date interval
                sHtmlHeader = '<div class="divGridFilters"><input type="text" id="textFilter_' + i + '" title="' + _("Bornes") + '" class="inputTextFilter" /></div>';
                break;
            case 1:
            case 2: // choice list
                sHtmlHeader = '<div class="divGridFilters"><div id="comboFilter_' + i + '" class="divComboFilter"></div></div>';
                break;
            case 3:
            case 4: // conatins text
                sHtmlHeader = '<div class="divGridFilters"><input type="text" id="textFilter_' + i + '" title="' + _("Contient ET") + '" class="inputTextFilter" /></div>';
                break;
        }
        arrAttachHeader.push(sHtmlHeader);
    }
    this.dhxGrid.attachHeader(arrAttachHeader);
    this.dhxGrid.setInitWidths("160,150,180,*,*");
    this.dhxGrid.setColAlign("left,left,left,left,left")
    this.dhxGrid.setColTypes("tree,ro,ro,ro,ro");
    this.dhxGrid.setColSorting("na,na,na,na,na");
    this.dhxGrid.enableTreeCellEdit(false);
    this.dhxGrid.init();
    // parse json data
    this.parseJsonData(aJsonTraceabilities);

    this.jFilteredData = {
        rows: this.jData.rows.map(function (aData) { return aData; }) // clone jData;
    };
    this.reloadData();
    // Init Filters
    this.initFilters();
}

CTraceabilities.prototype.parseJsonData = function (aJsonTraceabilities) {
    //sub-function
    var arrToString = function (aArr, aSep) {
        var str = "";
        aArr.forEach(function (token) {
            str = qc(str, token, aSep);
        });
        return str;
    }

    var self = this,
        iCount = 1;
    this.jData = {
        rows: []
    }
    J.each(aJsonTraceabilities, function (aIndex, aTraceabilities) {
        // keys : [User, fModificationDate, Atts, Traceabilities]
        var jNewTraceabilities = {
            id: iCount,
            data: [{ value: aTraceabilities.fModificationDate, image: "folder.gif" }, aTraceabilities.User.sName, "", "", ""],
            rows: []
        };
        J.each(aTraceabilities.Traceabilities, function (aSubIndex, aTraceability) {
            // keys : [Att, Before, After, DeletedLinks, AddedLinks]
            iCount++;
            var jNewTraceability = {
                id: iCount,
                data: ["","",aTraceability.Att.sName,"",""]
            }
            
            if ("Before" in aTraceability)
                jNewTraceability.data[3] = aTraceability.Before;   
            if ("After" in aTraceability)
                jNewTraceability.data[4] = aTraceability.After; 
            if ("DeletedLinks" in aTraceability)
                jNewTraceability.data[3] = arrToString(aTraceability.DeletedLinks, " , ");
            if ("AddedLinks" in aTraceability)
                jNewTraceability.data[4] = arrToString(aTraceability.AddedLinks, " , ");
            jNewTraceabilities.rows.push(jNewTraceability);
        });
        self.jData.rows.push(jNewTraceabilities);
        iCount++;
    });
}

CTraceabilities.prototype.reloadData = function () {
    var self = this;
    this.setColors();
    this.dhxGrid.clearAll();
    this.dhxGrid.parse(this.jFilteredData, "json");
    //after reload, open all node by default
    if (this.jFilteredData.rows)
        J.each(this.jFilteredData.rows, function (aIndex, aRow) {
            self.dhxGrid.openItem(aRow.id);
        });
}

CTraceabilities.prototype.setColors = function () {
    // yellow: #F2F5A9; red : #F5A9A9; green : #D0F5A9;
    if (!this.jFilteredData.rows) return;
    J.each(this.jFilteredData.rows, function (aIndex, aTraceability) {
        J.each(aTraceability.rows, function (aSubIndex, aAttribute) {
            if (aAttribute.data[3] !== "")
                aAttribute.data[3] = { value: aAttribute.data[3], style: 'background: ' + ((aAttribute.data[4] !== "") ? "#F2F5A9" : "#F5A9A9") + ';' };
            if (aAttribute.data[4] !== "")
                aAttribute.data[4] = { value: aAttribute.data[4], style: 'background: ' + ((aAttribute.data[3] !== "") ? "#F2F5A9" : "#D0F5A9") + ';' };
        });
    });
}

CTraceabilities.prototype.initFilters = function () {
    var self = this;
    for (var i = 0; i < 5; i++) {
        this.arrFilters.push(new CTraceabilitiesFilter({
            traceabilities: self,
            iColumnIndex: i
        }));
    }
}

CTraceabilities.prototype.applyFilter = function () {
    // réinit filtered data
    this.jFilteredData = {
        rows: this.jData.rows.map(function (aData) { return aData; }) // clone jData;
    };
    var bReload = false;
    for (var i = 0; i < this.arrFilters.length; i++) {
        var rFilter = this.arrFilters[i];
        if (rFilter.bActive) {
            rFilter.applyColumnFilter();
            bReload = true;
        }
    }
    if (!bReload) { // no active filter : reload with all data
        J.each(this.jFilteredData.rows, function (aInd, aObj) {
            aObj.data[0] = { "value": aObj.data[0], "image": "folder.gif" };
        });
        this.reloadData();
    }
}

CTraceabilities.prototype.close = function () {
    if (this.callback)
        this.callback(this.dummyData);
    // close popups of validation if any is opened
    if (this.arrFilters.length > 0)
        this.arrFilters[0].destroyPopupFilter();
    this.cWindow.close();
}

