"use strict";
/**
 * @class : Filter for one column in a TableView
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.tableView *** MANDATORY ***
        aSettings.idColumn *** MANDATORY ***
        aSettings.iDefaultFilterType
        aSettings.bLoadfilter
 * @returns CTableViewFilter object.
 */

var CTableViewFilter = function (aSettings) {
    checkMandatorySettings(aSettings, ["tableView", "idColumn"]);

	//privileged variables
    this.tableView = aSettings.tableView;
    this.idColumn = aSettings.idColumn;
    this.iDefaultFilterType = getValue(aSettings.iDefaultFilterType, 1);
    this.bLoadFilter = getValue(aSettings.bLoadFilter, false);
    this.sIdInput = "id_text_filter_" + this.tableView.idTable + "_" + this.idColumn;
    this.sIdCombo = "id_div_combo_" + this.tableView.idTable + "_" + this.idColumn;
    this.sIdImgFilter = "id_img_filter_" + this.tableView.idTable + "_" + this.idColumn;
	this.bIsDate=false;
	this.bIsDateTime=false;
	this.sLangDate;
	this.sDateFormat;
	this.sDateAndTimeFormat;
	this.iFilterType = 0;
	this.sValue = "";
	this.sFloatValue = "";
	this.bInitialized = false;
	this.bActive = false;
	this.bRefreshComboValues = false;
    //combo
	this.sJsonOptions = "";
	this.arrOptionsChecked = [];
	this.arrOptionsFilter = [];
	
    //private variables
    var self = this;
	
    // Init Combo
	this.dhxComboValues = new dhtmlXCombo({
		parent: self.sIdCombo,
		name: "comboVH",
		type: "checkbox"
	});
	this.dhxComboValues.readonly(true);
	this.dhxComboValues.enableOptionAutoHeight(true, 200);
	this.dhxComboValues.enableOptionAutoWidth(true);
	this.dhxComboValues.attachEvent("onCheck", function (aValue, aState) {
	    this.setChecked(aValue, aState);
		var arrValues = this.getChecked();
		self.arrOptionsChecked = [];
		for (var i = 0 ; i < arrValues.length ; i++) {
		    self.arrOptionsChecked.push(this.getOption(arrValues[i]).text);
		}
		self.iFilterType = 5;
		self.sValue = self.getOptionsCheckedToString();
		self.applyColumnFilter();
		return true;
	});
	this.dhxComboValues.attachEvent("onBlur", function () {
	    this.closeAll();
	});
	this.dhxComboValues.attachEvent("onOpen", function () {
	    if (self.bRefreshComboValues) {
	        this.disable(true);
	        this.setComboText(_("Chargement des données..."));
	        self.getColumnPossibleFiltersValues(function (aData) {
	            self.reloadCombo(aData);
	            self.dhxComboValues.openSelect();
	        });
	        self.bRefreshComboValues = false;
	    }
	});
	
	J("#" + this.sIdInput)
			.change(function () {
			   self.validateColumnFilterFromHeader();
			})
			.keypress(function (e) {
			    if (e.which == 13) self.validateColumnFilterFromHeader();
			})
            // specific for cross in IE10
	        .bind("mouseup", function (event) {
	            var sOldValue = J(this).val();
	            if (sOldValue == "") return;
	            // When this event is fired after clicking on the clear button
	            // the value is not cleared yet. We have to wait for it.
	            setTimeout(function () {
	                var sNewValue = J("#" + self.sIdInput).val();
	                if (sNewValue == "") {
	                    J("#" + self.sIdInput).attr("iFilterType", "0");
	                    self.validateColumnFilterFromHeader();
	                } 
	            }, 1);
	        });

    // Load Filter
	if (this.bLoadFilter)
	    this.loadFilter();
}

CTableViewFilter.prototype.setValue = function (aValue) {
    this.sValue = aValue;
    if (this.iFilterType !== 5)
        J("#" + this.sIdInput).val(this.sValue);
}

CTableViewFilter.prototype.toString = function () {
    return "idTable: " + this.tableView.idTable + " | " + "idColumn: " + this.idColumn + " | " + "iFilterType: " + this.iFilterType + " | " + "sValue: " + this.sValue;
}

CTableViewFilter.prototype.showInput = function () {
    J("#" + this.sIdInput).css("display", "block");
    J("#" + this.sIdCombo).css("display", "none");
}

CTableViewFilter.prototype.showCombo = function () {
    J("#" + this.sIdInput).css("display", "none");
    J("#" + this.sIdInput).val("");
    J("#" + this.sIdCombo).css("display", "block");
}

CTableViewFilter.prototype.hideInputCombo = function () {
    J("#" + this.sIdInput).css("display", "none");
    J("#" + this.sIdInput).val("");
    J("#" + this.sIdCombo).css("display", "none");
}

CTableViewFilter.prototype.reloadCombo = function (aJson) {
    if (aJson.length > 0) {
        this.dhxComboValues.disable(false);
        this.dhxComboValues.clearAll(true);
        this.sJsonOptions = aJson;
        this.dhxComboValues.addOption(aJson);
        this.checkOptions();
    } else {
        this.dhxComboValues.setComboText(_("Aucune option"));
    }
    if (this.tableView.popupFilter.dhxPopup.isVisible())
        this.tableView.popupFilter.fillPopup();
}

CTableViewFilter.prototype.clear = function () {
    this.iFilterType = 0;
    this.sValue = "";
    this.sFloatValue = "";
    this.arrOptionsChecked = [];
    J("#" + this.sIdInput).val("");
    J("#" + this.sIdInput).prop('disabled', false);
    this.dhxComboValues.clearAll(true);
    this.showInput();
    this.applyFilter();
}

CTableViewFilter.prototype.loadFilter = function (aCallback) {
    var self = this;
    J.ajax({
        url: sPathFileTableViewAjaxASP,
        async: true,
        cache: false,
        dataType: "html",
        data: {
            sFunctionName: "GetColumnFilter",
            IdTable: self.tableView.idTable,
            IdColumn: self.idColumn
        },
        success: function (data) {
            var arrResult = data.split("|");
            if (arrResult[0] === sOk) {
                self.iFilterType = parseInt(arrResult[1]);
                self.arrOptionsFilter = arrResult[2].split(";");
                self.bIsDate = arrResult[3] ? (arrResult[3] !== "0") : false;
                self.bIsDateTime = arrResult[4] ? (arrResult[4] !== "0") : false;
                self.sLangDate = arrResult[5];
                self.sDateFormat = arrResult[6];
                self.sDateAndTimeFormat = arrResult[7];

                // retrieve value
                arrResult.splice(0, 8);
                var sValue = "";
                for (var i = 0; i < arrResult.length; i++) {
                    if (i === 0) {
                        sValue += arrResult[i];
                    } else {
                        sValue += " " + arrResult[i];
                    }
                }
                // In case of date : replace float value by its string value
                if (self.bIsDate) {
                    self.sFloatValue = sValue;
                    if (self.iFilterType === 6) { // bound filter
                        var matches = sValue.match(/([\[\]])(.+);(.+)([\[\]])/);
                        self.sValue = matches[1] + ((matches[2] == 'undefined') ? '-INF' : floatToDateStr(matches[2])) + ';' + ((matches[3] == 'undefined') ? '+INF' : floatToDateStr(matches[3])) + matches[4];
                    } else if (sValue !== "")
                        self.sValue = floatToDateStr(sValue);
                    else
                        self.sValue = sValue;
                } else
                    self.sValue = sValue;

                self.bInitialized = true;

                if (self.iFilterType === 5) {
                    self.arrOptionsChecked = arrResult;
                    self.dhxComboValues.disable(true);
                    self.dhxComboValues.setComboText(_("Chargement des données..."));
                    self.getColumnPossibleFiltersValues(function (aData) {
                        self.reloadCombo(aData);
                    });
                } else if (self.tableView.popupFilter.dhxPopup.isVisible())
                    self.tableView.popupFilter.fillPopup();

                if (aCallback)
                    aCallback();
                else {
                    if (self.iFilterType > 0) {
                        self.applyFilter();
                    } else {
                        self.bActive = false;
                        J("#" + self.sIdImgFilter).attr("src", _url("/resources/theme/img/dhtmlx/grid/module_mcs-16_disabled.png"));
                    }
                }
            } else
                msgError(arrResult[0]);
        }
    });
}

CTableViewFilter.prototype.checkOptions = function () {
    var sVal, rOption, idOption;
    for (var i = 0 ; i < this.arrOptionsChecked.length ; i++) {
        sVal = this.arrOptionsChecked[i];
        rOption = this.dhxComboValues.getOptionByLabel(sVal);
        if (rOption){
            idOption = rOption.value;

            if (i === 0)
                this.dhxComboValues.selectOption(idOption);
					
            this.dhxComboValues.setChecked(idOption, true);
        }
    }
}

CTableViewFilter.prototype.applyColumnFilter = function () {
    var self = this,
        sTempValue = "";

    this.tableView.activeProgressLayout();

    if (this.sFloatValue !== "")
        sTempValue = this.sFloatValue;
    else
        sTempValue = this.sValue;

    if (sTempValue === "")
        sTempValue = sNull;
        
    J.ajax({
        url: sPathFileTableViewAjaxASP,
        type: 'post',
        async: true,
        cache: false,
        dataType: "html",
        data: {
            sFunctionName: "ApplyColumnFilter",
            IdTable: self.tableView.idTable,
            IdColumn: self.idColumn,
            iFilterType: self.iFilterType,
            sFilterValue: sTempValue
        },
        success: function (data) {
            var arrResult = data.split("|");
            if (arrResult[0] === sOk) {
                self.tableView.iVisibleRowsCount = arrResult[1];
                self.tableView.iPageCount = arrResult[2];
                self.applyFilter();
                self.tableView.getJsonGridData();
                self.getColumnPossibleFiltersValues(function (aData) {
                    self.reloadCombo(aData);
                });
                // maj refresh for other filters
                var rFilter;
                for (var i = 0; i < self.tableView.arrTableViewFilter.length ; i++) {
                    rFilter = self.tableView.arrTableViewFilter[i];
                    if ((self.idColumn !== rFilter.idColumn) && (rFilter.iFilterType === 5)) {
                        rFilter.bRefreshComboValues = true;
                    }
                }
            } else
                msgError(arrResult[0]);
        }
    });
}

CTableViewFilter.prototype.applyFilter = function () {
    if (this.iFilterType !== 0) {
        if (this.iFilterType === 5) //case of FilterType list
            this.showCombo();
        else
            this.showInput();
        this.bActive = true;
        J("#id_img_filter_" + this.tableView.idTable + "_" + this.idColumn).attr("src", _url("/resources/theme/img/dhtmlx/grid/module_mcs-16.png"));
    } else {
        this.bActive = false;
        J("#id_img_filter_" + this.tableView.idTable + "_" + this.idColumn).attr("src", _url("/resources/theme/img/dhtmlx/grid/module_mcs-16_disabled.png"));
    }

    if (this.iFilterType === 0)
        this.iFilterType = this.iDefaultFilterType;
    var sHint = "";
    switch (this.iFilterType) {
        case 1:
            sHint = _("Contient ET");
            break;
        case 2:
            sHint = _("Contient OU");
            break;
        case 3:
            sHint = _("Commence par");
            break;
        case 4:
            sHint = _("Egal à");
            break;
        case 6:
            sHint = _("Bornes");
            break;
        case 7:
            sHint = _("Absence de valeur");
            break;
    }
 
    if (this.iFilterType !== 5) {
        J("#" + this.sIdInput).attr("iFilterType", this.iFilterType);
        J("#" + this.sIdInput).attr("title", sHint);
        J("#" + this.sIdInput).val(this.sValue);
        this.arrOptionsChecked = [];
    }
    if (this.iFilterType === 7) {
        J("#" + this.sIdInput).prop('disabled', true);
    } else {
        J("#" + this.sIdInput).prop('disabled', false);
    }
}

CTableViewFilter.prototype.getOptionsCheckedToString = function () {
    var sOptChecked = "";
    for (var i = this.arrOptionsChecked.length - 1; i >= 0; i--) {
        if (sOptChecked === "")
            sOptChecked = this.arrOptionsChecked[i];
        else
            sOptChecked += "<space>" + this.arrOptionsChecked[i];
    };
    return sOptChecked;
}

CTableViewFilter.prototype.validateColumnFilterFromHeader = function () {;
    var self = this;

    var doValidateColumnFilter = function () {
        self.iFilterType = parseInt(J("#" + self.sIdInput).attr("iFilterType"));
        if (self.iFilterType == 6 && self.bIsDate) {
            var index = sInputValue.indexOf(";"),
                sLowerBound = sInputValue.substring(1, index),
                sUpperBound = sInputValue.substring(index + 1, sInputValue.length - 1), 
                fLowerBoundValue, fUpperBoundValue,
                sFirst = "[", sLast = "]";
            if (self.bIsDate) {
                if (sLowerBound != "-INF") {
                    fLowerBoundValue = strToDateToFloat(sLowerBound, self.bIsDateTime);
                }
                if (sUpperBound != "+INF") {
                    fUpperBoundValue = strToDateToFloat(sUpperBound, self.bIsDateTime);
                }
            } else {
                fLowerBoundValue = sLowerBound;
                fUpperBoundValue = sUpperBound;
            }
            
            if (fLowerBoundValue > fUpperBoundValue) {
                self.setValue(sInputValue);
                msgWarning(_("La borne supérieure renseignée doit être supérieure à la borne inférieure renseignée") + ".");
                return;
            }
            sfValue = sFirst + fLowerBoundValue + ';' + fUpperBoundValue + sLast;
        } else if (self.iFilterType == 4 && self.bIsDate) {
            sfValue = strToDateToFloat(sInputValue, self.bIsDateTime);
        }
        self.setValue(sInputValue);
        self.sFloatValue = sfValue;
        self.bActive = true;
        self.applyColumnFilter();
    }

    var sInputValue = J("#" + this.sIdInput).val(),
        sfValue = "";
		
	if (sInputValue == this.sValue)
		return; //same Value = no need to apply the same filter twice
	
    if (!this.bInitialized) {
        this.loadFilter(doValidateColumnFilter);
    } else
        doValidateColumnFilter();
}

CTableViewFilter.prototype.getColumnPossibleFiltersValues = function (aCallback) {
    var self = this;
    J.ajax({
        url: sPathFileTableViewAjaxASP,
        async: true,
        cache: false,
        dataType: "json",
        data: {
            sFunctionName: "GetColumnPossibleFiltersValues",
            IdTable: self.tableView.idTable,
            IdColumn: self.idColumn
        },
        success: function (data) {
            aCallback(data);
        }
    });
}