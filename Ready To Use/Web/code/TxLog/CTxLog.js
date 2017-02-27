/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        
 * @returns CTxLog object.
 */
var sPathTxLogAjax = _url("/code/TxLog/TxLogAjax.asp");

function CTxLog(aSettings, aCallBackFunction, aDummyData) {
    this.window;
    // check if log capture is active
    this.isLogActive = this.isTxLogActive();

    aCallBackFunction(this.isLogActive);
}

CTxLog.prototype.isTxLogActive = function () {
    var bIsActive = false; 

    J.ajax({
        url: sPathTxLogAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: 'isTxLogActive'
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] === sOk) {
                if (results[1] == "-1")
                    bIsActive = true;
            } else {
                msgError(results[0]);
            }
        }
    });

    return bIsActive;
};

CTxLog.prototype.resetLog = function () {
    J.ajax({
        url: sPathTxLogAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: 'resetLog'
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] !== sOk) {
                msgError(results[0]);
            }
        }
    });
};

CTxLog.prototype.captureLog = function () {
    // ask name of use case for capture
    this.captureLogWindow();
};

CTxLog.prototype.doCaptureLog = function (aValidate, aPrefix, aZip) {
    if (aValidate == "okLogCapture") {
        J.ajax({
            url: sPathTxLogAjax,
            async: false,
            cache: false,
            data: {
                sFunctionName: 'captureLog',
                sPrefix: aPrefix,
                bZip: aZip
            },
            success: function (aResult) {
                var results = aResult.split("|");
                if (results[0] === sOk) {
                    var sPathFile = results[1];
                    if (aZip) {
                        // upload file
                        if (J('frame[name="frame_enregistrement"]', top.document)[0])
                            J('frame[name="frame_enregistrement"]', top.document)[0].contentDocument.location.replace(_url("/code/asp/ajax/open_file.asp?file=") + results[1]);
                        else {
                            // another Tab : frame doesn't exist -> create new iframe (only if not already created)
                            if (!J('#iFrameUploadExport').length) {
                                J('body').append('<iframe id="iFrameUploadExport" name="iFrameUploadExport" src="#" style="width:0;height:0;border:0px solid #fff; display:none;"></iframe>');
                            }
                            J('#iFrameUploadExport')[0].contentDocument.location.replace(_url("/code/asp/ajax/open_file.asp?file=") + results[1]);
                        }
                    }
                    // else noNeed to load file 
                } else {
                    msgError(results[0]);
                }
            }
        });
    }
    // else cancel action
};

CTxLog.prototype.captureLogWindow = function () {
    var self = this;
    var sHtml = '<div id="mainDivLogCapture" style="width: 100%;">'+
                    '<div style="display: table;width: 100%; padding: 14px 0px 3px 0px;">' +
                        '<label style="display: table-cell;padding: 0px 9px;width: 1px;white-space: nowrap;" for="Input" id="labelLogCapture"></label>' +
                        '<input style="display: table-cell;width: 94%;" type="text" id="nameLogCapture"/>'+
                    '</div>'+
                    '<div style="display: table;width: 100%;padding: 7px 0px 3px 0px;">' +
                        '<label style="padding: 0px 9px;white-space: nowrap;" type="text" id="labelZipLogCapture"></label>' +
                        '<input style="position: relative;top: 4px;" type="checkbox" id="zipLogCapture" checked="checked" />' +
                    '</div>' +
                    '<div id="id_div_btns">'+
                        '<input type="button" class="cl_btn_action" style="margin-right:6px" disabled="disabled" id="okLogCapture" value="OK"/>'+
                        '<input type="button" class="cl_btn_action" id="cancelLogCapture" value="Cancel"/>'+
                    '</div>'+
                '</div>';
    
    var windowPopupSettings = {
        sName: "captureLogWindow",
        sHeader: _("Sauvegarde du cas d'usage"),
        sImgPath: _url("/resources/theme/img/btn_form/"),
        sIcon: "16x16_save.png",
        iWidth: 325,
        iHeight: 140,
        bHidePark: true,
        bDenyResize: true,
        sHTMLAttached: sHtml
    }
    this.window = new CWindow(windowPopupSettings);

    //indicate the label
    J("#labelLogCapture").html(_("Nom du cas d'usage :"));
    J("#labelZipLogCapture").html(_("Télécharger le fichier :"));

    J("#nameLogCapture").change(CheckInputValue);
    J("#nameLogCapture").keyup(CheckInputValue);

    //associate event with button ok
    J("#okLogCapture").click(OnButtonClick);

    //associate event with button cancel
    J("#cancelLogCapture").click(OnButtonClick)

    function OnButtonClick() {
        self.window.close();
        self.doCaptureLog(this.id, J(this).parent().siblings().eq(0).children("#nameLogCapture").val(), J(this).parent().siblings().eq(1).children("#zipLogCapture").is(":checked"));
    }

    function CheckInputValue() {
        (J(this).val().length > 0) ? J("#okLogCapture").removeAttr('disabled') : J("#okLogCapture").attr('disabled', 'disabled')
    }
};