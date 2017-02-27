/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param
       <aSettings from CToolbar>

 * @returns CMainToolbar object.
 */

//teexma standard buttons
var btnFormView = "btnFormView",
    btnTableView = "btnTableView",
    btnBusinessView = "btnBusinessView",
    btnEdit = "btnEdit",
    btnPrev = "btnPrev",
    btnNext = "btnNext",
    btnHome = "btnHome",
    btnMCS = "btnMCS",
    btnChoiceGuide = "btnChoiceGuide",
    btnRequirementSet = "btnRequirementSet",
    btnCurves = "btnCurves",
    btnCharts = "btnCharts",
    btnExport = "btnExport",
    btnExtract = "btnExtract",
    btnApplicationModel = "btnApplicationModel",
    btnHelp = "btnHelp",
    btnAbout = "btnAbout",
    btnSepAppliModel = "btnSepAppliModel",
    btnResetLog = "btnResetLog",
    btnSaveLog = "btnSaveLog",
    btnInputSearch = "btnInputSearch",
    btnSearch = "btnSearch",
    btnUser = "btnUser";

var CMainToolbar = function (aSettings) {
    this.settings = aSettings;
    this.idOT = getValue(aSettings.idOT, txASP.idOT);
    this.txTextSearch;
    this.txLog;
    this.popupInterface;
    this.onFormViewPressed = aSettings.onFormViewPressed;
    this.onBusinessViewPressed = aSettings.onBusinessViewPressed;
    this.onBrowsingNavigation = aSettings.onBrowsingNavigation;
    this.onLockObjectClicked = aSettings.onLockObjectClicked;
    this.wdowContainer = new CWindow();
    var self = this;
    this.fctDisplayObject = aSettings.fctDisplayObject || function (aIdObject) { txASP.displayObject(aIdObject) };

    txASP.displaySearch = function (aValue) {
        self.displaySearch(aValue);
    }

    txASP.displayBusinessView = function (aIdView, aIdObject) {
        self.displayBusinessView(aIdView, aIdObject);
    }

    txASP.displayObjectTypeView = function (aIdObjectType, aIdObject) {
        self.displayObjectTypeView(aIdObjectType, aIdObject);
    }

    txASP.displayHome = function (aIdOT) {
        self.displayHome();
    }

    this.functionsToExecute = {
        "idOT": ["onObjectTypechange"],
        "txObjs": ["updateSelectedObjects"],
        "idTab": ["changeTab"]
    }

    txASP.businessViews

    aSettings.sSkin = "dhx_web";
    aSettings.iIconSize = 24;
    aSettings.sIconPath = _url("/resources/theme/img/btn_titre/");
    aSettings.btns = [
            { sId: btnHome, iBtnType: tbtSimple, sHint: _("Retourner au portail"), sImgEnabled: "home.png", sImgDisabled: "home_disabled.png" },
            { sId: btnNext + "Sep", iBtnType: tbtSeparator },
            { sId: btnFormView, iBtnType: tbtTwoState, sHint: _("Basculer en vue par Type d'Entités"), sImgEnabled: "form_view.png", bPressed: true },
            { sId: btnTableView, iBtnType: tbtSimple, sHint: _("Basculer en vue Tabulaire"), sImgEnabled: "table_view.png" },
            { sId: btnBusinessView, iBtnType: tbtTwoState, sHint: _("Basculer en Vue Métier (visualisation des Entités liées dans l'arborescence)"), sImgEnabled: "business_view.png", sImgDisabled: "business_view_disabled.png", bDisabled: txASP.businessViews < 1 },
            { sId: btnBusinessView + "Sep", iBtnType: tbtSeparator },
            { sId: btnEdit, iBtnType: tbtSimple, sHint: _("Éditer l'Entité sélectionnée..."), sImgEnabled: "editObject.png", sImgDisabled: "editObjectDisabled.png", bDisabled: true },
            { sId: btnMCS, iBtnType: tbtSimple, sHint: _("Sélection Multi-Critères..."), sImgEnabled: "module_mcs.png", sImgDisabled: "module_mcs_disabled.png" },
            { sId: btnChoiceGuide, iBtnType: tbtSimple, sHint: _("Guide de Choix"), sImgEnabled: "module_cg.png" },
            { sId: btnRequirementSet, iBtnType: tbtSimple, sHint: _("Ouvrir un Cahier des Charges"), sImgEnabled: "module_rs.png", sImgDisabled: "module_rs_disabled.png" },
            { sId: btnCurves, iBtnType: tbtSimple, sHint: _("Visualisation / Superposition de Courbes"), sImgEnabled: "module_curves.png", sImgDisabled: "module_curves_disabled.png" },
            { sId: btnCharts, iBtnType: tbtSimple, sHint: _("Module de courbe"), sImgEnabled: "TxCharts.png" },
            { sId: btnCharts + "Sep", iBtnType: tbtSeparator },
            { sId: btnExport, iBtnType: tbtSimple, sHint: _("Exportation"), sImgEnabled: "module_export.png" },
            { sId: btnExtract, iBtnType: tbtSimple, sHint: _("Extraction"), sImgEnabled: "module_extract.png", sImgDisabled: "module_extract_disabled.png" },
            { sId: btnExtract + "Sep", iBtnType: tbtSeparator },
            { sId: btnApplicationModel, iBtnType: tbtSelect, sHint: _("Lancer un modèle..."), bAsSelect: false, bKeepSelect: false, sImgEnabled: "applicationModels.png", sImgDisabled: "applicationModelsDisabled.png", bDisabled: true },
            { sId: btnHelp, iBtnType: tbtSimple, sHint: _("Aide"), sImgEnabled: "help.png" },
            { sId: btnAbout, iBtnType: tbtSimple, sHint: _("A propos"), sImgEnabled: "about.png" },
            { sId: btnAbout + "Sep", iBtnType: tbtSeparator, bAddSpacer: true },
            { sId: btnSepAppliModel, iBtnType: tbtSeparator, bAddSpacer: true, bHide: true, iPos: 50 },
            { sId: btnResetLog, iBtnType: tbtSimple, sHint: _("Réinitialiser les mesures"), sImgEnabled: "24x24-ResetLogs.png", bHide: true, iPos: 51 },
            { sId: btnSaveLog, iBtnType: tbtSimple, sHint: _("Sauvegarder le cas d'usage..."), sImgEnabled: "24x24-SaveLogs.png", bHide: true, iPos: 52 },
            { sId: btnSaveLog + "Sep", iBtnType: tbtSeparator, bHide: true, iPos: 53 },
            { sId: btnInputSearch, iBtnType: tbtInput, sHint: _("Rechercher"), iPos: 54, iWidth: 250 },
            { sId: btnSearch, iBtnType: tbtSimple, sHint: _("Rechercher"), sImgEnabled: "search.png", iPos: 55 },
            { sId: btnUser, iBtnType: tbtTwoState, sHint: _("Informations de l'utilisateur"), sImgEnabled: "user.png", iPos: 56 }
    ];

    if (!aSettings.onClick)
        aSettings.onClick = function (aId) {
            // save last item clicked
            var elementId = J(this)[0].idPrefix + aId;
            var objPull = J(this)[0].objPull;
            if (objPull[elementId])
                J.lastMainToolbarItemClicked = objPull[elementId].obj;

            self.onClick(aId);
        };
    aSettings.onEnter = function (aId, aValue) { self.displaySearch(aValue) };
    aSettings.onStateChange = function (aId) {
        // save last item clicked
        var elementId = J(this)[0].idPrefix + aId;
        var objPull = J(this)[0].objPull;
        if (objPull[elementId])
            J.lastMainToolbarItemClicked = objPull[elementId].obj;
        self.onStateChange(aId)
    };

    J(document).on("click", function (e) {
        var mainContainer = J("#mainContainer");
        if (mainContainer.hasClass("showing"))
            return;
        if (!mainContainer.is(e.target) && mainContainer.has(e.target).length < 1) {
            if (self.toolbar.getItemState(btnUser)) {
                self.setItemState(btnUser, false);
                mainContainer.slideUp("slow", function () {
                    J(this).removeClass("showing");
                });
            }
        }
    });

    var sIdDivTxLogo = aSettings.sIdDivTxLogo;
    if (sIdDivTxLogo) {
        J("#" + sIdDivTxLogo).load(_url("/code/TxASP/TxLogo.html"), function () {
            J("#idADisplayHomePage").on("click", function () { self.displayHome() });
        });
    }

	this.txLog = new CTxLog({}, function (aIsLogActive) {
		if (aIsLogActive) {
			// wait few sec for Main toolbar initialization
			setTimeout(function () {
				self.showItem(btnResetLog);
				self.showItem(btnSaveLog);
				self.showItem(btnSaveLog + "Sep");
			}, 500);
		}
	});

    CToolbar.call(this, aSettings);

    this.updateButtonsState(this.idOT, 0); // init buttons just after creation of toolbar
    this.setButtonVisible(btnCharts, getValue(aSettings.bDisplayBtnTxCharts, bDisplayBtnTxCharts));
};

//inheritage
CMainToolbar.prototype = createObject(CToolbar.prototype);
CMainToolbar.prototype.constructor = CMainToolbar; // Otherwise instances of CMainToolbar would have a constructor of CToolbar

CMainToolbar.prototype.toString = function () {
    return "CMainToolbar";
}

CMainToolbar.prototype.updateButtonsState = function (aIdOT, aRWMode) {
    var self = this,
        bBtnCurveEnabled,
        bBtnExtractEnabled;
    J.ajax({
        url: sPathTxAspAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "getMainToolbarButtonsState",
            idOT: aIdOT,
            iRWMode: aRWMode
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                bBtnCurveEnabled = getBValue(results[1]);
                bBtnExtractEnabled = getBValue(results[2]);
                self.modelsApplicationsButton = JSON.parse(results[3]);
                self.modelsApplicationsMenu = JSON.parse(results[4]);

            } else {
                msgWarning(results[0]);
            }
        }
    });

    this.doUpdateButtonsState(bBtnCurveEnabled, bBtnExtractEnabled);
}

CMainToolbar.prototype.doUpdateButtonsState = function (aBtnCurveEnabled, aBtnExtractEnabled) {
    var self = this,
        OT = getOT(this.idOT);

    this.setButtonEnable(btnCurves, aBtnCurveEnabled);
    this.setButtonEnable(btnExtract, aBtnExtractEnabled);

    //update application models buttons
    //delete applications models buttons.
    this.removeItemExt("applicationModel");

    //add new application models buttons
    var iStartPos = this.getPosition(btnAbout + "Sep") + 1;
    this.modelsApplicationsButton.forEach(function (aBtn) {
        aBtn.sId = format("applicationModel#1", [aBtn.ID]);
        aBtn.sHint = aBtn.sName;
        if (isAssigned(aBtn.sDescription))
            aBtn.sHint = qc(aBtn.sHint, aBtn.sDescription, "\n");
        var sIcon = getValue(aBtn.sIconRFilePath, "24x24_No_Model.bmp");
        aBtn.sImgEnabled = format("../../../../temp_resources/models/#1", [sIcon]);
        aBtn.iPos = iStartPos;
        self.addButton(aBtn);
        iStartPos++;
    });

    //add application model in menu model
    var options = [];
    this.modelsApplicationsMenu.forEach(function (aBtn) {
        aBtn.sId = format("applicationModel#1", [aBtn.ID]);
        var option = { sId: aBtn.sId, ID: aBtn.ID, sCaption: aBtn.sName, sObjectDependency: aBtn.sObjectDependency };
        options.push(option);
        self.btns.push(option);
        self.iCount++;
    });
    this.reloadListOptions(btnApplicationModel, options);

    this.setButtonEnable(btnApplicationModel, options.length > 0); 
}

CMainToolbar.prototype.updateEditButtonState = function () {
    var bMultipleSelection = this.txObjects.length > 1,
        node = this.txObjects[0],
        bAllowEdition = this.idOT != idOTPortal && !bMultipleSelection;

    if (isAssigned(node))
        bAllowEdition = bAllowEdition && !node.bFolder && node.iRight > dbrRead;
    else
        bAllowEdition = bAllowEdition && false;

    this.setButtonEnable(btnEdit, bAllowEdition);
}

CMainToolbar.prototype.updateModelsApplicationsButton = function () {
    var self = this,
        iObjectsSelected = this.txObjects.length;

    this.modelsApplicationsButton.forEach(function (aBtn) {
        if (aBtn.sObjectDependency === "odASingleOne") {
            if (iObjectsSelected > 0)
                self.enableItem(aBtn.sId);
            else
                self.disableItem(aBtn.sId);
        } // else "odZeroToOne", "odNone", "odMany" --> always enable these models applications
    });

    this.modelsApplicationsMenu.forEach(function (aBtn) {
        if (aBtn.sObjectDependency === "odASingleOne") {
            if (iObjectsSelected > 0)
                self.enableListOption(btnApplicationModel, aBtn.sId);
            else
                self.disableListOption(btnApplicationModel, aBtn.sId);
        } // else "odZeroToOne", "odNone", "odMany" --> always enable these models applications
    });
}

// onclick function for standard buttons
CMainToolbar.prototype.onClick = function (aId) {
    switch (aId) {
        case btnTableView:
            this.displayTableView();
            break;
        case btnEdit:
            this.onEditObject();
            break;
        case btnPrev:
            this.onBrowsingNavigation(true);
            break;
        case btnNext:
            this.onBrowsingNavigation(false);
            break;
        case btnHome:
            this.displayHome();
            break;
        case btnMCS:
            this.onMCSClicked();
            break;
        case btnChoiceGuide:
            this.onCGListClicked();
            break;
        case btnRequirementSet:
            this.displayPopupRequirementSet();
            break;
        case btnCurves:
            this.displayCurves();
            break;
        case btnCharts:
            this.displayTxCharts();
            break;
        case btnExport:
            this.onExportationClicked();
            break;
        case btnExtract:
            this.onExtractionClicked();
            break;
        case btnHelp:
            this.displayHelp();
            break;
        case btnAbout:
            this.displayAbout();
            break;
        case btnSearch:
            this.displaySearch(this.toolbar.getValue(btnInputSearch));
            break;
        case btnResetLog:
            this.txLog.resetLog();
            break;
        case btnSaveLog:
            this.txLog.captureLog();
            break;
        default:
            //case of application Model.
            if (inStr(aId, "applicationModel")) {
                var btn = this.getButton(aId);
                this.fctExecuteApplicationModel(btn)
            }
            break;
    }
    return true;
}

CMainToolbar.prototype.onStateChange = function (aId, aState) {
    switch (aId) {
        case btnFormView:
            txASP.idObject = this.txObjects.length > 0 ? this.txObjects[0].ID : 0;
            this.displayObjectTypeView(this.idOT, txASP.idObject);
            break;
        case btnBusinessView:
            txASP.idObject = this.txObjects.length > 0 ? this.txObjects[0].ID : 0;
            var view = txASP.businessViews.find(function(bv) { return bv.ID_OT === this.idOT }) || txASP.businessViews[0];
            this.displayBusinessView(view.ID, txASP.idObject);
            break;
        case btnUser:
            this.displayUserInfo();
            break;
    }
}

CMainToolbar.prototype.displayObjectTypeView = function (aIdOT, aIdObject) {
    var self = this;
    this.setItemState(btnFormView, true);
    this.setItemState(btnBusinessView, false);
    if (!this.isPressed(btnFormView) && (!aIdOT || aIdOT == this.idOT)) {
        this.setItemState(btnFormView, true);
        this.setItemState(btnBusinessView, false);
        return;
    }

    txASP.idObject = aIdObject || 0;
    txASP.idOT = aIdOT;

    this._replaceModule("businessTreeConfig", "standardTreeConfig");
}

CMainToolbar.prototype.displayBusinessView = function (aIdView, aIdObject) {
    var self = this;
    this.setItemState(btnFormView, false);
    this.setItemState(btnBusinessView, true);

    if (!this.isPressed(btnBusinessView) && (!aIdView || aIdView == this.idView)) {
        this.setItemState(btnFormView, true);
        this.setItemState(btnBusinessView, false);
        return;
    }

    txASP.idObject = aIdObject || 0;
    txASP.idView = aIdView;

    this._replaceModule("standardTreeConfig", "businessTreeConfig");
}

CMainToolbar.prototype.displayTableView = function () {
    var self = this,
        sDivName = 'idDivTableViewPage';

    J(document.body).append('<div id="' + sDivName + '"></div>');

    J('#' + sDivName).load(_url('/code/asp/TxTableView/TxTableView.asp'), {
        idOT: self.idOT
    });

    this.wdowContainer.addWindow({
        sName: "wTableView",
        sHeader: _("Vue Tabulaire"),
        sIcon: 'temp_resources/theme/img/btn_titre/table_view-16.png',
        iWidth: 900,
        iHeight: 550,
        bModal: false,
        bDenyResize: true,
        sObjectAttached: sDivName
    });
}

CMainToolbar.prototype.displayPopupRequirementSet = function () {
    this.wdowContainer.addWindow({
        sName: "wRequirementSet",
        sHeader: _("Sélection Multicritère - Cahier des Charges"),
        sIcon: 'temp_resources/theme/img/btn_titre/module_rs-16.png',
        iWidth: 440,
        iHeight: 390,
        bDenyResize: true,
        bHidePark: true,
        sUrlAttached: _url('/code/asp/selection_multicriteria.asp')
    });
}

CMainToolbar.prototype.displayTxCharts = function () {
    DisplayTxCharts();
}

CMainToolbar.prototype.displayHelp = function () {
    window.open("http://help.teexma.com");
}

CMainToolbar.prototype.displayAbout = function () {
    new CTxAbout();
}

CMainToolbar.prototype.displaySearch = function (aValue, aIdOT, aSearchInData) {
    var self = this;

    if (isEmpty(this.txTextSearch)) {
        this.txTextSearch = new CTxTextSearch({
            sAndWords: aValue,
            idOT: getValue(aIdOT, this.idOT),
            bSearchInData: getValue(aSearchInData, true),
            fctSelectObject: this.fctDisplayObject
        }, function () { self.txTextSearch = null; });
    } else
        this.txTextSearch.search(aValue);

    return false;
}

CMainToolbar.prototype.displayUserInfo = function () {
    var self = this;
    if (!this.popupInterface) {
        var bDisabled = txASP.bManualConnectionProhibited,
            sStyle = bDisabled ? "color: #aaaaaa;" : "",
            sHint = bDisabled ? _("La connexion automatique est activée : fermer l'onglet pour se déconnecter.") : "";

        this.popupInterface = new CPopupInterface({
            sHtmlContent: '<div id="userInformation">' +
                            '<p id="userName"></p>' +
                            '<p id="lastConnection">' +
                                '<label for="lastConnection"></label>' +
                            '</p>' +
                        '</div>',
            iWidth: 350,
            iHeight: 120,
            bHideCloseButton: true,
            buttons: [
                {
                    id: 'userDisconnection',
                    text: _("Déconnexion"),
                    cssClass: 'icon-switch',
                    style: sStyle,
                    title: sHint,
                    onClick: function () {
                        txASP.exitTEEXMA();
                        self.popupInterface.hidePopup(function () {
                            self.toolbar.setItemState(btnUser, false);
                        });
                    },
                    bDisabled: bDisabled
                },
                {
                    id: 'userChangePassword',
                    text: _("Changer de mot de passe"),
                    cssClass: 'icon-key',
                    onClick: function () {
                        new CTxChangePassword();
                        self.popupInterface.hidePopup(function () {
                            self.toolbar.setItemState(btnUser, false);
                        });
                    },
                    bDisabled: bDisabled
                },
            ]
        });
        // init Interface
        J("#userName").text(txASP.sUserName);
        J("#lastConnection").text(_("Dernière connexion le :") + " " + txASP.sLastConnectionDate);
        // show popup
        this.popupInterface.progressOff();
        this.popupInterface.showPopup(J.lastMainToolbarItemClicked);
    } else
        this.popupInterface.toggle(function (aDisplay) {
            if (aDisplay)
                self.toolbar.setItemState(btnUser, true);
            else 
                self.toolbar.setItemState(btnUser, false);
        });
};

function DisplayTxCharts(aIdObject, aIdAttribute) {
    var sParam = "";
    if ((aIdObject) && (aIdAttribute))
        sParam = "?ID_Object=" + aIdObject + "&ID_Attribute=" + aIdAttribute;

    window.open(_url("/temp_resources/models/TxCharts/TxCharts.asp") + sParam);
}

CMainToolbar.prototype.onObjectTypechange = function (aIdOt) {
    this.idOT = aIdOt;
    this.OT = getOT(aIdOt);

    this.txObjects = [];

    // updating portal icon
    if (this.idOT === idOTPortal) {
        //this.disableItem(btnHome);
        this.disableItem(btnEdit);
    }
    /*else {
        this.enableItem(btnHome);
    }*/

    this.updateButtonsState(this.idOT, 0);
    this.updateModelsApplicationsButton();
};

CMainToolbar.prototype.updateSelectedObjects = function (aObjects) {
    this.txObjects = aObjects;

    this.updateEditButtonState();
    
    if (this.txObjects && this.txObjects.length > 0) {
        if (this.idOT === this.txObjects[0].ID_OT) {
            this.updateModelsApplicationsButton();
        } else {
            this.idOT = this.txObjects[0].ID_OT;
            this.updateButtonsState(this.idOT, 0);
        }
    } else {
        this.updateModelsApplicationsButton();
    }
};

CMainToolbar.prototype.changeTab = function (aIdTab) {
    this.idTab = aIdTab;
}

CMainToolbar.prototype.getIdObjectsFromSameObjectType = function () {
    var self = this;
    return (this.txObjects && this.txObjects.length > 0) ? this.txObjects.filter(function (aTxObject) {
        return aTxObject.ID_OT === self.idOT;
    }).map(function (txObject) {
        return txObject.ID;
    }).join(";") : "";
}

CMainToolbar.prototype.displayHome = function () {
    var array = this.settings.functions["displayHome"];
    this._changeDataStorage(array, (new Date()).toString());
}

CMainToolbar.prototype.onExportationClicked = function () {
    txASP.displayExportation(this.idOT, this.getIdObjectsFromSameObjectType());
}

CMainToolbar.prototype.onExtractionClicked = function () {
    txASP.displayExtraction(this.idOT, this.getIdObjectsFromSameObjectType());
}

CMainToolbar.prototype.fctExecuteApplicationModel = function (aModelApplication) {
    var self = this;
    txASP.executeApplicationModel(aModelApplication, this.getIdObjectsFromSameObjectType(), this.idOT).then(function (txObjects) {
        if (!txObjects[txObjects.length - 1].updateObject) return;
        if (txObjects[txObjects.length - 1].updateObject.ID === (self.txObjects.length > 0 ? self.txObjects[0].ID : 0)) {
            var array = self.settings.functions["editObject"];
            self._changeDataStorage(array, (new Date()).toString());
        }
    });
}

CMainToolbar.prototype.onEditObject = function () {
    var self = this,
        txObject = this.txObjects[0],
        idTab = self.idTab;

    if (!txObject)
        return;

    if (txObject.bFolder)
        return;

    if (!this.OT)
        this.OT = getOT(this.idOT);

    if (this.OT.iLocking_Type != ltNone) {
        var iLockingState = checkObjectLocked(txObject.ID);
        var fLockingDuration = Math.round(this.OT.fLocking_Duration);
        switch (iLockingState) {
            case lsAutomaticallyLocked:
                lockObject(txObject.ID);
                displayForm(txObject, idTab, fLockingDuration);
                break;
            case lsLockedAndDisabled:
            case lsLocked:
                msgWarning(_Fmt("L'Entité '#1' est verrouillée.", [txObject.sName]));
                break;
            case lsUnlocked:
                if (this.OT.iLocking_Type == ltManual)
                    msgYesNo(_Fmt("Voulez- vous verrouiller l'Entité '#1' pour une durée de #2 minute(s) ?", [txObject.sName, fLockingDuration]),
                        function (aOk) {
                            if (aOk)
                                lockObject(txObject.ID);
                            else
                                fLockingDuration = 0;

                            displayForm(txObject, idTab, fLockingDuration);
                        });
                break;
        }
        return true;
    } else
        displayForm(txObject, idTab);

    function displayForm(aTxObject, aIdTab, aTimeoutLocking) {
        aTimeoutLocking = getValue(aTimeoutLocking, 0) * 60;

        var fctLockingCallback = aTimeoutLocking > 0 ? function () { self.lockingObjectTimeout(aTxObject) } : null;

        self.writeForm = new CTxForm({
            idObject: aTxObject.ID,
            idTabSelected: aIdTab,
            idOT: aTxObject.ID_OT,
            bDisplayBanner: true,
            sWindowCaption: aTxObject.sName,
            object: aTxObject,
            fTimeoutLockingInSeconds: aTimeoutLocking,
            fctLockingCallback: fctLockingCallback,
            sIcon: format("temp_resources/theme/img/png/#1.png", [aTxObject.iIcon])
        }, function (aValidate, aUpdatedInstructions, aDummyData) {
            if (aValidate) {
                // TODO passage dans le fichier de config
                self._changeDataStorage(["updateTree"], { "txObject": aTxObject, "instructions": aUpdatedInstructions, "date": (new Date()).toString() });

                var array = self.settings.functions["editObject"];
                self._changeDataStorage(array, (new Date()).toString());
            }
            if (aTimeoutLocking > 0 && !self.writeForm.bLocked)
                unlockObject(aTxObject.ID);
        });
    }
}

CMainToolbar.prototype.lockingObjectTimeout = function (aNode) {
    var self = this;

    //check si on peut la reverrouiller
    var iLockingState = checkObjectLocked(aNode.ID);
    switch (iLockingState) {
        case lsLockedAndDisabled:
        case lsLocked:
            // si déjà verrouillé par un autre utilisateur
            //afficher un bouton checker le verrouillage dans le formulaire
            msgWarning(_Fmt("L'Entité '#1' est déjà verrouillée. Vous pouvez revérifier la disponibilité de l'Entité en cliquant sur le bouton Verrouiller l'Entité.<br>Si vous fermer la fenêtre, les modifications seront perdues.", [aNode.sName]));
            break;
        case lsAutomaticallyLocked:
        case lsUnrelevant:
        case lsUnlocked:
            //popup de confirmation de reverrouillage
            var fLockingDuration = Math.round(this.OT.fLocking_Duration);

            msgYesNo(_Fmt("Voulez-vous re-verrouiller l'Entité '#1' pour une durée de #2 minute(s) ?", [aNode.sName, fLockingDuration]),
                function (aOk) {
                    if (aOk){
                        lockObject(aNode.ID);
                        self.writeForm.lock(false);
                    } else
                        unlockObject(aNode.ID);
                });
            break;
    }
}

CMainToolbar.prototype.onMCSClicked = function () {
    txASP.displayMCS({ idOT: this.idOT });
}

CMainToolbar.prototype.onCGListClicked = function () {
    txASP.displayPopupCGList(this.idOT);
}