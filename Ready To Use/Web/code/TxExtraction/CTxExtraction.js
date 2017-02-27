/**
    Creates a TxWebExportation object.
    @requires CComboBox.js, CLayout.js
    @class
    @param aSettings.idOTInitiallySelected
           aSettings.sSelectedObjectsKey
 */

var sPathFileTxExtractionAjax = _url('/code/TxExtraction/TxExtractionAjax.asp');

function CTxExtraction(aSettings, aCallBackFunction, aDummyData) {
    this.idOT = getValue(aSettings.idOT, 0);
    this.idOTFirst = getValue(aSettings.idOT, 0);
    this.iIndexExtract = getValue(aSettings.iIndexExtract, 0);
    this.bConvertPDF = false;
    this.objects;
    this.idObjects = getValue(aSettings.idObjects);
    this.checkedIds = [];
    this.wdowContainer = aSettings.wdowContainer;

    if (inStr(this.idObjects, ";"))
        this.checkedIds = this.idObjects.split(";");
    else if (this.idObjects > 0)
        this.checkedIds.push(""+(this.idObjects));

    var self = this,
        OTs,
        extractOptions,
        mainDiv = J("<div id='idDivMainTxExtraction'></div>"),
        sHtml = '<div id="idDivLayoutTxExtraction"></div>'+
                '<div id="idDivCellTxExtraction">'+
	                '<div id="idDivComboboxesTxExtraction">'+
                        '<label class="clLabels">'+_("Filtre :")+'</label>'+
                        '<div id="idDivComboOTTxExtraction"></div>'+
                        '<label class="clLabels">'+_("Extractions :")+'</label>'+
                        '<div id="idDivComboExtractionsTxExtraction"></div>'+
	                '</div>'+
                    '<div id="idDivObjectsTxExtraction">'+
                        '<label>'+_("Entités")+'</label>'+
                        '<div id="idDivTreeObjectTxExtraction"></div>'+
                        '<div id="idDivToolbarObjectTxExtraction"></div>'+
                    '</div>'+
                    '<div id="idDivPDFTxExtraction">' +
                        '<input type="checkbox" id="idCheckConvertPDF" /><label>' + _("Convertir au format PDF") + '</label>' +
                    '</div>'+
	                '<div id="idDivBtnsTxExtraction"></div>' +
                '</div>';
    mainDiv.append(sHtml);
    J(document.body).append(mainDiv);

    //init window
    var wdowSettings = {
        sName: "wExtract",
        sHeader: _("Extraction"),
        sIcon: 'temp_resources/theme/img/btn_titre/module_extract-16.png',
        iWidth: 530,
        iHeight: 410,
        bDenyResize: true,
        bHidePark: true,
        bNewContainer: true,
        sObjectAttached: "idDivMainTxExtraction"
    };

    if (isAssigned(this.wdowContainer)) {
        this.wdow = this.wdowContainer.addWindow(wdowSettings, aCallBackFunction);
    } else {
        this.wdowContainer = new CWindow(wdowSettings, aCallBackFunction);
        this.wdow = this.wdowContainer.getWindow(this.sIdWdow);
    }

    // initialize the layout
    this.layout = new CLayout({
        sPattern: "1C",
        sParent: "idDivLayoutTxExtraction",
        cellsSettings: [
            { sHeight: "*", sIdDivAttach: "idDivCellTxExtraction" }
        ]
    });

    //initialize the form.
    J.ajax({
        url: sPathFileTxExtractionAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: 'onNewExtractionForm',
            idOT: this.idOT
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                OTs = JSON.parse(results[1]);
                extractOptions = JSON.parse(results[2]);
                self.objects = JSON.parse(results[3]);
            } else
                msgWarning(results[0]);
        }
    });

    //create combo OT
    this.comboOT = new CComboBox({
        sIdDivCombo: "idDivComboOTTxExtraction",
        iWidth : 400,
        iMaxExpandedHeight : 400,
        bDisplayImage : true,
        txObjects: OTs,
        iDefaultValueSelected : this.idOT,
        onChange: function () { self.comboOTOnChange(); }
    });

    //create combo Extraction
    this.comboExtract = new CComboBox({
        sIdDivCombo : "idDivComboExtractionsTxExtraction",
        iWidth: 400,
        iMaxExpandedHeight : 400,
        txObjects: extractOptions,
        onChange: function () { self.comboExtractOnChange(); }
    });

    //init ButtonBar
    this.buttonBar = new CButtonBar({
        sIdDivParent: 'idDivBtnsTxExtraction',
        btns: [
            { sId: "idBtnExtract", bDisabled: true, sCaption: _("Extraire"), onClick: function () { self.extract() } },
            { sId: "idBtnCloseExtract", sCaption: _("Fermer"), onClick: function () { self.wdow.close(); } }
        ]
    });

    J("#idCheckConvertPDF").change(function () {
        self.updateCheckboxeConvertPDF(J(this).is(":checked"));
    });

    this.comboExtractOnChange();
}

CTxExtraction.prototype.comboOTOnChange = function () {
    var self = this;

    this.idOT = this.comboOT.getSelectedValue();
    this.tree.idOT = this.idOT;
    J.ajax({
        url: sPathFileTxExtractionAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: 'comboOTOnChange',
            idOT: this.idOT
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                var extractOptions = JSON.parse(results[1]);
                self.objects = JSON.parse(results[2]);
                self.comboExtract.reloadFromTxObjects(extractOptions,false);
            } else
                msgWarning(results[0]);
        }
    });
    this.comboExtractOnChange();
}

CTxExtraction.prototype.comboExtractOnChange = function () {
    this.iIndexExtract = this.comboExtract.getSelectedIndex();

    var self = this,
        sCheckType,
        bConvertPDFDisabled = false,
        bConvertPDFChecked = false,
        extractOption = this.comboExtract.getOptionFromIndex(this.iIndexExtract);

    if(inArray(["1","3"],extractOption.iExtType)){
        sCheckType = ctCheckboxes;
        bConvertPDFDisabled = true;
    } else {
        sCheckType = ctRadioboxes;
        bConvertPDFDisabled = false;
        switch (extractOption.iPDF_Conv_Options) {
            case "1":
                bConvertPDFChecked = true;
                break;
            case "2":
                bConvertPDFDisabled = true;
                bConvertPDFChecked = true;
                break;
        }
    }

    //we can't juste reload the tree changing sChecktype, there is a bug in dhtmlx, maybe with the update, it will be fix
    //this.tree.updateCheckType(sCheckType);
    //this.tree.setCheckedIds(this.checkedIds);
    //this.tree.reloadFromTxObjects(this.objects);

    if (this.tree)
        this.tree.unload();

    this.tree = new CTreeObject({
        sIdDivTree: 'idDivTreeObjectTxExtraction',
        sIdDivToolbar: 'idDivToolbarObjectTxExtraction',
        idOT: this.idOT,
        sCheckType: sCheckType,
        sIdsChecked: this.idOT == this.idOTFirst ? this.checkedIds.join(";") : "",
        bEnableContextMenu: true,
        bFolderCheckable : false,
        bEnableEdition: true,
        onCheck: function () { self.updateForm(); },
        onUnCheck: function () { self.updateForm(); },
        onCheckAll: function () { self.updateForm(); },
        onUnCheckAll: function () { self.updateForm(); }
    });

    this.updateCheckboxeConvertPDF(bConvertPDFChecked, bConvertPDFDisabled);
    this.updateForm();
}

CTxExtraction.prototype.updateCheckboxeConvertPDF = function (aChecked, aDisabled) {
    aDisabled = getValue(aDisabled, false);
    aChecked = getValue(aChecked, false);

    J("#idCheckConvertPDF").prop("checked", aChecked);

    if (aDisabled)
        J("#idCheckConvertPDF").attr("disabled", "disabled");
    else
        J("#idCheckConvertPDF").removeAttr("disabled");

    this.bConvertPDF = aChecked;
}

CTxExtraction.prototype.extract = function () {
    var self = this,
        idObject = self.tree.getCheckedIds();

    this.layout.progressOn();
    J.ajax({
        url: sPathFileTxExtractionAjax,
        async: true,
        cache: false,
        data: {
            sFunctionName: 'extract',
            idOT: self.idOT,
            iIndexExtraction: self.iIndexExtract,
            idObjects: idObject,
            bConvertPDF: self.bConvertPDF
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                sFileName = results[1];
                iPublishingType = results[2];

                //manage publishing
                switch (iPublishingType) {
                    case "0": //simple extraction
                        self.uploadFile(results[1]);
                        break;
                    default: //display popup rename doc and publish
                        self.wExtract.setModal(false);
                        new CQueryString({
                            wContainer : txASP.wdowContainer,
                            sCaption: _("Publication automatique"),
                            sLabel : _("Nom du fichier :")
                        }, function (aIdBtn, aValue, aDummyData) {
                            self.pusblishDocument(aIdBtn, aValue, aDummyData);
                        }, {
                            sFileNameOld: sFileName,
                            iPublishingType: iPublishingType,
                            idObject: idObject
                        });
                        break;
                }
            } else
                msgWarning(results[0]);

            self.layout.progressOff();
        }
    });
}

CTxExtraction.prototype.pusblishDocument = function (aIdBtn, aValue, aDummyData) {
    this.wExtract.setModal(true);
    if (aIdBtn == "cancel") {
        this.uploadFile(aDummyData.sFileNameOld);
        return;
    }

    var self = this,
        sFileNameNew = getValue(aValue);

    J.ajax({
        url: sPathFileTxExtractionAjax,
        async: false,
        cache: false,
        type:"post",
        data: {
            sFunctionName: 'publishDocument',
            idExtraction: this.comboExtract.getSelectedValue(),
            idObject: aDummyData.idObject,
            iPublishingType: aDummyData.iPublishingType,
            sFileNameOld: aDummyData.sFileNameOld,
            sFileNameNew: sFileNameNew
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                switch (aDummyData.iPublishingType) {
                    case "1":
                        //display publication document in write form.
                        var idAttribute = results[1],
                            node = self.tree.getNodeFromTxId(aDummyData.idObject);
                        //to finish when publishing attribute is made.
                        new CTxForm({
                            idOT: self.idOT,
                            sType: "aptId",
                            sData: [idAttribute],
                            idObject: aDummyData.idObject,
                            sWindowCaption: node.sName,
                            bReturnAttributesValue : true,
                            sIcon: format("temp_resources/theme/img/png/#1.png", [node.iIcon])
                        }, function () {
                            //todo
                        });
                        break;
                    case "2":
                        var sFileName = results[1];
                        self.uploadFile(sFileName);
                        msgWarning(_("L'Extraction est terminée."));
                        break;
                }
            } else
                msgWarning(results[0]);
        }
    });
}

CTxExtraction.prototype.uploadFile = function (aFileName) {
    // Create new iframe (only if not already created)
    if (!J('#iFrameUploadFile').length) {
        J('body').append('<iframe id="iFrameUploadFile" name="iFrameUploadFile" src="#" style="width:0;height:0;border:0px solid #fff; display:none;"></iframe>');
    }
    J('#iFrameUploadFile')[0].contentDocument.location.replace(_url("/code/asp/ajax/open_file.asp?file=") + aFileName);
}

CTxExtraction.prototype.updateForm = function () {
    this.buttonBar.setButtonEnable("idBtnExtract", !isEmpty(this.tree.getCheckedIds()), true);
}