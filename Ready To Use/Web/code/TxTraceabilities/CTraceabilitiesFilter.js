/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings{
            traceabilities *** MANDATORY ***
            iColumnIndex *** MANDATORY ***
            arrValues
        }
        aCallBackFunction
        aDummyData
 * @returns CTraceabilitiesFilter object.
 */

var CTraceabilitiesFilter = function (aSettings) {
    checkMandatorySettings(aSettings, ["traceabilities", "iColumnIndex"]);

    this.traceabilities = getValue(aSettings.traceabilities);
    this.iColumnIndex = getValue(aSettings.iColumnIndex);
    this.arrValues = getValue(aSettings.arrValues, []);
    this.dhxCombo;
    this.dhxPopup;
    this.bActive = false;

    this.initFilter();
};

CTraceabilitiesFilter.prototype.initFilter = function () {
    var self = this;
    switch (this.iColumnIndex) {
        case 0:
            this.initBoundFilter();
            J("#textFilter_" + this.iColumnIndex).focusin(function (event) {
                self.showPopupFilter();
            });
            break;
        case 1:
        case 2:
            this.initComboFilter();
            break;
        case 3:
        case 4:
            J("#textFilter_" + this.iColumnIndex).keyup(function (event) {
                if (event.which == 13) {
                    var sVal = J("#textFilter_" + self.iColumnIndex).val();
                    if (sVal === "")
                        self.setFilterActive(false);
                    else {
                        self.arrValues = sVal.split(" ");
                        self.setFilterActive(true);
                    }
                    self.traceabilities.applyFilter();
                }
            });
            // specific for cross in IE10
            J("#textFilter_" + this.iColumnIndex).bind("mouseup", function (event) {
                var sOldValue = J("#textFilter_" + self.iColumnIndex).val();
                if (sOldValue == "") return;
                // When this event is fired after clicking on the clear button
                // the value is not cleared yet. We have to wait for it.
                setTimeout(function () {
                    var sNewValue = J("#textFilter_" + self.iColumnIndex).val();
                    if (sNewValue == "") {
                        self.setFilterActive(false);
                        self.traceabilities.applyFilter();
                    }   
                }, 1);
            });
            break;
    }
}

CTraceabilitiesFilter.prototype.initComboFilter = function () {
    var self = this;

    this.dhxCombo = new dhtmlXCombo({
        parent: 'comboFilter_' + this.iColumnIndex,
        name: 'comboFilterCol_' + this.iColumnIndex,
        type: 'checkbox'
    });
    this.dhxCombo.readonly(true);
    this.dhxCombo.setImgPath
    this.dhxCombo.enableOptionAutoHeight(true, 200);
    this.dhxCombo.enableOptionAutoWidth(true);
    this.dhxCombo.attachEvent("onChange", function () {
        var ind = this.getSelectedIndex();
        if (ind > -1) {
            this.setChecked(ind, true); // check option if it is selected
            self.arrValues = this.getChecked();
            J("#comboFilter_" + self.iColumnIndex + " .dhx_combo_option_img").show();
            self.setFilterActive(true);
            self.traceabilities.applyFilter();
        }
    });
    this.dhxCombo.attachEvent("onCheck", function (aValue, aState) {
        self.arrValues = this.getChecked();
        J("#comboFilter_" + self.iColumnIndex + " .dhx_combo_option_img").show();
        if (aState) {
            this.setComboValue(aValue);
        } else {
            if (self.arrValues.length)
                this.setComboValue(this.getChecked()[0]);
            else {
                this.setComboValue(null);
                J("#comboFilter_"+self.iColumnIndex+" .dhx_combo_option_img").hide();
            }
        }
        if (self.arrValues.length)
            self.setFilterActive(true);
        else
            self.setFilterActive(false);
        self.traceabilities.applyFilter();
        return true;
    });
    this.dhxCombo.attachEvent("onBlur", function () {
        this.closeAll();
    });
    // get options combo
    var arrOptions = [];
    if (this.iColumnIndex === 1) { // column 'user'
        J.each(self.traceabilities.jData.rows, function (aIndex, aRow) {
            if (arrOptions.findIndex(function (aObj) {
                    return aObj.value == aRow.data[1];
            }) == -1)
                arrOptions.push({ value: aRow.data[1], text: aRow.data[1] });
        });
        
    } else { // column 'attribute'
        J.each(self.traceabilities.jData.rows, function (aIndex, aRow) {
            if (aRow.rows)
                J.each(aRow.rows, function (aSubInd, aSubRow) {
                    if (arrOptions.findIndex(function (aObj) {
                        return aObj.value == aSubRow.data[2];
                    }) == -1)
                        arrOptions.push({ value: aSubRow.data[2], text: aSubRow.data[2] });
                });
            
        });
    }
    this.dhxCombo.addOption(arrOptions);
}

CTraceabilitiesFilter.prototype.initBoundFilter = function () {
    var self = this;
    this.dhxPopup = new dhtmlXPopup({ mode: "right" });
    var sHtmlPopup = '<div class="divBoundFilter">'+
                        _("De") + ' <input type="text" id="popupBoundInfValue" class="popupInputDate" /> ' + _("à") + ' <input type="text" id="popupBoundSupValue" class="popupInputDate" />' +
                        '<button id="popupButtonDelete" disabled>' + _("Supprimer") + '</button>' +
                        '<button id="popupButtonValid">' + _("Valider") + '</button>' +
                        '<button id="popupButtonCancel">' + _("Annuler") + '</button>' +
                    '</div>';
    this.dhxPopup.attachHTML(sHtmlPopup);
    this.dhxPopup.attachEvent("onBeforeHide", function () { // fires when a combo option was selected in popup
        return false; // don't close;
    });

    //init datepickers
    var rCalendarSettings = {
        sDateFormat: sTxDateFormat,
        bTime: false,
        bShowOtherMonths: true,
        bSelectOtherMonths: true,
        bShowButtonPanel: true,
        bChangeMonth: true,
        bChangeYear: true,
        sShowOn: 'both',
        sButtonImage: '/resources/theme/img/btn_form/calendrier.png',
        bButtonImageOnly: true,
        bGotoCurrent: true
    }

    rCalendarSettings.sIdInputDate = 'popupBoundInfValue';
    this.lowerBoundDatepicker = new CDatePicker(rCalendarSettings);
    rCalendarSettings.sIdInputDate = 'popupBoundSupValue';
    this.upperBoundDatepicker = new CDatePicker(rCalendarSettings);

    J("#popupButtonDelete").click(function () {
        J("#textFilter_" + self.iColumnIndex).val("");
        J("#popupBoundInfValue").val("");
        J("#popupBoundSupValue").val("");
        self.setFilterActive(false);
        self.traceabilities.applyFilter();
        self.closePopupFilter();
    });
    J("#popupButtonValid").click(function () {
        self.setFilterActive(true);
        self.traceabilities.applyFilter();
        self.closePopupFilter();
    });
    J("#popupButtonCancel").click(function () {
        self.closePopupFilter();
    });
}

CTraceabilitiesFilter.prototype.showPopupFilter = function () {
    var input = document.getElementById('textFilter_' + this.iColumnIndex),
        x = getAbsoluteLeft(input),
        y = getAbsoluteTop(input),
        w = input.offsetWidth,
        h = input.offsetHeight;
    J('#textFilter_' + this.iColumnIndex).prop("disabled", true);
    this.dhxPopup.show(x, y, w, h);
}

CTraceabilitiesFilter.prototype.closePopupFilter = function () {
    J('#textFilter_' + this.iColumnIndex).prop("disabled", false);
    this.dhxPopup.hide();
}

CTraceabilitiesFilter.prototype.destroyPopupFilter = function () {
    this.dhxPopup.unload();
}

CTraceabilitiesFilter.prototype.applyColumnFilter = function () {
    var self = this;
    switch (this.iColumnIndex) {
        case 0:
            this.applyBoundFilter();
            break;
        case 1:
            this.applyComboUserFilter();
            break;
        case 2:
            this.applyComboAttributeFilter();
            break;
        case 3:
        case 4:
            this.applyTextFilter();
            break;
    }
}

CTraceabilitiesFilter.prototype.applyBoundFilter = function () {
    var self = this,
        arrfiltered,
        newRowsFiltered = {};
    var sInf = (J("#popupBoundInfValue").val() != "") ? J("#popupBoundInfValue").val() : "-INF",
        sSup = (J("#popupBoundSupValue").val() != "") ? J("#popupBoundSupValue").val() : "+INF",
        sFirst = (sInf === "-INF") ? "]" : "[",
        sLast = (sSup === "+INF") ? "[" : "]";
    this.dateLowerBound = null;
    this.dateUpperBound = null;
    if (sInf != "-INF")
        this.dateLowerBound = this.lowerBoundDatepicker.getDate();
    if (sSup != "+INF")
        this.dateUpperBound = this.upperBoundDatepicker.getDate();
    J("#textFilter_" + this.iColumnIndex).val(sFirst + sInf + ";" + sSup + sLast);
    // apply filter
    arrfiltered = this.traceabilities.jFilteredData.rows.filter(function (aObj) {
        var dateModification = strToDate(aObj.data[self.iColumnIndex], false);
        if (self.dateLowerBound != null && self.dateLowerBound > dateModification) {
            return false;
        }
        if (self.dateUpperBound != null && self.dateUpperBound < dateModification) {
            return false;
        }
        return true;
    });
    if (arrfiltered.length > 0) {
        J.each(arrfiltered, function (aInd, aObj) {
            aObj.data[0] = { "value": aObj.data[0], "image": "folder.gif" };
        });
        newRowsFiltered.rows = arrfiltered;
    }
    this.traceabilities.jFilteredData = newRowsFiltered;
    this.traceabilities.reloadData();
}

CTraceabilitiesFilter.prototype.applyTextFilter = function () {
    var self = this,
        arrfiltered;
    var newRowsFiltered = {
        rows: []
    };
    J.each(this.traceabilities.jFilteredData.rows, function (aIndex, aRow) {
        arrfiltered = [];
        if ("rows" in aRow) {
            arrfiltered = aRow.rows.filter(function (aObj) {
                var bResult = true;
                for (var i = 0; i < self.arrValues.length; i++) {
                    if (aObj.data[self.iColumnIndex].toUpperCase().indexOf(self.arrValues[i].toUpperCase()) == -1) {
                        bResult = false;
                        break;
                    }
                }
                return bResult;
            });
        }
        if (arrfiltered.length > 0) {
            aRow.data[0] = { "value": aRow.data[0], "image": "folder.gif" };
            var newRow = {
                id: aRow.id,
                data: aRow.data,
                rows: arrfiltered
            }
            newRowsFiltered.rows.push(newRow);
        }
    });
    this.traceabilities.jFilteredData = newRowsFiltered
    this.traceabilities.reloadData();
}

CTraceabilitiesFilter.prototype.applyComboUserFilter = function () {
    var self = this,
        arrfiltered,
        newRowsFiltered = {};
    arrfiltered = this.traceabilities.jFilteredData.rows.filter(function (aObj) {
        var bResult = false;
        for (var i = 0; i < self.arrValues.length; i++) {
            if (aObj.data[self.iColumnIndex] == self.arrValues[i]) {
                bResult = true;
                break;
            }
        }
        return bResult;
    });
    if (arrfiltered.length > 0) {
        J.each(arrfiltered, function (aInd, aObj) {
            aObj.data[0] = { "value": aObj.data[0], "image": "folder.gif" };
        });
        newRowsFiltered.rows = arrfiltered;
    }
    this.traceabilities.jFilteredData = newRowsFiltered;
    this.traceabilities.reloadData();
}

CTraceabilitiesFilter.prototype.applyComboAttributeFilter = function () {
    var self = this,
        arrfiltered;
    var newRowsFiltered = {
        rows: []
    };
    J.each(this.traceabilities.jFilteredData.rows, function (aIndex, aRow) {
        arrfiltered = [];
        if ("rows" in aRow) {
            arrfiltered = aRow.rows.filter(function (aObj) {
                var bResult = false;
                for (var i = 0; i < self.arrValues.length; i++) {
                    if (aObj.data[self.iColumnIndex] == self.arrValues[i]) {
                        bResult = true;
                        break;
                    }
                }
                return bResult;
            });
        }
        if (arrfiltered.length > 0) {
            aRow.data[0] = { "value": aRow.data[0], "image": "folder.gif" };
            var newRow = {
                id: aRow.id,
                data: aRow.data,
                rows: arrfiltered
            }
            newRowsFiltered.rows.push(newRow);
        }
    });
    this.traceabilities.jFilteredData = newRowsFiltered;
    this.traceabilities.reloadData();
}

CTraceabilitiesFilter.prototype.setFilterActive = function (aState) {
    if (aState) {
        this.bActive = true;
        if ([0, 3, 4].indexOf(this.iColumnIndex) > -1) {
            J("#textFilter_" + this.iColumnIndex).addClass("activeFilter");
            if (this.iColumnIndex === 0)
                J("#popupButtonDelete").prop("disabled", false);
        } else {
            J("#comboFilter_" + this.iColumnIndex).children(".dhx_combo_box").first().addClass("activeFilter");
        }
    } else {
        this.bActive = false;
        if ([0, 3, 4].indexOf(this.iColumnIndex) > -1) {
            J("#textFilter_" + this.iColumnIndex).removeClass("activeFilter");
            if (this.iColumnIndex === 0)
                J("#popupButtonDelete").prop("disabled", true);
        } else {
            J("#comboFilter_" + this.iColumnIndex).children(".dhx_combo_box").first().removeClass("activeFilter");
        }
    }
}

