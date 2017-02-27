/**
    Creates a TxWebExportation object.
    @requires CComboBox.js, CLayout.js
    @class
    @param aSettings.IdOTInitiallySelected
           aSettings.sSelectedObjectsKey
 */
var CTxWebExtraction = (function ($) {

    var sPathFileTxWebExtractionAjax = _url("/temp_resources/models/TxExtraction/TxWebExtractionAjax.asp");

    function CTxWebExtraction(aSettings, aCallBakFunction, aDummyData) {
        var self = this;

        this.id = getUniqueId();
        this.idObjectType = aSettings.idObjectType,
        this.idObject = aSettings.idObject.toString().replace(/<v>/g, ";");
        this.contentDiv = aSettings.sIdDivElement;
        this.callback = aCallBakFunction;
        this.dummyData = aDummyData;

        $.when(this.initialize()).then(function (data) {
            var arrResult = data.split("|");
            if (arrResult[0] === sOk) {
                self.appendHtml().then(function () {
                    translate(self.getId("idExtractionForm"));
                    self.createInterface();
                });
            } else {
                parent.Popup_Error(arrResult[0]);
            }
        });
    }

    CTxWebExtraction.prototype = {
        initialize: function () {
            return J.get(sPathFileTxWebExtractionAjax, { sFunctionName: "InitializeTxExtract" });
        },

        createInterface: function () {
            var self = this;

            this.wdowContainer = new CWindow({
                sName: "wExtractionNoOffice",
                sHeader: _("Extraction"),
                iWidth: 530,
                iHeight: 410,
                bDenyResize: true,
                bHidePark: true,
                sIcon: 'temp_resources/theme/img/btn_titre/module_extract-16.png'
            }, function () {
                self.callback({}, self.dummyData);
            });

            this.wdow = this.wdowContainer.getWindow("wExtractionNoOffice");
            this.wdow.attachObject(this.getId("idExtractionForm"));

            this.createLayout();

            //intialize action button
            J(self.getId("#extract")).on("click", function () {
                self.onExecute();
            });

            J(self.getId("#close")).on("click", function () {
                self.wdowContainer.getWindow("wExtractionNoOffice").close();
            });
        },

        getId: function (aId) {
            return (aId ? aId : "").toString() + this.id;
        },

        appendHtml: function () {
            var self = this,
                defer = J.Deferred();
            J.get(_url("/temp_resources/models/TxExtraction/TxWebExtraction.html"), function (data) {
                debugger;
                var htmlObject = self.changeHtmlId(J(data));
                htmlObject.appendTo(J("#" + self.contentDiv));
                defer.resolve();
            });
            return defer.promise();
        },

        changeHtmlId: function (htmlObject) {
            var self = this;
            htmlObject.find("*").andSelf().each(function () {
                if (J(this).prop("id")) J(this).attr("id", J(this).attr("id") + self.id);
                if (J(this).prop("for")) J(this).attr("for", J(this).attr("for") + self.id);
            });
            return htmlObject;
        },

        createLayout: function () {
            // initialize the layout
            var layoutSettings = {
                sParent: this.getId("idExtractionForm"),
                sPattern: "3I",
                cellsSettings: [
                    { "sHeight": "60", "bFixWidth": false, "bFixHeight": true, "sIdDivAttach": this.getId("id_div_cell_a") },
                    { "sHeight": "*", "sIdDivAttach": this.getId("id_div_cell_b") },
                    { "sHeight": "30", "bFixWidth": false, "bFixHeight": true, "sIdDivAttach": this.getId("id_div_cell_c") }
                ]
            };

            this.layout = new CLayout(layoutSettings);
            this.initializeComponents();
        },

        initializeComponents: function () {
            var self = this;
            $.ajax({
                url: sPathFileTxWebExtractionAjax,
                async: false,
                cache: false,
                type: "POST",
                dataType: "html",
                data: {
                    sFunctionName: "OnNewExtractionForm",
                    idOTInitiallySelected: self.idObjectType
                },
                success: function (data) {
                    var arrResult = data.split("|");
                    if (arrResult[0] === sOk) {
                        self.extractions = JSON.parse(arrResult[2]);
                        createObjectsTypeCombo(arrResult[1]);
                        createExtractionsCombo(arrResult[2]);
                        createObjectsTree();
                        //sTxJSONObjects = arrResult[3];
                    } else
                        parent.Popup_Error(arrResult[0]);
                }
            });

            function createObjectsTypeCombo(aJson) {
                //create combo OT
                self.objectsTypeCombo = new CComboBox({
                    sIdDivCombo: self.getId("idDivComboOT"),
                    iWidth: 425,
                    iMaxExpandedHeight: 200,
                    bDisplayImage: true,
                    sTxObjects: aJson,
                    iDefaultValueSelected: self.idObjectType,
                    onChange: function () {
                        self.onObjectTypeChange();
                    }
                });
            }

            function createExtractionsCombo(aJson) {
                //create combo Extraction
                self.extractionsCombo = new CComboBox({
                    sIdDivCombo: self.getId("idDivExtraction"),
                    iWidth: 425,
                    iMaxExpandedHeight: 200,
                    sTxObjects: aJson
                });
            }

            function createObjectsTree() {
                self.objectsTree = new CTreeObject({
                    idOT: self.idObjectType,
                    sIdDivTree: self.getId("idDivTreeObject"),
                    sIdDivToolbar: self.getId("idDivToolbarObject"),
                    sCheckType: ctCheckboxes,
                    bFolderCheckable: false,
                    sIdsChecked: self.idObject !== "0" ? self.idObject : undefined,
                    bEnableContextMenu: true,
                    bWriteMode: false,
                    onCheck: function () {
                        $(self.getId("#extract")).prop("disabled", self.objectsTree.getCheckedIds() === "");
                    }
                });
                //self.objectsTree.switchToLinearView();
                self.objectsTree.toolbar.toolbar.attachEvent("onClick", function (aIdBtn) {
                    switch (aIdBtn) {
                        case btnCheckAll:
                        case btnUnCheckAll:
                            $(self.getId("#extract")).prop("disabled", self.objectsTree.getCheckedIds() === "");
                    }
                });
                $(self.getId("#extract")).prop("disabled", self.idObject === "0");
                $(self.getId("#idDivToolbarObject")).addClass("cl_div_toolbarExtract");
            }
        },

        onObjectTypeChange: function () {
            var self = this;
            self.layout.progressOn();
            var idObjectType = this.objectsTypeCombo.getSelectedValue();
            J.ajax({
                url: sPathFileTxWebExtractionAjax,
                cache: false,
                type: "POST",
                dataType: "html",
                data: {
                    sFunctionName: "OnObjectTypeChange",
                    idOTSelected: idObjectType
                },
                success: function (data) {
                    self.layout.progressOff();
                    var arrResult = data.split("|");
                    if (arrResult[0] === sOk) {
                        self.extractions = JSON.parse(arrResult[1]);
                        self.extractionsCombo.reloadFromTxObjects(JSON.parse(arrResult[1]));
                        self.extractionsCombo.iIndexToSelect = 0;
                        self.objectsTree.reset(idObjectType);
                        $(self.getId("#extract")).prop("disabled", self.objectsTree.getCheckedIds() === "");
                    } else
                        parent.Popup_Error(arrResult[0]);
                }
            });
        },

        onExecute: function() {
            var self = this;
            self.layout.progressOn();
            var objectsToExtract = self.objectsTree.getCheckedIds();
            J.ajax({
                url: sPathFileTxWebExtractionAjax,
                cache: false,
                type: "POST",
                dataType: "html",
                data: {
                    sFunctionName: "OnExtractionExecute",
                    sExtractionTag: self.extractions[self.extractionsCombo.getSelectedIndex()]["sTag"],
                    sObjectsSelected: objectsToExtract
                },
                success: function (data) {
                    self.layout.progressOff();
                    var arrResult = data.split("|");
                    if (arrResult[0] === sOk) {
                        var response = JSON.parse(arrResult[1]);
                        if (response.sWarning) {
                            parent.Popup_Alert(response.sWarning);
                        }
                        downloadFile(response.sFilePath);
                        if (response.bResfreshForm) {
                            var selectedIds = parent.txASP.getSelectedObjectIds();
                            if (selectedIds !== "" && selectedIds.indexOf(";") < 0 && objectsToExtract.indexOf(selectedIds) > -1) {
                                parent.txASP.refreshReadForm();
                            }
                        }
                    } else {
                        parent.Popup_Error(arrResult[0]);
                    }
                }
            });
        }

    }

    return CTxWebExtraction;
})(jQuery);