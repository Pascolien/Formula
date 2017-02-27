/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        <aSettings from CTreeObject>
        aSettings.sIdDivToolbarCreation : add a toolbar to manage creation/deletion objects and move objects
 * @returns CTreeObjectCreation object.
 */

var CTreeObjectCreation = function (aSettings) {
    var self = this;
    this.toolbarCreation;

    CTreeObject.call(this, aSettings);
    this.getContextMenuOptions();

    if (isAssigned(aSettings.sIdDivToolbarCreation)) {
        this.toolbarCreation = new CToolbar({
            sIdDivToolbar: aSettings.sIdDivToolbarCreation,
            btns: [
                { sId: btnAddObject, iBtnType: tbtSimple, sHint: _("Ajouter une Entité"), sImgEnabled: "add.png", sImgDisabled: "addDisabled.png" },
                { sId: btnAddChild, iBtnType: tbtSimple, sHint: _("Ajouter une Entité enfant"), sImgEnabled: "addChild.png", sImgDisabled: "addChildDisabled.png" },
                { sId: btnRemoveObject, iBtnType: tbtSimple, sHint: _("Supprimer l'Entité"), sImgEnabled: "delete.png", sImgDisabled: "deleteDisabled.png", bAddSpacer: true },
                { sId: btnMoveDown, iBtnType: tbtSimple, sHint: _("Déplacer l'Entité vers le bas"), sImgEnabled: "down.png", sImgDisabled: "downDisabled.png" },
                { sId: btnMoveUp, iBtnType: tbtSimple, sHint: _("Déplacer l'Entité vers le haut"), sImgEnabled: "up.png", sImgDisabled: "upDisabled.png" }
            ],
            onClick: function (aId) { self.toolbarOnClick(aId); }
        });
        J("#" + aSettings.sIdDivToolbarCreation).css("margin-top", "-1px");
        this.addCustomOptions();
    }
    this.toolbar.setButtonEnable(btnDisplaySelection, false);
    this.toolbar.attachEvent("onStateChange", function (aId, aPressed) { self.toolbarOnStateChange(aId, aPressed); });
    this.toolbar.addButton({ sId: btnEdit, iBtnType: tbtTwoState, iPos: 2, sHint: _("Passer en mode lecture ou écriture"), sImgEnabled: "edit.png", sImgDisabled: "editDisabled.png", bPressed: this.bWriteMode });
};

//inheritage
CTreeObjectCreation.prototype = createObject(CTreeObject.prototype);
CTreeObjectCreation.prototype.constructor = CTreeObjectCreation; // Otherwise instances of CTreeOT would have a constructor of CTree

CTreeObjectCreation.prototype.toString = function() {
    return "CTreeObjectCreation";
}

CTreeObjectCreation.prototype.switchToLinearView = function (aValueSearch) {
    CTreeObject.prototype.switchToLinearView.call(this, aValueSearch);

    this.updateCreationToolbar(false, false);
    this.updateToolbarButtonState();
}

CTreeObjectCreation.prototype.switchToTreeView = function () {
    CTreeObject.prototype.switchToTreeView.call(this);
    this.updateCreationToolbar(this.bWriteMode);
    this.updateToolbarButtonState();
}

CTreeObjectCreation.prototype.onClickOut = function () {
    CTreeObject.prototype.onClickOut.call(this);

    this.updateToolbarButtonState();
}

CTreeObjectCreation.prototype.onSelect = function () {
    CTreeObject.prototype.onSelect.call(this);

    this.updateToolbarButtonState();
}

CTreeObjectCreation.prototype.onKeyPress = function (aKey, aEvent) {
    CTreeObject.prototype.onKeyPress.call(this, aKey, aEvent);

    switch (aKey) {
        case 46: // delete key
            var sId = this.getSelectedItemId(),
                deleteButton = this.toolbarCreation.getButton(btnRemoveObject);

            if (!isEmpty(sId) && deleteButton.bEnable)
                this.deleteObject(sId, deleteButton.advancedDeletions);

            break;
    }
}

/* Toolbar methods */
CTreeObjectCreation.prototype.toolbarOnClick = function (aIdBtn, aMandatoryAttTags) {
    CTreeObject.prototype.toolbarOnClick.call(this,aIdBtn);
    var sIdSelected = this.getSelectedItemId();

    switch (aIdBtn) {
        case btnAddObject:
            var button = this.toolbarCreation.getButton(aIdBtn),
                advancedCreations = getValue(button.advancedCreations, []);

            this.addSister(sIdSelected, false, advancedCreations, aMandatoryAttTags);

            if (!isEmpty(this.onAddObject))
                this.onAddObject();

            break;
        case btnAddChild:
            var button = this.toolbarCreation.getButton(aIdBtn),
                advancedCreations = getValue(button.advancedCreations, []);

            this.addChild(sIdSelected, advancedCreations);

            if (!isEmpty(this.onAddChild))
                this.onAddChild();

            break;
        case btnRemoveObject:
            var button = this.toolbarCreation.getButton(aIdBtn);
            this.deleteObject(sIdSelected, button.advancedDeletions);

            break;
        case btnMoveDown:
            this.moveDownObject(sIdSelected);
            if (!isEmpty(this.onMoveDown))
                this.onMoveDown();

            break;
        case btnMoveUp:
            this.moveUpObject(sIdSelected);
            if (!isEmpty(this.onMoveUp))
                this.onMoveUp();

            break;
    }
}

CTreeObjectCreation.prototype.disabledBtnToolbar = function () {
    CTreeObject.prototype.disabledBtnToolbar.call(this);
    if (this.toolbarCreation)
        this.toolbarCreation.disableAllBtns();
}

CTreeObjectCreation.prototype.enabledBtnToolbar = function () {
    CTreeObject.prototype.enabledBtnToolbar.call(this);
    if (this.toolbarCreation)
        this.toolbarCreation.enableAllBtns();
}

CTreeObjectCreation.prototype.updateToolbarButtonState = function () {
    var instruction = CTreeObject.prototype.updateToolbarButtonState.call(this);

    if (!isAssigned(this.toolbarCreation))
        return;

    this.toolbarCreation.setButtonEnable(btnAddObject, instruction.bObjectsAddable);
    this.toolbarCreation.setButtonEnable(btnAddChild, instruction.bObjectsAddable);
    this.toolbarCreation.setButtonEnable(btnRemoveObject, instruction.bObjectsModifiable);
    this.toolbarCreation.setButtonEnable(btnMoveDown, instruction.bObjectsModifiable);
    this.toolbarCreation.setButtonEnable(btnMoveUp, instruction.bObjectsModifiable);
    this.toolbarCreation.setVisible(this.bWriteMode && !this.bLinear && this.toolbar.isEnabled(btnEdit));

    if (!this.toolbar.isEnabled(btnEdit)) {
        this.toolbar.setItemState(btnEdit, false);
        this.updateCreationToolbar(false);
        if (isAssigned(this.onEditClicked))
            this.onEditClicked(this.bWriteMode);
    }

    if (this.bLinear)
        this.toolbar.setButtonEnable(btnEdit, false);
    else
        this.toolbar.setButtonEnableExt(btnEdit, !this.bLinear);

    var iHeight = (this.bWriteMode && !this.bLinear) ? 52 : 26;

    J("#" + this.sIdDiv).css({ bottom: iHeight + "px" });
    // Décalage de l'arbre en mode écriture
    if (this.isToolbarVisible === this.bWriteMode || (!this.isToolbarVisible && !this.bWriteMode))
        return;

    // Refocus de l'entité si elle est cachée par la toolbar
    this.focusItem(this.getSelectedItemId());

    this.isToolbarVisible = this.bWriteMode;
}
