/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.btns : Json toolbar buttons parameters.*** MANDATORY ***
            btns = [
                {sId : this id will be concat with the uniqueId of the class, sUniqueId:"", iBtnType:"", sCaption:"", sHint:"", bDisabled:true/false, onClick:"", bSubmit: true/false by default}
            ];
        aSettings.sIdDivParent: the div id which contains the barButtons *** MANDATORY ***
 * @returns CButtonBar object.
 */

//enum ToolbarButtonType
var btValidate = "btValidate",
    btClose = "btClose",
    btOk = "btOk",
    btCancel = "btCancel",
    btYes = "btYes",
    btSave = "btSave",
    btDelete = "btDelete",
    btNo = "btNo";

var CButtonBar = function (aSettings) {
    checkMandatorySettings(aSettings, ["btns", "sIdDivParent"]);

    this.sUniqueId = getUniqueId();
    this.sIdDivParent = aSettings.sIdDivParent;
    this.buttons = [];

    var self = this;
    J("#" + this.sIdDivParent).css({
        "width": "100%",
        "height": "35px",
        "position": "absolute",
        "bottom": "0px",
        "text-align": "right",
        "margin-right": "5px"
    });
    J("#" + this.sIdDivParent).html("");
    aSettings.btns.forEach(function (aBtn) {
        self.addButton(aBtn);
    });
};

CButtonBar.prototype.toString = function() {
    return "CButtonBar";
}

CButtonBar.prototype.addButton = function (aBtn) {
    if (!isAssigned(aBtn))
        return;

    var sCaption = "",
        sId = "",
        sUniqueId = "",
        bDisabled = getValue(aBtn.bDisabled, false),
        bInserted = getValue(aBtn.bInserted, false),
        bSubmit = getValue(aBtn.bSubmit, false),
        bHidden = getValue(aBtn.bHidden, false);

    switch (aBtn.iBtnType) {
        case btValidate:
            sCaption = _("Valider");
            sId = 'validate';
            break;
        case btClose:
            sCaption = _("Fermer");
            sId = 'close';
            break;
        case btOk:
            sCaption = "Ok";
            sId = 'ok';
            break;
        case btCancel:
            sCaption = _("Annuler");
            sId = 'cancel';
            break;
        case btYes:
            sCaption = _("Oui");
            sId = 'yes';
            break;
        case btNo:
            sCaption = _("Non");
            sId = 'no';
            break;
        case btSave:
            sCaption = _("Enregistrer");
            sId = 'save';
            break;
        case btDelete:
            sCaption = _("Supprimer");
            sId = 'delete';
            break;
    }
    sCaption = getValue(aBtn.sCaption, sCaption);
    sId = getValue(aBtn.sId, sId);
    sUniqueId = getValue(aBtn.sUniqueId, sId + this.sUniqueId)

    var sHint = getValue(aBtn.sHint, sCaption),
        button = {
            sUniqueId: sUniqueId,
            sId: sId,
            sHint : sHint,
            sCaption: sCaption,
            onClick: aBtn.onClick,
            bHidden: bHidden,
            bDisabled: bDisabled
        }

    var sType = bSubmit ? "submit" : "button",
        sInput = '<div style="display:inline;"><input id="' + button.sUniqueId + '" title="' + sHint + '" type="' + sType + '" value="' + sCaption + '" class="clBtn" /></div>';
    if (bInserted)
        J("#" + this.sIdDivParent).prepend(sInput);
    else
        J("#" + this.sIdDivParent).append(sInput);

    J("#" + button.sUniqueId).click(button.onClick);
    if (button.bDisabled)
        J("#" + button.sUniqueId).attr("disabled", "disabled");

    if (button.bHidden)
        J("#" + button.sUniqueId).css("display", "none");

    this.buttons.push(button);
}

CButtonBar.prototype.getButton = function (aId, aFromSid) {
    aFromSid = getValue(aFromSid, false);

    var button;
    this.buttons.find(function (aButton) {
        if (aFromSid) {
            if (aButton.sId == aId) {
                button = aButton;
                return true;
            }
        } else {
            if (aButton.sUniqueId == aId) {
                button = aButton;
                return true;
            }
        }
    });
    return button;
}

CButtonBar.prototype.enableButton = function (aId, aFromSid) {
    var button = this.getButton(aId, aFromSid);
    if (isAssigned(button)) {
        button.bDisabled = false;
        J("#" + button.sUniqueId).removeAttr("disabled");
    }
};

CButtonBar.prototype.disableButton = function (aId, aFromSid) {
    var button = this.getButton(aId, aFromSid);
    if (isAssigned(button)) {
        button.bDisabled = true;
        J("#" + button.sUniqueId).attr("disabled", "disabled");
    }
};

CButtonBar.prototype.setButtonEnable = function (aId, aEnabled, aFromSid) {
    aEnabled = getValue(aEnabled, true);

    if (aEnabled)
        this.enableButton(aId, aFromSid);
    else
        this.disableButton(aId, aFromSid);
}

CButtonBar.prototype.disableAllButtons = function () {
    var self = this;
    this.buttons.forEach(function (aButton) {
        self.disableButton(aButton.sUniqueId);
    });
};

CButtonBar.prototype.enableAllButtons = function () {
    var self = this;

    this.buttons.forEach(function (aButton) {
        self.enableButton(aButton.sUniqueId);
    });
};

CButtonBar.prototype.setAllButtonsEnable = function (aEnable) {
    aEnable = getValue(aEnable, true);

    if (aEnable)
        this.enableAllButtons();
    else
        this.disableAllButtons();
}

CButtonBar.prototype.disableButtons = function (aBtnsIds, aFromSid) {
    var self = this;

    aBtnsIds.forEach(function (aId) {
        self.disableButton(aId, aFromSid);
    });
};

CButtonBar.prototype.enableButtons = function (aBtnsIds, aFromSid) {
    var self = this;

    aBtnsIds.forEach(function (aId) {
        self.enableButton(aId, aFromSid);
    });
};

CButtonBar.prototype.setButtonsEnable = function (aBtnsIds, aEnable, aFromSid) {
    aEnable = getValue(aEnable, true);

    if (aEnable)
        this.enableButtons(aBtnsIds, aFromSid);
    else
        this.disableButtons(aBtnsIds, aFromSid);
}

CButtonBar.prototype.isEnabled = function (aId, aFromSid) {
    var button = this.getButton(aId, aFromSid);
    return isAssigned(button) ? !button.bDisabled : false;
};

CButtonBar.prototype.hideButton = function (aId, aFromSid) {
    var button = this.getButton(aId, aFromSid);
    if (isAssigned(button)) {
        button.bHidden = true;
        J("#" + button.sUniqueId).css("display", "none");
    }
};

CButtonBar.prototype.showButton = function (aId, aFromSid) {
    var button = this.getButton(aId, aFromSid);
    if (isAssigned(button)) {
        button.bHidden = false;
        J("#" + button.sUniqueId).css("display", "inline");
    }
};

CButtonBar.prototype.setButtonVisible = function (aId, aVisible, aFromSid) {
    if (getValue(aVisible, true))
        this.showButton(aId, aFromSid);
    else
        this.hideButton(aId, aFromSid);
}

CButtonBar.prototype.isVisible = function (aId, aFromSid) {
    var button = this.getButton(aId, aFromSid);
    return !button.bHidden;
};

CButtonBar.prototype.isButtonExist = function (aId, aFromSid) {
    var button = this.getButton(aId, aFromSid);
    return isAssigned(button);
};

CButtonBar.prototype.removeButton = function (aId, aFromSid) {
    var button = this.getButton(aId, aFromSid);
    if (isAssigned(button)) {
        J("#" + button.sUniqueId).parent('div').remove();
    }
};

CButtonBar.prototype.getButtonCaption = function (aId, aFromSid) {
    var button = this.getButton(aId, aFromSid);
    return button.sCaption;
};

CButtonBar.prototype.setButtonCaption = function (aId, aCaption, aFromSid) {
    var button = this.getButton(aId, aFromSid);
    if (isAssigned(button)) {
        button.sCaption = _(aCaption);
        J("#" + button.sUniqueId).val(button.sCaption);
    }
};
