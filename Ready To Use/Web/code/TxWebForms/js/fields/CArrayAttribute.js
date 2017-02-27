
function CArrayAttribute(aSettings) {
    this.field = aSettings.field;
    this.bTxCharts = this.field.TableType.sName.toLowerCase() == ("TxCharts").toLowerCase();
    this.bDisplayImage = false;

    var sIdDivParent = getValue(J(aSettings.htmlDiv).attr('id'), getUniqueId());

    this.sId = "idDivArray" + sIdDivParent;

    aSettings.sInput = '<div id="' + this.sId + '" ></div>';
    CAttributeField.call(this, aSettings);
}

//inheritage
CArrayAttribute.prototype = createObject(CAttributeField.prototype);
CArrayAttribute.prototype.constructor = CArrayAttribute;

CArrayAttribute.prototype.toString = function () {
    return "CArrayAttribute";
}

CArrayAttribute.prototype.initField = function () {
    var self = this,
        bData = getValue(this.field.Data, false);

    if (bData)
        this.sFirstValue = "something";
    
    if (this.bTxCharts) {
        // 
    } else if (this.bWriteMode || this.field.bDisp_Table) {
        this.iParentDivHeight = (this.iParentDivHeight > 0 && this.bTemplate) ? this.iParentDivHeight : 155;
        this.grid = new CGridArray({
            sIdDivGrid: this.sId,
            attr : this.field,
            bReadOnly: this.bReadOnly || !this.bWriteMode,
            idObject: this.idObject,
            sIdDivContainer: this.bTemplate ? null : this.sIdDivParent,
            wdowContainer: this.wdowContainer,
            onAddRow: function () { self.updateField(); },
            onDelRow: function () { self.updateField(); },
            iWidth: this.iParentDivWidth,
            iHeight: this.iParentDivHeight,
            onFullScreen: function (aFullScreen) { self.displayInFullSreen(aFullScreen) }
        });

        this.sHeightData = J("#" + this.sIdDivParent).outerHeight();

        if (this.bMandatory)
            this.bValid = this.grid.hasDataToSave();
    }
    if (this.field.sPictures) {
        this.bDisplayImage = true;
        var sOnClick = "",
            sStyle = "";

        if (this.bTxCharts) {
            sOnClick = format("window.open('"+_url('/temp_resources/models/TxCharts/TxCharts.asp')+"?ID_Object=#1&ID_Attribute=#2');", [this.field.Data.ID_Obj, this.idAttribute]);
            sStyle = 'style = "cursor:pointer;"';
            J("#" + this.sIdDivParent).append(format('<img idAtt="#1" class="clImgToCatchSize" src="#2?v=#3" onclick="#4" #5 />', [this.idAttribute, this.field.sPictures, new Date(), sOnClick, sStyle]));
        } else if (!this.bWriteMode) {
            J("#" + this.sIdDivParent).append(format('<img idAtt="#1" class="clImgToCatchSize" src="#2?v=#3" onclick="#4" #5 />', [this.idAttribute, this.field.sPictures, new Date(), sOnClick, sStyle]));
        }
    }
}

CArrayAttribute.prototype.updateFullScreenField = function () {
    this.grid.displayInFullScreen(true);
}

CArrayAttribute.prototype.updateField = function () {
    if (!this.grid)
        return;

    this.bValid = this.bMandatory ? this.grid.hasDataToSave() : true;

    CAttributeField.prototype.updateField.call(this);
}

CArrayAttribute.prototype.getDataToSave = function () {
    if (this.bTxCharts)
        return;

    var data = this.grid.getDataToSave();
    if (!isAssigned(data))
        return;

    data.sType = "Table";

    return data;
}

CArrayAttribute.prototype.lock = function (aLocked) {
    CAttributeField.prototype.lock.call(this, aLocked);

    if (!this.bReadOnly)
        this.grid.lock(this.bLocked);
}

CArrayAttribute.prototype.adjustSizeFromParent = function (aInit) {
    CAttributeField.prototype.adjustSizeFromParent.call(this, aInit);

    if (this.bTxCharts)
        return;

    this.grid.iHeight = this.iHeightData;
    J("#" + this.grid.sIdDivGrid).css({
        "width": qc(this.iWidthData, "px"),
        "height": qc(this.iHeightData, "px")
    });

    if (this.grid.toolbar)
        J("#" + this.grid.toolbar.sIdDiv).css("width", qc(this.iWidthData - 8, "px"));
}