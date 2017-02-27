var sFileNameTxObjectsAjax = _url("/code/TxObjects/TxObjectsAjax.asp");
var bLinkObjects = false;

/*********************************************************/
/**** Popup query number of objects to Add (and Link) ****/
/*********************************************************/

function executeQueryInteger(aCaption, aInputs) {
    var settings = {
        sCaption: aCaption,
        sLabel: _("Nombre :"),
        fLowerBound: 1,
    };

    if (aInputs.iNbMaxObjectsToAdd && aInputs.iNbMaxObjectsToAdd != '')
        settings.fUpperBound = parseInt(aInputs.iNbMaxObjectsToAdd);

    //launch the ask number window.
    var query = new CQueryInteger(settings, cbQueryNbObjects, aInputs);
}

//callback function for QueryNbObjects.
function cbQueryNbObjects(aModalResult, aValue, aData) {
    if (aModalResult == "ok") {
        aData.iNbObjectsToAdd = aValue;
        if (bLinkObjects)
            DoAddAndLinkObjects(aData);
        else
            DoAddObjects(aData, endAddObjetcs);
    } else { // user has cancelled.
        aData.cancel = true;
        if (bLinkObjects)
            endAddAndLink(aData.cancel);
        else
            endAddObjetcs(null, aData);
    }
    
}

/**********************************************************/
/******************* Manage Form Window *******************/
/**********************************************************/

function popupWriteForm(aSettings, aCallBack, aInputs) {
    var self = this,
        rSettings = aSettings;

    if (aInputs.bNForms == "Yes") {
        var nLeft = aInputs.iNbObjectsToAdd - aInputs.iNbPopup + 1;
        var sNameCurrentObject;
        if (aInputs.jsonObjectsToAdd.length >= nLeft)
            sNameCurrentObject = aInputs.jsonObjectsToAdd[nLeft - 1].sName;
        aSettings.sWindowCaption = aInputs.sObjectTypeName + " - " + _("Formulaire de l'Entité") + (sNameCurrentObject ? (" \"" + sNameCurrentObject + "\"") : "") + ((nLeft == aInputs.iNbObjectsToAdd && nLeft == 1) ? "" : (" " + nLeft + "/" + aInputs.iNbObjectsToAdd));
    }

    //Callback function for CTxForm
    this.cbGenericWriteForm = function (aModalResult, aInstructions, aInputs) {
        if (!aModalResult) {
            if (aInputs.bNForms == "No")
                aInputs.jsonObjectsToAdd = [];
            else
                aInputs.jsonObjectsToAdd = aInputs.jsonObjectsToAdd.splice(0, (aInputs.iNbObjectsToAdd - aInputs.iNbPopup));
            aInputs.cancel = true;
            aCallBack(aInputs);
        } else {
            var obj = aInputs.jsonObjectsToAdd[aInputs.iNbObjectsToAdd - aInputs.iNbPopup],
                bExistingObject = ("ID" in obj) && (obj.ID != 0);

            aInputs.modifiedFields = aInputs.modifiedFields.map(function (aFieldData) {
                if (!("sAction" in aFieldData)) aFieldData.sAction = "dbaModif";
                // in case of Add(&Link)Objects : remove "dbaDel" instructions
                if (!bExistingObject && (aFieldData.sAction === "dbaDel"))
                    delete aFieldData.sAction;
                return aFieldData;
            });
            aInputs.jsonDataForm.push(aInputs.modifiedFields);

            aInputs.iNbPopup = aInputs.iNbPopup - 1;
            if (aInputs.iNbPopup == 0 || aInputs.bNForms == "No")
                aCallBack(aInputs);
            else {
                // maj idObject
                
                if (! isEmpty(rSettings.idSourceObject))
                    ; // nothing to do, just keep the same idObject
                else if (bExistingObject) {
					// maj current object (with new iNbPopup)
					obj = aInputs.jsonObjectsToAdd[aInputs.iNbObjectsToAdd - aInputs.iNbPopup]
                    rSettings.idObject = obj.ID;
                } else
                    delete rSettings.idObject;
                if (rSettings.sIdsRepeatValueAtt !== sNull) {
                    var newJsonRepeatValue = [];
                    J.extend(newJsonRepeatValue, aInputs.modifiedFields); // copy Json result of WebForm
                    var iRemoveItem = 0;
                    J.each(aInputs.modifiedFields, function (aIndex, aJsonObject) {
                        if (inStr(rSettings.sIdsRepeatValueAtt, "" + aJsonObject.ID_Att)) {
                            // this object value have to be repeat except if data have to be deleted
                            if ("sAction" in aJsonObject && aJsonObject.sAction == "dbaDel") {
                                newJsonRepeatValue.splice(aIndex - iRemoveItem, 1); // remove object from array : value to delete
                                iRemoveItem++;
                            }
                        } else {
                            newJsonRepeatValue.splice(aIndex - iRemoveItem, 1); // remove object from array : not repeat this object value
                            iRemoveItem++;
                        }
                    });
                    rSettings.sDefaultValues = {
                        "Data": newJsonRepeatValue
                    };
                }
                popupWriteForm(rSettings, aCallBack, aInputs);
            }
        }
    }
    new CTxForm(aSettings, self.cbGenericWriteForm, aInputs);
}