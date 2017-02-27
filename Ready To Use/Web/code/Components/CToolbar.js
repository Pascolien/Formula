/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.sIdDivToolbar *** MANDATORY ***
        aSettings.sIconPath 
        aSettings.sSkin : "dhx_skyblue" by default.
        aSettings.iIconSize : "dhx_skyblue" by default.
        aSettings.btns : Json toolbar buttons parameters.
            btns = [
                {sId:"",iBtnType:"", iPos:"", sCaption:"", sHint:"", sImgEnabled:"", sImgDisabled:"",bAsSelect:true/false, bKeepSelect:true/false, bDisabled:true/false, bAddSpacer:true/false, options:[], iMaxOpen:number, sInputValue:"", iInputWidth:number}
            ];
        aSettings.onClick : the javascript function to call when a button / option is clicked.
        aSettings.onEnter : the javascript function to call when the enter keyboard is pressed for an input text.
        aSettings.onStateChange : the javascript function to call when the user changes the state of a two-state button.
 * @returns CToolbar object.
 */

//enum ToolbarButtonType
var tbtSimple = "tbtSimple";
var tbtSelect = "tbtSelect";
var tbtTwoState = "tbtTwoState";
var tbtInput = "tbtInput";
var tbtSeparator = "tbtSeparator";
var tbtSlider = "tbtSlider";
var tbtText = "tbtText";

//teexma buttons
var btnDisplaySelection = "btnDisplaySelection",
    btnDisplayTree = "btnDisplayTree",
    btnCheckAll = "btnCheckAll",
    btnUnCheckAll = "btnUnCheckAll",
    btnSearchLabel = "btnSearchLabel",
    btnSearchInput = "btnSearchInput",
    btnAddObject = "btnAddObject",
    btnAddChild = "btnAddChild",
    btnRemoveObject = "btnRemoveObject",
	btnAddLink = "btnAddLink",
    btnRemoveLink = "btnRemoveLink",
    btnMoveDown = "btnMoveDown",
    btnMoveUp = "btnMoveUp",
    btnFullScreen = "btnFullScreen",
    btnEdit = "btnEdit";

var CToolbar = function (aSettings) {
	if (!aSettings)
        return;

    if (aSettings.sIdDiv)
        aSettings.sIdDivToolbar = aSettings.sIdDiv;

    checkMandatorySettings(aSettings, ["sIdDivToolbar"]);

    this.sIdDiv = aSettings.sIdDivToolbar;
    this.toolbar;
    this.btns = [];
    this.iCount = 1;

    var self = this,
        sIconPath = getValue(aSettings.sIconPath, _url('/resources/theme/img/iconsToolbar/')),
        sSkin = getValue(aSettings.sSkin, 'dhx_skyblue'),
        iIconSize = getValue(aSettings.iIconSize, 16);

    this.toolbar = new dhtmlXToolbarObject(this.sIdDiv);
    this.toolbar.setIconPath(sIconPath);
    this.toolbar.setSkin(sSkin);
    this.toolbar.setIconSize(iIconSize);

    aSettings.btns.forEach(function (aButton) {
        self.addButton(aButton);
    });

    if (!isEmpty(aSettings.onClick))
        this.attachEvent("onClick", aSettings.onClick);

    if (!isEmpty(aSettings.onEnter))
        this.attachEvent("onEnter", aSettings.onEnter);

    if (!isEmpty(aSettings.onStateChange))
        this.attachEvent("onStateChange", aSettings.onStateChange);
};

CToolbar.prototype.toString = function() {
    return "CToolbar";
}

CToolbar.prototype.unload = function () {
    this.toolbar.unload();
    this.toolbar = null;
}

CToolbar.prototype.attachEvent = function (aEventName,aFunction) {
    this.toolbar.attachEvent(aEventName, aFunction);
}

CToolbar.prototype.addButton = function (aButton) {
    var iPos = getValue(aButton.iPos, this.iCount),
        bAddSpacer = getValue(aButton.bAddSpacer, false),
        bDisabled = getValue(aButton.bDisabled, false),
        bHide = getValue(aButton.bHide, false),
        sHint = getValue(aButton.sHint),
        iBtnType = getValue(aButton.iBtnType, tbtSimple),
        bAddSeparator = getValue(aButton.bAddSeparator, false),
        bPressed = aButton.bPressed;

    switch (iBtnType) {
        case tbtSimple:
            this.toolbar.addButton(aButton.sId, iPos, aButton.sCaption, aButton.sImgEnabled, aButton.sImgDisabled);
            break;
        case tbtSelect:
            var iMaxOpen = getValue(aButton.iMaxOpen, 5),
                bAsSelect = getValue(aButton.bAsSelect, true),
                bKeepSelect = getValue(aButton.bKeepSelect, true),
                sMode = (bAsSelect) ? "select" : "",
                sKeepSelect = (bKeepSelect) ? "true" : "disabled",
                options = isEmpty(aButton.options) ? [] : aButton.options;

            this.toolbar.addButtonSelect(aButton.sId, iPos, aButton.sCaption, [], aButton.sImgEnabled, aButton.sImgDisabled, sKeepSelect, true, iMaxOpen, sMode);
            this.addListOptions(aButton.sId, options);
            break;
        case tbtTwoState:
            this.toolbar.addButtonTwoState(aButton.sId, iPos, aButton.sCaption, aButton.sImgEnabled, aButton.sImgDisabled);
            break;
        case tbtInput:
            this.toolbar.addInput(aButton.sId, iPos, aButton.sInputValue, aButton.iWidth);
            break;
        case tbtSeparator:
            this.toolbar.addSeparator(aButton.sId, iPos);
            break;
        case tbtSlider:
            //toolbar.addSlider(aButton.sId, iPos, len, valueMin, valueMax, valueNow, textMin, textMax, tip);
            break;
        case tbtText:
            this.toolbar.addText(aButton.sId, iPos, aButton.sCaption);
            break;
    }
    // Add immediatly button (need to retrieve it later if disabled)
    this.btns.push(aButton);
    this.iCount++;

    if (bAddSpacer)
        this.toolbar.addSpacer(aButton.sId);

    if (bHide)
        this.hideItem(aButton.sId);

    if (bDisabled)
        this.disableItem(aButton.sId);

    if (isAssigned(bPressed))
        this.setItemState(aButton.sId, bPressed);

    if (bAddSeparator) {
        this.toolbar.addSeparator(qc(aButton.sId,"Sep"), iPos);
        this.iCount++;
    }

    this.setItemToolTip(aButton.sId, sHint);
}

CToolbar.prototype.getButton = function (aId) {
    var button;
    return this.btns.find(function (aButton) {
        return aButton.sId == aId;
    });
}

CToolbar.prototype.setVisible = function (aVisible) {
    aVisible = getValue(aVisible, true);

    if (aVisible)
        this.show();
    else
        this.hide();
}

CToolbar.prototype.show = function () {
    J("#" + this.sIdDiv).css("display", "block");
}

CToolbar.prototype.hide = function () {
    J("#" + this.sIdDiv).css("display", "none");
}

CToolbar.prototype.enableItem = function (aId) {
    try { this.toolbar.enableItem(aId); } catch (e) { }
};

CToolbar.prototype.disableItem = function (aId) {
    var self = this,
        button = this.getButton(aId);
    if (!button) return;
    if (button.sImgDisabled) {
        // if image is in base64 : remove temporary the image Path of toolbar
        if (button.sImgDisabled.substring(0, 4) == "data") {
            var sPath = this.toolbar.imagePath
            this.toolbar.imagePath = "";
            this.setItemImageDisabled(aId, button.sImgDisabled); // need to specify each time (dhtmlx doesn't keep src img...)
            this.toolbar.disableItem(aId);
            this.toolbar.imagePath = sPath;
        } else 
            this.toolbar.disableItem(aId);
    } else {
        applyGrayscaleToIcon(button.sImgEnabled, function (img) {
            button.sImgDisabled = img;
            self.disableItem(aId);
        });
    }
};

CToolbar.prototype.setItemImageDisabled = function (aId, aImg) {
    this.toolbar.setItemImageDis(aId, aImg);
}

CToolbar.prototype.disableBtns = function (aBtnsIds) {
    var self = this;
    aBtnsIds.forEach(function (aId) {
        self.disableItem(aId);
    });
};

CToolbar.prototype.enableBtns = function (aBtnsIds) {
    var self = this;
    aBtnsIds.forEach(function (aId) {
        self.enableItem(aId);
    });
};

CToolbar.prototype.disableAllBtns = function () {
    var self = this;
    this.toolbar.forEachItem(function (aIdItem) {
        self.disableItem(aIdItem);
    });
}

CToolbar.prototype.enableAllBtns = function () {
    var self = this;
    this.toolbar.forEachItem(function (aIdItem) {
        self.enableItem(aIdItem);
    });
}

CToolbar.prototype.setEnableAllBtns = function (aEnable) {
    aEnable = getValue(aEnable, true);
    if (aEnable)
        this.enableAllBtns();
    else
        this.disableAllBtns();
}

CToolbar.prototype.setButtonEnable = function (aId, aState) {
    var button = this.getButton(aId);
    aState = getValue(aState, true);
    if (!isAssigned(button))
        return;

    button.bEnable = aState;

    if (button.bEnable)
        this.toolbar.enableItem(aId);
    else
        this.toolbar.disableItem(aId);
}

CToolbar.prototype.setButtonEnableExt = function (aId, aState) {
    var button = this.getButton(aId);
    aState = getValue(aState, true);
    if (!isAssigned(button))
        return;

    button.bEnable = button.bEnable && aState;

    if (button.bEnable)
        this.toolbar.enableItem(aId);
    else
        this.toolbar.disableItem(aId);
}

CToolbar.prototype.setButtonVisible = function (aId, aVisible) {
    var button = this.getButton(aId);
    aVisible = getValue(aVisible, true);
    if (!isAssigned(button))
        return;

    button.bVisible = aVisible;

    if (aVisible)
        this.showItem(aId);
    else
        this.hideItem(aId);
}

CToolbar.prototype.isEnabled = function (aId) {
    return this.toolbar.isEnabled(aId);
};

CToolbar.prototype.hideItem = function (aId) {
    this.toolbar.hideItem(aId + "Sep");
    this.toolbar.hideItem(aId);
};

CToolbar.prototype.showItem = function (aId) {
    this.toolbar.showItem(aId + "Sep");
    this.toolbar.showItem(aId);
};

CToolbar.prototype.hideBtns = function (aBtnsIds) {
    var self = this;
    aBtnsIds.forEach(function (aId) {
        self.hideItem(aId);
    });
};

CToolbar.prototype.isButtonVisible = function (aId) {
    return this.toolbar.isVisible(aId);
};

CToolbar.prototype.isPressed = function (aId) {
    return this.toolbar.getItemState(aId);
};

CToolbar.prototype.getItemText = function (aId) {
    return this.toolbar.getItemText(aId);
};

CToolbar.prototype.getValue = function (aId) {
    this.toolbar.getValue(aId);
}

CToolbar.prototype.setItemText = function (aId, aValue) {
    this.toolbar.setItemText(aId, aValue);
};

CToolbar.prototype.isBtnExist = function (aId) {
    return isAssigned(this.getButton(aId));
}

CToolbar.prototype.getPosition = function (aId) {
    return this.toolbar.getPosition(aId);
}

CToolbar.prototype.updateButtonField = function (aId, aField, aValue) {
    var button = this.getButton(aId);

    if (isAssigned(button))
        button[aField] = aValue;
}

CToolbar.prototype.removeItem = function (aId) {
    var self = this,
        btnsToDelete = [];

    this.btns.forEach(function (aBtn) {
        if (aBtn.sId == aId) {
            self.toolbar.removeItem(aId);
            btnsToDelete.push(J.extend({},aBtn));
        }
    });

    btnsToDelete.forEach(function (aBtn) {
        var iIndex = self.btns.indexOf(aBtn);
        if (iIndex > -1) {
            self.btns.splice(iIndex, 1);
        }
    });
}

CToolbar.prototype.removeItemExt = function (aStr) {
    var self = this,
        btnsToDelete = [];

    this.btns.forEach(function (aBtn) {
        if (inStr(aBtn.sId, aStr)) {
            self.toolbar.removeItem(aBtn.sId);
            btnsToDelete.push(J.extend({}, aBtn));
        }
    });

    btnsToDelete.forEach(function (aBtn) {
        var iIndex = self.btns.indexOf(aBtn);
        if (iIndex > -1) {
            self.btns.splice(iIndex, 1);
        }
    });
}

//manage two-state item
CToolbar.prototype.setItemState = function (aId, aPressed) {
    this.toolbar.setItemState(aId, aPressed);
}

CToolbar.prototype.setItemImage = function (aId, aImgPath) {
    this.toolbar.setItemImage(aId, aImgPath);
}

CToolbar.prototype.setItemImageDis = function (aId, aImgPath) {
    this.toolbar.setItemImageDis(aId, aImgPath);
}

CToolbar.prototype.setItemToolTip = function (aId, aTooltip) {
    this.toolbar.setItemToolTip(aId, aTooltip);
}

CToolbar.prototype.setPosition = function (aId, aPosition) {
    this.toolbar.setPosition(aId, aPosition);
}

// manage list option for buttonSelect control.
CToolbar.prototype.getAllListOptions = function (aId) {
    return this.toolbar.getAllListOptions(aId);
};

CToolbar.prototype.getListOptionNumber = function (aId) {
    return parseInt(this.getAllListOptions(aId).length);
};

CToolbar.prototype.getListOptionSelected = function (aId) {
    return this.toolbar.getListOptionSelected(aId);
};

CToolbar.prototype.addListOption = function (aIdParent, aIdOptions, aPos, aType, aText, aImg) {
    this.toolbar.addListOption(aIdParent, aIdOptions, aPos, aType, aText, aImg);
};

CToolbar.prototype.addListOptions = function (aIdParent, aOptions) {
    var self = this;
    aOptions.forEach(function (aOption) {
        var iPos = getValue(aOption.iPos, self.getListOptionNumber(aIdParent) + 1),
            sType = getValue(aOption.iType, "button"),
            sImg = isEmpty(aOption.sImg) ? null : aOption.sImg;

        self.addListOption(aIdParent, aOption.sId, iPos, sType, aOption.sCaption, sImg);
    });
};

CToolbar.prototype.removeListOption = function (aIdParent,aIdOption) {
    this.toolbar.removeListOption(aIdParent, aIdOption);
};

CToolbar.prototype.clearListOptions = function (aIdParent) {
    var self = this,
        options = this.getAllListOptions(aIdParent);

    options.forEach(function (aOption) {
        self.removeListOption(aIdParent, aOption);
    })
};

CToolbar.prototype.reloadListOptions = function (aIdParent, aOptions) {
    this.clearListOptions(aIdParent);
    this.addListOptions(aIdParent, aOptions);
};

CToolbar.prototype.setListOptionSelected = function (aIdParent, aIdOption) {
    this.toolbar.setListOptionSelected(aIdParent, aIdOption);
};

CToolbar.prototype.disableListOption = function (aIdParent, aIdOption) {
    this.toolbar.disableListOption(aIdParent, aIdOption);
}

CToolbar.prototype.enableListOption = function (aIdParent, aIdOption) {
    this.toolbar.enableListOption(aIdParent, aIdOption);
}