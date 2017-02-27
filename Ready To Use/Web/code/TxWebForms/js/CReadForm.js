var CReadForm = (function () {

    function CReadForm(aSettings) {
        var self = this;
        if (!aSettings)
            return;

        this.settings = aSettings;

        this.idTab = 0;

        checkMandatorySettings(aSettings, ["sIdDiv"]);

        var sDivName = "#" + aSettings.sIdDiv;

        J(sDivName).html('<div id="idDivFormContainer">\
            <div id="idDivTabbarForm"></div>\
            <div id="idDivForm"></div>\
            <div id="idDivBlank"></div>\
        </div>');

        J("#idDivFormContainer").on("click", "a", function (e) {
            e.preventDefault();
            var idObject;
            if (J(this).data("navigation")) {
                idObject = J(this).data("idobject");
                txASP.displayObject(idObject);
            }
            if (J(this).attr("href"))
                if (J(this).attr("href").indexOf("/temp_resources/portals/navigation.asp?ID_Obj=") > -1) {
                    var url = J(this).attr("href");
                    idObject = getURLParameter("ID_Obj", url);
                    if (!idObject) return false;
                    txASP.displayObject(idObject);
                    return false;
                }
        });

        this.functionsToExecute = {
            "idOT": ["changeObjectType"],
            "txObjs": ["onObjectSelected"],
            "update": ["refreshForm"],
            "idTab": ["changeIdTab"]
        }

        function resize() {
            if (self.txForm)
                setTimeout(function () { self.txForm.onWindowResized(); }, 100);
        }

        setTimeout(function() {
            self._getParentLayout().layout.attachEvent("onPanelResizeFinish", resize);
            self._getParentLayout().layout.attachEvent("onResizeFinish", resize);
        });
    };

    CReadForm.prototype = {
        tabbarOnSelect: function (aId) {
            if (aId === this.idTab)
                return;
            this.idTab = aId;

            var array = this.settings.functions["tabbarOnSelect"];
            this._changeDataStorage(array, aId);
        },

        changeIdTab: function(aIdTab) {
            this.idTab = aIdTab;
        },

        refreshTabContent: function (aIdObject, aId) {
            this.idTab = aId;
            this.getFormTab(aIdObject, aId);
        },

        showBlank: function () {
            if (J(document).find("#idDivFormContainer").length > 0)
                this._getParentCell().attachObject("idDivFormContainer");
            J("#idDivTabbarForm").hide();
            J("#idDivForm").hide();
            J("#idDivBlank").show();
            J("#idACopyToClipboard").hide();
        },

        changeObjectType: function () {
            this.idTab = 0;
            this.onObjectSelected([]);
        },

        onObjectSelected: function (aObjects) {
            if (!aObjects || aObjects.length !== 1) {
                this.showBlank();
                return;
            }

            J("#idACopyToClipboard").show();

            this.txObject = aObjects[0];
            this.idTab = this.txObject.idTab || (this.idOt === this.txObject.ID_OT ? this.idTab : 0);
            this.idOt = this.txObject.ID_OT;

            var self = this,
                idObject = this.txObject.ID;
            J("#idDivForm").empty();

            //display form read
            if (this.txObject.bFolder) {
                self.showBlank();
            } else {
                if (this.idOt === idOTPortal) {
                    this.getFormTab(idObject, 0, true);
                } else {
                    self._getParentCell().attachObject("idDivFormContainer");
                    this.getFormTab(idObject, this.idTab);

                    J("#idDivTabbarForm").show();
                    J("#idDivForm").show();
                    J("#idDivBlank").hide();
                }
            }
        },

        refreshForm: function () {
            this.onObjectSelected([this.txObject]);
        },

        getFormTab: function (aIdObject, aIdTab, aPortals) {
            var self = this,
                bPortals = getValue(aPortals, false);

            if (bPortals) {
                J("#idDivForm").hide();
                self._getParentCell().attachObject("idDivFormContainer");
                self._getParentCell().detachObject("idDivFormContainer");
            }

            if (bPortals)
                J.ajax({
                    url: sPathTxAspAjax,
                    async: false,
                    cache: false,
                    data: {
                        sFunctionName: "getFormTab",
                        idObject: aIdObject,
                        idTab: aIdTab,
                        bPortals: bPortals
                    },
                    success: function (aResult) {
                        var results = aResult.split("|");
                        if (results[0] == sOk) {
                            var sReadForm = results[1];
                            sReadForm = sReadForm.substr(sReadForm.lastIndexOf("../") + 2);

                            self._getParentCell().attachObject("idDivFormContainer");
                            self._getParentCell().detachObject("idDivFormContainer");
                            self._getParentCell().attachURL(_url(sReadForm));
                        } else {
                            msgWarning(results[0]);
                        }                        
                    }
                });
            else {
                self._getParentCell().attachObject("idDivFormContainer");
                self.txForm = new CTxForm({
                    sIdDivContainer: "idDivForm",
                    bWriteMode: false,
                    idObject: aIdObject,
                    idTabSelected: aIdTab,
                    idOT: self.idOt,
                    onSelectTab: function (aId) { 
						self.tabbarOnSelect(aId);
						
						// check models applications to execute onTabDisplay
						J.ajax({
                            url: _url("/code/TxModelApplication/TxModelApplicationAjax.asp"),
                            async: true,
                            cache: false,
                            type: "post",
                            data: {
                                sFunctionName: "ExecuteModelApplicationOnSpecificEvent",
                                idObjectType: self.idOt,
                                idObject: aIdObject,
                                sEvent: "eOnTabDisplay",
                                sIdAttributes: "" + aIdTab
                            },
                            success: function (aResult) {
                                var results = aResult.split("|");
                                if (results[0] == sOk) {
                                    var modelApplicationCommands = JSON.parse(results[1]);
                                    self.manageModelApplicationCommnads(modelApplicationCommands);
                                } else
                                    msgWarning(results[0]);
                            }
                        });
					}
                });
				
				// check models applications to execute onShowObject
                J.ajax({
                    url: _url("/code/TxModelApplication/TxModelApplicationAjax.asp"),
                    async: true,
                    cache: false,
                    type: "post",
                    data: {
                        sFunctionName: "ExecuteModelApplicationOnSpecificEvent",
                        idObjectType: self.idOt,
                        idObject: aIdObject,
                        sEvent: "eOnShowObject",
                        sIdAttributes: sNull
                    },
                    success: function (aResult) {
                        var results = aResult.split("|");
                        if (results[0] == sOk) {
                            var modelApplicationCommands = JSON.parse(results[1]);
                            self.manageModelApplicationCommnads(modelApplicationCommands);
                        } else
                            msgWarning(results[0]);
                    }
                });
            }
        },
		
		manageModelApplicationCommnads: function (aCommands) {
            aCommands.forEach(function (aCommand) {
                // For moment only messages returned are treated
                if (isAssigned(aCommand.sMsg))
                    msgWarning(aCommand.sMsg);
            });
        },

        checkObjectLocked: function () {
            if (this.iLockingType == ltNone)
                return;

            var self = this;

            J.ajax({
                url: sPathTxAspAjax,
                async: false,
                cache: false,
                data: {
                    sFunctionName: "checkObjectLocked",
                    idObject: self.getSelectedObjectIds(),
                    iRWMode: 1
                },
                success: function (aResult) {
                    var results = aResult.split("|");
                    if (results[0] == sOk) {
                        iLockingState = parseInt(results[1]);
                        iRWMode = results[2];
                        self.mainToolbar.updateLockingButton(iLockingState);
                    } else {
                        msgWarning(results[0]);
                    }

                }
            });
        }
    }
    return CReadForm;
})();
