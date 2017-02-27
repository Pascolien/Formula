/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        <aSettings from CForm>
        aSettings.idTabSelected 
        aSettings.sOTTag.
        aSettings.sType : aptId, aptAdvancedCreation, aptAdvancedDuplication, aptTabAndAttributes (by default)
        aSettings.sData.
        aSettings.sMandatoryAttributesIds.
        aSettings.sDefaultValues.
 * @returns CGenericForm object.
 */


function CGenericForm(aSettings, aCallbackFunction, aDummydata) {
    CForm.call(this, aSettings, aCallbackFunction, aDummydata);
}

CGenericForm.prototype = createObject(CForm.prototype);
CGenericForm.prototype.constructor = CGenericForm;

CGenericForm.prototype.toString = function () {
    return "CGenericForm";
}

CGenericForm.prototype.addFormTabs = function (aSettings, aDummydata) {
    this.sOTTag = getValue(aSettings.sOTTag);
    this.sType = getValue(aSettings.sType, aptTabAndAttributes);
    this.sData = getValue(aSettings.sData, this.idTabSelected);
    aDummydata = getValue(aDummydata, {});

    var self = this,
        idCurrentTab = 0,
        tabInfo = JSON.parse(this.getAttributes({
            sOTTag: this.sOTTag,
            idOT: this.idOT,
            idObject: this.idObject,
            sAPT: this.sType,
            sDataList: this.sData,
            bIgnoreRights: aSettings.bIgnoreRights,
            sMandatoryAttributesIds: aSettings.sMandatoryAttributesIds,
            sDefaultValues: aSettings.sDefaultValues
        })),// get all tabs from OT
        attributes = getValue(tabInfo.Attributes, []),
        tabDico = {},
        bSomeAttr = attributes.length > 0,
        bAddDescTab = inArray([aptId, aptAdvancedCreation, aptAdvancedDuplication], this.sType),
        iFirstTab = 0,
		bIdTabFound = false;

    //create a unique tab in case of [aptId,aptAdvancedCreation,aptAdvancedDuplication]
    if (bSomeAttr)
        bAddDescTab = bAddDescTab && !(inArrayFromField(attributes, "sType", "Tab"));

    if (bAddDescTab) {
        this.tabbar.addTab(0, _("Descriptif"));
        tabDico[idCurrentTab] = [];
    }

    if (bSomeAttr) {
        attributes.forEach(function (aAttr) {
            if (aAttr.sType == 'Tab') {
                idCurrentTab = aAttr.ID;
                self.tabbar.addTab(idCurrentTab, aAttr.sName);
                if (self.idTabSelected == 0) {
                    self.idTabSelected = idCurrentTab;
                }

                if (iFirstTab < 1)
                    iFirstTab = aAttr.ID;

                if (!bIdTabFound)
                    bIdTabFound = self.idTabSelected == idCurrentTab;
            } else {
                if (!tabDico[idCurrentTab])
                    tabDico[idCurrentTab] = [];

                // update the tab if has mandatory fields
                if (aAttr.bMandatory) {
                    self.tabbar.setCustomStyle(idCurrentTab, "red", "red");

                    if (self.idTabSelected != idCurrentTab)
                        self.hiddenMandatoryAttributes.push(aAttr);
                }

                tabDico[idCurrentTab].push(aAttr);
            }
        });

        this.tabbar.attachEvent('onSelect', function (aId, aIdOld) {
            self.idTabSelected = aId;

            if (self.bWriteMode) {
                if (!self.isWriteFormLoaded(aId)) {
                    var formTab = new CGenericFormTab({
                        id: aId,
                        idTabSelected: aId,
                        iUniqueId: self.id,
                        formContainer: self.formContainer,
                        formTabContainer: this.cells(aId),
                        sOTTag: self.sOTTag,
                        idOT: self.idOT,
                        idObject: self.idObject,
                        bIgnoreRights: aSettings.bIgnoreRights,
                        sMandatoryAttributesIds: aSettings.sMandatoryAttributesIds,
                        sDefaultValues: aSettings.sDefaultValues,
                        rootObjects: tabInfo.RootObjects,
                        dynamicInformations: self.dynamicInformations,
                        fctGetJsonAttributes: function (aSettings) { return self.getAttributes(aSettings); },
                        fctCheckValidForm: function (aIdAttribute) { self.checkValidForm(aIdAttribute) },
                        bReturnAttributesValue: self.bReturnAttributesValue,
                        bWriteMode: self.bWriteMode,
                        wdow: self.wdow,
                        wdowContainer: self.wdowContainer,
                        wdowDrag: self.wdowDrag,
                        tabbar: self.tabbar,
                        btnBar: self.btnBar,
                        fields: tabDico[aId]
                    }, aDummydata);

                    self.formTabs.push(formTab);
                    self.checkValidForm();
                }                 
            } else {
                if (aIdOld)
                    this.setContentHTML(aIdOld, "")

                if (aIdOld && aId !== aIdOld)
                    tabDico[aId] = null;

                if (self.idObject > 0)
                    J.ajax({
                        url: sPathTxAspAjax,
                        cache: false,
                        async:true,
                        data: {
                            sFunctionName: "getFormTab",
                            idObject: self.idObject,
                            idTab: aId,
                            bPortals: false
                        },
                        success: function (aResult) {
                            var results = aResult.split("|");
                            if (results[0] == sOk)
                                self.tabbar.setContentTab(aId, results[1]);
                            else
                                msgWarning(results[0]);
                        }
                    });
            }

            if (self.onSelectTab)
                self.onSelectTab(aId);
            
            return true;
        });
    }

    if (!bIdTabFound)
        this.idTabSelected = iFirstTab

    if (!tabDico[this.idTabSelected])
        tabDico[this.idTabSelected] = [];

    setTimeout(function () {
        self.tabbar.setTabActive(self.idTabSelected);
    });
}
