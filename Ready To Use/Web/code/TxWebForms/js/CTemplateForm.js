
function CTemplateForm(aSettings, aCallbackFunction, aDummydata) {
    CForm.call(this, aSettings, aCallbackFunction, aDummydata);
}

CTemplateForm.prototype = createObject(CForm.prototype);
CTemplateForm.prototype.constructor = CTemplateForm;

CTemplateForm.prototype.toString = function () {
    return "CTemplateForm";
}

CTemplateForm.prototype.addFormTabs = function (aSettings, aDummydata) {
    var self = this,
        tabs = this.config.tabs;

    if (tabs) {
        // add all tabs and affect boolean for each one to loading
        tabs.forEach(function (aTab) {
            var idTab = getValue(aTab.idTab, self.tabbar.getAllTabs().length), // if there is no TabId in json, Tab's ID is the number of tab
                sName = getValue(aTab.sName, idTab);

            self.tabbar.addTab(idTab, sName);
            aTab.idTab = idTab;
            if (aTab.sHtmlFileName) {
                if (!inStr(aTab.sHtmlFileName, "/temp_resources/models/TxWebForms/"))
                    aTab.sHtmlFileName = _url("/temp_resources/models/TxWebForms/") + aTab.sHtmlFileName;
            }
        });
    }

    this.tabbar.attachEvent('onSelect', function (aId, aIdOld) {
        if (aIdOld && !self.bWriteMode)
            this.setContentHTML(aIdOld, "")

        if (!self.isWriteFormLoaded(aId)) {
            var sOTTag = getValue(self.config.sOTTag),
                tab = findObject(tabs,"idTab", aId), //get json corresponding to selected tab 
                sBoolDisplayType = getValue(tab.sBooleanDisplayType),
                sBoolWords = getValue(tab.sBooleanWords),
                bSendMail = getValue(tab.bSendMail, false),
                sDragNDrop = getValue(tab.DragNDrop),
                formTab;

            if (tab) {
                // if a html file is specified, create specific formTab, else, create generic formTab
                if (tab.sHtmlFileName) {
                    formTab = new CTemplateFormTab({
                        id: aId,
                        iUniqueId: self.id,
                        idTabSelected: aId,
                        formContainer: self.formContainer,
                        formTabContainer: this.cells(aId),
                        sHtmlFileName: tab.sHtmlFileName,
                        sOTTag: sOTTag,
                        idOT: self.idOT,
                        idObject: aSettings.idObject,
                        sBooleanDisplayType: sBoolDisplayType,
                        sBooleanWords: sBoolWords,
                        bWriteMode: self.bWriteMode,
                        bSendMail: bSendMail,
                        dynamicInformations: self.dynamicInformations,
                        fctGetJsonAttributes: function (aSettings) { return self.getAttributes(aSettings); },
                        fctCheckValidForm: function (aIdAttribute) { self.checkValidForm(aIdAttribute) },
                        wdow: self.wdow,
                        wdowContainer: self.wdowContainer,
                        wdowDrag: self.wdowDrag,
                        bReturnAttributesValue: self.bReturnAttributesValue,
                        btnBar: self.btnBar,
                        tabbar: self.tabbar,
                        DragNDrop: sDragNDrop
                    }, aDummydata);
                } else {
                    var settings = {
                        sOTTag: sOTTag,
                        idOT: self.idOT,
                        idObject: aSettings.idObject
                    }

                    if (tab.tagsAttrName) {
                        settings.sAPT = aptTag;
                        settings.sDataList = JSON.stringify(tab.tagsAttrName);
                    } else if (tab.sTag) {
                        settings.sAPT = aptTabTag;
                        settings.sDataList = tab.sTag;
                    } else if (tab.bDisplayDefaultACAttributes) {
                        settings.sAPT = aptAdvancedCreationTag;
                        settings.sDataList = self.config.sAdvancedCreationTag;
                    } else if (tab.bDisplayDefaultADAttributes) {
                        settings.sAPT = aptAdvancedDuplicationTag;
                        settings.sDataList = self.config.sAdvancedDuplicationTag;
                    } else
                        settings.sAPT = aptOther;

                    var tabInfo = JSON.parse(self.getAttributes(settings));

                    //display settings
                    formTab = new CGenericFormTab({
                        id: aId,
                        idTabSelected: aId,
                        iUniqueId: self.id,
                        formContainer: self.formContainer,
                        formTabContainer: this.cells(aId),
                        idOT: self.idOT,
                        idObject: self.idObject,
                        bWriteMode: self.bWriteMode,
                        bIgnoreRights: getValue(aSettings.bIgnoreRights, false),
                        sMandatoryAttributesIds: getValue(aSettings.sMandatoryAttributesIds, sNull),
                        sDefaultValues: getValue((aSettings.sDefaultValues != "") ? JSON.stringify(aSettings.sDefaultValues) : "", sNull),
                        rootObjects: tabInfo.RootObjects,
                        dynamicInformations: self.dynamicInformations,
                        fctGetJsonAttributes: function (aSettings) { return self.getAttributes(aSettings); },
                        fctCheckValidForm: function (aIdAttribute) { self.checkValidForm(aIdAttribute) },
                        bReturnAttributesValue: self.bReturnAttributesValue,
                        wdow: self.wdow,
                        wdowContainer: self.wdowContainer,
                        wdowDrag: self.wdowDrag,
                        btnBar: self.btnBar,
                        tabbar: self.tabbar,
                        fields: tabInfo.Attributes,
                        sBooleanDisplayType: sBoolDisplayType,
                        sBooleanWords: sBoolWords,
                        bSendMail: bSendMail,
                        DragNDrop: sDragNDrop
                    }, aDummydata);
                }
                self.formTabs.push(formTab);
            }
        }
        if (self.onSelectTab)
            self.onSelectTab(aId);
        return true;
    });

    var idTabActive = getValue(this.idTabSelected, this.tabbar.getAllTabs()[0]);

    if (!inArray(this.tabbar.getAllTabs(), idTabActive))
        idTabActive = this.tabbar.getAllTabs()[0];

    this.tabbar.setTabActive(idTabActive);
}
