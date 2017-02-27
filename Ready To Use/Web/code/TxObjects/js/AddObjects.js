function initializeAddObjects(aInputs) {
    //The function requires "a minima" an object type.
    if (!aInputs.idOT || aInputs.idOT < 1) {
        msgWarning(_("Veuillez sélectionner un Type d'Entité."));
        endAddObjetcs();
        return;
    }
    bLinkObjects = false;

    //If the number of object to create and link is not defined, then asking it to the user.
    if (aInputs.iNbObjectsToAdd < 1) {
        executeQueryInteger(_("Nombre d'Entités à créer"), aInputs);
    } else {
        DoAddObjects(aInputs, endAddObjetcs);
    }
}

function DoAddObjects(aInputs, aCallback) {
    var self = this;

    // public method for second step (save data after user interactions)
    this.saveWriteFormsAddObjects = function(aInputsSave) {
        var sDataFormJson = JSON.stringify(aInputsSave.jsonDataForm);
        J.ajax({
            url: sFileNameTxObjectsAjax,
            type: 'POST',
            async: true,
            cache: false,
            data: {
                sFunctionName: "WEBAddObjectsStep2",
                idObject: aInputsSave.idObject,
                idOT: aInputsSave.idOT,
                sCreationMode: aInputsSave.creationMode,
                idAdvFunction: aInputsSave.idAdvFunction,
                bNForms: aInputsSave.bNForms,
                sDataJSONs: (sDataFormJson != "[]") ? sDataFormJson : "<null>",
                sObjectsToAddJson: JSON.stringify(aInputsSave.jsonObjectsToAdd),
                sFocusObject: getValue(aInputsSave.sFocusObject, 'Yes'),
                idParent: aInputsSave.idParent,
                arrSelectedObjects: JSON.stringify(aInputsSave.arrSelectedObjects)
            },
            success: function (aOutputs) {
                var results = aOutputs.split("|");
                //no execution error.
                if (results[0] != sOk)
                    msgError(results[0]);
                else {
                    if (results[1]) {
                        rResultsAddObj = JSON.parse(results[1]);
                    }
                    if (parseInt(results[2]) > 0) {
                        // To display message information
                        aInputsSave.sMsgObjectsAdded = format(_("La création de #1 Entité(s) a été effectuée avec succès."), [results[2]]);
                    }
                    // End of action : return to CallBack
                    aCallback(rResultsAddObj, aInputsSave);
                }
            }
        });
    }

    //All inputs are correctly set. calling the first step function.
    J.ajax({
        url: sFileNameTxObjectsAjax,
        type: 'post',
        async: true,
        cache: false,
        data: {
            sFunctionName: "WEBAddObjectsStep1",
            idObject: aInputs.idObject,
            idOT: aInputs.idOT,
            iNbObjectsToAdd: getValue(aInputs.iNbObjectsToAdd, 1),
            sAdvCreationTag: aInputs.advancedCreation ? aInputs.advancedCreation.ID : aInputs.sAdvCreationTag,
            sCreationOrDuplication: aInputs.sCreationOrDuplication,
            sAdvDuplicationTag: aInputs.sAdvDuplicationTag,
            sDuplicationSourceType: aInputs.sDuplicationSourceType,
            sSourceObjectsIDs: aInputs.sSourceObjectsIDs,
            sSourceObjectsTags: aInputs.sSourceObjectsTags,
            sSourceLnkAttTags: aInputs.sSourceLnkAttTags,
            bAllowSwitchCreation: getValue(aInputs.bAllowSwitchCreation, "No"),
            sErrorMsg: getValue(aInputs.sErrorMsg, sNull),
            sMandatoryAttTags: getValue(aInputs.sMandatoryAttTags,sNull),
            sRepeatValueAttTags: getValue(aInputs.sRepeatValueAttTags,sNull),
			sFocusObject: getValue(aInputs.sFocusObject, 'Yes'),
            sIdsAttributesToDuplicate: aInputs.sIdsAttributesToDuplicate,
            arrSelectedObjects: JSON.stringify(aInputs.arrSelectedObjects)
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
                //objectType: json of Object Type
                //idParent: id of parent Object
                //modelApplicationResults: JsonInstructions if no User interaction
                //iNbObjectsAdded: number of objects added if no User intercation

            //no execution error.
            if (results[0] != sOk) {
                msgError(results[0]);
                aInputs.cancel = true;
                aCallback(null, aInputs);
                return;
            }

            result = JSON.parse(results[1]);

            //Displaying a "business" message
            if (result.sMessage)
                msgWarning(result.sMessage);

            // Set necessary parameters
            aInputs.creationMode = result.sCreationMode;
            aInputs.idAdvFunction = result.idAdvFunction;
            aInputs.idParent = result.idParent;
            if (aInputs.bIgnoreRights == null) {
                aInputs.bIgnoreRights = (aInputs.creationMode == "AdvCreation" || aInputs.creationMode == "AdvDuplication") ? true : false;
            }

            //In case of a business error or if the whole treatment has been done.
            if (!result.bBusinessStatus || !result.bUserInteraction) {
                if (!result.bUserInteraction && result.modelApplicationResults) {
                    rResultsAddObj = result.modelApplicationResults;
                }
                if (result.iNbObjectsAdded > 0) {
                    // Message information to display
                    aInputs.sMsgObjectsAdded = format(_("La création de #1 Entité(s) a été effectuée avec succès."), [result.iNbObjectsAdded]);
                }
                aCallback(rResultsAddObj, aInputs);

                return;
            }

            // Get objects to add and update the number of total objects to add.
            aInputs.jsonObjectsToAdd = JSON.parse(result.objectsToAdd);
            aInputs.iNbObjectsToAdd = aInputs.jsonObjectsToAdd.length;
            aInputs.iNbPopup = (aInputs.bNForms == "Yes") ? aInputs.iNbObjectsToAdd : 1;
            aInputs.jsonDataForm = [];
            aInputs.sObjectTypeName = result.objectType.sName;

            if (result.sAttributesIds) {
                // init settings for window form
                var settingsTxObjects = {
                    idOT: aInputs.idOT,
                    sIcon: format("temp_resources/theme/img/png/#1.png", [result.objectType.iIcon]),
                    bReturnAttributesValue: true,
                    bIgnoreRights: aInputs.bIgnoreRights,
                    wdowContainer : aInputs.wdowContainer,
                    sWindowCaption: _("Formulaire de l'Entité"),
                    sMandatoryAttributesIds: result.sMandatoryAttributesIds,
                    sIdsRepeatValueAtt: result.sAttributesIdsToRepeat,
                    sDefaultValues: ''
                }
                if (aInputs.creationMode != "Creation") {
                    settingsTxObjects.advancedCreation = aInputs.advancedCreation;
                    settingsTxObjects.advancedDuplication = aInputs.advancedDuplication;
                    settingsTxObjects.sType = "aptId";
                    settingsTxObjects.sData = "[" + result.sAttributesIds + "]";
                }
                popupWriteForm(settingsTxObjects, self.saveWriteFormsAddObjects, aInputs);
            } else
                self.saveWriteFormsAddObjects(aInputs);
        }
    });
}