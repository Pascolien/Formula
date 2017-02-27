/*
here is located all common function about model form GoJS
*/

var CGoModel = (function ($) {
    CGoModel.wrapper = _url("/temp_resources/models/TxVisualDesign/VDAjax.asp");
    CGoModel.ctAttLnkTypes = ["DirectLink N", "DirectLink 1", "InverseLink N", "InverseLink 1"]; // Writting does'nt work with "InverseLink N","InverseLink 1"

    CGoModel.dictionary = {
        "text": _("Texte :"),
        "color": _("Couleur de remplissage :"),
        "fill": _("Couleur de remplissage :"),
        "stroke": _("Couleur des bordures :"),
        "layerName": _("Profondeur du positionnement :"),
        "figure": _("Forme :")
    };

    CGoModel.goJs = go.GraphObject.make;
    //constructor
    function CGoModel(aSettings) {
        //layout 
        this.layout;
        // Config
        this.bHasConfig = false;
        this.bKeepLocation = true;
        this.bDisplayFreeShape = true;
        this.layoutAngle = 0;
        this.otModel;
        this.categoryNodes = [];
        this.linkDataArray = [];
        this.nodeTemplate = [];
        this.txData = {};

        // Design & Visual
        this.nodes = {
            nodeDatas: [],
            linkDatas: []
        };
        this.toolbox;
    }

    CGoModel.prototype = {

        cleanModel: function () {
            this.nodes = {
                nodeDatas: [],
                linkDatas: []
            };
        },

        getNodeData: function (aIdObject) {
            var self = this;

            $.ajax({
                url: CGoModel.wrapper,
                cache: false,
                async: false,
                datatype: 'html',
                type: 'post',
                data: {
                    sFunctionName: 'matchObjectData',
                    idObject: aIdObject
                },
                success: function (aResult) {
                    var results = aResult.split('|');
                    if (results[0] === sOk) {
                        result = JSON.parse(results[1]);
                        self.txData = result.Object;
                        self.bKeepLocation = getValue(result.OTModel.bKeepLocation, true);
                        self.layoutAngle = parseInt(getValue(result.OTModel.layoutAngle, "0"));
                        self.bDisplayFreeShape = getValue(result.OTModel.bDisplayFreeShape, true);
                        if (result.OTModel.graphLinksModel) {
                            // Save for control linked objects later
                            self.otModel = result.OTModel;
                            self.linkDataArray = result.OTModel.graphLinksModel.linkDataArray;
                            self.categoryNodes = result.OTModel.graphLinksModel.nodeDataArray;
                            self.nodeTemplate = result.OTModel.TxVisualDesignParameters[0].VisualDesignFormat.jNodes;
                            (self.nodeTemplate.length === 0) ? self.bHasConfig = false : self.bHasConfig = true;

                            if (result.objectDesign)
                                self.nodes = {
                                    nodeDatas: result.objectDesign.nodeDataArray,
                                    linkDatas: result.objectDesign.linkDataArray
                                };
                            self.updateCategoriesVisibility();
                        } 
                    } else {
                        msgWarning(aResult);
                    }
                }
            });
        },

        graphModelForObject: function (aIdObject) {
            // Set Template
            this.setNodeDataTemplateMap();

            this.updateNodes();

            return new go.GraphLinksModel(this.nodes.nodeDatas, this.nodes.linkDatas);
        },

        updateNodes: function () {
            var self = this;
            if (isAssigned(this.txData.Data)) {
                // check for deleting if existing nodes in design
                if (this.nodes.nodeDatas.length > 0) {
                    // if nodes not found : it was deleted
                    this.nodes.nodeDatas = this.nodes.nodeDatas.filter(function (aExistingNode) {
                        var bFound = self.findNodeInTxData(self.txData.Data, aExistingNode);
                        if (!bFound) {
                            // delete associated links
                            self.nodes.linkDatas = self.nodes.linkDatas.filter(function (aExistingLink) {
                                return !(aExistingLink.from == aExistingNode.key) && !(aExistingLink.to == aExistingNode.key);
                            });
                        }
                        if (aExistingNode.category.match(/freeshape/i))
                            bFound = true;
                        return bFound;
                    });
                }
                // And parse TxData to check if new nodes are Added
                this.doUpdateNodes(this.txData.Data);
            } 
        },

        doUpdateNodes: function (aTxData) {
            var self = this;

            aTxData.find(function (aData) {

                var template = self.categoryNodes.find(function (aNode) {
                    return self.isAttributeInCategory(aData.ID_Att, aNode);
                });
                if (!template) { // Data not added in configuration design
                    // TODO : remove node and link concerned (but treat childrens ?)
                    //self.nodes.nodeDatas -> node.key
                    //aData.LkdObjects -> obj.ID
                    return;
                }
                if (aData.LkdObjects) {
                    aData.LkdObjects.forEach(function (aLkdObj, ind) {
                        // Before add node, check if already added
                        var lkdNode = self.nodes.nodeDatas.find(function (aNodeAdded) {
                            return aNodeAdded.key == aLkdObj.ID;
                        });
                        if (!lkdNode) {
                            var node = {
                                "category": template.category,
                                "layerName": "",
                                "text": aLkdObj.sName,
                                "key": aLkdObj.ID,
                                "bMult": template.bMult,
                                "parent": template.parent,
                                "isLayoutPositioned": true,
                                "size": template.size,
								"visible": template.visible,
                                "isEditAllowed": template.isEditAllowed
                            }
                            self.nodes.nodeDatas.push(node);
                        } else {
                            lkdNode.text = aLkdObj.sName;
                            lkdNode.parent = aLkdObj.parent;
                            lkdNode.isEditAllowed = template.isEditAllowed;
                            lkdNode.isLayoutPositioned = (lkdNode.loc && self.bKeepLocation) ? false : true;
                        }
                        // Before add link, check if already the same link is present
                        if (!self.nodes.linkDatas.find(function (aLinkAdded) {
                            return (aLinkAdded.from == aData.ID_Obj) && (aLinkAdded.to == aLkdObj.ID);
                        })) {
                            // Add link in any case
                            var link = {
                                "from": aData.ID_Obj,
                                "to": aLkdObj.ID
                            }
                            self.nodes.linkDatas.push(link);
                        }

                        if (aLkdObj.Data) {
                            self.doUpdateNodes(aLkdObj.Data);
                        }
                    });
                } else if (aData.Files) {
                    var settingFiles = {
                        files: []
                    }
                    aData.Files.forEach(function (aFile, ind) {
                        openDataFileFile(aFile.AF.ID, false);
                        var sPathFile = _url('/temp/' + iTxUserSessionId + '/' + aFile.AF.sFileName);

                        var fileNode = self.nodes.nodeDatas.find(function (aNodeAdded) {
                            return aNodeAdded.text == aFile.AF.sFileName;
                        });

                        if (!fileNode) {
                            var node = {
                                "category": "Picture",
                                "categoryName": template.category,
                                "layerName": "Background",
                                "text": aFile.AF.sFileName,
                                "key": sPathFile,
                                "isLayoutPositioned": true,
                                "size": template.size,
                                "sType": template.sType,
                                "visible": template.visible,
                                'isEditAllowed': template.isEditAllowed
                            };
                            self.nodes.nodeDatas.push(node);
                        } else {
                            fileNode.key = sPathFile;
                            fileNode.categoryName = template.category;
                            fileNode.isEditAllowed = template.isEditAllowed;
                            fileNode.isLayoutPositioned = (fileNode.loc) ? false : true;
                        }
                    });

                } else {
                    var basicNode = self.nodes.nodeDatas.find(function (aNodeAdded) {
                        return aNodeAdded.key == aData.ID_Att;
                    });

                    if (!basicNode) {
                        var node = {
                            "category": template.category,
                            "layerName": "",
                            "text": aData.sVal,
                            "key": aData.ID_Att,
                            "sType": template.sType,
                            "isLayoutPositioned": true,
                            "visible": template.visible,
                            'isEditAllowed': template.isEditAllowed
                        }
                        self.nodes.nodeDatas.push(node);
                    } else {
                        basicNode.text = aData.sVal;
                        basicNode.isEditAllowed = template.isEditAllowed;
                        basicNode.isLayoutPositioned = (basicNode.loc) ? false : true;
                    }
                }
            });
        },

        findNodeInTxData: function (aTxData, aExistingNode) {
            var self = this;

            return aTxData.find(function (aData) {
                if (aData.LkdObjects) {
                    return aData.LkdObjects.find(function (aLkdObj, ind) {
                        if (aExistingNode.key == aLkdObj.ID)
                            return true;

                        if (aLkdObj.Data)
                            return self.findNodeInTxData(aLkdObj.Data, aExistingNode);

                        return false;
                    });
                } else if (aData.Files) {
                    return aData.Files.find(function (aFile) {
                        if (aFile.AF.sFileName == aExistingNode.text)
                            return true;
                        return false;
                    });
                } else
                    return aData.ID_Att == aExistingNode.key;
            });
        },

        isAttributeInCategory: function (aIdAtt, aNodeCategory) {
            if (Array.isArray(aNodeCategory.idAtt))
                return aNodeCategory.idAtt.find(function (aLinkAttribute) {
                    return aLinkAttribute.idAtt == aIdAtt;
                });
            else
                return aNodeCategory.idAtt == aIdAtt;
        },

        updateCategoriesVisibility: function () {
            var self = this;
            this.categoryNodes.forEach(function (aCatNode) {
                // Update if its not a link
                if (aCatNode.visible && !inArray(CGoModel.ctAttLnkTypes, aCatNode.sType)) {
                    var nodeNotVisible = self.nodes.nodeDatas.find(function (aNode) {
                        var nodeCat = (aNode.category === "Picture") ? aNode.categoryName : aNode.category;
                        if (nodeCat == aCatNode.category)
                            return (aNode.visible == false);
                        else
                            return false;
                    });
                    if (nodeNotVisible)
                        aCatNode.visible = false;
                }
            });
        },

        translateNameInInspector: function () {
            $("#txVDInspector table tr").each(function (index, element) {
                var value = $(this).children().first().text();
                $(this).children().first().text(CGoModel.dictionary[value]);
            });
        }
    }
    return CGoModel;
})(jQuery);