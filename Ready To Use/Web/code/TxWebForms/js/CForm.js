/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings = {
            idOT : id of object type,
            object : the object concerned,
            idObject : the idObject concerned,
            idTabSelected : the tab id to select at the initialisation of the form,
            idObjectNav : it permit to manage form for informations / sources,
            idAttribute : it permit to manage form for informations / sources,
            bReturnAttributesValue : if true, the validation not create / update the object, it return attributes modified in the callback,
            bReadOnly : the form is in ReadOnly mode,
            bWriteMode : true by default, if faulse, it display a read form, 
            bDisplayBanner : if true, a banner with the object name is displayed before the tabbar,
            fTimeoutLockingInSeconds : the time in seconds before the form lock,
            sDisplayMode : dmDiv or dmWdow (by default), permit to display the form in a window or in a div,
            sWindowId : the sId window,
            sIdDivContainer : the id div container which will contain the formulaire in case of dmDiv.
            wdowContainer : the window container permit to manage modal windows,
            iWindowWidth : the width of the window,
            iWindowHeight : the height of the window,
            sWindowCaption : the title of the window,
            sIcon : the icon before the title of the window,
            config : the configuration applied in this form,
            fctLockingCallback : the callback function called when the fTimeoutLockingInSeconds elapse,
            onSelectTab : the function called when a tab is selected
        }
 * @returns CForm object.
 */

var sPathFileTxWebFormAjax = _url("/code/TxWebForms/TxWebFormsAjax.asp");

var dmWdow = "dmWdow",
    dmDiv = "dmDiv";

//enum apt
var aptTag = "aptTag",
    aptTabTag = "aptTabTag",
    aptId = "aptId",
    aptTab = "aptTab",
    aptTabAndAttributes = "aptTabAndAttributes",
    aptAdvancedCreation = "aptAdvancedCreation",
    aptAdvancedCreationTag = "aptAdvancedCreationTag",
    aptAdvancedDuplication = "aptAdvancedDuplication",
    aptAdvancedDuplicationTag = "aptAdvancedDuplicationTag",
    aptOther = "aptOther";

function CForm(aSettings, aCallbackFunction, aDummydata) {
    var self = this;
    this.id = getUniqueId();
    this.formTabs = [];
    this.hiddenAttributes = [];
    this.hiddenMandatoryAttributes = [];
    this.dynamicInformations = [];
    this.sOut = "";
    this.idOT = getValue(aSettings.idOT, 0);
    this.object = aSettings.object;
    this.idObject = getValue(aSettings.idObject, 0);
    this.idTabSelected = getValue(aSettings.idTabSelected, 0);
    this.createdObject;
    this.dummyData = getValue(aDummydata, {});
    this.fctCallback = aCallbackFunction;
    this.wdowContainer = aSettings.wdowContainer;
    this.bReturnAttributesValue = getValue(aSettings.bReturnAttributesValue, false);
    this.sIdWdow = getValue(aSettings.sWindowId, format("WindowForms#1", [this.id]));
	this.updatedInstructions = [];
	this.bReadOnly = getValue(aSettings.bReadOnly, false);
	this.bDisplayBanner = getValue(aSettings.bDisplayBanner, false);
    this.idObjectNav = getValue(aSettings.idObjectNav, 0);
    this.idAttribute = getValue(aSettings.idAttribute, 0);
    this.fTimeoutLockingInSeconds = getValue(aSettings.fTimeoutLockingInSeconds, 0);
    this.fctLockingCallback = aSettings.fctLockingCallback;
    this.sDisplayMode = getValue(aSettings.sDisplayMode, dmWdow);
    this.config = aSettings.config;
    this.bWriteMode = getValue(aSettings.bWriteMode, true);
    this.sIdDivContainer = getValue(aSettings.sIdDivContainer);
    this.formContainer;
    this.onSelectTab = aSettings.onSelectTab;
    this.bLocked = getValue(aSettings.bWriteMode, false);

    if (isEmpty(this.sIdDivContainer)) {
        this.initWdowInterface(aSettings);
    } else {
        this.initDivInterface();
    }

    if (this.bWriteMode) {
        //manage drag&drop files
        J(document).unbind("dragover", function (e) { e.preventDefault(); });
	    J(document).unbind("dragleave", function (e) { e.preventDefault(); });
	    J(document).unbind("drop", function (e) { 
	        e.preventDefault();
	        if (e.originalEvent.dataTransfer.files.length > 0) {
	            msgWarning(_("Vous ne pouvez pas déposer votre fichier dans cette zone"));
	            if (self.wdowDrag)
	                self.wdowDrag.hide();
	        }
	    });

	    var sHtml =
            '<div id="dropzoneArea' + this.id + '" style="display:none;">' +
                '<div id="dropzone' + this.id + '"></div>' +
                '<div style="position:absolute;bottom:6px;width:100%;text-align:right;">' +
                    '<div style="float:left;font-style:italic; width:497px;margin-left:5px;;text-align:left;">' + _("Déposer les fichiers dans la zone correspondante à la Caractéristique où vous souhaitez publier ces fichiers.") + '</div>' +
                    '<div style="float:left;width:80px">' +
                        '<input id="inpCloseDrag' + this.id + '" class="clBtn" style="margin-left:5px;margin-right:5px;" type="button" value="' + _("Fermer") + '"/>' +
                    '</div>'+
                '</div>' +
            '</div>'
	    this.formContainer.append(sHtml);
        J("#inpCloseDrag" + this.id).click(function () {
            self.wdowDrag.hide();
        });

        //init wdow drag and drop files
        var windowDragSetting = {
            sName: this.sIdWdow + "txDragnDrop",
            iWidth: 600,
            iHeight: 540,
            bDenyResize: true,
            bHidePark: true,
            bHideClose: true,
            bModal: false,
            sHeader: _("Publier un fichier"),
            sIcon: aSettings.sIcon,
            sObjectAttached: 'dropzoneArea' + this.id
        };
        if (isAssigned(this.wdowContainer)) {
            this.wdowDrag = this.wdowContainer.addWindow(windowDragSetting);
        } else {
            this.wdowContainer = new CWindow(windowDragSetting);
            this.wdowDrag = this.wdowContainer.getWindow(this.sIdWdow + "txDragnDrop");
        }

        this.wdowDrag.hide();

        if (this.wdow)
            this.wdow.setModal(true);

        J('#divTabbar' + this.id).on('dragenter', function (e) {
            function containsFiles(event) {
                var types = Array.from(event.originalEvent.dataTransfer.types);
                return types.some(function(t) { return t === "Files"; });
            }
            if(!containsFiles(e)) return;
            if (J("#dropzoneArea" + self.id + " > div").length > 0) {
                self.wdowContainer.setOthersWindowModal(self.sIdWdow + "txDragnDrop", false);
                self.wdowContainer.setOthersWindowVisibility(self.sIdWdow + "txDragnDrop", false);
                self.wdowDrag.show();
                self.wdowDrag.setModal(true);
                self.wdowContainer.setOthersWindowVisibility(self.sIdWdow + "txDragnDrop", true);
            }
        });

        // mandatory attributes information
        if (getValue(aSettings.sMandatoryAttributesIds, sNull) != sNull)
            J("#idDivBtnBar" + this.id).prepend("<span style='color:red; margin-right:10px; font-style:italic;'>* : " + _("Champs Obligatoires") + "</span>");
    }

    this.addFormTabs(aSettings, aDummydata);

    J('.dhx_tabcontent_zone').find('div[tab_id]').css('overflow', 'auto');//enable scroll in tabs
};

CForm.prototype.initWdowInterface = function (aSettings) {
    this.formContainer = J(document.body);
    var sDefaultHeader = this.bWriteMode ? _("Formulaire écriture") : _("Formulaire lecture"),
        self = this,
        sLayoutPattern = this.bDisplayBanner ? "3E" : "2E",
        iIndexCellForm = this.bDisplayBanner ? 1 : 0,
        iIndexCellBtnBar = this.bDisplayBanner ? 2 : 1,
        sCellForm = this.bDisplayBanner ? "b" : "a";

    //initialize window
    var windowSetting = {
        sName: this.sIdWdow,
        iWidth: resizeWidth(getValue(aSettings.iWindowWidth, iTxFormWdowWidth)),
        iHeight: resizeHeight(getValue(aSettings.iWindowHeight, iTxFormWdowHeight)),
        sHeader: getValue(aSettings.sWindowCaption, sDefaultHeader),
        sIcon: aSettings.sIcon,
        bModal: true,
        //bDisableClose: true,
        bHidePark: true,
        onResizeFinish: function () {
            self.onWindowResized();
        },
        onMaximize: function () { self.onWindowResized(); },
        onMinimize: function () { self.onWindowResized(); }
    };

    var fctOnClose = function () {
        self.wdow.close();
        },
        fctCallBack = function (aSettings) {
            var bValidate = getValue(aSettings, {}).length > 0 ? isAssigned(aSettings[0].bValidate) : false;
            self.closeWdow();
            if (J('.fName').length > 0) {
                J('.fName').each(function () {
                    J(this).html('');
                });
            }

            if (isAssigned(self.fctCallback))
                self.fctCallback(bValidate, self.updatedInstructions, self.dummyData);

            return true;
        }

    if (isAssigned(this.wdowContainer)) {
        this.wdow = this.wdowContainer.addWindow(windowSetting, fctCallBack);
    } else {
        this.wdowContainer = new CWindow(windowSetting, fctCallBack);
        this.wdow = this.wdowContainer.getWindow(this.sIdWdow);
    }

    if (this.bDisplayBanner) {
        // create div for banner
        var divBanner = J("<div></div>");
        divBanner.attr("id", "divBanner" + this.id)
        divBanner.css({
            position: "absolute",
            left: "5px",
            right: "5px",
            top: "5px",
            bottom: "0px"
        });
        this.formContainer.append(divBanner);
    }

    // create div for tabbar
    var divTabbar = J("<div></div>");
    divTabbar.attr("id", "divTabbar" + this.id)
    divTabbar.css({
        position: "absolute",
        left: "5px",
        right: "5px",
        top: "5px",
        bottom: "0px"
    });
    this.formContainer.append(divTabbar);

    // create div for button bar
    this.divBtnBarContainer = J("<div></div>");
    this.divBtnBarContainer.attr("id", "idDivBtnBarContainer" + this.id);
    this.formContainer.append(this.divBtnBarContainer);
    J(this.divBtnBarContainer).append("<div id='idDivBtnBar" + this.id + "'></div>");

    // init layout
    this.layout = this.wdowContainer.attachLayout(this.sIdWdow, sLayoutPattern);

    if (this.bDisplayBanner) {
        this.layout.items[0].attachObject("divBanner" + this.id);
        this.layout.items[0].setHeight(50);
        this.layout.items[0].fixSize(0, 1);
    }
    this.layout.items[iIndexCellForm].attachObject("divTabbar" + this.id);
    this.layout.items[iIndexCellForm].setHeight("*");

    this.layout.items[iIndexCellBtnBar].attachObject("idDivBtnBarContainer" + this.id);
    this.layout.items[iIndexCellBtnBar].setHeight("20");
    this.layout.items[iIndexCellBtnBar].fixSize(0, 1);
    this.layout.forEachItem(function (aCell) {
        aCell.hideHeader();
    });
    this.layout.setAutoSize("", sCellForm);

    if (this.bDisplayBanner && this.object) {
        //init the banner
        this.txBanner = new CTxBanner({
            sIdDiv: "divBanner" + this.id,
            object: this.object,
            iHeight: 43
        });
    }

    //initialize tabbar
    this.tabbar = new CTabbar({
        sIdDivTabbar: "divTabbar" + this.id
    });

    // attach countdown to window for locking object
    if (this.fTimeoutLockingInSeconds > 0)
        this.displayCountDownDiv();

    // init button bar
    var btns = [];
    if (!this.bWriteMode || this.bReadOnly) {
        btns.push({
            iBtnType: btClose, onClick: fctOnClose
        });
    } else {
        if (this.idOT == idOTSource || this.idOT == idOTInfo) {
            btns.push({
                iBtnType: btDelete, onClick: function () {
                    if (self.idOT == idOTSource)
                        self.deleteSource();
                    else
                        self.deleteInfo();

                    if (isAssigned(self.fctCallback))
                        self.fctCallback("removed", self.updatedInstructions, self.dummyData);
                }
            });
        }

        btns.push({
            iBtnType: btValidate, onClick: function () {
                self.save(function () {
                    self.wdow.close({ bValidate: true });
                });
            }
        }, {
            iBtnType: btCancel, onClick: fctOnClose
        });
    }

    this.btnBar = new CButtonBar({
        sIdDivParent: "idDivBtnBar" + this.id,
        btns: btns
    });
}

CForm.prototype.initDivInterface = function () {
    J("#"+this.sIdDivContainer).html("")
    this.formContainer = J("#" + this.sIdDivContainer);
    // create div for tabbar (height:93%)
    var divTabbar = J("<div></div>");
    divTabbar.attr("id", "divTabbar" + this.id)
    divTabbar.css({
        position: "absolute",
        left: "0px",
        right: "0px",
        top: "0px",
        bottom: "0px"
    })
    this.formContainer.append(divTabbar);

    //initialize tabbar
    this.tabbar = new CTabbar({
        sIdDivTabbar: "divTabbar" + this.id
    });
}

CForm.prototype.onWindowResized = function () {
    this.tabbar.setSize();

    var sIdBackGround = "#background" + this.tabbar.getActiveTabId() + "_" + this.id,
        iWidthTabbar = J("#" + this.tabbar.sId).width();
    J(J(sIdBackGround).parent()).css("width", qc(iWidthTabbar - 2, "px"));
    J(sIdBackGround).css("width", qc(iWidthTabbar - 8, "px"));

    this.formTabs.forEach(function (aFormTab) {
        aFormTab.updateFieldsSize();
    });
}

CForm.prototype.addFormTabs = function () {
    //virtual abstract
}

CForm.prototype.toString = function () {
    return "CForm";
}

CForm.prototype.isWriteFormLoaded = function (aId) {
    if (!this.bWriteMode)
        return false;

    var bExist = false;
    this.formTabs.find(function (aFormTab) {
        if (aFormTab.id == aId) {
            bExist = true;
            return true;
        }
    });
    return bExist;
}

CForm.prototype.checkValidForm = function (aIdAttribute) {
    var self = this,
        bValidForm = true;

    //check if all fields loaded are valid
    this.formTabs.forEach(function (aFormTab) {
        aFormTab.fields.find(function (aField) {
            if (!aField.bValid) {
                bValidForm = false;
                return true;
            }
        });
    });

    //check if mandatory fields not loaded yet had data
    this.hiddenMandatoryAttributes.find(function (aAttr) {
        var field = self.getField(aAttr.ID);
        if (!field && !aAttr.Data) {
            // the hidden mandatory field  is not filled
            bValidForm = false;
            return true;
        }
    });

    this.btnBar.setButtonsEnable(["save", "validate"], bValidForm, true);
    this.updateDynamicsFields(aIdAttribute);
}

CForm.prototype.save = function (aCallback) {
    var formatedFieldsToBeSaved = [],
        fields = [],
        sMsg = "",
        bOk = true,
        self = this;
    
    if (this.bReturnAttributesValue)
        this.dummyData.modifiedFields = this.getFieldsData();
    else {
        this.formTabs.forEach(function (aFormTab) {
            aFormTab.fields.forEach(function (aField) {
                if (!aField.bReadOnly) {
                    var field = aField.getDataToSave();
                    if (isAssigned(field) && (aField.bVisible || aField.bDelete) && aField.toString() != "CGroup") {
                        fields.push(aField);
                        formatedFieldsToBeSaved.push(field);
                    }
                }
            });
        });
        this.dummyData.modifiedFields = formatedFieldsToBeSaved;

        if (this.idObject == 0 || formatedFieldsToBeSaved.length > 0) {
            bOk = this.saveInTEEXMA(fields, formatedFieldsToBeSaved);
        }
    }  

    if (bOk)
        aCallback();
}

CForm.prototype.closeWdow = function () {
    this.formTabs.forEach(function (aFormTab) {
        aFormTab.closeFields();
    });

    try{this.wdowDrag.close();}catch(e){}
    J("#dropzoneArea" + this.id).remove();

    if (isAssigned(this.divCountDown))
        this.divCountDown.remove();
}

CForm.prototype.saveInTEEXMA = function (aAttributes, aFormatedFieldsToBeSaved) {
    var self = this,
        bOk = true;

    if (aFormatedFieldsToBeSaved.length > 0)
        J.ajax({
            url: sPathFileTxWebFormAjax,
            async: false,
            cache: false,
            type: "post",
            data: {
                sFunctionName: "SaveAttributes",
                idOT: this.idOT,
                idObject: this.idObject,
                idObjectNav: this.idObjectNav,
                idAttribute: this.idAttribute,
                sAttributes: JSON.stringify(aFormatedFieldsToBeSaved)
            },
            success: function (aResult) {
                var results = aResult.split("|");
                if (results[0] == sOk) {
                    self.createdObject = JSON.parse(results[1]);
                    self.idObject = self.createdObject.ID;
                    self.dummyData.idObject = self.idObject;
                    self.dummyData.createdObject = self.createdObject;
                    var modelInstructions = JSON.parse(results[2]);
                    self.updatedInstructions = mergeWebModelJsonInstructions(self.updatedInstructions, modelInstructions);
                    aAttributes.forEach(function (aField) {
                        aField.bDelete = false;
                        aField.bUpdate = false;
                        aField.sFirstValue = aField.sValue;
                    });
                } else {
                    msgWarning(results[0]);
                    bOk = false;
                }
            }
        });
    return bOk;
}

CForm.prototype.getAttributes = function (aSettings) {
    // aAPT = 'aptTags' || 'aptId' || 'aptTab' || 'aptTabAndAttributes' || 'other'
    var sAttributes = "",
        self = this,
        sOTTag = getValue(aSettings.sOTTag),
        idOT = getValue(aSettings.idOT, 0),
        idObject = getValue(aSettings.idObject, 0),
        sAPT = aSettings.sAPT,
        sDataList = aSettings.sDataList,
        sMandatoryAttributesIds = getValue(aSettings.sMandatoryAttributesIds, sNull),
        sDefaultValues = getValue((aSettings.sDefaultValues != "") ? JSON.stringify(aSettings.sDefaultValues) : "", sNull),
        bIgnoreRights = getValue(aSettings.bIgnoreRights, false);

    if (sAPT == "aptId" && typeof sDataList != 'string')
        sDataList = JSON.stringify(sDataList);
    
    this.progressOn();
    
    J.ajax({
        url: sPathFileTxWebFormAjax,
        type: "POST",
        async: false,
        cache: false,
        data: {
            sFunctionName: 'GetAttributes',
            sOTTag: sOTTag,
            idOT: idOT,
            idObject: idObject,
            sAPT: sAPT,
            DataList: sDataList,
            mandatoryAttributesIds: sMandatoryAttributesIds,
            sDefaultValues: sDefaultValues,
            bIgnoreRights: bIgnoreRights,
            bWriteMode : this.bWriteMode
        },
        success: function (aResult) {
            var results = aResult.split('|');
            if (results[0] == sOk) {
                var tabInfo = JSON.parse(results[1]);

                //update hidden tab, if some attributes are loaded, delete them in hidden tab
                self.manageHiddenAttributes(tabInfo);

                if (isAssigned(tabInfo.DynamicInformations))
                    self.dynamicInformations = tabInfo.DynamicInformations;

                sAttributes = JSON.stringify(tabInfo);

                if (!isEmpty(tabInfo.sMessage))
                    msgWarning(tabInfo.sMessage);
            } else
                msgWarning(results[0]);
        }
    }).always(function() {
        self.progressOff();
    });
    return sAttributes;
}

CForm.prototype.manageHiddenAttributes = function (aConfig) {
    var self = this;

    if (isAssigned(aConfig.HiddenAttributes)) {
        aConfig.HiddenAttributes.forEach(function (aAttribute) {
            var sDataValue = "";
            if (aAttribute.Data) {
                var checkedObjects = aAttribute.Data.LkdObjects;
                if (!isEmpty(checkedObjects)) {
                    checkedObjects.forEach(function (aObject) {
                        sDataValue = qc(sDataValue, aObject.ID, ";");
                    });
                }
            }
            var field = new CField({ field: aAttribute, sDataValue: sDataValue });

            if (isAssigned(aConfig.DynamicInformations)) {
                aConfig.DynamicInformations.find(function (aDynamicInformation) {
                    if (parseInt(aDynamicInformation.idAtt) === field.idAttribute) {
                        //manage open close group and filtered links
                        field.openCloseGroups = getValue(aDynamicInformation.openCloseGroups,[]);
                        field.attributeIdsToFilter = getValue(aDynamicInformation.attributeIdsToFilter, []);
                        field.bHasOCG = field.openCloseGroups.length > 0;
                        field.bFilteredLinks = field.attributeIdsToFilter.length > 0;

                        return true;
                    }
                });
            }

            self.hiddenAttributes.push(field);
        });
    }

    //update array hiddenAttributes
    if (this.hiddenAttributes.length > 0) {
        var attributeIndexes = [];
        this.hiddenAttributes.forEach(function (aAttribute, i) {
            if (inArrayFromField(aConfig.Attributes, "ID", aAttribute.field.ID)) {
                attributeIndexes.push(i);
            }
        });

        for (var i = attributeIndexes.length - 1 ; i > -1 ; i--) {
            this.hiddenAttributes.splice(attributeIndexes[i], 1);
        }
    }

    //update hiddenMandatory attributes
    if (aConfig.HiddenMandatoryAttributes) {
        this.hiddenMandatoryAttributes = aConfig.HiddenMandatoryAttributes;
        this.hiddenMandatoryAttributes.forEach(function (aAttr) {
            self.tabbar.setCustomStyle(aAttr.idTab, "red", "red");
        });
    } else if (this.hiddenMandatoryAttributes.length > 0) {
        var ids = [];
        //update fields to mandatory
        aConfig.Attributes.forEach(function (aAttr) {
            self.hiddenMandatoryAttributes.find(function (aHiddenAttr, i) {
                if (aHiddenAttr.ID == aAttr.ID) {
                    aAttr.bMandatory = true;
                    ids.push(i);
                }
            });
        });

        for (var i = ids.length - 1 ; i > -1 ; i--) {
            this.hiddenMandatoryAttributes.splice(ids[i], 1);
        }
    }
}

CForm.prototype.updateDynamicsFields = function (aIdAttribute) {
    function addMaster(aField, aInit) {
        if (!aField)
            return;
        aInit = getValue(aInit, true);

        if (inArray(["CLinkAttribute", "CField"], aField.toString())) {
            var mastersAttribute = self.updateDynamicField(aField, aInit);
            if (isAssigned(mastersAttribute)) {
                mastersAttribute.forEach(function (aMaster) {
                    masters.push(aMaster);
                });
            }
        }
    }

    var self = this,
        masters = [],
        idAttribute = getValue(aIdAttribute, 0);

    if (idAttribute == 0) {
        //update all fields from attribute loaded
        this.formTabs.forEach(function (aFormTab) {
            aFormTab.fields.forEach(function (aField) {
                addMaster(aField);
            });
        });

        //update all fields from attribute hidden
        this.hiddenAttributes.forEach(function (aField) {
            addMaster(aField);
        });
    } else {
        var field = this.getField(idAttribute);
        addMaster(field, false);
    }

    if (masters.length > 0) {
        masters = masters.uniqueFromAttribute("idAttMaster");

        J.ajax({
            url: sPathFileTxWebFormAjax,
            async: true,
            cache: false,
            data: {
                sFunctionName: "GetFilteredObjects",
                idObject: self.idObject,
                sData: JSON.stringify(masters)
            },
            success: function (aResult) {
                var results = aResult.split("|");
                if (results[0] == sOk) {
                    var filteredObjects = JSON.parse(results[1]);

                    filteredObjects.forEach(function (aObj) {
                        if (aObj.bNoNeedUpdate)
                            return true;

                        var field = self.getField(aObj.idAtt);
                        if (isAssigned(field)) {
                            field.reload(aObj.Objects, aObj.bFullOT);
                        }
                    });
                } else
                    msgWarning(results[0]);
            }
        });
    }
}

CForm.prototype.updateDynamicField = function (aField, aAll) {
    if (!isAssigned(aField))
        return;

    aAll = getValue(aAll, false);

    var self = this,
        mastersAttribute = [];

    if (aField.bHasOCG) {
        //hide all
        var idsGroup = [];

        aField.openCloseGroups.forEach(function (aOCG) {
            if (!inArray(idsGroup, aOCG.idGroup))
                idsGroup.push(aOCG.idGroup);
        });

        idsGroup.forEach(function (aIdGroup) {
            var field = self.getField(aIdGroup);
            if (field) {
                field.hide();
            }
        });

        //show group concerned
        aField.openCloseGroups.find(function (aOCG) {
            var sIds = aField.sValue,
                bShow = false,
                field = self.getField(aOCG.idGroup),
                idsChecked = [];

            if (!isEmpty(sIds)) {
                idsChecked = sIds.split(";")
                bShow = inArray(idsChecked, aOCG.idObj);
            }
              
            if (!isAssigned(field))
                return false;

            if (bShow) {
                field.show();
            }
        });
    }

    if (aField.bFilteredLinks) {
        var bAdd = aField.attributeIdsToFilter.length > 0;
            

        if (bAdd) {
            var attributeIdsToFilter = [];

            aField.attributeIdsToFilter.forEach(function (aIdAtt) {
                var field = self.getField(aIdAtt);
                if (isAssigned(field)) {
                    self.dynamicInformations.forEach(function (aDynamicInfo) {
                        if (inArray(aDynamicInfo.attributeIdsToFilter, aIdAtt)) {
                            var dynamicField = self.getField(aDynamicInfo.idAtt);

                            if (dynamicField)
                                mastersAttribute.push({ idAttMaster: aDynamicInfo.idAtt, attributeIdsToFilter: aDynamicInfo.attributeIdsToFilter, checkedIds: dynamicField.sValue.split(";").map(Number) });
                        }
                    });
                    attributeIdsToFilter.push(aIdAtt)
                }
            });

        }
    }

    //check if the field is a slave in dynamics fields
    if (aAll && this.dynamicInformations.length > 0) {
        var checkedIds = [];

        this.dynamicInformations.forEach(function (aAttr) {
            if (inArray(aAttr.attributeIdsToFilter, aField.idAttribute)) {
                //check if this attribute is in hiddenAttribute to catch there data
                var hiddenField;
                self.hiddenAttributes.find(function (aHiddenAttr) {
                    if (aHiddenAttr.idAttribute == aAttr.idAtt) {
                        hiddenField = aHiddenAttr;
                        return true;
                    }
                });

                if (hiddenField) {
                    if (hiddenField.field.Data) {
                        hiddenField.field.Data.LkdObjects.forEach(function (aLnk) {
                            checkedIds.push(aLnk.ID);
                        });
                    }
                    mastersAttribute.push({ idAttMaster: aAttr.idAtt, attributeIdsToFilter: aAttr.attributeIdsToFilter, checkedIds: checkedIds });
                }

                return false;
            }
        });
    }
    return mastersAttribute;
}

CForm.prototype.getField = function (aIdAttribute) {
    var field;

    this.formTabs.find(function (aFormTab) {
        field = aFormTab.getField(aIdAttribute);

        return isAssigned(field);
    });

    return field;
}

CForm.prototype.getFormTab = function (aIdTab) {
    var formTab;

    this.formTabs.find(function (aFormTab) {
        if (aFormTab.id == aIdTab) {
            formTab = aFormTab;
            return true;
        }
    });

    return formTab;
}

CForm.prototype.deleteSource = function () {
    var self = this;
    if (this.idObjectNav < 1)
        return;

    J.ajax({
        url: sPathFileTxWebFormAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "deleteSource",
            idObject: this.idObjectNav,
            idAtt: this.idAttribute
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk)
                self.wdow.close();
            else
                msgWarning(results[0]);
        }
    })
}

CForm.prototype.deleteInfo = function () {
    var self = this;
    J.ajax({
        url: sPathFileTxWebFormAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "deleteInfo",
            idAtt: this.idAttribute
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk)
                self.wdow.close();
            else
                msgWarning(results[0]);
        }
    })
}

CForm.prototype.displayCountDownDiv = function (aClear) {
    var self = this;

    aClear = getValue(aClear, false);

    if (aClear)
        this.divCountDown.remove();

    this.divCountDown = J("<div></div>");
    this.divCountDown.attr("id", "idDivCountDown" + this.id);
    this.divCountDown.attr("title", _("L'Entité sera verrouillée à la fin du compte à rebours"));
    this.divCountDown.attr("data-seconds-left", this.fTimeoutLockingInSeconds);
    this.divCountDown.css({
        "position": "absolute",
        "bottom": "5px",
        "left": "5px",
        "width": "100px",
    });
    J(this.divBtnBarContainer).append(this.divCountDown);
    this.divCountDown.startTimer({
        onComplete: function () {
            self.lock();
            if (self.fctLockingCallback)
                self.fctLockingCallback();
        }
    });
}

CForm.prototype.lock = function (aLocked) {
    var self = this;
    aLocked = getValue(aLocked, true);

    this.tabbar.setAllTabsEnable(!aLocked);
    this.btnBar.setButtonEnable("validate",!aLocked, true);

    this.formTabs.forEach(function (aFormTab) {
        aFormTab.lock(aLocked)
    });

    if (aLocked)
        this.displayLockButton();
    else {
        this.btnBar.removeButton("lockObject", true);
        this.displayCountDownDiv(true);
    }

    this.bLocked = aLocked;
}

CForm.prototype.displayLockButton = function () {
    var self = this;
    this.btnBar.addButton({
        sId: "lockObject", sCaption : _("Vérifier le verrouillage de l'Entité"), bInserted: true, onClick: function () {
            if (self.fctLockingCallback)
                self.fctLockingCallback();
        }
    });
}

CForm.prototype.progressOn = function() {
    this.formContainer.append('<div class="formProgress">' +
                                '<img src="' + _url("/resources/theme/img/dhtmlx/layout/dhxlayout_progress.gif") + '" class="formProgressImg"/>' +
                            '</div>');
    try {
        txASP.mainLayout.progressOff();
    } catch (e) {
        // ignore
    }
}

CForm.prototype.progressOff = function () {
    this.formContainer.find(".formProgress").remove();
}

CForm.prototype.getFieldsData = function () {
    var fields = [];
    this.formTabs.forEach(function (aFormTab) {
        aFormTab.fields.forEach(function (aField) {
            if (aField.toString() == "CGroup")
                return;

            var data = aField.getDataToSave();
            if (isAssigned(data) && (aField.bVisible || aField.bDelete)) {
                aField.field.Data = data;
            } else if (!aField.field.Data) {
                aField.field.Data = {
                    ID_Att: aField.field.ID,
                    sAction: "dbaDel"
                }
            }
            fields.push(aField.field.Data);
        });
    });
    return fields;
}