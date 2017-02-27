"use strict";
/**
 * @class : Popup use to display filter in TableView
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
 * @returns CTableViewPopupFilter object.
 */

var CTableViewPopupFilter = function (aSettings) {
    // privileged variables
    this.sIdDiv = "tableViewPopupFilter"+getUniqueId();
    this.tableView;
    this.idColumn;
    this.tableViewFilter;
    this.lowerBoundDatepicker;
    this.upperBoundDatepicker;
    this.filterValueDatepicker;

    //private variables
    var self = this; 
    var sPosition = "right";

    this.createPopupHtml();
	
	//initialize dhxPopup	
	this.dhxPopup = new dhtmlXPopup({ mode: sPosition });
	this.dhxPopup.attachObject(this.sIdDiv);
	this.dhxPopup.attachEvent("onBeforeHide", function (type, ev, id) { // fires when a combo option was selected in popup
		return false; // don't close;
	});
		
    //initialize combos in dhxPopup
	window.dhx_globalImgPath = _url("/resources/theme/img/dhtmlx/combo/");
	this.dhxComboFilterTypes = new dhtmlXCombo(this.idComboFilterTypes, "combo", 230, "image");
	this.dhxComboFilterTypes.setDefaultImage(_url("/resources/theme/img/btn_titre/module_mcs-16.png"));
	this.dhxComboFilterTypes.enableOptionAutoHeight(true);
	this.dhxComboFilterTypes.selectOption("0");
	this.dhxComboFilterTypes.readonly(true);
	this.dhxComboFilterTypes.attachEvent("onChange", function () {
	    J("#"+self.idDivFilterValue).show();
	    J("#"+self.idInputFilterValue).hide();
	    J("#"+self.idComboFilterValues).hide();
	    J("#"+self.idDivFilterBoundsValues).hide();
	    var iIndexComboOption = parseInt(this.getSelectedValue());
	    if (!iIndexComboOption) {
	        iIndexComboOption = 0;
	    }
	    switch (iIndexComboOption) {
	        case 0: //none
	            J("#"+self.idDivFilterValue).hide();
	            break;
	        case 5: //list
	            J("#"+self.idComboFilterValues).show();
	            self.getColumnPossibleFiltersValues();
	            break;
	        case 6: // bounds
	            J("#"+self.idDivFilterValue).hide();
	            J("#"+self.idDivFilterBoundsValues).show();
	            break;
	        case 7: // empty value
	            J("#"+self.idDivFilterValue).hide();
	            break;
	        default: //others
	            J("#"+self.idInputFilterValue).show();
	    }
	});
		
	this.dhxComboValues = new dhtmlXCombo(this.idComboFilterValues, "combo", 230, "checkbox");
	this.dhxComboValues.readonly(true);
	this.dhxComboValues.enableOptionAutoHeight(true, 250);
	this.dhxComboValues.attachEvent("onChange", function () {
	    var ind = this.getSelectedIndex();
	    if (ind > -1)
		    this.setChecked(ind,true); // check option if it is selected
	});
	this.dhxComboValues.attachEvent("onCheck", function (aValue, aState) {
	    if (aState) {
	        this.setComboValue(aValue);
	    } else {
	        var arrChecked = this.getChecked();
	        if (arrChecked.length)
	            this.setComboValue(this.getChecked()[0]);
            else
	            this.setComboValue(null);
	    }
	    return true;
	});
	this.dhxComboValues.attachEvent("onBlur", function () {
	    this.closeAll();
	});

	// Display divPop
	J('#' + this.sIdDiv).show();
}

CTableViewPopupFilter.prototype.createPopupHtml = function () {
    var self = this;

    this.idComboFilterTypes = "tvPopupComboFilterTypes" + getUniqueId();
    this.idDivFilterValue = "tvPopupFilterValue" + getUniqueId();
    this.idInputFilterValue = "tvpopupFilterTextValue"+getUniqueId();
    this.idComboFilterValues = "tvpopupFilterComboValues"+getUniqueId();
    this.idDivFilterBoundsValues = "tvPopupFilterBoundsValues"+getUniqueId();
    this.idInputFilterLowerValue = "tvPopupFilterLowerValue"+getUniqueId();
    this.idInputFilterUpperValue = "tvPopupFilterUpperValue"+getUniqueId();
    this.idButtonFilterDelete = "tvPopupFilterBtnDelete"+getUniqueId();
    this.idButtonFilterValid = "tvPopupFilterBtnValid"+getUniqueId();
    this.idButtonFilterCancel = "tvPopupFilterBtnCancel"+getUniqueId();
    var sHtml = '<div id="' + this.sIdDiv + '" class="tableViewPopupFilter">' +
                    '<div class="tvPopupFilterLine">' +
                        '<div class="tvPopupFilterLabel">' +
                            '<label>' + _("Type de Filtre") + ' :</label>' +
                        '</div>' +
                        '<div class="tvPopupFilterData">' +
                            '<div id="' + this.idComboFilterTypes + '"></div>' +
                        '</div>' +
                    '</div>' +
                    '<div id="' + this.idDivFilterValue + '" class="tvPopupFilterLine">' +
                        '<div class="tvPopupFilterLabel">' +
                            '<label>' + _("Valeur du Filtre") + ' :</label>' +
                        '</div>' +
                        '<div class="tvPopupFilterData">' +
                            '<input type="text" id="' + this.idInputFilterValue + '" class="tvPopupFilterField"/>' +
                            '<div id="' + this.idComboFilterValues + '"></div>' +
                        '</div>' +
                    '</div>' +
                    '<div id="' + this.idDivFilterBoundsValues + '">' +
                        '<div class="tvPopupFilterLine">' +
                            '<div class="tvPopupFilterLabel">' +
                                '<label>' + _("Borne inf.") + ' :</label>' +
                            '</div>' +
                            '<div class="tvPopupFilterData">' +
                                '<input type="text" id="' + this.idInputFilterLowerValue + '" class="tvPopupFilterField"/>' +
                            '</div>' +
                        '</div>' +
                        '<div class="tvPopupFilterLine" >' +
                            '<div class="tvPopupFilterLabel">' +
                                '<label>' + _("Borne sup.") + ' :</label>' +
                            '</div>' +
                            '<div class="tvPopupFilterData">' +
                                '<input type="text" id="' + this.idInputFilterUpperValue + '" class="tvPopupFilterField"/>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="tvPopupFilterButtons">' +
                        '<input id="' + this.idButtonFilterDelete + '" type="button" value="' + _("Supprimer le filtre") + '"/>' +
                        '<input id="' + this.idButtonFilterValid + '" type="button" value="' + _("Valider") + '"/>' +
                        '<input id="' + this.idButtonFilterCancel + '" type="button" value="' + _("Annuler") + '"/>' +
                    '</div>' +
                '</div>';

    J(document.body).append(sHtml);

	J("#"+this.idDivFilterValue).hide();
	J("#"+this.idDivFilterBoundsValues).hide();
	J("#"+this.idInputFilterValue).keydown(function(event) {
		if ( event.which == 13 )
		    self.validateColumnFilter(true);
	});
	J("#"+this.idInputFilterLowerValue).keydown(function(event) {
		if ( event.which == 13 )
		    self.validateColumnFilter(true);
	});
	J("#"+this.idInputFilterUpperValue).keydown(function(event) {
		if ( event.which == 13 )
		    self.validateColumnFilter(true);
	});
	J("#"+this.idButtonFilterDelete).click(function() {
		self.deleteFilter();
	});
	J("#"+this.idButtonFilterValid).click(function() {
		self.validateColumnFilter(true);
	});
	J("#"+this.idButtonFilterCancel).click(function() {
		self.hide();
	});
}

CTableViewPopupFilter.prototype.setSkin = function (aSkin) {
    this.dhxPopup.setSkin(aSkin);
}

CTableViewPopupFilter.prototype.show = function (aTableView, aIdColumn, aInput) {
    if (this.tableView && aTableView.idTable == this.tableView.idTable && this.idColumn == aIdColumn && this.dhxPopup.isVisible())
        return;
    else if (this.dhxPopup.isVisible())
        this.dhxPopup.hide();

    // Init new parameters
    this.tableView = aTableView;
    this.idColumn = aIdColumn;
    this.tableViewFilter = this.tableView.getFilter(this.idColumn);

    // reinit popup values
    J("#"+this.idInputFilterValue).val("");
    J("#"+this.idInputFilterLowerValue).val("");
    J("#"+this.idInputFilterUpperValue).val("");
    this.dhxComboFilterTypes.selectOption(0);

    // Fill popup filter values
    if (this.tableViewFilter.bInitialized) {
        this.fillPopup();
    } else {
        this.dhxComboFilterTypes.disable(true);
        this.tableViewFilter.loadFilter();
    }

    // show popup;
    var x = getAbsoluteLeft(aInput);
    var y = getAbsoluteTop(aInput);
    var w = aInput.offsetWidth;
    var h = aInput.offsetHeight;
    this.dhxPopup.show(x, y, w, h);
}

CTableViewPopupFilter.prototype.hide = function () {
    this.dhxPopup.hide();
    if (this.tableViewFilter.bIsDate) {
        this.lowerBoundDatepicker.destroy();
        this.upperBoundDatepicker.destroy();
        this.filterValueDatepicker.destroy();
    }
}

CTableViewPopupFilter.prototype.fillPopup = function () {
    var sUpperBoundValue,
        sLowerBoundValue;
    this.dhxComboFilterTypes.clearAll(true);

    // load filters type options 
    var options = [];
    options.push({ "value": 0, text: _("Aucun filtre") });
    var arrOptions = this.tableViewFilter.arrOptionsFilter,
        iValue, sText;
    for (var i = 0 ; i < arrOptions.length ; i++) {
        iValue = parseInt(arrOptions[i]);
        switch (iValue) {
            case 0:
                sText = _("Aucun filtre");
                break;
            case 1:
                sText = _("Contient ET");
                break;
            case 2:
                sText = _("Contient OU");
                break;
            case 3:
                sText = _("Commence par");
                break;
            case 4:
                sText = _("Egal à");
                break;
            case 5:
                sText = _("Liste de choix");
                break;
            case 6:
                sText = _("Bornes");
                break;
            case 7:
                sText = _("Absence de valeur");
                break;
        }
        options.push({ "value": iValue, text: sText })
    }

    // Select filter type 
    this.dhxComboFilterTypes.addOption(options);
    if (this.tableViewFilter.iFilterType != 0) {
        var index = this.dhxComboFilterTypes.getIndexByValue(this.tableViewFilter.iFilterType);
        this.dhxComboFilterTypes.selectOption(index, false, true);
    } else
        this.dhxComboFilterTypes.selectOption(0, false, true);

    if (this.tableViewFilter.iFilterType == 5) {
        //InitializeComboValues();			
    } else if (this.tableViewFilter.iFilterType == 6) {
        // [0;100] ou ]-INF;100] ou [0;+INF[
        var matchesValues = this.tableViewFilter.sValue.match(/[\[\]](.+);(.+)[\[\]]/);
        var matchesFloatValues = this.tableViewFilter.sFloatValue.match(/[\[\]](.+);(.+)[\[\]]/);
        sLowerBoundValue = matchesValues[1];
        sUpperBoundValue = matchesValues[2];
        if (sLowerBoundValue == "-INF")
            J("#"+this.idInputFilterLowerValue).val("");
        else
            J("#"+this.idInputFilterLowerValue).val(sLowerBoundValue);
        if (matchesFloatValues) sLowerBoundValue = matchesFloatValues[1];
        if (sUpperBoundValue == "+INF")
            J("#"+this.idInputFilterUpperValue).val("");
        else
            J("#"+this.idInputFilterUpperValue).val(sUpperBoundValue);
        if (matchesFloatValues) sUpperBoundValue = matchesFloatValues[2];
    } else if (this.tableViewFilter.iFilterType != 7) {
        J("#"+this.idInputFilterValue).val(this.tableViewFilter.sValue);
    }
    this.dhxComboFilterTypes.disable(false);

    // Calendar //
    if (this.tableViewFilter.bIsDate) {
        var rCalendarSettings = {
            sCodeLangue: this.tableViewFilter.sLangDate,
            bTime: this.tableViewFilter.bIsDateTime,
            bShowOtherMonths: true,
            bSelectOtherMonths: true,
            bShowButtonPanel: true,
            bChangeMonth: true,
            bChangeYear: true,
            sShowOn: 'both',
            sButtonImage: _url('/resources/theme/img/btn_form/calendrier.png'),
            bButtonImageOnly: true,
            bGotoCurrent: true
        }
        var sDateFormat, sDateTimeFormat;
        if (this.tableViewFilter.sDateAndTimeFormat) {
            rCalendarSettings.sDateFormat = this.tableViewFilter.sDateAndTimeFormat.substring(0, 8);
            rCalendarSettings.sTimeFormat = this.tableViewFilter.sDateAndTimeFormat.substring(9, 17);
        } else if (this.tableViewFilter.sDateFormat) {
            rCalendarSettings.sDateFormat = this.tableViewFilter.sDateFormat;
        }

        rCalendarSettings.sIdInputDate = this.idInputFilterLowerValue;
        this.lowerBoundDatepicker = new CDatePicker(rCalendarSettings);
        rCalendarSettings.sIdInputDate = this.idInputFilterUpperValue;
        this.upperBoundDatepicker = new CDatePicker(rCalendarSettings);
        rCalendarSettings.sIdInputDate = this.idInputFilterValue;
        this.filterValueDatepicker = new CDatePicker(rCalendarSettings);

        if (this.tableViewFilter.sFloatValue != "")
            this.filterValueDatepicker.setDate(floatToDate(this.tableViewFilter.sFloatValue));
        if (sLowerBoundValue && (sLowerBoundValue != "undefined"))
            this.lowerBoundDatepicker.setDate(floatToDate(sLowerBoundValue));
        if (sUpperBoundValue && (sUpperBoundValue != "undefined"))
            this.upperBoundDatepicker.setDate(floatToDate(sUpperBoundValue));

    } else {
        if (this.lowerBoundDatepicker) this.lowerBoundDatepicker.destroy();
        if (this.upperBoundDatepicker) this.upperBoundDatepicker.destroy();
        if (this.filterValueDatepicker) this.filterValueDatepicker.destroy();
    }
    if (this.tableViewFilter.bActive) {
        J("#"+this.idButtonFilterDelete).removeAttr("disabled");
    } else {
        J("#"+this.idButtonFilterDelete).attr("disabled", "disabled");
    }
}

CTableViewPopupFilter.prototype.validateColumnFilter = function () {
    var sFilterValue = "",
        sFilterFloatValue = "",
        self = this;

    // set filter type
    var iFilterType = parseInt(this.dhxComboFilterTypes.getSelectedValue());
    if (!iFilterType) {
        iFilterType = 0;
    }
    this.tableViewFilter.iFilterType = iFilterType;

    // set filter values
    if (iFilterType == 5) { //case of FilterType list
        var arrOptions = this.dhxComboValues.getChecked();
        var arrValues = [];
        for (var i = 0 ; i < arrOptions.length ; i++) {
            arrValues.push(this.dhxComboValues.getOption(arrOptions[i]).text);
        }
        this.tableViewFilter.arrOptionsChecked = arrValues;
        sFilterValue = this.tableViewFilter.getOptionsCheckedToString();
    } else if (iFilterType != 0) {
        if (iFilterType == 6) { // case of FilterType Bounds
            var sLowerBound = (J("#" + this.idInputFilterLowerValue).val() != "") ? J("#" + this.idInputFilterLowerValue).val() : "-INF",
                sUpperBound = (J("#" + this.idInputFilterUpperValue).val() != "") ? J("#" + this.idInputFilterUpperValue).val() : "+INF",
                sFirst = (sLowerBound == "-INF") ? "]" : "[",
                sLast = (sUpperBound == "+INF") ? "[" : "]",
                fLowerValue, fUpperValue;
            if (this.tableViewFilter.bIsDate) {
                if (sLowerBound != "-INF") {
                    fLowerValue = dateToFloat(this.lowerBoundDatepicker.getDate(), this.tableViewFilter.bIsDateTime);
                }
                if (sUpperBound != "+INF") {
                    fUpperValue = dateToFloat(this.upperBoundDatepicker.getDate(), this.tableViewFilter.bIsDateTime);
                }
                sFilterFloatValue = sFirst + fLowerValue + ";" + fUpperValue + sLast;
            } else {
                fLowerValue = sLowerBound;
                fUpperValue = sUpperBound;
            }
            if (fLowerValue > fUpperValue) {
                msgWarning(_("La borne supérieure renseignée doit être supérieure à la borne inférieure renseignée") + ".");
                return;
            }
            sFilterValue = sFirst + sLowerBound + ";" + sUpperBound + sLast;
        } else if (iFilterType == 7) { // case of FilterType Empty values
            sFilterValue = _("Absence de valeur");
        } else {
            sFilterValue = J("#"+this.idInputFilterValue).val();
            if ((iFilterType == 4) && (sFilterValue != "") && this.tableViewFilter.bIsDate) {
                sFilterFloatValue = "" + dateToFloat(this.filterValueDatepicker.getDate(), this.tableViewFilter.bIsDateTime);
            }
        }
    }
    this.tableViewFilter.setValue(sFilterValue);
    this.tableViewFilter.sFloatValue = sFilterFloatValue;

    // apply filter
    this.tableViewFilter.applyColumnFilter();
    this.hide();
}

CTableViewPopupFilter.prototype.deleteFilter = function () {
    J("#"+this.idInputFilterValue).val("");
    J("#"+this.idInputFilterLowerValue).val("");
    J("#"+this.idInputFilterUpperValue).val("");
    this.dhxComboFilterTypes.selectOption(0);
    this.tableViewFilter.clear();
    this.validateColumnFilter();
}

CTableViewPopupFilter.prototype.getColumnPossibleFiltersValues = function () {
    var self = this;
    this.dhxComboValues.disable(true);
    this.dhxComboValues.setComboText(_("Chargement des données..."));
    this.tableViewFilter.getColumnPossibleFiltersValues(function (aData) {
        self.reloadComboValues(aData);
    });
}

CTableViewPopupFilter.prototype.reloadComboValues = function (aData) {
    if (aData.length > 0) {
        this.dhxComboValues.disable(false);
        this.dhxComboValues.clearAll(true);
        this.dhxComboValues.addOption(aData);
        this.checkOptions();
    } else {
        this.dhxComboValues.setComboText(_("Aucune option"));
    }
}

CTableViewPopupFilter.prototype.checkOptions = function () {
    var sValue, rOption, idOption;
    for (var i = 0 ; i < this.tableViewFilter.arrOptionsChecked.length ; i++) {
        sValue = this.tableViewFilter.arrOptionsChecked[i];
        rOption = this.dhxComboValues.getOptionByLabel(sValue);
        if (rOption) {
            idOption = rOption.value;

            if (i == 0)
                this.dhxComboValues.selectOption(idOption);

            this.dhxComboValues.setChecked(idOption, true);
        }
    }
}

CTableViewPopupFilter.prototype.unload = function () {
    this.dhxPopup.unload();
}


