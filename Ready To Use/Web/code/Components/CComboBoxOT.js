/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        <aSettings from CComboBox>
        aSettings.bDisplayAssociatives
        aSettings.bDisplayListing
 * @returns CComboBoxOT object.
 */

var CComboBoxOT = function (aSettings) {
    this.bDisplayAssociatives = getValue(aSettings.bDisplayAssociatives, false);
    this.bDisplayListing = getValue(aSettings.bDisplayListing, false);
    aSettings.bDisplayImage = true;

    CComboBox.call(this, aSettings);
};

//inheritage
CComboBoxOT.prototype = createObject(CComboBox.prototype);
CComboBoxOT.prototype.constructor = CComboBoxOT;

CComboBoxOT.prototype.loadOptions = function () {
    var self = this;
    J.ajax({
        url: sPathFileComponentsAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "OTsToJSON",
            bDisplayAssociatives: self.bDisplayAssociatives,
            bDisplayListing: self.bDisplayListing
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                self.reloadFromTxObjects(JSON.parse(results[1]));
            } else
                msgDevError(results[0], "CComboBoxOT.loadOptions");
        }
    });
}

//events
CComboBoxOT.prototype.onChange = function () {
    CComboBox.prototype.onChange.call(this)
    var self = this;
    J.ajax({
        url: sPathFileComponentsAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "getOTHint",
            idOT: this.getSelectedValue()
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                self.setHint(results[1]);
            } else
                msgDevError(results[0], "CComboBoxOT.onChange");
        }
    });
}