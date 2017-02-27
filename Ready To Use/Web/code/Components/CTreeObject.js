/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        <aSettings from CTree>
        aSettings.idOT
        aSettings.idParentFiltering
        aSettings.idAttribute campelled in case of search in parent filtering
        aSettings.bRecursive
        aSettings.bIncludeFolder
        aSettings.bRemoveTrashedObj
        aSettings.bStrongFilter
        aSettings.bCheckOnAdd : false by default
        aSettings.checkedObjects : permit to display objects checked and switch to linear view. 
        aSettings.onCheckAll : function fired when checkAll toolbar button id clicked. 
        aSettings.onUnCheckAll : function fired when unCheckAll toolbar button id clicked. 
        aSettings.onAddObject : the javascript function to call when toolbar button or combo option addObject is clicked.
        aSettings.fctMCS : the function to call when compare module is executed.
        aSettings.onSwitchToLinearView : the function to call when switching to linear view.
        aSettings.onSwitchToTreeView : the function to call when switching to tree view.
 * @returns CTreeOT object.
 */

var CTreeObject = function (aSettings) {
    this.idOT = getValue(aSettings.idOT,0);
    this.idAttribute = getValue(aSettings.idAttribute, 0);
    this.bRecursive = getValue(aSettings.bRecursive, false);
    this.bIncludeFolder = getValue(aSettings.bIncludeFolder, true);
    this.bRemoveTrashedObj = getValue(aSettings.bRemoveTrashedObj, false);
    this.bSearchInData = getValue(aSettings.bSearchInData, true);
    this.bSearchInLkdObjects = getValue(aSettings.bSearchInLkdObjects, true);
    this.bFullOT = getValue(aSettings.bFullOT, true);
    this.fctMCS = aSettings.fctMCS;
    this.fctOnSwitchToLinearView = aSettings.onSwitchToLinearView;
    this.fctOnSwitchToTreeView = aSettings.onSwitchToTreeView;
    this.bAdvancedOptionInitialized = false;
    this.checkedObjects = getValue(aSettings.checkedObjects, []);
    this.bWriteMode = getValue(aSettings.bWriteMode, true);
    this.advancedOptions;
    this.applicationModelOptions;
    this.bAdvancedCreation = false;
    this.bAdvancedDuplication = false;
    this.bStrongFilter = getValue(aSettings.bStrongFilter, false);
    this.bCheckOnAdd = getValue(aSettings.bCheckOnAdd, false);
    this.bContextMenuOptionLoaded = false;
    this.nodeIdsToCheckAndFocus = [];
    this.onAddObject = aSettings.onAddObject;
    this.bFirstLoaded = false;

    var bEnableContextMenu = getValue(aSettings.bEnableContextMenu, false),
        self = this,
        bHideButtonCheck = aSettings.sCheckType == ctNone || aSettings.sCheckType == ctRadioboxes || !isAssigned(aSettings.sCheckType),
        bHideButtonUnCheck = aSettings.sCheckType == ctNone || !isAssigned(aSettings.sCheckType),
    // generate toolbar settings
        bToolbarSettingsExist = getValue(aSettings.toolbarSettings) != "",
        bIdDivToolbarExist = getValue(aSettings.sIdDivToolbar) != "";

    if (bToolbarSettingsExist || bIdDivToolbarExist) {
        if (!bToolbarSettingsExist) {
            var bHideButtonFullScreen = !isAssigned(aSettings.sIdDivContainer);
            aSettings.toolbarSettings = {
                sIdDivToolbar: aSettings.sIdDivToolbar,
                btns: [
                    { sId: btnDisplaySelection, iBtnType: tbtSimple, sHint: _("Visualiser les Entités cochées"), sImgEnabled: "tree.png", sImgDisabled: "treeDisabled.png" }, /*, bDisabled: true*/
                    { sId: btnDisplayTree, iBtnType: tbtSimple, sHint: _("Visualisez l'intégralité de l'arborescence"), sImgEnabled: "linear.png", sImgDisabled: "linearDisabled.png", bHide: true },
                    { sId: btnCheckAll, iBtnType: tbtSimple, sHint: _("Cocher toutes les Entités"), sImgEnabled: "check.png", sImgDisabled: "checkDisabled.png", bHide: bHideButtonCheck },
                    { sId: btnUnCheckAll, iBtnType: tbtSimple, sHint: _("Décocher toutes les Entités"), sImgEnabled: "uncheck.png", sImgDisabled: "uncheckDisabled.png", bHide: bHideButtonUnCheck, bAddSpacer: true },
                    { sId: btnSearchLabel, iBtnType: tbtText, sCaption: _("Rechercher :") },
                    { sId: btnSearchInput, iBtnType: tbtInput, sHint: _("Appuyer sur la touche 'Entrée' pour lancer la recherche"), bAddSeparator : !bHideButtonFullScreen},
                    { sId: btnFullScreen, iBtnType: tbtTwoState, sHint: _("Plein écran"), sImgEnabled: "fullscreen.png", bHide: bHideButtonFullScreen }
                ],
                onClick: function (aId) { self.toolbarOnClick(aId) },
                onEnter: function (aId, aValue) { self.toolbarOnEnter(aId, aValue) },
                onStateChange: function (aId, aPressed) { self.toolbarOnStateChange(aId, aPressed) }
            }
        }
    }
    
    // generate contextMenu settings
    var bContextMenuSettingsExist = getValue(aSettings.contextMenuSettings) != "";
    
    if (bContextMenuSettingsExist || bEnableContextMenu) {
        if (!bContextMenuSettingsExist) {
            aSettings.contextMenuSettings = {
                sIdDivContextMenu: aSettings.sIdDivTree,
                options: [
                    { sId: optAddSister, sName: _("Ajouter une Entité"), sImgEnabled: "add.png", sImgDisabled: "addDisabled.png" },
                    { sId: optAddObjectChild, sName: _("Ajouter une Entité enfant"), sImgEnabled: "addChild.png", sImgDisabled: "addChildDisabled.png" },
                    { sId: optAddFolder, sName: _("Ajouter un Dossier"), sImgEnabled: "folder.png", sImgDisabled: "folderDisabled.png" },
                    { sId: optDelete, sName: _("Supprimer l'Entité"), sImgEnabled: "delete.png", sImgDisabled: "deleteDisabled.png" },
                    { sId: optDuplicate, sName: _("Dupliquer"), sImgEnabled: "duplicate.png", sImgDisabled: "duplicateDisabled.png", bAddSeparator: true }, 
                    { sId: optAdvancedCreation, sName: _("Création(s) avancée(s)"), bHidden: true },
                    { sId: optAdvancedDuplication, sName: _("Duplication(s) avancée(s)"), bHidden: true },
                    { sId: optCompare, sName: _("Comparer cette Entité aux autres...") },
                    { sId: optAdvancedComparison, sName: _("Comparaison(s) avancée(s)"), bHidden: true },
                    { sId: optAdvanced, sName: _("Avancé"), bAddSeparator: true },
                        { sId: optInsertObject, sIdParent: optAdvanced, sName: _("Insérer une Entité"), sImgEnabled: "insert.png", sImgDisabled: "insertDisabled.png" },
                        { sId: optRename, sIdParent: optAdvanced, sName: _("Renommer"), sHotKey: "F2", bDisabled: true },
                        { sId: optSwitchFolderObject, sIdParent: optAdvanced, sName: _("Changer en Dossier/Entité"), sImgEnabled: "folder.png", sImgDisabled: "folderDisabled.png", bAddSeparator: true },
                        { sId: optSort, sIdParent: optAdvanced, sName: _("Trier toute l'arborescence"), bAddSeparator: true },
                            { sId: optSortAscendant, sIdParent: optSort, sName: _("Croissant") },
                            { sId: optSortDescendant, sIdParent: optSort, sName: _("Décroissant") },
                        { sId: optExpand, sIdParent: optAdvanced, sName: _("Développer toute l'arborescence focalisée") },
                        { sId: optCollapse, sIdParent: optAdvanced, sName: _("Réduire toute l'arborescence focalisée"), bAddSeparator: !bHideButtonUnCheck },
                        { sId: optCheckBranch, sIdParent: optAdvanced, sName: _("Cocher toute l'arborescence focalisée"), bHidden: bHideButtonUnCheck, bDisabled: aSettings.sCheckType == ctRadioboxes },
                        { sId: optUnCheckBranch, sIdParent: optAdvanced, sName: _("Décocher toute l'arborescence focalisée"), bHidden: bHideButtonUnCheck },
                    { sId: optTraceabilities, sName: _("Historique des modifications...") },
                    { sId: optProperty, sName: _("Propriétés...") }
                ],
                onClick: function (aIdOption, aContextZone, aKeysPressed) { self.contextMenuOnClick(aIdOption, aContextZone, aKeysPressed); },
                onBeforeContextMenu: function (aContextZone, aEvent) { self.contextMenuOnBeforeContextMenu(aContextZone, aEvent); }
            }
        }
    }

    CTree.call(this, aSettings);

    //specific usage for the object tree.
    this.tree.setXMLAutoLoadingBehaviour("function");
    this.tree.setXMLAutoLoading(function (aId) { self.loadBranch(aId) });

    this.updateToolbarButtonState();
};

//inheritage
CTreeObject.prototype = createObject(CTree.prototype);
CTreeObject.prototype.constructor = CTreeObject; // Otherwise instances of CTreeOT would have a constructor of CTree

CTreeObject.prototype.toString = function() {
    return "CTreeObject";
}

CTreeObject.prototype.loadRoot = function () {
    //load root branch
    var self = this,
        bLoadRoot = true;

    if (this.toolbar) {
        if (this.toolbar.isBtnExist(btnDisplaySelection) && this.checkedIds.length > 0)
            bLoadRoot = false;
    }

    if (this.bKeepTreeVisu) {
        this.loadBranch(this.idParentFiltering);
    } else if (this.checkedObjects.length > 0 || this.checkedIds.length > 0) {
        this.switchToLinearView();
    } else
        this.loadBranch(this.idParentFiltering);
}

CTreeObject.prototype.loadBranch = function (aIdParent) {
    if (this.idOT < 1)
        return;

    var self = this,
        idParent = getValue(aIdParent, 0),
        parentNode;

    if (idParent > 0) {
        parentNode = this.getNode(idParent);
        if (!isEmpty(parentNode))
            idParent = parentNode.txId;
    }
    J.ajax({
        url: sPathFileComponentsAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "objectsToJSON",
            idObjParent: idParent,
            idOT: this.idOT,
            bRecursive: this.bRecursive,
            bIncludeFolder: this.bIncludeFolder,
            bRemoveTrashedObj: this.bRemoveTrashedObj
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                self.sDefaultIcon = results[1];
                self.setStdImages(self.sDefaultIcon);
                var nodes = JSON.parse(results[2]);
                self.addNodes(parentNode, nodes);
            } else
                msgDevError(results[0], "CTreeObject.loadBranch");
        }
    });
}

CTreeObject.prototype.reset = function (aIdOT, aIdsChecked, aIdsDisabled) {
    var ot = getOT(aIdOT);

    this.idOT = aIdOT;
    this.sDefaultIcon = (ot) ? ot.iIcon : "";
    this.setStdImages(this.sDefaultIcon);
    this.bLinear = false;
    CTree.prototype.reset.call(this, aIdsChecked, aIdsDisabled);
    this.bAdvancedOptionInitialized = false;
    this.bContextMenuOptionLoaded = false;
    this.updateToolbarButtonState();
    if (this.toolbar && !this.bLinear) {
        this.toolbar.hideItem(btnDisplayTree);
        this.toolbar.showItem(btnDisplaySelection);

        if (this.fctOnSwitchToTreeView)
            this.fctOnSwitchToTreeView();
    }
}

CTreeObject.prototype.getChildrenIds = function (aParentNode) {
    var childrenIds = [],
        idParent = (isEmpty(aParentNode)) ? 0 : aParentNode.txId;

    if (this.bFilteredTree && this.idParentFiltering < 1) {
        childrenIds = this.checkedIds.slice(0);
        if (idParent == 0){
            this.filteredObjects.forEach(function (aObj) {
                childrenIds.push(aObj.ID);
            });
        } else
            childrenIds.push(idParent);
    } else {
        J.ajax({
            url: sPathFileComponentsAjax,
            async: false,
            cache: false,
            data: {
                sFunctionName: "getIdsObjectFromParent",
                idObjParent: idParent,
                bRecursive: true,
                bIncludeFolder: this.bFolderCheckable,
                idOT: this.idOT
            },
            success: function (aResult) {
                var results = aResult.split("|");
                if (results[0] == sOk)
                    childrenIds = isEmpty(results[1]) ? [] : results[1].split(";");
                else
                    msgDevError(results[0], "CTreeObject.getChildrenIds");
            }
        });
    }
    return childrenIds;
}

CTreeObject.prototype.getNodesFromIds = function (aNodesIds) {
    if (isEmpty(aNodesIds))
        return [];

    var objects = [],
        sIdObjects = aNodesIds.join(";");
    J.ajax({
        url: sPathFileComponentsAjax,
        method: "POST",
        async: false,
        cache: false,
        data: {
            sFunctionName: "objectsFromIdsToJSON",
            sIdObjects: sIdObjects
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk)
                objects = isEmpty(results[1]) ? [] : JSON.parse(results[1]);
            else
                msgDevError(results[0], "CTreeObject.getNodesFromIds");
        }
    });
    return objects;
}

CTreeObject.prototype.getNodesFromValue = function (aValueSearch) {
    CTree.prototype.getNodesFromValue.call(this, aValueSearch);
    var objects = [];

    if (this.bStrongFilter && this.bFilteredTree && this.idParentFiltering < 1) {
        this.filteredObjects.forEach(function (aObj) {
            if (inStr(aObj.sName, aValueSearch, true))
                objects.push(aObj);
        });
    } else {
        if (this.idParentFiltering > 0 && this.idAttribute == 0)
            throw msgDevError("The idAttribute is equal to 0, in case of search in parent filtering tree or listing tree, this parameter is mandatory.");

        objects = getObjectsFromSearchedValue(this.idOT, aValueSearch, this.idAttribute, this.idParentFiltering, this.bSearchInLkdObjects, this.bSearchInData);
    }
    return objects;
}

CTreeObject.prototype.setTxIdToSelect = function (aTxId) {
    var self = this,
        iTxId = (""+aTxId).split(";")[0];

    J.ajax({
        url: sPathFileComponentsAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "getObjectPath",
            idObject: iTxId
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                if (results[1] != 0)
                    if (inStr(results[1], "-1000"))
                        msgWarning(_("L'Entité que vous tentez de visualiser a été supprimée."))
                    else {
                        var objectsIds = results[1].split(";");

                        if (inArray(objectsIds, self.idParentFiltering)) {
                            var iIndex = -1;
                            //remove the idParent filtering and ids before it.
                            objectsIds.find(function (aId, i) {
                                if (aId == self.idParentFiltering) {
                                    iIndex = i;
                                    return true;
                                }
                            });

                            if (iIndex > -1)
                                objectsIds.splice(iIndex, iIndex + 1)
                        }
                        self.txIdsToOpen = objectsIds;
                    }
            } else
                msgDevError(results[0], "CTreeObject.setTxIdToSelect");
        }
    });
}

CTreeObject.prototype.updateCheckType = function (aCheckType) {
    CTree.prototype.updateCheckType.call(this, aCheckType);

    switch (aCheckType) {
        case ctCheckboxes:
            if (this.toolbar)
                this.toolbar.showItem(btnCheckAll);

            if (this.contextMenu)
                this.contextMenu.enableOption(optCheckBranch);

            break;
        case ctRadioboxes:
            if (this.toolbar)
                this.toolbar.hideItem(btnCheckAll);

            if (this.contextMenu)
                this.contextMenu.disableOption(optCheckBranch);

            break;
        default:
            this.sCheckType = ctNone;
            break;
    }
}

CTreeObject.prototype.reloadFilteredLink = function (aObjects, aFullOT) {
    var self = this;

    this.bFullOT = aFullOT;
    this.bFilteredTree = !aFullOT;

    if (this.bFullOT){
        this.filteredObjects = [];
    } else {
        this.filteredObjects = aObjects;
    }

    if (this.filteredObjects.length == 0 && this.bStrongFilter) {
        // uncheck all objects in case of strong filter
        this.unCheckAll();
    }

    if (!this.bStrongFilter) {
        // display checked object even if aObject is empty
        this.getCheckedNodes().forEach(function (aObj) {
            var bFound = false;

            self.filteredObjects.find(function (aFilteredObject) {
                if (aObj.ID == aFilteredObject.ID) {
                    bFound = true;
                    return true;
                }
            });

            if (!bFound)
                aObjects.push(aObj);
        });
    }

    if (this.bLinear) {
        this.reloadFromTxObjects(this.getCheckedNodes());
    } else
        this.reloadFromTxObjects(aObjects);
}

/* handle events */
CTreeObject.prototype.onBeforeContextMenu = function (aIdNode) {
    this.getContextMenuOptions();
    //focus the object 
    this.selectItem(aIdNode);

    //add custom options
    this.getContextMenuApplicationModelOptions(this.getTxIdFromId(aIdNode));

    this.updateContextMenuOptionsState(aIdNode);
    this.updateToolbarButtonState();
}

CTreeObject.prototype.onMouseIn = function (aIdItem) {
    var bGetHint = CTree.prototype.onMouseIn.call(this, aIdItem);

    if (!bGetHint)
        return;

    var self = this,
        idObject = this.getTxIdFromId(aIdItem);

    J.ajax({
        url: sPathFileComponentsAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "getObjectHint",
            idObject: idObject
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk)
                self.setHint(aIdItem, results[1]);
            else
                msgDevError(results[0], "CTreeObject.onMouseIn");
        }
    });
}

CTreeObject.prototype.onEdit = function (aState, aId, aTree, aValue) {
    var bEdit = CTree.prototype.onEdit.call(this, aState, aId, aTree, aValue),
        self = this;

    if (!bEdit)
        return;

    bEdit = false;

    if (this.bEnableEdition) {
        bEdit = true;

        switch (aState) {
            //case 0: // before starting of editing
            case 1: // after starting of editing
                var inp = this.tree._editCell.span.firstChild;
                inp.select();
                this.bItemOnEdit = true;
                break;
            //case 2: //before editor's closing
            case 3: // after editor's closing
                aTree.setEditStartAction(false, true);
                var sName = getFormatedString(aTree.getItemText(aId)),
                    node = self.getNode(aId),
                    sOldName = node.sName,
                    iTxId = node.txId;

                if (!isEmpty(aValue) && sName != sOldName) {
                    J.ajax({
                        url: sPathFileComponentsAjax,
                        async: false,
                        cache: false,
                        data: {
                            sFunctionName: "renameObject",
                            idObject: iTxId,
                            sName: sName
                        },
                        success: function (aResult) {
                            var results = aResult.split('|');
                            if (results[0] == sOk) {
                                node.sName = sName;
                                if (isAssigned(self.onRename))
                                    self.onRename(sName);
                            } else {
                                aTree.setItemText(aId, node.sName);
                                msgError(results[0]);
                                bEdit = false;
                            }
                        }
                    });
                    
                    this.bItemOnEdit = false;
                }
                break;
        }
    }
    return bEdit;
}

CTreeObject.prototype.onKeyPress = function (aKey, aEvent) {
    CTree.prototype.onKeyPress.call(this, aKey, aEvent);

    switch (aKey) {
        case 113: // F2 key
            var sId = this.getSelectedItemId(),
                option = this.contextMenu.getOption(optRename);

            if (!isEmpty(sId) && option.bEnable)
                this.rename(sId);

            break;
    }
}

CTreeObject.prototype.onOpenEnd = function (aIdItem, aState) {
    //probleme de lenteur lorsque le noeud parent a beaucoup d'entité

    //if (aState == 1) {
        //var arrIdSelected = this.getSelectedItemIdExt().split(",");
        ////select parent if a child was selected
        //bSelect = false;
        //sIdChildren = this.getAllSubItems(aIdItem);
        //J.each(arrIdSelected, function (aIndex, aId) {
        //    if (inStr(sIdChildren, aId)) {
        //        bSelect = true;
        //        return;
        //    }
        //});
        //if (bSelect)
        //    this.selectItemAndFocus(aIdItem,true);
        //this.deleteNodes(aIdItem);
        //this.smartRefreshBranch(aIdItem);
        //this.closeItem(aIdItem);
        //this.smartRefreshBranch(aIdItem);
    //}
}

CTreeObject.prototype.onOpenStart = function (aIdItem, aState) {
    //probleme de lenteur lorsque le noeud parent a beaucoup d'entité
    var bOk = CTree.prototype.onOpenStart.call(this, aIdItem, aState);

    //switch (aState) {
    //    case 0:
    //        //bOk = false;
    //        if (!isAssigned(this.bFirstLoaded))
    //            this.smartRefreshBranch(aIdItem);
    //        else
    //            this.bFirstLoaded = true;
    //        //this.onOpenStart(aIdItem,-1);
    //        break;
    //    case -1:
    //        if (this.bFirstLoaded)
    //            this.bFirstLoaded = null;
    //        //else
    //        //    this.smartRefreshBranch(aIdItem);
    //        break;
    //}

    return bOk;
}

CTreeObject.prototype.onDrop = function (aIdItem, aIdParent, aIdNextSibling) {
    var self = this,
        idObject = this.getNodeTxId(aIdItem),
        idParent = this.getNodeTxId(aIdParent),
        idNexSibling = this.getNodeTxId(aIdNextSibling),
        iMode = (idParent == 0) ? afFille : afSoeur;

    if (idNexSibling == 0) {
        idNexSibling = -1;
        iMode = afFille;
    } else {
        var idLevelObject = this.getLevel(aIdItem),
            idLevelNext = this.getLevel(aIdNextSibling);

        if (idLevelObject == idLevelNext)
            iMode = afSoeur;
        else
            iMode = afFille;
    }

    J.ajax({
        url: sPathFileComponentsAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "moveObject",
            idOT: self.idOT,
            idObject: idObject,
            idParent: idParent,
            idNexSibling: idNexSibling,
            iMode: iMode
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                var node = self.getNode(aIdItem);
                node.idParent = idParent;
            } else
                msgDevError(results[0], "CTreeObject.onDrop");
        }
    });
}

CTreeObject.prototype.onXLE = function (aTree, aIdLastParsedItem) {
    CTree.prototype.onXLE.call(this, aTree, aIdLastParsedItem);

    var self = this,
        indexes = [];

    if (this.nodeIdsToCheckAndFocus.length > 0) {
        this.nodeIdsToCheckAndFocus.forEach(function (aId, i) {
            var node = self.getNodeFromTxId(aId);
            if (isAssigned(node)) {
                self.setCheck(node.id, true, true);
                self.selectItemAndFocus(node.id);
                indexes.push(i);
            }
        });
    }

    indexes.forEach(function (aIndex) {
        self.nodeIdsToCheckAndFocus.splice(aIndex, 1);
    });
}

/* TEEXMA obects actions */
CTreeObject.prototype.addSister = function (aIdSelected, aFolder, aAdvancedCreations, aMandatoryAttTags) {
    aFolder = getValue(aFolder, true);
    var self = this,
        addedObjects = [];

    if (isEmpty(aIdSelected)) {
        //add a root object
        addedObjects.push(this.getAddDefaultNode(aFolder));
    } else {
        var selectedIds = aIdSelected.split(',');

        selectedIds.forEach(function (aId) {
            var node = self.getNode(aId);

            addedObjects.push({
                id: node.id,
                idParent: getValue(node.ID_Parent, getValue(self.idParentFiltering, 0)),
                idNextSibling: -1,
                bFolder : aFolder,
                sAction : atSister,
                sIdParent: self.getParentId(aId)
            });
        });
    }
    this.addObject(addedObjects, aAdvancedCreations, aMandatoryAttTags);
}

CTreeObject.prototype.addChild = function (aIdSelected, aAdvancedCreations) {
    var self = this,
        addedObjects = [];

    if (isEmpty(aIdSelected)) {
        //add a root object
        addedObjects.push(this.getAddDefaultNode(false));
    } else {
        var selectedIds = aIdSelected.split(',');

        selectedIds.forEach(function (aId) {
            var node = self.getNode(aId);

            addedObjects.push({
                id: node.id,
                idParent: node.txId,
                idNextSibling : -1,
                bFolder: false,
                sAction : atChild,
                sIdParent : node.id
            });
        });
    }

    this.addObject(addedObjects, aAdvancedCreations);
}

CTreeObject.prototype.insertObject = function (aIdSelected, aFolder, aAdvancedCreations) {
    aFolder = getValue(aFolder, true);
    var self = this,
        addedObjects = [],
        selectedIds = aIdSelected.split(',');

    selectedIds.forEach(function (aId) {
        addedObjects.push(self.getInsertedNode(aId, aFolder, atInsert));
    });

    this.addObject(addedObjects, aAdvancedCreations);
}

CTreeObject.prototype.getInsertedNode = function (aId, aFolder, aAction) {
    var node = this.getNode(aId);

    return {
        id : aId,
        idParent : getValue(node.ID_Parent, 0),
        idNextSibling : node.txId,
        bFolder : aFolder,
        sAction : aAction,
        sIdParent: this.getParentId(aId),
        sIdNextSibling : node.id
    };
}

CTreeObject.prototype.getAddDefaultNode = function (aFolder) {
    return {
        idParent : getValue(this.idParentFiltering,0),
        idNextSibling : -1,
        bFolder : aFolder,
        sAction : atSister,
        sIdParent: 0
    };
}

CTreeObject.prototype.addObject = function (aObjects, aAdvancedCreations, aMandatoryAttTags) {
    this.doAddorDuplicateObject({ objects: aObjects, sAddType: "Creation", advancedCreations: aAdvancedCreations, sMandatoryAttTags: aMandatoryAttTags });

    if (isAssigned(this.onAddObject))
        this.onAddObject(aObjects);
}

CTreeObject.prototype.doAddorDuplicateObject = function (aSettings) {
    var self = this,
        sIdsSelectedObjects = "",
        selectedObjectIds,
        advancedCreation = getValue(aSettings.advancedCreation, {}),
        idAdvancedCreation = getValue(advancedCreation.ID, 0),
        advancedDuplication = getValue(aSettings.advancedDuplication, {}),
        idAdvancedDuplication = getValue(advancedDuplication.ID, "Default"),
        advancedCreations = getValue(aSettings.advancedCreations, []),
        advancedDuplications = getValue(aSettings.advancedDuplications, []),
        sIdsAttributesToDuplicate = getValue(aSettings.sIdsAttributesToDuplicate, sNull),
        bIgnoreRights = null;

    aSettings.objects.forEach(function (aObj) {
        var node = self.getNode(aObj.id);
        if (node)
            sIdsSelectedObjects = qc(sIdsSelectedObjects, node.ID,";");
    });

    sIdsSelectedObjects = getValue(sIdsSelectedObjects, "0");

    selectedObjectIds = sIdsSelectedObjects.split(";");

    if (advancedCreations.length > 1) {
        new CQueryCombo({
            sCaption: _("Sélectionner une Création Avancée"),
            iComboWidth: 327,
            sOk: _("Valider"),
            sCancel: _("Annuler"),
            options: advancedCreations,
        }, function (aId, aOption, aDummyData) {
            if (aId == 'ok')
                self.doAddorDuplicateObject({ objects: aSettings.objects, sAddType: aSettings.sAddType, advancedCreation: aOption, sIdsAttributesToDuplicate: aSettings.sIdsAttributesToDuplicate, sMandatoryAttTags: aSettings.sMandatoryAttTags });
        });
        return;
    } else if (advancedCreations.length > 0){
        advancedCreation = advancedCreations[0];
        idAdvancedCreation = advancedCreation.ID;
    } else if (advancedDuplications.length > 1) {
        new CQueryCombo({
            sCaption: _("Sélectionner une Duplication Avancée"),
            iComboWidth: 327,
            sOk: _("Valider"),
            sCancel: _("Annuler"),
            options: advancedDuplications,
        }, function (aId, aOption, aDummyData) {
            if (aId == sOk)
                self.doAddorDuplicateObject({ objects: aSettings.objects, sAddType: aSettings.sAddType, advancedDuplication: aOption, sIdsAttributesToDuplicate: aSettings.sIdsAttributesToDuplicate, sMandatoryAttTags: aSettings.sMandatoryAttTags });
        });
        return;
    } else if (advancedDuplications.length > 0) {
        advancedDuplication = advancedDuplications[0];
        idAdvancedDuplication = advancedDuplication.ID;
    }

    if (aSettings.sAddType === "Duplication" && idAdvancedDuplication === "Default" && sIdsAttributesToDuplicate === sNull) {
        this.showWindowDuplicate(aSettings.objects);
        return;
    }

    DoAddObjects({
        idObject: selectedObjectIds[0],
        idOT: this.idOT,
        iNbObjectsToAdd: (aSettings.sAddType === "Creation") ? selectedObjectIds.length : 1, // 0 : ask to user
        advancedCreation: advancedCreation,
        sAdvCreationTag: idAdvancedCreation, // Default : default behaviour, None: standard creation 
        bNForms: 'Yes', // Yes : 1 form per object, No : 1 form for all objects
        sCreationOrDuplication: aSettings.sAddType, // string "Creation" or "Duplication"
        sDuplicationSourceType: 'Identifiers', // "SelectedObjects", "LkdObjects" (link object to selected object), "Tags", "Identifiers"
        advancedDuplication: advancedDuplication,
        sAdvDuplicationTag: idAdvancedDuplication, // Default : default behaviour, None: standard duplication
        bIgnoreRights: bIgnoreRights,
        sSourceObjectsIDs: sIdsSelectedObjects, // if "Identifiers" : ids of objects to duplicate ("1234;1235;1236")
        sIdsAttributesToDuplicate: sIdsAttributesToDuplicate,
        arrSelectedObjects: aSettings.objects,
        wdowContainer: this.wdowContainer,
        sMandatoryAttTags: aSettings.sMandatoryAttTags
    }, function (aAddedObjects, aInputs) { self.endAddorDuplicateObject(aAddedObjects, aInputs) });
}

CTreeObject.prototype.endAddorDuplicateObject = function (aAddedObjects, aInputs, aValidate) {
    var self = this;

    if (aAddedObjects) {
        aAddedObjects.forEach(function (aObject) {
            var node = aObject.updateObject;
            if (node.ID_OT != self.idOT) // don't update if it's not in same OT
                return;

            aInputs.arrSelectedObjects.find(function (aSelectedObject) {
                // Test if ID_Parent is the same (array can not be in the same order...)
                if ((!node.ID_Parent || node.ID_Parent == 0) || (node.ID_Parent && node.ID_Parent == aSelectedObject.idParent)) {
                    self.copyNode(aSelectedObject, node);
                    return true;
                }
            });

            self.updateTree(aObject);
        });
    }
}

CTreeObject.prototype.copyNode = function (aSrc, aDest) {
    aDest.sIdParent = aSrc.sIdParent;
    aDest.sAction = aSrc.sAction;
    aDest.idNextSibling = aSrc.idNextSibling;
    aDest.sIdNextSibling = aSrc.sIdNextSibling;
}

CTreeObject.prototype.deleteObject = function (aIdSelected, aAdvancedDeletions, aIdAdvancedDeletion, aValidate) {
    var self = this,
        advancedDeletions = getValue(aAdvancedDeletions, []),
        idDeletionSetting = getValue(aIdAdvancedDeletion, 0);

    if (!isAssigned(aValidate)){
        msgOkCancel(_("Souhaitez-vous supprimer le(s) Entité(s) sélectionnée(s) ? Les Entités filles seront aussi supprimées."), function (aValidate) {
            self.deleteObject(aIdSelected, aAdvancedDeletions, 0, aValidate)
        });
    } else if (advancedDeletions.length > 0) {
        new CQueryCombo({
            sCaption: _("Suppression avancée"),
            sLabel: _("Souhaitez-vous utiliser une suppression avancée ?"),
            sOk: _("Oui"),
            sNo: _("Non"),
            sCancel: _("Annuler"),
            iHeight: 130,
            iComboWidth: 327,
            options: advancedDeletions
        }, function (aId, aOption, aDummyData) {
            switch (aId) {
                case "ok":
                    self.deleteObject(aIdSelected, [],aOption.ID, true);
                    break;
                case "no":
                    self.deleteObject(aIdSelected, [], 0, true);
                    break;
            }
        });
        return;
    } else if (aValidate) {
        var selectedIds = aIdSelected.split(','),
            ids = [],
            nodesToDelete = [],
            self = this;

        selectedIds.forEach(function (aId) {
            var node = self.getNode(aId);
            if (isAssigned(node)) {
                ids.push(node.txId);
                self.onCheck(aId, false);
                nodesToDelete.push(node);
            }
        });

        J.ajax({
            url: sPathFileComponentsAjax,
            async: false,
            cache: false,
            data: {
                sFunctionName: "removeObject",
                sIdObject: ids.join(";"),
                idDeletionSetting: idDeletionSetting
            },
            success: function (aResult) {
                var results = aResult.split("|");
                if (results[0] == sOk) {
                    self.removeNodes(nodesToDelete);
                    self.updateToolbarButtonState();
                    self.clearSelection(true);
                    if (isAssigned(self.onRemoveObject))
                        self.onRemoveObject();
                } else
                    msgDevError(results[0], "CTreeObject.deleteObject");
            }
        });
    }
}

CTreeObject.prototype.moveUpObject = function (aIdSelected) {
    var selectedIds = aIdSelected.split(','),
        self = this;

    selectedIds.forEach(function (aId) {
        self.moveUpStrict(aId);
        self.selectItem(aId,false,true);
    });
}

CTreeObject.prototype.moveDownObject = function (aIdSelected) {
    var selectedIds = aIdSelected.split(','),
        self = this;

    selectedIds.forEach(function (aId) {
        self.moveDownStrict(aId);
        self.selectItem(aId, false, true);
    });
}

CTreeObject.prototype.switchFolderObject = function (aIdSelected, aValidate) {
    var self = this,
        selectedIds = this.getSelectedItemId().split(",");

    if (aValidate) {
        var tmpNodes = [],
            nodes = [];

        selectedIds.forEach(function (aId) {
            var node = self.getNode(aId);
            tmpNodes.push({
                idObject: node.txId,
                bFolder: !node.bFolder
            });
            nodes.push(node);
        });

        J.ajax({
            url: sPathFileComponentsAjax,
            async: false,
            cache: false,
            data: {
                sFunctionName: "switchFolderObject",
                idOT: this.idOT,
                sJsonObject: JSON.stringify(tmpNodes)
            },
            success: function (aResult) {
                var results = aResult.split("|");
                if (results[0] == sOk) {
                    nodes.forEach(function (aNode) {
                        if (aNode.bFolder) {
                            aNode.bFolder = false;
                            aNode.iIcon = results[1];
                            var sIcon = aNode.iIcon + ".png";
                            self.setItemImage(aNode.id, sIcon, sIcon, sIcon);
                            if (self.sCheckType != ctNone)
                                self.tree.showItemCheckbox(aNode.id, true);
                        } else {
                            aNode.bFolder = true;
                            self.onCheck(aNode.id, false);
                            self.setItemImage(aNode.id, "folderClosed.gif", "folderOpen.gif", "folderClosed.gif");
                            if (!self.bFolderCheckable) {
                                self.tree.showItemCheckbox(aNode.id, false);
                                self.removeCheckedNode(aNode.txId);
                            }
                        }
                    });

                    if (!isEmpty(self.onSwitchFolderObject))
                        self.onSwitchFolderObject(aIdSelected);
                } else
                    msgError(results[0]);
            }
        });
    } else if (aValidate == null) {
        var bAsk = false;
        selectedIds.find(function (aId) {
            var node = self.getNode(aId);
            if (!node.bFolder){
                bAsk = true;
                return true;
            }
        });

        if (bAsk)
            msgYesNo(_("En transformant des Entités en dossier, toutes leurs Données seront supprimées. Souhaitez-vous poursuivre ?"), function (aValidate) { self.switchFolderObject(aIdSelected, aValidate) });
        else {
            this.switchFolderObject(aIdSelected, true);
        }
    }
}

CTreeObject.prototype.duplicateObject = function (aIdSelected, aIdAttributes, aAdvancedDuplications, aMandatoryAttTags) {
    var self = this,
        addedObjects = [],
        sIdAttributes = getValue(aIdAttributes, sNull),
        selectedIds = aIdSelected.split(',');

    selectedIds.forEach(function (aId) {
        addedObjects.push(self.getInsertedNode(aId, false, atInsert));
    });

    this.doAddorDuplicateObject({ objects: addedObjects, sAddType: "Duplication", advancedDuplications: aAdvancedDuplications, sIdAttributes: sIdAttributes, sMandatoryAttTags: aMandatoryAttTags });
}

CTreeObject.prototype.showWindowDuplicate = function () {
    var self = this,
        selectedIds = this.getSelectedItemId().split(','),
        node = self.getNode(selectedIds[0]);
    
    new CTxDuplicatePartially({
        idObject: node.txId,
        sObjectName: node.sName,
        idOT: this.idOT,
        iIcon: node.iIcon,
        bCheckAll : true
    }, function (aIdAttributes) {
        var objects = [];
        objects.push(self.getInsertedNode(selectedIds[0], false, atInsert));
        self.doAddorDuplicateObject({ objects: objects, sAddType: "Duplication", sIdsAttributesToDuplicate : aIdAttributes});
    });
}

CTreeObject.prototype.showWindowCompare = function (aIdSelected, aAdvancedComparison) {
    var self = this,
        selectedIds = aIdSelected.split(","),
        idAdvancedComparison = isAssigned(aAdvancedComparison) ? aAdvancedComparison.ID : 0,
        node = this.getNode(selectedIds[0]);

    new CTxCompare({
        idObject: node.txId,
        sObjectName: node.sName,
        idOT: node.ID_OT,
        idAdvancedComparison : idAdvancedComparison,
        iIcon : node.iIcon
    });
}

CTreeObject.prototype.openWindowTraceabilities = function (aIdSelected) {
    var rNode = this.getNode(aIdSelected);
    var settings = {
        idObject: rNode.txId,
        sName: rNode.sName,
        iIcon: format('temp_resources/theme/img/png/#1.png', [rNode.iIcon])
    }
    this.traceabilities = new CTraceabilities(settings);
}

CTreeObject.prototype.rename = function (aIdSelected) {
    var selectedIds = aIdSelected.split(",");
    this.startRenameAndSelectItem(selectedIds[0]);
}

CTreeObject.prototype.sort = function (aIdsParent, aAscending) {
    var self = this,
        sIds = this.getTxIdSelected();

    J.ajax({
        url: sPathFileComponentsAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "sortObject",
            idOT: this.idOT,
            sIdsParent: getValue(sIds, '0'),
            bAscending: aAscending
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                self.sortTree(self.getSelectedItemId(), aAscending);
            } else
                msgError(results[0]);
        }
    });
}

CTreeObject.prototype.showWindowProperty = function (aIdSelected) {
    var node = this.getNode(aIdSelected);

    new CTxProperty({
        idObject: node.txId,
        sObjectName: node.sName,
        idOT: this.idOT,
        iIcon: node.iIcon
    });
}

CTreeObject.prototype.updateTree = function (aObjectToUpdate, aDummyData) {
    var self = this,
        bLast;

    if (J.isArray(aObjectToUpdate))
        aObjectToUpdate.forEach(function (aUpdate, i) {
            bLast = (i == aObjectToUpdate.length - 1);
            self.doUpdateTree(aUpdate, bLast, aDummyData);
        });
    else
        this.doUpdateTree(aObjectToUpdate, true, aDummyData);
}

CTreeObject.prototype.doUpdateTree = function (aObjectToUpdate, aLast, aDummyData) {
    function moveObject(aId, aIdParent) {
        //find last item
        var childrenIds = (""+self.getSubItems(aIdParent)).split(","),
            sTargetedId = childrenIds[childrenIds.length - 1],
            sMode = "item_sibling_next";

        //sTargetedId = null;
        if (sTargetedId == "") {
            sMode = "item_child";
            sTargetedId = aIdParent;
        }

        //move item
        self.moveItem(aId, sMode, sTargetedId);
    }

    if (!isAssigned(aObjectToUpdate) || getObjectSize(aObjectToUpdate) < 1)
        return;

    // manage message to pop.
    var sMsg = getValue(aObjectToUpdate.sMsg, "");
    if (sMsg != "") {
        msgWarning(sMsg);
    }

    // manage update object
    var objectToUpdate = getValue(aObjectToUpdate.updateObject, null);

    if (!isAssigned(objectToUpdate))
        return;

    var idObject = getValue(objectToUpdate.ID, 0),
        idOT = getValue(objectToUpdate.ID_OT, 0),
        sObjectName = getValue(objectToUpdate.sName, ''),
        sIcon = getValue(objectToUpdate.iIcon, 0) + ".png",
        iRight = getValue(objectToUpdate.iRight, 1),
        sIdObject = this.getIdFromTxId(idObject),
        idParent = getValue(objectToUpdate.ID_Parent, 0),
        sIdParent = this.getIdFromTxId(idParent),
        objectsToOpen = getValue(objectToUpdate.objectsToOpen, []),
        bItemExist = this.tree.getIndexById(sIdObject) != null,
        bMove = false,
        objectNode,
        parentNode = this.getNodeFromTxId(idParent),
        self = this;

    if (idObject == 0)
        return;

    if (this.idAttribute > 0 || this.bCheckOnAdd) {
        this.addCheckedNode(idObject);
        if (isAssigned(this.settings.onCheck))
            this.settings.onCheck();
    }

    if (idOT == this.idOT) {
        // Add sIdParent to Object
        if (idParent > 0)
            objectToUpdate.sIdParent = sIdParent;

        // check move property
        if (!this.bLinear)
            if (sIdParent != 0){
                var sOldIdParent = this.getParentId(sIdObject);
                bMove = (sOldIdParent != sIdParent) && !this.bFilteredTree;
            }  else {
                var iOldIdParent = this.getTxIdFromId(sOldIdParent);
                bMove = (iOldIdParent != idParent) && !this.bFilteredTree;
            }

        if (!bItemExist && !bMove) {
            var node = this.addNodesJs([objectToUpdate])[0];
            sIdObject = node.id;

            if (!isEmpty(sIdParent) && sIdParent != 0)
                moveObject(sIdObject, sIdParent);
        } else {
            if (bMove) {
                //case of move item
                var bParentExist = this.getIndexById(sIdParent) != null;
                if (!bParentExist) {
                    //open last node loaded
                    var nodeToOpen,
                        bResetTree = false;

                    if (aLast) { // if not last don't need to focus and no need to open branch
                        objectsToOpen.forEach(function (aNode, i) {
                            var node = self.getNodeFromTxId(aNode.idObject);
                            if (isAssigned(node) && (self.hasChildren(node.id) > 0)) {
                                if (!self.tree.getOpenState(node.id)) // check if node already open
                                    nodeToOpen = node;
                            } else {
                                if (!nodeToOpen && !bResetTree) { // parent not present (we have to had it)
                                    if (aNode.idObject == objectsToOpen[0].idObject) { // if first item : it's a root node , reload tree
                                        bResetTree = true;
                                    } else { // else reload just the parent branch
                                        var node = self.getNodeFromTxId(objectsToOpen[i - 1].idObject);
                                        self.smartRefreshBranch(node.id);
                                    }
                                }
                                self.txIdsToOpen.push(aNode.idObject);
                            }
                        });
                    }
                    if (bItemExist) // remove item in any case
                        this.removeNode(sIdObject);

                    if (aLast) { // if not last don't need to focus and no need to open branch
                        this.txIdsToOpen.push(idObject);
                        if (isAssigned(nodeToOpen))
                            this.openItem(nodeToOpen.id);
                    }

                    if (bResetTree) {
                        this.nodeIdsToCheckAndFocus.push(idObject);
                        this.reset(idOT);
                    }
                } else {
                    //open last parent of the path and create object
                    var bHasChildren = this.hasChildren(sIdParent) > 0,
                        bChildLoaded = this.getAllSubItems(sIdParent) != "";

                    //move item.
                    if (bChildLoaded || !bHasChildren) {
                        if (bItemExist) {
                            moveObject(sIdObject, sIdParent);
                            this.setItemText(sIdObject, sObjectName);
                        } else {
                            var node = this.addNodesJs([objectToUpdate])[0];
                            sIdObject = node.id;
                        }
                    } else { // or remove item and open branch
                        if (bItemExist)
                            this.removeNode(sIdObject);

                        if (aLast) { // if not last don't need to focus and no need to open branch
                            this.txIdsToOpen.push(idObject);
                            this.openItem(sIdParent);
                        }
                    }
                }
            } else if (!isEmpty(sObjectName)) {
                // manage object renaming. 
                this.stopEdit();
                this.setItemText(sIdObject, sObjectName);
            }
        }
        // check right change on object
        objectNode = this.getNodeFromTxId(idObject);
        if (objectNode && (objectNode.iRight != iRight)) {
            objectNode.iRight = iRight;
        }
    }

    // if it is not the last instruction (don't focus object, just move, rename and add node if necessary)
    if (!aLast)
        return;

    // change OT Tree if the object to update is not in the same TE. 
    if (idOT != this.idOT) {
        txASP.displayObject(idObject);
    } else if (!bResetTree) { // same OT, just focus item.
        this.clearSelection();
        this.selectItemAndFocus(sIdObject, true);

        if (objectNode && (objectNode.id == sIdObject) && (objectNode.sName == sObjectName))
            txASP.selectCurrentObject(); // if it's the same object selected : force refresh of form
    }
}

CTreeObject.prototype.selectObject = function (aId) {
    var self = this,
        node = this.getNodeFromTxId(aId),
        bFound = true;
    
    if (isAssigned(node))
        this.selectItemAndFocus(node.id,true);
    else {
        var nodeToOpen,
            iCount = 0;

        this.setTxIdToSelect(aId);

        this.txIdsToOpen.find(function (aId) {
            var nodeTmp = self.getNodeFromTxId(aId);
            if (isAssigned(nodeTmp)) {
                nodeToOpen = nodeTmp;
                iCount++;
            } else
                return true;
        });
        if (!isAssigned(nodeToOpen)) {
            this.txIdsToOpen = [];
            bFound = false;
        } else {
            if (iCount > 0)
                this.txIdsToOpen.splice(0, iCount);

            this.openItem(nodeToOpen.id);
        }
    }
    return bFound;
}

CTreeObject.prototype.expand = function (aId) {
    function getParentWithChildrenNotLoaded(aIdNode, aParentNodes) {
        var parentNode = self.getNode(aIdNode);

        if (isAssigned(parentNode) && parentNode.bParent) {
            var bChildrenNotLoaded = isEmpty(self.getSubItems(parentNode.id)),
                bLevel0 = !isAssigned(parentNode.ID_Attribute_Set_Level) || parentNode.ID_Attribute_Set_Level == 0;

            if (bChildrenNotLoaded && bLevel0) {
                aParentNodes.push(parentNode);
                return;
            }
        }
        var sSubItemIds = self.getSubItems(aIdNode),
            subNodes = isEmpty(sSubItemIds) ? [] : sSubItemIds.split(",");

        subNodes.forEach(function (aId) {
            var node = self.getNode(aId);

            if (node.bParent) {
                //check if it has children not loaded
                var bChildrenNotLoaded = isEmpty(self.getSubItems(node.id)),
                    bLevel0 = !isAssigned(node.ID_Attribute_Set_Level) || node.ID_Attribute_Set_Level == 0;

                if (!bLevel0)
                    return;

                if (bChildrenNotLoaded) {
                    aParentNodes.push(node);
                } else
                    getParentWithChildrenNotLoaded(node.id, aParentNodes);
            }
        });
    }

    function openBranch(aIdParent) {
        var parentNode = self.getNode(aIdParent);

        if (isAssigned(parentNode)) {
            var bLevel0 = !isAssigned(parentNode.ID_Attribute_Set_Level) || parentNode.ID_Attribute_Set_Level == 0;

            if (bLevel0)
                //open the parent
                self.openItem(aIdParent);
        }

        //open children
        var sSubItemIds = self.getSubItems(aIdParent),
            subNodes = isEmpty(sSubItemIds) ? [] : sSubItemIds.split(",");

        subNodes.forEach(function (aId) {
            var node = self.getNode(aId);

            if (node.bParent) {
                openBranch(node.id);
            }
        });
    }

    function addChildren(aParentNode, aNodes) {
        var childrenNodes = [],
            nodesIndexes = [];

        aNodes.forEach(function (aNode, i) {
            if (aParentNode.ID == aNode.ID_Parent) {
                childrenNodes.push(J.extend({},aNode));
                nodesIndexes.push(i)
            }
        });

        for (var i = nodesIndexes.length - 1 ; i > -1 ; i--) {
            aNodes.splice(nodesIndexes[i], 1);
        }

        if (childrenNodes.length > 0)
            self.addNodes(aParentNode, childrenNodes);

        childrenNodes.forEach(function (aNode) {
            var bLevel0 = !isAssigned(aNode.ID_Attribute_Set_Level) || aNode.ID_Attribute_Set_Level == 0;
            if (aNode.bParent && bLevel0)
                addChildren(aNode, aNodes);
        });
    }

    var sIdSelected = getValue(aId, '0'),
        self = this,
        selectedIds = sIdSelected.split(","),
        parentNodes = [],
        parentsIds = [],
        parentsTxIds = [],
        sParentIds = "";

    //find parent folder not opened yet.
    selectedIds.forEach(function (aId) {
        var parentNodesTmp = []
        getParentWithChildrenNotLoaded(aId, parentNodesTmp);

        if (parentNodesTmp.length > 0) {
            parentNodes = parentNodes.concat(parentNodesTmp);
        } else {
            //open nodes without ajax request, all nodes has been loaded yet.
            openBranch(aId);
        }
    });

    if (parentNodes.length > 0) {
        parentNodes.forEach(function (aParentNode) {
            parentsTxIds.push(aParentNode.ID);
            parentsIds.push(aParentNode.id);
        });
        sParentIds = parentsTxIds.join(";")
    }

    if (parentNodes.length < 1)
        return;

    var expandedObjects = this.getExpandedObjects(sParentIds, parentsIds, true);

    if (expandedObjects.length > 0)
        parentNodes.forEach(function (aParentNode) {
            var txNode = findObject(expandedObjects, "idParent", aParentNode.ID);
            if (isAssigned(txNode))
                addChildren(aParentNode, txNode.Objects);
        });
}

CTreeObject.prototype.getExpandedObjects = function (aParentTxIds, aParentIds) {
    var expandedObjects = [];
    J.ajax({
        url: sPathFileComponentsAjax,
        async: false,
        cache: false,
        type: "post",
        data: {
            sFunctionName: "ExpandBranch",
            idOT: this.idOT,
            sParentIds: aParentTxIds
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk)
                expandedObjects = JSON.parse(results[1]);
            else
                msgError(results[0]);
        }
    });
    return expandedObjects;
}

CTreeObject.prototype.getCleanedObject = function (aObject) {
    var node = J.extend({}, aObject);
    delete node.ID_Parent;
    delete node.id;
    delete node.txId;

    return node;
}

/* Toolbar methods */
CTreeObject.prototype.toolbarOnClick = function (aIdBtn) {
    this.getContextMenuOptions();
    this.addAdvancedOptions();

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
            if (isAssigned(this.onCheckAll))
                this.onCheckAll();
            break;
        case btnUnCheckAll:
            this.unCheckAll(this.getSelectedItemId());
            if (isAssigned(this.onUnCheckAll))
                this.onUnCheckAll();
            break;
    }
}

CTreeObject.prototype.toolbarOnStateChange = function (aIdBtn, aPressed) {
    this.getContextMenuOptions();
    this.addAdvancedOptions();
    switch (aIdBtn) {
        case btnEdit:
            this.updateCreationToolbar(aPressed);
            this.updateToolbarButtonState();
            if (isAssigned(this.onEditClicked))
                this.onEditClicked(this.bWriteMode);
            break;
        case btnFullScreen:
            this.displayInFullScreen(aPressed);
            break;
    }
}

CTreeObject.prototype.updateCreationToolbar = function (aWriteMode, aUpdateWriteMode) {
    aUpdateWriteMode = getValue(aUpdateWriteMode, true);

    if (aUpdateWriteMode) {
        //update contextMenu
        this.bWriteMode = aWriteMode;

        //update tree edition
        if (this.bEnableEdition)
            this.tree.enableItemEditor(this.bWriteMode);
        
        //update tree d&d
        if(this.bEnableDragAndDrop)
            if (this.bWriteMode)
                this.tree.enableDragAndDrop(true);
            else
                this.tree.enableDragAndDrop("temporary_disabled");
    }
}

CTreeObject.prototype.toolbarOnEnter = function (aIdBtn, aValue) {
    switch (aIdBtn) {
        case btnSearchInput:
            this.switchToLinearView(aValue);
            break;
    }
}

CTreeObject.prototype.switchToLinearView = function (aValueSearch) {
    var nodesToDisplay = [],
        nodesFound = [],
        bSelectFirstNode = false,
        self = this;

    this.bLinear = true;

    if (isAssigned(this.toolbar)) {
        this.toolbar.hideItem(btnDisplaySelection);
        this.toolbar.hideItem(btnAddObject);
        this.toolbar.showItem(btnDisplayTree);
    }

    //find object according to search value
    if (!isEmpty(aValueSearch)) {
        bSelectFirstNode = true;
        nodesFound = this.getNodesFromValue(aValueSearch);
    }

    if (this.checkedObjects.length > 0) {
        nodesToDisplay = this.checkedObjects;
        this.checkedObjects.forEach(function (aNode) {
            self.addCheckedNode(aNode.ID);
        });
        this.checkedObjects = [];
    } else if (this.checkedIds.length == 0) {
        this.clear();
        nodesToDisplay = nodesFound;
    } else {
        var bFound = false,
            ids = [];

        // search node still loaded, if checked ids corresponding to a node not loaded, call method getNodesFromIds to ask the server.
        this.checkedIds.forEach(function (aId) {
            bFound = false;
            var iTxId = parseInt(aId),
                node = self.getNodeFromTxId(iTxId);

            if (!isEmpty(node)) {
                bFound = true;
                node.bParent = false;
                nodesToDisplay.push(node);
            }
            if (!bFound) {
                ids.push(iTxId);
            }
        });

        var nodesFromIds = this.getNodesFromIds(ids);
        nodesToDisplay = nodesToDisplay.concat(nodesFromIds);

        //concat object found with object to display
        if (nodesFound.length > 0) {
            nodesToDisplay = nodesFound.concat(nodesToDisplay).uniqueFromId();
        }
    }

    if (nodesToDisplay.length > 0) {
        this.reloadFromTxObjects(nodesToDisplay);

        if (bSelectFirstNode) {
            // select first node found in list
            var sIdFirstNode = this.getIdFromTxId(nodesToDisplay[0].ID); 
            this.selectItem(sIdFirstNode, true);
        }
    }
        
    this.tree.enableTreeLines(false);
    if (this.bEnableDragAndDrop) {
        this.tree.enableDragAndDrop("temporary_disabled");
    }

    if (this.toolbar) {
        this.toolbar.disableBtns([btnMoveDown, btnMoveUp]);
    }

    if (isAssigned(this.fctOnSwitchToLinearView))
        this.fctOnSwitchToLinearView();
}

CTreeObject.prototype.switchToTreeView = function () {
    var txIdToSelect = this.getTxIdSelected();
    if (isAssigned(this.toolbar)) {
        this.toolbar.hideItem(btnDisplayTree);
        this.toolbar.showItem(btnDisplaySelection);
        this.toolbar.showItem(btnAddObject);
    }

    if (!isEmpty(txIdToSelect))
        this.setTxIdToSelect(txIdToSelect);

    this.clear();

    this.tree.enableTreeLines(true);
    this.bLinear = false;

    if (this.bFilteredTree && this.idParentFiltering < 1)
        this.reloadFromTxObjects(this.filteredObjects);
    else
        this.loadBranch(this.idParentFiltering);

    if (this.bEnableDragAndDrop) {
        this.tree.enableDragAndDrop(true, true);
    }

    if (this.toolbar)
        this.toolbar.enableBtns([btnMoveDown, btnMoveUp]);

    var divTree = J("#" + this.sIdDiv);
    // scroll all nodes to be sure they all appear on screen.
    if (divTree.hasClass("scrolled")) {
        divTree.removeClass("scrolled");
    }

    if (isAssigned(this.fctOnSwitchToLinearView))
        this.fctOnSwitchToLinearView();
}

CTreeObject.prototype.updateToolbarButtonState = function () {
    if (this.idOT == 0)
        return;

    var bObjectsSelected = this.isNodeSelected(),
        bFolderObject = false,
        selectedObjects = this.getSelectedNodes(),
        objectType = getOT(this.idOT),
        bObjectsModifiable = true,
        bFolderModel = false,
        bEditable = objectType.iRight > dbrRead,
        bObjectsAddable = (this.bWriteMode) && (parseInt(objectType.iRight) > dbrRead) && !objectType.bFolder;

    if (!this.toolbar)
        return;

    if (bObjectsSelected)
        selectedObjects.forEach(function (aObject) {
            if (!bFolderObject && aObject.bFolder)
                bFolderObject = true;

            if (aObject.ID === "-1000" || (parseInt(aObject.iRight) < dbrStructure))
                bObjectsModifiable = false;

            if (isAssigned(aObject.bFolderModel))
                bFolderModel = aObject.bFolderModel;
        });

    if (!bObjectsSelected || (!this.bWriteMode))
        bObjectsModifiable = false;

    var bAllowEdition = bObjectsModifiable && this.bEnableEdition && bObjectsSelected;

    this.toolbar.setButtonEnable(btnEdit, bEditable);

    this.tree.enableItemEditor(bAllowEdition);

    //update tree d&d
    if (this.bEnableDragAndDrop)
        if (this.bWriteMode)
            this.tree.enableDragAndDrop(true);
        else
            this.tree.enableDragAndDrop("temporary_disabled");
    else
        this.tree.enableDragAndDrop("temporary_disabled");

    return { bObjectsModifiable: bObjectsModifiable, bObjectsAddable: bObjectsAddable, bEditable: bEditable, bAllowEdition: bAllowEdition };
}

/* ContextMenu methods */
CTreeObject.prototype.addCustomOptions = function (aIdObject) {
    var options = [];

    this.addAdvancedOptions();    

    this.contextMenu.removeOptionExt("applicationModel");
    if (this.applicationModelOptions.length > 0) {
        this.applicationModelOptions.forEach(function (aOption) {
            options.push({ idModelApplication: aOption.ID, sId: format("applicationModel#1", [aOption.ID]), sName: aOption.sName, sObjectDependency: aOption.sObjectDependency });
        });
        this.contextMenu.addOptions(options);
    }
}

CTreeObject.prototype.addAdvancedOptions = function () {
    var self = this,
        options = [];

    if (!this.bAdvancedOptionInitialized) {
        // clear AdvCreation & AdvDuplication already present
        this.bAdvancedCreation = false;
        this.bAdvancedDuplication = false;
        if (isAssigned(this.contextMenu)) {
            this.contextMenu.removeOptionsFromParent(optAdvancedCreation);
            this.contextMenu.hideOption(optAdvancedCreation);
            this.contextMenu.removeOptionsFromParent(optAdvancedDuplication);
            this.contextMenu.hideOption(optAdvancedDuplication);
            this.contextMenu.removeOptionsFromParent(optAdvancedComparison);
            this.contextMenu.hideOption(optAdvancedComparison);
            this.contextMenu.updateOption({ sId: optAddSister, customFields: [{ sName: "id", value: 0 }] });
            this.contextMenu.updateOption({ sId: optAddSister, customFields: [{ sName: "advancedCreations", value: [] }] });
            this.contextMenu.updateOption({ sId: optAddObjectChild, customFields: [{ sName: "id", value: 0 }] });
            this.contextMenu.updateOption({ sId: optAddObjectChild, customFields: [{ sName: "advancedCreations", value: [] }] });
            this.contextMenu.updateOption({ sId: optInsertObject, customFields: [{ sName: "id", value: 0 }] });
            this.contextMenu.updateOption({ sId: optInsertObject, customFields: [{ sName: "advancedCreations", value: [] }] });
            this.contextMenu.updateOption({ sId: optDelete, customFields: [{ sName: "advancedDeletions", value: [] }] });
            this.contextMenu.updateOption({ sId: optDuplicate, customFields: [{ sName: "id", value: 0 }] });
            this.contextMenu.updateOption({ sId: optDuplicate, customFields: [{ sName: "advancedDuplications", value: [] }] });
            this.contextMenu.updateOption({ sId: optCompare, sName: _("Comparer cette Entité aux autres..."), customFields: [{ sName: "advancedComparison", value: [] }] });
        }

        if (isAssigned(this.toolbarCreation)) {
            this.toolbarCreation.updateButtonField(btnAddObject, "id", 0);
            this.toolbarCreation.updateButtonField(btnAddObject, "advancedCreations", []);
            this.toolbarCreation.updateButtonField(btnAddChild, "id", 0);
            this.toolbarCreation.updateButtonField(btnAddChild, "advancedCreations", []);
            this.toolbarCreation.updateButtonField(btnRemoveObject, "advancedDeletions", []);
        }

        if (isAssigned(this.toolbar)) {
            this.toolbar.advancedCreations = [];
        }
        
        if (this.advancedOptions) {
            var optionsToAdd = [];

            //manage advanced creations
            if (this.advancedOptions.advancedCreations.length > 0) {
                var defaultCreations = [];
                this.advancedOptions.advancedCreations.forEach(function (aOption) {
                    if (aOption.bDefault)
                        defaultCreations.push(aOption);
                    else
                        optionsToAdd.push({ advancedCreations: [aOption], sId: format("#1_#2", [optAdvancedCreation, aOption.ID]), sIdParent: optAdvancedCreation, sName: aOption.sName, sImgEnabled: "add.png", sImgDisabled: "addDisabled.png" });
                });
                if (isAssigned(this.contextMenu)) {
                    this.contextMenu.updateOption({ sId: optAddSister, customFields: [{ sName: "advancedCreations", value: defaultCreations }] });
                    this.contextMenu.updateOption({ sId: optAddObjectChild, customFields: [{ sName: "advancedCreations", value: defaultCreations }] });
                    this.contextMenu.updateOption({ sId: optInsertObject, customFields: [{ sName: "advancedCreations", value: defaultCreations }] });
                }

                if (isAssigned(this.toolbarCreation)) {
                    this.toolbarCreation.updateButtonField(btnAddObject, "advancedCreations", defaultCreations);
                    this.toolbarCreation.updateButtonField(btnAddChild, "advancedCreations", defaultCreations);
                }

                if (isAssigned(this.toolbar))
                    this.toolbar.advancedCreations = defaultCreations;

                //add advanced creations to the context menu
                if (isAssigned(this.contextMenu) && optionsToAdd.length > 0){
                    this.bAdvancedCreation = true;
                    this.contextMenu.showOption(optAdvancedCreation);
                }
            }

            //manage advanced duplications
            if (this.advancedOptions.advancedDuplications.length > 0) {
                var defaultDuplications = [];
                this.advancedOptions.advancedDuplications.forEach(function (aOption) {
                    if (aOption.bDefault)
                        defaultDuplications.push(aOption);
                    else
                        optionsToAdd.push({ advancedDuplications: [aOption], sId: format("#1_#2", [optAdvancedDuplication, aOption.ID]), sIdParent: optAdvancedDuplication, sName: aOption.sName, sImgEnabled: "duplicate.png", sImgDisabled: "duplicateDisabled.png" });
                });


                if (isAssigned(this.contextMenu)){
                    this.contextMenu.updateOption({ sId: optDuplicate, customFields: [{ sName: "advancedDuplications", value: defaultDuplications }] });

                    if (this.advancedOptions.advancedDuplications.length > defaultDuplications.length) {
                        this.bAdvancedDuplication = true;
                        this.contextMenu.showOption(optAdvancedDuplication);
                    }
                }
            }

            //manage advanced Comparisons
            if (this.advancedOptions.advancedComparisons.length > 0) {
                var defaultComparisons = [];
                this.advancedOptions.advancedComparisons.forEach(function (aOption) {
                    if (aOption.bDefault)
                        defaultComparisons.push(aOption);
                    else
                        optionsToAdd.push({ advancedComparison: aOption, sId: format("#1_#2", [optAdvancedComparison, aOption.ID]), sIdParent: optAdvancedComparison, sName: aOption.sName });
                });

                if (isAssigned(this.contextMenu)) {
                    if (defaultComparisons.length > 0)
                        this.contextMenu.updateOption({ sId: optCompare, sName: defaultComparisons[0].sName, customfields: [{ sName: "advancedComparison", value: defaultComparisons[0] }] } );

                    if (this.advancedOptions.advancedComparisons.length > defaultComparisons.length)
                        this.contextMenu.showOption(optAdvancedComparison);
                }
            }

            //manage advanced Deletions
            if (isAssigned(this.contextMenu))
                this.contextMenu.updateOption({ sId: optDelete, customFields: [{ sName: "advancedDeletions", value: this.advancedOptions.advancedDeletions }] });

            if (isAssigned(this.toolbarCreation))
                this.toolbarCreation.updateButtonField(btnRemoveObject, "advancedDeletions", this.advancedOptions.advancedDeletions);

            //add options to the context menu
            if (isAssigned(this.contextMenu))
                this.contextMenu.addOptions(optionsToAdd);
        }
  
        this.bAdvancedOptionInitialized = true;
    }
}

CTreeObject.prototype.getContextMenuOptions = function () {
    if (this.bContextMenuOptionLoaded)
        return;

    var self = this,
        iRWMode = this.bWriteMode ? rwmWrite : rwmRead;

    this.bContextMenuOptionLoaded = true;

    J.ajax({
        url: sPathFileComponentsAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "getContextMenuOptions",
            idOT: this.idOT,
            idObject: 0,
            iRWMode: iRWMode
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                self.advancedOptions = JSON.parse(results[1]);
                self.applicationModelOptions = JSON.parse(results[2]);
            } else
                msgError(results[0]);
        }
    });
}

CTreeObject.prototype.getContextMenuApplicationModelOptions = function (aIdObject) {
    var self = this,
        idObject = getValue(aIdObject,0),
        iRWMode = this.bWriteMode ? rwmWrite : rwmRead;

    J.ajax({
        url: sPathFileComponentsAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "getContextMenuApplicationModelOptions",
            idOT: this.idOT,
            idObject: idObject,
            iRWMode: iRWMode
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                self.applicationModelOptions = JSON.parse(results[1]);
                self.addCustomOptions(idObject);
            } else
                msgError(results[0]);
        }
    });
}

CTreeObject.prototype.contextMenuOnClick = function (aIdOption, aContextZone, aKeysPressed) {
    var sIdSelected = this.getSelectedItemId(),
        option = this.contextMenu.getOption(aIdOption),
        advancedCreations = getValue(option.advancedCreations, []);

    switch (aIdOption) {
        case optAddSister:
            this.addSister(sIdSelected, false, advancedCreations);
            if (!isEmpty(this.onAddChild))
                this.onAddChild();
            break;
        case optAddObjectChild:
            this.addChild(sIdSelected, advancedCreations);
            if (!isEmpty(this.onAddChild))
                this.onAddChild();
            break;
        case optDelete:
            var advancedDeletions = this.contextMenu.getOption(aIdOption).advancedDeletions;
            this.deleteObject(sIdSelected, advancedDeletions);
            break;
        case optSwitchFolderObject:
            this.switchFolderObject(sIdSelected);
            break;
        case optDuplicate:
            var advancedDuplications = getValue(option.advancedDuplications, []);
            this.duplicateObject(sIdSelected, null, advancedDuplications);
            break;
        case optCompare:
            this.showWindowCompare(sIdSelected, option.advancedComparison);
            break;
        case optInsertObject:
            this.insertObject(sIdSelected, false, advancedCreations);
            break;
        case optInsertFolder:
            this.insertObject(sIdSelected);
            break;
        case optAddFolder:
            this.addSister(sIdSelected);
            break;
        case optRename:
            this.rename(sIdSelected);
            break;
        case optSortAscendant:
            this.sort(sIdSelected, true);
            break;
        case optSortDescendant:
            this.sort(sIdSelected, false);
            break;
        case optExpand:
            this.expand(sIdSelected);
            break;
        case optCollapse:
            this.collapse(sIdSelected);
            break;
        case optCheckBranch:
            this.checkAll(sIdSelected);
            if (!isEmpty(this.onCheckAll))
                this.onCheckAll();
            break;
        case optUnCheckBranch:
            this.unCheckAll(sIdSelected);
            if (!isEmpty(this.onUnCheckAll))
                this.onUnCheckAll();
            break;
        case optTraceabilities:
            this.openWindowTraceabilities(sIdSelected);
            break;
        case optProperty:
            this.showWindowProperty(sIdSelected);
            break;
        default:
            //manage advanced optiond
            if (inStr(aIdOption, "optAdvancedCreation_")) {
                this.addSister(sIdSelected, false, advancedCreations);
            } else if (inStr(aIdOption, "optAdvancedDuplication_")) {
                this.duplicateObject(sIdSelected, null, option.advancedDuplications);
            } else if (inStr(aIdOption, "optAdvancedComparison_")) {
                this.showWindowCompare(sIdSelected, option.advancedComparison);
            } else if (inStr(aIdOption, "applicationModel")) {
                this.executeApplicationModel(this.contextMenu.getOption(aIdOption));
            }
            break;
    }
}

CTreeObject.prototype.executeApplicationModel = function (aModelApplication) {
    var self = this,
        sObjectIds = this.getTxIdSelected();

    //launch the model application
    new CModelApplicationExecution({
        sObjectIds: sObjectIds,
        idModelApplication: aModelApplication.idModelApplication,
        sObjectDependency: aModelApplication.sObjectDependency,
        idObjectType: this.idOT
    }, function (aSettings) { self.updateTree(aSettings); }, {
        desactiveProgressLayout: function () {
            if (txASP) txASP.mainLayout.layout.progressOff();
        }
    });
}

CTreeObject.prototype.contextMenuOnBeforeContextMenu = function (aContextZone, aEvent) {
    this.getContextMenuOptions();

    this.getContextMenuApplicationModelOptions(0);

    // clear selection of tree items
    this.clearSelection();

    this.updateContextMenuOptionsState();
    this.updateToolbarButtonState();

    if (this.fctOnClickOut)
        this.fctOnClickOut();
}

CTreeObject.prototype.updateContextMenuOptionsState = function () {
    var bObjectsSelected = this.isNodeSelected() && !this.bReadOnly,
        bLibraryObjects = this.idOT == idOTLibrary,
        bFolderObject = false,
        selectedObjects = this.getSelectedNodes(),
        objectType = getOT(this.idOT),
        bObjectsModifiable = !this.bReadOnly,
        bAllowEdition = true,
        bShowWriteOptions = this.bWriteMode && !this.bLinear,
        bAllowOTEdition = (parseInt(objectType.iRight) > dbrRead),
        bAllowCreation = (this.bWriteMode) && bAllowOTEdition && !objectType.bFolder && !this.bReadOnly,
        bMultipleSelection = this.isMultipleItemsSelected();

    if (!bObjectsSelected || !this.bWriteMode)
        bObjectsModifiable = false;
    else
        selectedObjects.find(function (aObject) {
            if (!bFolderObject && aObject.bFolder)
                bFolderObject = true;

            if (aObject.ID === "-1000" || (aObject.iRight < dbrStructure) || (bLibraryObjects && aObject.bFolderModel))
                bObjectsModifiable = false;

            if (bFolderObject && !bObjectsModifiable)
                return true;
        });

    bAllowEdition = this.bWriteMode && this.bEnableEdition && bObjectsSelected;

    //enable disable options
    if (!isAssigned(this.contextMenu))
        return;

    this.contextMenu.setOptionEnable(optSort, bAllowOTEdition && this.bEnableEdition);
    this.contextMenu.setOptionEnable(optDelete, bObjectsModifiable);
    this.contextMenu.setOptionEnable(optRename, bObjectsModifiable);
    this.contextMenu.setOptionEnable(optSwitchFolderObject, bObjectsModifiable);
    this.contextMenu.setOptionEnable(optCompare, bObjectsSelected && !bMultipleSelection);
    this.contextMenu.setOptionEnable(optAdvancedComparison, bObjectsSelected && !bMultipleSelection);
    this.contextMenu.setOptionEnable(optProperty, bObjectsSelected && !bMultipleSelection);
    this.contextMenu.setOptionEnable(optAddSister, bAllowCreation && (!bLibraryObjects || (bLibraryObjects && (bObjectsSelected && !bFolderObject))));
    this.contextMenu.setOptionEnable(optAddObjectChild, bAllowCreation && (!bLibraryObjects || (bLibraryObjects && bObjectsSelected && bFolderObject)));
    this.contextMenu.setOptionEnable(optAddFolder, bAllowCreation && (!bLibraryObjects || (bLibraryObjects && (bObjectsSelected && !bFolderObject))));
    this.contextMenu.setOptionEnable(optInsertFolder, bObjectsSelected && bAllowCreation && (!bLibraryObjects || (bLibraryObjects && (bObjectsSelected && !bFolderObject))));
    this.contextMenu.setOptionEnable(optInsertObject, bObjectsSelected && bAllowCreation && (!bLibraryObjects || (bLibraryObjects && bObjectsSelected && !bFolderObject)));
    this.contextMenu.setOptionEnable(optDuplicate, (bObjectsSelected && (!bFolderObject) && (!bLibraryObjects || (bLibraryObjects && bObjectsSelected && !bFolderObject)) && bAllowCreation));
    this.contextMenu.setOptionEnable(optAdvancedDuplication, (bObjectsSelected && (!bFolderObject) && (!bLibraryObjects || (bLibraryObjects && bObjectsSelected && !bFolderObject)) && bAllowCreation));
    this.contextMenu.setOptionEnable(optCheckBranch, !this.bReadOnly);
    this.contextMenu.setOptionEnable(optUnCheckBranch, !this.bReadOnly);
    
    //show / hide options
    this.contextMenu.setOptionVisible(optAddSister, bShowWriteOptions);
    this.contextMenu.setOptionVisible(optAddFolder, bShowWriteOptions);
    this.contextMenu.setOptionVisible(optAddObjectChild, bShowWriteOptions);
    this.contextMenu.setOptionVisible(optDelete, bShowWriteOptions);
    this.contextMenu.setOptionVisible(optDuplicate, bShowWriteOptions);
    this.contextMenu.setOptionVisible(optAdvancedDuplication, bShowWriteOptions && this.bAdvancedDuplication);
    this.contextMenu.setOptionVisible(optAdvancedCreation, bShowWriteOptions && this.bAdvancedCreation);
    this.contextMenu.setOptionVisible(optSwitchFolderObject, bShowWriteOptions && !bLibraryObjects);
    this.contextMenu.setOptionVisible(optAdvanced, !this.bLinear);
    this.contextMenu.setOptionVisible(optAddFolderContainer, bShowWriteOptions && !bLibraryObjects);
    this.contextMenu.setOptionVisible(optInsertObject, bShowWriteOptions);
    this.contextMenu.setOptionVisible(optRename, bShowWriteOptions);
    this.contextMenu.setOptionVisible(optSort, bShowWriteOptions);
}