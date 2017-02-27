/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
 * @returns CTxBusinessTree object.
 */

var CTxBusinessTree = function (aSettings) {
    var comboSettings = aSettings.comboBox;
    var treeSettings = aSettings.tree;
    treeSettings.sIdDivTree = aSettings.tree.sIdDiv;
    treeSettings.idView = txASP.idView;
    
    J("#idDivNavigationToolbarCreation").css("display", "none");

    this.isInitialized = false;
    this.settings = aSettings;
    this.combo = new CBusinessComboBoxOTModded(comboSettings);
    this.tree = new CBusinessTreeObjectCreationModded(treeSettings);

    // C'est mal :/
    txASP.tree = this.tree;

    this.combo._superComponent = this;
    this.tree._superComponent = this;

    this.functionsToExecute = {
        "idOT": ["updateCombo"],
        "businessView": ["displayHome"],
        "cell": ["collapseCell"],
        "txObjs": ["selectTreeObject"],
        "treeUpdateRequest": ["updateTree"],
        "idObject": ["displayObject"],
        "displayHome": ["displayHome"]
    }

    var self = this;
    setTimeout(function () {
        self._getParentCell().expand();
    }, 400);

    // Refocaliser l'entité en cours, si TE present dans les vues
    if (txASP.idObject > 0) {
        setTimeout(function () {
            if (txASP.getBusinessViewIdFromIdObject(txASP.idObject) > 0) {
                self.displayObject(txASP.idObject);
            } else {
                self.tree.clearSelection();
            }
        }, 500); // Doit être superieur au timeout de l'expand
    }

    txASP.displayViewFromIdOT = function (aIdOt) {
        self.updateCombo(aIdOt);
    }

    txASP.displayView = function (aIdView) {
        self.displayView(aIdView);
    }

    txASP.executeAdvancedCreation = function (aIdAdvancedCreation) {
        self.executeAdvancedCreation(aIdAdvancedCreation);
    }

    txASP.showPortalNavigation = function () {
        self._getParentCell().expand();
    }

    txASP.hidePortalNavigation = function () {
        self.collapseCell();
    }

    txASP.selectCurrentObject = function () {
        self._changeDataStorage(["refreshForm"], (new Date()).toString());
    }
};

CTxBusinessTree.prototype.onCollapseNavTree = function () {
    var array = this.settings.functions["onCollapseNavTree"];
    this._changeDataStorage(array, (new Date()).toString());
}

CTxBusinessTree.prototype.collapseCell = function () {
    this._collapseParentCell();
}

CTxBusinessTree.prototype.updateCombo = function (aIdOt) { this.combo.displayViewFromIdOT(aIdOt); }

CTxBusinessTree.prototype.displayView = function (aIdView) {
    this.combo.selectOptionFromTxId(aIdView);
}

CTxBusinessTree.prototype.displayObject = function (aIdOt) {
    this.tree.displayObject(aIdOt);
}

CTxBusinessTree.prototype.updateTree = function (aObject) {
    var txObject = aObject.txObject,
        objectToUpdate = aObject.instructions;

    //this.tree.idOT = txObject.ID_OT; // update ID_OT for update Tree
    if (!objectToUpdate) objectToUpdate = [];
    objectToUpdate = mergeWebModelJsonInstructions([{ "updateObject": txObject }], objectToUpdate); // force presence of current object
    if (objectToUpdate.length > 0) this.tree.updateTree(objectToUpdate);
}

CTxBusinessTree.prototype.displayHome = function () {
    this.combo.displayHome();
}

CTxBusinessTree.prototype.selectTreeObject = function (aObjects) {
    this.tree.selectObject(aObjects);
}

CTxBusinessTree.prototype.executeAdvancedCreation = function (aIdAdvancedCreation) {
    aIdAdvancedCreation = getValue(aIdAdvancedCreation, 0);
    if (aIdAdvancedCreation == 0)
        return;

    var self = this;

    J.ajax({
        url: sPathTxAspAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "getAdvancedCreation",
            idAdvancedCreation: aIdAdvancedCreation
        },
        success: function (aResult) {
            var arrResult = aResult.split("|");
            if (arrResult[0] == sOk) {
                var advancedCreation = JSON.parse(results[1]);
                self.updateCombo(advancedCreation.ID_OT);
                self.tree.addSister("", false, [advancedCreation]);
            } else {
                msgWarning(arrResult[0]);
            }
        }
    });
}