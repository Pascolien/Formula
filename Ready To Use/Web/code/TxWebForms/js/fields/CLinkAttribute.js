
function CLinkAttribute(aSettings) {
    var self = this,
        sInput = "",
        rootObjects = aSettings.rootObjects,
        sDataValue = "",
        sIdDivParent = getValue(J(aSettings.htmlDiv).attr('id'), getUniqueId());
        
    this.field = aSettings.field;
    this.txObjects = [];
    this.bReinit = false;
    this.sId = "";
    this.lkdObjects = [];
    this.bDisplayCombo = false;
    this.iToolbarHeight = 27;
    this.bData = getValue(this.field.Data, false);
    this.bInverseLink = inStr(this.field.sType, "InverseLink");
    this.idObjectFiltered = this.bInverseLink ? getValue(this.field.LinkType.ID_Obj_Filter_Inv, 0) : getValue(this.field.LinkType.ID_Obj_Filter, 0);
    this.idOT = inArray(["InverseLink N", "InverseLink 1"], this.field.sType) ? this.field.LinkType.ID_OT_Source : this.field.LinkType.ID_OT_Dest;
    this.checkedObjects = [];
    this.dynamicInformations = aSettings.dynamicInformations;
    this.bTableView = false;

    if (!isEmpty(this.field.iLnk_Display_Mode)) {
        this.bDisplayCombo = this.field.iLnk_Display_Mode == "2";
    }

    //generate object structure
    if (this.bData) {
        this.lkdObjects = this.field.Data.LkdObjects;
        if (!isEmpty(this.lkdObjects)) {
            this.lkdObjects.forEach(function (aObject) {
                sDataValue = qc(sDataValue, aObject.ID, ";");
                self.checkedObjects.push(J.extend({}, aObject));
            });
        }
    }

    if (!this.bData || this.bDisplayCombo) {
        if (!isEmpty(rootObjects)) {
            rootObjects.forEach(function (aObject) {
                if (aObject.ID_OT == self.idOT && getValue(aObject.ID_Parent, 0) == self.idObjectFiltered)
                    self.txObjects.push(J.extend({}, aObject));
            });
        }
    }

    if (aSettings.bWriteMode) {
        if (this.bDisplayCombo) {
            this.sId = "idDivCombo" + sIdDivParent;

            sInput =
                '<div style="float:left;">' +
                    '<div id="' + this.sId + '"></div>' +
                '</div>';
            if (!this.bReadOnly)
                sInput +=
                    '<div style="float:left;">'+
                        '<a href="#" tabindex="-1" id="idAUnselectOption' + sIdDivParent + '"><img class="clIcon" title="' + _("Supprimer la donnée") + '" id="idImgSwitchTreeSize' + sIdDivParent + '" src="' + _url("/resources/theme/img/btn_form/16x16_false.png") + '" /></a>' +
                    '</div>';
        } else {
            this.sId = "idDivTree" + sIdDivParent;
            this.sIdDivToolbar = "idDivToolbar" + sIdDivParent;
            this.sHeightData = iTxFormTreesHeight + this.iToolbarHeight;
            sInput =
                '<div style="float:left;">' +
                    '<div class="clDivTreeForm" id="' + this.sId + '" ></div>' +
                    '<div id="' + this.sIdDivToolbar + '" class="clDivToolbarForm"></div>' +
                '</div>';
        }
    } else {
        this.bTableView = isAssigned(this.field.LinkedAttributes);


        if (this.bTableView) {
            this.sId = "idDivGrid" + sIdDivParent;
            this.sIdDivToolbar = "idDivToolbar" + sIdDivParent;
            sInput =
                '<div style="float:left;">' +
                    '<div class="clDivTreeForm" id="' + this.sId + '" ></div>' +
                    '<div id="' + this.sIdDivToolbar + '" class="clDivToolbarForm"></div>' +
                '</div>';
        } else {
            var bListing = inStr(this.field.sType, "Enumeration");
            this.sIdRead = "idDivLinks" + sIdDivParent;
            this.sIdDivMoreLinks = "idDivMoreLinks" + sIdDivParent;
            this.sIdAMoreLinks = "idAMoreLinks" + sIdDivParent;
            this.checkedObjects.forEach(function (aObject) {
                if (bListing)
                    sInput = qc(sInput, '<div><label>' + aObject.sName + '</label></div>');
                else
                    sInput = qc(sInput, '<div style="margin-bottom:4px;"><a href="#" onclick="txASP.displayObject(' + aObject.ID + ');">' + aObject.sName + '</a></div>');
            });
            sInput = '<div style="float:left;" id="' + this.sIdRead + '">' + sInput + '</div>';
        }
    }

    aSettings.sInput = sInput;
    aSettings.sDataValue = sDataValue;
    CAttributeField.call(this, aSettings);
}

//inheritage
CLinkAttribute.prototype = createObject(CAttributeField.prototype);
CLinkAttribute.prototype.constructor = CLinkAttribute;

CLinkAttribute.prototype.toString = function () {
    return "CLinkAttribute";
}

CLinkAttribute.prototype.getLinkedAttribute = function (aId) {
    var attr;
    this.field.LinkedAttributes.find(function (aAttribute) {
        if (aAttribute.ID === aId) {
            attr = aAttribute;
            return true;
        }
    });
    return attr;
}

CLinkAttribute.prototype.getAttributeColIndex = function (aId) {
    var iIndex = -1;
    this.field.LinkedAttributes.find(function (aAttribute, i) {
        if (aAttribute.ID === aId) {
            iIndex = i;
            return true;
        }
    });
    return iIndex+1;
}

CLinkAttribute.prototype.getDataValueForTable = function(aData){
    var sValue = "";

    switch (aData.sType) {
        case 'ShortString':
        case 'LongString':
            sValue = aData.sVal;
            break;
        case 'Url':
        case 'Url {}':
            var urls = aData.sVal.split("\n"),
                links = [];

            urls.forEach(function (aUrl) {
                links.push(format('<a href="http://#1" target="_blank" onclick="window.open(this.href); return false;">#2</a>', [aUrl, aUrl]));
            });
            sValue = links.join(" <br />");
            break;
        case 'Email':
        case 'Email {}':
            var sMails = aData.sVal.replace(/ /g, "<br>");
            sValue = sMails.replace(/;/g, "<br>");
            sValue += '<a id="mailto' + getUniqueId() + '" href="mailto: ' + sValue + '"><img src="'+_url("/resources/theme/img/btn_form/16x16_send_email.png")+'" style="vertical-align:sub; padding:1px;"/></a>';

            break;
        case 'Bool':
            var sImg = getbValue(aData.abVal) ? '16x16_true' : '16x16_false';
            sValue = format('<img src="' + _url("/resources/theme/img/btn_form/#1.png") + '" />', [sImg]);
            break;
        case 'SingleValue':
            sUnitName = getValue(aData.sUnitName, aData.Unit ? aData.Unit.sName : "");
            sValue = qc(aData.fMin, getValue(aData.sUnitName, sUnitName), " ");
            break;
        case 'RangeOfValues':
            sUnitName = getValue(aData.sUnitName, aData.Unit ? aData.Unit.sName : "");
            sValue = format(_("de #1 à #2"), [aData.fMin, qc(aData.fMax, sUnitName, " ")]);
            break;
        case 'Range+MeanValue':
            sUnitName = getValue(aData.sUnitName, aData.Unit ? aData.Unit.sName : "");
            sValue = format(_("de #1 à #2 - Moyenne : #3"), [aData.fMin, qc(aData.fMax, sUnitName, " "), qc(aData.fMean, sUnitName, " ")]);
            break;
        case 'Date':
        case 'DateAndTime':
            sValue = floatToDateStr(aData.fVal);
            break;
        case 'File':
        case 'File {}':
            aData.Files.forEach(function (aFile){
                if (aFile.bView)
                    sValue = qc(sValue, '<img style="max-width: 100%;" title="' + aFile.AF.sLeft_Ext + '" src="/temp/' + iTxUserSessionId + '/' + aFile.AF.sLeft_Ext + '"/>', "<br>");
                else
                    sValue = qc(sValue, aFile.AF.sLeft_Ext, aFile.bView ? "<br>" : "<br>");
            });
            break;
        case 'Table':
            aData.Series.forEach(function (aSerie) {
                sSerieTypeName = isAssigned(aSerie.SeriesTypes.sName) ? aSerie.SeriesTypes.sName + " " : "";
                sSerieTypeName = isAssigned(aSerie.SeriesTypes.jUnit) ? qc(sSerieTypeName, aSerie.SeriesTypes.jUnit.sName) + " " : sSerieTypeName;
                sSerieName = isAssigned(aSerie.sName) ? aSerie.sName + " " : "";
                sValue = qc(sValue, sSerieTypeName + sSerieName + aSerie.Values.join(" "), " ; ");
            });
            break;
        case "InverseLink 1":
        case "InverseLink N":
        case "DirectLink 1":
        case "DirectLink N":
        case "Enumeration 1":
        case "Enumeration N":
        case "BidirectionalLink 1":
        case "BidirectionalLink N":
            aData.LkdObjects.forEach(function (aObj) {
                sValue = qc(sValue, format('<a href="javascript:txASP.displayObject(#1);">#2</a>', [aObj.ID, aObj.sName]), " <br />");
            });
            break;
    }
    return sValue;
}

CLinkAttribute.prototype.displayAllLinks = function (aAll) {
    var self = this;
    if (J("#" + this.sIdDivMoreLinks).length == 0) {
        J("#" + this.sIdRead).append('<div id="' + this.sIdDivMoreLinks + '"><a href="#" id="' + this.sIdAMoreLinks + '"></a></div>');
        J("#" + this.sIdAMoreLinks).click(function () {
            self.displayAllLinks(J(this).attr("bExpanded") != "true");
        });
    }

    if (aAll) {
        J("#" + this.sIdAMoreLinks).html(_("Afficher les 10 premiers liens"));
        J("#" + this.sIdAMoreLinks).attr("title", _("Afficher les 10 premiers liens"));
        //display others links
        J.each(J("#" + this.sIdRead).children(), function (i, aChild) {
            J(aChild).css("display", "block");
        });
    } else {
        J("#" + this.sIdAMoreLinks).html(_Fmt("Afficher les #1 liens restants (10/#2 affichés)...", [this.checkedObjects.length - 10, this.checkedObjects.length]));
        J("#" + this.sIdAMoreLinks).attr("title", _("Afficher l'intégralité des liens"));

        J.each(J("#" + this.sIdRead).children(), function (i, aChild) {
            if (i > 9)
                J(aChild).css("display", "none");
            else 
                J(aChild).css("display", "block");
        });
        J("#" + this.sIdDivMoreLinks).css("display", "block");
    }

    J("#" + this.sIdAMoreLinks).attr("bExpanded", aAll);
}

CLinkAttribute.prototype.initField = function () {
    var self = this;
    if (!this.bWriteMode) {
        if (this.bTableView) {
            var bTranspose = this.field.bTranspose,
                cols = [],
                rows = [];

            cols.push({ sHeader: " ", sWidth: "80", sColType: bTranspose ? ctRo : ctLink });
            this.lkdObjects.sort(function (a, b) {
                if (a.sName < b.sName) return -1;
                if (a.sName > b.sName) return 1;
                return 0;
            })
            if (bTranspose) {
                //build header
                this.lkdObjects.forEach(function (aObj) {                    
                    cols.push({ sHeader: aObj.sName, sWidth: getStringLength(aObj.sName)+10, sColType: ctRo });
                });

                //fill rows
                this.field.LinkedAttributes.forEach(function (aAttr) {
                    var data = [],
                        txData = [];

                    cols.forEach(function () {
                        data.push("");
                        txData.push("");
                    });
                    data[0] = aAttr.sName;
                    txData[0] = { sVal: aAttr.sName, sType: "Object" };

                    self.lkdObjects.forEach(function (aObj,i) {
                        var sValue = "";

                        aObj.Data.find(function (aData) {
                            if (aAttr.ID == aData.ID_Att) {
                                aData.sType = aAttr.sType;
                                sValue = self.getDataValueForTable(aData);
                                txData[i + 1] = aData;

                                return true;
                            }
                        });

                        data[i+1] = sValue;
                    });
                    rows.push({ data: data, txData: txData });
                });
            } else {
                //build header
                this.field.LinkedAttributes.forEach(function (aAttr) {
                    cols.push({ sHeader: aAttr.sName, sWidth: getStringLength(aAttr.sName) + 10, sColType: ctRo });
                });

                //fill rows
                this.lkdObjects.forEach(function (aObj) {
                    var data = [],
                        txData = [];

                    cols.forEach(function () {
                        data.push("");
                        txData.push("");
                    });
                    data[0] = format("<img src='" + _url("/temp_resources/theme/img/png/#1.png") + "'/> ", [aObj.iIcon]) + aObj.sName + "^javascript:txASP.displayObject(" + aObj.ID + ");^_self";
                    txData[0] = { sVal: aObj.sName, sType: "Object" };

                    if (aObj.Data)
                        aObj.Data.forEach(function (aData) {
                            var iDataIndex = self.getAttributeColIndex(aData.ID_Att);

                            if (iDataIndex < 1)
                                return;

                            aData.sType = self.getLinkedAttribute(aData.ID_Att).sType;
                            var sValue = self.getDataValueForTable(aData);
                            data[iDataIndex] = sValue;
                            txData[iDataIndex] = aData;
                        });

                    rows.push({ data: data, txData: txData });
                });
            }

            //resize cols
            cols.forEach(function (aCol, i) {
                var iColSize = parseInt(aCol.sWidth);
                rows.forEach(function (aRow) {
                    var sData = aRow.data[i],
                        data = aRow.txData[i],
                        iDataSize = 0;

                    if (!isEmpty(sData)) {
                        iDataSize = getDataSize(data);
                    }

                    if (iDataSize > iColSize)
                        iColSize = iDataSize;
                });
                aCol.sWidth = iColSize;
            });

            this.iParentDivHeight = (this.iParentDivHeight > 0 && this.bTemplate) ? this.iParentDivHeight : iTxFormGridsHeight;

            this.grid = new CGrid({
                sIdDivGrid: this.sId,
                cols : cols,
                rows: rows,
                bReadOnly: true,
                bResizeDivAfterModif : true,
                bCliquableLinks: true,
                iWidth: this.iParentDivWidth,
                iHeight: this.iParentDivHeight,
                sIdDivContainer: this.bTemplate ? null : this.sIdDivParent,
                onFullScreen: function (aFullScreen) { self.displayInFullSreen(aFullScreen) },
                toolbarSettings: {
                    sIdDivToolbar: this.sIdDivToolbar,
                    btns: [
                        { sId: btnSearchLabel, iBtnType: tbtText, sCaption: _(""), bAddSpacer: true },
                        { sId: btnFullScreen, iBtnType: tbtTwoState, sHint: _("Plein écran"), sImgEnabled: "fullscreen.png" }
                    ],
                    onStateChange: function (aId, aPressed) { self.updateFullScreenField(aPressed) }
                }
            });
        } else {
            if (this.checkedObjects.length > 10) {
                this.displayAllLinks(false);
            }

        }
        return;
    }

    var sCheckType = (inArray(["Enumeration 1", "DirectLink 1", "InverseLink 1", "BidirectionalLink 1"], this.field.sType)) ? ctRadioboxes : ctCheckboxes;

    this.iParentDivHeight = (this.iParentDivHeight > 0 && this.bTemplate) ? this.iParentDivHeight - this.iToolbarHeight : iTxFormTreesHeight;

    //update dymanic info
    if (isAssigned(this.dynamicInformations)) {
        this.dynamicInformations.find(function (aObject) {
            if (parseInt(aObject.idAtt) === self.idAttribute) {
                //manage open close group and filtered links
                self.openCloseGroups = getValue(aObject.openCloseGroups,[]);
                self.attributeIdsToFilter = getValue(aObject.attributeIdsToFilter, []);
                self.bHasOCG = self.openCloseGroups.length > 0;
                self.bFilteredLinks = self.attributeIdsToFilter.length > 0;

                return true;
            }
        });
    }

    //handle actions
    if (this.bDisplayCombo) {
        this.iParentDivWidth = (this.iParentDivWidth > 0 && this.bTemplate) ? this.iParentDivWidth : iTxFormCombosLnkWidth;

        if (!this.bReadOnly) {
            J("#idAUnselectOption" + this.sIdDivParent).click(function () {
                self.unselectComboOption();
            });
            if (this.bData)
                J("#idAUnselectOption" + this.sIdDivParent).css("display", "block");
            else
                J("#idAUnselectOption" + this.sIdDivParent).css("display", "none");
        }

        var iDefaultValueSelected = 0;
        if (!isEmpty(this.checkedObjects))
            iDefaultValueSelected = this.checkedObjects[0].ID

        this.combo = new CComboBoxObject({
            sIdDivCombo: this.sId,
            iWidth: this.iParentDivWidth,
            idOT: this.idOT,
            txObjects: this.txObjects,
            bReadOnly: this.bReadOnly,
            iDefaultValueSelected: iDefaultValueSelected,
            iMaxExpandedHeight: iTxFormCombosLnkMaxExpandedHeight,
            bSelectFirstOption: false,
            onChange: function () { self.comboOnChange() }
        });
    } else {
        if (this.checkedObjects.length > 0) {
            this.txObjects = null;

            this.checkedObjects.forEach(function (aObj) {
                if (!aObj.bFolder && !isAssigned(aObj.iIcon))
                    aObj.iIcon = getIconOT(aObj.ID_OT);
            });
        }

        this.tree = new CTreeObject({
            sIdDivTree: this.sId,
            sIdDivToolbar: this.sIdDivToolbar,
            sCheckType: sCheckType,
            idOT: this.idOT,
            idAttribute: this.idAttribute,
            txObjects: this.txObjects,
            checkedObjects: this.checkedObjects,
            idParentFiltering: this.idObjectFiltered,
            bStrongFilter : this.field.bStrongFilter || this.field.bStrongFilterInv,
            bFolderCheckable: false,
            bEnableContextMenu: true,
            wdowContainer: this.wdowContainer,
            bEnableEdition: true,
            iWidth: this.iParentDivWidth,
            iHeight: this.iParentDivHeight,
            sIdDivContainer: this.bTemplate ? null : this.sIdDivParent,
            bReadOnly: this.bReadOnly,
            onCheckAll: function () { self.treeOnCheck() },
            onUnCheckAll: function () { self.treeOnCheck() },
            onFullScreen: function (aFullScreen) { self.displayInFullSreen(aFullScreen) },
            onCheck: function () { self.treeOnCheck() }
        });
    }
}

CLinkAttribute.prototype.updateFullScreenField = function (aPressed) {
    aPressed = getValue(aPressed, true);
    if (this.grid)
        this.grid.displayInFullScreen(aPressed);
    else if (this.tree)
        this.tree.displayInFullScreen(aPressed);
}

CLinkAttribute.prototype.unselectComboOption = function () {
    this.combo.clearComboValue();
    this.updateField([]);
    J("#idAUnselectOption" + this.sIdDivParent).css("display", "none");
}

CLinkAttribute.prototype.comboOnChange = function () {
    var selectedOption = this.combo.getSelectedOption();
    if (typeof selectedOption == "undefined") 
        return;
    this.updateField([selectedOption]);

    J("#idAUnselectOption" + this.sIdDivParent).css("display", "block");
}

CLinkAttribute.prototype.treeOnCheck = function () {
    this.updateField(this.tree.getCheckedNodes());
}

CLinkAttribute.prototype.reload = function (aObjects, aFullOT) {
    if (isAssigned(this.tree))
        this.tree.reloadFilteredLink(aObjects, aFullOT);
    else {
        this.unselectComboOption();
        this.combo.reloadFromTxObjects(aObjects);
    }
}

CLinkAttribute.prototype.reInit = function () {
    if (isAssigned(this.tree)) {
        if (!this.bReinit && this.txObjects) {
            this.tree.reloadFromTxObjects(this.txObjects);
            this.bReinit = true;
        }
        CAttributeField.prototype.updateField.call(this);
    }
}

CLinkAttribute.prototype.updateField = function (aObjects) {
    this.bDelete = false;
    this.bUpdate = false;
    this.lkdObjects = aObjects;
	
	if (isAssigned(this.tree))
        this.sValue = this.tree.getCheckedIds();
    else {
        this.sValue = ""+getValue(this.combo.getSelectedValue());
	}

	if (!isEmpty(this.sFirstValue) && (this.lkdObjects.length < 1)) {
        this.bDelete = true;
	} else if (this.sFirstValue != this.sValue) {
        this.bUpdate = true;
    }

    if ((this.lkdObjects.length < 1 && this.bMandatory) || !isAssigned(this.lkdObjects))
        this.bValid = false;
    else
        this.bValid = true;

    CAttributeField.prototype.updateField.call(this);
}

CLinkAttribute.prototype.getDataToSave = function () {
    var data = CAttributeField.prototype.getDataToSave.call(this);

    if (this.bUpdate) {
        delete data.sVal;
        if (this.bReturnAttributesValue)
            data.LkdObjects = this.lkdObjects;
        else
            data.IDsLkdObjects = this.sValue.split(";");
    }
    return data;
}

CLinkAttribute.prototype.lock = function (aLocked) {
    CAttributeField.prototype.lock.call(this, aLocked);
    var self = this;

    if (!this.bReadOnly) {
        if (isAssigned(this.tree))
            this.tree.lock(this.bLocked);
        else {
            this.combo.lock(this.bLocked)

            if (this.bLocked)
                J("#idAUnselectOption" + this.sIdDivParent).unbind("click");
            else
                J("#idAUnselectOption" + this.sIdDivParent).click(function () {
                    self.unselectComboOption();
                });
        }
    }
}