/**
    Creates a TxWebExportation object.
    @requires CComboBox.js, CLayout.js
    @class
    @param aSettings.idOTInitiallySelected
           aSettings.sSelectedObjectsKey
 */

var sPathFileTxWebExportationAjax = 'TxWebExportationAjax.asp';

function CTxWebExportation(aSettings, aCallBackFunction, aDummyData) {
    var bZipFile,
        idOTInitiallySelected = aSettings.idOT,
        sSelectedObjectsKey = getValue(aSettings.sSelectedObjectsKey,sNull),
        idObjects = getValue(aSettings.idObjects,0),
        iIndexExport = 0,
        jTxJSONComboOT,
        sTxJSONComboExports,
        sJsOnExportationChange,
        sIdTreeObject = '',
        sIdTreeAttribute = '',
        cbOT, cbExportations;

    translate();

    this.getSelectedObjectsKey = function () {
        return sSelectedObjectsKey;
    }
    this.getIdTreeObject = function () {
        return sIdTreeObject;
    }
    this.getIdTreeAttribute = function () {
        return sIdTreeAttribute;
    }
    this.getIdOT = function () {
        return idOT;
    }
    this.getIndexExport = function () {
        return iIndexExport;
    }

    // initialize the layout
    var layout = new CLayout({
        sPattern : "4I",
        cellsSettings: [
            { "sHeight": "60", "bFixWidth": false, "bFixHeight": true, "sIdDivAttach": "id_div_cell_a" },
            { "sHeight": "*", "sIdDivAttach": "id_div_cell_b" },
            { "sHeight": "*", "sIdDivAttach": "id_div_cell_c" },
            { "sHeight": "30", "bFixWidth": false, "bFixHeight": true, "sIdDivAttach": "id_div_cell_d" }
        ]
    });

    //initialize the form.
    J.ajax({
        url: sPathFileTxWebExportationAjax,
		method: 'POST',
        async: false,
        cache: false,
        data: {
            sFunctionName: 'OnNewExportationForm',
            idOTInitiallySelected: idOTInitiallySelected,
            sSelectedObjectsKey: sSelectedObjectsKey,
            idObjects: idObjects
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                jTxJSONComboOT = JSON.parse(results[1]);
                sTxJSONComboExports = results[2];
                sJsOnExportationChange = results[3];
                sIdTreeObject = results[4];
                sIdTreeAttribute = results[5];
            } else
                parent.Popup_Error(results[0]);
        }
    });

    //create combo OT
    cbOT = new CComboBox({
        sIdDivCombo : "idDivComboOT",
        iWidth : 543,
        iMaxExpandedHeight : 400,
        bDisplayImage : true,
        txObjects : jTxJSONComboOT,
        iDefaultValueSelected : idOTInitiallySelected,
        onChange : OnObjectTypeChange
    });

    //create combo ExportType
    cbExportations = new CComboBox({
        sIdDivCombo : "idDivExportations",
        iWidth : 543,
        iMaxExpandedHeight : 400,
        sTxObjects : sTxJSONComboExports,
        onChange : OnExportationChange
    });

    //add javascript code according to ExportationTypeChange
    J(document.body).append("<script type='text/javascript'>" + sJsOnExportationChange + "</script>");

    //intialize action button
    J("#export").click(OnExportationExecute);
    J("#close").click(DoOnExportationFormClose);

    //override event onClose
    aSettings.wdow.attachEvent("onClose", function (win) {
        if (aSettings.closed) return true;
        DoOnExportationFormClose();
        return true;
    });

    function OnObjectTypeChange() {
        layout.progressOn();
        J.ajax({
            url: sPathFileTxWebExportationAjax,
			method: 'POST',
            cache: false,
            data: {
                sFunctionName: 'OnObjectTypeChange',
                idOTInitiallySelected: idOTInitiallySelected,
                idOTSelected: cbOT.getSelectedValue(),
                sSelectedObjectsKey: sSelectedObjectsKey,
                idObjects : idObjects,
                sIdTreeObject: sIdTreeObject,
                sIdTreeAttribute: sIdTreeAttribute
            },
            success: function (aResult) {
                layout.progressOff();
                var results = aResult.split("|");
                if (results[0] === sOk) {
                    sTxJSONComboExports = results[1];
                    sJsOnExportationChange = results[2];
                    cbExportations.reloadFromTxObjects(JSON.parse(sTxJSONComboExports));
                    eval(sJsOnExportationChange);
                } else
                    parent.Popup_Error(results[0]);
            }
        })
    }

    function OnExportationChange() {
        iIndexExport = cbExportations.getSelectedIndex();
        J.ajax({
            url: sPathFileTxWebExportationAjax,
			method: 'POST',
            async: false,
            cache: false,
            data: {
                sFunctionName: 'OnExportationChange',
                idOTInitiallySelected: idOTInitiallySelected,
                idOTSelected: cbOT.getSelectedValue(),
                sSelectedObjectsKey: sSelectedObjectsKey,
                idObjects : idObjects,
                iIndexExport: iIndexExport,
                sIdTreeObject: sIdTreeObject,
                sIdTreeAttribute: sIdTreeAttribute
            },
            success: function (aResult) {
                var results = aResult.split("|");
                if (results[0] === sOk) {
                    sJsOnExportationChange = results[1];
                    eval(sJsOnExportationChange);
                } else
                    parent.msgError(results[0]);
            }
        })
    }

    function OnExportationExecute() {
        layout.progressOn();
        var bZipped = J("#id_check_compressFile").is(":checked");
        J.ajax({
            url: sPathFileTxWebExportationAjax,
			method: 'POST',
            cache: false,
            data: {
                sFunctionName: 'OnExportationExecute',
                idOTSelected: cbOT.getSelectedValue(),
                sSelectedObjectsKey: sSelectedObjectsKey,
                idObjects : idObjects,
                iIndexExport: iIndexExport,
                bZipped: bZipped,
                sIdTreeObject: sIdTreeObject,
                sIdTreeAttribute: sIdTreeAttribute
            },
            success: function (aResult) {
                layout.progressOff();
                var results = aResult.split("|");
                if (results[0] === sOk) {
                    if (J('frame[name="frame_enregistrement"]', top.document)[0])
                        J('frame[name="frame_enregistrement"]', top.document)[0].contentDocument.location.replace(_url("/code/asp/ajax/open_file.asp?file=") + results[1]);
                    else {
                        // another Tab : frame doesn't exist -> create new iframe (only if not already created)
                        if (!J('#iFrameUploadFile').length) {
                            J('body').append('<iframe id="iFrameUploadFile" name="iFrameUploadFile" src="#" style="width:0;height:0;border:0px solid #fff; display:none;"></iframe>');
                        }
                        J('#iFrameUploadFile')[0].contentDocument.location.replace(_url("/code/asp/ajax/open_file.asp?file=") + results[1]);
                    }
                } else
                    parent.msgWarning(results[0]);

                if (aCallBackFunction != null)
                    aCallBackFunction("export", aDummyData);
            }
        });
    }

    function OnExportationFormClose() {
        aSettings.closed = true;
        aSettings.wdow.close();
    }

    function DoOnExportationFormClose() {
        J.ajax({
            url: sPathFileTxWebExportationAjax,
			method: 'POST',
            async: false,
            cache: false,
            data: {
                sFunctionName: 'OnExportationFormClose',
                sSelectedObjectsKey: sSelectedObjectsKey,
                sIdTreeObject: sIdTreeObject,
                sIdTreeAttribute: sIdTreeAttribute
            },
            success: function (aResult) {
                var results = aResult.split("|");
                if (results[0] == sOk) {
                    if (aCallBackFunction) {
                        aCallBackFunction(J("#close").id, aDummyData);
                    }
                    OnExportationFormClose();
                } else {
                    msgError(results[0]);
                }
            }
        });
    }

}