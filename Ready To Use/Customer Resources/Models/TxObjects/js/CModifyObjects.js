/**
 * @class : Manage Modify Objects window
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.idOT *** Mandatory ***
        aSettings.sTagTableView
        aSettings.sAttributesTags
        aSettings.sModifyAttributes
        aSettings.sSourceObjectTag
        aSettings.sModifySourceObject
        aSettings.bNForms
        aSettings.sModifyRepeatForm
        aSettings.bIgnoreRights
 * @returns CModifyObjects object.
 */

var CModifyObjects = function (aSettings, aCallback, aDummyData) {
   checkMandatorySettings(aSettings, ["idOT"]);

    // privileged variables
    this.idOT = aSettings.idOT;
    this.sTagTableView = getValue(aSettings.sTagTableView, "");
    this.sAttributesTags = getValue(aSettings.sAttributesTags, sNull);
    this.attributesSet;
    this.bModifyAttributes = strToBool(getValue(aSettings.sModifyAttributes, "No"));
    this.sSourceObjectTag = getValue(aSettings.sSourceObjectTag, sNull);
    this.sSourceObjectId;
    this.bModifySourceObject = strToBool(getValue(aSettings.sModifySourceObject, "No"));
    this.bNForms = getValue(aSettings.bNForms, "Yes");
    this.bModifyRepeatForm = strToBool(getValue(aSettings.sModifyRepeatForm, "No"));
    this.bIgnoreRights = getValue(aSettings.bIgnoreRights, false);
    this.iStep = 1;
    this.callBack = aCallback;
    this.dummyData = aDummyData;

    if (this.sTagTableView === "") {
        msgWarning(_("L'identifiant de la vue tableau n'est pas renseigné dans l'application de modèle."));
        this.callBack([], this.dummyData);
        return;
    }
    if (this.sAttributesTags === sNull)
        this.bModifyAttributes = true;

    this.initWindow();
}

CModifyObjects.prototype.initWindow = function (aValue) {
    var self = this;

    // Open window
    var windowSettings = {
        sName: "wModifyObjects",
        sHeader: _("Modification d'entités"),
        sIcon: 'resources/theme/img/icon-16.png',
        iWidth: 800,
        iHeight: 500,
        bDenyResize: false,
        bHidePark: true,
        bHideClose: false,
        bModal: true,
        sHTMLAttached: '<div id="mainLayoutModifyObj" style="position: relative; width: 100%; height: 100%;"></div>',
        onResizeFinish: function () { 
            self.layout.setSizes(); 
            self.tabbar.setSize(); 
            self.tableView.dhxGrid.setSizes(); // enable load additional rows with smart rendering activated
        },
        onMaximize: function () {
            self.layout.setSizes();
            self.tabbar.setSize();
            self.tableView.dhxGrid.setSizes(); // enable load additional rows with smart rendering activated 
        },
        onMinimize: function () { self.layout.setSizes(); self.tabbar.setSize(); }
    }; 
    this.wdow = new CWindow(windowSettings);

    // event to execute callBack when the window is closed
    var dhxWin = this.wdow.getWindow("wModifyObjects");
    dhxWin.attachEvent("onClose", function () {
        self.tableView.freeTableView(true);
        self.callBack([], self.dummyData);
        return true;
    });

    // Init interface
    var sHtml = '<div id="cellTabbarModifyObj" style="position: relative; left:5px; top:5px; right:5px; width: calc(100% - 10px); height: calc(100% - 42px);">' +
                    '<div id="tabObjectsModifyObj"></div>' +
                    '<div id="tabAttributesModifyObj"></div>' +
                    '<div id="tabOptionsModifyObj"></div>' +
                '</div>'+
                '<div id="btnBarModifyObj" style="z-index: 10;"></div>';
    J("#mainLayoutModifyObj").append(sHtml);

    this.layout = new CLayout({
        sParent: "mainLayoutModifyObj",
        sPattern: "1C",
        cellsSettings: [
            { sIdDivAttach: "cellTabbarModifyObj", bShowHeader: false }
        ]
    });
    this.layout.progressOn();

    this.btnBar = new CButtonBar({
        sIdDivParent: "btnBarModifyObj",
        btns: [
            { iBtnType: "btNext", sId: "next", sCaption: _("Suivant"), bHidden: !(this.bModifyAttributes || this.bModifySourceObject || this.bModifyRepeatForm), onClick: function () { self.nextStep(); } },
            { iBtnType: "btValidate", onClick: function () { self.validStep1(); } },
            { iBtnType: "btCancel", onClick: function () { self.cancel(); } }
        ]
    });
    
    this.tabbar = new CTabbar({
        sIdDivTabbar: "cellTabbarModifyObj",
        tabs: [
            { ID: "tabObjects", sName: _("Entités"), sContentZone: "tabObjectsModifyObj", bActive: true, bHidden:false },
            { ID: "tabAttributes", sName: _("Caractéristiques"), sContentZone: "tabAttributesModifyObj", bActive: false, bHidden:true },
            { ID: "tabOptions", sName: _("Options"), sContentZone: "tabOptionsModifyObj", bActive: false, bHidden:true }
        ]
    });

    // Init parameters
    J.ajax({
        url: sFileNameTxObjectsAjax,
        type: 'post',
        async: true,
        cache: false,
        data: {
            sFunctionName: "WEBModifyObjectsStep1",
            sAttributesTags: self.sAttributesTags,
            sSourceObjectTag: self.sSourceObjectTag
        },
        success: function (aOutput) {
            var results = aOutput.split("|");
            // an execution status or an execution error message
            if (results[0] != sOk) {
                msgError(results[0]);
                self.layout.progressOff();
                return;
            }
            // load objects selection
            self.addTableView();
            // load attributes selection
            self.attributesSet = JSON.parse(results[1]);
            self.loadTabAttributes();
            // load options
            self.sSourceObjectId = results[2];
            self.loadTabOptions();

            self.layout.progressOff();
        }
    });
}

CModifyObjects.prototype.addTableView = function () {
    var self = this;

    J("#tabObjectsModifyObj").html('<div id="tableViewModifyObjects" class="wrapperWidgetTableView" sTagTableView="' + this.sTagTableView + '"></div>');
    // Load tableView Widget
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
        self.tableView = new CTableView(settingsTableView, function () {
            self.tableView.mainToolbar.hideItem("btnRefresh");
        });
    });
}

CModifyObjects.prototype.loadTabAttributes = function () {
    var sHtml = '<div class="moContainerOption moWrapperTree">' +
                    '<div class="moNameOption">' + _("Caractéristiques à renseigner") + ' : </div>' +
                    '<div id="moTreeAttributes" class="moDisplayTree"></div>' +
                    '<div id="moToolbarAttributes"></div>' +
                '</div>';
    J("#tabAttributesModifyObj").html(sHtml);

    var bReadOnly = true;
    if (this.bModifyAttributes)
        bReadOnly = false;

    // Check for Levels
    if (!this.attributesSet.Levels)
        this.attributesSet.Levels = [];
    
    this.treeAttributes = new CTreeAttribute({
        sIdDivTree: "moTreeAttributes",
        sIdDivToolbar: "moToolbarAttributes",
        sCheckType: "ctCheckboxes",
        idOT: this.idOT,
        bReadOnly: bReadOnly,
        bFolderCheckable: false,
        bRecursiveLink: false,
        bInheritedAttributeCheckable: false,
        bRespectRightToCheck: true,
        AttributeSet: this.attributesSet
    });
}

CModifyObjects.prototype.loadTabOptions = function () {
    var sTitleInfoSource = _("Vous n'avez pas la permission de modifier cette option");
    var bReadOnly = true;
    if (this.bModifySourceObject) {
        bReadOnly = false;
        sTitleInfoSource = _("L'entité source permet de choisir une entité de référence. C'est-à-dire une entité dont les données (si elles sont présentes) \nseront renseignées par défaut dans le formulaire d'édition.");
    }
    var sHtml = '<div class="moContainerOption moWrapperTree">' +
                    '<div class="moNameOption">' + _("Entité source") + ' : <img src="/resources/theme/img/btn_form/16x16_Existing_information.png" class="moImgInfo" title="' + sTitleInfoSource + '"/></div>' +
                    '<div id="moTreeSourceObject" class="moDisplayTree"></div>' +
                    '<div id="moToolbarSourceObject"></div>' +
                '</div>'+
                '<div class="moContainerOption moWrapperRadioButtons">' +
                    '<div class="moNameOption">' + _("Nombre de formulaire") + ' : </div>' +
                    '<div><input type="radio" id="moRadioButtonNForm" name="moOptionNForm" value="NForm" class="moRadioButton"/> <span class="moLabelRadioButton">' + _("Un formulaire par entité") + '</span></div>' +
                    '<div><input type="radio" id="moRadioButton1Form" name="moOptionNForm" value="1Form" class="moRadioButton"/> <span class="moLabelRadioButton">' + _("Un formulaire unique pour toutes les entités") + '</span></div>' +
                '</div>';
    J("#tabOptionsModifyObj").html(sHtml);

    // manage radio buttons
    if (this.bNForms == "Yes")
        J("#moRadioButtonNForm").prop("checked", true);
    else
        J("#moRadioButton1Form").prop("checked", true);
    if (!this.bModifyRepeatForm) {
        J("#moRadioButtonNForm").attr("disabled", true);
        J("#moRadioButton1Form").attr("disabled", true);
    }
    
    // Hide Tab options if no user interaction with options
    if (!(this.bModifySourceObject || this.bModifyRepeatForm))
        this.tabbar.hideTab("tabOptions");

    this.treeSourceObject = new CTreeObject({
        sIdDivTree: "moTreeSourceObject",
        sIdDivToolbar: "moToolbarSourceObject",
        sCheckType: "ctRadioboxes",
        idOT: this.idOT,
        bReadOnly: bReadOnly,
        bFolderCheckable: false,
        sIdsChecked: this.sSourceObjectId
    });
}

CModifyObjects.prototype.validStep1 = function () {
    var self = this;
    this.sObjectsIds = this.tableView.getAllChechedRows();
    this.sAttributesIds = this.getListOfIdsFromAttributesSet(this.treeAttributes.attributeSet);
    this.sSourceObjectId = this.treeSourceObject.getCheckedIds();

    if (this.sObjectsIds == "") {
        msgWarning(_("Sélectionnez des entités à modifier")+".");
        this.tabbar.setTabActive("tabObjects");
        this.iStep = 1;
        return;
    }
    if (this.sAttributesIds == "") {
        msgWarning(_("Sélectionnez des caractéristiques à modifier") + ".");
        this.tabbar.showTab("tabAttributes");
        this.tabbar.setTabActive("tabAttributes");
        this.iStep = 2;
        return;
    }
    if (this.sSourceObjectId == "")
        this.sSourceObjectId = sNull;

    if (this.bModifyRepeatForm)
        this.bNForms = (J('input[name=moOptionNForm]:checked', '.moWrapperRadioButtons').val() == "NForm") ? "Yes" : "No";

    this.layout.progressOn();
    J.ajax({
        url: sFileNameTxObjectsAjax,
        type: 'post',
        async: true,
        cache: false,
        data: {
            sFunctionName: "WEBModifyObjectsStep2",
            idOT: self.idOT,
            sObjectsIds: self.sObjectsIds,
            sAttributesIds: self.sAttributesIds,
            sSourceObjectId: self.sSourceObjectId
        },
        success: function (aOutput) {
            var results = aOutput.split("|");
            // an execution status or an execution error message
            if (results[0] != sOk) {
                msgError(results[0]);
                self.layout.progressOff();
                return;
            }
            var objectType = JSON.parse(results[3]);
            // Get objects to add and update the number of total objects to add.
            var input = {
                jsonObjectsToAdd: JSON.parse(results[1]),
                sObjectTypeName: objectType.sName
            }
            input.iNbObjectsToAdd = input.jsonObjectsToAdd.length;
            input.iNbPopup = (self.bNForms == "Yes") ? input.iNbObjectsToAdd : 1;
            input.bNForms = self.bNForms;
            input.jsonDataForm = [];

            // init settings for window form
            var settingsModifyObjects = {
                sType: "aptId",
                idOT: self.idOT,
                sIcon: format("temp_resources/theme/img/png/#1.png", [objectType.iIcon]),
                sData: "[" + self.sAttributesIds + "]",
                bReturnAttributesValue: true,
                bIgnoreRights: self.bIgnoreRights,
                sIdsRepeatValueAtt: sNull,
                sWindowCaption: _("Formulaire de l'Entité")
            }
            if (!isEmpty(self.sSourceObjectId)) {
                settingsModifyObjects.idSourceObject = parseInt(self.sSourceObjectId)
                settingsModifyObjects.idObject = settingsModifyObjects.idSourceObject;
            } else if (self.bNForms == "Yes") // if only one form : no needs to get Data of first object
                settingsModifyObjects.idObject = input.jsonObjectsToAdd[0].ID;

            popupWriteForm(settingsModifyObjects, function (aInputsSave) { self.saveWriteFormsModifyObjects(aInputsSave) }, input);
        }
    });
}

CModifyObjects.prototype.getListOfIdsFromAttributesSet = function (aAttributesSet) {
    if (!aAttributesSet.Levels) return "";

    // sort Attribute Set in function of Levels
    aAttributesSet.Levels = aAttributesSet.Levels.sort(function (a, b) {
        if (a.id > b.id)
            return 1;
        if (a.id < b.id)
            return -1;
        // a should be equal to b
        return 0;
    });

    // get list of ids form Attribute Set
    var sListIds = "";
    aAttributesSet.Levels.forEach(function (aAttribute) {
        sListIds = qc(sListIds, aAttribute.ID_Att, ",");
    });

    return sListIds;
}

CModifyObjects.prototype.saveWriteFormsModifyObjects = function (aInputsSave) {
    var self = this,
        sDataFormJson = JSON.stringify(aInputsSave.jsonDataForm);
    J.ajax({
        url: sFileNameTxObjectsAjax,
        type: 'post',
        async: true,
        cache: false,
        data: {
            sFunctionName: "WEBModifyObjectsStep3",
            sObjectsToAddJson: JSON.stringify(aInputsSave.jsonObjectsToAdd),
            sDataJSONs: (sDataFormJson != "[]") ? sDataFormJson : "<null>",
            bNForms: self.bNForms
        },
        success: function (aOutput) {
            var results = aOutput.split("|");
            // an execution status or an execution error message
            if (results[0] != sOk) {
                msgError(results[0]);
                self.layout.progressOff();
                return;
            }
            self.tableView.freeTableView(true);
            self.callBack(JSON.parse(results[1]), self.dummyData);
            // End of action : close window
            self.wdow.close();
        }
    });
}

CModifyObjects.prototype.nextStep = function () {
    if (this.iStep == 1) {
        // If no objects selected, inform user and break action
        if (this.tableView.getAllChechedRows() == "") {
            msgWarning(_("Sélectionnez des entités à modifier") + ".");
            return;
        }
        if (this.bModifyAttributes) {
            this.tabbar.showTab("tabAttributes");
            this.tabbar.setTabActive("tabAttributes");
            this.iStep = 2;
        } else if (this.bModifySourceObject || this.bModifyRepeatForm) {
            this.tabbar.showTab("tabOptions");
            this.tabbar.setTabActive("tabOptions");
            this.iStep = 3;
        } else
            this.validStep1();
    } else if (this.iStep == 2) {
        // If no attributes selected, inform user and break action
        if (this.getListOfIdsFromAttributesSet(this.treeAttributes.attributeSet) == "") {
            msgWarning(_("Sélectionnez des caractéristiques à modifier") + ".");
            return;
        }
        if (this.bModifySourceObject || this.bModifyRepeatForm) {
            this.tabbar.showTab("tabOptions");
            this.tabbar.setTabActive("tabOptions");
            this.iStep = 3;
        } else
            this.validStep1();
    } else if (this.iStep == 3)
        this.validStep1();
}       

CModifyObjects.prototype.cancel = function () {
    this.wdow.close();
}