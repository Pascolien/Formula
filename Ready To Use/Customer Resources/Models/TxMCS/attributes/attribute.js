CTxMCS.attributes.CAttribute = (function ($) {

    CAttribute.path = CTxMCS.modelPath + "attributes/";

    function CAttribute(aSettings) {
        var self = this;
        this.attribute = aSettings.attribute;
        this.criteriaArea = aSettings.bSilent === true ? aSettings.criteriaArea.clone() : aSettings.criteriaArea;
        this.mcs = aSettings.mcs;
        this.tabbar = aSettings.criteriaArea.closest("#" + this.mcs.getId("idMCScriteriaTabbar"));
        this.path = CTxMCS.modelPath + "attributes/";

        this.criteriaArea.empty();

        this.criterion = aSettings.criterion || {};

        function appendChild(parent, child) {
            parent.append(self.mcs.changeHtmlId(child));
        }


        var header = CAttribute.headerTemplate.clone();
        if (this.attribute.header) {
            header.find("div:first").html(this.attribute.header);
        }
        var content = CTxMCS.attributes[this.toString()].contentTemplate.clone();
        var form = J("<form></form>");

        form.append(content);
        header.append(form);

        appendChild(this.criteriaArea, header);
        CAttribute.replaceInHtml(this.criteriaArea, "attributeName", '"' + this.attribute.sName + '"');
        CAttribute.replaceInHtml(this.criteriaArea, "attributeTypeLabel", this.attribute.sTypeLabel);

        //form.on("keyup", "input[type=text]", function() { self._onChange(); });
        form.on("change keyup", ":input", function () {
            self._onChange();
        }).on("submit", function (e) {
            e.preventDefault();
        });
        if (aSettings.onBeforeFillForm && typeof aSettings.onBeforeFillForm === "function")
            aSettings.onBeforeFillForm();
        this._fillForm(this.criteriaArea, this.customCriterion || this.criterion);
        if (aSettings.bSilent === true) {
            this._onChange();
        }
    }

    CAttribute.prototype = {
        toString: function () {
            return this.constructor.name || this.constructor.toString().match(/^function\s*([^\s(]+)/)[1];;
        },

        _onChange: function () {
            $.extend(this.criterion, {
                sCritType: this.sCritType,
                ID_Att: this.attribute.ID,
                sDataTreatment: "dtSpecificValue",
                bSelection: true
            });
            if (this.criterion.PreselectionCriterion)
                this.criterion.PreselectionCriterion.bSelection = true;
            this._updateCriterion();
            this.mcs.onCriterionChange(this.attribute);
            this.mcs.saveCriterion(this);
        },
        /** 
         * @virtual 
         */
        _updateCriterion: function () {
            $.extend(this.criterion, this._reduceform(this.criteriaArea.find("form")));
        },

        /**
         * @ protected virtual method
         * @param {} jQuery form or div containing inputs 
         * @returns {} 
         */
        _reduceform: function (form) {
            return form.serializeArray().reduce(function (prev, cur) {
                prev[cur.name] = cur.value;
                return prev;
            }, {});
        },

        /**
         * @ protected method: filling form criterion
         * @param {} criterion 
         * @returns {} 
         */
        _fillForm: function (form, criterion) {
            if (!criterion) return;
            var self = this,
                c = $.extend({}, criterion),
                keys = Object.keys(c);
            if (keys.length === 0) return;
            var serializedCriterion = Object.keys(c).map(function (name) {
                return { name: name, value: c[name] };
            });
            serializedCriterion.forEach(function (pair) {
                var element = form.find('[name="' + pair.name + '"]'),
                    type = element.attr("type");

                if (!element) return;

                switch (type) {
                    case "checkbox":
                        element.attr("checked", "checked");
                        break;
                    case "radio":
                        element.filter('[value="' + pair.value + '"]').attr("checked", "checked");
                        break;
                    default:
                        element.each(function () {
                            $(this).val(pair.value);
                        });
                }
                if (pair.value || pair.value !== "") element.trigger("change");
            });
        }
    }

    CAttribute.replaceInHtml = function (aHtmlInput, aSourceText, aTargetText) {
        aHtmlInput.find("[data-replace='" + aSourceText + "']").each(function () {
            $(this).text(aTargetText);
        });
    }

    $.when($.get(CAttribute.path + "header.html")).then(function (data) {
        CAttribute.headerTemplate = $(data);
    });

    return CAttribute;
})(jQuery);