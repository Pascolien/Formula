var CQueryNumerics = function (aSettings, aCallBackFunction, aDummyData) {
    // if unique value : sMax & sMean = 'null', if range : sMean = 'null'
    // if sMin, sMax or sMean exist but have no value, its value must be equal to : '0'
    this.sMin = getValue(aSettings.sMin, '0');
    this.sMax = getValue(aSettings.sMax, 'null');
    this.sMean = getValue(aSettings.sMean, 'null');
    this.idUnit = getValue(aSettings.idUnit, 0);
    this.sIdsUnit = getValue(aSettings.idsUnit, "");
    this.sNamesUnit = getValue(aSettings.namesUnit, "");
    this.fLowerBound = getValue(aSettings.lowerBound, null);
    this.fUpperBound = getValue(aSettings.upperBound, null);
    this.bLbInc = getValue(aSettings.lbInc, true);
    this.bUbInc = getValue(aSettings.ubInc, true);

    this.iHeight = 115;
    this.sUnitHtml = '';
    this.sMinHtml = '';
    this.sMaxHtml = '';
    this.sMeanHtml = '';
    this.dhxPopupMin;
    this.dhxPopupMax;
    this.dhxPopupMean;

    if (this.idUnit > 0)
        this.iHeight += 40;
    if (this.sMax != "null")
        this.iHeight += 40;
    if (this.sMean != "null")
        this.iHeight += 40;

    aSettings.iHeight = this.iHeight;
    CQuery.call(this, aSettings, aCallBackFunction, aDummyData);
}

//inheritage
CQueryNumerics.prototype = createObject(CQuery.prototype);
CQueryNumerics.prototype.constructor = CQueryNumerics;

CQueryNumerics.prototype.updateHTML = function () {
    if (this.idUnit > 0) {
        this.sUnitHtml = '<div class="rowFrom">' +
                        '<label class="col1">' + _("Unité") + ' :&nbsp;&nbsp;</label>' +
                        '<span class="col2"><select id="unitSelect">';
        var arrIdsUnits = this.sIdsUnit.split(';');
        var arrNamesUnits = this.sNamesUnit.split(';');
        for (var i = arrIdsUnits.length - 1; i >= 0; i--) {
            this.sUnitHtml += '<option value="' + arrIdsUnits[i] + '" ' + ((arrIdsUnits[i] == this.idUnit) ? 'selected' : '') + '>' + arrNamesUnits[i] + '</option>';
        }
        this.sUnitHtml += '</select></span>' +
                    '</div>';
    }
    if (this.sMax != "null") {
        this.sMaxHtml = '<div class="rowFrom">' +
                            '<label class="col1">Max :&nbsp;&nbsp;</label>' +
                            '<span class="col2"><input name="max" type="text" id="maxInput" size="10" value="' + this.sMax + '"></span>' +
                        '</div>';
        this.dhxPopupMax = new dhtmlXPopup({ mode: "right" });
    }
    if (this.sMean != "null") {
        this.sMeanHtml = '<div class="rowFrom">' +
                            '<label class="col1">' + _("Moyenne") + ' :&nbsp;&nbsp;</label>' +
                            '<span class="col2"><input name="mean" type="text" id="meanInput" size="10" value="' + this.sMean + '"></span>' +
                        '</div>';
        this.dhxPopupMean = new dhtmlXPopup({ mode: "right" });
    }

    this.sMinHtml = '<div class="rowFrom">' +
                        '<label class="col1">Min :&nbsp;&nbsp;</label>' +
                        '<span class="col2"><input name="min" type="text" id="minInput" size="10" value="' + this.sMin + '"></span>' +
                    '</div>';
    this.dhxPopupMin = new dhtmlXPopup({ mode: "right" });

    this.sHtml = this.sMinHtml + this.sMaxHtml + this.sMeanHtml + this.sUnitHtml;
}

CQueryNumerics.prototype.updateEvents = function () {
    var self = this;

    self.checkValueValidity(); // init prop disable of input

    J("#minInput").keyup(function () {
        self.checkValueValidity();
    });
    J("#maxInput").keyup(function () {
        self.checkValueValidity();
    });
    J("#meanInput").keyup(function () {
        self.checkValueValidity();
    });

    J("#unitSelect").change(function () {
        // conversion of value in regards of unit
        J.ajax({
            url: _url('/temp_resources/models/TxTableView/TxTableViewAjax.asp'),
            async: false,
            cache: false,
            dataType: "html",
            data: {
                sFunctionName: "convertUnit",
                idSrcUnit: self.idUnit,
                idDestUnit: J("#unitSelect").val(),
                minValue: J("#minInput").val(),
                maxValue: (self.sMax == "null") ? 'null' : J("#maxInput").val(),
                meanValue: (self.sMean == "null") ? 'null' : J("#meanInput").val(),
                LB: (self.fLowerBound == null) ? 'null' : ("" + self.fLowerBound).replace('.', ','),
                UB: (self.fUpperBound == null) ? 'null' : ("" + self.fUpperBound).replace('.', ',')
            },
            success: function (data) {
                var arrResult = data.split('|');
                if (arrResult[0] == 'ok') {
                    if (arrResult[1] != 'null') {
                        J("#minInput").val(arrResult[1]);
                    }
                    if (arrResult[2] != 'null') {
                        J("#maxInput").val(arrResult[2]);
                    }
                    if (arrResult[3] != 'null') {
                        J("#meanInput").val(arrResult[3]);
                    }
                    self.idUnit = J("#unitSelect").val();
                    if (arrResult[4] != 'null') {
                        self.fLowerBound = parseFloat(arrResult[4].replace(",", "."));
                    }
                    if (arrResult[5] != 'null') {
                        self.fUpperBound = parseFloat(arrResult[5].replace(",", "."));
                    }
                } else {
                    msgError(arrResult[0]);
                }
            }
        });
    });
}

CQueryNumerics.prototype.onClick = function (aInput) {
    if ((aInput.id == 'cancel') || ((aInput.id == 'ok') && this.checkValueValidity())) {
        this.valueReturned = {
            min: J("#minInput").val()
        }
        if (this.sMax != 'null') {
            this.valueReturned.max = J("#maxInput").val();
        }
        if (this.sMean != 'null') {
            this.valueReturned.mean = J("#meanInput").val();
        }
        if (J("#unitSelect")) {
            this.valueReturned.unit = J("#unitSelect").val();
        }
        if (this.fLowerBound != null) {
            this.valueReturned.LB = this.fLowerBound;
        }
        if (this.fUpperBound != null) {
            this.valueReturned.UB = this.fUpperBound;
        }
        CQuery.prototype.onClick.call(this, aInput);
        // close popups of validation if any is opened
        this.dhxPopupMin.hide();
        if (this.dhxPopupMax) this.dhxPopupMax.hide();
        if (this.dhxPopupMean) this.dhxPopupMean.hide();
    }
}

CQueryNumerics.prototype.checkValueValidity = function () {
    J("#ok").prop('disabled', true);
    var bIsValidMin = true;
    var bIsValidMax = true;
    var bIsValidMean = true;
    var maxValue = (this.sMax == "null") ? 'null' : parseFloat(J("#maxInput").val().replace(",", ".")),
        meanValue = (this.sMean == "null") ? 'null' : parseFloat(J("#meanInput").val().replace(",", "."));
    if (!(J("#minInput").val() == '' && (maxValue == 'null' || (maxValue != 'null' && J("#maxInput").val() == '')) && (meanValue == 'null' || (meanValue != 'null' && J("#meanInput").val() == '')))) {
        var minValue = parseFloat(J("#minInput").val().replace(",", "."));
        if (this.fLowerBound != null) {
            if ((this.bLbInc && (this.fLowerBound <= minValue)) || (!this.bLbInc && (this.fLowerBound < minValue))) {
                // valid
                this.dhxPopupMin.hide();
            } else {
                // invalid
                var input = document.getElementById('minInput'),
                    x = getAbsoluteLeft(input),
                    y = getAbsoluteTop(input),
                    w = input.offsetWidth,
                    h = input.offsetHeight;
                this.dhxPopupMin.attachHTML("<span class='textPopupValidation'>" + format(_("La valeur doit être supérieure à la borne inférieur : #1."), [this.fLowerBound]) + "</span>");
                this.dhxPopupMin.show(x, y,w,h);
                bIsValidMin = false;
            }
        }
        if (this.fUpperBound != null) {
            var currentValue = minValue;
            var currentInput = document.getElementById('minInput');
            if (maxValue != 'null') {
                currentValue = maxValue;
                currentInput = document.getElementById('maxInput');
            }
            if ((this.bUbInc && (this.fUpperBound >= currentValue)) || (!this.bUbInc && (this.fUpperBound > currentValue))) {
                // valid
                if (maxValue != 'null') 
                    this.dhxPopupMax.hide();
                else
                    this.dhxPopupMin.hide();
            } else {
                // invalid
                var x = getAbsoluteLeft(currentInput),
                    y = getAbsoluteTop(currentInput),
                    w = currentInput.offsetWidth,
                    h = currentInput.offsetHeight,
                    sCurrentHtml = "<span class='textPopupValidation'>" + format(_("La valeur doit être inférieure à la borne supérieur : #1."), [this.fUpperBound]) + "</span>";

                if (maxValue != 'null') {
                    this.dhxPopupMax.attachHTML(sCurrentHtml);
                    this.dhxPopupMax.show(x, y, w, h);
                    bIsValidMax = false;
                } else {
                    this.dhxPopupMin.attachHTML(sCurrentHtml);
                    this.dhxPopupMin.show(x, y, w, h);
                    bIsValidMin = false;
                }  
            }
        }
        if ((maxValue != 'null') && minValue <= maxValue) {
            // valid
            if (bIsValidMin) { // if there is no another error on Min Input
                this.dhxPopupMin.hide();
            }
            if (bIsValidMax) { // if there is no another error on Max Input
                this.dhxPopupMax.hide();
            }
        } else if (maxValue != 'null') {
            // invalid
            var input = document.getElementById('minInput'),
                    x = getAbsoluteLeft(input),
                    y = getAbsoluteTop(input),
                    w = input.offsetWidth,
                    h = input.offsetHeight;
            this.dhxPopupMin.attachHTML("<span class='textPopupValidation'>" + _("La valeur doit être inférieure à la valeur maximale renseignée.") + "</span>");
            this.dhxPopupMin.show(x, y, w, h);
            input = document.getElementById('maxInput');
            x = getAbsoluteLeft(input);
            y = getAbsoluteTop(input);
            w = input.offsetWidth;
            h = input.offsetHeight;
            this.dhxPopupMax.attachHTML("<span class='textPopupValidation'>" + _("La valeur doit être supérieure à la valeur minimale renseignée.") + "</span>");
            this.dhxPopupMax.show(x, y, w, h);
            bIsValidMin = false;
        }
        if ((meanValue != 'null') && ((meanValue >= minValue) && (meanValue <= maxValue))) {
            // valid 
            this.dhxPopupMean.hide();
        } else if (meanValue != 'null') {
            //invalid
            var input = document.getElementById('meanInput'),
                x = getAbsoluteLeft(input),
                y = getAbsoluteTop(input),
                w = input.offsetWidth,
                h = input.offsetHeight,
                sNewHtml;
            
            if (meanValue < minValue) {
                sNewHtml = _("La valeur doit être supérieure à la valeur minimale renseignée.");
            } else if (meanValue > maxValue) {
                sNewHtml = _("La valeur doit être inférieure à la valeur maximale renseignée.");
            } else
                sNewHtml = _("Les valeurs des champs 'Min' et 'Max' doivent être renseignées.");
            this.dhxPopupMean.attachHTML("<span class='textPopupValidation'>" + sNewHtml + "</span>");
            this.dhxPopupMean.show(x, y, w, h);
            bIsValidMean = false;
        }
        // if a field is empty but not the others...
        if (maxValue != 'null' && J("#minInput").val() == '') {
            var input = document.getElementById('minInput'),
                    x = getAbsoluteLeft(input),
                    y = getAbsoluteTop(input),
                    w = input.offsetWidth,
                    h = input.offsetHeight;
            this.dhxPopupMin.attachHTML("<span class='textPopupValidation'>" + _("La valeur du champ ne peut pas être vide.") + "</span>");
            this.dhxPopupMin.show(x, y, w, h);
            bIsValidMin = false;
        }
        if (maxValue != 'null' && J("#maxInput").val() == '') {
            var input = document.getElementById('maxInput'),
                    x = getAbsoluteLeft(input),
                    y = getAbsoluteTop(input),
                    w = input.offsetWidth,
                    h = input.offsetHeight;
            this.dhxPopupMax.attachHTML("<span class='textPopupValidation'>" + _("La valeur du champ ne peut pas être vide.") + "</span>");
            this.dhxPopupMax.show(x, y, w, h);
            bIsValidMax = false;
        }
        if (meanValue != 'null' && J("#meanInput").val() == '') {
            var inpMinVal = J("#minInput").val();
            var inpMaxVal = J("#maxInput").val();
            if (inpMinVal !== "" && inpMaxVal !== "") {
                J("#meanInput").val((parseFloat(inpMinVal) + parseFloat(inpMaxVal)) / 2);
                bIsValidMean = true;
            } else {
            var input = document.getElementById('meanInput'),
                x = getAbsoluteLeft(input),
                y = getAbsoluteTop(input),
                w = input.offsetWidth,
                h = input.offsetHeight;
            this.dhxPopupMean.attachHTML("<span class='textPopupValidation'>" + _("Les valeurs des champs 'Min' et 'Max' doivent être renseignées.") + "</span>");
            bIsValidMean = false;
        }
        }
    }
    if (bIsValidMin) { // if there is no another error on Min Input
        this.dhxPopupMin.hide();
    }
    if (maxValue != 'null' && bIsValidMax) { // if there is no another error on Max Input
        this.dhxPopupMax.hide();
    }
    if (meanValue != 'null' && bIsValidMean) { // if there is no another error on Mean Input
        this.dhxPopupMean.hide();
    }
    if (bIsValidMin && bIsValidMax && bIsValidMean) J("#ok").prop('disabled', false);
    return (bIsValidMin && bIsValidMax && bIsValidMean);
}