var CTxMCS = (function ($) {

    CTxMCS.modelPath = _url("/temp_resources/models/TxMCS/");
    CTxMCS.wrapper = _url("/temp_resources/models/TxMCS/TxMCSAjax.asp");

    var required = [
        "attribute.js",
        "Boolean/attribute.boolean.js",
        "Link/attribute.link.js",
        "Root/attribute.root.js",
        "Numerical/attribute.numerical.js",
        "Table/attribute.table.js",
        "Textual/attribute.textual.js"
    ];

    CTxMCS.attributes = {};

    function CTxMCS(aSettings, aCallBack, aDummyData) {
        if (aCallBack && typeof aCallBack !== "function") {
            throw new Error(aCallBack + " is not a function");
        }

        var self = this;
        this.settings = aSettings;
        this.callBack = aCallBack;
        this.dummyData = aDummyData;
        this.id = getUniqueId();
        this.idObjectType = aSettings.idObjectType;
        this.contentDiv = aSettings.sIdDivElement;
        this.width = resizeWidth(getValue(aSettings.iWidth, $("#" + self.contentDiv).width()));
        this.height = resizeHeight(getValue(aSettings.iHeight, $("#" + self.contentDiv).height()));
        this.criteria = {};

        self.appendHtml().then(function () {
            if (aSettings.bModal) self.createWindow();
            else $("#" + self.contentDiv).find(".mcsTopCell").css("padding", "0");
            self.initInterface();

            getScripts(required.map(function (s) {
                return CTxMCS.modelPath + "attributes/" + s;
            }), document.getElementById(self.contentDiv), function () {
                setTimeout(function () {
                    if (aSettings.idRequirementsList && aSettings.idRequirementsList > 0) {
                        self.loadRequirementsList(aSettings.idRequirementsList);
                    } else if(aSettings.requirementsList) {
                        self.loadRequirementsList(aSettings.requirementsList)
                    }
                });
                self.mainLayout.progressOff();
            });
        });
    }

    CTxMCS.prototype = {

        appendHtml: function () {
            var self = this,
                defer = $.Deferred();
            $.get(CTxMCS.modelPath + "template/TxWebMCS.html", function (data) {
                var htmlObject = self.changeHtmlId($(data));
                htmlObject.appendTo($("#" + self.contentDiv));
                defer.resolve();
            });
            return defer.promise();
        },

        changeHtmlId: function (htmlObject) {
            var self = this;
            htmlObject.find("*").andSelf().each(function () {
                if ($(this).prop("id")) $(this).attr("id", $(this).attr("id") + self.id);
                if ($(this).prop("for")) $(this).attr("for", $(this).attr("for") + self.id);
            });
            return htmlObject;
        },

        createWindow: function () {
            var self = this;
            this.wdowContainer = this.settings.wdowContainer;
            this.sIdWdow = getValue(this.settings.sWindowId, format("WindowMCS#1", [this.id]));

            //initialize window
            var windowSetting = {
                sName: this.sIdWdow,
                iWidth: this.width,
                iHeight: this.height,
                sHeader: getValue(this.settings.sWindowCaption, _("Sélection Multicritère - Cahier des Charges")),
                sIcon: "temp_resources/theme/img/btn_titre/module_mcs-16.png",
                bModal: true,
                bHidePark: true,
                bDenyResize: true,
                bNewContainer: true
            };

            this.wdowContainer = new CWindow(windowSetting, function () { self.onFinalize(false); });
            this.wdow = this.wdowContainer.getWindow(this.sIdWdow);

            this.wdow.attachObject(this.getId("idMCSMainLayout"));
        },

        initInterface: function () {
            var self = this,
                mainLayoutSettings = {
                    sPattern: "2E",
                    sParent: this.getId("idMCSMainLayout"),
                    cellsSettings: [
                        { sIdDivAttach: this.getId("idMCSTopCell"), sHeight: "*" },
                        { sIdDivAttach: this.getId("idMCSBottomCell"), sHeight: "30", bFixWidth: true, bFixHeight: true }
                    ]
                }
            if (!this.settings.bModal) {
                mainLayoutSettings.sPattern = "1C";
                mainLayoutSettings.cellsSettings.splice(1, 1);
            }
            this.mainLayout = new CLayout(mainLayoutSettings);

            this.mainLayout.progressOn();

            this.mainTabbar = new CTabbar({
                sIdDivTabbar: this.getId("idMCSMainTabbar"),
                tabs: [
                    {
                        ID: "settings",
                        sName: _("Paramétrage"),
                        sContentZone: this.getId("idMCSSettingsTab"),
                        bActive: true
                    }
                ],
                onSelect: function (aId) {
                    if (aId !== "results") return;
                    $("#" + self.getId("idMCSResultsTab")).html(JSON.stringify(self.getCriteria(), null, 4));
                }
            });

            if (this.settings.bModal) {
                this.btnBar = new CButtonBar({
                    sIdDivParent: this.getId("idMCSButtonBar"),
                    btns: [
                        {
                            sId: "idMCSOptions",
                            sCaption: _("Options"),
                            onClick: function () {

                            }
                        },
                        {
                            iBtnType: btValidate,
                            onClick: function () {
                                self.validate = true;
                                self.wdow.close();
                            }
                        },
                        {
                            iBtnType: btCancel,
                            onClick: function () {
                                self.wdow.close();
                            }
                        }
                    ]
                });
            }

            this.settingsLayout = new CLayout({
                sPattern: "2U",
                sParent: this.getId("idMCSSettingsLayout"),
                cellsSettings: [
                    { sIdDivAttach: this.getId("idMCSLeftCell"), sWidth: "260"/*, bFixWidth: true, bFixHeight: true */ },
                    { sIdDivAttach: this.getId("idMCSRightCell") }
                ]
            });
            this.settingsLayout.layout.attachEvent('onPanelResizeFinish', function () {
                self.settingsLayout.setSizes();
                self.criteriaTabbar.adjustOuterSize();
            });

            if (self.settings.bObjectTypeSwitchable === true) {
                this.objectTypeCombo = new CComboBoxOT({
                    iDefaultValueSelected: this.idObjectType,
                    sIdDiv: this.getId("idMCSObjectsTypeCombo"),
                    iWidth: "97%",
                    iMaxExpandedHeight: 400,
                    onChange: function () { self.onObjectTypeChange() }
                });
            } else {
                $(this.getId("#idMCSAttributesTree")).css("top", "5px");
            }

            this.attributesTree = new CTreeAttribute({
                idOT: this.idObjectType,
                sIdDiv: this.getId("idMCSAttributesTree"),
                sIdDivToolbar: this.getId("idMCSToolbar"),
                sCheckType: ctCheckboxes,
                bFolderCheckable: false,
                bDisplayOTRoot: true,
                bEnableMultiSelection: false,
                onSelect: function () { self.onAttributeSelected(); },
                onCheck: function (aIdItem, aChecked) {
                    self.onAttributeChecked(aIdItem, aChecked);
                },
                onCheckAll: function () {
                    setTimeout(function () {
                        var nodes = getAttributesTreeCheckedNodes(self.attributesTree.attributeSet.Levels);
                        nodes.forEach(function (n) {
                            self.onAttributeChecked(n.id, true);
                        });
                    });
                },
                onUnCheckAll: function () {
                    setTimeout(function () {
                        var checkedNodes = getAttributesTreeCheckedNodes(self.attributesTree.attributeSet.Levels),
                            uncheckedNodes = self.attributesTree.nodes.filter(function (node) {
                                return !node.bFolder && !checkedNodes.some(function (n) {
                                    return node.id === n.id;
                                });
                            });
                        uncheckedNodes.forEach(function (node) {
                            var path = self.getAttributePath(node);
                            self.deleteCriteria(path);
                        });
                    });
                },
                fctOnSwitchToLinearView: function () {
                    var node = self.attributesTree.getSelectedNode();
                    if (!node) $(self.getId("#idMCSBasics")).empty();
                }
            });

            this.attributesTree.onClickOut = function () {
                //self.onAttributeSelected();
            }

            this.criteriaTabbar = new CTabbar({
                sIdDivTabbar: this.getId("idMCScriteriaTabbar"),
                tabs: [
                    {
                        ID: "basics",
                        sName: _("Critères"),
                        sContentZone: this.getId("idMCSBasics"),
                        bActive: true
                    }
                ]
            });
        },

        onObjectTypeChange: function () {
            this.idObjectType = this.objectTypeCombo.getSelectedValue();
            this.attributesTree.idOT = this.idObjectType;
            this.attributesTree.reset();
        },

        onAttributeSelected: function () {
            var nodes = this.attributesTree.getSelectedNodes();
            var criteriaArea = $("#" + this.getId("idMCSBasics"));
            if (nodes.length !== 1 || nodes[0].bFolder) {
                criteriaArea.empty();
                return;
            }
            var criteria = this.createCriterion({
                mcs: this,
                criteriaArea: criteriaArea,
                attribute: nodes[0]
            });
        },

        onAttributeChecked: function (aIdItem, aChecked) {
            var self = this,
                node = this.attributesTree.getNode(aIdItem),
                path = self.getAttributePath(node);
            if (aChecked) {
                //TODO Default criterion for attribute and its possibly parents 
                var parents = self.getAttributeParents(node);
                parents.unshift(node);
                parents.forEach(function (attribute) {
                    var path = self.getAttributePath(attribute);
                    if (self.criteria[path] || (attribute.sType !== "RootOT" && !self.attributesTree.getParentNode(attribute.id))) return;
                    self.createCriterion({
                        mcs: self,
                        criteriaArea: $("#" + self.getId("idMCSBasics")),
                        attribute: attribute,
                        bSilent: true
                    });
                });
            } else {
                this.deleteCriteria(path);
            }
        },

        onFinalize: function () {
            var validated = this.validate || false;
            $("#" + this.contentDiv).empty();
            if (this.callBack) this.callBack.call(this.thisArg, validated, this.idObjects, this.dummyData);
        },

        getId: function (aId) {
            return aId + this.id;
        },

        createCriterion: function (aSettings) {
            var attribute = aSettings.attribute;
            var sType = attribute.sType;
            if (attribute.sType === "RootOT") {
                attribute.header = _("Définition d'un critère de présélection sur") + ' "' + attribute.sName + '"';
            }
            var whiteSpaceIndex = sType.indexOf(" ");
            if (whiteSpaceIndex > 0) sType = sType.substring(0, whiteSpaceIndex);
            var className = Object.keys(CTxMCS.attributes).find(function (attribute) {
                var tags = CTxMCS.attributes[attribute].Tags;
                return Array.isArray(tags) && tags.indexOf(sType) > -1;
            });
            if (!className) throw new Error(attribute.sType + " type implementation not found");
            var path = this.getAttributePath(attribute);
            aSettings.criterion = (this.criteria[path]) ? this.criteria[path].criterion : {};
            return new CTxMCS.attributes[className](aSettings);
        },

        saveCriterion: function (criterion) {
            var path = this.getAttributePath(criterion.attribute);
            this.criteria[path] = criterion;
        },

        deleteCriteria: function (criterionPath) {
            var self = this;
            Object.keys(this.criteria).filter(function (p) {
                return p.startsWith(criterionPath);
            }).forEach(function (path) {
                delete self.criteria[path];
            });
        },

        onCriterionChange: function (aAttribute) {
            if (this.attributesTree.tree.isItemChecked(aAttribute.id)) return;
            this.attributesTree.setCheck(aAttribute.id, true, true);
        },

        getCriteria: function () {
            var self = this;
            function removePaths(criteria) {
                delete criteria._path;
                if (criteria.PreselectionCriterion && criteria.PreselectionCriterion.SubCriteria) {
                    criteria.PreselectionCriterion.SubCriteria.forEach(function (c) {
                        removePaths(c);
                    });
                }
            }

            var idsChecked = getAttributesTreeCheckedPaths(this.attributesTree.attributeSet.Levels);

            var result = Object.keys(this.criteria).map(function (attributeId) {
                return {
                    _path: attributeId,
                    criterion: $.extend(true, {}, self.criteria[attributeId].criterion)
                };
            }).filter(function (criterion) {
                return idsChecked.indexOf(criterion._path) > -1;
            }).map(function (c) {
                c.criterion._path = c._path;
                return c.criterion;
            });

            result.forEach(function (c) {
                var parentPath = c._path.substr(0, c._path.lastIndexOf("|"));
                var parent = result.find(function (p) {
                    return p._path === parentPath;
                });
                if (parent) {
                    parent.PreselectionCriterion.SubCriteria = parent.PreselectionCriterion.SubCriteria || [];
                    parent.PreselectionCriterion.SubCriteria.push(c);
                }
            });

            if (result.length > 0) {
                var r = result.find(function (c) {
                    return c._path.indexOf("|") === -1;
                });
                removePaths(r);
                r.PreselectionCriterion.bSelection = true;
                r.sPreselectionType = "ptFullOT";
                r.sAggregation = "Geometric Mean";
                return r;
            } else {
                return {
                    sDataTreatment: "dtSpecificValue",
                    sLinkCritType: "lctOnly_One",
                    sPreselectionType: "ptFullOT",
                    ID_OT: self.idObjectType,
                    PreselectionCriterion: {
                        sCritType: "ctPreselection",
                        ID_OT: self.idObjectType
                    }
                };
            }
        },

        loadRequirementsList: function (aRequirementsList) {
            var self = this;
            function load(requirementList, idOt) {
                if (!requirementList.ID_Att) {
                    var root = $.extend(true, {}, requirementList);
                    delete root.PreselectionCriterion.SubCriteria;
                    self.criteria[idOt] = { criterion: root };
                }
                var pres = requirementList.PreselectionCriterion;
                pres.SubCriteria.forEach(function (criterion) {
                    var id = idOt + "|" + criterion.ID_Att;
                    self.criteria[id] = { criterion: $.extend(true, {}, criterion) };
                    var node = self.attributesTree.nodes.find(function (node) {
                        return node.ID === criterion.ID_Att && node.sType !== "RootOT";
                    });
                    if (node) {
                        self.attributesTree.setCheck(node.id, true, true);
                    }
                    if (criterion.PreselectionCriterion) {
                        delete self.criteria[id].criterion.PreselectionCriterion.SubCriteria;
                        self.attributesTree.openItem(node.id.toString());
                        setTimeout(function () {
                            load(criterion, idOt + "|" + criterion.ID_Att);
                        });
                    }
                });
            }

            if(typeof aRequirementsList === "object")
                return load(aRequirementsList, aRequirementsList.ID_OT);

            this.mainLayout.progressOn();

            $.post(CTxMCS.wrapper,
                {
                    sFunctionName: "OnLoadRequirementsList",
                    idObjectType: self.idObjectType,
                    idRequirementsList: aRequirementsList
                },
                function (result) {
                    var results = result.split("|");
                    if (results[0] === sOk) {
                        var requirementsList = JSON.parse(results[1]);
                        load(requirementsList, requirementsList.ID_OT);
                    } else {
                        msgDevError(results[0]);
                    }
                }
            ).always(function () {
                self.mainLayout.progressOff();
            });
        },

        getAttributePath: function (aAttribute) {
            if (!aAttribute) return;
            var attribute = {},
                array = [aAttribute.ID];
            $.extend(attribute, aAttribute);
            while (this.attributesTree.getParentNode(attribute.id)) {
                attribute = this.attributesTree.getParentNode(attribute.id);
                if (!attribute.bFolder) array.unshift(attribute.ID);
            }
            return array.join("|");
        },

        getAttributeParents: function (aAttribute) {
            var attribute = {},
                array = [];
            $.extend(attribute, aAttribute);
            while (this.attributesTree.getParentNode(attribute.id)) {
                attribute = this.attributesTree.getParentNode(attribute.id);
                if (!attribute.bFolder) array.push(attribute);
            }
            return array;
        }
    };

    function getScripts(aScripts, container, aCallback) {
        if (aScripts.length === 0) {
            if (aCallback) {
                aCallback();
            }
            return;
        }
        $.getScriptModded(aScripts[0], container, function () {
            aScripts.shift();
            getScripts(aScripts, container, aCallback);
        });
    }

    jQuery.extend({
        getScriptModded: function (url, container, callback) {
            var head = container || document.getElementsByTagName("head")[0];
            var script = document.createElement("script");
            script.src = url;

            // Handle Script loading
            {
                var done = false;

                // Attach handlers for all browsers
                script.onload = script.onreadystatechange = function () {
                    if (!done && (!this.readyState ||
                        this.readyState === "loaded" || this.readyState === "complete")) {
                        done = true;
                        if (callback)
                            callback();

                        // Handle memory leak in IE
                        script.onload = script.onreadystatechange = null;
                    }
                };
            }

            head.appendChild(script);

            // We handle everything using the script element injection
            return undefined;
        }
    });

    var flatten = function (arr) {
        return arr.reduce(function (flat, toFlatten) {
            return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
        }, []);
    }

    function getAttributesTreeCheckedPaths(aLevels, parentId) {
        return flatten(aLevels.map(function (e) {
            var id = parentId ? parentId + "|" + e.ID : e.ID.toString();
            return getAttributesTreeCheckedPaths(e.Levels, id).concat(id);
        }));
    };

    function getAttributesTreeCheckedNodes(aLevels) {
        return flatten(aLevels.map(function (e) {
            return getAttributesTreeCheckedNodes(e.Levels).concat(e);
        }));
    };

    return CTxMCS;
})(jQuery);