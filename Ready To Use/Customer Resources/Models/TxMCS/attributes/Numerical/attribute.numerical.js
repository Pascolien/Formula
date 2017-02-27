CTxMCS.attributes.CNumerical = (function ($) {

    CNumerical.Tags = ["Date", "SingleValue", "RangeOfValues", "Range+MeanValue"];

    var CAttribute = CTxMCS.attributes.CAttribute;

    function CNumerical(aSettings) {
        var self = this;
        this.isDate = aSettings.attribute.sType === "Date" || aSettings.attribute.sType === "DateAndTime";
        this.isDateAndTime = aSettings.attribute.sType === "DateAndTime";

        this.criterion = aSettings.criterion || {};
            
        this.criterion.NumericalCriterion = aSettings.criterion.NumericalCriterion || {
            sLBCritType: "btInclusive",
            sUBCritType: "btInclusive",
            fLBFzness: 0,
            fUBFzness: 0
        };
        if (this.isDate && !this.criterion.NumericalCriterion.sLBDateCritType)
            this.criterion.NumericalCriterion.sLBDateCritType = "dctFixedDate";
        if (this.isDate && !this.criterion.NumericalCriterion.sUBDateCritType)
            this.criterion.NumericalCriterion.sUBDateCritType = "dctFixedDate";

        aSettings.onBeforeFillForm = function () {
            self.customCriterion = aSettings.criterion.NumericalCriterion || {};
            if (self.customCriterion.fLBValue && self.isDate) self.customCriterion.fLBValue = floatToDateStr(self.customCriterion.fLBValue);
            if (self.customCriterion.fUBValue && self.isDate) self.customCriterion.fUBValue = floatToDateStr(self.customCriterion.fUBValue);

            /**
             * Getting attribute Min and Max values
             */
            $.ajax({
                url: CTxMCS.wrapper,
                data: {
                    sFunctionName: "OnDisplayNumericalAttribute",
                    idAttribute: aSettings.attribute.ID
                },
                async: false,
                success: function (result) {
                    result = result.split("|");
                    if (result[0] !== sOk) {
                        msgDevError(result[0]);
                        return;
                    }
                    self.attributeInfo = JSON.parse(result[1]);
                    self.attributeInfo.fMin = self.attributeInfo.fMin || (self.isDate ? parseInt(dateToFloat(new Date(), self.isDateAndTime)) - 100 : 0);
                    self.attributeInfo.fMax = self.attributeInfo.fMax || (self.isDate ? parseInt(dateToFloat(new Date(), self.isDateAndTime)) + 100 : 100);
                    CAttribute.replaceInHtml(aSettings.criteriaArea, "min", self.isDate ? floatToDateStr(self.attributeInfo.fMin) : self.attributeInfo.fMin);
                    CAttribute.replaceInHtml(aSettings.criteriaArea, "max", self.isDate ? floatToDateStr(self.attributeInfo.fMax) : self.attributeInfo.fMax);
                }
            });

            function updateInput(id, value) {
                if (self.isDate) value = floatToDateStr(value, self.isDateAndTime);
                $(self.mcs.getId("#" + id)).val(value).trigger("keyup");
            }

            function convertInputValue(value) {
                if (self.isDate) {
                    value = strToDate(value, self.isDateAndTime);
                    value = dateToFloat(value, self.isDateAndTime);
                }
                return value;
            }

            /**
             * singleValue
             */
            {
                var singleSlider = $(this.mcs.getId("#idMCSNumericalEqualitySlider")).slider({
                    value: (self.attributeInfo.fMin + self.attributeInfo.fMax) / 2,
                    min: self.attributeInfo.fMin,
                    max: self.attributeInfo.fMax,
                    slide: function (event, ui) {
                        updateInput("idMCSNumericalTargetValue", ui.value);
                    }
                });

                $(this.mcs.getId("#idMCSNumericalTargetValue")).on("input change", function () {
                    var value = $(this).val().replace(",", ".");
                    if (value === "") return;
                    singleSlider.slider("value", convertInputValue(value));
                }).trigger("input");
            }

            /* RangeOfValue */
            {
                var offset = parseInt((self.attributeInfo.fMax - self.attributeInfo.fMin) / 10);
                var rangeSlider = $(this.mcs.getId("#idMCSNumericalRangeSlider")).slider({
                    range: true,
                    values: [self.attributeInfo.fMin + offset, self.attributeInfo.fMax - offset],
                    min: self.attributeInfo.fMin,
                    max: self.attributeInfo.fMax,
                    slide: function (event, ui) {
                        updateInput("idMCSNumericalMinValue", ui.values[0]);
                        updateInput("idMCSNumericalMaxValue", ui.values[1]);
                    }
                });

                $(this.mcs.getId("#idMCSNumericalMinValue")).on("input change", function () {
                    var values = rangeSlider.slider("values"),
                        value = $(this).val().replace(",", ".");
                    if (value === "") return;
                    values[0] = convertInputValue(value);
                    rangeSlider.slider("values", values);
                });

                $(this.mcs.getId("#idMCSNumericalMaxValue")).on("input change", function () {
                    var values = rangeSlider.slider("values"),
                        value = $(this).val().replace(",", ".");
                    values[1] = convertInputValue(value);
                    rangeSlider.slider("values", values);
                });
            }

            /* Handle criteria type change */
            $(this.mcs.getId("#idSelectMcsNumerical")).on("change", function () {
                var value = $(this).val();
                $(this).closest("form").trigger("reset");
                $(this).val(value);
                var $equality = self.criteriaArea.find(".mcsNumericalEquality"),
                    $range = self.criteriaArea.find(".mcsNumericalRange");
                switch (value) {
                    case "nctEqual_To":
                        $equality.show();
                        $range.hide();
                        break;
                    case "nctRange_Max":
                        $equality.hide();
                        $range.show();
                        break;
                }
            });
            
            // Manage date attributes
            if (self.isDate) {
                ["idMCSNumericalTargetValue", "idMCSNumericalMinValue", "idMCSNumericalMaxValue"].forEach(function(id) {
                    id = self.mcs.getId(id);
                    var $this = $("#" + id);
                    $this.attr("type", "text");
                    var cDatePicker = new CDatePicker({
                        sIdInputDate: id,
                        bTime: self.isDateAndTime,
                        fMinDate: floatToDate(self.attributeInfo.fMin),
                        fMaxDate: floatToDate(self.attributeInfo.fMax)
                    });
                });
            }
        };

        CAttribute.call(this, aSettings);
        this.sCritType = "ctNumerical";

        CAttribute.replaceInHtml(this.criteriaArea, "unit", aSettings.attribute.Unit ? aSettings.attribute.Unit.sName : "");

    };

    CNumerical.prototype = Object.create(CAttribute.prototype);

    CNumerical.prototype.constructor = CNumerical;

    $.extend(CNumerical.prototype, {
        _updateCriterion: function () {
            this.criterion.NumericalCriterion = this.criterion.NumericalCriterion || {};
            $.extend(this.criterion.NumericalCriterion, this._reduceform(this.criteriaArea.find("form > div div:not(:hidden) :input")));

            if (this.criterion.NumericalCriterion.fLBValue) {
                if (this.isDate && typeof this.criterion.NumericalCriterion.fLBValue === "string") {
                    this.criterion.NumericalCriterion.fLBValue = dateToFloat(strToDate(this.criterion.NumericalCriterion.fLBValue, this.isDateAndTime));
                }
                this.criterion.NumericalCriterion.fLBValue = parseFloat(this.criterion.NumericalCriterion.fLBValue);
            }
            if (this.criterion.NumericalCriterion.fUBValue) {
                if (this.isDate && typeof this.criterion.NumericalCriterion.fUBValue === "string") {
                    this.criterion.NumericalCriterion.fUBValue = dateToFloat(strToDate(this.criterion.NumericalCriterion.fUBValue, this.isDateAndTime));
                }
                this.criterion.NumericalCriterion.fUBValue = parseFloat(this.criterion.NumericalCriterion.fUBValue);
            }
        }
    });

    $.when($.get(CAttribute.path + "Numerical/attribute.numerical.html")).then(function (data) {
        CNumerical.contentTemplate = $(data);
    }, function (error) {
        throw new TypeError(error);
    });

    return CNumerical;
})(jQuery);