function CQueryFile(aSettings, aCallBackFunction, aDummyData) {
    this.sFileName = "";
    this.sIdLabel = "idLabelQueryFile";

    CQuery.call(this, aSettings, aCallBackFunction, aDummyData);
}

//inheritage
CQueryFile.prototype = createObject(CQuery.prototype);
CQueryFile.prototype.constructor = CQueryFile;

CQueryFile.prototype.updateHTML = function () {
    CQuery.prototype.updateHTML.call(this);
    this.sHtml += "<form enctype='multipart/form-data' id='idFormQueryFile' action='"+ _url("/code/TxWebForms/UploadFile.asp") +"' target='iFrameQueryFile' method='post' name='formQueryFile'>"+
                    "<input type='hidden' id='idHiddenFile' />"+
                    "<input type='file' name='idFileQueryForm' id='idFileQueryForm' style='margin-left:6px;margin-top:4px;'/>" +
                "</form>" +
                "<iframe name='iFrameQueryFile' src='#' style='display:none;' />";
}

CQueryFile.prototype.updateEvents = function () {
    CQuery.prototype.updateEvents.call(this);

    var self = this;

    J("#idFileQueryForm").change(function (aInput) {
        self.sFileName = extractFileName(aInput.currentTarget.value);
        J("#idHiddenFile").val(self.sFileName);

        if (isEmpty(self.sFileName))
            J("#ok").attr("disabled", "disabled");
        else {
            J("#ok").removeAttr("disabled");
            J("#idFormQueryFile").submit();
        }
    });
}

CQueryFile.prototype.onClick = function (aInput) {
    this.valueReturned = this.sFileName;

    CQuery.prototype.onClick.call(this, aInput);
}
