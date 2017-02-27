
function openTxVisualCfg(aSettings) {
    translate();
    var idObject = aSettings.idObject;
    var asCfg = aSettings.asCfg;
    var iSceneCellWidth = screen.width * 75 / 100;
    var mainLayout = new CLayout({
        sPattern: "4T",
        sParent: "idTxVDMainLayout",
        cellsSettings: [
            { sIdDivAttach: "idDivVDToolbarUp", sHeight: "42", bFixWidth: true, bFixHeight: true },
            { sIdDivAttach: "idTxVDToolBox", sHeight: "*", sWidth: 275, bFixWidth: true, bFixHeight: true },
            { sIdDivAttach: "idTxVDScene", sHeight: "*", sWidth: "*", bFixWidth: false, bFixHeight: true },
            { sIdDivAttach: "idTxVDAction", sHeight: "*", sWidth: 275, bFixWidth: true, bFixHeight: true }
        ]
    });
    // Hide layer for object name in config mode
    J(".txVDSelectedObject").hide();
    var goToolbox = new CGoToolbox({
        "sIdDivToolbox": 'txVDToolbox',
        "config": true
    });
    goToolbox.setTemplateTreeView();
    (asCfg) ? goToolbox.setModelFromAS(idObject, asCfg) : goToolbox.setAttModel(idObject);

    var goScene = new CGoScene({
        "sIdDivScene": 'idTxVDScene',
        "idObject": idObject,
        "sTagAs": getValue(asCfg, null)
    });
    goScene.layout = mainLayout;
    goScene.toolbox = goToolbox;

    var bConfigFile = goScene.getConfig();
    if (!bConfigFile)
        msgWarning(_("Vous effectuez la première configuration visual design."))

    var inspector = new Inspector('txVDInspector', goScene.myScene,
       {
           properties: {
               "key": { readOnly: true, show: false },
               "text": { readOnly: true, show: false },
               "loc": { readOnly: true, show: false},
               "fill": { show: Inspector.showIfPresent, type: 'color' },
               "stroke": { show: Inspector.showIfPresent, type: 'color'},
               "figure": { show: Inspector.showIfPresent, type: 'string' },
               "visible": { show: false },
               "category": { readOnly: true, show: false, type: 'string' },
               "size": { show: false },
               "idAtt": { show: false },
               "idOT": { show: false },
               "parent": { show: false },
               "sType": { show: false },
               "group": { show: false },
               "isEditAllowed": { show: false },
               "bMult": { show: false }
           }
       });
    
    goScene.myScene.addDiagramListener("ExternalObjectsDropped", function (e) {
        var newNode = goScene.myScene.selection.first();

        // Check first, if node is already drop
        var existingNode = goScene.categoryNodes.filter(function (aCatNode) {
            return aCatNode.category == newNode.data.category;
        });

        if (existingNode.length == 2) { // Node already existing + node added
            goScene.myScene.commandHandler.deleteSelection();
            msgWarning(_("Un élément ne peut être présent qu'une seule fois."));
            return;
        }

        // Check if a node with same idOT is present
        existingNode = goScene.categoryNodes.find(function (aCatNode) {
            return (aCatNode.idOT == newNode.data.idOT) && (aCatNode.category != newNode.data.category);
        });

        if (existingNode) {
            var itLinks = newNode.findLinksInto(),
                linksData = [];
            while (itLinks.next()) { // now iterate through link and store data (don't modify on fly because, we can't modify trough iteration)
                linksData.push(itLinks.value.data);
            }
            linksData.forEach(function (aLinkData) {
                // If link already exist : delete it else update it
                if (goScene.linkDataArray.find(function (aLink) {
                    return (aLink.from == aLinkData.from) && (aLink.to == existingNode.key)
                })) {
                    goScene.myScene.model.removeLinkData(aLinkData);
                    msgWarning(_("Un élément ne peut être présent qu'une seule fois."));
                } else {
                    goScene.myScene.model.setDataProperty(aLinkData, "to", existingNode.key);
                    // Update idAtt
                    existingNode.idAtt.push({ from: newNode.data.parent, idAtt: newNode.data.idAtt });
                }
            });
            goScene.myScene.model.removeNodeData(newNode.data);
            return;
        }

        // Update idAtt
        var idAtt = newNode.data.idAtt,
            idsAtt = [];
        idsAtt.push({ from: newNode.data.parent, idAtt: idAtt });
        goScene.myScene.model.setDataProperty(newNode.data, "idAtt", idsAtt);
    });

    // Allow inspector fields edition for the design mode
    goScene.myScene.addDiagramListener("ChangedSelection", function (diagramEvent) {
        var node = diagramEvent.diagram.selection;
        goScene.addInspectorEditionHandling(node);
    });

    J('#idAutoRepositionningBtn').hide();
    J('#txVDImgSelectedObject').hide();
    J('#idSaveJSONBtn').click(function (e) { goScene.saveCfg(e) });
    J('#idNewDrawingBtn').click(function (e) {
        goScene.myScene.clear();
        inspector.inspectObject();
    });
}

function openTxVisualInterface(aSettings) {
    J(".txVdPanelParameters").hide();
    translate();
    // Get all Shapes
    var arrNamesShape = [];
    var goFigures = go.Shape.getFigureGenerators().toArray();
    goFigures.forEach(function (aFig, ind) {
        arrNamesShape.push(aFig.key);
    });
    var layerNames = ["Background", "Default", "Foreground"];

    var idObject = aSettings.idObject;
   
    var iSceneCellWidth = screen.width;
    var mainLayout = new CLayout({
        sPattern: "4T",
        sParent: "idTxVDMainLayout",
        cellsSettings: [
            { sIdDivAttach: "idDivVDToolbarUp", sHeight: "42", bFixWidth: true, bFixHeight: true },
            { sIdDivAttach: "idTxVDToolBox", sHeight: "*", sWidth: 275, bFixWidth: true, bFixHeight: true },
            { sIdDivAttach: "idTxVDScene", sHeight: "*", sWidth: "*", bFixWidth: false, bFixHeight: true },
            { sIdDivAttach: "idTxVDAction", sHeight: "*", sWidth: 275, bFixWidth: true, bFixHeight: true }
        ]
    });

    //TODO: 
    /*
    user input: choose your config file
    */

    var goScene = new CGoScene({
        "sIdDivScene": 'idTxVDScene',
        "idObject": idObject
    });
    goScene.layout = mainLayout;
    goScene.setNameOfSelectedObject();
    
    goScene.myScene.model = goScene.graphModelForObject(idObject);
    goScene.myScene.layoutDiagram(true);
    // savedNodes for upgrade
    goScene.savedNodes = JSON.parse(goScene.myScene.model.toJson());
    goScene.myScene.nodeDataTemplate = goScene.nodeTemplate;
    var goToolbox = new CGoToolbox({
        "sIdDivToolbox": 'txVDToolbox',
        "idObject": idObject
    });
    goScene.toolbox = goToolbox;
    goToolbox.setNodeDataTemplateMap(goScene.nodeTemplate);
   
    goToolbox.setTBContent(goScene.categoryNodes);
    if (goScene.bDisplayFreeShape)
        goToolbox.addFreeShape();

    // Add the unvisible node in TBox   
    var hidenNode = goScene.categoryNodes.filter(function (aNode, ind) { return aNode.visible === false; });
    hidenNode.forEach(function (aNode, ind) {
        var node = goScene.myScene.model.nodeDataArray.find(function (aScNode, ind) {
            return aScNode.category === aNode.category;
        });
        if (!node)
            return;
        var goNode = goScene.myScene.findNodeForKey(node.key);
        goScene.myScene.startTransaction("Make visible");
        goScene.myScene.model.setDataProperty(goNode.data, 'visible', false);
        goScene.myScene.commitTransaction("Make visible");
    });

    var inspector = new Inspector('txVDInspector', goScene.myScene, {
        inspectSelection: false,
        properties: {
            "key": { readOnly: true, show: false },
            "text": { readOnly: true, show: Inspector.showIfPresent },
            "isEditAllowed": { show: false },
            "category": { readOnly: true, show: false, type: 'string' },
            "categoryName": { readOnly: true, show: false, type: 'string' },
            "sType": { readOnly: true, show: false, type: 'string' },
            "value": { show: false, type: 'string' },
            "loc": { readOnly: true, show: false },
            "size": { show: false },
            "group": { show: false },
            "visible": { show: false },
            "color": { show: Inspector.showIfPresent, type: 'color' },
            "fill": { show: Inspector.showIfPresent, type: 'color' },
            "stroke": { show: Inspector.showIfPresent, type: 'color' },
            "type": { show: false },
            "zOrder": { show: false },
			"idOT": { show: false },
			"bMult": { show: false },
			"parent": { show: false },
            "angle": { show: false }
        }
    });
    goScene.hidePanelInformation();
    
    goScene.myScene.addDiagramListener("ChangedSelection", function (e) {

        var selectedNode = e.diagram.selection;
        // Manage case of empty click
        if (!selectedNode.iterator.next()) {
            goScene.hidePanelInformation();
            return;
        }

        for (var it = selectedNode.iterator; it.next() ;) {
            var part = it.value;
            var rData = part.data;
            if ((part instanceof go.Node || part instanceof go.Part)) {
                // Allow field edition
                if (rData.isEditAllowed) {
                    goScene.showPanelInformation();
                    inspector.inspectObject(part);
                    goScene.myScene.model.setDataProperty(part, "resizable", true);
                    // Add Comboboxes Shapes + layerName
                    if (rData.layerName !== undefined) {
                        sOption = "";
                        selectedOpt = rData.layerName;
                        for (i = 0; i < layerNames.length; i++) {
                            sOption = sOption + "<option value='" + layerNames[i] + "'";
                            if (layerNames[i] == selectedOpt)
                                sOption = sOption + " selected";
                            sOption = sOption + ">" + layerNames[i] + "</option>";
                        }
                        if (sOption.indexOf("selected") == -1)
                            sOption = sOption.replace("'Default'", "'Default' selected");
                        J('#txVDInspector > table > tbody > tr > td').filter(function (index) { return J(this).text().match(/layerName/i); }).next().append('<select name="nodeLayerName">' + sOption + '</select>');
                        J('#txVDInspector > table > tbody > tr > td').filter(function (index) { return J(this).text().match(/layerName/i); }).next().children().first().attr('type', 'hidden'); // hide input
                        J('select[name=nodeLayerName]').change(function () {
                            val = J(this).val();
                            val = (val == "Default") ? "" : val;
                            J(this).prev().val(val);
                            goScene.myScene.startTransaction("Change layerName");
                            goScene.myScene.model.setDataProperty(rData, "layerName", val);
                            goScene.myScene.commitTransaction("Change layerName");
                        });
                    }
                    if (rData.category && rData.category.match(/FreeShape/i)) {
                        sOption = "";
                        sFigureShape = rData.figure;
                        selectedOpt = sFigureShape.substring(0, 1).toUpperCase() + sFigureShape.substring(1, sFigureShape.length).toLowerCase();
                        for (i = 0; i < arrNamesShape.length; i++) {
                            sOption += "<option value='" + arrNamesShape[i]+ "'";
                            if (arrNamesShape[i] == selectedOpt)
                                sOption += " selected";
                            sOption += ">" + arrNamesShape[i] +"</option>";
                        }
                        J('#txVDInspector > table > tbody > tr > td').filter(function (index) { return J(this).text() == "figure"; }).next().append('<select name="shapefigure">' + sOption + '</select>');
                        J('#txVDInspector > table > tbody > tr > td').filter(function (index) { return J(this).text() == "figure"; }).next().children().first().attr('type','hidden'); // hide input
                        J('select[name=shapefigure]').change(function () {
                            val = J(this).val();
                            J(this).prev().val(val);
                            goScene.myScene.startTransaction("Change layerName");
                            goScene.myScene.model.setDataProperty(rData, "figure", val);
                            goScene.myScene.commitTransaction("Change layerName");
                        });
                    }
                    goScene.translateNameInInspector();
                } else {
                    goScene.hidePanelInformation();
                }
            } else {
                goScene.hidePanelInformation();
            }
        }
    });
    
    goScene.myScene.addDiagramListener("ExternalObjectsDropped", function (e) {
        var newNode = goScene.myScene.selection.first();
       
        var category = newNode.category,
            linkableCategories = goScene.findLinkableCategories(category, true);
        
        
        if (category === "FreeShape") {
            // update category name, to dynamize
            goScene.myScene.startTransaction("changeCategory");
            goScene.myScene.model.setCategoryForNodeData(newNode.data, goScene.getNewFreeShapeCategory());
            goScene.myScene.commitTransaction("changeCategory");
            return;
        }

        var rData = newNode.data,
            isLnkAtt = false;
            toLink = false;
        if (rData.sType) 
            (inArray(CGoModel.ctAttLnkTypes, rData.sType)) ? isLnkAtt = true : isLnkAtt = false;

        // Make node visible onDrop
        if ((newNode instanceof go.Node)) {
            goScene.myScene.startTransaction("Make visible");
            var node = goScene.myScene.model.nodeDataArray.filter(function (aNode, ind) {
                if (aNode.category === "Picture")
                    return aNode.categoryName === rData.category;
                else
                    return aNode.category === rData.category;
            });
            if (isLnkAtt) {
                var goNode = goScene.myScene.findNodeForKey(node[0].key); 
                if (!goNode.visible) { //if any object of this category is not visible
                    node.forEach(function (aNode, ind) {
                        if (aNode.key === rData.key) {
                            return;
                        }
                        var scNode = goScene.myScene.findNodeForKey(aNode.key);
                        goScene.setNodeAndCategoryVisibility(scNode, true);
                    });
                    goScene.myScene.commandHandler.deleteSelection();
                    return;
                }
            } else {
                //if the object is not a lnkedObj, it must be not visible in the scene
                var rNode = node.find(function (aNode, ind) { return aNode.visible === false; });
                var goNode = goScene.myScene.findNodeForKey(rNode.key);
                goScene.setNodeAndCategoryVisibility(goNode, true);
                goScene.myScene.commandHandler.deleteSelection();
                return;
            }
            goScene.myScene.commitTransaction("Make visible");
           
        }
        
        if (!newNode.data.idOT)
            return;
        
		goScene.manageDropOfLinkNode(newNode,linkableCategories, inspector);
    });

    // manage diagram manually when a node or link is deleted from the diagram
    goScene.myScene.addDiagramListener("SelectionDeleting", function (e) {
        var part = e.subject.first();
        if (!part)
            return;
        // Unhidden node in TBox - only if not a linkedObj and not a FreeShape
        if (part.data.sType && !inArray(CGoModel.ctAttLnkTypes, part.data.sType)) {
            var node = goToolbox.toolbox.findNodeForKey(part.data.key);
            if (!node) {
                var tbNode = goToolbox.toolbox.model.nodeDataArray.find(function (aNode, ind) {
                    if (part.data.category === "Picture")
                        return part.data.categoryName === aNode.category;
                    else
                        return part.data.category === aNode.category;
                });
                node = goToolbox.toolbox.findNodeForKey(tbNode.key);
                e.cancel = true;
                msgWarning(format(_('La caractéristique #1 ne sera plus affichée dans la représentation graphique.'), [tbNode.text]));
            }
            var scNode = goScene.myScene.findNodeForKey(part.data.key);
            if (!node.data.visible) {
                goToolbox.toolbox.model.setDataProperty(node.data, 'visible', true);
                goScene.setNodeAndCategoryVisibility(scNode, false);
            } else {
                goToolbox.toolbox.model.setDataProperty(node.data, 'visible', false);
            }
            return;
        }
        if (part instanceof go.Node) {
            var itChildren = part.findTreeChildrenNodes(); // find all child nodes
            while (itChildren.next()) { 
                var child = itChildren.value;
                var itLinksFrom = child.findLinksInto();
                if (itLinksFrom.count == 1) { // remove node only if it has no other link
                    goScene.removeChidrenNodesLinked(child);
                    goScene.myScene.model.removeNodeData(child.data);
                }
            }
        } else if (part instanceof go.Link) {
            var child = part.toNode;
            var itLinks = child.findLinksInto();
            if (itLinks.count == 1) { // remove node only if it has no other link
                goScene.removeChidrenNodesLinked(child);
                goScene.myScene.model.removeNodeData(child.data);
            }
        }
    });

    goScene.myScene.addDiagramListener("SelectionMoved", function (e) {
        var part = e.subject.first();
        if (!part)
            return;
        if (goScene.bKeepLocation)
            goScene.myScene.model.setDataProperty(part.data, "isLayoutPositioned", false);
    });

    // Assign events on mainToolbar buttons
    J('#idSaveJSONBtn').click(function (e) { goScene.updateDesign(); });
    J('#idNewDrawingBtn').click(function (e) {
        msgYesNo(_("Êtes vous sûre d'effacer votre representation graphique ?"), function (aResponse) {
            if (!aResponse)
                return;
            goScene.hideAll(); // hide shapes (and categories) before update Toolbox
            goToolbox.setTBContent(goScene.categoryNodes);
            if (goScene.bDisplayFreeShape)
                goToolbox.addFreeShape();
        });
    });
    // Assign event on button to change selected object
    J('#txVDImgSelectedObject').click(function (e) {
        if (goScene.isGraphModified()) {
            msgYesNo(_("Des éléments ont été modifiés et non sauvegardés. Sauvegarder avant de changer la sélection ?"), function (aResponse) {
                if (aResponse)
                    goScene.updateDesign(function () {
                        goScene.changeSelectedObject();
                    });
                else
                    goScene.changeSelectedObject();
            });
        } else
            goScene.changeSelectedObject();
        
    });
    J('#idAutoRepositionningBtn').click(function (e) {
        goScene.makeAutoRepositionning();
    });
}

