"use strict";
/**
 * @class : Numeric Data for one cell in a TableView -> inherits from CTableViewData
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.dhxGrid *** Mandatory ***
        aSettings.idRow *** Mandatory ***
        aSettings.idColumn *** Mandatory ***
        aSettings.sType *** Mandatory ***
        aSettings.sValue
 * @returns CTableViewDataNumeric object.
 */

var CTableViewDataNumeric = function (aSettings) {
	// privileged variable, specific to numeric 
    this.sOldMin;
    this.sOldMax;
    this.sOldMean;
    this.sMin;
    this.sMax;
    this.sMean;
	this.idUnit = 0;
	this.idOldUnit = 0;
	this.sIdsUnit = '';
	this.sNamesUnit = '';
	this.fLowerBound = null;
	this.fOldLowerBound = null;
	this.fUpperBound = null;
	this.fOldUpperBound = null;
	this.bLbInc;
	this.bUbInc;

	CTableViewData.call(this, aSettings);
	
    this.setMin = function(aMin) {
		if (aMin) this.sMin = aMin.replace('.',',');
	};
	this.setMax = function(aMax) {
	    if (aMax) this.sMax = aMax.replace('.', ',');
	};
	this.setMean = function(aMean) {
	    if (aMean) this.sMean = aMean.replace('.', ',');
	};
}

//inheritage
CTableViewDataNumeric.prototype = createObject(CTableViewData.prototype);
CTableViewDataNumeric.prototype.constructor = CTableViewDataNumeric; // Otherwise instances of CTableViewDataNumeric would have a constructor of CTableViewData

CTableViewDataNumeric.prototype.edit = function () {
    var self = this;

    var stopEditNumerics = function (aIdInput, aResult) {
        if (aIdInput == 'ok') {
            var rCell = self.dhxGrid.cells(self.idRow, self.idColumn);
            if ((aResult.min !== self.sMin) || (typeof aResult.max !== 'undefined' && (aResult.max !== self.sMax)) || (typeof aResult.mean !== 'undefined' && (aResult.mean !== self.sMean))) {
                var sNewValue = '';
                if (typeof aResult.mean !== 'undefined' && aResult.min !== '' && aResult.max !== '' && aResult.mean !== '') {
                    sNewValue = format(_("de #1 à #2 - Moyenne : #3"), [aResult.min, aResult.max, aResult.mean]);
                } else if (typeof aResult.max !== 'undefined' && aResult.min !== '' && aResult.max !== '') {
                    sNewValue = format(_("de #1 à #2"), [aResult.min, aResult.max]);
                } else if (aResult.min !== '') {
                    sNewValue = aResult.min;
                }
                self.sNewValue = sNewValue;
                rCell.setValue(sNewValue);
                self.setMin(aResult.min);
                if (typeof aResult.max !== 'undefined')
                    self.setMax(aResult.max);
                if (typeof aResult.mean !== 'undefined')
                    self.setMean(aResult.mean);
                if (sNewValue == '') {
                    self.bToDelete = true;
                } else {
                    self.bToDelete = false;
                }
                if (typeof aResult.unit !== 'undefined') {
                    self.idUnit = parseInt(aResult.unit);
                    rCell.setAttribute('idUnit', aResult.unit);
                }
                if (typeof aResult.LB !== 'undefined') {
                    self.fLowerBound = aResult.LB;
                }
                if (typeof aResult.UB !== 'undefined') {
                    self.fUpperBound = aResult.UB;
                }
                self.iStage = 2;
                self.tableView.afterEditCell(self);
            } else if (self.sMax == "null" && self.sIdsUnit.split(";").length <= 1) {
                self.sNewValue = aResult.min;
                rCell.setValue(self.sNewValue);
                self.iStage = 2;
            }
        }
        self.bEdited = false;
    }

    if (this.sMax == "null" && this.sIdsUnit.split(";").length <= 1) {
        this.doEditInput(stopEditNumerics);
    } else {
        this.doEditQuery(stopEditNumerics);
    }
    this.bEdited = true;
}

CTableViewDataNumeric.prototype.doEditQuery = function (aEndEditCallBack) {
    // init settings for popup edition
    var settingsQuery = {
        // query
        sCaption: _("Formulaire de saisie"),
        sOk: _("Valider"),
        iWidth: 300,
        // query numerics
        sMin: this.sMin,
        idUnit: this.idUnit,
        idsUnit: this.sIdsUnit,
        namesUnit: this.sNamesUnit,
        lowerBound: this.fLowerBound,
        upperBound: this.fUpperBound,
        lbInc: this.bLbInc,
        ubInc: this.bUbInc
    }
    // Call popup edition specific to Range numeric with mean
    if (this.sType === "customNumRangeMean") {
        settingsQuery.sMax = this.sMax;
        settingsQuery.sMean = this.sMean;
    }
    var editWindow = new CQueryNumerics(settingsQuery, aEndEditCallBack);
}

CTableViewDataNumeric.prototype.doEditInput = function (aEndEditCallBack) {
    var self = this,
        rCell = this.dhxGrid.cells(this.idRow, this.idColumn),
        idInput = "input_customNum_" + this.idRow + "_" + this.idColumn,
        sValue = rCell.getValue();

    // Init edition
    rCell.setValue("<input id=" + idInput + " type='text' style='width:100%;' value='" + sValue + "''>");
    J("#" + idInput).focus();
    // Get position of input
    var input = document.getElementById(idInput),
        x = getAbsoluteLeft(input),
        y = getAbsoluteTop(input),
        w = input.offsetWidth,
        h = input.offsetHeight;

    this.dhxPopupInput = new dhtmlXPopup({ mode: "right" });

    var validNumericValue = function (aValue) {
        var fValue,
            bValid = true;
        if (aValue !== "") {
            if (isNumeric(aValue)) {
                fValue = parseFloat(aValue);
                if ((self.fLowerBound !== null) && ((self.bLbInc && (self.fLowerBound > fValue)) || (!self.bLbInc && (self.fLowerBound >= fValue)))) {
                    bValid = false;
                    self.dhxPopupInput.attachHTML("<span class='textError'>" + format(_("La valeur doit être supérieure à la borne inférieur : #1."), [self.fLowerBound]) + "</span>");
                }
                if ((self.fUpperBound !== null) && ((self.bUbInc && (self.fUpperBound < fValue)) || (!self.bUbInc && (self.fUpperBound <= fValue)))) {
                    bValid = false;
                    self.dhxPopupInput.attachHTML("<span class='textError'>" + format(_("La valeur doit être inférieure à la borne supérieur : #1."), [self.fUpperBound]) + "</span>");
                }
            } else {
                bValid = false;
                self.dhxPopupInput.attachHTML("<span class='textError'>" + _("La valeur doit être une valeur numérique correcte.") + "</span>");
            }
        }
        return bValid;
    }

    // Event for Enter Key press
    J("#" + idInput).keyup(function (e) {
        var code = e.keyCode || e.which;
        if (code == 13) { //Enter keycode
            var sValue = J(this).val();
            if (validNumericValue(sValue)) {
                self.dhxPopupInput.hide();
                self.dhxGrid.detachEvent(self.idEvRS);
                self.idEvRS = null;
                aEndEditCallBack('ok', { min: sValue });
            } else {
                self.dhxPopupInput.show(x, y, w, h);
            }
        }
    });

    // Attach event to stop edition
    this.idEvRS = this.dhxGrid.attachEvent("onBeforeSelect", function (aIdRow, aIdOldRow) {
        // close edition if click outside of cell
        if (aIdRow != self.idRow || this.cell._cellIndex != self.idColumn) {
            var sValue = J("#" + idInput).val();
            if (validNumericValue(sValue)) {
                self.dhxPopupInput.hide();
                self.dhxGrid.detachEvent(self.idEvRS);
                self.idEvRS = null;
                aEndEditCallBack('ok', { min: sValue });
            } else {
                self.dhxPopupInput.show(x, y, w, h);
                J("#" + idInput).focus();
            }
        }
        return true;
    });
}

CTableViewDataNumeric.prototype.refreshDataFromAttributesCell = function (aValue) {
    CTableViewData.prototype.refreshDataFromAttributesCell.call(this, aValue);

    this.initNumericValue();
    var dhxCell = this.dhxGrid.cells(this.idRow, this.idColumn);
    if (dhxCell.getAttribute('idUnit')) {
        this.idUnit = parseInt(dhxCell.getAttribute('idUnit'));
        this.idOldUnit = this.idUnit;
        this.sIdsUnit = dhxCell.getAttribute('idsUnit');
        this.sNamesUnit = dhxCell.getAttribute('namesUnit');
    }
    if (typeof dhxCell.getAttribute('lowerBound') != 'undefined') {
        this.fLowerBound = parseFloat(dhxCell.getAttribute('lowerBound'));
        this.fOldLowerBound = this.fLowerBound;
        this.bLbInc = (dhxCell.getAttribute('lbInc') == '-1') ? true : false;
    }
    if (typeof dhxCell.getAttribute('upperBound') != 'undefined') {
        this.fUpperBound = parseFloat(dhxCell.getAttribute('upperBound'));
        this.fOldUpperBound = this.fUpperBound;
        this.bUbInc = (dhxCell.getAttribute('ubInc') == '-1') ? true : false;
    }
}

CTableViewDataNumeric.prototype.initNumericValue = function () {
    var self = this;
    J.ajax({
        url: sPathFileTableViewAjaxASP,
        async:false,
        cache:false,
        dataType:"html",
        data:{
            sFunctionName: "GetCellNumericalValue",
            idTable: self.tableView.idTable,
            idRow: self.idRow,
            idColumn: self.idColumn
        },
        success:function(data){
            var arrResult = data.split('|');
            if(arrResult[0] === 'ok') {
                self.sMin = arrResult[1];
                self.sMax = arrResult[2];
                self.sMean = arrResult[3];
                self.sOldMin = self.sMin; self.sOldMax = self.sMax; self.sOldMean = self.sMean;
            } else {
                msgError(arrResult[0]);
            }
        }	
    });
}