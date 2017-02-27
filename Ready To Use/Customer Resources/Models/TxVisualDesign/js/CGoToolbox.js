var CGoToolbox = (function ($) {
    //private attribute
    CGoToolbox.wrapper = _url("/temp_resources/models/TxVisualDesign/VDAjax.asp");
    CGoToolbox.nodeDataArray = [];
    //constructor
    function CGoToolbox(aSettings) {
        this.settings = aSettings;
        this.parameters = {};
        this.goJs = go.GraphObject.make;
        this.toolbox;

        if (aSettings.config) {
            this.setTreeView(aSettings.sIdDivToolbox);
        } else {
            this.setToolBox(aSettings.sIdDivToolbox);
        }
        
    }
    //private methods

    CGoToolbox.browseAs =  function (aLevels, aIdParent) {
        var rNode;
        aLevels.forEach(function (aLevel, ind) {
            rNode = {
                "key": aIdParent + '_' + aLevel.ID_Att,
                "idAtt": aLevel.ID_Att,
                "idOT": aLevel.idOT,
                "text": aLevel.sName,
                "parent": aIdParent,
                "fill": "white",
                "stroke": "black",
                "figure": "rectangle",
                "category": aLevel.sName + aLevel.ID_Att,
                "visible": true,
                "size": "50 50",
                "bMult": (aLevel.attribute.LinkType) ? aLevel.attribute.LinkType.bMul : false,
                "sType": aLevel.attribute.sType
            };
            CGoToolbox.nodeDataArray.push(rNode);
            if (aLevel.Levels) {
                CGoToolbox.browseAs(aLevel.Levels, aIdParent+'_'+ aLevel.ID_Att);
            } 
        });
             
        
    }

    CGoModel.call(this);

    //inheritage
    CGoToolbox.prototype = createObject(CGoModel.prototype);
    CGoToolbox.constructor = CGoToolbox;

    //public methods
    CGoToolbox.prototype = $.extend(CGoToolbox.prototype, {

        setTBContent: function (aAttDataArray) {
            var tbNodeDataArray = [];
            aAttDataArray.forEach(function (aNode, ind) {
                var rNode = {
                    'category': aNode.category,
                    'text': aNode.text,
                    'idOT': aNode.idOT,
                    'key': aNode.key,
                    'sType': aNode.sType,
                    'bMult': aNode.bMult,
                    "parent": aNode.parent,
                    "isEditAllowed": aNode.isEditAllowed,
                    "isLayoutPositioned": true,
                };

                if (inArray(CGoModel.ctAttLnkTypes, aNode.sType)) {
                    rNode["visible"] = true;
                } else {
                    rNode["visible"] = !aNode.visible;
                }
                tbNodeDataArray.push(rNode);
            });
            this.toolbox.model.nodeDataArray = tbNodeDataArray;
        },

        addFreeShape: function () {
            var node = {
                "category": "FreeShape",
                "text": _("Forme Libre"),
                "figure": "RoundedRectangle",
                "size": "50 50",
                "color": "transparent",
                "stroke": "#000000",
                "angle": 0,
                "layerName": "",
                "loc": "300 10",
                "isLayoutPositioned": false,
                "isEditAllowed": true,
                "visible": true
            }
            this.toolbox.model.addNodeData(node);
            return node;
        },

        setToolBox: function (aIdDivToolbox) {
            this.toolbox = this.goJs(go.Palette, aIdDivToolbox,
                {
                    "layout.wrappingColumn": 1
            });
        },

        setTreeView: function (aIdDivToolbox) {
            this.toolbox = this.goJs(go.Palette, aIdDivToolbox,
                {
                    layout: this.goJs(go.TreeLayout, {
                        alignment: go.TreeLayout.AlignmentStart,
                        angle: 0,
                        compaction: go.TreeLayout.CompactionNone,
                        layerSpacing: 16,
                        layerSpacingParentOverlap: 1,
                        nodeIndent: 2,
                        nodeIndentPastParent: 0.88,
                        nodeSpacing: 0,
                        setsPortSpot: false,
                        setsChildPortSpot: false
                })
            });
        },

        setTemplateTreeView: function () {
            var self = this;

            function imageConverter(prop, picture) {
                var node = picture.part;
                if (node.data.idOT) {
                    var otDest = getOT(node.data.idOT);
                    return "/resources/theme/img/png/" + otDest.iIcon + ".png";
                } else
                    return "/resources/theme/img/png/0.png";
            }

            this.toolbox.nodeTemplate = this.goJs(go.Node,
                {
                    selectionAdorned: false,
                    doubleClick: function (e, node) {
                        var cmd = self.toolbox.commandHandler;
                        e.handled = true;
                        if (node.isTreeExpanded) {
                            cmd.collapseTree(node);
                        } else {
                            cmd.expandTree(node);
                        }
                    }
                },
                this.goJs(go.Panel, "Horizontal",
                    {
                        desiredSize: new go.Size(230, 35),
                        defaultAlignment: go.Spot.Left
                    },
                    //new go.Binding("background", "isSelected", function (s) { return (s ? "lightblue" : "white"); }).ofObject(),
                    this.goJs(go.Picture,
                        {
                            width: 25, height: 25,
                            margin: new go.Margin(0, 10, 0, 5),
                            imageStretch: go.GraphObject.Uniform
                        },
                        new go.Binding("source", "isTreeLeaf", imageConverter).ofObject()
                    ),
                    this.goJs(go.TextBlock,
                        { font: '10pt Verdana, sans-serif' },
                        new go.Binding("text", "text")
                    )
                )  // end Horizontal Panel
            );  // end Node

            this.toolbox.linkTemplate = this.goJs(go.Link);
        },

        setNodeDataTemplateMap: function (aNodeTemplate) {
            var self = this;

            //nodeTemplateMap creation     
            aNodeTemplate.forEach(function (aNode, ind) {

                self.toolbox.nodeTemplateMap.add(aNode.drawCategory,
                    self.goJs(go.Node, "Auto",
                        {
                            selectionAdorned: false // not allowed selection of node 
                        },
                        self.goJs(go.Panel, "Auto",
                            {
                                alignment: go.Spot.Top,
                                cursor: "pointer",
                                margin: new go.Margin(1, 1, 1, 1),
                                mouseEnter: function (e, obj) {
                                    obj.margin = new go.Margin(0, 0, 0, 0);
                                    obj.findObject('SHAPE').strokeWidth = 1;
                                    
                                },
                                mouseLeave: function (e, obj) {
                                    obj.margin = new go.Margin(1, 1, 1, 1);
                                    obj.findObject('SHAPE').strokeWidth = 0;
                                }
                            },
                            self.goJs(go.Shape, "roundedRectangle",
                                {
                                    name: "SHAPE",
                                    desiredSize: new go.Size(245, 55),
                                    fill: "transparent",
                                    strokeWidth: 0,
                                    stroke: aNode.Shape.stroke
                                }
                            ),
                            self.goJs(go.Panel, "Horizontal",
                                {
                                    desiredSize: new go.Size(245, 55),
                                    defaultAlignment: go.Spot.Left
                                },
                                self.goJs(go.Shape, aNode.Shape.figure,
                                    {
                                        desiredSize: new go.Size(47, 47),
                                        margin: new go.Margin(0, 10, 0, 5),
                                        fill: aNode.Shape.fill,
                                        stroke: aNode.Shape.stroke,
                                        alignment: go.Spot.Left,
                                        strokeWidth: 3
                                    }
                                ),
                                self.goJs(go.Panel, "Horizontal",
                                    {
                                        maxSize: new go.Size(150, 55),
                                        margin: new go.Margin(3, 15, 3, 3),
                                        defaultAlignment: go.Spot.Left

                                    },
                                    self.goJs(go.TextBlock,
                                        { font: 'bold 10pt Verdana, sans-serif', maxSize: new go.Size(150, 55) },
                                        new go.Binding("text", "text")
                                    )
                                )
                            )  // end Horizontal Panel
                        ),
                        new go.Binding("visible", "visible")
                    )
                );
            });

            //Data type FreeShape
            this.toolbox.nodeTemplateMap.add("FreeShape",
                self.goJs(go.Part, "Spot",
                    {
                        selectionAdorned: false // not allowed selection of node 
                    },
                    self.goJs(go.Panel, "Auto",
                        {
                            alignment: go.Spot.Top,
                            cursor: "pointer",
                            mouseEnter: function (e, obj) {
                                obj.findObject('SHAPE').strokeWidth = 1;
                                    
                            },
                            mouseLeave: function (e, obj) {
                                obj.findObject('SHAPE').strokeWidth = 0;
                            }
                        },
                        self.goJs(go.Shape, "roundedRectangle",
                            {
                                name: "SHAPE",
                                desiredSize: new go.Size(245, 55),
                                fill: "transparent",
                                strokeWidth: 0,
                                stroke: "grey"
                            }
                        ),
                        self.goJs(go.Panel, "Horizontal",
                            {
                                desiredSize: new go.Size(245, 55),
                                defaultAlignment: go.Spot.Left
                            },
                            self.goJs(go.Shape, "RoundedRectangle,
                                {
                                    desiredSize: new go.Size(47, 47),
                                    margin: new go.Margin(0, 10, 0, 5),
                                    fill: "transparent",
                                    strokeWidth: 3,
                                }
                            ),
                            self.goJs(go.Panel, "Horizontal",
                                {
                                    maxSize: new go.Size(150, 55),
                                    margin: new go.Margin(3, 15, 3, 3),
                                    defaultAlignment: go.Spot.Left
                                    
                                },
                                self.goJs(go.TextBlock,
                                    { font: 'bold 10pt Verdana, sans-serif', maxSize: new go.Size(150, 55) },
                                    new go.Binding("text", "text")
                                )
                            )
                        )  // end Horizontal Panel
                    ),
                    new go.Binding("visible", "visible")
                )
            );
            //BBAH - end
        },

        setModelFromAS: function (aIdObject, aAsCfg) {
            var self = this;
            var attributes = [];
            $.ajax({
                url: CGoToolbox.wrapper,
                async: false,
                cache: false,
                dataType: 'html',
                data: {
                    sFunctionName: 'getAsStruct',
                    idObject: aIdObject,
                    as: aAsCfg
                },
                success: function (aResult) {
                    var results = aResult.split('|');
                    if (results[0] === sOk) {
                        attributes = JSON.parse(results[1]);
                       
                        CGoToolbox.browseAs(attributes.jAS.Levels, 0);

                    } else {
                        msgWarning(aResult);
                    }
                },
                error: function (a, b, c) { //bugs
                    msgError(c);
                }
            });
            if (CGoToolbox.nodeDataArray.length > 0) {
                this.toolbox.model = new go.TreeModel(CGoToolbox.nodeDataArray);
            }
        },

        setAttModel: function (aIdObject) {
            var self = this;
          
            var attributes = [];
            var nodeDataArray = [];
            $.ajax({
                url: CGoToolbox.wrapper,
                async: false,
                cache: false,
                data: {
                    sFunctionName: 'getAttributes',
                    idObject: aIdObject
                },
                success: function (aResult) {
                    var results = aResult.split('|');
                    if (results[0] === 'ok') {
                        attributes = JSON.parse(results[1]);
                        var parentdata = {"key":0};
                        attributes.forEach(function (aAtt, ind) {
                            var rAtt = JSON.parse(aAtt);
                            if(rAtt.sType === "Tab"){
                                parentdata["key"] = rAtt.ID
                            } 
                            nodeDataArray.push({
                                "key": rAtt.ID,
                                "text": rAtt.sName,
                                "parent": parentdata["key"],
                                "fill": "white",
                                "stroke": "black",
                                "figure": "rectangle",
                                "category": rAtt.sName + rAtt.ID,
                                "visible": true
                            });
                        });
                    } else {
                        msgWarning(aResult);
                    }
                }
            });
            if (nodeDataArray.length > 0) {
                this.toolbox.model = new go.TreeModel(nodeDataArray);
            }
        }
    });
    //destructor
    // CGoModel.prototype.reset.call(this);
    return CGoToolbox;
})(jQuery);