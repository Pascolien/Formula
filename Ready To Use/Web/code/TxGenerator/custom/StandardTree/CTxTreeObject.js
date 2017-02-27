/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
 * @returns CTxTreeObject object.
 */

var CTxTreeObject = function (aSettings) {
    J("#idDivNavigationToolbarCreation").css("display", "block");

    var self = this;
    var comboSettings = aSettings.comboBox;
   
    var treeSettings = aSettings.tree;
    treeSettings.idOT = txASP.idOT;
    treeSettings.sIdDivTree = aSettings.tree.sIdDiv;
    this.settings = aSettings;

    this.combo = new CComboBoxOTModded(comboSettings);
    this.tree = new CTreeObjectCreationModded(treeSettings);

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
        "displayHome": ["displayHome"],
    }
    var cell = aSettings._getParentCell();
    setTimeout(function () {
        self._getParentLayout().layout.attachEvent("onCollapse", function (aIdItem) {
            if (aIdItem === "a") {
                var array = self._settings.functions["onCollapseNav"];
                self._changeDataStorage(array, (new Date()).toString());
            }
        });

        self._getParentLayout().layout.attachEvent("onExpand", function (aIdItem) {
            if (aIdItem === "a") {
                var array = self._settings.functions["onExpandNav"];
                self._changeDataStorage(array, (new Date()).toString());
            }
        });
    }, 0);

    if (txASP.idOT === idOTPortal) {
        // In case of portal load all branches & nodes BEFORE collapse the tree's cell
        // because when cell is collapsed it's not possible to load branch in the tree
        this.tree.expand();
        this.tree.collapse();
        setTimeout(function() {
            cell.showHeader();
            cell.collapse();
        });
    } else {
        setTimeout(function() {
            cell.hideHeader();
            cell.expand();
        });
    }
    if (txASP.idObject > 0) {
        setTimeout(function () {
            txASP.displayObject(txASP.idObject, txASP.idTab);
        }, 200);
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

    txASP.addObject = function (aMandatoryAttTags) {
        self.tree.toolbarOnClick(btnAddObject, aMandatoryAttTags);
    }

};

CTxTreeObject.prototype.collapseCell = function () {
    this._collapseParentCell();
}

CTxTreeObject.prototype.updateCombo = function (aIdOt) {
    this.combo.update(aIdOt);
}

CTxTreeObject.prototype.displayView = function (aIdView) {
    this.combo.selectOptionFromTxId(aIdView);
}

CTxTreeObject.prototype.displayObject = function (aIdOt) {
    this.tree.displayObject(aIdOt);
}

CTxTreeObject.prototype.updateTree = function (aObject) {
    var txObject = aObject.txObject,
        objectToUpdate = aObject.instructions;
    
    if (objectToUpdate && objectToUpdate.length > 0)
        this.tree.updateTree(objectToUpdate);
}

CTxTreeObject.prototype.displayHome = function () { this.combo.update(idOTPortal); }

CTxTreeObject.prototype.selectTreeObject = function (aObjects) {
    this.tree.selectObject(aObjects);
}

CTxTreeObject.prototype.executeAdvancedCreation = function (aIdAdvancedCreation) {
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
            var results = aResult.split("|");
            if (results[0] == sOk) {
                var advancedCreation = JSON.parse(results[1]);
                self.updateCombo(advancedCreation.ID_OT);
                setTimeout(function () { self.tree.addSister("", false, [advancedCreation]); }, 100);
            } else {
                msgWarning(results[0]);
            }
        }
    });
}
