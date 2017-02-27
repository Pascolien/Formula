/**
 * @class this class permit to create a CTemplateForm or a CGenericForm according to the txWebFormsConfig.json file
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.idOT 
        aSettings.idObject 
        aSettings.bReturnAttributesValue 
        aSettings.sWindowId.
        aSettings.iWindowWidth
        aSettings.iWindowHeight.
        aSettings.sWindowCaption.
        aSettings.sIcon.
        aSettings.jForms.
 * @returns CTxForm object.
 */
var ctOT = "ctOT",
    ctAdvancedCreation = "ctAdvancedCreation",
    ctAdvancedDuplication ="ctAdvancedDuplication";

function CTxForm(aSettings, aCallbackFunction, aDummydata) {
    //check if there is a config to apply, else create a genericForm
    if (isAssigned(txWebFormsConfig.configs) && (aSettings.bWriteMode != false)) {
        var sOTTag = getValue(aSettings.sOTTag),
            sTags = "";

        if (aSettings.advancedCreation) {
            sTags = getValue(aSettings.advancedCreation.Tags, []).join(";");
        } else if (aSettings.advancedDuplication) {
            sTags = getValue(aSettings.advancedDuplication.Tags, []).join(";");
        } else {
            if (isEmpty(sOTTag)) {
                var ot = getOT(aSettings.idOT);
                sTags = getValue(ot.Tags, []).join(";");
            } else
                sTags = sOTTag;
        }       

        if (!isEmpty(sTags))
            txWebFormsConfig.configs.find(function (aConfig) {
                if (inStr(sTags, aConfig.sTag)) {
                    aSettings.config = aConfig;
                    return true;
                }
            });
    }

    // init formObject
    if (isAssigned(aSettings.config))
        return new CTemplateForm(aSettings, aCallbackFunction, aDummydata);
    else
        return new CGenericForm(aSettings, aCallbackFunction, aDummydata);
};

CTxForm.prototype.toString = function () {
    return "CTxForm";
}
