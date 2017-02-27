/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        <aSettings from CComboBoxOT>
 * @returns CComboBoxOTModded object.
 */

var CComboBoxOTModded = function (aSettings) {
    aSettings.sHint = txASP.sOTHint;
    aSettings.iDefaultValueSelected = txASP.idOT;
    aSettings.bHideInvisibles = true;

    this.sOTHints = [{ idOt: txASP.idOT, sOTHint: txASP.sOTHint }];
    this.settings = aSettings;
    CComboBoxOT.call(this, aSettings);
};

//inheritage
CComboBoxOTModded.prototype = createObject(CComboBoxOT.prototype);
CComboBoxOTModded.prototype.constructor = CComboBoxOTModded;

CComboBoxOTModded.prototype.update = function (aIdOT) {
    var self = this;
    if (aIdOT == this.getSelectedValue()) {
        // if OTPortal we need to select first one.
        if (aIdOT == idOTPortal) {
            if (this._superComponent.tree.txIdsToOpen.length === 0) this._superComponent.tree.selectFirstNode();
            // In case of portal load all branches & nodes BEFORE collapse the tree's cell
            // because when cell is collapsed it's not possible to load branch in the tree
            this._superComponent.tree.expand();
            this._superComponent.tree.collapse();
            setTimeout(function() {
                self._superComponent._collapseParentCell();
            });
        }
        return;
    }
    this.selectOptionFromTxId(aIdOT);
}

CComboBoxOTModded.prototype.onChange = function (aIdOT) {
    var self = this;
    var idOt = parseInt(getValue(aIdOT,this.getSelectedValue()));
    //if (this.idOT === idOt) return;
    this.idOT = idOt;
    this._superComponent.tree.bSelectFirstNodeOnLoad = idOt === idOTPortal && this._superComponent.tree.txIdsToOpen.length === 0;
    this._superComponent.tree.reset(idOt);

    if (idOt === idOTPortal) {
        // In case of portal load all branches & nodes BEFORE collapse the tree's cell
        // because when cell is collapsed it's not possible to load branch in the tree
        this._superComponent.tree.expand();
        this._superComponent.tree.collapse();
        setTimeout(function() {
            self._superComponent._collapseParentCell();
        }, 200);
    } else {
        setTimeout(function() {
            self._superComponent._expandParentCell();
        });
    }
    this.getOTHint();
    var array = this._superComponent.settings.functions["onChange"];
    this._superComponent._changeDataStorage(array, this.getSelectedValue());
    this._superComponent.tree.clearSelection(true);
    // Remove the focus from combo, and prevent its opening by keypress event
    document.activeElement.blur();
}

CComboBoxOTModded.prototype.getOTHint = function () {
    var self = this;
    var idOt = self.idOT;
    var otHint = self.sOTHints.find(function (elem) {
        return elem.idOt = idOt;
    });
    if (otHint) {
        self.setHint(otHint.sOTHint);
    }
    J.ajax({
        url: sPathFileComponentsAjax,
        cache: false,
        data: {
            sFunctionName: "getOTHint",
            idOT: idOt
        },
        success: function (data) {
            var arrResult = data.split("|");
            if (arrResult[0] === sOk) {
                self.sOTHints.push({ idOt: idOt, sOTHint: arrResult[1] });
                self.setHint(arrResult[1]);
            } else {
                msgDevError(arrResult[0]);
            }
        }
    });
}