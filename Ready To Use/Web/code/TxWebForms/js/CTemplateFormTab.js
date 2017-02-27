function CTemplateFormTab(aSettings, aDummydata){
    CFormTab.call(this, aSettings);
    
    var sOTTag = getValue(aSettings.sOTTag),
        iTabNumber = aSettings.formTabContainer.getAttribute('tab_id'),
        idOT = getValue(aSettings.idOT),
        self = this,
        divBackground = J("<div></div>"),
        idBackGround = "background" + iTabNumber + "_" + this.iUniqueId;

    divBackground.css({
        overflow: 'auto',
        height: '100%'
    });
    divBackground.attr("id", idBackGround);
    divBackground.attr("class", "clBackground");
    divBackground.append("<div style='height:6px;'></div>")
    this.formContainer.append(divBackground);
    aSettings.formTabContainer.attachObject(idBackGround);

    J(divBackground).load(aSettings.sHtmlFileName, function () {
        // get all attribute's tag and attribute's id used in html file
        var attributesTags = [],
            attributesIds = [];
        J(divBackground).find('[sTagAtt]').each(function () {
            if (J(this).attr("sTagAtt"))
                attributesTags.push(J(this).attr("sTagAtt"));
        });

        //get json of all attributes
        var tabInfo = { Attributes: [] };
        if (attributesTags.length > 0) {
            tabInfo = JSON.parse(self.fctGetJsonAttributes({
                sOTTag: sOTTag,
                idOT: idOT,
                idObject: aSettings.idObject,
                sAPT: aptTag,
                sDataList: JSON.stringify(attributesTags)
            }));
        }

        if (attributesIds.length > 0) {
            tabInfo = JSON.parse(self.fctGetJsonAttributes({
                sOTTag: sOTTag, 
                idOT: idOT, 
                idObject: aSettings.idObject,
                sAPT: aptId,
                sDataList: JSON.stringify(attributesIds)
            }));
        }
        
        J(divBackground).find('[sTagAtt]').each(function () {
            var attribute,
                sTag = J(this).attr("sTagAtt");

            if (sTag) {
                tabInfo.Attributes.find(function (aAttr) {
                    var bFound = false;
                    if (!aAttr.Tags)
                        return;

                    aAttr.Tags.find(function (aTag) {
                        if (aTag == sTag) {
                            bFound = true;
                            return true;
                        }
                    });
                    if (bFound) {
                        attribute = aAttr;
                        return true;
                    }
                });
            }

            //update ids to make them unique
            var sIdLabelDiv = J(this).attr("sLabelHtmlId");
            if (sIdLabelDiv) {
                var sNewId = J("#" + sIdLabelDiv).attr("id") + self.iUniqueId;
                J("#" + sIdLabelDiv).attr("id", sNewId);
                J(this).attr("sLabelHtmlId", sNewId)
            }
            
            if (!isAssigned(attribute))
                return;

            J(this).attr("idAtt", attribute.ID);

            // display settings
            if (aSettings.sBooleanDisplayType != '')
                J(this).attr("sBooleanDisplayType", aSettings.sBooleanDisplayType);
            if (aSettings.sBooleanWords != '')
                J(this).attr("sBooleanWords", aSettings.sBooleanWords);
            if (aSettings.bSendMail)
                J(this).attr("bSendMail", aSettings.bSendMail);
            if (aSettings.DragNDrop != '')
                J(this).attr("DragNDrop", aSettings.DragNDrop);

            var field = self.addField({
                field: attribute,
                rootObjects: tabInfo.RootObjects,
                htmlDiv: J(this)
            });

            //update label value if necessary
            if (sNewId) {
                var sNewLabelName = J("#" + sNewId).attr("sValue");
                if (!isEmpty(sNewLabelName)) {
                    J("#" + field.sLabelId).html(sNewLabelName);
                    J("#" + field.sLabelId).attr("title", sNewLabelName);
                }
            }
        });
    });
}

CTemplateFormTab.prototype = createObject(CFormTab.prototype);
CTemplateFormTab.prototype.constructor = CTemplateFormTab;

CTemplateFormTab.prototype.toString = function () {
    return "CTemplateFormTab";
}

CTemplateFormTab.prototype.addField = function (aSettings, aDummyData) {
    aSettings.bTemplate = true;
    return CFormTab.prototype.addField.call(this, aSettings, aDummyData);
}

CTemplateFormTab.prototype.updateFieldsSize = function () {
    CFormTab.prototype.updateFieldsSize.call(this);

    var self = this;
    //this.fields.forEach(function (aField) {
        
    //});
}