
function CBoolAttribute(aSettings, aDummydata) {
    var self = this,
        field = aSettings.field,
        div = J(aSettings.htmlDiv),
        sTrue,
        sFalse,
        sValue,
        sDataValue = isEmpty(field.Data) ? null : field.Data.abVal,
        sBooleanWords = J(aSettings.htmlDiv).attr('sBooleanWords'),
        bValid,
        sIdDivParent = getValue(J(aSettings.htmlDiv).attr('id'), getUniqueId()),
        sBooleanDisplayType = getValue(div.attr('sBooleanDisplayType'), "RadioButtons");

    switch (sBooleanWords) {
        case 'YesNo':
            sTrue = _("Oui");
            sFalse = _("Non");
            break;
        case 'TrueFalse':
            sTrue = _("Vrai");
            sFalse = _("Faux");
            break;
        default:
            sTrue = _("Oui");
            sFalse = _("Non");
    }
    aSettings.sDataValue = sDataValue;

    if (aSettings.bWriteMode) {
        switch (sBooleanDisplayType) {
            case 'RadioButtons':
                this.idYes = 'boolYes' + sIdDivParent;
                this.idNo = 'boolNo' + sIdDivParent;
                this.sName = 'boolField' + sIdDivParent;

                aSettings.sInput =
                    '<div style="float:left;margin-top:3px;">' +
                        '<div style="float:left;margin-right:4px;"><input type="radio" id="' + this.idYes + '" name="' + this.sName + '" value="1"></div>' +
                        '<div style="float:left;margin-top:-1px;margin-right:4px;">' + sTrue + '</div>' +
                        '<div style="float:left;margin-right:4px;"><input type="radio" id="' + this.idNo + '" name="' + this.sName + '" value="0"></div>' +
                        '<div style="float:left;margin-top:-1px;margin-right:4px;">' + sFalse + '</div>' +
                    '</div>';
                CAttributeField.call(this, aSettings);

                if (this.bReadOnly) {
                    J('#' + this.idYes).attr("disabled", "disabled");
                    J('#' + this.idNo).attr("disabled", "disabled");
                }
                // write data
                if (field.Data) {
                    if (getbValue(field.Data.abVal)) {
                        J('#' + this.idYes).prop('checked', true);
                    } else {
                        J('#' + this.idNo).prop('checked', true);
                    }
                }

            //manage update
            J("#" + this.idYes).click(function () {
                if (self.sValue == 1 || self.sValue == abTrue) {
                    this.checked = false;
                    self.updateField(abUndefined);
                } else
                    self.updateField(abTrue);
            });
            J("#" + this.idNo).click(function () {
                if (!isEmpty(self.sValue) && (self.sValue == 0 || self.sValue == abFalse)) {
                    this.checked = false;
                    self.updateField(abUndefined);
                } else {
                    self.updateField(abFalse);
                }
            });

                break;
            case 'ComboBox':
                var sId = "idDivCombo" + sIdDivParent,
                    idDefaultOption = abUndefined;

                aSettings.sInput = '<div id="' + sId + '"></div>';

                CAttributeField.call(this, aSettings);
                this.iParentDivWidth = (this.iParentDivWidth > 0 && this.bTemplate) ? this.iParentDivWidth : iTxFormCombosLnkWidth;

                if (field.Data) {
                    if (getbValue(field.Data.abVal)) {
                        idDefaultOption = abTrue;
                    } 
                }

            this.combo = new CComboBox({
                sIdDivCombo: sId,
                iWidth: this.iParentDivWidth,
                bReadOnly: this.bReadOnly,
                txObjects: [
                    { ID: abUndefined, sName: " " },
                    { ID: abTrue, sName: sTrue },
                    { ID: abFalse, sName: sFalse }
                ],
                iDefaultValueSelected: idDefaultOption,
                onChange: function () { self.updateField(self.combo.getSelectedValue()); }
            });

            //cancel button
            if (!this.bReadOnly) {
                div.append('<img id="cancel" src="' + _url("/resources/theme/img/btn_form/16x16_false.png") + '" style="position:absolute; right:0px; top:3px"/>');
                div.find('#cancel').on("click", function () {
                    div.find('.dhx_combo_input').val(''); // unselect 
                    if (div.attr('Mandatory')) {
                        bValid = false;
                    }// if field is mandatory, field is not valid
                });
            }
                break;
            case 'SwitchButton':
                this.idBtn = 'boolSwitch' + sIdDivParent;
                aSettings.sInput = '<button id="' + this.idBtn + '" state="undefined" style="width:100%; height:22px;"></button>';
                CAttributeField.call(this, aSettings);

                if (this.bReanOnly)
                    J("#" + this.idBtn).attr("disabled", "disabled");
                else {
                    div.find("#" + this.idBtn).click(function () {
                        switch (this.getAttribute('state')) {
                            case 'undefined':
                                this.setAttribute('state', 'yes');
                                this.innerHTML = '<img src="' + _url("/Resources/theme/img/btn_form/16x16_true.png") + '" style="vertical-align:sub; margin-right:5px;"/>' + sTrue;
                                bValid = true;
                                sValue = abTrue;
                                break;
                            case 'yes':
                                this.setAttribute('state', 'no');
                                this.innerHTML = '<img src="' + _url("/Resources/theme/img/btn_form/16x16_false.png") + '" style="vertical-align:sub; margin-right:5px;"/>' + sFalse;
                                bValid = true;
                                sValue = abFalse;
                                break;
                            default:
                                this.setAttribute('state', 'undefined');
                                this.innerHTML = '';
                                sValue = abUndefined;
                                if (div.attr('Mandatory')) { bValid = false; }
                                break;
                        }
                        self.updateField(sValue);
                    });
                }

                // write data
                if (field.Data) {
                    if (getbValue(field.Data.abVal)) {
                        div.find("#" + this.idBtn).attr('state', 'yes');
                        div.find("#" + this.idBtn).append('<img src="' + _url("/Resources/theme/img/btn_form/16x16_true.png") + '" style="vertical-align:sub; margin-right:5px;"/>' + sTrue);
                    } else {
                        div.find("#" + this.idBtn).attr('state', 'no');
                        div.find("#" + this.idBtn).append('<img src="' + _url("/Resources/theme/img/btn_form/16x16_false.png") + '" style="vertical-align:sub; margin-right:5px;"/>' + sFalse);
                        break;
                    }
                }
                break;
            default:
                var sId = "idDivCombo" + sIdDivParent;
                aSettings.sInput = '<div id="' + sId + '"></div>';

                CAttributeField.call(this, aSettings);
                this.iParentDivWidth = (this.iParentDivWidth > 0 && this.bTemplate) ? this.iParentDivWidth : iTxFormCombosLnkWidth;

                idDefaultOption = abUndefined;
                if (field.Data) {
                    if (getbValue(field.Data.abVal)) {
                        idDefaultOption = abTrue;
                    } else {
                        idDefaultOption = abFalse;
                    }
                }

                this.combo = new CComboBox({
                    sIdDivCombo: sId,
                    iWidth: this.iParentDivWidth,
                    bReadOnly: this.bReadOnly,
                    sIconsPath: _url("/resources/theme/img/btn_form/"),
                    bDisplayImage : true,
                    txObjects: [
                        { ID: abUndefined, sName: " " },
                        { ID: abTrue, sName: sTrue, sImg: "16x16_true.png" },
                        { ID: abFalse, sName: sFalse, sImg: "16x16_false.png" }
                    ],
                    iDefaultValueSelected: idDefaultOption,
                    onChange: function () { self.updateField(self.combo.getSelectedValue()); }
                });
        }
    } else {
        sImg = getbValue(field.Data.abVal) ? '16x16_true' : '16x16_false';
        aSettings.sInput = format('<img src="' + _url("/resources/theme/img/btn_form/#1.png") + '" />', [sImg]);

        CAttributeField.call(this, aSettings);
    }
}

CBoolAttribute.prototype = createObject(CAttributeField.prototype);
CBoolAttribute.prototype.constructor = CBoolAttribute;

CBoolAttribute.prototype.toString = function () {
    return "CBoolAttribute";
}

CBoolAttribute.prototype.updateField = function (aValue) {
    var sValue = getValue(aValue, abUndefined);

    this.bDelete = false;
    this.bUpdate = false;
    this.sValue = sValue;
    if (!isEmpty(this.sFirstValue) && (this.sValue == abUndefined)) {
        this.bDelete = true;
    } else if (this.sFirstValue != this.sValue) {
        this.bUpdate = true;
    }
    if ((this.sValue == abUndefined && this.bMandatory) || !isAssigned(this.sValue))
        this.bValid = false;
    else
        this.bValid = true;

    CAttributeField.prototype.updateField.call(this);
}

CBoolAttribute.prototype.getDataToSave = function () {
    var data = CAttributeField.prototype.getDataToSave.call(this);

    if (this.bUpdate) {
        delete data.sVal;
        //if (!isEmpty(this.sValue))
            data.abVal = this.sValue;
        //else
        //    data.abVal = abUndefined;
    }

    return data;
}

CBoolAttribute.prototype.lock = function (aLocked) {
    CAttributeField.prototype.lock.call(this, aLocked);

    if (!this.bReadOnly) {
        if (isAssigned(this.combo))
            this.combo.lock(this.bLocked);

        if (this.bLocked) {
            J("#" + this.idBtn).attr("disabled", "disabled");
            J("#" + this.idYes).attr("disabled", "disabled");
            J("#" + this.idNo).attr("disabled", "disabled");
        } else {
            J("#" + this.idBtn).removeAttr("disabled");
            J("#" + this.idYes).removeAttr("disabled");
            J("#" + this.idNo).removeAttr("disabled");
        }
    }
}