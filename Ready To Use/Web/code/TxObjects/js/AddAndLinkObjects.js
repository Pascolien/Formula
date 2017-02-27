function initializeAddAndLinkObjects(aInputs, aCallback, aDummyData) {
    //The function requires an object.
    if (!aInputs.idObject || aInputs.idObject < 1) {
        msgWarning(_("Veuillez sélectionner une Entité."));
        aCallback(aDummyData);
        return;
    }
    bLinkObjects = true;

    //If the number of object to create and link is not defined, then asking it to the user.
    if (aInputs.iNbObjectsToAdd < 1) {
        J.ajax({
            url: sFileNameTxObjectsAjax,
            type: 'POST',
            async: false,
            cache: false,
            data: {
                sFunctionName: "GetOTDestinationName",
                sTagAttDirectLink: aInputs.sTagAttDirectLink
            },
            success: function (aOutputs) {
                var results = aOutputs.split('|');
                //no execution error.
                if (results[0] == sOk) {
                    executeQueryInteger(_Fmt("Nombre d'Entités '#1' à créer et lier", [results[1]]), aInputs); // results[1] : OT Destination name
                } else 
                    msgError(results[0]);
            }
        });
    } else {
        DoAddAndLinkObjects(aInputs, aCallback, aDummyData);
    }
}

function DoAddAndLinkObjects(aInputs, aCallback, aDummyData) {
    //All inputs are correctly set. calling the first step function.
    var sIdAttDirectLink = isAssigned(aInputs.sTagAttDirectLink) ? aInputs.sTagAttDirectLink : getValue(aInputs.idAttDirectLink, 0),
        sIdAdvCreation = isAssigned(aInputs.sAdvCreationTag) ? aInputs.sAdvCreationTag : getValue(aInputs.idAdvCreation, 0),
        sIdAdvDuplication = isAssigned(aInputs.sAdvDuplicationTag) ? aInputs.sAdvDuplicationTag : getValue(aInputs.idAdvDuplication, 0),
        bDisplaySuccessMsg = getValue(aInputs.bDisplaySuccessMsg, true);

    J.ajax({
        url: sFileNameTxObjectsAjax,
        type: 'POST',
        async: true,
        cache: false,
        data: {
            sFunctionName: "WEBAddAndLinkObjectsStep1",
            idObject: aInputs.idObject,
            sTagAttDirectLink: sIdAttDirectLink,
            sExistingLinkManagement: getValue(aInputs.sExistingLinkManagement, "Add"), //Replace, Add, Cancel
            iNbObjectsToAddAndLink: getValue(aInputs.iNbObjectsToAdd, 1),
            sAdvCreationTag: sIdAdvCreation,
            sCreationOrDuplication: aInputs.sCreationOrDuplication,
            sAdvDuplicationTag: sIdAdvDuplication,
            sDuplicationSourceType: aInputs.sDuplicationSourceType,
            sSourceObjectsIDs: sNull,
            sSourceObjectsTags: getValue(aInputs.sSourceObjectsTags),
            sSourceLnkAttTags: getValue(aInputs.sSourceLnkAttTags),
            bAllowSwitchCreation: getValue(aInputs.bAllowSwitchCreation, true),
            sErrorMsg: getValue(aInputs.sErrorMsg, sNull),
            sMandatoryAttTags: getValue(aInputs.sMandatoryAttTags, sNull),
            sRepeatValueAttTags: getValue(aInputs.sRepeatValueAttTags, sNull),
            sFocusLinkObject: getValue(aInputs.sFocusLinkObject, 'No')
        },
        success: function (aOutputs) {
            var results = aOutputs.split("|");
            //0: an execution status or an execution error message
            //1: Json objects :
                //bBusinessStatus : a business status.
                //sMessage: a business message.
                //bUserInteraction: if ok, a write form (or many) must be displayed.
                //sAttributesIds: the list of the attributes identifiers to display into the form, separated with ",".
                //sAttributesIdsToRepeat: the list of the attributes identifiers to repeat trough forms, separated with ",".
                //sMandatoryAttributesIds: the list of the mandatory attributes identifiers in forms, separated with ",".
                //sCreationMode: the mode of creation {"Creation", "AdvCreation", "AdvDuplication"}
                //idAdvFunction: id of creation or duplication
                //objectsToAdd: Json of objects to Add and Link
                //objectTypeDest: json of Object Type of destination
                //modelApplicationResults: JsonInstructions if no User interaction
                //iNbObjectsAdded: number of objects added if no User intercation
                //sSourceObjectName: name of Current entity if no User interaction

            //no execution error.
            if (results[0] != sOk) {
                msgError(results[0]);
                if (aCallback)
                    aCallback(aDummyData); //true
                return;
            }

            result = JSON.parse(results[1]);

            //Displaying a "business" message
            if (result.sMessage)
                msgWarning(result.sMessage);

            //In case of a business error or if the whole treatment has been done.
            if (!result.bBusinessStatus || !result.bUserInteraction) {
                if (!result.bUserInteraction && result.modelApplicationResults) {
                    rResultsAddAndLink = result.modelApplicationResults;
                }
                if (result.iNbObjectsAdded > 0) {
                    // display message information
                    if (bDisplaySuccessMsg)
                        msgWarning(_Fmt("La création de #1 Entité(s) '#2', liée(s) à l'Entité '#3' a été effectuée avec succès.", [result.iNbObjectsAdded, result.objectTypeDest.sName, result.sSourceObjectName]));
                }
                if (aCallback)
                    aCallback(result, aDummyData);

                if (aInputs.sFocusLinkObject != "Yes") {
                    txASP.tree.clearSelection("", true);
                    txASP.tree.selectObject(aInputs.idObject);
                    txASP.tree.stopEdit();
                }

                return;
            }

            // Set necessary parameters for second call
            aInputs.creationMode = result.sCreationMode;
            aInputs.idAdvFunction = result.idAdvFunction;

            // Get objects to add and update the number of total objects to add.
            aInputs.jsonObjectsToAdd = JSON.parse(result.objectsToAdd);
            aInputs.iNbObjectsToAdd = aInputs.jsonObjectsToAdd.length;
            aInputs.iNbPopup = (aInputs.bNForms == "Yes") ? aInputs.iNbObjectsToAdd : 1;
            aInputs.jsonDataForm = [];
            aInputs.sObjectTypeName = result.objectTypeDest.sName;

            if (result.sAttributesIds) {
                // init settings for window form
                popupWriteForm({
                    sType: "aptId",
                    idOT: result.objectTypeDest.ID,
                    sIcon: format("temp_resources/theme/img/png/#1.png", [result.objectTypeDest.iIcon]),
                    sData: "[" + result.sAttributesIds + "]",
                    bReturnAttributesValue: true,
                    bIgnoreRights: aInputs.bIgnoreRights,
                    sWindowCaption: _("Formulaire de l'Entité"),
                    sMandatoryAttributesIds: result.sMandatoryAttributesIds,
                    sIdsRepeatValueAtt: result.sAttributesIdsToRepeat,
                    sDefaultValues: ''
                }, function (aInputs) { saveWriteFormsAddAndLinkObjects(aInputs, aCallback, aDummyData); }, aInputs);
            } else
                saveWriteFormsAddAndLinkObjects(aInputs, aCallback, aDummyData);
        }
    });
}

function saveWriteFormsAddAndLinkObjects(aInputs, aCallback, aDummyData) {
    var sDataFormJson = JSON.stringify(aInputs.jsonDataForm),
        bDisplaySuccessMsg = getValue(aInputs.bDisplaySuccessMsg, true),
        sIdAttDirectLink = isAssigned(aInputs.sTagAttDirectLink) ? aInputs.sTagAttDirectLink : getValue(aInputs.idAttDirectLink, 0);
    J.ajax({
        url: sFileNameTxObjectsAjax,
        type: 'POST',
        async: true,
        cache: false,
        data: {
            sFunctionName: "WEBAddAndLinkObjectsStep2",
            idObject: aInputs.idObject,
            sTagAttDirectLink: sIdAttDirectLink,
            sExistingLinkManagement: getValue(aInputs.sExistingLinkManagement, "Add"),
            sCreationMode: aInputs.creationMode,
            idAdvFunction: aInputs.idAdvFunction,
            bNForms: aInputs.bNForms,
            sDataJSONs: (sDataFormJson != "[]") ? sDataFormJson : "<null>",
            sObjectsToAddJson: JSON.stringify(aInputs.jsonObjectsToAdd),
            sFocusLinkObject: aInputs.sFocusLinkObject
        },
        success: function (aOutputs) {
            var results = aOutputs.split("|");
            //no execution error.
            if (results[0] != sOk)
                msgError(results[0]);

            if (results.length > 1 && results[1]) {
                rResultsAddAndLink = JSON.parse(results[1]);
            }
            if (parseInt(results[2]) > 0 && bDisplaySuccessMsg) {
                // display message information 
                msgWarning(_Fmt("La création de #1 Entité(s) '#2', liée(s) à l'Entité '#3' a été effectuée avec succès.", [results[2], results[3], results[4]]));
            }
            // End of action : return to CallBack
            if (aCallback) {
                aInputs.modelApplicationResults = JSON.parse(results[1]);
                aInputs.bNotRefresh = true;
                aCallback(aInputs, aDummyData);

                //refresh tree
                if (aInputs.sFocusLinkObject == "Yes") {
                    if (aInputs.modelApplicationResults)
                        if (aInputs.modelApplicationResults.length > 0)
                            txASP.tree.setTxIdToSelect(aInputs.modelApplicationResults[0].updateObject.ID);
                }

                txASP.tree.updateSelectedBusinessNode();

                if (aInputs.sFocusLinkObject != "Yes") {
                    txASP.tree.clearSelection("", true);
                    txASP.tree.selectObject(aInputs.idObject);
                    txASP.tree.stopEdit();
                }
            }
        }
    });
}