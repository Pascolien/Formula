/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        <aSettings from CTreeObject>
        aSettings.sIdDivToolbarCreation : add a toolbar to manage creation/deletion objects and move objects
 * @returns CTreeObjectCreation object.
 */

var CTreeObjectCreationModded = (function() {

    function CTreeObjectCreationModded(aSettings) {
        var self = this;
        aSettings.bSelectFirstNodeOnLoad = txASP.idObject == 0;
        aSettings.onRename = function () {
            self.onSelect();
        }
        CTreeObjectCreation.call(this, aSettings);

        txASP.displayObject = function (aIdObject, idTab) {
            if (idTab) {
                self._transmitIdTab = idTab;
            }
            self.displayObject(aIdObject);
        }
    };

    //inheritage
    CTreeObjectCreationModded.prototype = createObject(CTreeObjectCreation.prototype);
    CTreeObjectCreationModded.prototype.constructor = CTreeObjectCreationModded; // Otherwise instances of CTreeOT would have a constructor of CTree

    CTreeObjectCreation.prototype.toString = function txToString() {
        return "CTreeObjectCreation Object";
    }

    CTreeObjectCreationModded.prototype.clearSelection = function () {
        CTreeObjectCreation.prototype.clearSelection.call(this, true);

        var array = this._superComponent.settings.functions["onSelect"];
        this._superComponent._changeDataStorage(array, []);
    }

    CTreeObjectCreationModded.prototype.onSelect = function (aIdNode) {
        var self = this;
        if (!this._superComponent.settings.functions) return;

        var txObjects = self.getTxIdSelected().split(";").map(function (aTxId) {
            return self.getNodeFromTxId(aTxId);
        }).filter(function(aObject) {
            return aObject !== undefined;
        });

        var idTab = self._getAndErasetransmitIdTab();

        txObjects = txObjects.map(function (txObject) {
            return {
                ID: txObject.ID,
                ID_OT: txObject.ID_OT,
                ID_Parent: txObject.ID_Parent,
                iIcon: txObject.iIcon,
                iRight: txObject.iRight,
                sName: txObject.sName,
                bFolder: txObject.bFolder,
                idTab: idTab // TODO: enlever en TxGenerator v2 
            };
        });

        CTreeObjectCreation.prototype.onSelect.call(this, aIdNode);

        var array = self._superComponent.settings.functions["onSelect"];
        this._superComponent._changeDataStorage(array, txObjects);
    }

    CTreeObjectCreationModded.prototype.selectObject = function (aObjects) {
        
        if (!aObjects || aObjects.length > 1) return;
        if (!Array.isArray(aObjects)) {
            CTreeObjectCreation.prototype.selectObject.call(this, aObjects);
            return;
        }
        if (aObjects.length === 0) {
            if(this._superComponent._isLoaded) this.tree.clearSelection();
            return;
        }
        var txObject = aObjects[0];
        if (!txObject) return;
        if (txObject.ID == this.getTxIdSelected()) return;
        if (this.idOT != txObject.ID_OT) {
            this.displayObject(txObject.ID);
            return;
        }
        CTreeObjectCreation.prototype.selectObject.call(this, txObject.ID);
    }

    CTreeObjectCreationModded.prototype.displayObject = function (aIdObject) {
        var bSwitchToOtView = true,
            bOk = true,
            self = this;

        var idOt = getObjectIdOT(aIdObject);

        if (idOt === this.idOT) {
            CTreeObjectCreation.prototype.selectObject.call(this, aIdObject);
            return;
        }

        this.setTxIdToSelect(parseInt(aIdObject));

        if (bSwitchToOtView) {

            //check if the fictive view exist
            bOk = checkOTExist(idOt);
            if (bOk)
                try {
                    this._superComponent.updateCombo(idOt);
                } catch (e) {
                    this.clearSelection();
                    return;
                }
        }

        if (!bOk) 
            msgWarning(_("L'Entité que vous tentez de visualiser a été supprimée, ou la vue métier / type d'Entité n'est pas visible."))
    }

    // A gérer dans la v2 du txGenerator
    CTreeObjectCreationModded.prototype._getAndErasetransmitIdTab = function () {
        var idTab = this._transmitIdTab;
        delete this._transmitIdTab;
        return idTab;
    }

    return CTreeObjectCreationModded;

})();