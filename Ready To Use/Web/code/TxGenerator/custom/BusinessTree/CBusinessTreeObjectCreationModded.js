/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        <aSettings from CTreeObject>
        aSettings.sIdDivToolbarCreation : add a toolbar to manage creation/deletion objects and move objects
 * @returns CTreeBusinessObject object.
 */

var CBusinessTreeObjectCreationModded = (function () {

    function CBusinessTreeObjectCreationModded(aSettings) {
        var self = this;

        aSettings.bSelectFirstNodeOnLoad = txASP.idObject == 0;
        txASP.businessViews.find(function (aView) {
            if (aView.ID == aSettings.idView){
                aSettings.levels = aView.Levels;
                return true;
            }
        });
        aSettings.onRename = function () {
            self.onSelect();
        }
        CTreeBusinessObject.call(this, aSettings);

        txASP.displayObject = function (aIdObject) {
            self.displayObject(aIdObject);
        }
    };

    //inheritage
    CBusinessTreeObjectCreationModded.prototype = createObject(CTreeBusinessObject.prototype);
    CBusinessTreeObjectCreationModded.prototype.constructor = CBusinessTreeObjectCreationModded; // Otherwise instances of CTreeOT would have a constructor of CTree

    CBusinessTreeObjectCreationModded.prototype.toString = function txToString() {
        return "CBusinessTreeObjectCreationModded Object";
    }

    CBusinessTreeObjectCreationModded.prototype.clearSelection = function () {
        CTreeBusinessObject.prototype.clearSelection.call(this, true);

        var array = this._superComponent.settings.functions["onSelect"];
        this._superComponent._changeDataStorage(array, []);
    }

    CBusinessTreeObjectCreationModded.prototype.onSelect = function (aIdNode) {
        var self = this;
        if (!this._superComponent.settings.functions) return;

        var txObjects = self.getTxIdSelected().split(";").map(function (aTxId) {
            return self.getNodeFromTxId(aTxId);
        }).filter(function (aObject) {
            return aObject !== undefined;
        });

        txObjects = txObjects.map(function (txObject) {
            return {
                ID: txObject.ID,
                ID_OT: txObject.ID_OT,
                ID_Parent: txObject.ID_Parent,
                iIcon: txObject.iIcon,
                iRight: txObject.iRight,
                sName: txObject.sName,
                bFolder: txObject.bFolder
            };
        });

        CTreeBusinessObject.prototype.onSelect.call(this, aIdNode);

        var array = self._superComponent.settings.functions["onSelect"];
        this._superComponent._changeDataStorage(array, txObjects);
    }

    CBusinessTreeObjectCreationModded.prototype.selectObject = function (aObjects) {
        if (!aObjects || aObjects.length > 1) return;
        if (!Array.isArray(aObjects)) {
            CTreeBusinessObject.prototype.selectObject.call(this, aObjects);
            return;
        }
        if (aObjects.length === 0) {
            this.tree.clearSelection();
            return;
        }
        var txObject = aObjects[0];
        if (this.idOT != aObjects[0].ID_OT && !this.nodes.find(function (node) { return node.ID === txObject.ID })) {
            this.displayObject(txObject.ID);
            return;
        }
        if (!txObject) return;
        if (txObject.ID == this.getTxIdSelected()) return;
        CTreeBusinessObject.prototype.selectObject.call(this, txObject.ID);
    }

    CBusinessTreeObjectCreationModded.prototype.displayObject = function (aIdObject) {
        var bSwitchToOtView = true,
        bOk = true,
        self = this;

        if (CTreeBusinessObject.prototype.selectObject.call(self, aIdObject)) {
            return;
        }

        var idView = txASP.getBusinessViewIdFromIdObject(aIdObject);
        if (this.idView > 0) {
            // we are actually in a real business view

            if (idView > 0) {
                if (idView != this.idView)
                    this._superComponent.displayView(idView);
            } else
                bSwitchToOtView = true;
        } else
            bSwitchToOtView = true;

        if (bSwitchToOtView) {
            var idOt = getObjectIdOT(aIdObject);

            //check if the fictive view exist
            bOk = checkOTExist(idOt);

            if (bOk) {
                if (idView > 0) {
                    try {
                        this._superComponent.displayView(idView);
                    } catch (e) {
                        this.clearSelection();
                        return;
                    }
                } else {
                    if (this._superComponent._isLoaded) {
                        msgYesNo(_("L'Entité n'a pu être trouvée dans aucune des Vues Métiers. Souhaitez-vous basculer en vue des Types d'Entités ?"),
                            function(aResult) {
                                if (aResult) {
                                    txASP.displayObjectTypeView(idOt, aIdObject);
                                } else {
                                    self.clearSelection();
                                }
                            });
                    } else {
                        self.clearSelection();
                    }
                }

            }
        }

        if (bOk) {
            setTimeout(function () {
                CTreeBusinessObject.prototype.selectObject.call(self, aIdObject);
            });
        } else
            msgWarning(_("L'Entité que vous tentez de visualiser a été supprimée, ou la vue métier / type d'Entité n'est pas visible."))
    }

    return CBusinessTreeObjectCreationModded;

})();