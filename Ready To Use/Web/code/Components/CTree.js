/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.sIdDivTree *** MANDATORY ***
        aSettings.sImgPath 
        aSettings.sIconPath : the icon path of item's images.
        aSettings.sSkin : "dhx_skyblue" by default.
        aSettings.sIconSize : "16px" by default.
        aSettings.iHeight : height of the div in px.
        aSettings.iWidth : height of the div in px.
        aSettings.bFolderCheckable : true by default.
        aSettings.bEnableClickOut : true by default.
        aSettings.bEnableMultiSelection : true by default.
        aSettings.bEnableEdition : false by default.
        aSettings.bEnableTreeLines : false by default.
        aSettings.bEnableMultiLineItems  : false by default.
        aSettings.bEnableTextSigns  : false by default.
        aSettings.bEnableSmartRendering : true by default.
        aSettings.bReadOnly  : false by default.
        aSettings.bRespectRightToCheck  : false by default
        aSettings.bKeepTreeVisu  : false by default.
        aSettings.sIdsChecked : string id separated by ";".
        aSettings.sIdsDisabled : string id separated by ";".
        aSettings.sStdImages : the item icon by default.
        aSettings.sCheckType : "ctCheckboxes", "ctRadioboxes", "ctNone" by default.
        aSettings.filteredObjects : json, generic JSON structure, permit to do search.
        aSettings.sTxObjects : string, generic JSON structure, it has to be transform to the dhtmlxTree need.
        aSettings.txObjects : json, generic JSON structure, it has to be transform to the dhtmlxTree need.
        aSettings.sObjects : string, JSON structure corresponding to a dhtmlxTree object.
        aSettings.onCheck : the javascript function to call when a tree item is checked.
        aSettings.onSelect : the javascript function to call when a tree item is selected.
        aSettings.onXLE : the javascript function to call when the tree json structure is loaded.
        aSettings.onMouseIn : the javascript function to call when a tree item hover.
        aSettings.onEdit : the javascript function to call when a tree item is edited.
        aSettings.onDblClick : the javascript function to call when a tree item is double clicked.
        aSettings.onBeforeContextMenu : fires before the moment when a context menu appears on a right mouse click.
        aSettings.onOpenEnd : the javascript function to call when a tree item is closed.
        aSettings.onSwitchToLinearView : the javascript function to call when a tree is switched to linear view.
        aSettings.onSwitchToTreeView : the javascript function to call when a tree is switched to tree view.
        aSettings.onCheckAll : the javascript function to call when toolbar button or combo option checkAll is clicked.
        aSettings.onUnCheckAll : the javascript function to call when toolbar button or combo option unCheckAll is clicked.
        aSettings.onAddChild : the javascript function to call when toolbar button or combo option addChild is clicked.
        aSettings.onRemoveObject : the javascript function to call when toolbar button or combo option removeObject is clicked.
        aSettings.onMoveDown : the javascript function to call when toolbar button moveDown is clicked.
        aSettings.onMoveUp : the javascript function to call when toolbar button moveUp is clicked.
        aSettings.onRoot : the javascript function to call when root's node are loaded.
        aSettings.onSwitchFolderObject : the javascript function to call when combo option checkAll is clicked.
        aSettings.onRename : the javascript function to call when a tree item is renamed.
        aSettings.toolbarSettings : see settings in CToolbar
        aSettings.contextMenuSettings : see settings in CContextMenu
 * @returns CTree object.
 */

var sPathFileComponentsAjax = _url("/code/components/ComponentsAjax.asp");

//enum CheckType
var ctNone = "ctNone",
    ctCheckboxes = "ctCheckboxes",
    ctRadioboxes = "ctRadioboxes";

//enum iAction
var atChild = "atChild",
    atSister = "atSister",
    atInsert = "atInsert";

//enum TAffiliation
var afFille = 0,
    afSoeur = 1,
    afMere = 2;

var CTree = function (aSettings) {
    this.tree = null;
    this.sCheckType = ctNone;
    this.bStdImageActive = false;
    this.bFolderCheckable = true;
    this.bLinear = false;
    this.nodes = [];
    this.checkedIds = [];
    this.disabledIds = [];
    this.txIdsToOpen = [];
    this.toolbar = null;
    this.contextMenu = null;
    this.idDivToolbar = "";
    this.iCounter = 1;
    this.bItemOnEdit = false;
    this.sDefaultIcon = "";
    this.bSelectFirstNodeOnLoad = getValue(aSettings.bSelectFirstNodeOnLoad,false);
    if (!isEmpty(aSettings))
        this.initialize(aSettings);
};

CTree.prototype.toString = function() {
    return "CTree";
}

CTree.prototype.initialize = function (aSettings) {
    if (!aSettings)
        return

	if (aSettings.sIdDiv)
        aSettings.sIdDivTree = aSettings.sIdDiv;
    checkMandatorySettings(aSettings, ["sIdDivTree"]);
    
    // initialize the dhtmlx tree according to aSettings parameter.

    var self = this,
        sImagePath = getValue(aSettings.sImgPath, _url("/resources/theme/img/dhtmlx/tree/")),
        sIconPath = getValue(aSettings.sIconPath, _url("/temp_resources/theme/img/png/")),
        sSkin = getValue(aSettings.sSkin, "dhx_skyblue"),
        sIconSize = getValue(aSettings.sIconSize, "16px"),
        sStdImages = "";

    this.sIdDiv = aSettings.sIdDivTree;
    this.iHeight = aSettings.iHeight;
    this.iWidth = aSettings.iWidth;
    this.bFolderCheckable = getValue(aSettings.bFolderCheckable, true);
    this.bEnableClickOut = getValue(aSettings.bEnableClickOut, true);
    this.bEnableMultiSelection = getValue(aSettings.bEnableMultiSelection, true);
    this.bEnableEdition = getValue(aSettings.bEnableEdition, false);
    this.bEnableTreeLines = getValue(aSettings.bEnableTreeLines, false);
    this.bEnableMultiLineItems = getValue(aSettings.bEnableMultiLineItems, false);
    this.bEnableTextSigns = getValue(aSettings.bEnableTextSigns, false);
    this.bEnableDragAndDrop = getValue(aSettings.bEnableDragAndDrop, false);
    this.bEnableKeyboardNavigation = getValue(aSettings.bEnableKeyboardNavigation, true);
    this.bReadOnly = getValue(aSettings.bReadOnly, false);
    this.bKeepTreeVisu = getValue(aSettings.bKeepTreeVisu, false);
    this.bRespectRightToCheck = getValue(aSettings.bRespectRightToCheck, false);
    this.onSwitchToLinearView = aSettings.onSwitchToLinearView;
    this.onSwitchToTreeView = aSettings.onSwitchToTreeView;
    this.onCheckAll = aSettings.onCheckAll;
    this.onUnCheckAll = aSettings.onUnCheckAll;
    this.onAddChild = aSettings.onAddChild;
    this.onRemoveObject = aSettings.onRemoveObject;
    this.onMoveDown = aSettings.onMoveDown;
    this.onMoveUp = aSettings.onMoveUp;
    this.fctOnClickOut = aSettings.onClickOut;
    this.onRoot = aSettings.onRoot;
    this.onSwitchFolderObject = aSettings.onSwitchFolderObject;
    this.onRename = aSettings.onRename;
    this.onEditClicked = aSettings.onEditClicked;
    this.settings = aSettings;
    this.onFullScreen = aSettings.onFullScreen;
    this.sIdDivContainer = aSettings.sIdDivContainer;
    this.wdowContainer = aSettings.wdowContainer;
    this.bEnableSmartRendering = getValue(aSettings.bEnableSmartRendering, true);
    this.filteredObjects = getValue(aSettings.filteredObjects, []);
    this.idParentFiltering = getValue(aSettings.idParentFiltering, 0);
    this.bFilteredTree = getValue(aSettings.bFilteredTree, this.filteredObjects.length > 0 || this.idParentFiltering > 0);

    if (isAssigned(this.iHeight))
        J("#" + aSettings.sIdDivTree).css("height", this.iHeight + "px");

    if (isAssigned(this.iWidth))
        J("#" + aSettings.sIdDivTree).css("width", this.iWidth + "px");

    if (isAssigned(aSettings.sIdsDisabled))
        this.disabledIds = aSettings.sIdsDisabled.split(";").map(Number);

    
    if (isAssigned(aSettings.sStdImages)) {
        this.bStdImageActive = true;
        sStdImages = aSettings.sStdImages;
    }
    
    this.tree = new dhtmlXTreeObject(this.sIdDiv, "100%", "100%", 0);
    if (isAssigned(aSettings.sCheckType)) {
        switch (aSettings.sCheckType) {
            case ctCheckboxes:
                this.sCheckType = ctCheckboxes;
                this.tree.enableRadioButtons(false);
                this.tree.enableCheckBoxes(true);
                break;
            case ctRadioboxes:
                this.sCheckType = ctRadioboxes;
                this.tree.enableRadioButtons(true);
                this.tree.enableSingleRadioMode(true);
                break;
            default:
                this.sCheckType = ctNone;
                break;
        }
    }

    if (!isEmpty(aSettings.sIdsChecked))
        this.setCheckedIds((""+aSettings.sIdsChecked).split(";").map(Number));
    
    this.tree.setSkin(sSkin); 
    this.tree.setImagePath(sImagePath); 
    this.tree.setIconPath(sIconPath); 
    this.tree.setIconSize(sIconSize,sIconSize); 
    this.tree.setDataMode("json"); 
    this.tree.enableKeySearch(true); 
    this.tree.enableKeyboardNavigation(true);
    this.tree.setStdImages(sStdImages,sStdImages,sStdImages);
    this.tree.enableMultiselection(this.bEnableMultiSelection);
    if (this.bEnableSmartRendering)
        this.tree.enableSmartRendering();
    this.tree.enableItemEditor(this.bEnableEdition);
    this.tree.enableTreeLines(this.bEnableTreeLines);
    this.tree.enableMultiLineItems(this.bEnableMultiLineItems);
    this.tree.enableTextSigns(this.bEnableTextSigns);
	this.tree.enableDragAndDrop(true, true);
	this.tree.enableDragAndDropScrolling(true);
    this.tree.setDragBehavior("complex", true);
    this.lock(this.bReadOnly);
    if (!this.bEnableDragAndDrop) {
        this.tree.enableDragAndDrop("temporary_disabled");
    }

    //handle events
    var bClicked;
    this.tree.attachEvent("onClick", function (aId) {
        bClicked = true;
        return true;
    });

    this.tree.attachEvent("onOpenStart", function (aId) {
        bClicked = true;
        return true;
    });

    if (this.bEnableClickOut) {
        J("#" + this.sIdDiv).unbind("click");
        var tree = this.tree;
        J("#" + this.sIdDiv).click(function () {
            if (!bClicked) {
                self.clearSelection(true);
            } else 
                bClicked = false;
        });
    }

    this.tree.attachEvent("onCheck", function (aIdItem, aChecked) {
        self.onCheck(aIdItem, aChecked);
    });

    this.tree.attachEvent("onSelect", function (aIdItem) {
        self.onSelect(aIdItem);

        if (!isEmpty(aSettings.onSelect))
            aSettings.onSelect(aIdItem);
    });

    this.tree.attachEvent("onXLE", function (aTree, aIdLastParsedItem) {
        self.onXLE(aTree, aIdLastParsedItem);

        if (!isEmpty(aSettings.onXLE))
            aSettings.onXLE(aTree, aIdLastParsedItem);
    });

    this.tree.attachEvent("onMouseIn", function (aIdItem) {
        self.onMouseIn(aIdItem);

        if (!isEmpty(aSettings.onMouseIn))
            aSettings.onMouseIn(aIdItem);
    });

    this.tree.attachEvent("onEdit", function (aState, aId, aTree, aValue) {
        bEdit = self.onEdit(aState, aId, aTree, aValue);

        if (!isEmpty(aSettings.onEdit))
            bEdit = bEdit & aSettings.onEdit(aState, aId, aTree, aValue);

        return bEdit;
    });

    this.tree.attachEvent("onDblClick", function (aIdItem) {
        self.onDblClick(aIdItem);

        if (!isEmpty(aSettings.onDblClick))
            aSettings.onDblClick(aIdItem);
    });

    this.tree.attachEvent("onOpenEnd", function (aIdItem, aState) {
        self.onOpenEnd(aIdItem, aState);

        if (!isEmpty(aSettings.onOpenEnd))
            aSettings.onOpenEnd(aIdItem, aState);
    });

    this.tree.attachEvent("onOpenStart", function (aIdItem, aState) {
        var bOk = self.onOpenStart(aIdItem, aState);

        if (!isEmpty(aSettings.onOpenStart))
            bOk = bOk && aSettings.onOpenStart(aIdItem, aState);

        return bOk;
    });

    this.tree.attachEvent("onDrop", function (aIdItem, aIdParent, aIdNextSibling) {
        self.onDrop(aIdItem, aIdParent, aIdNextSibling);

        if (!isEmpty(aSettings.onDrop))
            aSettings.onDrop(aIdItem, aIdParent, aIdNextSibling);
    });

	this.tree.attachEvent("onBeforeDrag", function (aIdItem) {
        bOk = self.onBeforeDrag(aIdItem);

        if (!isEmpty(aSettings.onBeforeDrag))
            bOk = bOk & aSettings.onBeforeDrag(aIdItem);

        return bOk;
	});

	this.tree.attachEvent("onDragIn", function (aIdItem, aIdParent, aSource, aTarget) {
	    return self.onDragIn(aIdItem, aIdParent, aSource, aTarget);
	});

	this.tree.attachEvent("onKeyPress", function (aKey, aEvent) {
	    self.onKeyPress(aKey, aEvent);
	    return true;
	});

    // initialize toolbar
    if (isAssigned(aSettings.toolbarSettings) && !this.bReadOnly) {
        this.toolbar = new CToolbar(aSettings.toolbarSettings);
    }

    // initialize contextMenu
    if (!isEmpty(aSettings.contextMenuSettings) && !this.bReadOnly) {
        this.contextMenu = new CContextMenu(aSettings.contextMenuSettings);
        this.tree.enableContextMenu(this.contextMenu.getContextMenu());

        this.tree.attachEvent("onBeforeContextMenu", function (aIdItem) {
            self.onBeforeContextMenu(aIdItem);

            if (!isEmpty(aSettings.onBeforeContextMenu))
                aSettings.onBeforeContextMenu();

            return true;
        });
    }

    //load root branch
    var settings = aSettings;

    if (this.bReadOnly) {
        J("#" + aSettings.sIdDivTree).css("background", "#EBEBE4");
    }

    if (isAssigned(settings.sTxObjects))
        self.addNodes(null, JSON.parse(settings.sTxObjects));
    else if (isAssigned(settings.txObjects))
        self.addNodes(null, settings.txObjects);
    else if (this.bFilteredTree && this.idParentFiltering < 1)
        self.addNodes(null, this.filteredObjects);
    else if (isAssigned(settings.sObjects))
        self.doLoad(JSON.parse(settings.sObjects));
    else if (isAssigned(settings.objects))
        self.doLoad(settings.objects);
    else
        self.loadRoot();  

    return true;
}

CTree.prototype.loadRoot = function () {
    //virtual abstract
}

CTree.prototype.loadBranch = function (aIdParent) {
    //virtual abstract
}

CTree.prototype.reloadFromTxObjects = function (aNodes) {
    this.clear();
    this.addNodes(null, aNodes);
};

CTree.prototype.reload = function (aNodes) {
    this.clear();
    var self = this;
    aNodes.forEach(function (aNode) {
        self.nodes.push(aNode);
    });
    this.doLoad(aNodes);
};

CTree.prototype.doLoad = function (aNodes) {
    this.tree.loadJSONObject(aNodes);
};

CTree.prototype.clear = function () {
    this.deleteChildItems();
    this.nodes = [];
    this.iCounter = 1;
}

CTree.prototype.deleteChildItems = function (aIdParent) {
    aIdParent = getValue(aIdParent, 0);

    if (aIdParent > 0) {
        var self = this,
            firstChildrenIdsToDelete = [],
            sFirstChildren = this.getSubItems(aIdParent);

        if (!isEmpty(sFirstChildren))
            firstChildrenIdsToDelete = sFirstChildren.split(',');

        firstChildrenIdsToDelete.forEach(function (aId) {
            self.tree.deleteItem(aId);
        })
    } else
        this.tree.deleteChildItems(aIdParent);
}

CTree.prototype.reset = function (aIdsChecked, aIdsDisabled) {
    this.clear();
    this.checkedIds = [];
    this.disabledIds = [];

    if (!isEmpty(aIdsChecked))
        this.setCheckedIds(("" + aIdsChecked).split(";").map(Number));

    if (isAssigned(aIdsDisabled))
        this.disabledIds = aIdsDisabled.split(";").map(Number);

    this.loadRoot();
}

CTree.prototype.unload = function () {
    this.clear();
    this.tree.destructor();
    if (this.toolbar)
        this.toolbar.unload();
}

CTree.prototype.setStdImages = function (aIcon) {
    this.sStdImages = format("#1.png", [aIcon]);
    this.tree.setStdImages(this.sStdImages, this.sStdImages, this.sStdImages);
}

CTree.prototype.setCheckedIds = function (aCheckedIds) {
    aCheckedIds = getValue(aCheckedIds, []);
    this.checkedIds = [];
    switch (this.sCheckType) {
        case ctCheckboxes:
            this.checkedIds = aCheckedIds;
            break;
        case ctRadioboxes:
            if (aCheckedIds.length > 0)
                this.checkedIds.push(aCheckedIds[0]);
            break;
    }
}

CTree.prototype.displayInFullScreen = function (aPressed) {
    var self = this,
        bToolbarAssigned = isAssigned(this.toolbar);

    if (isAssigned(this.onFullScreen))
        this.onFullScreen(aPressed);

    var iWidthContainer = isAssigned(this.sIdDivContainer) ? J("#" + this.sIdDivContainer).width() : this.iWidth,
        iHeightContainer = isAssigned(this.sIdDivContainer) && aPressed ? J("#" + this.sIdDivContainer).height() - (bToolbarAssigned ? 28 : 0) : this.iHeight;

    J("#" + this.sIdDiv).css({
        "width": qc(iWidthContainer, "px"),
        "height": qc(iHeightContainer, "px")
    });

    if (bToolbarAssigned)
        J("#" + this.toolbar.sIdDiv).css("width", qc(iWidthContainer - 8, "px"));

    if (aPressed) {
        var divTree = J("#" + this.sIdDiv);
        // scroll all nodes to be sure they all appear on screen.
        var sIdsParents = "" + this.tree.getAllItemsWithKids();
        if (!isEmpty(sIdsParents)) {
            var idsParents = sIdsParents.split(",");
            idsParents.forEach(function (aId) {
                var parentNode = self.getNode(aId);
                if (parentNode) {
                    var iOpenState = self.tree.getOpenState(aId);
                    if (iOpenState == 1) {
                        self.tree.closeItem(aId);
                        self.tree.openItem(aId);
                    } else if (iOpenState == -1) {
                        self.tree.openItem(aId);
                        self.tree.closeItem(aId);
                    }
                }
            });
        } else if (!divTree.hasClass("scrolled")) {
            divTree.addClass("scrolled");
            this.reloadFromTxObjects(this.nodes);
        }
    }
}

/* Manage items */
CTree.prototype.addNodesJs = function (aNodes) {
    var self = this,
        addedNodes = [];

    aNodes.forEach(function (aNode) {
        var node = self.addNode(aNode),
            sIdParent = isEmpty(aNode.sIdParent) ? "0" : aNode.sIdParent,
            sAction = getValue(aNode.sAction, atSister),
            parentNode = 0;

        self.iCounter++;

        if (sIdParent != "0")
            parentNode = self.getNode(sIdParent);

        switch (sAction) {
            case atChild:
                self.nodes.push(aNode);
                self.tree.insertNewChild(sIdParent, node.id, node.text, null, node.im0, node.im1, node.im2);
                break;
            case atSister:
                self.nodes.push(aNode);
                self.tree.insertNewChild(sIdParent, node.id, node.text, null, node.im0, node.im1, node.im2);
                break;
            case atInsert:
                iIndex = self.getNodeIndex(aNode.sIdNextSibling);
                self.nodes.insert(iIndex, aNode);
                self.tree.insertNewNext(aNode.sIdNextSibling, node.id, node.text, null, node.im0, node.im1, node.im2);
                self.moveUpStrict(node.id);
                break;
        }

        if (node.nocheckbox)
            self.tree.showItemCheckbox(node.id, false);

        if (node.checked)
            self.setCheck(node.id, true);

        if (node.disabled)
            self.tree.disableCheckbox(node.id, true);

        addedNodes.push(aNode);
    });
    return addedNodes;
}

CTree.prototype.addNodes = function (aParentNode, aNodes) {
    var self = this,
        idParent = isEmpty(aParentNode) ? 0 : aParentNode.id,
        parentNode = { 'id': idParent, 'item': [] },
        nodes = parentNode.item;

    aNodes.forEach(function (aNode) {
        var node = self.addNode(aNode);
        nodes.push(node);
        self.nodes.push(aNode);
        self.iCounter++;
    });
    this.doLoad(parentNode);
}

CTree.prototype.addNode = function (aNode) {
    var node = {},
        self = this;

    aNode.sName = aNode.sName.replace(/<br>/g, "");
    node.id = this.iCounter;
    node.txId = parseInt(aNode.ID);
    node.text = aNode.sName;
    if (aNode.bFolder) {
        node.im0 = "folderClosed.gif";
        node.im1 = "folderOpen.gif";
        node.im2 = node.im0;
    } else if (isEmpty(this.sStdImages)) 
        node.im0 = node.im1 = node.im2 = isEmpty(aNode.iIcon) ? "leaf.gif" : format("#1.png", [aNode.iIcon]);

    if (aNode.bParent && !self.bLinear) 
        node.child = 1;
    
    if (!this.bFolderCheckable && aNode.bFolder)
        node.nocheckbox = 1;

    //check node if it's in the checkedIds
    if (aNode.bChecked)
        this.addCheckedNode(node.txId)

    if (inArray(this.checkedIds, node.txId))
        node.checked = 1;

    //check node if it's in the disabledIds
    if (inArray(this.disabledIds, node.txId))
        node.disabled = 1;
    else if (this.bRespectRightToCheck && (aNode.iRight < dbrModif))
        node.disabled = 1;

    aNode.id = node.id;
    aNode.im0 = node.im0;
    aNode.im1 = node.im1;
    aNode.im2 = node.im2;
    aNode.txId = node.txId;
    aNode.ID_Parent = parseInt(aNode.ID_Parent);

    return node;
}

CTree.prototype.updateCheckType = function (aCheckType) {
    var self = this;
    switch (aCheckType) {
        case ctCheckboxes:
            this.sCheckType = ctCheckboxes;
            this.tree.enableRadioButtons(false);

            break;
        case ctRadioboxes:
            this.sCheckType = ctRadioboxes;
            this.tree.enableRadioButtons(true);

            break;
        default:
            this.sCheckType = ctNone;
            break;
    }
}

CTree.prototype.removeNodes = function (aNodes) {
    var self = this;
    aNodes.forEach(function (aNode) {
        self.removeNode(aNode.id);
    });
}

CTree.prototype.removeNode = function (aId, aSelectParent) {
    aSelectParent = getValue(aSelectParent, false);
    
    this.deleteNodes(aId,true);

    //remove node in tree
    this.tree.deleteItem(aId, aSelectParent);
}

CTree.prototype.deleteNodes = function (aIdParent,aDeleteParent) {
    aDeleteParent = getValue(aDeleteParent, false);
    var childrenIdsToDelete = [],
        nodesIndexes = [],
        sAllChildrenIds = this.getAllSubItems(aIdParent);

    if (!isEmpty(sAllChildrenIds))
        childrenIdsToDelete = sAllChildrenIds.split(',');

    if (aDeleteParent)
        childrenIdsToDelete.push(aIdParent);
    else {
        //remove children nodes in tree
        this.deleteChildItems(aIdParent);        
    }

    //remove node's objects in this.nodes
    this.nodes.forEach(function (aNode, i) {
        if (inArray(childrenIdsToDelete, aNode.id)) {
            nodesIndexes.push(i);
        }
    });

    for (var i = nodesIndexes.length - 1 ; i > -1 ; i--) {
        this.nodes.splice(nodesIndexes[i], 1);
    }
}

CTree.prototype.clearSelection = function (aFiredOnClickOut, aId) {
    aFiredOnClickOut = getValue(aFiredOnClickOut, false);

    this.tree.clearSelection(aId);

    if (!isEmpty(this.settings.onClickOut) && isEmpty(aId) && aFiredOnClickOut)
        this.settings.onClickOut();
}

CTree.prototype.focusItem = function (aId) {
    this.tree.focusItem(aId);
}

CTree.prototype.selectItem = function (aId, aFireOnClick, aKeepLastSelected) {
    aFireOnClick = getValue(aFireOnClick, false);
    aKeepLastSelected = getValue(aKeepLastSelected, false);

    if (this.getSelectedItemId() == aId)
        aFireOnClick = false;

    var selectedItems = this.getSelectedItemId().split(",");
    selectedItems.forEach(function (itemId) {
        if (itemId == aId)
            aKeepLastSelected = true;
    });

    this.tree.selectItem(aId, aFireOnClick, aKeepLastSelected);
}

CTree.prototype.selectItemAndFocus = function (aId, aFireOnClick, aKeepLastSelected) {
    this.selectItem(aId, aFireOnClick, aKeepLastSelected);
    this.focusItem(aId);   
}

CTree.prototype.selectFirstNode = function () {
    var iFirstId = this.tree.getItemIdByIndex(0, 0);
    this.selectItemAndFocus(iFirstId,true);
}

CTree.prototype.startRenameAndSelectItem = function (aId) {
    this.tree.setEditStartAction(true,true);
    this.tree.focusItem(aId, true);
    this.tree.selectItem(aId, true);
}

CTree.prototype.setHint = function (aId, aHint) {
    var node = this.getNode(aId);
    if (sDllConstructionMode == "debug") {
        aHint += "\nIdObjet: " + node.ID;
        aHint += "\nid: " + node.id;
    }
    this.setItemText(aId, node.sName, aHint);
}

CTree.prototype.setItemText = function (aId, aName, aHint) {
    this.tree.setItemText(aId, aName, aHint);
    // set node name 
    node = this.getNode(aId);
    node.sName = aName;

    if (isEmpty(aHint) && isAssigned(this.onRename))
        this.onRename(aName);
}

CTree.prototype.setItemImage = function (aId, aImg1, aImg2, aImg3) {
    this.tree.setItemImage2(aId, aImg1, aImg2, aImg3);
}

CTree.prototype.setCheck = function (aId, aCheck, aFireOnCheck) {
    aCheck = getValue(aCheck, true);
    aFireOnCheck = getValue(aFireOnCheck, false);
    this.tree.setCheck(aId, aCheck);
    if (aFireOnCheck)
        this.onCheck(aId, aCheck);
}

CTree.prototype.setSubChecked = function (aId, aCheck) {
    aCheck = getValue(aCheck, true);
    try {
        this.tree.setSubChecked(aId, aCheck);
    } catch (e) {
        var self = this;
        //update the checkedIds
        ids = this.getAllSubItems(aId).split(",");
        ids.forEach(function (aId) {
            self.onCheck(aId, aCheck);
        });
    }    
}

CTree.prototype.openItem = function (aId) {
    this.tree.openItem(aId);
	//this.onXLE();
}

CTree.prototype.closeItem = function (aId) {
    this.tree.closeItem(aId);
}

CTree.prototype.sortTree = function (aId, aAscending) {
    var self = this,
        sOrder = aAscending == true ? "ASC" : "DES",
        sIdSelected = getValue(aId, "0"),
        bRefreshBranch = this.bEnableSmartRendering, //if the smartRendering method is applied and all nodes are not displayed yet, we have to refresh the branch
        selectedIds = sIdSelected.split(",");

    selectedIds.forEach(function (aId) {
        if (bRefreshBranch)
            self.smartRefreshBranch(aId);
        else
            self.tree.sortTree(aId, sOrder, true);
    });
}

CTree.prototype.moveItem = function (aId, aMode, aTargetId, aTargetTree) {
    this.tree.moveItem(aId, aMode, aTargetId, aTargetTree);
}

CTree.prototype.moveUp = function (aId) {
    this.moveItem(aId, "up");
}

CTree.prototype.moveUpStrict = function (aId) {
    this.moveItem(aId, "up_strict");
}

CTree.prototype.moveDown = function (aId) {
    this.moveItem(aId, "down");
}

CTree.prototype.moveDownStrict = function (aId) {
    this.moveItem(aId, "down_strict");
}

CTree.prototype.expand = function (aId) {
    var sIdSelected = getValue(aId, '0');

    if (sIdSelected == 0)
        this.tree.openAllItemsDynamic(sIdSelected);
    else {
        var selectedIds = sIdSelected.split(","),
            self = this;

        selectedIds.forEach(function (aId) {
            self.tree.openAllItems(aId);
        });
    }
}

CTree.prototype.collapse = function (aId) {
    var sIdSelected = getValue(aId, '0'),
        selectedIds = sIdSelected.split(","),
        self = this;

    selectedIds.forEach(function (aId) {
        self.tree.closeAllItems(aId);
    });    
}

CTree.prototype.smartRefreshItem = function (aId) {
    this.tree.smartRefreshItem(aId);
}

CTree.prototype.smartRefreshBranch = function (aId) {
    aId = getValue(aId, 0);
    this.deleteNodes(aId, false);
    this.tree.smartRefreshBranch(aId);
}

CTree.prototype.lock = function (aLocked) {
    aLocked = getValue(aLocked, true);
    this.bReadOnly = aLocked;
    this.tree.lockTree(aLocked);

    if (isAssigned(this.toolbar))
        this.toolbar.setEnableAllBtns(!aLocked);
}

/* Manage arrChecked */
CTree.prototype.addCheckedNode = function (aIdNodeChecked) {
    aIdNodeChecked = parseInt(aIdNodeChecked);
    switch (this.sCheckType) {
        case ctCheckboxes:
            var node = this.getNodeFromTxId(aIdNodeChecked),
                bAdd = true;

            if (!isEmpty(node))
                bAdd = ((node.bFolder && this.bFolderCheckable) || (!node.bFolder)) && !(this.bRespectRightToCheck && (node.iRight < dbrModif));

            if (!inArray(this.checkedIds, aIdNodeChecked) && !inArray(this.disabledIds, aIdNodeChecked) && bAdd)
                this.checkedIds.push(aIdNodeChecked);
            break;
        case ctRadioboxes:
            this.checkedIds = [];
            if (!inArray(this.disabledIds, aIdNodeChecked))
                this.checkedIds.push(aIdNodeChecked);
            break;
    }
}

CTree.prototype.removeCheckedNode = function (aIdNodeUnChecked) {
    var iIndex = this.checkedIds.indexOf(aIdNodeUnChecked);
    if (iIndex > -1 && !inArray(this.disabledIds, aIdNodeUnChecked))
        this.checkedIds.splice(iIndex, 1);
}

CTree.prototype.checkAll = function (aIdSelected) {
    this.doCheckAll(aIdSelected, true);
}

CTree.prototype.unCheckAll = function (aIdSelected) {
    this.doCheckAll(aIdSelected, false);
}

CTree.prototype.doCheckAll = function (aIdSelected, aChecked) {
    aChecked = getValue(aChecked, true);
    var bAll = isEmpty(aIdSelected),
        self = this,
        childrenIds = [];

    if (bAll) {
        childrenIds = this.getChildrenIds();
        this.modifyBranchCheckState(null, aChecked);
    } else {
        // check branches selected
        var selectedIds = aIdSelected.split(",");
        selectedIds.forEach(function (aId) {
            var parentNode = self.getNode(aId);
            self.modifyBranchCheckState(parentNode, aChecked);
            var childrenIdsTmp = self.getChildrenIds(parentNode);

            childrenIds = childrenIds.concat(childrenIdsTmp).unique();
        });
    }

    childrenIds.forEach(function (aId) {
        if (aChecked)
            self.addCheckedNode(parseInt(aId));
        else
            self.removeCheckedNode(parseInt(aId));
    });

    if (aChecked){
        if (this.onCheckAll)
            this.onCheckAll();
    } else {
        if (this.onUnCheckAll)
            this.onUnCheckAll();
    }
}

CTree.prototype.modifyBranchCheckState = function (aParentNode, aChecked) {
    var self = this;
    if (isEmpty(aParentNode)) {
        // case of check all tree
        if (this.sCheckType == ctCheckboxes){
            if (this.bEnableSmartRendering && !this.bAllLoaded) {
                var nodesIds = this.getAllSubItems().split(",");
                nodesIds.forEach(function (aId) {
                    self.setCheck(aId, aChecked);
                });
                this.bAllLoaded = true;
            } else {
                this.setSubChecked(0, aChecked);
            }
        } else {
            var sIdChecked = this.tree.getAllChecked();
            this.setCheck(sIdChecked, false);
        }
    } else {
        //case of check branch
        var iTxId = this.getTxIdFromId(aParentNode.id);
        if (aChecked)
            this.addCheckedNode(iTxId);
        else
            this.removeCheckedNode(iTxId);

        if (this.sCheckType == ctCheckboxes) {
            if (this.bEnableSmartRendering && !this.bAllLoaded) {
                var nodesIds = this.getSubItems(aParentNode.id).split(",");
                nodesIds.forEach(function (aId) {
                    self.setCheck(aId, aChecked);
                });
            } else {
                this.setSubChecked(aParentNode.id, aChecked);
            }
            this.setCheck(aParentNode.id, aChecked);
        } else {
            var sIdChecked = this.tree.getAllChecked(),
                iTxIDChecked = this.getTxIdFromId(sIdChecked);
            if (inArray(this.nodes, iTxIDChecked) || (iTxId == iTxIDChecked))
                this.setCheck(sIdChecked, false);
        }
    }
}

CTree.prototype.isItemChecked = function (aId) {
    return this.tree.isItemChecked(aId);
}

/* getters */
CTree.prototype.getNode = function (aId) {
	var node;
	this.nodes.find(function (aNode) {
        if (aNode.id == aId) {
            node = aNode;
            return true;
        }
    });
	return node;
}

CTree.prototype.getNodes = function (aIds) {
    if (!isAssigned(aIds))
        return [];

    var self = this,
        nodeIds = inStr(aIds,",") ? aIds.split(",") : [aIds],
        nodes = [];

    nodeIds.forEach(function (aId) {
        var node = self.getNode(aId);
        if (isAssigned(node))
            nodes.push(node);
    });

    return nodes;
}

CTree.prototype.getNodeTxId = function (aId) {
    var node = this.getNode(aId);

    return isAssigned(node) ? node.txId : 0;
}

CTree.prototype.getNodeFromTxId = function (aTxId) {
    var node;

    this.nodes.find(function (aNode) {
        if (aNode.txId == aTxId) {
            node = aNode;
            // Dans le cas de l'abscence de l'attibut iRight après recherche textuelle (consentement de Lulu)
            if (!node.iRight) {
                var txObj = getObject(node.ID);
                if (txObj)
                    node.iRight = txObj.iRight;
            }
            return true;
        }
    });

    return node;
}

CTree.prototype.getSelectedItemId = function () {
    return this.tree.getSelectedItemId();
}

CTree.prototype.getSelectedIds = function () {
    var sIds = this.getSelectedItemId();

    if (inStr(sIds, ','))
        return sIds.split(",");
    else if (!isEmpty(sIds))
        return [sIds];
    else return [];
}

CTree.prototype.getSelectedItemIdExt = function () {
    return getValue(this.tree.getSelectedItemId(), "0");
}

CTree.prototype.getSelectedItemText = function () {
    return getValue(this.tree.getSelectedItemText());
}

CTree.prototype.getSelectedItemAttributeValue = function (aIdAttribute) {
    return this.getItemAttributeValue(this.getSelectedItemId(),aIdAttribute);
}

CTree.prototype.getItemAttributeValue = function (aId, aIdAttribute) {
    var node = this.getNode(aId),
        sAttributeValue = "";

    J.each(node, function (aIndex, aJSONObject) {
        if (aIndex == aIdAttribute) {
            sAttributeValue = aJSONObject;
            return;
        }
    });

    return sAttributeValue;
}

CTree.prototype.getTxIdSelected = function () {
    return this.getTxIdSelectedToArray().join(";");
}

CTree.prototype.getTxIdSelectedToArray = function () {
    var selectedNodes = this.getSelectedNodes(),
        selectedTxIds = [];

    selectedNodes.forEach(function (aNode) {
        selectedTxIds.push(aNode.txId);
    });

    return selectedTxIds;
}

CTree.prototype.getSelectedNodes = function () {
    var self = this,
        selectedIds = this.getSelectedIds(),
        selectedNodes = [];

    selectedIds.forEach(function (aId) {
        var node = self.getNode(aId);
        if (isAssigned(node))
            selectedNodes.push(node);
    });

    return selectedNodes;
}

CTree.prototype.getSelectedNode = function () {
    var selectedNodes = this.getSelectedNodes();

    return selectedNodes.length > 0 ? selectedNodes[0] : null;
}

CTree.prototype.getTxIdFromId = function (aId) {
    var node = this.getNode(aId);
    return isEmpty(node) ? 0 : node.txId;
}

CTree.prototype.getIdFromTxId = function (aId) {
    var node = this.getNodeFromTxId(aId);
    return isEmpty(node) ? 0 : node.id;
}

CTree.prototype.getChildrenIds = function (aIdParent) {
    var childrenIds = [];

    if (isEmpty(aIdParent)) {
        childrenIds = this.getAllTxIds();
    } 
    return childrenIds;
}

CTree.prototype.getAllTxIds = function () {
    var txIds = [];
    this.nodes.forEach(function (aNode) {
        txIds.push(aNode.txId);
    });
    return txIds;
}

CTree.prototype.getNodesFromIds = function (aArrNodesIds) {
    //nothing : implemented in sub classes
}

CTree.prototype.getNodesFromValue = function (aValueSearch) {
    //nothing : implemented in sub classes
}

CTree.prototype.getNodeIndex = function (aId) {
    var iIndex = this.nodes.length;
    this.nodes.find(function (aNode, aIndex) {
        if (aNode.id == aId) {
            iIndex = aIndex;
            return true;
        }
    });
    return iIndex;
}

CTree.prototype.getCheckedIds = function () {
    return this.checkedIds.join(";");
}

CTree.prototype.getCheckedNodes = function () {
    var nodes = [],
        nodesIds = [],
        self = this;

    this.checkedIds.forEach(function (aTxId) {
        var node = self.getNodeFromTxId(aTxId);
        if (isAssigned(node)) {
            nodes.push(node);
        } else
            nodesIds.push(aTxId);
    });

    if (nodesIds.length > 0) {
        //ask to database the missing nodes
        var missingNodes = getValue(this.getNodesFromIds(nodesIds), []);
        if (missingNodes.length > 0)
            missingNodes.forEach(function (aNode) {
                nodes.push(aNode);
            });
    }
    return nodes;
}

CTree.prototype.getCheckedNames = function (aSeparator) {
    aSeparator = getValue(aSeparator, ";");
    var checkedNodes = this.getCheckedNodes(),
        names = [];

    checkedNodes.forEach(function (aNode) {
        names.push(aNode.sName);
    });

    return names.join(aSeparator);
}

CTree.prototype.getLevel = function (aId) {
    return this.tree.getLevel(aId);
}

CTree.prototype.getFolder = function (aId) {
    var node = this.getNode(aId);
    return isAssigned(node) ? getValue(node.bFolder, false) : false;
}

CTree.prototype.isMultipleItemsSelected = function () {
    return inStr(this.getSelectedItemId(), ',');
}

CTree.prototype.isNodeSelected = function () {
    return !isEmpty(this.getSelectedItemId());
}

CTree.prototype.isObjectChecked = function () {
    return this.checkedIds.length > 0;
}

CTree.prototype.getParentId = function (aId) {
    return this.tree.getParentId(aId);
}

CTree.prototype.getParentNode = function (aId) {
    var sIdParent = this.getParentId(aId);

    if (isEmpty(sIdParent))
        return;

    return this.getNode(sIdParent);
}

CTree.prototype.getIndexById = function (aId) {
    return this.tree.getIndexById(aId);
}

CTree.prototype.hasChildren = function (aId) {
    return this.tree.hasChildren(aId);
}

CTree.prototype.getAllSubItems = function (aId) {
    aId = getValue(aId, 0);
    return ""+this.tree.getAllSubItems(aId);
}

CTree.prototype.getAllSubItemsTxIds = function (aId) {
    var self = this,
        sIdsChildren = this.getAllSubItems(aId),
        ids = sIdsChildren.split(","),
        txIds = [];

    ids.forEach(function (aNode) {
        txIds.push(self.getNode(aNode).ID);
    });

    return txIds;
}

CTree.prototype.getAllSubNodes = function (aId) {
    var self = this,
        sIdsChildren = this.getAllSubItems(aId),
        ids = sIdsChildren.split(","),
        nodes = [];

    if (isEmpty(sIdsChildren))
        return nodes;

    ids.forEach(function (aNode) {
        nodes.push(self.getNode(aNode));
    });

    return nodes;
}

CTree.prototype.getSubItems = function (aId) {
    return ""+this.tree.getSubItems(aId);
}

CTree.prototype.stopEdit = function () {
    this.tree.stopEdit();
}

CTree.prototype.disabledBtnToolbar = function () {
    if (this.toolbar)
        this.toolbar.disableAllBtns();
}

CTree.prototype.enabledBtnToolbar = function () {
    if (this.toolbar)
        this.toolbar.enableAllBtns();
}

CTree.prototype.getAllParentIds = function (aNode) {
    function fillParentIds(aNode, aParentIds) {
        var parentNode = self.getParentNode(aNode.id);
        if (parentNode) {
            fillParentIds(parentNode, aParentIds);
            aParentIds.push(parentNode.ID);
        }
    }

    var self = this,
        parentIds = [];

    fillParentIds(aNode, parentIds)
    return parentIds;
}

CTree.prototype.getChildNode = function (aParentNode, aIdChildNode) {
    if (!aParentNode)
        return;

    var children = this.getAllSubNodes(aParentNode.id),
        childNode;

    children.find(function (aChild) {
        if (aChild.ID == aIdChildNode) {
            childNode = aChild;
            return true;
        }
    });

    return childNode;
}


/* events */
CTree.prototype.onCheck = function (aIdItem, aChecked) {
    var iTxId = this.getTxIdFromId(aIdItem);
    if (aChecked)
        this.addCheckedNode(iTxId, aIdItem);
    else
        this.removeCheckedNode(iTxId, aIdItem);

    if (!isEmpty(this.settings.onCheck))
        this.settings.onCheck(aIdItem, aChecked);
}

CTree.prototype.onXLE = function (aTree, aIdLastParsedItem) {
    function selectNode() {
        var idObjToSelect = self.txIdsToOpen[0],
            node;

        if (selectedNode)
            node = self.getChildNode(selectedNode, idObjToSelect);
        
        if (!node)
            node = self.getNodeFromTxId(idObjToSelect);
        
        self.txIdsToOpen = [];
        if (!isAssigned(node))
            return;

        self.clearSelection();
        self.selectItemAndFocus(node.id, true);
    }

    function openNode() {
        var node = self.getNodeFromTxId(self.txIdsToOpen[0]);

        if (isAssigned(node)) {
            if (self.txIdsToOpen.length == 1)
                selectNode();
            else
                self.openItem(node.id);

            self.txIdsToOpen.splice(0, 1);
            openNode();
        }
    }

    //this attribute permit to manage (un)checkAll.
    this.bAllLoaded = false;

    // cancelsmartrendering
    var self = this,
        node = this.getNode(aIdLastParsedItem), 
        selectedNode = this.getSelectedNode();

    //manage node to select
    if (this.bSelectFirstNodeOnLoad) {
        this.bSelectFirstNodeOnLoad = false;
        this.selectFirstNode();
        return;
    } else if (inArray(this.txIdsToOpen, "-1000")) {
        this.txIdsToOpen = [];
        msgWarning(_("L'Entité que vous tentez de visualiser a été supprimée."))
        return;
    }

    if (this.txIdsToOpen.length == 1) {
        selectNode();
    } else if (this.txIdsToOpen.length > 1) {
        openNode();
    }
}

CTree.prototype.onSelect = function (aIdItem) {
    //virtual abstract
}

CTree.prototype.onMouseIn = function (aIdItem) {
    return !this.bItemOnEdit && isEmpty(this.tree.getItemTooltip(aIdItem)) ? true : false;
}

CTree.prototype.onBeforeContextMenu = function (aIdItem) {
    //virtual abstract
}

CTree.prototype.onEdit = function (aState, aId, aTree, aValue) {
    //virtual abstract
    return true;
}

CTree.prototype.onDblClick = function (aIdItem) {
    var bOpen = this.tree.getOpenState(aIdItem) == 1;

    if (bOpen)
        this.closeItem(aIdItem);
    else
        this.openItem(aIdItem);
}

CTree.prototype.onOpenEnd = function (aIdItem, aState) {
    //virtual abstract
}

CTree.prototype.onOpenStart = function (aIdItem, aState) {
    return true;
}

CTree.prototype.onDrop = function (aIdItem, aIdParent, aIdNextSibling) {
    //virtual abstract
}

CTree.prototype.onBeforeDrag = function (aIdItem) {
    return true;
}

CTree.prototype.onDragIn = function (aIdItem, aIdParent, aSource, aTarget) {
    var bOk = true;

    if (!isEmpty(this.settings.onBeforeDrag))
        bOk = bOk & this.settings.onBeforeDrag(aIdItem, aIdParent, aSource, aTarget);

    return bOk;
}

CTree.prototype.onKeyPress = function (aKey, aEvent) {

}

CTree.prototype.onNodeModified = function () {
    //virtual abstract
}

//to catch the fake error in radiobox tree when switch to linear view if some item is checked.
dhtmlXTreeObject.prototype.preParse = function (itemId) {
    if (!itemId || !this._p) return null;
    var result = false;
    this._p.clone().through("item", "id", itemId, function (c) {
        this._globalIdStorageFind(c.up().get("id"));
        return result = true;
    }, this);
    if (result) {
        var n = this._globalIdStorageFind(itemId, true, false);
    }
    return n;
}