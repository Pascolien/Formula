var CGoVisual = (function ($) {
    CGoVisual.wrapper = _url("/temp_resources/models/TxVisualDesign/VDAjax.asp");
    CGoVisual.visual = {};
    CGoVisual.goJs = go.GraphObject.make;
    function CGoVisual(aSettings) {
        CGoModel.call(this);

        this.object = aSettings.object;
        this.idObject = aSettings.idObject;
        this._settings = aSettings;
        this.OTsActive = aSettings.OTsActive;

        this.functionsToExecute = {
            "idObjs": ["generateVisual"]
        }

        var cell = aSettings._getParentCell();
        cell.collapse();
        cell.setHeight(0);
        J('#' + this.sIdDiv).addClass("clResponsiveCell");
    }

    //inheritage
    CGoVisual.prototype = Object.create(CGoModel.prototype);
    CGoVisual.constructor = CGoVisual;
         
    CGoVisual.prototype = $.extend(CGoVisual.prototype, {
              
        generateVisual: function (aObjects) {
            var cell = this._getParentCell();
            if (!aObjects || aObjects.length > 1 || aObjects.length === 0) {
                cell.collapse();
                cell.setHeight(0);
                return;
            }
        
            var self = this;
            var idObject = aObjects[0].ID;
            if (this.object == aObjects[0])
                return;
            else {
                this.object = aObjects[0]
            }
            if (this.object.bFolder)
                return;

            var otActive = this.OTsActive.find(function (aOT) {
                return self.object.ID_OT == aOT.ID;
            });
            
            if (otActive) {
                this.cleanModel();
                this.getNodeData(idObject);
                if (self.bHasConfig) {
                    $('#' + self._settings.sIdDiv).replaceWith('<div id=' + self._settings.sIdDiv + '></div>');
                } else {
                    cell.collapse();
                    return;
                }
                if (self.txData.Data) {
                    CGoVisual.visual =
                        CGoVisual.goJs(go.Diagram, self._settings.sIdDiv,
                            {
                                isReadOnly: true,
                                allowVerticalScroll: false,
                                allowHorizontalScroll: true,
                                initialContentAlignment: go.Spot.Center,
                                // have mouse wheel events zoom in and out instead of scroll up and down
                                "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
                                "toolManager.hoverDelay": 100,  // how quickly tooltips are shown
                                layout: CGoVisual.goJs(go.TreeLayout,
                                    { angle: self.layoutAngle }),
                                initialAutoScale: go.Diagram['Uniform']
                            });
                    CGoVisual.visual.addDiagramListener("InitialLayoutCompleted", function (diagramEvent) {
                        if (otActive.sTagThumbnail)
                            self.saveThumbnail(idObject, otActive.sTagThumbnail);
                    });
                    
                    this.setNodeDataTemplateMap();

                    cell.expand();
                    this.updateNodes();
                    if (this.nodes) {
                        if (this.nodes.nodeDatas) {
                            var freeShapes = this.nodes.nodeDatas.filter(function (aNode, ind) { return aNode.category.match(/FreeShape/i); });
                            if (freeShapes.length !== 0) {
                                //Free Shape
                                freeShapes.forEach(function (aShape, ind) {
                                    CGoVisual.visual.nodeTemplateMap.add(aShape.category,
                                        CGoVisual.goJs(go.Node, "Auto",
                                            CGoVisual.goJs(go.Shape, aShape.figure,
                                                { fill: aShape.color, stroke: aShape.stroke, cursor: "pointer", strokeWidth: 3 }
                                            ),
                                            new go.Binding("isLayoutPositioned", "isLayoutPositioned"),
                                            new go.Binding("desiredSize", "size", go.Size.parse),
                                            new go.Binding("location", "loc", go.Point.parse),
                                            new go.Binding("angle", "angle"),
                                            new go.Binding("layerName", "layerName")
                                        )
                                    );
                                });
                            }
                        }
                    }
                    // Collapse cell if all hidden
                    var visibleNodes = this.nodes.nodeDatas.filter(function (aNode, ind) {
                        return aNode.visible === true;
                    });

                    if (visibleNodes.length === 0) cell.collapse();
                } else {
                    cell.collapse();
                    return;
                }
                                
                CGoVisual.visual.model = new go.GraphLinksModel(this.nodes.nodeDatas, this.nodes.linkDatas);
                $('#' + this._settings.sIdDiv).height('200');

                function resizeVD() {
                    setTimeout(function () {
                        var iNewHeight = $('#' + self._settings.sIdDiv).closest("div[ida]").height();
                        $('#' + self._settings.sIdDiv).height(iNewHeight);
                        CGoVisual.visual.div.style.height = iNewHeight + 'px';
                        CGoVisual.visual.requestUpdate();
                    }, 100)
                }

                setTimeout(function () {
                    self._getParentLayout().layout.attachEvent("onPanelResizeFinish", resizeVD);
                    self._getParentLayout().layout.attachEvent("onResizeFinish", resizeVD);
                }, 500);

                // As object changed : resize
                resizeVD();
            } else {
                cell.collapse();
            }
        },

        setNodeDataTemplateMap: function () {
            var self = this;

            //nodeTemplateMap creation     
            this.nodeTemplate.forEach(function (aNode, ind) {

                CGoVisual.visual.nodeTemplateMap.add(aNode.drawCategory,
                    CGoVisual.goJs(go.Node, "Auto",
                        CGoVisual.goJs(go.Shape, aNode.Shape.figure,
                            { fill: aNode.Shape.fill, stroke: aNode.Shape.stroke, cursor: "pointer", strokeWidth: 3 }
                        ),
                        new go.Binding("isLayoutPositioned", "isLayoutPositioned"),
                        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                        new go.Binding("location", "loc", go.Point.parse),
                        new go.Binding("visible", "visible"),
                        CGoVisual.goJs(go.TextBlock, aNode.TextBlock,
                            {
                                stretch: go.GraphObject.Horizontal,
                                wrap: go.TextBlock.WrapFit,
                                overflow: go.TextBlock.OverflowEllipsis,
                                cursor: "pointer"
                            },
                            new go.Binding("text").makeTwoWay()
                        ),
                        {
                            click: function (evt, obj) {
                                var id = obj.part.data.key;
                                if (id) {
                                    //TO Check
                                    parent.txASP.displayObject(id);
                                } else {
                                    msgWarning(_('Aucune Entité liée.'));
                                }
                            },
                            toolTip:  // define a tooltip for each node that displays the the full text content
                              CGoVisual.goJs(go.Adornment, "Auto",
                                CGoVisual.goJs(go.Shape, { fill: "#FFFFCC" }),
                                CGoVisual.goJs(go.TextBlock, { margin: 4 },
                                  new go.Binding("text").makeTwoWay())
                              )  // end of Adornment
                        }
                    )
                );
            });
            //Data type Picture
            CGoVisual.visual.nodeTemplateMap.add("Picture",
               CGoVisual.goJs(go.Node, "Spot",
                    new go.Binding("layerName", "layerName"),
                    new go.Binding("isLayoutPositioned", "isLayoutPositioned"),
                    new go.Binding("location", "loc", go.Point.parse),
                    new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                    new go.Binding("visible", "visible"),
                    CGoVisual.goJs(go.Picture,
                        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                        new go.Binding("source", "key"),
                        new go.Binding("category", "category")
                    )
                )
            );

            // Link Template
            CGoVisual.visual.linkTemplate =
                  CGoVisual.goJs(go.Link,  // the whole link panel
                    {
                        routing: go.Link.AvoidsNodes,
                        curve: go.Link.JumpOver,
                        corner: 2, toShortLength: 4,
                    },
                    new go.Binding("points").makeTwoWay(),
                    CGoVisual.goJs(go.Shape,  // the link path shape
                      { isPanelMain: true, stroke: "gray", strokeWidth: 3 }),
                    CGoVisual.goJs(go.Shape,  // the arrowhead
                      { toArrow: "standard", stroke: null, fill: "gray" })
                );
        },

        saveThumbnail: function (aIdObject, aTagThumbnail) {
            var img = CGoVisual.visual.makeImage({
                scale: 1,
                showTemporary: true,
                type: "image/png"
            });
            var imgData = img.src.replace(/^data:image\/(png);base64,/, "");
           
            $.ajax({
                type: 'POST',
                url: CGoVisual.wrapper,
                async: true,
                data: {
                    sFunctionName: 'saveThumbnail',
                    img: imgData,
                    idObject: aIdObject,
                    sTagThumbnail: aTagThumbnail
                },
                dataType: 'html',
                success: function (aResult) {
                    var results = aResult.split('|');
                    if (results[0] === sOk) {
                        //TODO: log thumnbail saved
                    } else
                        msgWarning(results[0]);
                }
            });
        }
    });

    return CGoVisual;
})(jQuery);