/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        <aSettings from CComboBoxOT>
 * @returns CBusinessComboBoxOTModded object.
 */

var CBusinessComboBoxOTModded = function (aSettings) {
    aSettings.sHint = txASP.sOTHint;
    aSettings.txObjects = txASP.businessViews,
    aSettings.iDefaultValueSelected = txASP.idView;

    this.sOTHints = [{ idOt: txASP.idOT, sOTHint: txASP.sOTHint }];
    this.settings = aSettings;
    CComboBox.call(this, aSettings);
};

//inheritage
CBusinessComboBoxOTModded.prototype = createObject(CComboBox.prototype);
CBusinessComboBoxOTModded.prototype.constructor = CBusinessComboBoxOTModded;

CBusinessComboBoxOTModded.prototype.displayViewFromIdOT = function (aIdOt) {

    if (this.getOptionFromField("ID_OT", aIdOt)) {

        if (aIdOt === this.getSelectedOptionModded().ID_OT) {
            // if OTPortal we need to select first one.
            if (aIdOt == idOTPortal) {
                this._superComponent.tree.clearSelection();
                this._superComponent.tree.selectFirstNode();
                setTimeout(function () {
                    self._superComponent._collapseParentCell();
                });
            }
            return;
        }
        this.selectOptionFromField("ID_OT", aIdOt);
    } else {
        if (!this._superComponent._isLoaded) return;
        msgYesNo(_("Le Type d'Entité n'a pu être trouvé dans aucune des Vues Métiers. Souhaitez-vous basculer en vue des Types d'Entités ?"),
            function(aResult) {
                if (aResult) {
                    txASP.displayObjectTypeView(aIdOt);
                }
            });
    }
}

CBusinessComboBoxOTModded.prototype.onChange = function () {
    var self = this;
    self._superComponent._expandParentCell();
    var view = this.getSelectedOptionModded();
    if (this.rView === view) return;
    this.rView = view;
    this._superComponent.tree.bSelectFirstNodeOnLoad = view.ID_OT === idOTPortal;

    this._superComponent.tree.reset(view);
    this._superComponent.tree.clearSelection(true);

    if (view.ID_OT === idOTPortal) {
        setTimeout(function() {
            self._superComponent._collapseParentCell();
        });
    } else {
        self._superComponent._expandParentCell();
    }
    this.getOTHint();
    var array = this._superComponent.settings.functions["onChange"];
    this._superComponent._changeDataStorage(array, view.ID_OT);
}

CBusinessComboBoxOTModded.prototype.getSelectedOptionModded = function () {
    return this.getSelectedOption();
}

CBusinessComboBoxOTModded.prototype.displayHome = function () {
    if (parseInt(this.getSelectedOptionModded().ID_OT) === idOTPortal) return;
    var array = this._superComponent.settings.functions["onChange"];
    this._superComponent._changeDataStorage(array, 4);
    this._superComponent.tree.clearSelection(true);
    txASP.displayObjectTypeView(idOTPortal);
}

CBusinessComboBoxOTModded.prototype.getOTHint = function () {
    var self = this;
    var idOt = self.getSelectedOptionModded().ID_OT;
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