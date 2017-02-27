CTxMCSManager = (function ($) {

    function CTxMCSManager(aSettings, aCallBack, aDummyData, thisArgs) {
        if (aCallBack && typeof aCallBack !== "function") {
            throw new Error(aCallBack + " is not a function");
        }

        var self = this;
        this.settings = aSettings;
        this.callback = aCallBack;
        this.thisArg = this.thisArg;
        this.idObjectType = aSettings.idObjectType;
        this.id = getUniqueId();
        this.contentDiv = aSettings.sIdDivElement;
        this.mcsPopup = null;

        this.onInitializeForm();

    }

    CTxMCSManager.prototype = {

        onInitializeForm: function () {
            var self = this;
            $.post(CTxMCS.wrapper,
                {
                    sFunctionName: "OnInitializeForm",
                    idObjectType: this.idObjectType
                },
                function (result) {
                    var results = result.split("|");
                    if (results[0] === sOk) {
                        var data = JSON.parse(results[1]);
                        self.defaultObjectTypes = data.defaultObjectTypes;
                        self.bAllObjectTypesReturned = data.bAllObjectTypesReturned;
                        self.appendHtml().then(function () {
                            self.initInterface();
                        });
                    } else {
                        msgDevError(results[0]);
                    }
                }
            );
        },

        OnQueryForMoreObjectTypes: function () {
            var self = this;
            $.post(CTxMCS.wrapper,
                {
                    sFunctionName: "OnQueryForMoreObjectTypes",
                    idObjectType: this.idObjectType
                },
                function (result) {
                    var results = result.split("|");
                    if (results[0] === sOk) {
                        var data = JSON.parse(results[1]);
                        self.otherObjectTypes = data.otherObjectTypes;
                        self.defaultObjectTypes = self.defaultObjectTypes.concat(self.otherObjectTypes);
                        self.displayRequimentLists();
                    } else {
                        msgDevError(results[0]);
                    }
                }
            );
        },

        appendHtml: function () {
            var self = this,
                defer = $.Deferred();
            $.get(CTxMCS.modelPath + "template/TxWebMCSManager.html", function (data) {
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

        initInterface: function () {
            var self = this;

            this.createWindow();

            this.mainLayout = new CLayout({
                sPattern: "2E",
                sParent: this.getId("idMCSManagerMainLayout"),
                cellsSettings: [
                    { sIdDivAttach: this.getId("idMCSManagerTopCell"), sHeight: "*" },
                    { sIdDivAttach: this.getId("idMCSManagerBottomCell"), sHeight: "30", bFixWidth: true, bFixHeight: true }
                ]
            });

            var topCell = self.mainLayout.layout.items[0];

            this.btnBar = new CButtonBar({
                sIdDivParent: this.getId("idMCSManagerButtonBar"),
                btns: [
                    {
                        sId: "idMCSNew",
                        sCaption: _("Nouvelle sélection..."),
                        onClick: function () {
                            // Switch to first interface if necessary   
                            if (self.btnBar.isEnabled("idMCSPrevious",true)) {
                                topCell.detachObject(false);
                                topCell.attachObject(self.getId("idMCSManagerTopCell"));
                                self.btnBar.enableButton("idMCSNext", true);
                                self.btnBar.disableButton("idMCSPrevious", true);

                                self.freeSelection();
                            }
                            
                            self.showPopup("idMCSNew");
                        }
                    },
                    {
                        sId: "idMCSPrevious",
                        sCaption: _("Précédent"),
                        bDisabled: true,
                        onClick: function () {
                            topCell.detachObject(false);
                            topCell.attachObject(self.getId("idMCSManagerTopCell"));

                            self.btnBar.enableButton("idMCSNext", true);
                            self.btnBar.disableButton("idMCSPrevious", true);

                            // Free mcs selection
                            self.freeSelection();
                        }
                    },
                    {
                        sId: "idMCSNext",
                        sCaption: _("Suivant"),
                        bDisabled: true,
                        onClick: function () {
                            topCell.detachObject(false);
                            topCell.attachObject(self.getId("idMCSManagerResultCell"));
                            self.displayResults();
                        }
                    },
                    {
                        sId: "idMCSClose",
                        sCaption: _("Fermer"),
                        onClick: function () {
                            self.freeSelection(); // Free mcs selection before close
                            self.wdow.close();
                        }
                    }
                ]
            });
            // manage loading of all OT
            $("#" + this.getId("idDivLoadAllObjectsType")).html(_("Afficher tous les types d'Entités"));
            if (self.bAllObjectTypesReturned)
                $("#" + this.getId("idDivLoadAllObjectsType")).addClass("mcsManagerAllInformationReturned");
            else
                $("#" + this.getId("idDivLoadAllObjectsType")).click(function () {
                    self.OnQueryForMoreObjectTypes();
                    self.bAllObjectTypesReturned = true;
                    $(this).addClass("mcsManagerAllInformationReturned");
                    $(this).unbind("click");
                }); 

            if (!this.settings.bInternal)
                this.showPopup("idMCSNew");
            else {
                this.btnBar.disableButton("idMCSNew", true);
                $(this.getId("#idMCSManagerPopup")).remove();
                this.createMCS(this.idObjectType, 0);
            }

            // Events
            $(".mcsManagerPopup").on("click", ".mcsBoxContainer", function () {
                var $this = $(this),
                    idObjectType = $this.data("idObjectType"),
                    idRequirementsList = $this.data("idRl");

                self.hidePopup();
                if (self.mcs) self.mcs.onFinalize();
                self.createMCS(idObjectType, idRequirementsList);
            });
            $(this.getId("#idMCSManagerResultDevs")).on("click", ".mcsModelBoxContainer", function () {
                var $this = $(this),
                    idObjectType = $this.data("idObjectType"),
                    sModelName = $this.data("modelName");

                switch(sModelName) {
                    case "Extraction":
                        self.displayExtraction(idObjectType);
                        break;
                    case "Exportation":
                        self.displayExportation(idObjectType);
                        break;
                    case "SimplifiedExportation":
                        self.displaySimplifiedExportation();
                        break;
                    default:
                        var modelData = sModelName.split("_");
                        self.executeModel(parseInt(modelData[0]), modelData[1], modelData[2]);
                }
            });
        },

        createMCS: function (idObjectType, idRequirementsList) {
            var self = this;
            self.mcs = new CTxMCS({
                idObjectType: idObjectType,
                sIdDivElement: self.getId("idMCSManagerTopCell"),
                idRequirementsList: idRequirementsList
            });
            ["idMCSNext"].forEach(function (id) {
                self.btnBar.enableButton(id, true);
            });
            // Update window caption
            var OTSelected = self.defaultObjectTypes.find(function (item) {
                return item.idObjectType == idObjectType;
            }) || getOT(idObjectType);
            var sOTName = OTSelected.sName;
            var sRLName = _("Nouvelle sélection");
            if (idRequirementsList > 0) {
                var RLSelected = OTSelected.requirementsLists.find(function (rl) {
                    return rl.ID == idRequirementsList;
                });
                sRLName = RLSelected.sName;
            }
            this.wdow.setText(_("Sélection Multicritère") + ' - "' + sRLName + '" ' + _("sur les Entités de type") + ' "' + sOTName + '"');
        },

        createWindow: function () {
            var self = this;
            this.sIdWdow = getValue(this.settings.sWindowId, format("WindowMCS#1", [this.id]));

            //initialize window
            var windowSetting = {
                sName: this.sIdWdow,
                iWidth: iTxFormWdowWidth,
                iHeight: iTxFormWdowHeight - 50,
                sHeader: getValue(this.settings.sWindowCaption, _("Sélection Multicritère - Cahier des Charges")),
                sIcon: "temp_resources/theme/img/btn_titre/module_mcs-16.png",
                bModal: true,
                bHidePark: true,
                bDenyResize: true,
                bNewContainer: true
            };

            this.wdowContainer = new CWindow(windowSetting, function () { self.onFinalize(false); });
            this.wdow = this.wdowContainer.getWindow(this.sIdWdow);
            this.wdow.attachObject(this.getId("idMCSManagerMainLayout"));
        },

        onFinalize: function () {
            var validated = this.validate || false;
            if (this.mcsPopup && this.mcsPopup.unload) this.mcsPopup.unload(); // clear html of popup
            if (this.callback) this.callback.call(this.thisArg, validated, this.resultObjects, this.dummyData);
        },

        getId: function (aId) {
            return (aId ? aId : "").toString() + this.id;
        },

        showPopup: function (inputId) {
            
            var input = document.getElementById(inputId + this.btnBar.sUniqueId);
            $(this.getId("#idMCSManagerPopup")).css("width", iTxFormWdowWidth - 40);
            var self = this;
            if (!this.mcsPopup) {
                this.mcsPopup = new dhtmlXPopup({ mode: "top" });
                this.mcsPopup.attachObject(this.getId("idMCSManagerPopup"));
                this.mcsPopup.attachEvent("onHide", function () {
                    // Création d'un cahier de charge vierge sur le TE en cours ?
                    if (self.mcs) return;
                    //self.createMCS(idObjectType);
                });
                this.displayRequimentLists();
            }
            if (this.mcsPopup.isVisible()) {
                this.mcsPopup.hide();
            } else {
                var x = getAbsoluteLeft(input),
                    y = getAbsoluteTop(input),
                    w = input.offsetWidth,
                    h = input.offsetHeight;

                this.mcsPopup.show(x + (iTxFormWdowWidth - 137) / 2, y, w, h);
            }
        },

        hidePopup: function () {
            if (this.mcsPopup) this.mcsPopup.hide();
        },

        displayRequimentLists: function () {
            var self = this;
            
            function onCellActive(idCell) {
                var OTCell = self.defaultObjectTypes.filter(function (item) {
                    return item.idObjectType == idCell;
                });
                var requirementsList = [];
                if (OTCell[0].requirementsLists)
                    requirementsList = OTCell[0].requirementsLists.slice();
                requirementsList.unshift({ ID: 0, sName: _("Cahier des charges vierge..."), bEmpty: true });
                displayRequirementsLists(idCell, requirementsList, OTCell[0].bAllRLRetrieved);
            }

            function addRequirementsListsToOT(idCell, newRequirementsList) {
                var OTCell = self.defaultObjectTypes.filter(function (item) {
                    return item.idObjectType == idCell;
                });
                if (OTCell[0].requirementsLists)
                    OTCell[0].requirementsLists = OTCell[0].requirementsLists.concat(newRequirementsList);
                else
                    OTCell[0].requirementsLists = newRequirementsList;

                OTCell[0].bAllRLRetrieved = true;

                return OTCell[0].requirementsLists;
            }

            function loadOtherRequirementsLists(idCell) {
                $.post(CTxMCS.wrapper,
                    {
                        sFunctionName: "OnQueryForMoreRequirementsLists",
                        idObjectType: idCell
                    },
                    function (result) {
                        var results = result.split("|");
                        if (results[0] === sOk) {
                            var data = JSON.parse(results[1]);
                            var newRL = addRequirementsListsToOT(idCell, data.otherRequirementsLists).slice();
                            newRL.unshift({ ID: 0, sName: _("Cahier des charges vierge..."), bEmpty: true });
                            displayRequirementsLists(idCell, newRL, true);
                        } else {
                            msgDevError(results[0]);
                        }
                    }
                );
            }

            function displayRequirementsLists(idCell, requirementsList, bAllRLRetrieved) {
                var $div = $("<div><ul class='mcsOTRequirementsList'></ul><div id='mcsManagerLoadRL" + idCell + "' class='mcsManagerLoadInformation'>" + _("Afficher tous les cahiers des charges de ce type") + "</div></div>"),
                    sIconUrl = '',
                    $mcsBoxTemplate = $("<li class='mcsBoxContainer' data-id-object-type='" + idCell + "' style='display: none;'>\
                                            <img src=''>\
                                            <div class='mcsBoxDetails'>\
                                                <div class='divVerticalCenter'>\
                                                    <div class='mcsBoxName'></div>\
                                                    <div class='mcsBoxDescription' title=''></div>\
                                                </div>\
                                            </div>\
                                        </div>");
                requirementsList.forEach(function (rl) {
                    sIconUrl = (rl.bEmpty) ? '/temp_resources/models/TxMCS/img/48x48_CreateNewRequirementList.png' : '/temp_resources/models/TxMCS/img/48x48-MCS_RLs.png';
                    var $mcsBox = $mcsBoxTemplate.clone();
                    $mcsBox.attr("data-id-rl", rl.ID);
                    $mcsBox.find("img").attr("src", sIconUrl);
                    $mcsBox.find(".mcsBoxName").html(rl.sName);
                    if (rl.sDescription) {
                        $mcsBox.find(".mcsBoxDescription").attr("title",rl.sDescription);
                        $mcsBox.find(".mcsBoxDescription").html(rl.sDescription);
                    }
                    $div.find(".mcsOTRequirementsList").append($mcsBox);
                });
                self.accordion.setContentToItem(idCell, $div.html());
                $(".mcsBoxContainer").fadeIn(200);
                if (!bAllRLRetrieved) {
                    $("#mcsManagerLoadRL" + idCell).click(function () {
                        loadOtherRequirementsLists(idCell);
                    });
                } else {
                    $("#mcsManagerLoadRL" + idCell).unbind("click");
                    $("#mcsManagerLoadRL" + idCell).addClass("mcsManagerAllInformationReturned");
                }
            }

            
            if (!this.accordion) {

                var items = [];
                this.defaultObjectTypes.forEach(function (objectType) {
                    items.push({ id: objectType.idObjectType, text: objectType.sName, iIcon: objectType.iIcon, onActive: function (aId) { onCellActive(aId) } });
                });
                this.accordion = new CAccordion({
                    sIdDiv: this.getId("idDivAccordion"),
                    items: items
                });

                self.accordion.openItem(this.idObjectType);
            } else { // accordion already load : add other objectsType
                this.otherObjectTypes.forEach(function (objectType) {
                    self.accordion.addItem({ id: objectType.idObjectType, text: objectType.sName, iIcon: objectType.iIcon, onActive: function (aId) { onCellActive(aId) } });
                });
            }
        },

        displayResults: function () {
            var self = this;

            ["idMCSNext"].forEach(function (id) {
                self.btnBar.disableButton(id, true);
            });

            ["idMCSPrevious"].forEach(function (id) {
                self.btnBar.showButton(id, true);
                self.btnBar.enableButton(id, true);
            });
            if (!this.resultsLayout) {

                this.resultsLayout = new CLayout({
                    sPattern: "2U",
                    onPanelResizeFinish: function() {
                        self.resultsLayout.setSizes();
                        $(self.getId("#idMCSManagerResultGrid")).css("width", "calc(100% - 10px)");
                        self.gridResults.setColWidth(1, "1000");
                    },
                    sParent: this.getId("idMCSManagerResultCell"),
                    cellsSettings: [
                        { sIdDivAttach: this.getId("idMCSManagerResultGrid"), sWidth: "570" },
                        { sIdDivAttach: this.getId("idMCSManagerResultDevs") }
                    ]
                });
                this.resultsLayout.progressOn();

                this.gridResults = new CGrid({
                    sIdDivGrid: self.getId("idMCSManagerResultGrid"),
                    iWidth: $(self.getId("#idMCSManagerResultGrid")).width() - 10,
                    iHeight: $(self.getId("#idMCSManagerResultGrid")).height() - 10,
                    cols: [
                        { sHeader: _("Entités sélectionnées"), sWidth: "*", sColSorting: "str", sColAlign: "left" }
                    ]
                });
            } else {
                this.resultsLayout.progressOn();
                this.gridResults.clear();
            }
            $(self.getId("#idMCSManagerResultDevs")).empty();
            $(self.getId("#idMCSManagerResultDevs")).append("<div class='mcsManagerResultDevsTitle'>" + _("Actions") + "</div>");

            $.post(
                CTxMCS.wrapper,
                {
                    sFunctionName: "OnMultiSelect",
                    idObjectType: self.mcs.idObjectType,
                    sRequirementsList: JSON.stringify(self.mcs.getCriteria())
                },
                function (result) {
                    var results = result.split("|");
                    if (results[0] === sOk) {
                        var data = JSON.parse(results[1]);
                        self.idSelection = data.idCurrentSelection;
                        self.resultObjects = data.selectedObjects;
                        self.bDisplayExtraction = data.bDisplayExtraction;
                        self.bDisplayExportation = data.bDisplayExportation;
                        self.bDisplaySimplifiedExportation = data.bDisplaySimplifiedExportation;
                        self.modelApplicationsAfterSelection = data.modelApplicationsAfterSelection;
                        self.displayActionButtons();
                        var objectsToDisplay = data.selectedObjects.map(function (txObject) {
                            txObject.data = [format("<img src='" + _url("/temp_resources/theme/img/png/#1.png") + "'/> <span style='position: relative; top: -3px;'>#2</span>", [txObject.iIcon, txObject.sName])];
                            return txObject;
                        });
                        self.gridResults.reloadFromTxObjects(objectsToDisplay);
                        self.gridResults.setNewColLabel(0, _("Entités sélectionnées") + " (" + data.selectedObjects.length + "/" + data.iNbEvaluatedObjects + ")");
                    } else {
                        msgDevError(results[0]);
                    }
                    self.resultsLayout.progressOff();
                }
            );
        },

        displayActionButtons: function () {
            var self = this;
            // Add buttons of action
            var $modelDivTemplate = $("<div class='mcsModelBoxContainer' data-id-object-type='" + this.mcs.idObjectType + "'>\
                                        <img src='' class='mcsModelBox'/>\
                                        <div class='mcsBoxDetails'>\
                                            <div class='divVerticalCenter'>\
                                                <div class='mcsBoxName'></div>\
                                                <div class='mcsBoxDescription' title=''></div>\
                                            </div>\
                                        </div>\
                                    </div>");
            var actionButtons = [
                {
                    sName: _("Extraire les Entités..."),
                    sDescription: _("Cette action vous permet d'ouvrir l'interface d'extraction."),
                    sIconPath: CTxMCS.modelPath + "img/48x48_Extraction.png",
                    sModelName: "Extraction",
                    bDisplay: this.bDisplayExtraction
                },
                {
                    sName: _("Exporter les Entités..."),
                    sDescription: _("Cette action vous permet d'ouvrir l'interface d'exportation."),
                    sIconPath: CTxMCS.modelPath + "img/48x48_Exportation.png",
                    sModelName: "Exportation",
                    bDisplay: this.bDisplayExportation
                },
                {
                    sName: _("Exporter au format Excel"),
                    sDescription: _("Cette action vous permet d'exporter directement vers Excel les Entités sélectionnées. Les Caractéristiques sélectionnées sont celles ayant fait l'objet de critère."),
                    sIconPath: CTxMCS.modelPath + "img/48x48_Exportation.png", // TODO : change icon
                    sModelName: "SimplifiedExportation",
                    bDisplay: this.bDisplaySimplifiedExportation
                }
            ];
            
            self.modelApplicationsAfterSelection.forEach(function (model) {
                actionButtons.push({
                    sName: model.sName,
                    sDescription: (model.sDescription) ? model.sDescription : "",
                    sIconPath: "temp_resources/models/" + getValue(model.sIconRFilePath, "24x24_No_Model.bmp"),
                    sModelName: model.ID + "_" + model.sObjectDependency + "_" + model.sSelectionVariableName,
                    bDisplay: true
                });
            });
            
            actionButtons.forEach(function (model) {
                if (model.bDisplay) {
                    var $modelDiv = $modelDivTemplate.clone();
                    $modelDiv.attr("data-model-name", model.sModelName);
                    $modelDiv.find(".mcsModelBox").attr("src", model.sIconPath);
                    $modelDiv.find(".mcsBoxName").html(model.sName);
                    $modelDiv.find(".mcsBoxDescription").html(model.sDescription);
                    $modelDiv.find(".mcsBoxDescription").attr("title", model.sDescription);
                    $(self.getId("#idMCSManagerResultDevs")).append($modelDiv);
                }
            });
        },

        displayExportation: function (aIdObjectType) {
            var self = this,
                opened = false,
                resultObjectsID = [];
            self.resultObjects.forEach(function (object) {
                resultObjectsID.push(object.ID);
            });

            var settingsExportation = {
                idOT: aIdObjectType,
                idObjects: resultObjectsID.join(";")
            }

            this.wdowExport = new CWindow({
                sName: "wExportationResultsMCS",
                sHeader: _("Exportation"),
                sIcon: 'temp_resources/theme/img/btn_titre/module_export-16.png',
                iWidth: 705,
                iHeight: 490,
                bDenyResize: true,
                bHidePark: true,
                onContentLoaded: function () {
                    if (opened) return;
                    var rDhxWindow = self.wdowExport.getWindow("wExportationResultsMCS");
                    settingsExportation.wdow = rDhxWindow;
                    rDhxWindow.getFrame().contentWindow.initInterface(settingsExportation);
                    opened = true;
                },
                sUrlAttached: _url('/code/TxWebExportation/TxWebExportation.asp')
            });
        },

        displaySimplifiedExportation: function () {
            var self = this;
            this.resultsLayout.progressOn();
            $.post(CTxMCS.wrapper,
                {
                    sFunctionName: "OnSimplifiedExport",
                    idSelection: this.idSelection,
                    bDisplayWrongMark: false
                },
                function (result) {
                    var results = result.split("|");
                    if (results[0] === sOk) {
                        var sPathFile = JSON.parse(results[1]).sFileName;
                        // Create new iframe (only if not already created)
                        if (!J('#iFrameUploadFile').length) {
                            J('body').append('<iframe id="iFrameUploadFile" name="iFrameUploadFile" src="#" style="width:0;height:0;border:0px solid #fff; display:none;"></iframe>');
                        }
                        J('#iFrameUploadFile')[0].contentDocument.location.replace(_url("/code/asp/ajax/open_file.asp?file=") + sPathFile);
                    } else
                        msgDevError(results[0]);

                    self.resultsLayout.progressOff();
                }
            );
        },

        displayExtraction: function (aIdObjectType) {
            var self = this,
                 resultObjectsID = [];
            self.resultObjects.forEach(function (object) {
                resultObjectsID.push(object.ID);
            });

            this.wExtraction = new CTxExtraction({
                idOT: aIdObjectType,
                idObjects: resultObjectsID.join(";")
            });
        },

        executeModel: function (aIdModelApplication, aObjectDependency, aKey) {
            var self = this;

            // set context variable before execute model
            $.post(
                _url("/code/asp/ajax/TxContextVariables_ajax.asp"),
                {
                    sFunctionName: "SetVariable",
                    sValue: this.idSelection,
                    sKey: aKey
                },
                function (result) {
                    var results = result.split("|");
                    if (results[0] === sOk) {
                        // get Ids of objects selected by MCS
                        var resultObjectsID = [];
                        self.resultObjects.forEach(function (object) {
                            resultObjectsID.push(object.ID);
                        });
                        //Initialize the settings for model application execution 
                        var settingsModel = {
                            idModelApplication: aIdModelApplication,
                            sObjectDependency: aObjectDependency,
                            idObjectType: self.mcs.idObjectType,
                            sObjectIds: resultObjectsID.join(";")
                        }
                        //launch the model application
                        var modAppExec = new CModelApplicationExecution(settingsModel, function (aDirectOutputs, aDummyData) {
                            // nothing to do with callback for moment
                        });
                    } else {
                        msgDevError(results[0]);
                    }
                }
            );
        },

        freeSelection: function () {
            var self = this;
            if (this.idSelection) {
                $.post(CTxMCS.wrapper,
                    {
                        sFunctionName: "FreeSelection",
                        idSelection: this.idSelection
                    },
                    function (result) {
                        var results = result.split("|");
                        if (results[0] === sOk) {
                            self.idSelection = null;
                        } else {
                            msgDevError(results[0]);
                        }
                    }
                );
            }
        }
    }

    return CTxMCSManager;
})(jQuery)