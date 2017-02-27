function CFormTab(aSettings, aDummydata) {
    this.fields = [];
    this.id = aSettings.id;
    this.idObject = aSettings.idObject;
    this.iUniqueId = aSettings.iUniqueId; //useless
    this.bReturnAttributesValue = aSettings.bReturnAttributesValue;
    this.fctGetJsonAttributes = aSettings.fctGetJsonAttributes;
    this.fctCheckValidForm = aSettings.fctCheckValidForm;
    this.wdow = aSettings.wdow;
    this.wdowDrag = aSettings.wdowDrag;
    this.wdowContainer = aSettings.wdowContainer;
    this.idDivActiveTabbar = "divTabbar" + aSettings.iUniqueId;
    this.idTabSelected = aSettings.idTabSelected;
    this.groups = [];
    this.tabbar = aSettings.tabbar;
    this.btnBar = aSettings.btnBar;
    this.bWriteMode = aSettings.bWriteMode;
    this.formContainer = aSettings.formContainer;
    this.dynamicInformations = aSettings.dynamicInformations;
    this.settings = aSettings;
    this.rootObjects = aSettings.rootObjects;
    this.dummyData = aDummydata;
}

CFormTab.prototype.toString = function () {
    return "CFormTab";
}

CFormTab.prototype.unloadComponents = function () {
    this.fields.forEach(function (aField) {
        aField.unloadComponents();
    });
}

CFormTab.prototype.getField = function (aId) {
    return this.fields.find(function (aField){
        return aField.idAttribute == aId;
    });
}

CFormTab.prototype.createFieldGroup = function (aFieldGroup, aAdd) {
    var iTabNumber = this.settings.formTabContainer.getAttribute('tab_id'),
        fieldset = J('<fieldset></fieldset>'),
        sIdFieldGroup = format("#1_#2_#3", [aFieldGroup.ID, iTabNumber, this.iUniqueId]),
        bAddFieldInGroup = false,
        sIdDivGroupParent = format("#divGroup#1_#2_#3", [aFieldGroup.ID_Parent, iTabNumber, this.iUniqueId]);

    fieldset.attr("id", 'group' + sIdFieldGroup);
    fieldset.attr("class", "GenericGroup");

    var legend = J('<legend></legend>'),
        divGroup = J('<div></div>');

    divGroup.attr("id", "divGroup" + sIdFieldGroup);
    legend.attr("class", "GenericLegend");
    legend.css("color", aFieldGroup.sColor);
    legend.html(aFieldGroup.sName);

    fieldset.append(legend);
    fieldset.append(divGroup);

    if (J(sIdDivGroupParent).length > 0) {
        bAddFieldInGroup = true;
        J(sIdDivGroupParent).append(fieldset);
    } else
        this.divBackground.append(fieldset);

    var field = this.getField(aFieldGroup.ID);

    if (!field) {
        field = this.addField({
            field: aFieldGroup,
            formTab: this,
            htmlDiv: fieldset,
            bInitialized: true,
            bOCG: this.isDynamicGroup(aFieldGroup.ID)
        }, this.dummyData);

        if (bAddFieldInGroup) {
            var parentfieldGroup = this.getField(aFieldGroup.ID_Parent);
            if (parentfieldGroup) {
                parentfieldGroup.childrenFields.push(field);
                field.fieldGroup = parentfieldGroup;
            }
        }
        this.groups.push(field);
    } else {
        field.htmlDiv = fieldset;
        field.bInitialized = true;
    }

    return field;
}

CFormTab.prototype.createField = function (aField) {
    var iTabNumber = this.settings.formTabContainer.getAttribute('tab_id'),
        bAddFieldInGroup = false;

    //create the dom part. The field contains a div for the label and a div for the visual component

    //creation of the dom part.
    var divRow = J('<div></div>');
    divRow.attr("class", "GenericRow");
    divRow.attr('idgroup', aField.ID_Parent);
    divRow.css("width", qc(iTxFormFieldWidth, "px"));

    var sIdDivGroup = '#divGroup' + format("#1_#2_#3", [aField.ID_Parent, iTabNumber, this.iUniqueId]);

    if (J(sIdDivGroup).length > 0) {
        bAddFieldInGroup = true;
        J(sIdDivGroup).append(divRow);
    } else
        this.divBackground.append(divRow);

    //attribute name
    var divLabel = J('<div></div>');
    divLabel.attr("id", format("Label#1_#2_#3", [aField.ID, iTabNumber, this.iUniqueId]));
    divLabel.attr("class", "GenericLabel");
    divRow.append(divLabel);

    var divField = J('<div></div>');
    divField.attr("id", format("div#1_#2_#3", [aField.ID, iTabNumber, this.iUniqueId]));
    divField.attr("sLabelHtmlId", divLabel.attr("id"));
    divField.attr("class", "GenericField");

    if (this.settings.sBooleanDisplayType != '')
        divField.attr("sBooleanDisplayType", this.settings.sBooleanDisplayType);
    if (this.settings.sBooleanWords != '')
        divField.attr("sBooleanWords", this.settings.sBooleanWords);
    if (this.settings.bSendMail)
        divField.attr("bSendMail", this.settings.bSendMail);
    if (this.settings.DragNDrop != '')
        divField.attr("DragNDrop", this.settings.DragNDrop);

    divRow.append(divField);

    var field = this.addField({
        field: aField,
        htmlDiv: divField,
        rootObjects: this.rootObjects,
        dynamicInformations: this.dynamicInformations,
        formTab: this,
        bInitialized : true
    }, this.dummyData);

    if (bAddFieldInGroup) {
        var fieldGroup = this.getField(aField.ID_Parent);
        if (fieldGroup) {
            fieldGroup.childrenFields.push(field);
            field.fieldGroup = fieldGroup;
        }
    }

    if (aField.bMandatory) {
        //manage mandatory field, if the field is not filled, change the parent group color et tab name to red
        field.applyMandatoryCss();

        //update tab color
        this.tabbar.setCustomStyle(this.idTabSelected, "red", "red");
    }

    return field;
}

CFormTab.prototype.addField = function (aSettings, aDummyData) {
    var self = this,
        setting = J.extend(aSettings, {
            iUniqueId: this.iUniqueId,
            idObject: this.idObject,
            idActiveTabbar: this.idDivActiveTabbar,
            idTabSelected: this.idTabSelected,
            bWriteMode: this.bWriteMode,
            fctCheckValidForm: this.fctCheckValidForm ,
            tabbar: this.tabbar,
            btnBar: this.btnBar,
            wdow: this.wdow,
            wdowDrag: this.wdowDrag,
            wdowContainer: this.wdowContainer
        }),
        aDummyData = getValue(aDummyData, {}),
        field,
        bAddField = true,
        sType = setting.field.sType;

    switch (sType) {
        case 'ShortString':
            field = new CStringAttribute(setting, aDummyData);
            break;
        case 'Bool':
            field = new CBoolAttribute(setting, aDummyData);
            break;
        case 'SingleValue':
            field = new CSingleValueAttribute(setting, aDummyData);
            break;
        case 'RangeOfValues':
            field = new CRangeOfValuesAttribute(setting, aDummyData);
            break;
        case 'Range+MeanValue':
            field = new CRangeMeanValueAttribute(setting, aDummyData);
            break;
        case 'Date':
            field = new CDateAttribute(setting, aDummyData);
            break;
        case 'DateAndTime':
            field = new CDateTimeAttribute(setting, aDummyData);
            break;
        case 'LongString':
            field = new CTextAttribute(setting, aDummyData);
            break;
        case 'Email':
        case 'Email {}':
            field = new CEmailAttribute(setting, aDummyData);
            break;
        case 'Url':
        case 'Url {}':
            field = new CUrlAttribute(setting, aDummyData);
            break;
        case 'File':
        case 'File {}':
            field = new CFileAttribute(setting, aDummyData);
            break;
        case 'Table':
            field = new CArrayAttribute(setting, aDummyData);
            break;
        case "InverseLink N -o-":
        case "InverseLink 1 -o-":
            field = new CAssociativeAttribute(setting, aDummyData);
            break;
        case "InverseLink 1":
        case "InverseLink N":
        case "DirectLink 1":
        case "DirectLink N":
        case "Enumeration 1":
        case "Enumeration N":
        case "BidirectionalLink 1":
        case "BidirectionalLink N":
            field = new CLinkAttribute(setting, aDummyData);
            break;
        default:
            if (setting.field.sType == "Group")
                field = new CGroup(setting, aDummyData);
            else
                bAddField = false;
    }
    if (bAddField) {
        field.bReturnAttributesValue = this.bReturnAttributesValue;
        this.fields.push(field);
    }
    return field;
}

CFormTab.prototype.updateFieldsSize = function () {
    this.groups.forEach(function (aFieldGroup) {
        if (aFieldGroup.bChildrenMaxSize) {
            //reset divs width.
            //GenericRows to iTxFormFieldWidth (527 by default)px;
            var rDivGroupChildren = J("#" + aFieldGroup.sId).children();
            J.each(rDivGroupChildren, function (i,aChild) {
                var rChild = J(aChild);
                rChild.css("width", qc(iTxFormFieldWidth, "px"));
                //GenericLabel and GenericField to ""
                J(rChild.children()[0]).css("width", "");
                J(rChild.children()[1]).css("width", "");
            })
        }        
    });

    this.fields.forEach(function (aField) {
        if (aField.bInFullScreen)
            aField.updateFullScreenField();
        else if (aField.bMaxWidth)
            aField.adjustSizeFromParent();
    });
}

CFormTab.prototype.lock = function (aLocked) {
    aLocked = getValue(aLocked, true);

    this.fields.forEach(function (aField) {
        aField.lock(aLocked)
    });
}

CFormTab.prototype.closeFields = function () {
    this.fields.forEach(function (aField) {
        aField.closeField();
    });
}

CFormTab.prototype.isDynamicGroup = function (aIdAtt) {
    return this.dynamicInformations.find(function (aDynInfo) {
        return aDynInfo.openCloseGroups.find(function (aOCG) {
            return aOCG.idGroup == aIdAtt;
        });
    }) != null;
}

CFormTab.prototype.isInDynamicGroup = function (aField) {
    var parentField = this.getField(aField.ID_Parent),
        bOk = false;

    if (parentField)
        bOk = this.isInDynamicGroup(parentField.field);

    if (bOk)
        return true;

    return this.dynamicInformations.find(function (aDynInfo) {
        return aDynInfo.openCloseGroups.find(function (aOCG) {
            return aOCG.idGroup == aField.ID;
        });
    }) != null;
}

CFormTab.prototype.adjustComponentSize = function () {
    //adjust components size of long texte tinymce, assos, table if there are lonely in a group.
    this.fields.forEach(function (aField) {
        if (aField.toString() == "CGroup") {
            var bAdjustSizes = true;
            aField.childrenFields.find(function (aChildField) {
                if (!inArray(["CAssociativeAttribute", "CTextAttribute", "CArrayAttribute"], aChildField.toString())) {
                    bAdjustSizes = false;
                    return true;
                }

                if (aChildField.toString() == "CTextAttribute") {
                    if (!aChildField.bUseRichText) {
                        bAdjustSizes = false;
                        return true;
                    }
                }
            });
            if (bAdjustSizes) {
                aField.bChildrenMaxSize = true;
                aField.childrenFields.forEach(function (aChildField) {
                    aChildField.adjustSizeFromParent(true);
                });
            }
        } else if (inArray(["CArrayAttribute", "CFileAttribute"], aField.toString())) {
            var iWidthLabel = J("#" + aField.sLabelDivId).width();

            // Create dummy image to get real width and height
            J("img.clImgToCatchSize").each(function () {
                if (J(this).attr("idAtt") == aField.idAttribute)
                    J("<img>").attr("src", J(this).attr("src")).load(function () {
                        var iWidthData = this.width;
                        J("#" + aField.htmlDiv.attr('id')).parent().css("width", iWidthLabel + iWidthData + "px")
                        J("#" + aField.sLabelDivId).css("width", iWidthLabel + "px")
                    });
            });

            if (aField.toString() == "CFileAttribute") {
                if (aField.bVisu) {
                    aField.adjustSizeFromParent(true);
                }
            }
        }
    });
}