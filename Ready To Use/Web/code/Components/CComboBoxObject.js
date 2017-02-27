/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        <aSettings from CComboBox>
        aSettings.idOT *** Manadatory ***
        aSettings.sIdObjects : display a combo with specific ids   
        aSettings.idObjParent   
        aSettings.bRecursive
        aSettings.bIncludeFolder
        aSettings.bRemoveTrashedObj
 * @returns CComboBoxObject object.
 */

var CComboBoxObject = function (aSettings) {
    checkMandatorySettings(aSettings, ["idOT"]);
    this.idOT = getValue(aSettings.idOT, 0);
    this.sIdObjects = getValue(aSettings.sIdObjects);
    this.idObjParent = getValue(aSettings.idObjParent, 0);
    this.bRecursive = getValue(aSettings.bRecursive, false);
    this.bIncludeFolder = getValue(aSettings.bIncludeFloder, true);
    this.bRemoveTrashedObj = getValue(aSettings.bRemoveTrashedObj, false);
    aSettings.bDisplayImage = getValue(aSettings.bDisplayImage, true);

    CComboBox.call(this, aSettings);
};

//inheritage
CComboBoxObject.prototype = createObject(CComboBox.prototype);
CComboBoxObject.prototype.constructor = CComboBoxObject;

CComboBoxObject.prototype.loadOptions = function () {
    var self = this,
        settingsCombo;

    if (isEmpty(this.sIdObjects)) {
        settingsCombo = {
            sFunctionName: "objectsToJSON",
            idOT: this.idOT,
            idObjParent: this.idObjParent,
            bRecursive: this.bRecursive,
            bIncludeFolder: this.bIncludeFolder,
            bRemoveTrashedObj: this.bRemoveTrashedObj
        }
    } else {
        settingsCombo = {
            sFunctionName: "listObjectsToJSON",
            sIdObjects: this.sIdObjects
        }
    }

    J.ajax({
        url: sPathFileComponentsAjax,
        async: false,
        cache: false,
        data: settingsCombo,
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                self.reloadFromTxObjects(JSON.parse(results[2]));
            } else
                msgDevError(results[0], "CComboBoxObject.loadOptions");
        }
    });
}