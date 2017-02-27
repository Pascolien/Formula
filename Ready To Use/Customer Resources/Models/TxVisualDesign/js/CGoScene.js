var CGoScene = (function ($) {
    //private attribute
    CGoScene.wrapper = _url("/temp_resources/models/TxVisualDesign/VDAjax.asp");

    //constructor
    function CGoScene(aSettings) {
        CGoModel.call(this);

        var self = this;
        this.settings = aSettings;
        this.idObject = aSettings.idObject;
        this.goJs = go.GraphObject.make;
        this.sTagAs = aSettings.sTagAs;
        this.sIdDivScene = aSettings.sIdDivScene;
        this.savedNodes = {};
        this.iVirtualIndex = 0;

        // Init Model 
        this.getNodeData(aSettings.idObject);

        // Init scene
        this.myScene =
                 this.goJs(go.Diagram, this.sIdDivScene,
            {
                // have mouse wheel events zoom in and out instead of scroll up and down
                "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
				"toolManager.hoverDelay": 100,  // how quickly tooltips are shown
                allowDrop: true,
                allowClipboard: false,
                layout: this.goJs(go.TreeLayout,
                 { angle: this.layoutAngle })
            });

        this.myScene.nodeTemplateMap.add("", // default category
            this.goJs(go.Node, "Auto",
                { locationSpot: go.Spot.Center, resizable: true },
                new go.Binding("isLayoutPositioned", "isLayoutPositioned"),
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                this.goJs(go.Shape, "Ellipse",
                    { strokeWidth: 3, fill: "white", name: "SHAPE" },
                    new go.Binding("figure", "figure"),
                    new go.Binding("visible", "visible"),
                    new go.Binding("fill", "fill"),
                    new go.Binding("stroke", "stroke")
                ),
                this.goJs(go.TextBlock,
                    {
                        margin: 5,
                        maxSize: new go.Size(200, NaN),
                        wrap: go.TextBlock.WrapFit,
                        textAlign: "center",
                        editable: true,
                        font: "bold 9pt Helvetica, Arial, sans-serif",
                        name: "TEXT"
                    },
                    new go.Binding("text", "text").makeTwoWay()
                )
            )
        );

        this.myScene.linkTemplate =
          this.goJs(go.Link,  // the whole link panel
            {
                routing: go.Link.AvoidsNodes,
                curve: go.Link.JumpOver,
                corner: 2, toShortLength: 4,
                reshapable: true,
                resegmentable: true,
                // mouse-overs subtly highlight links:
                mouseEnter: function (e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
                mouseLeave: function (e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; }
            },
            new go.Binding("points").makeTwoWay(),
            this.goJs(go.Shape,  // the highlight shape, normally transparent
              { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
            this.goJs(go.Shape,  // the link path shape
              { isPanelMain: true, stroke: "gray", strokeWidth: 3 }),
            this.goJs(go.Shape,  // the arrowhead
              { toArrow: "standard", stroke: null, fill: "gray" })
        );
        /*this.goJs(go.Panel, "Auto",  // the link label, normally not visible
              { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5 },
              new go.Binding("visible", "visible").makeTwoWay(),
              this.goJs$(go.Shape, "RoundedRectangle",  // the label shape
                { fill: "#F8F8F8", stroke: null }),
              this.goJs(go.TextBlock, "Yes",  // the label
                {
                    textAlign: "center",
                    font: "10pt helvetica, arial, sans-serif",
                    stroke: "#333333",
                    editable: true
                },
                new go.Binding("text").makeTwoWay())
            )*/

        this.goActionPanel = new CGoActionPanel({
            "sIdDiv": "idTxVDPanelActions"
        });
        this.myScene.mouseDrop = function (evt) {
            self.linkObj(evt);
        };

        $(window).resize(function () {
            self.layout.setSizes();
        });
    }
    //private methods
 

    //inheritage
    CGoScene.prototype = Object.create(CGoModel.prototype);
    CGoScene.constructor = CGoScene;

    //public methods
    CGoScene.prototype = $.extend(CGoScene.prototype, {

        hideAll: function () {
            var self = this,
                nodeDataToRemove = [];
            // hide all shapes
            this.myScene.model.nodeDataArray.forEach(function (aNode, ind) {
                var goNodeData = self.myScene.model.findNodeDataForKey(aNode.key);
                
                if (goNodeData) {
                    if (aNode.category.match(/FreeShape/i)) {
                        nodeDataToRemove.push(goNodeData);
                    } else 
                        self.myScene.model.setDataProperty(goNodeData, 'visible', false);
                }
            });
            // remove nodes
            nodeDataToRemove.forEach(function (aNodeData) {
                self.myScene.model.removeNodeData(aNodeData);
            });
            // hide all categories for Toolbox 
            this.categoryNodes.forEach(function (aNode) {
                aNode.visible = false;
            });
        },

        addInspectorEditionHandling: function (aNode) {
            var self = this;
            for (var it = aNode.iterator; it.next() ;) {
                var part = it.value;  
                var rData = part.data;
                if (part instanceof go.Node) {
                    J('#txVDInspector > table > tbody').append('<TR><TD>' + _("Autoriser l'édition des champs en mode design") + '</TD><TD><input type="checkbox" id="idChEditableField' + rData.key + '" name="ch" value="1"></TD></TR>');
                    J('#idChEditableField' + rData.key).attr('checked', getValue(part.data.isEditAllowed, false));
                    J('#idChEditableField' + rData.key).click(function (e) {
                        var isChecked = J(this).is(':checked');
                        self.myScene.model.setDataProperty(part.data, 'isEditAllowed', isChecked);
                    });
                }
            }
        },

        setNodeDataTemplateMap: function () {
            var self = this;

            //nodeTemplateMap creation     
            this.nodeTemplate.forEach(function (aNode, ind) {
                
                self.myScene.nodeTemplateMap.add(aNode.drawCategory,
                    self.goJs(go.Node, "Auto",
                        { // handle dragging a Node onto a Node to (maybe) create a link between the 2 nodes
                            mouseDrop: function (e, node) {
                                var diagram = node.diagram;
                                self.isLinkable = false;
                                var selectedNode = diagram.selection.first();  // assume just one Node in selection
                                if (selectedNode.linksConnected.count > 0) return;
                                if (self.mayLinkedWith(selectedNode, node)) {
                                    self.isLinkable = true;
                                    // find any existing link into the selected node
                                    var link = selectedNode.findTreeParentLink();
                                    if (link !== null) {  // reconnect any existing link
                                        link.fromNode = node;
                                    } else {  // else create a new link
                                        diagram.toolManager.linkingTool.insertLink(node, node.port, selectedNode, selectedNode.port);
                                    }
                                }
                            }
                        },
                        {
                            visible: aNode.visible
                        },
                        self.goJs(go.Shape, aNode.Shape.figure,
                            { fill: aNode.Shape.fill, stroke: aNode.Shape.stroke, cursor: "pointer", strokeWidth: 3 }
                        ),
                        new go.Binding("isLayoutPositioned", "isLayoutPositioned"),
                        new go.Binding("layerName", "layerName"),
                        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                        new go.Binding("visible", "visible"),
                        new go.Binding("isEditAllowed", "isEditAllowed"),
                        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                        self.goJs(go.TextBlock, aNode.TextBlock,
                            {
                                stretch: go.GraphObject.Horizontal,
                                wrap: go.TextBlock.WrapFit,
                                overflow: go.TextBlock.OverflowEllipsis,
                                cursor: "pointer"
                            },
                            new go.Binding("text").makeTwoWay()
                        ),
						// ECAR - begin
                        // One small named ports
                        self.makePort("port", go.Spot.Center, true, true),
                        {   // handle mouse enter/leave events to show/hide the ports
                            mouseEnter: function(e, node) { self.showSmallPorts(node, true); },
                            mouseLeave: function (e, node) { self.showSmallPorts(node, false); },
                            // Etablish possible links for the current node
                            linkValidation: function (fromNode,fromPort,toNode,toPort,link) {
                                // check if the nodes are already linked together
                                if (fromNode.findLinksBetween(toNode).count == 1) return false;

                                var linkableCategories = self.findLinkableCategories(fromNode.category, false);

                                var existingCategory = linkableCategories.find(function (aCategory) {
                                    return aCategory.category == toNode.category;
                                });

                                if (!existingCategory) return false
                                // check link multiplicity 
                                if (toNode.data.bMult == false && self.isLinkedWithSameCategoryNode(fromNode.data.key, toNode))
                                    return false;
                                else
                                    return true;
                            }
                        }
						// ECAR - end
                    )
                );
            });
            //Data type Picture
            this.myScene.nodeTemplateMap.add("Picture",
               self.goJs(go.Node, "Spot",
                    { // Create automatic link on new node even hover Picture
                        mouseDrop: function (e, node) {
                            self.linkObj(e);
                        }
                    },
                    new go.Binding("isLayoutPositioned", "isLayoutPositioned"),
                    new go.Binding("layerName", "layerName"),
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                    new go.Binding("visible", "visible"),
                    self.goJs(go.Picture,
                        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                        new go.Binding("source", "key"),
                        new go.Binding("category", "category")
                    )
                )
            );
            //Data type FreeShape
            var iMinIndex = 0;
            this.nodes.nodeDatas.forEach(function (aNode) {
                if (aNode.category.match(/FreeShape/i)) {
                    if (aNode.category.length > 9) {
                        var iIndex = parseInt(aNode.category.substring(9));
                        if (iIndex < iMinIndex) iMinIndex = iIndex;
                    }
                    self.myScene.nodeTemplateMap.add(aNode.category,
                        self.goJs(go.Part, "Spot",
                            { // Create automatic link on new node even hover FreeShape
                                mouseDrop: function (e, node) {
                                    self.linkObj(e);
                                }
                            },
                            { resizable: true, resizeObjectName: "SHAPE" },
                            { rotatable: true, rotateObjectName: "SHAPE" },
                            new go.Binding("isLayoutPositioned", "isLayoutPositioned"),
                            new go.Binding("layerName", "layerName"),
                            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                            new go.Binding("visible", "visible"),
                            self.goJs(go.Shape, {
                                name: "SHAPE", strokeWidth: 3
                            },
                            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                            new go.Binding("figure", "figure").makeTwoWay(),
                            new go.Binding("fill", "color").makeTwoWay(),
                            new go.Binding("stroke", "stroke").makeTwoWay(),
                            new go.Binding("angle", "angle").makeTwoWay())
                        )
                    );
                }
            });
            this.iVirtualIndex = iMinIndex;
        },

        // this is used to determine if 2 nodes can be linked together
        mayLinkedWith: function (aChildNode, aParentNode) {
            if (!(aChildNode instanceof go.Node)) return false;  // must be a Node
            if (aChildNode === aParentNode) return false;  // cannot work for yourself
            // Check if a link is possible
            var childNodeCategory = this.categoryNodes.find(function (aData) {
                return aData.category == aChildNode.category;
            });
            var parentNodeCategory = this.categoryNodes.find(function (aData) {
                return aData.category == aParentNode.category;
            });
            if (!childNodeCategory || !parentNodeCategory) return false;
            return this.linkDataArray.find(function (aLink) {
                return (aLink.from == parentNodeCategory.key) && (aLink.to == childNodeCategory.key)
            });
        },

        updateObj: function (aPart, evt) {
            var idOt = getObjectIdOT(aPart.data.key);
            var sIdDivCombo = 'objectCombo';
            var txObjects;
            var cX = 0; var cY = 0; 
            var cX = evt.diagram.lastInput.viewPoint.x;
            var cY = evt.diagram.lastInput.viewPoint.y;

            $('#' + this.sIdDivScene).append("<div id=" + sIdDivCombo + " style='left:"+ (cX + 10) + "px; top:"+ (cY + 10) + "px' ></div>");

            $.ajax({
                url: CGoScene.wrapper,
                async: false,
                cache: false,
                dataType: 'html',
                type: 'post',
                data: {
                    sFunctionName: 'getTxObjects',
                    idOt: idOt
                },
                success: function (aResult) {
                    var results = aResult.split('|');
                    if (results[0] === sOk) {
                        txObjects = JSON.parse(results[1]);
                        var objCombo = new CComboBoxObject({
                            sIdDivCombo: sIdDivCombo,
                            iWidth: 200,
                            idOT: idOt,
                            bReadOnly: true,
                            txObjects: txObjects,
                            iMaxExpandedHeight: 400,
                            bSelectFirstOption: false
                        });

                    } else {
                        msgWarning(aResult);
                    }
                }
            });

        },

        getConfig: function () {
            var self = this;
            var bCfgFound = false;
            var idOt = getObjectIdOT(this.idObject);
            
            $.ajax({
                url: CGoScene.wrapper,
                cache: false,
                async: false,
                datatype: 'html',
                type: 'post',
                data: {
                    sFunctionName: 'getCfgModel',
                    idOT: idOt
                },
                success: function (aResult) {  
                    var results = aResult.split('|');
                    if (results[0] === sOk) {
                        result = JSON.parse(results[1]);
                        if (result.OTModel.graphLinksModel) {
                            bCfgFound = true;
                            self.linkDataArray = result.OTModel.graphLinksModel.linkDataArray;
                            self.categoryNodes = result.OTModel.graphLinksModel.nodeDataArray;
                        }
                        if (isAssigned(result.OTModel.bKeepLocation)) 
                            $("#idVDKeepLocation").prop('checked', result.OTModel.bKeepLocation);
                        if (isAssigned(result.OTModel.layoutAngle))
                            $("#idVDLayoutAngle").val(result.OTModel.layoutAngle)
                        if (isAssigned(result.OTModel.bDisplayFreeShape))
                            $("#idVDDisplayFreeShape").prop('checked', result.OTModel.bDisplayFreeShape);
                        self.myScene.model = new go.GraphLinksModel(self.categoryNodes, self.linkDataArray);
                    } else
                        msgWarning(aResult);
                }
            });
            return bCfgFound;
        },
   
        updateDesign: function (aCallBack) {
            var self = this,
                sceneModel = JSON.parse(this.myScene.model.toJson());

            this.layout.progressOn();

            // Manage links
            if (!this.bKeepLocation)
                sceneModel.linkDataArray.forEach(function (aLink) {
                    if (aLink.points)
                        delete aLink.points;
                });
            var linksToWrite = [];

            // get objects linked to current object
            var linkValues = this.getObjectsLinkToObject(sceneModel, this.idObject);
            this.sortLinkedObjectsByAttribute(sceneModel, linksToWrite, this.idObject, linkValues);
            
            // get objects linked for all objects in Design
            sceneModel.nodeDataArray.forEach(function (aNode) {
                // get links for this object
                var linkValues = self.getObjectsLinkToObject(sceneModel, aNode.key);
                self.sortLinkedObjectsByAttribute(sceneModel, linksToWrite, aNode.key, linkValues)
            });

            // get all link deleted
            var deletedLinks = this.savedNodes.linkDataArray.filter(function (aOldLink) {
                var existingNode = sceneModel.linkDataArray.find(function (aNewLink) {
                    return (aOldLink.from == aNewLink.from) && (aOldLink.to == aNewLink.to);
                });
                return !isAssigned(existingNode); // if not found, the link was deleted
            });
            deletedLinks.forEach(function (aDeletedLink) {
                var nodeTo = self.savedNodes.nodeDataArray.find(function (aNode) {
                    return aNode.key == aDeletedLink.to;
                });
                var nodeToTemplate = self.categoryNodes.find(function (aNode) {
                    return aNode.category == nodeTo.category;
                });
                // check if a data writting is already present for the link
                var existingLink = linksToWrite.find(function (aLinkToWrite) {
                    return self.isAttributeInCategory(aLinkToWrite.idAtt, nodeToTemplate) && (aLinkToWrite.idObj == aDeletedLink.from);
                });
                // if not the case, add instruction to delete the link
                if (!isAssigned(existingLink))
                    linksToWrite.push({
                        idAtt: self.getIdAttForIdObject(nodeToTemplate, aDeletedLink.from),
                        idObj: aDeletedLink.from,
                        sValue: ""
                    });
            });

            $.ajax({
                url: CGoScene.wrapper,
                async: true,
                cache: false,
                type: 'post',
                data: {
                    sFunctionName: 'updateDesign',
                    idObject: this.idObject,
                    design: JSON.stringify(sceneModel),
                    links: JSON.stringify(linksToWrite)
                },
                success: function (aResult) {
                    var results = aResult.split('|');
                    if (results[0] === 'ok') {
                        self.savedNodes = sceneModel;
                        msgWarning(_('Votre représentation graphique a bien été enregistrée.'));
                        if (aCallBack)
                            aCallBack();
                    } else {
                        msgWarning(_('Erreur.') + results[0]);
                    }
                    self.layout.progressOff();
                }
            });
        },
        
        getObjectsLinkToObject: function (aModel, aIdObject) {
            var linkFromObject = aModel.linkDataArray.filter(function (aLink) {
                return aLink.from == aIdObject;
            });
            var linkObjects = [];
            linkFromObject.forEach(function (aLink) {
                linkObjects.push(aLink.to);
            });
            return linkObjects;
        },

        sortLinkedObjectsByAttribute: function (aModel, aLinksToWrite, aIdObject, aLinkValues) {
            var self = this,
                idAttributesTreated = [];

            var doSortLinkedObjectsByAttributes = function (aIdAttribute) {
                var idAtt = aIdAttribute,
                    sortedLinkValues = [];

                if (idAtt !== undefined) idAttributesTreated.push(idAtt);
                aLinkValues.forEach(function (aIdNode) {
                    // get Object / Node
                    var node = aModel.nodeDataArray.find(function (aNode) {
                        return aNode.key == aIdNode;
                    });
                    // get Attribute for object
                    var templateNode = self.categoryNodes.find(function (aTemplateNode) {
                        return aTemplateNode.category == node.category;
                    });
                    if (!templateNode.idAtt) return; // ignore node with no idAtt (not a Link attribute)
                    if (!idAtt) { // if not define, set the attribute link to write
                        idAtt = self.getIdAttForIdObject(templateNode, aIdObject);
                        idAttributesTreated.push(idAtt);
                        sortedLinkValues.push(aIdNode);
                    } else if (self.isAttributeInCategory(idAtt, templateNode)) // if define, and same attribute, add the data
                        sortedLinkValues.push(aIdNode);
                    else if (!idAttributesTreated.find(function (aId) { // if not the same attribute and not already treated attribute, call another 
                        return self.isAttributeInCategory(aId, templateNode);
                    }))
                        doSortLinkedObjectsByAttributes(self.getIdAttForIdObject(templateNode, aIdObject));
                });
                // push data writting only if we found an idAtt
                if (idAtt)
                    aLinksToWrite.push({
                        idAtt: idAtt,
                        idObj: aIdObject,
                        sValue: sortedLinkValues.join(",")
                    });
            }
            
            doSortLinkedObjectsByAttributes();
        },
        
        applyModel: function (aNodeDataArray, aLinkDataArray) {
            this.myScene.model = new go.GraphLinksModel(aNodeDataArray, aLinkDataArray);
        },

        linkObj: function (aEvt) {
            //add link between object linked
            var obj = aEvt.diagram.selection;
            for (var it = obj.iterator; it.next() ;) {
                var part = it.value;
                var rData = part.data;
                if ((part instanceof go.Node) && (rData.parent != undefined) && (part.linksConnected.count === 0)) {
                    aEvt.diagram.model.addLinkData({
                        "from": rData.parent,
                        "to": rData.key
                    });
                }
            }
        },

        formatCfgOld: function (aJson) {
            // Retroactivity with old json format
            var result = [
                   {
                       "VisualDesignFormat": {
                           "jDia": {},
                           "jNodes": [],
                           "jLink": []
                       }
                   }];
            aJson.nodeDataArray.forEach(function (aNode, ind) {
                var node = {};
                node["drawCategory"] = aNode.category;
                node["visible"] = aNode.visible;
                node["Shape"] = {
                    "fill": aNode.fill,
                    "stroke": aNode.stroke,
                    "strokeWidth": 3,
                    "figure": aNode.figure,
                    "size": aNode.size
                };
                node["TextBlock"] = { "margin": 8 };
                result[0].VisualDesignFormat.jNodes.push(node);
            });
            return result;
        },

        saveCfg: function () {
            var sceneModel = this.myScene.model.toJson();
            var model = {
                "TxVisualDesignParameters": this.formatCfgOld(JSON.parse(sceneModel)),
                "graphLinksModel": JSON.parse(sceneModel),
                "sTagAs": this.sTagAs,
                "bKeepLocation": $("#idVDKeepLocation").is(':checked'),
                "layoutAngle": $("#idVDLayoutAngle").val(),
                "bDisplayFreeShape": $("#idVDDisplayFreeShape").is(':checked')
            };
            if (!model) return;
            $.ajax({
                url: CGoScene.wrapper,
                async: false,
                cache: false,
                type: 'post',
                data: {
                    sFunctionName: 'saveCfg',
                    idObject: this.idObject,
                    model: JSON.stringify(model)
                },
                success: function (aResult) {
                    var results = aResult.split('|');
                    if (results[0] === 'ok')
                        msgWarning(format(_('La configuration visuelle de #1 a été sauvegardée avec succès.'), [results[1]]));
                    else
                        msgWarning(results[0]);
                }
            });
        },

        getCategories: function () {
            var categories = [];
            this.nodes.forEach(function (aNode, ind) {
                var jCategory = {
                    "category": aNode.drawCategory,
                    "text": aNode.drawCategory,
                    "idOt": aNode.idOt,
                    "sInstruction": "#ObjectName#",
                    "key": aNode.idOt
                };
                categories.push(jCategory);
            });
            return categories;
        },
        
        getLinks: function () {
            var links = [];
            //TODO
            return links;
        },
        
        getIdAttForIdObject: function (aNodeCategory, aIdObject) {
            var keyCategory = 0;
            if (aIdObject != this.idObject) {
                var nodeFrom = this.nodes.nodeDatas.find(function (aNode) {
                    return aNode.key == aIdObject;
                });
                if (!nodeFrom) // node was deleted, search in savedNodes
                    nodeFrom = this.savedNodes.nodeDataArray.find(function (aNode) {
                        return aNode.key == aIdObject;
                    });
                keyCategory = this.categoryNodes.find(function (aNode) {
                    return aNode.category == nodeFrom.category;
                }).key;
            }
            if (Array.isArray(aNodeCategory.idAtt))
                return aNodeCategory.idAtt.find(function (aLinkAtt) {
                    return aLinkAtt.from == keyCategory;
                }).idAtt;
            else
                return aNodeCategory.idAtt;
        },

        setNodeAndCategoryVisibility: function (aGoNode, aVisibility) {
            var nodeCat = (aGoNode.data.category === "Picture") ? aGoNode.data.categoryName : aGoNode.data.category;

            this.myScene.model.setDataProperty(aGoNode.data, 'visible', aVisibility);
            
            this.categoryNodes.find(function (aCategoryNode) {
                if (aCategoryNode.category == nodeCat) {
                    aCategoryNode.visible = aVisibility;
                    return true;
                }
            });
        },

        manageDropOfLinkNode: function (aNewNode, aLinkableCategories, aInpector) {
            var self = this,
                sNameCategory = aNewNode.data.text;

            if (this.isLinkable || aNewNode.data.parent == 0) {
                // before add, check multiplicity of link
                var itLinks = aNewNode.findLinksInto();
                itLinks.next();
                if (aNewNode.data.bMult == false && (!itLinks.value || this.isLinkedWithSameCategoryNode(itLinks.value.data.from, aNewNode))) {
                    this.myScene.commandHandler.deleteSelection();
                    msgWarning(format(_("Une seule Entité de type '#1' peut être liée."), [sNameCategory]));
                } else {
                    var wQuery = new CQueryTreeObject({
                        idOT: aNewNode.data.idOT,
                        sCheckType: ctRadioboxes,
                        bEnableContextMenu: true,
                        bFolderCheckable: false,
                        sOk: _("Valider"),
                        sCaption: _("Sélection de l'Entité")
                    }, function (aValidated, aValue) {
                        if (aValidated == "ok") {
                            var addedObject = aValue[0];
                            var nodeDataArray = self.myScene.model.nodeDataArray;
                            var sameNode = nodeDataArray.find(function (aNode) {
                                return aNode.key == addedObject.ID
                            });
                            if (!sameNode) {
                                self.myScene.model.setKeyForNodeData(aNewNode.data, addedObject.ID);
                                self.myScene.model.setDataProperty(aNewNode.data, "text", addedObject.sName);
                                aInpector.inspectObject(aNewNode.data);
                                // Update link
                                self.myScene.model.setDataProperty(itLinks.value.data, "to", addedObject.ID);
                                if (!itLinks.value.data.from)
                                    self.myScene.model.setDataProperty(itLinks.value.data, "from", self.idObject);
                            } else {
                                self.myScene.commandHandler.deleteSelection();
                                msgWarning(_("Une même Entité ne peut être ajoutée qu'une seule fois."));
                            }

                        } else
                            self.myScene.commandHandler.deleteSelection();
                    });
                }
                this.isLinkable = false; // update variable for next drop
            } else {
                this.myScene.commandHandler.deleteSelection();
                aLinkableCategories = aLinkableCategories.map(function (aCategory) {
                    return aCategory.text;
                });
                msgWarning(format(_("Une Entité de type '#1', ne peut être liée qu'avec des Entités de type :"), [sNameCategory]) + " " + aLinkableCategories.join(", "));
            }
        },

        isLinkedWithSameCategoryNode: function (aIdNodeFrom, aNodeTo) {
            var self = this;
            aIdNodeFrom = getValue(aIdNodeFrom, this.idObject);

            var linksFromSameNode = this.nodes.linkDatas.filter(function (aLink) {
                return aLink.from == aIdNodeFrom;
            });

            return linksFromSameNode.find(function (aLink) {
                if (aLink.to == aNodeTo.data.key) {
                    return false;
                } else {
                    var currentNodeTo = self.nodes.nodeDatas.find(function (aNode) {
                        return aLink.to == aNode.key;
                    });
                    return currentNodeTo.category == aNodeTo.category
                }
            });
        },

        findLinkableCategories: function (aNameCategory, aFrom) {
            var self = this,
                aFrom = getValue(aFrom, true); // search for link FROM or TO 
                linkableCategories = [],
                category = this.categoryNodes.find(function (aData) {
                    return aData.category == aNameCategory;
                });
            if (category) // get all link possible for category found
                this.linkDataArray.forEach(function (aLink) {
                    if (aFrom) {
                        if (aLink.to == category.key)
                            linkableCategories.push(aLink.from);
                    } else {
                        if(aLink.from == category.key)
                            linkableCategories.push(aLink.to);
                    }
                    
                });
            // retrieve the name instead the id (key) of categories
            return linkableCategories.map(function (aCategoryKey) {
                return self.categoryNodes.find(function (aData) {
                    return aData.key == aCategoryKey;
                });
            }).filter(function (aCategory) {
                return aCategory != undefined;
            });
        },

        removeChidrenNodesLinked: function (aNode) {
            var self = this;
            var itLinksTo = aNode.findNodesOutOf();
            while (itLinksTo.next()) { // now iterate through them and clear out the boss information
                var node = itLinksTo.value;
                var itLinksFrom = node.findLinksInto();
                if (itLinksFrom.count == 1) {
                    self.removeChidrenNodesLinked(node);
                    self.myScene.model.removeNodeData(node.data);
                }
                // iterate through link to find the good one to remove
                while (itLinksFrom.next()) {
                    if (itLinksFrom.value.data.from == aNode.data.key) {
                        self.myScene.model.removeLinkData(itLinksFrom.value.data);
                        break;
                    }
                }
            }
        },

        makePort: function (name, spot, output, input, nLinks) {
            // the port is basically just a small transparent square
            return this.goJs(go.Shape, "Circle",
                {
                    fill: null,  // not seen, by default; set to a translucent gray by showSmallPorts, defined below
                    stroke: null,
                    desiredSize: new go.Size(8, 8),
                    alignment: spot,  // align the port on the main Shape
                    alignmentFocus: spot,  // just inside the Shape
                    portId: name,  // declare this object to be a "port"
                    fromMaxLinks: 1,  // don't allow more than one link from this port
                    fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                    fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
                    cursor: "pointer"  // show a different cursor to indicate potential link point
                });
        },

        showSmallPorts: function(node, show) {
            node.ports.each(function(port) {
                if (port.portId !== "") {  // don't change the default port, which is the big shape
                    port.fill = show ? "rgba(0,0,0,.5)" : null;
                }
            });
        },

        hidePanelInformation: function () {
            this.layout.layout.cells("d").collapse();
            $("#idTxVDAction").closest(".dhtmlxLayoutSinglePoly").hide().prev().hide();
            var iNewWidth = $('#idTxVDScene').width() + 23;
            this.myScene.div.style.width = iNewWidth + 'px';
            this.myScene.requestUpdate();
        },

        showPanelInformation: function () {
            $("#idTxVDAction").closest(".dhtmlxLayoutSinglePoly").show().prev().show();
            this.layout.layout.cells("d").expand();
        },

        isGraphModified: function () {
            var sceneModel = JSON.parse(this.myScene.model.toJson());
            return !(JSON.stringify(sceneModel) === JSON.stringify(this.savedNodes));
        },

        setNameOfSelectedObject: function (aName) {
            var sName = getValue(aName, false) ? aName : getObject(this.idObject).sName
            $("#txVDNameSelectedObject").html(sName);
        },

        changeSelectedObject: function () {
            var self = this,
                idOt = getObjectIdOT(this.idObject);
            // Display popup to select new obect
            var wQuery = new CQueryTreeObject({
                idOT: idOt,
                sCheckType: ctRadioboxes,
                bEnableContextMenu: true,
                bFolderCheckable: false,
                sOk: _("Valider"),
                sCaption: _("Sélection de l'Entité")
            }, function (aValidated, aValue) {
                if (aValidated == "ok") {
                    var newObject = aValue[0];
                    self.idObject = newObject.ID;
                    self.setNameOfSelectedObject(newObject.sName);

                    self.myScene.clear();
					self.cleanModel();

					self.getNodeData(self.idObject);
					self.myScene.model = self.graphModelForObject(self.idObject);
                    // savedNodes for upgrade
                    self.savedNodes = JSON.parse(self.myScene.model.toJson());
                    self.myScene.nodeDataTemplate = self.nodeTemplate;

                    // Add the unvisible node in TBox
                    var hidenNode = self.categoryNodes.filter(function (aNode, ind) { return aNode.visible === false; });
                    hidenNode.forEach(function (aNode, ind) {
                        var node = self.myScene.model.nodeDataArray.find(function (aScNode, ind) {
                            return aScNode.category === aNode.category;
                        });
                        if (!node)
                            return;
                        var goNode = self.myScene.findNodeForKey(node.key);
                        self.myScene.startTransaction("Make visible");
                        self.myScene.model.setDataProperty(goNode.data, 'visible', false);
                        self.myScene.commitTransaction("Make visible");
                    });

                    self.toolbox.setTBContent(self.categoryNodes);
                    if (self.bDisplayFreeShape)
                        self.toolbox.addFreeShape();
                }
            });
        },

        getNewFreeShapeCategory: function () {
            var self = this;
            this.iVirtualIndex--;
            var newCategoryName = "FreeShape" + this.iVirtualIndex;

            //Data type FreeShape
            this.myScene.nodeTemplateMap.add(newCategoryName,
                self.goJs(go.Part, "Spot",
                    { // Create automatic link on new node even hover FreeShape
                        mouseDrop: function (e, node) {
                            self.linkObj(e);
                        }
                    },
                    { resizable: true, resizeObjectName: "SHAPE" },
                    { rotatable: true, rotateObjectName: "SHAPE" },
                    new go.Binding("isLayoutPositioned", "isLayoutPositioned"),
                    new go.Binding("layerName", "layerName"),
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    new go.Binding("visible", "visible"),
                    self.goJs(go.Shape, {
                        name: "SHAPE", strokeWidth: 3
                    },
                    new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                    new go.Binding("figure", "figure").makeTwoWay(),
                    new go.Binding("fill", "color").makeTwoWay(),
                    new go.Binding("stroke", "stroke").makeTwoWay(),
                    new go.Binding("angle", "angle").makeTwoWay())
                )
            );

            return newCategoryName;
        },

        makeAutoRepositionning: function () {
            var self = this;

            this.myScene.nodes.each(function (goNode) {
                if (goNode.data.isLayoutPositioned == false)
                    self.myScene.model.setDataProperty(goNode.data, "isLayoutPositioned", true);
                if (goNode.data.location != null)
                    self.myScene.model.setDataProperty(goNode.data, "location", null);
            });

            this.myScene.layoutDiagram(true);
        }
    });
    return CGoScene;
})(jQuery);