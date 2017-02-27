/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.sIdDivcontextMenu *** MANDATORY ***
        aSettings.sIconPath 
        aSettings.sSkin : "dhx_skyblue" by default.
        aSettings.options : Json contextual options parameters.
            options = [
                {sId:"", sIdParent:"", iPos:"", sName:"", sImgEnabled:"", sImgDisabled:"", bDisabled:true/false, bHidden:true/false, bAddSeparator:true/false, sHotKey:""}
            ];
        aSettings.onClick : the javascript function to call when a option is clicked.
        aSettings.onBeforeContextMenu : the javascript function to call before contextMenu appears.
        aSettings.onAfterContextMenu : the javascript function to call after contextMenu appears.
        aSettings.onXLE : the javascript function to call after options loading.
 * @returns CContextMenu object.
 */

// teexma options
var optToRef = "optToRef",
    optVersionning = "optVersionning",
    optAddSister = "optAddSister",
    optAddObjectChild = "optAddObjectChild",
    optAddLinkedObject = "optAddLinkedObject",
    optDelete = "optDelete",
    optSwitchFolderObject = "optSwitchFolderObject",
    optDuplicate = "optDuplicate",
        optDuplicateEntirely = "optDuplicateEntirely",
        optDuplicatePartially = "optDuplicatePartially",
        optAdvancedDuplication = "optAdvancedDuplication",
    optAdvancedCreation = "optAdvancedCreation",
    optAdvancedComparison = "optAdvancedComparison",
    optCompare = "optCompare",
    optAdvanced = "optAdvanced",
        optInsertObject = "optInsertObject",
        optAddFolderContainer = "optAddFolderContainer",
            optAddFolder = "optAddFolder",
            optInsertFolder = "optInsertFolder",
        optRename = "optRename",
        optSort = "optSort",
            optSortAscendant = "optSortAscendant",
            optSortDescendant = "optSortDescendant",
        optExpand = "optExpand",
        optCollapse = "optCollapse",
        optCheckBranch = "optCheckBranch",
        optUnCheckBranch = "optUnCheckBranch",
    optTraceabilities = "optTraceabilities",
    optProperty = "optProperty";

var CContextMenu = function (aSettings) {
    if (!isAssigned(aSettings))
        return;

    if (aSettings.sIdDiv)
        aSettings.sIdDivContextMenu = aSettings.sIdDiv;

    checkMandatorySettings(aSettings, ["sIdDivContextMenu"]);

    this.contextMenu;
    this.options = [];
    this.iCounter = 1;

    var self = this;
        sIconPath = getValue(aSettings.sIconPath, _url("/resources/theme/img/iconsToolbar/"));

    this.contextMenu = new dhtmlXMenuObject();
    this.contextMenu.renderAsContextMenu();
    this.contextMenu.addContextZone(aSettings.sIdDivContextMenu);
    this.contextMenu.setIconsPath(sIconPath);

    //loading options
    this.addOptions(aSettings.options);

    this.contextMenu.attachEvent("onClick", function (aIdOption, aContextZone, aKeysPressed) {
        self.onClick(aIdOption, aContextZone, aKeysPressed);
        if (!isEmpty(aSettings.onClick))
            aSettings.onClick(aIdOption, aContextZone, aKeysPressed);
    });

    this.contextMenu.attachEvent("onBeforeContextMenu", function (aContextZone, aEvent) {
        if (!isEmpty(aSettings.onBeforeContextMenu))
            aSettings.onBeforeContextMenu(aContextZone, aEvent);

        self.onBeforeContextMenu(aContextZone, aEvent);
    });

    if (!isEmpty(aSettings.onAfterContextMenu))
        this.contextMenu.attachEvent("onAfterContextMenu", aSettings.onAfterContextMenu);

    if (!isEmpty(aSettings.onXLE))
        this.contextMenu.attachEvent("onXLE", aSettings.onXLE);
};

CContextMenu.prototype.toString = function() {
    return "CContextMenu";
}

CContextMenu.prototype.clear = function(){
    this.contextMenu.clearAll();
    this.options = [];
    this.iCounter = 1;
}

/* getters */

CContextMenu.prototype.getContextMenu = function () {
    return this.contextMenu;
}

CContextMenu.prototype.getOption = function (aId) {
    var option;
    this.options.find(function (aOption) {
        if (aOption.sId == aId) {
            option = aOption;
            return true;
        }
    });
    return option;
}

CContextMenu.prototype.getOptionIndex = function (aId) {
    var iIndex = -1;
    this.options.find(function (aOption, i) {
        if (aOption.sId == aId) {
            iIndex = i;
            return true;
        }
    });
    return iIndex;
}

/* manage options */

CContextMenu.prototype.addOptions = function (aOptions) {
    if (isEmpty(aOptions))
        return;

    var self = this;
    aOptions.forEach(function (aOption) {
        var sName = getValue(aOption.sName),
            bDisabled = getValue(aOption.bDisabled, false),
            sImgEnabled = getValue(aOption.sImgEnabled),
            sImgDisabled = getValue(aOption.sImgDisabled),
            iPos = getValue(aOption.iPos, self.iCounter),
            bAddSeparator = getValue(aOption.bAddSeparator, false),
            bHidden = getValue(aOption.bHidden, false),
            sHotKey = getValue(aOption.sHotKey);

        // adding a new option
        self.contextMenu.addNewChild(aOption.sIdParent, iPos, aOption.sId, sName, bDisabled, sImgEnabled, sImgDisabled);

        if (!isEmpty(sHotKey)) {
            // setting a hotkey to a button
            self.contextMenu.setHotKey(aOption.sId, sHotKey);
        }

        if (bAddSeparator) {
            // adding a separator
            self.contextMenu.addNewSeparator(aOption.sId, qc(aOption.sId, "Sep"));
            self.iCounter++;
        }

        self.options.push(aOption);
        self.iCounter++;

        if (bHidden)
            self.hideOption(aOption.sId);
    });
}

CContextMenu.prototype.disableOptions = function (aOptionsIds) {
    var self = this;

    aOptionsIds.forEach(function (aId) {
        self.disableOption(aId);
    });
}

CContextMenu.prototype.disableOption = function (aId) {
    var option = this.getOption(aId);
    if (!isAssigned(option))
        return;

    option.bEnable = false;
    this.contextMenu.setItemDisabled(aId);
}

CContextMenu.prototype.enableOptions = function (aOptionsIds) {
    var self = this;

    aOptionsIds.forEach(function (aId) {
        self.enableOption(aId);
    });
}

CContextMenu.prototype.enableOption = function (aId) {
    var option = this.getOption(aId);
    if (!isAssigned(option))
        return;

    option.bEnable = true;
    this.contextMenu.setItemEnabled(aId);
}

CContextMenu.prototype.setOptionEnable = function (aId, aState) {
    if (aState)
        this.enableOption(aId);
    else
        this.disableOption(aId);
}

CContextMenu.prototype.setOptionEnableExt = function (aId, aState) {
    var option = this.getOption(aId);
    if (!isAssigned(option))
        return;

    this.setOptionEnable(aId, aState && option.bVisible);
}

CContextMenu.prototype.showOptions = function (aOptionsIds) {
    var self = this;

    aOptionsIds.forEach(function (aId) {
        self.showOption(aId);
    });
}

CContextMenu.prototype.showOption = function (aId) {
    var option = this.getOption(aId);
    if (!isAssigned(option))
        return;

    option.bVisible = true;
    if (option.bAddSeparator)
        this.contextMenu.showItem(qc(aId, "Sep"));

    this.contextMenu.showItem(aId);
}

CContextMenu.prototype.hideOptions = function (aOptionsIds) {
    var self = this;

    aOptionsIds.forEach(function (aId) {
        self.hideOption(aId);
    });
}

CContextMenu.prototype.hideOption = function (aId) {
    var option = this.getOption(aId);
    if (!isAssigned(option))
        return;

    option.bVisible = false;
    if (option.bAddSeparator)
        this.contextMenu.hideItem(qc(aId, "Sep"));

    this.contextMenu.hideItem(aId);
}

CContextMenu.prototype.setOptionVisible = function (aId, aState) {
    if (aState)
        this.showOption(aId);
    else
        this.hideOption(aId);
}

CContextMenu.prototype.setOptionVisibleExt = function (aId, aState) {
    var option = this.getOption(aId);
    if (!isAssigned(option))
        return;

    this.setOptionVisible(aId, aState && option.bVisible);
}

CContextMenu.prototype.setItemText = function (aId, aName) {
    this.contextMenu.setItemText(aId, aName)
}

CContextMenu.prototype.setItemPosition = function (aId, aPos) {
    this.contextMenu.setItemPosition(aId, aPos)
}

CContextMenu.prototype.updateOption = function (aSettings) {
    var option = this.getOption(aSettings.sId);

    if (!option)
        return;

    if (!isEmpty(aSettings.sName)) {
        option.sName = aSettings.sName;
        this.setItemText(aSettings.sId, aSettings.sName);
    }

    if (isAssigned(aSettings.customFields)) {
        aSettings.customFields.forEach(function (aCustomField) {
            option[aCustomField.sName] = aCustomField.value;
        });
    }

    if (isAssigned(aSettings.iPos)) {
        option.iPos = aSettings.iPos;
        this.setItemPosition(aSettings.sId, aSettings.iPos);
    }
}

CContextMenu.prototype.removeOptionsFromParent = function (aIdParent, aChildrenOptionsToKeep) {
    aChildrenOptionsToKeep = getValue(aChildrenOptionsToKeep, []);

    var childrenOptions = [],
        self = this;

    this.options.forEach(function (aOption) {
        if ((aOption.sIdParent == aIdParent) && !inArray(aChildrenOptionsToKeep, aOption.sId))
            childrenOptions.push(J.extend({},aOption));
    });

    childrenOptions.forEach(function (aOption) {
        self.removeOption(aOption.sId);
    });
}

CContextMenu.prototype.removeOptionExt = function (aStr) {
    var self = this,
        optionsToDelete = [];

    this.options.forEach(function (aOption) {
        if (inStr(aOption.sId, aStr)) {
            optionsToDelete.push(aOption);
        }
    });

    optionsToDelete.forEach(function (aOption) {
        self.removeOption(aOption.sId);
    });
}

CContextMenu.prototype.removeOption = function (aIdOption) {
    this.contextMenu.removeItem(aIdOption);
    var iIndex = this.getOptionIndex(aIdOption);
    if (iIndex > -1)
        this.options.splice(iIndex, 1);
}

/*manage events*/

CContextMenu.prototype.onClick = function (aId, aContextZone, aKeysPressed) {
    //nothing
}

CContextMenu.prototype.onBeforeContextMenu = function (aContextZone, aEvent) {
    // open context menu manually to fix a bug on IE11 (gap on Y axe with scroll)
    this.contextMenu.showContextMenu(aEvent.clientX, aEvent.clientY);
}
