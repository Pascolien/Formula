
function CGenericFormTab(aSettings, aDummyData) {
    CFormTab.call(this, aSettings);
    var self = this,
        iTabNumber = aSettings.formTabContainer.getAttribute('tab_id'),
        idBackGround = "background" + iTabNumber + "_" + this.iUniqueId,
        fields = aSettings.fields;

    this.divBackground = J("<div></div>");

    this.divBackground.css({
        overflow: 'auto',
        height: '100%'
    });
    this.divBackground.attr("id", idBackGround);
    this.divBackground.attr("class", "clBackground");
    this.divBackground.append("<div style='height:6px;'></div>")
    this.formContainer.append(this.divBackground);
    aSettings.formTabContainer.attachObject(idBackGround);

    if (!isAssigned(fields)) {
        var tabInfo = JSON.parse(this.fctGetJsonAttributes({
            sOTTag: aSettings.sOTTag,
            idOT: aSettings.idOT,
            idObject: this.idObject,
            sAPT: aptTab,
            sDataList: aSettings.id,
            bIgnoreRights: aSettings.bIgnoreRights,
            sDefaultValues: aSettings.sDefaultValues
        }));

        this.rootObjects = tabInfo.RootObjects;
        fields = getValue(tabInfo.Attributes,[]);
    }
    
    fields.forEach(function (aField) {
        var bAddFieldInGroup = false;
        
        if (aField.sType == 'Group') {
            //create only root fields
            var bToCreate = !self.isInDynamicGroup(aField) || aField.ID_Parent == iTabNumber;

            if (bToCreate){
                var fieldGroup = self.createFieldGroup(aField);
                if (fieldGroup.bOCG)
                    fieldGroup.hide(true);
            }
            else {
                var field = self.addField({
                    field: aField,
                    formTab: self,
                    bOCG: self.isDynamicGroup(aField.ID),
                    bInitialized : false
                }, aDummyData);

                var fieldGroup = self.getField(aField.ID_Parent);
                if (fieldGroup) {
                    fieldGroup.childrenFields.push(field);
                    field.fieldGroup = fieldGroup;
                }

                self.groups.push(field)
            }            
        } else {
            var bToCreate = !self.isInDynamicGroup(aField);

            if (bToCreate)
                self.createField(aField);
            else {
                var field = {
                    field: aField,
                    rootObjects: self.rootObjects,
                    dynamicInformations: self.dynamicInformations,
                    formTab: self,
                    dummyData: aDummyData,
                    bInitialized : false
                };

                var fieldGroup = self.getField(aField.ID_Parent);
                if (fieldGroup) {
                    fieldGroup.childrenFields.push(field);
                    field.fieldGroup = fieldGroup;
                }
            }            
        }
    });

    this.adjustComponentSize();
}

CGenericFormTab.prototype = createObject(CFormTab.prototype);
CGenericFormTab.prototype.constructor = CGenericFormTab;

CGenericFormTab.prototype.toString = function () {
    return "CGenericFormTab";
}

