/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.idOT
        aSettings.idView 
        aSettings.idObjectSelected 
        aSettings.idTabSelected 
        aSettings.iRWMode 
 * @returns CTxASP object.
 */

var rwmRead = 0,
    rwmWrite = 1;

var CTxASP = function (aSettings) {
    this.mainToolbar;
    this.combo;
    this.tree;
    this.form;
    this.idOT = getValue(aSettings.idOT, 0);
    this.iLastIdOTSelected = this.idOT;
    this.idView = getValue(aSettings.idView,0);
    this.idObject = getValue(aSettings.idObject, 0);
    this.idTab = getValue(aSettings.idTab, 5);
    this.idTabToSelectOnLoad = getValue(aSettings.idTab, 0);
    this.iRWMode = getValue(aSettings.iRWMode, rwmRead);
    this.arrVisibleViews = [];
    this.arrHiddenViews = [];
    this.sUrl = "";
    this.sUserName = "";
    this.sLastConnectionDate = "";
    this.bManualConnectionProhibited = "";
    this.iLockingType = ltNone;

    var self = this;
    this.jApplicationModelsButtons = [];
    this.jApplicationModelsMenuButtons = [];

    function businessOtsFirst(aOts) {
        var firtBOtIndex = aOts.findIndex(function (ot) {
            return ot.ID > 0;
        });
        if (firtBOtIndex < 1)
            return aOts;
        var standartOts = aOts.splice(1, firtBOtIndex - 1);
        return aOts.concat(standartOts);
    }

    // Set img background with sIISAplicationName variable
    J("#idDivBlank").css('background', 'url("' + _url('/temp_resources/texts and illustrations/HTML/folder.jpg') + '") no-repeat');
    J("#idDivBlank").css('background-position', '50% 50%');
    J("#idDivBanner").css('background', 'url("' + _url('/temp_resources/theme/img/Default.jpg') + '") no-repeat');

    J.ajax({
        url: sPathTxAspAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "initInterface",
            idOT: self.idOT,
            idView: self.idView,
            idObject: self.idObject,
            iRWMode: self.iRWMode
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                self.OTsStandard = JSON.parse(results[1]);
                self.businessViews = JSON.parse(results[2]);
                objects = JSON.parse(results[3]);
                idOTPortal =  parseInt(results[4]);
                idOTLibrary =  parseInt(results[5]);
                bBtnCurveEnabled = getBValue(results[6]);
                bBtnExtractEnabled = getBValue(results[7]);
                applicationsModel = JSON.parse(results[8]);
                applicationsMenuModel = JSON.parse(results[9]);
                bDisplayBtnTxCharts = getBValue(results[10]);
                var sUrl = results[11];
                if (inStr(sUrl, "/code/"))
                    sUrl = sUrl.replace("/code/", "/");

                self.sUrl = sUrl;
                self.idOT = parseInt(results[12]);
                sOTHint = results[13];
                self.sUserName = results[14];
                self.sLastConnectionDate = results[15];
                self.bManualConnectionProhibited = results[16] === "-1";
                txOTs = JSON.parse(results[17]); //common variable
                idOTInfo = results[18]; //common variable
                idOTSource = results[19]; //common variable
                sTxDateFormat = results[20]; //common variable
                sTxDateTimeFormat = results[21]; //common variable
                sTXTimeFormat = sTxDateTimeFormat.substring(9, 17); //common variable
                txConversions = JSON.parse(results[22]); //loaded variables
                self.bBannerVisibleByDefault = results[23] === "-1";
                self.bDisplayObjectPathInBanner = results[24] === "-1";
                sDllConstructionMode = results[25];
                bTxStrongPwd = results[26] === "-1"; //common variable

                iTxMajor = results[27]; //common variable
                iTxMinor = results[28]; //common variable
                iTxRelease = results[29]; //common variable
                iTxRevision = results[30]; //common variable
                sTxDate = results[31]; //common variable
                iTxUserSessionId = results[32]; //common variable
            } else
                msgWarning(results[0]);
        }
    });

    J.ajax({
        url: _url("/temp_resources/models/TxWebForms/txWebFormsConfigs.json"),
        async: false,
        cache: false,
        success: function (aResult) {
            txWebFormsConfig = aResult;
        },
        error: function (a, b, c) {
            if (c != "Not Found")
                msgDevError(format("The json file 'temp_resources / models / TxWebForms / txWebFormsConfig.json' has a #1 : <br> #2", [b, c]));
        }
    });

    this.idView = this.OTsStandard[0].ID;

    this.bExtractable = false;
    J.each(this.OTsStandard, function (aIndex, aOption) {
        aOption.ID_OT = aOption.ID;
        if (aOption.bVisible || aOption.ID > 0)
            self.arrVisibleViews.push(aOption);
        else
            self.arrHiddenViews.push(aOption);
        
        if (aOption.ID_OT == self.idOT) {
            //self.bExtractable = aOption.OT.bExtractable;
            self.levels = aOption.Levels;
        }
    });
    resetBrowsingHistory();

    if (this.idObject > 0)
        this.jObjects = [];

    this.wdowContainer = new CWindow();
};

CTxASP.prototype.toString = function txToString() {
    return "CTxASP Object";
}

CTxASP.prototype.getSelectedObjectIds = function () {
    return this.tree.getTxIdSelected();
}

CTxASP.prototype.getSelectedObjects = function () {
    return this.tree.getNodesSelected();
}

CTxASP.prototype.displayViewFromIdOT = function (aIdOT) {
    this.combo.selectOptionFromField("ID_OT", aIdOT);
}

CTxASP.prototype.displayView = function (aIdView) {
    this.combo.selectOptionFromTxId(aIdView);
}

CTxASP.prototype.executeAdvancedCreation = function (aIdAdvancedCreation) {
    aIdAdvancedCreation = getValue(aIdAdvancedCreation, 0);
    if (aIdAdvancedCreation == 0)
        return;

    var self = this;

    J.ajax({
        url: sPathTxAspAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "getAdvancedCreation",
            idAdvancedCreation: aIdAdvancedCreation
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                var advancedCreation = JSON.parse(results[1]);
                //idOT = parseInt(results[1]);
                self.displayViewFromIdOT(advancedCreation.ID_OT);
                self.tree.addSister("", false, [advancedCreation]);
            } else {
                msgWarning(results[0]);
            }
                
        }
    });
}

CTxASP.prototype.getBusinessViewIdFromIdObject = function (aIdObject) {
    var idView = 0;

    J.ajax({
        url: sPathTxAspAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "getBusinessViewIdFromIdObject",
            idsView: this.businessViews.map(function (bv) {return bv.ID}).join(";"),
            idObject: aIdObject
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk)
                idView = parseInt(results[1]);
            else {
                msgWarning(results[0]);
            }
        }
    });
    return idView;
}

CTxASP.prototype.displayExportation = function (aIdOT, aIdObjects, aSelectedObjectsKey) {
    var self = this,
        idOT = aIdOT,
        idObjects = aIdObjects,
        sSelectedObjectsKey = getValue(aSelectedObjectsKey, sNull),
        opened = false;

    this.jSettings = {
        idOT: idOT,
        idObjects: idObjects,
        sSelectedObjectsKey: sSelectedObjectsKey
    }

    this.wdowExport = new CWindow({
        sName: "wExportation",
        sHeader: _("Exportation"),
        sIcon: 'temp_resources/theme/img/btn_titre/module_export-16.png',
        iWidth: 705,
        iHeight: 490,
        bDenyResize: true,
        bHidePark: true,
        onContentLoaded: function () {
            if (opened) return;
            var rDhxWindow = self.wdowExport.getWindow("wExportation");
            self.jSettings.wdow = rDhxWindow;
            rDhxWindow.getFrame().contentWindow.initInterface(self.jSettings);
            opened = true;
        },
        sUrlAttached: _url('/code/TxWebExportation/TxWebExportation.asp')
    });
}

CTxASP.prototype.displayExtraction = function (aIdOT, aIdObjects) {
    var self = this,
        idOT = getValue(aIdOT, this.idOT),
        sIdObjects = getValue(aIdObjects),
        objectIds = [];

    if (!isAssigned(aIdObjects) && this.tree) {
        var selectedIds = this.tree.getTxIdSelectedToArray();
        //filter folders ids;
        selectedIds.forEach(function (aId) {
            var node = this.tree.getNodeFromTxId(aId);
            if (isAssigned(node))
                if (!node.bFolder)
                    objectIds.push(aId);
        });
        sIdObjects = objectIds.join(";");
    }

    this.wExtraction = new CTxExtraction({
        idOT: idOT,
        idObjects: sIdObjects,
        wdowContainer : this.wdowContainer
    });
}

CTxASP.prototype.displayChangePasswordForm = function () {
    var sDivName = "idDivChangePassword";
    J(document.body).append("<div id=\"" + sDivName + "\"></div>");

    J("#" + sDivName).load(_url("/code/TxASP/TxUserInfo/TxChangePassword/TxChangePassword.html"));

    this.wdowContainer.addWindow({
        sName: "wChangePassword",
        sHeader: _("Changement de mot de passe"),
        sIcon: "resources/theme/img/btn_form/cadena.png",
        iWidth: 350,
        iHeight: 160,
        bDenyResize: true,
        bHidePark: true,
        sObjectAttached: sDivName
    });
};

CTxASP.prototype.exitTEEXMA = function () {
    msgOkCancel(_("Souhaitez-vous vraiment quitter TEEXMA ?"), function () {
        closeAllWindow();
        var bManualConnexionProhibited = false;
        J.ajax({
            url: _url("/code/TxLogin/TxLoginAjax.asp"),
            dataType: "html",
            async: false,
            cache: false,
            data: {
                sFunctionName: "GetManualConnectionProhibited"
            },
            success: function (data) {
                bManualConnexionProhibited = data;
            },
            error: function (result, statut, error) {
                msgWarning(error);
            }
        });
        if (bManualConnexionProhibited === "true") {
            parent.window.location.href = _url("/?bManualConnectionProhibited=true");
        } else {
            parent.window.location.href = _url("/?bForceManualConnexion=true");
        }
    });
};

CTxASP.prototype.displayMCS = function (aSettings) {
    var aSettings = getValue(aSettings, {}),
        bFromCG = getValue(aSettings.bFromCG, false),
        idOT = getValue(aSettings.idOT, 0),
        sTab = getValue(aSettings.sTab),
        sPathFile = getValue(aSettings.sPathFile),
        idRequirementSet = getValue(aSettings.idRequirementSet, 0),
        sParams = '?cg=' + bFromCG + '&id_cdc=' + idRequirementSet + '&id_te=' + idOT + '&onglet="' + sTab + '"';

    if (!isEmpty(sPathFile))
        sParams += '&sPathFile=' + sPathFile;

    this.wdowContainer.addWindow({
        sName: "wMCS",
        sHeader: _("Sélection Multicritère - Cahier des Charges"),
        iWidth: 850,
        iHeight: 570,
        bDenyResize: true,
        sIcon: 'temp_resources/theme/img/btn_titre/module_mcs-16.png',
        sUrlAttached: _url('/code/asp/mcs.asp') + sParams
    });

}

CTxASP.prototype.displayPopupCGList = function (aIdOT) {
    this.wdowContainer.addWindow({
        sName: "wCGList",
        sHeader: _("Guide de Choix"),
        sIcon: 'temp_resources/theme/img/btn_titre/module_cg-16.png',
        iWidth: 460,
        iHeight: 210,
        bDenyResize: true,
        sUrlAttached: _url('/code/asp/cg_opening.asp?ID_OT=') + aIdOT
    });
}

CTxASP.prototype.displayChoiceGuide = function (aIdChoiceGuide, aImportFileName) {
    aIdChoiceGuide = getValue(aIdChoiceGuide, 0);
    aImportFileName = getValue(aImportFileName);
    this.wdowContainer.addWindow({
        sName: "wChoiceGuide",
        sHeader: _("Guide de Choix"),
        sIcon: 'temp_resources/theme/img/btn_titre/module_cg-16.png',
        iWidth: 910,
        iHeight: resizeHeight(620),
        bDenyResize: true,
        bHidePark: true,
        sUrlAttached: _url('/code/asp/cg_form.asp?import_file=') + aImportFileName + '&id_gdc=' + aIdChoiceGuide
    });
}

CTxASP.prototype.updateMainToolbar = function (aIdOT) {
    this.mainToolbar.idOT = this.idOT;
    this.mainToolbar.updateButtonsState(aIdOT, this.iRWMode);
}

CTxASP.prototype.executeApplicationModel = function (aModelApplication, aIdObjects, aIdOT) {
    var self = this;
    var dfd = J.Deferred();

    self.mainLayout.layout.progressOn();
    //launch the model application
    new CModelApplicationExecution({
        sObjectIds: aIdObjects,
        idModelApplication: aModelApplication.ID,
        sObjectDependency: aModelApplication.sObjectDependency,
        idObjectType: aIdOT
    }, function (aSettings) {
        self.tree.updateTree(aSettings);
        self.mainLayout.layout.progressOff();
        if(aSettings && ((Array.isArray(aSettings) && aSettings.length > 0))) {
            dfd.resolve(aSettings);
        }
    }, {
        desactiveProgressLayout: function () {
            self.mainLayout.layout.progressOff();
        }
    });
    return dfd.promise();
}

CTxASP.prototype.heartBeat = function () {
    J.ajax({
        url: sPathTxAspAjax,
        async: true,
        cache: false,
        data: {
            sFunctionName: "HeartBeat"
        }
    });
}

//to delete when popup will be remade
function OuvrirGDC(aIdChoiceGuide, aImportFileName) {
    txASP.displayChoiceGuide(aIdChoiceGuide, aImportFileName);
    txASP.wdowContainer.getWindow("wCGList").close();
}

// recupéré depuis toolbar.js -> voir ce qu'on fait de ce fichier...
function Launch_MCS(AID_OT, AID_CDC, ATab) {
    if (AID_CDC == null) AID_CDC = 0;
    if (ATab == null) ATab = "";

    var rSettings = {
        idOT: AID_OT,
        sTab: ATab,
        idRequirementSet: AID_CDC
    }
    txASP.displayMCS(rSettings);
    return false;
}

// TODO appeler une autre fonction et faire de l'optim 
CTxASP.prototype.getObjectTypeModelApplications = function (aIdOt) {
    var result = {};
    J.ajax({
        url: sPathTxAspAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "getMainToolbarButtonsState",
            idOT: aIdOt,
            iRWMode: 0
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                result.applicationsModelsButton = JSON.parse(results[3]);
                result.applicationsModelsMenu = JSON.parse(results[4]);
            } else
                msgWarning(results[0]);
        }
    });

    return result;
}

/* Attributs partagés par le générateur */
    // txASP.mainLayout --> TxGenerator.factory.js

/* Methodes partagées par le générateur */
    // txASP.displaySearch ---> CMainToolbar.js
    // txASP.displayBusinessView ---> CMainToolbar.js
    // txASP.displayObjectTypeView ---> CMainToolbar.js
    // txASP.displayObject ---> CTreeObjectCreationModded.js
    // txASP.displayObject ---> CBusinessTreeObjectCreationModded.js