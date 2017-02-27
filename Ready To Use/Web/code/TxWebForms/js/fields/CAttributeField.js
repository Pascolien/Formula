//class CAttributeField
function CAttributeField(aSettings) {
    CField.call(this, aSettings);

    this.sType = this.field.sType;
    this.bInherited = inStr(this.sType, "#");
    this.sInput = getValue(aSettings.sInput);
    this.htmlDiv = aSettings.htmlDiv;
    this.idObject = aSettings.idObject;
    this.bReadOnly = this.bInherited ? true : (this.bIgnoreRights) ? false : (this.field.iRight < dbrAdd);
    this.sHintAtt = "";

    var self = this,
        sMandatory = "",
        sHTML = "";

    if (this.bMandatory) {
        if (isEmpty(this.sFirstValue))
            this.bValid = false;
        sMandatory = " <span style='color:red;'>*</span>";
    }

    J(this.htmlDiv).html(this.sInput);
    
    if (J(this.htmlDiv).attr('sLabelHtmlId')){
        this.sLabel = format("#1#2 :", [this.field.sName, sMandatory]);
        this.sLabelDivId = J(this.htmlDiv).attr('sLabelHtmlId');
        this.sLabelId = "idLabelAttName" + this.sLabelDivId;
        this.sColor = this.field.sColor;
        var sLabelTag = "<label id='" + this.sLabelId + "'> " + this.sLabel + "</label>"

        //manage info / source
        switch (""+this.field.ID_OT) {
            case ""+idOTInfo:
                sHTML = sLabelTag;
                break;
            case idOTSource:
                sHTML =
                    '<div style="width:80%; float:left;">' +
                        '<a class="clInformation" id="idDisplayInfo' + this.sLabelDivId + '">'+sLabelTag + '</a>'+
                    '</div>';
                break;
            default:
                sHTML =
                    '<div style="width:80%; float:left;">' +
                        '<a class="clInformation" id="idDisplayInfo' + this.sLabelDivId + '">' + sLabelTag + '</a>' +
                    '</div>';

                if (this.bWriteMode || isAssigned(this.field.Source))
                    sHTML +=
                        '<div style="width:10%; float:left;" draggable=false>' +
                            '<a tabindex="-1" id="idDisplaySource' + this.sLabelDivId + '" href="#"><img src="' + format(_url("/resources/theme/img/btn_form/16x16_#1_source.png"), [isAssigned(this.field.Source) ? "Existing" : "Empty"]) + '" /></a>' +
                        '</div>';
                break;
        }

        J('#' + this.sLabelDivId).html(sHTML);
        
        if (isAssigned(this.field.ID_Obj_Info)) {
            J("#idDisplayInfo" + this.sLabelDivId).css("text-decoration", "underline");
        } else if (!this.bWriteMode) {
            J("#idDisplayInfo" + this.sLabelDivId).removeClass("clInformation");
        }

        J("#" + this.sLabelId).mouseenter(function () {
            if (isEmpty(self.sHintAtt)) {
                J.ajax({
                    url: sPathFileTxWebFormAjax,
                    async: false,
                    cache: false,
                    type: "post",
                    data: {
                        sFunctionName: "GetAttributeHint",
                        idAtt: self.idAttribute
                    },
                    success: function (aResult) {
                        var results = aResult.split("|");
                        if (results[0] == sOk) {
                            self.sHintAtt = results[1];
                        } else
                            msgWarning(results[0]);
                    }
                });
                this.title = self.sHintAtt;
            }
        });

        J('#' + this.sLabelDivId).css('color', this.sColor);

        if (this.bWriteMode || isAssigned(this.field.ID_Obj_Info))
            J("#idDisplayInfo" + this.sLabelDivId).click(function () {
                self.displayInfo(self.field.ID_Obj_Info);
            });

        if (this.bWriteMode || isAssigned(this.field.Source))
            J("#idDisplaySource" + this.sLabelDivId).click(function () {
                self.displaySource(self.field.Source);
            });
    }

    this.initField();
}

CAttributeField.prototype = createObject(CField.prototype);
CAttributeField.prototype.constructor = CAttributeField;

CAttributeField.prototype.toString = function () {
    return "CAttributeField";
}

CAttributeField.prototype.initField = function () {

}

CAttributeField.prototype.displayInfo = function (aIdObjInfo) {
    var self = this,
        otInfo = getOT(idOTInfo),
        bWriteMode = this.bWriteMode;

    if (otInfo.iRight < dbrAdd)
        bWriteMode = false;

    if (!this.bLocked)
        new CTxForm({
            idObject: aIdObjInfo,
            idOT: idOTInfo,
            idAttribute: this.idAttribute,
            bWriteMode: bWriteMode,
            wdowContainer: this.wdowContainer,
            bIgnoreRights: this.bIgnoreRights,
            sWindowCaption: _Fmt("Information de #1", [this.sLabel]),
            sIcon: "temp_resources/theme/img/icon-16.png"
        }, function (aState, aInstructions, aDummyData) {
            if (aState == "removed") {
                J("#idDisplayInfo" + self.sLabelDivId + " img").attr("src", _url("/resources/theme/img/btn_form/16x16_Empty_information.png"));
                self.field.ID_Obj_Info = 0;
                J("#idDisplayInfo" + self.sLabelDivId).css("text-decoration", "none");
            } else if (aState && aDummyData.modifiedFields.length > 0) {
                J("#idDisplayInfo" + self.sLabelDivId + " img").attr("src", _url("/resources/theme/img/btn_form/16x16_Existing_information.png"));
                self.field.ID_Obj_Info = aDummyData.idObject;
                J("#idDisplayInfo" + self.sLabelDivId).css("text-decoration", "underline");
            }
        });
}

CAttributeField.prototype.displaySource = function (aSource) {
    var self = this,
        otSource = getOT(idOTSource),
        bWriteMode = this.bWriteMode,
        idObjectSource = isAssigned(aSource) ? aSource.ID_Obj_Src : 0;
         
    if (otSource.iRight < dbrAdd)
        bWriteMode = false;

    if (!this.bLocked)
        new CTxForm({
            idObject: idObjectSource,
            idOT: idOTSource,
            idObjectNav: this.idObject,
            idAttribute: this.idAttribute,
            bIgnoreRights: this.bIgnoreRights,
            bWriteMode: bWriteMode,
			wdowContainer: this.wdowContainer,
            sWindowCaption: _Fmt("Source de #1", [this.sLabel]),
            sIcon: "temp_resources/theme/img/icon-16.png"
        }, function (aState, aInstructions, aDummyData) {
            if (aState == "removed") {
                self.field.Source = { ID_Obj_Src: 0 };
                J("#idDisplaySource" + self.sLabelDivId + " img").attr("src", _url("/resources/theme/img/btn_form/16x16_Empty_source.png"));
            } else if (aState && aDummyData.modifiedFields.length > 0) {
                self.field.Source = { ID_Obj_Src: aDummyData.idObject };
                J("#idDisplaySource" + self.sLabelDivId + " img").attr("src", _url("/resources/theme/img/btn_form/16x16_Existing_source.png"));
            }
    });
}

CAttributeField.prototype.updateField = function (aValue) {
    switch (this.sType) {
        case 'ShortString':
        case 'LongString':
        case 'Url':
        case 'Url {}':
        case 'Email':
        case 'Email {}':
        case 'Date':
        case 'Date {}':
        case 'DateAndTime':
        case 'DateAndTime {}':
            this.bDelete = false;
            this.bUpdate = false;
            this.sValue = aValue;
            if (!isEmpty(this.sFirstValue) && (isEmpty(this.sValue))) {
                this.bDelete = true;
            } else if (this.sFirstValue != this.sValue) {
                this.bUpdate = true;
            }
            if ((isEmpty(this.sValue) && this.bMandatory) || !isAssigned(this.sValue))
                this.bValid = false;
            else
                this.bValid = true;
            break;
    }

    if (!this.bInFullScreen)
        this.fctCheckValidForm(this.idAttribute);
}

CAttributeField.prototype.getDataToSave = function () {
    var data = null;
    if (this.bUpdate){
        data = { ID_Att: this.idAttribute, ID_Obj:this.idObject, sVal: this.sValue, sType: this.sType, sAction: dbaModif };
    } else if (this.bDelete) {
        data = { ID_Att: this.idAttribute, sAction: dbaDel };
    }
    return data;
}

CAttributeField.prototype.adjustAreaHeight = function (aValue) {
    //in comment because when the textarea is resized, the others fields move !
    //var iNbLines = aValue.split("\n").length;

    //J("#" + this.sId).css("height", "auto");

    //if (isEmpty(aValue)) {
    //    J("#" + this.sId).css("height", "20px");
    //    J("#" + this.sId)[0].rows = 1;
    //}
    //if (iNbLines < iTxFormAreasMaxHeight)
    //    J("#" + this.sId)[0].rows = iNbLines + 1;
    //else
    //    J("#" + this.sId)[0].rows = iTxFormAreasMaxHeight;
}

