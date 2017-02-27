CTxMCS.attributes.CTable = (function ($) {

    CTable.Tags = ["Table"];

    var CAttribute = CTxMCS.attributes.CAttribute;

    function CTable(aSettings) {
        var self = this,
            bTranspose = aSettings.attribute.bTranspose === true;
        this._seriesType = aSettings.attribute.TableType.SeriesType;
        this.sCritType = "ctTable";

        aSettings.onBeforeFillForm = function () {
            if (bTranspose) {
                CAttribute.replaceInHtml(aSettings.criteriaArea, "definedRow", _("la colonne"));
                CAttribute.replaceInHtml(aSettings.criteriaArea, "atLeastOneRow", _("une colonne"));
                CAttribute.replaceInHtml(aSettings.criteriaArea, "column", _("la ligne"));
            }

            self.customCriterion = aSettings.criterion.TableCriterion || {};

            self.criteriaArea.find(":input[name=idSeriesType]").on("change", function () {
                var $this = $(this),
                    series = self._seriesType.find(function (s) { return s.ID === parseInt($this.val()) }),
                    $numerical = $this.parent().next().find(".mcsTableNumericalSeries"),
                    $other = $this.parent().next().find(".mcsTableOtherSeries");
                if (series.sType === "sttNumerical") {
                    if (series.Unit) CAttribute.replaceInHtml($numerical, "unit", series.Unit.sName);
                    else CAttribute.replaceInHtml($numerical, "unit", "");
                    showChildrenAndSelf($numerical);
                    hideChildrenAndSelf($other);
                } else {
                    hideChildrenAndSelf($numerical);
                    showChildrenAndSelf($other);
                }
                $this.parent().next().find(":input[name=sNumericalCritType]:not(:hidden)").trigger("change");
            }).each(function() {
                var $this = $(this);
                self._seriesType.forEach(function (s) {
                    $this.append($("<option>", {
                        value: s.ID,
                        text: s.sName
                    }));
                });
            });

            self.criteriaArea.find(".tableCriterionType").on("change", function () {
                var $this = $(this),
                    value = $(this).val(),
                    $equality = $this.siblings(".mcsTableEquality"),
                    $range = $this.siblings(".mcsTableRange");
                switch (value) {
                    case "nctEqual_To":
                        showChildrenAndSelf($equality);
                        hideChildrenAndSelf($range);
                        $this.parent().siblings(".entryHelper").hide();
                        break;
                    case "nctRange_Max":
                        hideChildrenAndSelf($equality);
                        showChildrenAndSelf($range);
                        $this.parent().siblings(".entryHelper").show();
                        break;
                }
            });

            self.criteriaArea.find(":input[name=sSubCritType]").on("change", function () {
                var $this = $(this),
                    value = $this.val(),
                    $input = $this.next("input");
                if (value === "lctAt_Least_One") {
                    $input.val(-1);
                    hideChildrenAndSelf($input);
                } else {
                    showChildrenAndSelf($input);
                    if (parseInt($input.val()) < 1)
                        $input.val(1);
                }
            });

            this.criteriaArea.find($(this.mcs.getId("#mcsTableCriterion2"))).on("change", function() {
                self.criterion.TableCriterion.TableSubCriterion2 = self.criterion.TableCriterion.TableSubCriterion2 || {};
            });

            // Set the row (or Column if transpose) type of search (iValueIndex)
            if (self.customCriterion.TableSubCriterion1) {
                var iValue = self.customCriterion.TableSubCriterion1.iValueIndex;
                if (iValue === -1) {
                    self.criteriaArea.find(":input[name=sSubCritType]").val("lctAt_Least_One");
                } else {
                    // To replace
                    self.criteriaArea.find(":input[name=sSubCritType]").val("0");
                    self.criteriaArea.find(":input[name=iValueIndex]").val(iValue + 1);
                }
            }
        };

        CTxMCS.attributes.CAttribute.call(this, aSettings);

        self.criteriaArea.find(":input[name=idSeriesType]").trigger("change");
        self.criteriaArea.find(".tableCriterionType").trigger("change");
        self.criteriaArea.find(":input[name=sSubCritType]").trigger("change");
    };

    CTable.prototype = Object.create(CAttribute.prototype);

    CTable.prototype.constructor = CTable;

    $.extend(CTable.prototype, {
        _updateCriterion: function() {
            var self = this,
                header = this._reduceform(this.criteriaArea.find("[data-name=header] :input[name=iValueIndex]")),
                subCriterion1 = this._reduceform(this.criteriaArea.find("[data-name=TableSubCriterion1] :input:not(:hidden)")),
                subCriterion2 = this._reduceform(this.criteriaArea.find("[data-name=TableSubCriterion2] :input:not(:hidden)"));

            // Convert value header to integer
            header.iValueIndex = parseInt(header.iValueIndex);
            if (header.iValueIndex > 0) header.iValueIndex--;

            function formatSubCriterion(subCriterion) {
                var seriesType = self._seriesType.find(function (s) { return s.ID === parseInt(subCriterion.idSeriesType) });
                if(!seriesType) return;
                switch (seriesType.sType) {
                    case "sttNumerical":
                        subCriterion.sLBCritType = "btInclusive";
                        subCriterion.sUBCritType = "btInclusive";
                        subCriterion.sTableSubCritType = "tsctNumericalCriterion";
                        delete subCriterion.sSearchedValue;
                        break;
                    default:
                        subCriterion.sTableSubCritType = seriesType.sType === "sttText" ? "tsctTextSearch" : "tsctUndefined";
                        delete subCriterion.sNumericalCritType;
                        delete subCriterion.fLBValue;
                        delete subCriterion.fUBValue;
                }
            }

            this.criterion.TableCriterion = this.criterion.TableCriterion || {
                iType: "tctChequerBoard",
                TableSubCriterion1: {}
            };

            $.extend(this.criterion.TableCriterion.TableSubCriterion1, header);

            $.extend(this.criterion.TableCriterion.TableSubCriterion1, subCriterion1);
            formatSubCriterion(this.criterion.TableCriterion.TableSubCriterion1);

            if (this.criteriaArea.find(this.mcs.getId("#mcsTableCriterion2")).is(":checked") === true) {
                this.criterion.TableCriterion.TableSubCriterion2 = this.criterion.TableCriterion.TableSubCriterion2 || {};
                $.extend(this.criterion.TableCriterion.TableSubCriterion2, header);
                $.extend(this.criterion.TableCriterion.TableSubCriterion2, subCriterion2);
                formatSubCriterion(this.criterion.TableCriterion.TableSubCriterion2);
            } else {
                delete this.criterion.TableCriterion.TableSubCriterion2;
            }
        },

        /**
         * @override
         * @param {} form 
         * @param {} criterion
         * @returns {} 
         */
        _fillForm: function(form, criterion) {
            // we do not need this form arg
            var criterionCopy = $.extend({}, criterion);
            CAttribute.prototype._fillForm.call(this, this.criteriaArea.find("[data-name=TableSubCriterion1]"), criterionCopy.TableSubCriterion1);
            if (criterionCopy.TableSubCriterion2) {
                CAttribute.prototype._fillForm.call(this, this.criteriaArea.find("[data-name=TableSubCriterion2]"), criterionCopy.TableSubCriterion2);
                this.criteriaArea.find($(this.mcs.getId("#mcsTableCriterion2")).prop("checked", true));
            }
        }
    });

    J.when(J.get(CTxMCS.attributes.CAttribute.path + "Table/attribute.table.html")).then(function (data) {
        CTable.contentTemplate = J(data);
        var a = CTable.contentTemplate.find("[data-name=TableSubCriterion1]").clone();
        a.attr("data-name", "TableSubCriterion2");
        CTable.contentTemplate.append(a);
    }, function (error) {
        throw new TypeError(error);
    });

    function showChildrenAndSelf(element) {
        element.find("*").andSelf().show();
    }

    function hideChildrenAndSelf(element) {
        element.find("*").andSelf().hide();
    }

    return CTable;
})(jQuery);