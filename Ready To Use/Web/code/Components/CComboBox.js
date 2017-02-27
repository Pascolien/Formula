/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.sIdDivCombo *** MANDATORY ***
        aSettings.sImgPath : corresponding to component imgs, "/resources/theme/img/dhtmlx/combo/" by default
        aSettings.sIconsPath : corresponding to icons imgs in options, "/temp_resources/theme/img/png/" by default
        aSettings.bDisplayImage
        aSettings.iWidth
        aSettings.bSelectFirstOption
        aSettings.bReadOnly
        aSettings.iDefaultValueSelected
        aSettings.iMaxExpandedHeight
        aSettings.sDefaultText : permit to put a default text in combo, in this case no option are selected by default
        aSettings.sDefaultIcon
        aSettings.sHint : the hint of the combobox.
        aSettings.defaultOption : {ID:idOption, sName: option Name, iIcon: idIcon}
        aSettings.sTxObjects : generic JSON structure, it has to be transform to the dhtmlxCombo need. string format
        aSettings.txObjects : generic JSON structure, it has to be transform to the dhtmlxCombo need. json format
        aSettings.sObjects : JSON structure corresponding to a dhtmlxCombo object. string format
        aSettings.objects : JSON structure corresponding to a dhtmlxCombo object. json format
        aSettings.onChange : the javascript function to call when a combo option is selected.
        aSettings.onXLE : the javascript function to call when the combo json structure is loaded.
 * @returns CComboBox object.
 */

function CComboBox(aSettings) {
	if (!aSettings)
        return;

    if (aSettings.sIdDiv)
        aSettings.sIdDivCombo = aSettings.sIdDiv;
    this.combo;
    this.iDefaultValueSelected = getValue(aSettings.iDefaultValueSelected,-1);
    this.options = [];
    this.defaultOption = aSettings.defaultOption;
    this.bReadOnly = getValue(aSettings.bReadOnly, false);
    this.bHideInvisibles = getValue(aSettings.bHideInvisibles, false);
    this.sDefaultIcon = getValue(aSettings.sDefaultIcon);
    this.bEnableShift = getValue(aSettings.bEnableShift, true);
    this.invisibleOptions = [];
    this.settings = aSettings;
    
    checkMandatorySettings(aSettings, ["sIdDivCombo"]);

    var self = this,
        sImagePath = _url(getValue(aSettings.sImgPath, "/resources/theme/img/dhtmlx/combo/")),
        sDisplayImage = aSettings.bDisplayImage == true ? "image" : "",
        sWidth = getValue(aSettings.iWidth, 300),
        bSelectFirstOption = getValue(aSettings.bSelectFirstOption, true);

    this.iIndexToSelect = bSelectFirstOption ? 0 : null;
    this.sDefaultText = aSettings.sDefaultText;
    this.iMaxExpandedHeight = getValue(aSettings.iMaxExpandedHeight, 210);
    this.sIconsPath = _url(getValue(aSettings.sIconsPath, "/temp_resources/theme/img/png/"));

    window.dhx_globalImgPath = sImagePath;
    this.combo = new dhtmlXCombo(aSettings.sIdDivCombo, "", sWidth, sDisplayImage);

    this.combo.enableOptionAutoHeight(true, this.iMaxExpandedHeight);
    this.combo.enableOptionAutoWidth(getValue(aSettings.bEnableAutoWidth, false));
    this.combo.readonly(true);
    this.combo.disable(this.bReadOnly);

    if (!isEmpty(this.sDefaultText)) {
        this.iIndexToSelect = null;
        this.setComboText(this.sDefaultText);
    }

    if (isAssigned(aSettings.sHint))
        this.setHint(aSettings.sHint);

    if (aSettings.sTxObjects)
        this.reloadFromTxObjects(JSON.parse(aSettings.sTxObjects));
    else if (aSettings.txObjects)
        this.reloadFromTxObjects(aSettings.txObjects);
    else if (aSettings.sObjects)
        this.doLoad(JSON.parse(aSettings.sObjects));
    else if (aSettings.objects)
        this.doLoad(aSettings.objects);
    else
        this.loadOptions();

    this.combo.attachEvent("onChange", function () {
        self.onChange(this.getSelectedValue());
        if (aSettings.onChange)
            aSettings.onChange(this.getSelectedValue());
        return true;
    });

    if (aSettings.onXLE)
        this.combo.attachEvent("onXLE", aSettings.onXLE);
}

CComboBox.prototype.getCombo = function () {
    return this.combo;
}

CComboBox.prototype.reloadFromTxObjects = function (aOptions, aRealSelection) {
    //transform txOptions in JSON dhtmlxCombo
    var options = [],
        self = this;

    this.options = [];
    this.invisibleOptions = [];

    if (!isEmpty(this.defaultOption)) {
        this.combo.addOption([this.defaultOption]);
        aOptions.splice(0, 0, this.defaultOption);
    }
    aOptions.forEach(function (aOption) {
        if (self.bHideInvisibles && !aOption.bVisible)
            self.invisibleOptions.push(aOption);
        else {
            var option = self.addOption(aOption);
            options.push(option);
        }
    });
    this.doLoad(options, aRealSelection);
}

CComboBox.prototype.addOption = function (aOption) {
    var option = {},
        sImg = "";
    option.value = isEmpty(aOption.ID) ? 0 : aOption.ID;
    option.text = aOption.sName;

    //image
    if ("iIcon" in aOption)
        sImg = format("#1#2.png", [this.sIconsPath, aOption.iIcon]);
    else if (aOption.sImgPath)
        sImg = _url(aOption.sImgPath);
    else if (aOption.sImg)
        sImg = format("#1#2", [this.sIconsPath, aOption.sImg]);
    else if (!isEmpty(this.sDefaultIcon))
        sImg = format("#1#2", [this.sIconsPath, this.sDefaultIcon]);

    option.img_src = sImg;

    if (aOption.iShift != null && this.bEnableShift)
        option.css = format("margin-left:#1px;", [aOption.iShift * 20]);

    if (option.value == this.iDefaultValueSelected)
        this.iIndexToSelect = this.options.length;

    // the dynamic selection is not working with dhtmlx3.6
    //    option.selected = true
    aOption.iIndex = this.options.length;
    this.options.push(aOption);
    return option;
}

CComboBox.prototype.addJSOption = function (aOption) {
    var option = this.addOption(aOption);
    this.combo.addOption([option]);
}

CComboBox.prototype.setHint = function (aHint) {
    this.combo.DOMelem_input.title = aHint;
}

CComboBox.prototype.getOption = function (aId) {
    return this.getOptionFromField("ID", aId);
}

CComboBox.prototype.getOptionFromField = function (aField, aValue) {
    var option;
    this.options.find(function (aOption) {
        if (aOption[aField] == aValue) {
            option = aOption;
            return true;
        }
    });

    if (!option)
        this.invisibleOptions.find(function (aOption) {
            if (aOption[aField] == aValue) {
                option = aOption;
                return true;
            }
        });

    return option;
}

CComboBox.prototype.getOptionFromIndex = function (aIndexOption) {
    var option;
    this.options.find(function (aOption, i) {
        if (i == aIndexOption) {
            option = aOption;
            return true;
        }
    });

    return option;
}

CComboBox.prototype.isOptionExist = function (aId) {
    return isAssigned(this.getOption(aId));
}

CComboBox.prototype.isOptionExistFromField = function (aField, aValue) {
    return isAssigned(this.getOptionFromField(aField, aValue));
}

CComboBox.prototype.unload = function () {
    this.combo.destructor();
}

CComboBox.prototype.clear = function () {
    this.combo.clearAll();
    this.clearComboValue();
}

CComboBox.prototype.reload = function (aOptions) {
    this.doLoad(aOptions);
}

CComboBox.prototype.doLoad = function (aOptions, aRealSelection) {
    aRealSelection = getValue(aRealSelection, true);
    this.clear();

    this.combo.addOption(aOptions);
    //to remove when dhtmlx 4.xxx is apply in teexma
    if (this.iIndexToSelect != null) {
        this.selectOption(this.iIndexToSelect, false, aRealSelection);
        this.iIndexToSelect = 0;
    } else if (!isEmpty(this.sDefaultText))
        this.setComboText(this.sDefaultText);
}

CComboBox.prototype.disable = function () {
    this.combo.disable(true);
}

CComboBox.prototype.enable = function () {
    this.combo.disable(false);
}

CComboBox.prototype.lock = function (aLocked) {
    if (getValue(aLocked, true))
        this.disable();
    else
        this.enable();
}

CComboBox.prototype.loadOptions = function () {
    //virtual abstract
}

CComboBox.prototype.getActualValue = function () {
    return this.combo.getActualValue();
}

CComboBox.prototype.getSelectedValue = function () {
    //return (isNaN(this.combo.getSelectedValue()) || this.combo.getSelectedValue() === "") ? 0 : this.combo.getSelectedValue();
    return (this.combo.getSelectedValue() === "") ? 0 : this.combo.getSelectedValue();
}

CComboBox.prototype.getSelectedOption = function () {
    return this.getOption(this.getSelectedValue());
}

CComboBox.prototype.getSelectedOptionFieldValue = function (aField) {
    return this.getSelectedOption()[aField];
}

CComboBox.prototype.getSelectedIndex = function () {
    return this.combo.getSelectedIndex();
}

CComboBox.prototype.getSelectedText = function () {
    return this.combo.getSelectedText();
}

CComboBox.prototype.getTxIdFromIndex = function (aIndex) {
    var iTxID;
    this.options.find(function (aOption,i) {
        if (aIndex == i) {
            iTxID = aOption.ID;
            return true;
        }
    });
    return iTxID;
}

CComboBox.prototype.setComboText = function (aText) {
    this.combo.setComboText(aText);
}

CComboBox.prototype.setComboValue = function (aValue) {
    this.combo.setComboValue(aValue);
}

CComboBox.prototype.clearComboValue = function (aDefaultValue, aFireOnChange) {
    this.setComboText(getValue(aDefaultValue));
    this.combo.unSelectOption();

    if (getValue(aFireOnChange, false))
        if (this.settings.onChange)
            this.settings.onChange(this.getSelectedValue());
}

CComboBox.prototype.selectOption = function (aIndex, aEnableAutoComplete, aRealSelection) {
    this.combo.selectOption(aIndex, getValue(aEnableAutoComplete, false), getValue(aRealSelection, true))
}

CComboBox.prototype.selectOptionFromField = function (aField, aValue) {
    var option = this.getOptionFromField(aField, aValue);
    if (isAssigned(option))
        this.displayOption(option);
    else {
        msgWarning(format(_("L'option que vous tentez d'afficher n'existe pas \n '#1' : '#2'"), [aField, aValue]));
        throw "option not found";
    }
}

CComboBox.prototype.selectOptionFromTxId = function (aTxId) {
    var option = this.getOption(aTxId);
    if (isAssigned(option))
        this.displayOption(option);
}

CComboBox.prototype.displayOption = function (aOption) {
    if (this.bHideInvisibles && !aOption.bVisible) {
        aOption.bVisible = true;
        this.addJSOption(aOption);
    }
    this.selectOption(aOption.iIndex);
}

//events
CComboBox.prototype.attachEvent = function (aEventName, aFunction) {
    this.combo.attachEvent(aEventName, aFunction)
}

CComboBox.prototype.onChange = function () {
    //virtual abstract
}