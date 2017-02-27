/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        <aSettings from CTreeObject>
        aSettings.sIdDivToolbarCreation : add a toolbar to manage creation/deletion objects and move objects
 * @returns CTreeBusinessObject object.
 */

var CTreeBusinessObject = function (aSettings) {
    this.idView = getValue(aSettings.idView,0);
    this.levels = getValue(aSettings.levels, []);

    //genere toolbar
    var bIdDivToolbarExist = getValue(aSettings.sIdDivToolbar) != "",
        self = this;

    if (bIdDivToolbarExist) {
        aSettings.toolbarSettings = {
            sIdDivToolbar: aSettings.sIdDivToolbar,
            btns: [
                { sId: btnEdit, iBtnType: tbtTwoState, iPos: 2, sHint: _("Passer en mode lecture ou écriture"), sImgEnabled: "edit.png", sImgDisabled: "editDisabled.png", bPressed: aSettings.bWriteMode }
            ],
            onClick: function (aId) { self.toolbarOnClick(aId) },
            onEnter: function (aId, aValue) { self.toolbarOnEnter(aId, aValue) },
            onStateChange: function (aId, aPressed) { self.toolbarOnStateChange(aId, aPressed); }
        }
    }
    
    // generate contextMenu settings
    var bContextMenuSettingsExist = getValue(aSettings.contextMenuSettings) != "",
        bEnableContextMenu = getValue(aSettings.bEnableContextMenu, false);

    if (bContextMenuSettingsExist || bEnableContextMenu) {
        if (!bContextMenuSettingsExist) {
            aSettings.contextMenuSettings = {
                sIdDivContextMenu: aSettings.sIdDivTree,
                options: [
                    { sId: optAddSister, sName: _("Ajouter une Entité"), sImgEnabled: "add.png", sImgDisabled: "addDisabled.png" },
                    { sId: optAddObjectChild, sName: _("Ajouter une Entité enfant"), sImgEnabled: "addChild.png", sImgDisabled: "addChildDisabled.png" },
                    { sId: optAddLinkedObject, sName: _("Ajouter une Entité liée"), bHidden : true},
                    { sId: optCompare, sName: _("Comparer cette Entité aux autres...") },
                    { sId: optAdvanced, sName: _("Avancé"), bAddSeparator: true },
                        { sId: optExpand, sIdParent: optAdvanced, sName: _("Développer toute l'arborescence focalisée")},
                        { sId: optCollapse, sIdParent: optAdvanced, sName: _("Réduire toute l'arborescence focalisée") },
                    { sId: optProperty, sName: _("Propriétés...") }
                ],
                onClick: function (aIdOption, aContextZone, aKeysPressed) { self.contextMenuOnClick(aIdOption, aContextZone, aKeysPressed); },
                onBeforeContextMenu: function (aContextZone, aEvent) { self.contextMenuOnBeforeContextMenu(aContextZone, aEvent); }
            }
        }
    }

    CTreeObject.call(this, aSettings);
};

//inheritage
CTreeBusinessObject.prototype = createObject(CTreeObject.prototype);
CTreeBusinessObject.prototype.constructor = CTreeBusinessObject; // Otherwise instances of CTreeOT would have a constructor of CTree

CTreeBusinessObject.prototype.toString = function() {
    return "CTreeBusinessObject";
}

CTreeBusinessObject.prototype.getLevel = function (aIdAttributeSetLevel, aLevels) {
    aLevels = getValue(aLevels, this.levels);
    var self = this,
        level;

    if (isEmpty(aLevels))
        return;

    aLevels.find(function (aLevel) {
        if (aLevel.Levels) {
            level = self.getLevel(aIdAttributeSetLevel, aLevel.Levels);
            if (level) {
                return true;
            }
        }
        if (aIdAttributeSetLevel == aLevel.ID) {
            level = aLevel;
            return true;
        }
    });

    return level;
}

CTreeBusinessObject.prototype.reset = function (aView) {
    this.idView = aView.ID;
    this.idOT = aView.ID_OT;
    this.levels = aView.Levels;

    CTree.prototype.reset.call(this, aView.ID_OT);
}

CTreeBusinessObject.prototype.loadRoot = function () {
    //load root branch
    var self = this;
    //setTimeout(function () { Pourquoi ???!!! Cela rend asynchrone l'execution du bloc !
        self.loadBranch();
        if (self.onRoot)
            self.onRoot();
    //});
}

CTreeBusinessObject.prototype.loadBranch = function (aIdParent) {
    if (this.idView < 1)
        return;

    var idParent = getValue(aIdParent, 0),
        parentNode,
        sParent = sNull,
        self = this;

    if (idParent > 0) {
        parentNode = this.getNode(idParent);
    }
    var expandedNodes = this.getExpandedObjects("", [idParent]);

    this.addNodes(parentNode, expandedNodes[0].Objects);
}

CTreeBusinessObject.prototype.createBusinessNode = function (aNode) {
    if (!aNode.DisplayedObjects) {
        aNode.DisplayedObjects = [];
        aNode.HiddenObjects = [];
        aNode.LkdObjects = [];
        this.levels.forEach(function (aLevel) {
            aNode.DisplayedObjects.push({ IDs: [], idLevel: aLevel.ID })
            aNode.HiddenObjects.push({ IDs: [], idLevel: aLevel.ID })
            aNode.LkdObjects.push({ IDs: [], idLevel: aLevel.ID })
        });
    }

    var node = J.extend({}, aNode);
    delete node.ID_Parent;
    delete node.id;
    delete node.txId;

    return node;
}

CTreeBusinessObject.prototype.getParentsPath = function (aParentNode) {
    function getParents(aNode, aPaths) {
        var parentNode = self.getParentNode(aNode.id);
        if (parentNode)
            getParents(parentNode, aPaths);

        aPaths.push(self.createBusinessNode(aNode));
    }

    var paths = [],
        self = this;
    getParents(aParentNode, paths);
    return paths;
}

CTreeBusinessObject.prototype.setTxIdToSelect = function (aIdObj) {
    var self = this,
        idObj = ("" + aIdObj).split(";")[0],
        sIdsParents = "",
        node = this.getSelectedNode();

    if (node) {
        idsParent = this.getAllParentIds(node);
        idsParent.push(node.ID);
        sIdsParents = idsParent.join(";");
    }

    sIdsParents = getValue(sIdsParents, sNull);

    J.ajax({
        url: sPathFileComponentsAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "getBusinessObjectPath",
            idView: this.idView,
            idObject: idObj,
            sIdsParents: sIdsParents
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                if (results[1] != 0) {
                    if (inStr(results[1], "-1000"))
                        msgWarning(_("L'Entité que vous tentez de visualiser a été supprimée."))
                    else
                        self.txIdsToOpen = results[1].split(";");
                }
            } else
                msgDevError(results[0], "CTreeBusinessObject.setTxIdToSelect");
        }
    });
}

CTreeBusinessObject.prototype.addObject = function (aObjects, aAdvancedCreations, aMandatoryAttTags) {
    var self = this;
    aObjects = aObjects.filter(function (aObj) {
        var node = self.getNode(aObj.id);
        return (!aObj.id || node.ID_Attribute_Set_Level < 1 || node.ID_Attribute_Set_Level == sNull)
    });

    CTreeObject.prototype.addObject.call(this, aObjects, aAdvancedCreations, aMandatoryAttTags);
}

CTreeBusinessObject.prototype.addLink = function (aOption) {
    var self = this;

    //is there more than one advanced creation ?
    if (aOption.advancedCreations.length > 1) {
        new CQueryCombo({
            sCaption: _("Sélectionner une Création Avancée"),
            iComboWidth: 327,
            sOk: _("Valider"),
            sCancel: _("Annuler"),
            options: aOption.advancedCreations,
        }, function (aId, aResult, aDummyData) {
            if (aId == 'ok')
                self.doAddLink(aOption.idAttribute, aResult);
        });
        return;
    }
    
    this.doAddLink(aOption.idAttribute, aOption.advancedCreations[0]);
}

CTreeBusinessObject.prototype.doAddLink = function (aIdAttribute, aAdvancedCreation) {
    var self = this,
        node = this.getSelectedNode(),
        idAdvancedCreation = getValue(aAdvancedCreation,{}).ID;

    initializeAddAndLinkObjects({
        idObject: node.txId,
        idAttDirectLink: aIdAttribute,
        iNbObjectsToAdd: 1,
        //sFocusLinkObject: "Yes",
        idAdvCreation: idAdvancedCreation,
        //bDisplayForm: idAdvancedCreation > 0,
        bDisplaySuccessMsg : false
    }, function (aOutput) {
        if (isAssigned(aOutput)) {
            if (!aOutput.bNotRefresh) {
                //select the new linked object
                if (aOutput.modelApplicationResults.length > 0)
                    self.setTxIdToSelect(aOutput.modelApplicationResults[0].updateObject.ID);

                self.updateSelectedBusinessNode();
            }
        }
    });
}

CTreeBusinessObject.prototype.refreshBranch = function (aIdSelected, aIdObject) {
    this.smartRefreshBranch(aIdSelected);
    this.openItem(aIdSelected);
    if (aIdObject)
        this.selectObject(aIdObject);
}

CTreeBusinessObject.prototype.onSelect = function (aIdNode) {
    var nodes = this.getNodes(aIdNode);

    if (nodes.length == 1) {
        var self = this,
            node = nodes[0],
            idAttributeSetLevel = getValue(node.ID_Attribute_Set_Level, 0);

        if (!isAssigned(node.ID_Attribute_Set))
            node.ID_Attribute_Set = this.idView;
        if (!isAssigned(node.ID_Attribute_Set_Level))
            node.ID_Attribute_Set_Level = idAttributeSetLevel;
    }
}

CTreeBusinessObject.prototype.onBeforeDrag = function (aIdItem) {
    var bOk = CTreeObject.prototype.onBeforeDrag.call(this, aIdItem);

    if (!bOk)
        return false;

    var node = this.getNode(aIdItem);
    if (node.ID_Attribute_Set_Level) {
        if (node.ID_Attribute_Set_Level > 0 || node.ID_Attribute_Set_Level !== sNull) {
            return false;
        }
    }

    //check the case of multiselection
    //if there is a link in selected --> the drag and drop is forbidden.
    var selectedNodes = this.getSelectedNodes();
    selectedNodes.find(function (aNode) {
        if (!aNode) {
            return;
        }
        if (aNode.ID_Attribute_Set_Level) {
            if (aNode.ID_Attribute_Set_Level > 0 || aNode.ID_Attribute_Set_Level !== sNull) {
                bOk = false;
                return true;
            }
            return;
        }
    });
    
    return bOk;
}

CTreeBusinessObject.prototype.onDragIn = function (aIdItem, aIdParent, aSource, aTarget) {
    var bOk = CTreeObject.prototype.onDragIn.call(this, aIdItem, aIdParent, aSource, aTarget);

    if (!bOk)
        return false;

    if (aIdParent === 0 || !aIdParent) {
        return true;
    }

    var targetNode = this.getNode(aIdParent);
    if (!targetNode) {
        return true;
    }
    if (targetNode.ID_Attribute_Set_Level) {
        if (targetNode.ID_Attribute_Set_Level > 0 || targetNode.ID_Attribute_Set_Level !== sNull) {
            return false;
        }
        return true;
    }
    return true;
}

CTreeBusinessObject.prototype.selectObject = function (aIdObj) {
    var self = this,
        node = this.getNodeFromTxId(aIdObj),
        selectedNode = this.getSelectedNode(),
        bFound = true;

    if (selectedNode)
        node = this.getChildNode(selectedNode, aIdObj);

    if (isAssigned(node))
        this.selectItemAndFocus(node.id, true);
    else {
        this.setTxIdToSelect(aIdObj);

        var nodeToOpen,
            iCount = 0;

        if (this.txIdsToOpen.length > 0) {
            nodeToOpen = this.getNodeFromTxId(this.txIdsToOpen[0]);
            this.txIdsToOpen.splice(0, 1);
            this.txIdsToOpen.forEach(function (aId, i) {
                var nodeTmp = self.getChildNode(nodeToOpen, aId),
                    bNodeExist = isAssigned(nodeTmp);

                if (bNodeExist) {
                    nodeToOpen = nodeTmp;
                    iCount++;
                }
            });
        }

        if (!isAssigned(nodeToOpen)) {
            this.txIdsToOpen = [];
            bFound = false;
        } else {
            if (iCount > 0)
                this.txIdsToOpen.splice(0, iCount);

            if (nodeToOpen.ID == aIdObj)
                this.selectItemAndFocus(nodeToOpen.id, true);
            else
                this.openItem(nodeToOpen.id);
        }
    }
    return bFound;
}

CTreeBusinessObject.prototype.updateContextMenuOptionsState = function (aIdItem) {
    CTreeObject.prototype.updateContextMenuOptionsState.call(this, aIdItem);

    var nodes = this.getNodes(aIdItem),
        idAttributeSetLevel = 0,
        bMultipleSelection = this.isMultipleItemsSelected(),
        bFolder = false,
        bAllowAddLink = true,
        bLevel0 = true;

    nodes.forEach(function (aNode) {
        if (bLevel0)
            bLevel0 = aNode.ID_Attribute_Set_Level == 0;

        if (!bFolder)
            bFolder = getValue(aNode.bFolder, false);

        idAttributeSetLevel = getValue(aNode.ID_Attribute_Set_Level, idAttributeSetLevel);
    });

    if (this.bWriteMode && nodes.length == 1)
        bAllowAddLink = this.addCustomOptions(idAttributeSetLevel) > 0;
    else
        bAllowAddLink = false;

    bAllowAddLink = bAllowAddLink && !bFolder && this.bWriteMode && !bMultipleSelection;

    this.contextMenu.setOptionVisibleExt(optAddSister, bLevel0);
    this.contextMenu.setOptionVisibleExt(optAddObjectChild, bLevel0);
    this.contextMenu.setOptionVisible(optAddLinkedObject, bAllowAddLink);
    this.contextMenu.setOptionEnable(optAddLinkedObject, bAllowAddLink);
    this.contextMenu.setOptionEnable(optExpand, false);
    this.contextMenu.setOptionEnable(optExpand, bLevel0);
}

CTreeBusinessObject.prototype.getExpandedObjects = function (aParentTxIds, aParentIds, aRecursive) {
    var self = this,
        expandedObjects = [],
        objects = [];
    aRecursive = getValue(aRecursive, false);

    aParentIds.forEach(function (aId) {
        var parentNode = self.getNode(aId);
        if (isAssigned(parentNode))
            objects.push({ idParent: parentNode.txId, businessNodes: self.getParentsPath(parentNode) });
        else
            objects.push({ idParent: 0 })
    });

    J.ajax({
        url: sPathFileComponentsAjax,
        async: false,
        cache: false,
        type: "post",
        data: {
            sFunctionName: "businessObjectsToJSON",
            idView: this.idView,
            bRecursive: aRecursive,
            sParents: JSON.stringify(objects)
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                expandedObjects = JSON.parse(results[1]);

                self.idOT = results[2];
            } else
                msgDevError(results[0], "CTreeBusinessObject.getExpandedObjects");
        }
    });

    return expandedObjects;
}

CTreeBusinessObject.prototype.updateBusinessNode = function (aNode) {
    function doUpdateBusinessNode(aNode) {
        J.ajax({
            url: sPathFileComponentsAjax,
            async: false,
            cache: false,
            type: "post",
            data: {
                sFunctionName: "UpdateBusinessObject",
                idView: self.idView,
                sParent: JSON.stringify(self.getParentBusinessNode(aNode))
            },
            success: function (aResult) {
                var results = aResult.split("|");
                if (results[0] == sOk) {
                    var objectsUpdated = JSON.parse(results[1]),
                        parentNode = JSON.parse(results[2]);

                    self.deleteNodes(aNode.id);

                    J.extend(aNode, parentNode);

                    if (objectsUpdated.length > 0)
                        self.addNodes(aNode, objectsUpdated);
                } else
                    msgDevError(results[0], "CTreeBusinessObject.updateBusinessNode");
            }
        });
    }

    var self = this;

    doUpdateBusinessNode(aNode);

    //update other node with the same ID_Attribute_Set_Level and the same ID
    this.nodes.forEach(function (aTmpNode) {
        if (aNode.id != aTmpNode.id && aNode.ID_Attribute_Set_Level == aTmpNode.ID_Attribute_Set_Level && aNode.ID == aTmpNode.ID) {
            doUpdateBusinessNode(aTmpNode);
        }
    });
}

CTreeBusinessObject.prototype.getParentBusinessNode = function (aParentNode) {
    function getParents(aNode, aPaths) {
        if (aNode.parent)
            getParents(aNode.parent, aPaths);

        aPaths.push(self.createBusinessNode(aNode));
    }

    var paths = [],
        self = this;
    getParents(aParentNode, paths);
    return { idParent: aParentNode.txId, businessNodes: paths };
}

CTreeBusinessObject.prototype.updateSelectedBusinessNode = function () {
    this.updateBusinessNode(this.getSelectedNode());
};

/* handle events */
CTreeBusinessObject.prototype.onBeforeContextMenu = function (aIdNode) {
    CTreeObject.prototype.onBeforeContextMenu.call(this, aIdNode);

    this.bContextMenuOptionLoaded = false;
}

CTreeBusinessObject.prototype.contextMenuOnClick = function (aIdOption, aContextZone, aKeysPressed) {
    CTreeObject.prototype.contextMenuOnClick.call(this, aIdOption, aContextZone, aKeysPressed);

    var sIdSelected = this.getSelectedItemId();

    if (inStr(aIdOption, "businessOption")) {
        var option = this.contextMenu.getOption(aIdOption);
        this.addLink(option);
    }
}

CTreeBusinessObject.prototype.addCustomOptions = function (aIdAttributeSetLevel) {
    var self = this,
        options = [];
        
    this.contextMenu.removeOptionsFromParent(optAddLinkedObject);

    J.ajax({
        url: sPathFileComponentsAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "getContextMenuBusinessOptions",
            idView: this.idView,
            idAttributeSetLevel: aIdAttributeSetLevel
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                var businessOptions = JSON.parse(results[1]);
                businessOptions.forEach(function (aOption) {
                    options.push({
                        idAttribute: aOption.id,
                        sId: format("#1_#2", ["businessOption", aOption.id]),
                        sIdParent: optAddLinkedObject,
                        sName: aOption.sName,
                        advancedCreations: aOption.advancedCreations,
                        idOT: aOption.idOT,
                        iIcon: aOption.iIcon,
                    });
                });

                if (options.length > 0)
                    self.contextMenu.addOptions(options);
            } else
                msgError(results[0]);
        }
    });

    this.bCheckAdvancedOptions = true;
    return options.length;
}

CTreeBusinessObject.prototype.onNodeModified = function () {
    this.updateSelectedBusinessNode();
}

CTreeBusinessObject.prototype.updateTree = function (aObjectToUpdate, aDummyData) {
    var self = this,
         bLast;

    var refreshBranch = function (aTxObject) {
        var node = self.getNodeFromTxId(aTxObject.ID);
        if (isAssigned(node)) {
            self.updateBusinessNode(node);
        }
    }

    if (J.isArray(aObjectToUpdate))
        aObjectToUpdate.forEach(function (aObject) {
            refreshBranch(aObject.updateObject);
            bLast = (i == aObjectToUpdate.length - 1);
            self.doUpdateTree(aObject, bLast, aDummyData);
        });
    else {
        refreshBranch(aObjectToUpdate.updateObject);
        this.doUpdateTree(aObjectToUpdate, true, aDummyData);
    }
}