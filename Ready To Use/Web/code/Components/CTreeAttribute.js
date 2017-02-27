/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        <aSettings from CTree>
        aSettings.idOT *** Mandatory ***
        aSettings.bRecursiveLink
        aSettings.bDisplayAssociativeOT
        aSettings.bInheritedAttributeCheckable
        aSettings.iTypeSLTD : ttdAutorized / ttdForbidden
        aSettings.types : ["ShortString","Bool","SingleValue","RangeOfValues","Range+MeanValue","Date","DateAndTime","LongString","Email","Url","File","Table"
            ,"InverseLink 1","InverseLink N","DirectLink 1","DirectLink N","Enumeration 1","Enumeration 2","BidirectionalLink 1","BidirectionalLink 2"]
        aSettings.iADR : adrCheckable / adrAll
        aSettings.bDisplayOTRoot : boolean
        aSettings.AttributeSet : {
            Levels: [
                {ID_Att: 123, sName: "name1", Levels: [
                    {ID_Att: 456, sName: "name2"}
                ]}
            ]
        }
 * @returns CTreeAttribute object.
 */

//enum TAttributeDisplayRule
var adrCheckable = 0,
    adrAll = 1;

//enum TTypeSLTD
var ttdAutorized = 0,
    ttdForbidden = 1;

var arrTDDLnk = [C_TD_DLnk_Direct, C_TD_DLnk_Inv, C_TD_DLnk_Bi, C_TD_Data_Link, C_TD_DLnk_Enum],
    arrTDDLnkExt = [C_TD_DLnk_Direct, C_TD_DLnk_Inv, C_TD_DLnk_Bi];

var CTreeAttribute = function (aSettings) {
    checkMandatorySettings(aSettings, ["idOT"]);
    this.idOT = aSettings.idOT;
    this.bRecursiveLink = getValue(aSettings.bRecursiveLink, true);
    this.bDisplayAssociativeOT = getValue(aSettings.bDisplayAssociativeOT, true);
    this.bInheritedAttributeCheckable = getValue(aSettings.bInheritedAttributeCheckable, true);
    this.iTypeSLTD = getValue(aSettings.iTypeSLTD, ttdForbidden);
    this.iADR = getValue(aSettings.iADR, adrCheckable);
    this.types = getValue(aSettings.types, []);
    this.firstLevelNodes = [];
    this.levels = [];
    this.bDisplayOTRoot = getValue(aSettings.bDisplayOTRoot, false);
    this.attributeSet = getValue(aSettings.AttributeSet, { Levels: [] });
    this.attributeSetTmp = getValue(J.extend({}, this.attributeSet), { Levels: [] });
    this.onCheckAll = aSettings.onCheckAll;
    this.onUnCheckAll = aSettings.onUnCheckAll;
    this.fctOnSwitchToLinearView = aSettings.fctOnSwitchToLinearView;
    this.fctOnSwitchToTreeView = aSettings.fctOnSwitchToTreeView;

    //update iLevels
    this.updateLevels(this.attributeSetTmp.Levels);
    aSettings.bEnableSmartRendering = false;
    aSettings.bFolderCheckable = getValue(aSettings.bFolderCheckable,false);

    var self = this,

    // generate toolbar settings
        bToolbarSettingsExist = getValue(aSettings.toolbarSettings) != "",
        bIdDivToolbarExist = getValue(aSettings.sIdDivToolbar) != "";

    if (bToolbarSettingsExist || bIdDivToolbarExist) {
        if (!bToolbarSettingsExist) {
            aSettings.toolbarSettings = {
                sIdDivToolbar: aSettings.sIdDivToolbar,
                btns: [
                    { sId: btnDisplaySelection, iBtnType: tbtSimple, sHint: _("Visualiser les Entités cochées"), sImgEnabled: "tree.png", sImgDisabled: "treeDisabled.png" }, /*, bDisabled: true*/
                    { sId: btnDisplayTree, iBtnType: tbtSimple, sHint: _("Visualisez l'intégralité de l'arborescence"), sImgEnabled: "linear.png", sImgDisabled: "linearDisabled.png", bHide: true },
                    { sId: btnCheckAll, iBtnType: tbtSimple, sHint: _("Cocher toutes les Caractéristiques"), sImgEnabled: "check.png", sImgDisabled: "checkDisabled.png" },
                    { sId: btnUnCheckAll, iBtnType: tbtSimple, sHint: _("Décocher toutes les Caractéristiques"), sImgEnabled: "uncheck.png", sImgDisabled: "uncheckDisabled.png", bAddSpacer: true }
                ],
                onClick: function (aId) { self.toolbarOnClick(aId) }
            }
        }
    }

    // generate contexMenu settings
    var bContextMenuSettingsExist = getValue(this.contextMenuSettings) != "",
        bEnableContextMenu = getValue(aSettings.bEnableContextMenu) != "";

    if (bContextMenuSettingsExist || bEnableContextMenu) {
        if (!bContextMenuSettingsExist) {
            aSettings.contextMenuSettings = {
                sIdDivContextMenu: aSettings.sIdDivTree,
                options: [
                    { sId: optExpand, sName: _("Développer toute l'arborescence focalisée") },
                    { sId: optCollapse, sName: _("Réduire toute l'arborescence focalisée"), bAddSeparator: true },
                    { sId: optCheckBranch, sName: _("Cocher toute l'arborescence focalisée") },
                    { sId: optUnCheckBranch, sName: _("Décocher toute l'arborescence focalisée") }
                ],
                onClick: function (aIdOption, aContextZone, aKeysPressed) { self.contextMenuOnClick(aIdOption, aContextZone, aKeysPressed); },
                onBeforeContextMenu: function (aContextZone, aEvent) { self.contextMenuOnBeforeContextMenu(aContextZone, aEvent); }
            }
        }
    }
    aSettings.bFolderCheckable = false;
    CTree.call(this, aSettings);
    //specific usage for the object tree.
    this.tree.setXMLAutoLoadingBehaviour("function");
    this.tree.setXMLAutoLoading(function (aId) { self.loadBranch(aId) });
};

//inheritage
CTreeAttribute.prototype = createObject(CTree.prototype);
CTreeAttribute.prototype.constructor = CTreeAttribute; // Otherwise instances of CTreeOT would have a constructor of CTree

CTreeAttribute.prototype.toString = function() {
    return "CTreeAttribute";
}

CTreeAttribute.prototype.loadRoot = function () {
    this.loadBranch();
}

CTreeAttribute.prototype.loadBranch = function (aIdParent) {
    var idParent = 0,
        self = this,
        node;

    if (aIdParent > 0) {
        node = this.getNode(aIdParent);
        idParent = node.txId;
    }

    J.ajax({
        url: sPathFileComponentsAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "attributesToJSON",
            idOT: this.idOT,
            idParent: idParent,
            bRecursiveLink: this.bRecursiveLink,
            bDisplayAssociativeOT: this.bDisplayAssociativeOT,
            bInheritedAttributeCheckable: this.bInheritedAttributeCheckable,
            iTypeSLTD: ttdForbidden,
            iADR: this.iADR,
            sTD: this.sTD
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                var nodes = JSON.parse(results[2]);
                if (self.firstLevelNodes.length < 1)
                    self.firstLevelNodes = nodes;
                
                self.addNodes(node, nodes);
            } else
                msgDevError(results[0], "CTreeAttribute.loadBranch");
        }
    });
}

CTreeAttribute.prototype.addNodes = function (aParentNode, aNodes) {
    var self = this,
        idParent = isAssigned(aParentNode) ? aParentNode.id : 0,
        node = { id: idParent, item: [] };

    if (this.bDisplayOTRoot && idParent == 0) {
        //display the ot root node
        var objectType = J.extend({}, getOT(this.idOT)),
            addedNodes = this.addNodesJs([objectType]);

        aParentNode = addedNodes[0];
        aParentNode.sType = "RootOT";
        aParentNode.sTypeLabel = _("Type d'Entité");

        node.id = aParentNode.id;
    }

    node.item = this.loadNodes(0, aNodes, aParentNode);
    setTimeout(function(){self.doLoad(node)});
}

CTreeAttribute.prototype.loadNodes = function (aIdParent, aNodes, aParentNode) {
    var self = this,
        nodes = [],
        parentLevel,
        iLevel = 0,
        levels = self.levels;

    if (isAssigned(aParentNode)) {
        parentLevel = self.getLevel(aParentNode.id);
        if (!isAssigned(parentLevel)) {
            parentLevel = J.extend({ ID_Att: aParentNode.ID, Levels: [], iLevel: iLevel }, aParentNode);
            self.levels.push(parentLevel);
        }
        levels = parentLevel.Levels;
        iLevel = parentLevel.iLevel;
    }

    aNodes.forEach(function (aNode) {
        var idParent = getValue(aNode.ID_Parent, 0);

        if (idParent == aIdParent) {
            var node = J.extend(self.addNode(aNode), aNode);

            self.nodes.push(node);
            self.iCounter++;

            if (self.bDisplayAssociativeOT && aNode.Associativity)
                node.child = 1;

            if (self.bRecursiveLink && inStr(["InverseLink 1", "InverseLink N", "DirectLink 1", "DirectLink N", "BidirectionalLink 1", "BidirectionalLink N", "DirectLink 1 -o-"], aNode.sType))
                node.child = 1;

            if ((self.iTypeSLTD == ttdForbidden && inStr(self.types, aNode.sType)) || (self.iTypeSLTD == ttdAutorized && !inStr(self.types, aNode.sType)))
                node.nocheckbox = 1;

            //if ()

            if (aNode.bParent) {
                node.item = self.loadNodes(aNode.txId, aNodes, aParentNode);
                node.open = getValue(aNode.bFolder, false);
            } else
                node.open = false;

            if (!aNode.bFolder)
                if (node.child == 1)
                    levels.push(J.extend({ ID_Att: aNode.ID, Levels: [], iLevel: iLevel }, node));
                else
                    levels.push(J.extend({ ID_Att: aNode.ID, iLevel: iLevel }, node));

            nodes.push(node);
        }
    });
    return nodes;
}

CTreeAttribute.prototype.getChildrenIds = function (aParentNode) {
    var childrenIds = [],
        sIdsChildren = [];

    if (isEmpty(aParentNode))
        idParent = 0;
    else {
        idParent = aParentNode.id;
        sIdsChildren.push(idParent);
    }

    var sChildrenIds = this.getAllSubItems(idParent);
    if (!isEmpty(sChildrenIds))
        sIdsChildren = sIdsChildren.concat(sChildrenIds.split(","));

    sIdsChildren.forEach(function (aId) {
        var node = this.getNode(aId);

        if (node)
            childrenIds.push(node.txId);
    });

    return childrenIds;
}

CTreeAttribute.prototype.clear = function () {
    CTree.prototype.clear.call(this);
    this.levels = [];
}

CTreeAttribute.prototype.serializeNodes = function () {
    function updateSerializedNodes(aNodes) {
        aNodes.forEach(function (aNode) {
            var node = self.getNode(aNode.id);

            aNode.im0 = node.im0,
            aNode.im1 = node.im1,
            aNode.im2 = node.im2;

            if (node.nocheckbox)
                aNode.nocheckbox = node.nocheckbox;

            if (aNode.im0 == "folderClosed.gif")
                aNode.open = true;

            if (aNode.item)
                updateSerializedNodes(aNode.item)
        });
    }

    var self = this;

    this.serializedNodes = J.extend({}, JSON.parse(this.tree.serializeTreeToJSON()));

    updateSerializedNodes(this.serializedNodes.item);
}

/* manage levels */
CTreeAttribute.prototype.getLevel = function (aId, aLevels) {
    var level,
        self = this;

    if (!isAssigned(aLevels))
        aLevels = this.levels;

    if (aLevels.length < 1)
        return;

    aLevels.find(function (aLevel) {
        if (aLevel.id == aId) {
            level = aLevel;
            return true;
        }

        if (aLevel.Levels) {
            level = self.getLevel(aId, aLevel.Levels);
            if (level)
                return true;
        }
    });
    return level;
}

CTreeAttribute.prototype.updateLevels = function (aLevels, aLevelNb) {
    var self = this;
    if (!aLevels)
        return;
    aLevelNb = getValue(aLevelNb, 0);
    aLevels.forEach(function (aLevel) {
        aLevel.iLevel = aLevelNb;

        if (aLevel.Levels)
            self.updateLevels(aLevel.Levels, (aLevel.iLevel + 1));
    });
}

CTreeAttribute.prototype.getASLevel = function (aId, aLevels) {
    var attSetLevel,
        self = this;

    if (!isAssigned(aLevels))
        aLevels = this.attributeSet.Levels;

    if (aLevels.length < 1)
        return;

    aLevels.find(function (aLevel) {
        if (aLevel.id == aId) {
            attSetLevel = aLevel;
            return true;
        }

        if (aLevel.Levels) {
            attSetLevel = self.getASLevel(aId, aLevel.Levels);
            if (attSetLevel)
                return true;
        }
    });
    return attSetLevel;
}

CTreeAttribute.prototype.getLevelsFromLevelNumber = function (aLevels, aLevelNumber) {
    var levels = [],
        self = this;
    aLevels.find(function (aLevel) {
        if (aLevel.iLevel == aLevelNumber) {
            levels = aLevels;
            return true;
        }

        if (aLevel.Levels) {
            levels = self.getLevelsFromLevelNumber(aLevel.Levels, aLevelNumber);
            if (levels.length > 0)
                return true;
        }
    });
    return levels;
}

CTreeAttribute.prototype.getParentLevel = function (aId, aLevels, aParentLevel) {
    var parentLevel,
        self = this;

    if (!aLevels)
        aLevels = this.levels;

    aLevels.find(function (aLevel) {
        if (aLevel.id == aId) {
            parentLevel = aParentLevel;
            return true;
        }

        if (aLevel.Levels) {
            parentLevel = self.getParentLevel(aId, aLevel.Levels, aLevel);
            if (parentLevel) {
                return true;
            }
        }
    });

    return parentLevel;
}

CTreeAttribute.prototype.removeAttSetLevel = function (aId, aRootLevels) {
    var bOk = false,
        self = this;

    if (!aRootLevels)
        aRootLevels = this.attributeSet.Levels;

    aRootLevels.find(function (aLevel, i) {
        if (aLevel.id == aId) {
            aRootLevels.splice(i, 1);
            bOk = true;
            return true;
        }

        if (aLevel.Levels) {
            bOk = self.removeAttSetLevel(aId, aLevel.Levels);
            if (bOk)
                return true;
        }
    });
    return bOk;
}

CTreeAttribute.prototype.getCheckedIds = function () {
    var ids = [];
    this.attributeSet.Levels.forEach(function (aLevel) {
        ids.push(aLevel.ID);
    });

    if (ids.length > 0)
        return ids.join(";");
}

/* check / uncheck levels */
CTreeAttribute.prototype.checkBranch = function (aIdNodeSelected, aChecked) {
    function findLevelsInSelectedNode(aParentNode, aLevels) {
        if (!aParentNode.item)
            return [];

        aParentNode.item.forEach(function (aChildNode) {
            if (aChildNode.bFolder && aChildNode.item) {
                findLevelsInSelectedNode(aChildNode, aLevels);
            } else {
                var level = self.getLevel(aChildNode.id);

                if (level)
                    aLevels.push(level);
            }
        });
    }

    aChecked = getValue(aChecked, true);

    var selectedIds = [],
        self = this;

    if (inStr(aIdNodeSelected, ",")) {
        selectedIds = aIdNodeSelected.split(",");
    } else
        selectedIds.push(aIdNodeSelected);

    selectedIds.forEach(function (aId) {
        var selectedNode = self.getNode(aId),
            selectedLevel,
            levelsToCheck = [];

        if (selectedNode.bFolder) {
            //check a tab or group node
            findLevelsInSelectedNode(selectedNode, levelsToCheck);
        } else {
            //check an attribute
            selectedLevel = self.getLevel(selectedNode.id);

            if (aChecked)
                levelsToCheck = getValue(selectedLevel.Levels, []);

            self.checkLevel(selectedLevel.id, aChecked);
        }

        levelsToCheck.forEach(function (aLevel) {
            self.checkLevel(aLevel.id, aChecked);
        });
    });
}

CTreeAttribute.prototype.checkAll = function (aIdSelected) {
    var bAll = isEmpty(aIdSelected),
        self = this;

    if (bAll) {
        this.levels.forEach(function (aLevel) {
            self.setCheck(aLevel.id);
            var attSetLevel = self.getASLevel(aLevel.id);

            if (!isAssigned(attSetLevel))
                if (aLevel.Levels)
                    self.attributeSet.Levels.push(J.extend({ Levels: [] }, aLevel));
                else
                    self.attributeSet.Levels.push(J.extend({}, aLevel));
        });
    } else
        this.checkBranch(aIdSelected);

    if (this.onCheckAll) this.onCheckAll();
}

CTreeAttribute.prototype.unCheckAll = function (aIdSelected) {
    var bAll = isEmpty(aIdSelected),
        self = this;

    if (bAll) {
        this.attributeSet.Levels = [];
        this.setSubChecked(0, false);
    } else
        this.checkBranch(aIdSelected, false);

    if (this.onUnCheckAll) this.onUnCheckAll();
}

CTreeAttribute.prototype.addCheckedNode = function (aIdNodeChecked, aIdItem) {
    CTree.prototype.addCheckedNode.call(this, aIdNodeChecked);

    this.checkLevel(aIdItem);
}

CTreeAttribute.prototype.removeCheckedNode = function (aIdNodeChecked, aIdItem) {
    CTree.prototype.removeCheckedNode.call(this, aIdNodeChecked);

    this.checkLevel(aIdItem, false)
}

CTreeAttribute.prototype.checkLevel = function (aIdItem, aChecked) {
    function getParentsLevel(aLevel, aParentsLevels) {
        var parentLevel = self.getParentLevel(aLevel.id);

        if (parentLevel) {
            aParentsLevels.insert(0, parentLevel);
            getParentsLevel(parentLevel, aParentsLevels);
        }
    }

    aChecked = getValue(aChecked, true);
    this.checkedIds = [];

    var self = this,
        checkedNode = this.getNode(aIdItem);

    if (!checkedNode)
        return;

    if (aChecked)
        aChecked = !(this.bRespectRightToCheck && (checkedNode.iRight < dbrModif));

    this.setCheck(aIdItem, aChecked);

    var parentLevel = this.getParentLevel(checkedNode.id),
        attributeSetLevels = this.attributeSet.Levels,
        checkedLevel = this.getLevel(checkedNode.id);

    if (parentLevel && aChecked) {
        var parentsLevels = [];
        //get parents level
        getParentsLevel(checkedLevel, parentsLevels);

        //create attribute set parents levels if they don't exist and check nodes
        parentsLevels.find(function (aParentLevel, i) {
            var attributeSetLevel = self.getASLevel(aParentLevel.id, attributeSetLevels);

            if (!attributeSetLevel) {
                //create the parent attribute set level
                attributeSetLevel = J.extend({}, aParentLevel);
                attributeSetLevel.Levels = [];
                attributeSetLevels.push(attributeSetLevel);

                // check the node
                self.setCheck(aParentLevel.id, aChecked);
            } else if (!attributeSetLevel.Levels) {
                attributeSetLevel.Levels = [];
            }

            attributeSetLevels = attributeSetLevel.Levels;
        });
    }

    var checkedAttributeSetLevel;
    if (aChecked) {
        //add the attribute set level according to the checkedNode
        checkedAttributeSetLevel = this.getASLevel(checkedLevel.id);

        if (checkedAttributeSetLevel)
            return;

        checkedAttributeSetLevel = J.extend({}, checkedLevel);
        checkedAttributeSetLevel.Levels = [];

        attributeSetLevels.push(checkedAttributeSetLevel);
    } else {
        //remove children of the attribute set level checked
        checkedAttributeSetLevel = this.getASLevel(checkedLevel.id);

        if (!checkedAttributeSetLevel)
            return;

        checkedAttributeSetLevel.Levels = [];

        //and uncheck them
        this.setSubChecked(checkedLevel.id, false);

        //remove attributeSetLevelChecked
        this.removeAttSetLevel(checkedAttributeSetLevel.id);
    }
}


/* handle events */
CTreeAttribute.prototype.onBeforeContextMenu = function (aIdItem) {
    //focus the object 
    this.selectItem(aIdItem);
}

CTreeAttribute.prototype.onMouseIn = function (aIdItem) {
    var bGetHint = CTree.prototype.onMouseIn.call(this, aIdItem);

    if (!bGetHint)
        return;

    var self = this,
        node = this.getNode(aIdItem),
        idAttribute = this.getTxIdFromId(aIdItem);

    if (node.sType === "RootOT")
        J.ajax({
            url: sPathFileComponentsAjax,
            async: false,
            cache: false,
            data: {
                sFunctionName: "getOTHint",
                idOT: this.idOT
            },
            success: function (aResult) {
                var results = aResult.split("|");
                if (results[0] == sOk) {
                    self.setHint(aIdItem, results[1]);
                } else
                    msgDevError(results[0], "CComboBoxOT.onChange");
            }
        });
    else
        J.ajax({
            url: sPathFileComponentsAjax,
            async: false,
            cache: false,
            data: {
                sFunctionName: "getAttributeHint",
                idAttribute: idAttribute
            },
            success: function (aResult) {
                var results = aResult.split("|");
                if (results[0] == sOk)
                    self.setHint(aIdItem, results[1]);
                else
                    msgDevError(results[0], "CTreeAttribute.onMouseIn");
            }
        });
}

CTreeAttribute.prototype.onXLE = function (aTree, aIdLastParsedItem) {
    CTree.prototype.onXLE.call(this, aTree, aIdLastParsedItem);

    var self = this;

    //check attributes from attributeSet
    if (this.attributeSetTmp.Levels) {
        var parentLevel,
            iLevelNumber = 0,
            levels = this.levels;

        if (aIdLastParsedItem > 0) {
            parentLevel = this.getLevel(aIdLastParsedItem);
            iLevelNumber = parentLevel.iLevel + 1;
            levels = parentLevel.Levels;
        }
        var levelsTmp = this.getLevelsFromLevelNumber(this.attributeSetTmp.Levels, iLevelNumber);

        levelsTmp.forEach(function (aLevelTmp) {
            if (!isAssigned(aLevelTmp.id)) {
                levels.find(function (aLevel) {
                    if (aLevel.ID_Att == aLevelTmp.ID_Att) {
                        aLevelTmp.id = aLevel.id;
                        return true;
                    }
                });
                self.setCheck(aLevelTmp.id);
                self.addCheckedNode(aLevelTmp.ID_Att, aLevelTmp.id);
            }
        });
    }
}

/* Toolbar methods */
CTreeAttribute.prototype.toolbarOnClick = function (aIdBtn) {
    switch (aIdBtn) {
        case btnDisplaySelection:
            this.switchToLinearView();
            if (isAssigned(this.onSwitchToLinearView))
                this.onSwitchToLinearView();
            break;
        case btnDisplayTree:
            this.switchToTreeView();
            if (isAssigned(this.onSwitchToTreeView))
                this.onSwitchToTreeView();
            break;
        case btnCheckAll:
            this.checkAll(this.getSelectedItemId());
            break;
        case btnUnCheckAll:
            this.unCheckAll(this.getSelectedItemId());
            break;
    }
}

CTreeAttribute.prototype.switchToLinearView = function (aValueSearch) {
    function getLinearTree(aParentNode, aLevels) {
        aLevels.forEach(function (aLevel) {
            var node = J.extend({}, aLevel);
            node.text = aLevel.sName;
            if (node.bFolder) {
                node.im0 = "folderClosed.gif";
                node.im1 = "folderOpen.gif";
                node.im2 = node.im0;
            } else if (isEmpty(self.sStdImages))
                node.im0 = node.im1 = node.im2 = isEmpty(node.iIcon) ? "leaf.gif" : format("#1.png", [node.iIcon]);

            node.checked = true;
            delete node.child;
            delete node.open;

            if (inArray(self.disabledIds, node.ID_Att))
                node.disabled = true;

            aParentNode.item.push(node);

            if (aLevel.Levels) {
                var bParent = aLevel.Levels.length > 0;
                if (bParent) {
                    node.item = [];
                    node.open = true;
                    getLinearTree(node, node.Levels);
                }
            }
        });
    }

    var node = { 'id': 0, 'item': [] },
        self = this;
        selectedNode = this.getSelectedNode();

    this.bLinear = true;

    if (isAssigned(this.toolbar)) {
        this.toolbar.hideItem(btnDisplaySelection);
        this.toolbar.hideItem(btnAddObject);
        this.toolbar.showItem(btnDisplayTree);
    }

    this.serializeNodes();

    this.deleteChildItems();
    this.tree.enableTreeLines(false);
    
    getLinearTree(node, this.attributeSet.Levels);

    this.doLoad(node);

    if (selectedNode)
        this.selectItemAndFocus(selectedNode.id);

    if (isAssigned(this.fctOnSwitchToLinearView))
        this.fctOnSwitchToLinearView();
}

CTreeAttribute.prototype.switchToTreeView = function () {
    var self = this,
        selectedNode = this.getSelectedNode(),
        idToSelect = this.getTxIdSelected();

    if (isAssigned(this.toolbar)) {
        this.toolbar.hideItem(btnDisplayTree);
        this.toolbar.showItem(btnDisplaySelection);
        this.toolbar.showItem(btnAddObject);
    }

    this.tree.enableTreeLines(true);
    this.bLinear = false;

    if (this.serializedNodes){
        this.deleteChildItems();
        this.doLoad(this.serializedNodes);
    } else {
        this.clear();
        this.loadBranch();
    }

    //setTimeout(function () { self.checkNodesFromAS(self.attributeSet.Levels); }, 1)
    this.checkNodesFromAS(this.attributeSet.Levels);

    var divTree = J("#" + this.sIdDiv);
    // scroll all nodes to be sure they all appear on screen.
    if (divTree.hasClass("scrolled")) {
        divTree.removeClass("scrolled");
    }

    if (selectedNode)
        this.selectItemAndFocus(selectedNode.id);

    if (isAssigned(this.fctOnSwitchToTreeView))
        this.fctOnSwitchToTreeView();
}

CTreeAttribute.prototype.checkNodesFromAS = function (aLevels) {
    var self = this;
    aLevels.forEach(function (aLevel) {
        //var node = self.getNode(aLevel.id);
        self.setCheck(aLevel.id);
        if (aLevel.Levels)
            self.checkNodesFromAS(aLevel.Levels)
    });
}

/* ContextMenu methods */
CTreeAttribute.prototype.contextMenuOnClick = function (aIdOption, aContextZone, aKeysPressed) {
    var idSelected = this.getSelectedItemId();
    switch (aIdOption) {
        case optExpand:
            this.expand(idSelected);
            break;
        case optCollapse:
            this.collapse(idSelected);
            break;
        case optCheckBranch:
            this.checkAll(idSelected);
            break;
        case optUnCheckBranch:
            this.unCheckAll(idSelected);
            break;
    }
}

CTreeAttribute.prototype.contextMenuOnBeforeContextMenu = function (aContextZone, aEvent) {
    // clear selection of tree items
    this.clearSelection();
}
