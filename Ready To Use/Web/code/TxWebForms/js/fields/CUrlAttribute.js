
function CUrlAttribute(aSettings) {
    var sIdDivParent = getValue(J(aSettings.htmlDiv).attr('id'), getUniqueId);

    this.field = aSettings.field;
    this.iCount = 0;
    this.sId = 'url' + sIdDivParent;
    this.idView = 'view' + sIdDivParent;

    this.bList = this.field.sType == "Url {}";
    this.htmlDiv = J(aSettings.htmlDiv);
    this.bView = false;
    this.sDataValue = "";
    this.data = this.field.Data;

    var sInput = "";

    if (isAssigned(this.data)){
        this.sDataValue = this.data.sVal;
        this.bView = getValue(this.data.bView, false);
    }

    if (aSettings.bWriteMode) {
        sInput = '<div style="float:left;">' + (this.bList ? '<textarea id="' + this.sId + '"></textarea>' : '<input type="text" class="clInput" id="' + this.sId + '"/>') + '</div>';

        if (!this.bReadOnly)
            sInput += '<div style="float:left;' + (this.bList ? "" : "margin-top:-4px;") + '"><a href="#" tabindex="-1" id="' + this.idView + '"><img id="' + this.idView + 'Img" class="clIcon" title="' + _("(Dés)Activer la Visualisation de l'url") + '" src="' + _url("/resources/theme/img/btn_form/terre.png") + '" /></a></div>';
    } else {
        sInput = '<a href="http://' + this.sDataValue + '" target="_blank" onclick="window.open(this.href); return false;">' + this.sDataValue + '</a>';
        if (this.bView)
            sInput +=' <iframe title="' + this.sDataValue + '" src="http://' + this.sDataValue + '" scrolling="auto" class="iframe_form"></iframe>';
    }

    if (isAssigned(this.data))
        this.sDataValue = this.cleanUrl(this.data.sVal);

    aSettings.sInput = sInput;
    aSettings.sDataValue = this.sDataValue;
    CAttributeField.call(this, aSettings);
}

CUrlAttribute.prototype = createObject(CAttributeField.prototype);
CUrlAttribute.prototype.constructor = CUrlAttribute;

CUrlAttribute.prototype.toString = function () {
    return "CUrlAttribute";
}

CUrlAttribute.prototype.initField = function () {
    var self = this,
        sValue = "",
        inp = J("#" + this.sId);

    if (isAssigned(this.data)){
        sValue = this.data.sVal;
        if (this.bView)
            J("#" + this.idView + "Img").attr("class", "clIconPressed");
    }


    inp.val(sValue);
    inp.css("width", qc(iTxFormComponentsWidth - 30, "px"));

    if (this.bReadOnly) {
        J("#" + this.sId).attr("disabled", 'disabled');
        return;
    }

    inp.on("input", function () {
        self.updateField(this.value);
        if (self.bList)
            self.adjustAreaHeight(this.value);
    });

    J("#" + this.idView).click(function () {
        self.updateView();
    });

    if (this.bList)
        this.adjustAreaHeight(sValue);
}

CUrlAttribute.prototype.updateView = function () {
    this.bView = !this.bView;

    if (this.bView)
        J("#" + this.idView + "Img").attr("class", "clIconPressed");
    else
        J("#" + this.idView + "Img").attr("class", "clIcon");

    this.bUpdate = true;
}

CUrlAttribute.prototype.updateField = function (aValue) {
    aValue = this.cleanUrl(aValue);

    CAttributeField.prototype.updateField.call(this, aValue);
}

CUrlAttribute.prototype.getDataToSave = function () {
    var data = CAttributeField.prototype.getDataToSave.call(this);
    if (this.bUpdate)
        data.bView = this.bView;
    
    return data;
}

CUrlAttribute.prototype.cleanUrl = function (aValue) {
    if (isEmpty(aValue))
        return " ";

    aValue = aValue.replace(/\n/g, "<br>");
    // Ask JB
    /*aValue = aValue.replace(/https:\/\//g, "");
    aValue = aValue.replace(/http:\/\//g, "");*/
    
    return aValue;
}

CUrlAttribute.prototype.lock = function (aLocked) {
    CAttributeField.prototype.lock.call(this, aLocked);
    var self = this;

    if (!this.bReadOnly) {
        if (this.bLocked) {
            J("#" + this.idView).unbind("click");
            J("#" + this.sId).attr("disabled", "disabled");
        } else {
            J("#" + this.idView).click(function () {
                self.updateView();
            });
            J("#" + this.sId).removeAttr("disabled");
        }
    }
}