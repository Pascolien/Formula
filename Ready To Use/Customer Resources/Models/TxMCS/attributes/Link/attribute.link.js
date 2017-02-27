CTxMCS.attributes.CLink = (function ($) {

    CLink.Tags = ["Link", "DirectLink", "InverseLink", "BidirectionalLink", "Enumeration"];

    function CLink(aSettings) {
        var self = this;

        this.sCritType = (aSettings.attribute.sType === "Enumeration") ? "ctEnumeration" : "ctLink";

        aSettings.onBeforeFillForm = function () {
            self.customCriterion = aSettings.criterion;
            if (self.customCriterion.PreselectionCriterion) {
                self.customCriterion.sPreselectionType = self.customCriterion.PreselectionCriterion.sPreselectionType;
            }

            // Don't need interface in silent mode :)
            if (aSettings.bSilent === true) return;

            var sPreselection;
            if (self.customCriterion.PreselectionCriterion) {
                sPreselection = aSettings.criterion.PreselectionCriterion.sPreselection;
            }

            if (!self.attribute.Associativity) {
                var idsToCheck = sPreselection ? sPreselection.join(";") : "",
                    idDivTree = self.mcs.getId("idDivMCSLinkTree"),
                    $divTree = $("#" + idDivTree);

                self.tree = new CTreeObject({
                    sIdDivTree: idDivTree,
                    sIdDivToolbar: self.mcs.getId("idDivMCSLinkTreeToolbar"),
                    idOT: (self.attribute.LinkType) ? self.attribute.LinkType.ID_OT_Dest : self.attribute.ID,
                    sCheckType: ctCheckboxes,
                    bFolderCheckable: false,
                    sIdsChecked: idsToCheck,
                    onCheck: function () {
                        self.criterion.PreselectionCriterion.sPreselection = self.tree.getCheckedIds().split(";");
                        self._onChange();
                    }
                });

                var toolbar = self.tree.toolbar;
                toolbar.addButton({
                    iPos: 5, sId: "btnDisplayMCS", iBtnType: tbtSimple, sHint: _("Lancer une selection multicritère"), sImgEnabled: "../btn_titre/module_mcs-16.png"
                });

                if (!self.customCriterion.PreselectionCriterion || !self.customCriterion.PreselectionCriterion.sPreselectionType || self.customCriterion.PreselectionCriterion.sPreselectionType == "ptFullOT") {
                    //self.tree.checkAll();
                    self.tree.lock(true);
                    $divTree.addClass("readOnly");
                }

                toolbar.attachEvent("onClick", function (aIdBtn) {
                    if (aIdBtn === "btnDisplayMCS") {
                        var sDivElement = self.mcs.getId("idDivLinkIncludedMCS");
                        var txMCSManager = new CTxMCSManager({
                            idObjectType: (self.attribute.LinkType) ? self.attribute.LinkType.ID_OT_Dest : self.attribute.ID,
                            sIdDivElement: sDivElement,
                            bInternal: true
                        }, function (aValidated, aObjects, aDummyData) {
                            // TODO check and linearize tree objects
                            if (aObjects && Array.isArray(aObjects)) {
                                aObjects.map(function (aObject) {
                                    return aObject.ID;
                                }).forEach(function (txID) {
                                    self.tree.addCheckedNode(txID);
                                    var idNode = self.tree.getIdFromTxId(txID);
                                    self.tree.setCheck(idNode);
                                });
                                if (aObjects.length > 0) {
                                    self.tree.switchToLinearView();
                                }
                            }
                            J(sDivElement).empty();
                        });
                        return;
                    }
                });

                self.criteriaArea.find(":input[name=sPreselectionType]").on("change", function () {
                    if ($(this).val() === "ptFullOT") {
                        self.tree.unCheckAll();
                        self.tree.lock(true);
                        $divTree.addClass("readOnly");
                        self.customCriterion.PreselectionCriterion.sPreselectionType = "ptFullOT";
                    } else {
                        self.tree.lock(false);
                        self.tree.unCheckAll();
                        $divTree.removeClass("readOnly");
                        self.customCriterion.PreselectionCriterion.sPreselectionType = "ptManual_Preselection";
                        if (self.criterion.PreselectionCriterion.sPreselection && self.criterion.PreselectionCriterion.sPreselection.length > 0) {
                            self.criterion.PreselectionCriterion.sPreselection.forEach(function (id) {
                                self.tree.addCheckedNode(id);
                                var idNode = self.tree.getIdFromTxId(id);
                                self.tree.setCheck(idNode);
                            });
                        }
                    }
                });
            } else {
                self.criteriaArea.find(":input[name=sPreselectionType]").prop("disabled", "disabled");
                $(self.mcs.getId("#idDivMCSLinkTree")).remove();
            }
        }

        CTxMCS.attributes.CAttribute.call(this, aSettings);

        this.criterion.PreselectionCriterion = this.criterion.PreselectionCriterion || {
            sCritType: "ctOT_Linked",
            ID_OT: (self.attribute.LinkType) ? self.attribute.LinkType.ID_OT_Dest : self.attribute.ID
        };

    };

    CLink.prototype = Object.create(CTxMCS.attributes.CAttribute.prototype);
    CLink.prototype.constructor = CLink;

    $.extend(CLink.prototype, {
        _updateCriterion: function () {
            $.extend(this.criterion, this.criteriaArea.find("form").serializeArray().reduce(function (prev, cur) {
                prev[cur.name] = cur.value;
                return prev;
            }, {}));
            if (this.criterion.PreselectionCriterion) {
                this.criterion.PreselectionCriterion.sPreselectionType = this.criterion.sPreselectionType;
                delete this.criterion.sPreselectionType;

            }
        }
    });

    J.when(J.get(CTxMCS.attributes.CAttribute.path + "Link/attribute.link.html")).then(function (data) {
        CLink.contentTemplate = J(data);
    }, function (error) {
        throw new TypeError(error);
    });
    return CLink;
})(jQuery);