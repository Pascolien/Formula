/**
 * @class
 * Set a class to control Actions to do for Workflow
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.idObject *** MANDATORY ***
        aSettings.idOT *** MANDATORY ***
        aSettings.iActionOrder *** MANDATORY ***
        aSettings.sWorkflowTag *** MANDATORY ***
        aSettings.idCurrentTask *** MANDATORY ***
        aSettings.classWorkflow *** MANDATORY ***
        aSettings.bIgnoreRights
        aCallBackFunction
        aDummyData
 * @returns CWorkflowActionExecution object.
 */

var CWorkflowActionExecution = function(aSettings, aCallBackFunction, aDummyDataClass) {
    // check for mandatory attributes
    checkMandatorySettings(aSettings, ["idObject","idOT","iActionOrder","sWorkflowTag","idCurrentTask","classWorkflow"]);

    //initialise settings
    this.idObject = aSettings.idObject;
    this.idOT = aSettings.idOT;
    this.iActionOrder = aSettings.iActionOrder;
    this.sWorkflowTag = aSettings.sWorkflowTag;
    this.idCurrentTask = aSettings.idCurrentTask;
    this.bIgnoreRights = getValue(aSettings.bIgnoreRights, true);
    this.classWorkflow = aSettings.classWorkflow;
    this.sTaskClass = 0;
    this.out = "";
    this.sWarningMessage = "";
    this.CwdowWorflowForm = null;
    this.fctCallBack = aCallBackFunction;
    this.dummydata = getValue(aDummyDataClass, {});

    // begin workflow with actions
    this.executeAction();
}

// Main function to execute current action of Workflow
CWorkflowActionExecution.prototype.executeAction = function () {
    var self = this;
    this.classWorkflow.popup.progressOn();
    J.ajax({
        url: sPathFileTxWorkflowAjax,
        async: true,
        cache: false,
        data: {
            sFunctionName: 'ExecuteAction',
            idObject: self.idObject,
            iActionOrder: self.iActionOrder,
            sWorkflowTag: self.sWorkflowTag,
            idCurrentTask: self.idCurrentTask
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == "ok") {
                self.classWorkflow.popup.progressOff();
                self.sTaskClass = results[1];
                if (self.sTaskClass != sNull) {
                    self.out = JSON.parse(results[2]);
                    self.idCurrentTask = parseInt(results[3]);
                    self.sWarningMessage = (results[4] !== undefined) ? results[4] : "";
                }
                // Switch case to choose kind of action to execute
                switch (self.sTaskClass) {
                    case "WriteFormTask": // display form
                        self.callWarning(function () { self.callAdvancedForm() });
                        break;
                    case "MessageTask": // display message
                        self.callWarning(function () { self.callMessageWorflow() });
                        break;
                    case "AdvancedDuplicationTask": // duplication, focus new object
                        self.classWorkflow.resultsWF = mergeWebModelJsonInstructions(self.classWorkflow.resultsWF, self.out);
                        self.executeAction();
                        break;
                    case "ModelApplicationTask": // execute Model Application
                        if (self.out.Model.sModelType === 'mtASPModel') // Web MA
                            self.callWarning(function () { self.callWebModelApplication() });
                        else { // Server MA
                            self.classWorkflow.resultsWF = mergeWebModelJsonInstructions(self.classWorkflow.resultsWF, self.out.sResult, self.idOT);
                            self.executeAction();
                        }
                        break;
                    case "DataWritingTask": // updateInstruction
                        self.classWorkflow.resultsWF = mergeWebModelJsonInstructions(self.classWorkflow.resultsWF, self.out, self.idOT);
                        self.executeAction();
                        break;
                    default: // "" : close popup
                        var result = { cancel: false };
                        self.fctCallBack(result, self.dummydata);
                        break;
                }
            } else
                msgWarning(results[0], function () { self.classWorkflow.cancelToClose(); });
        },
        error: function (result, status, error) {
            msgError(error);
        }
    });
}

// Check for a warning message before execute action
CWorkflowActionExecution.prototype.callWarning = function (aCallBack) {
    if (this.sWarningMessage != sNull) {
        msgWarning(this.sWarningMessage, aCallBack);
    } else {
        aCallBack();
    }
}

CWorkflowActionExecution.prototype.callMessageWorflow = function () {
    var self = this,
        sMessage = this.out.sMessage;
    // switch case to display the good type of message popup
    switch (this.out.sMessageType) {
        case "mtOkCancel": // Ok Cancel message
            msgOkCancel(sMessage, function (aResults) { self.cbMessageWorflow(aResults) });
            break;
        case "mtYesNo": // Yes No message
            msgYesNo(sMessage, function (aResults) { self.cbMessageWorflow(aResults) });
            break;
        default: // Warning & Inforamtion message
            msgWarning(sMessage, function (aResults) { self.cbMessageWorflow(aResults) });
            break;
    }
}

// CallBack after display a message
CWorkflowActionExecution.prototype.cbMessageWorflow = function (aResults) {
    // Get the response of user ok or not 
    if (typeof aResults != "boolean") { // Not a boolean -> information message just 'ok' = true
        aResults = true;
    }
    if (aResults) { // Ok so continue actions of workflow
        this.executeAction();
    }
    // Else Not ok so break actions of workflow 
}

CWorkflowActionExecution.prototype.callAdvancedForm = function () {
    function lockingObjectTimeout(aNode) {
        //check si on peut la reverrouiller
        var iLockingState = checkObjectLocked(aNode.ID);
        switch (iLockingState) {
            case lsLockedAndDisabled:
            case lsLocked:
                // si déjà verrouillé par un autre utilisateur
                //afficher un bouton checker le verrouillage dans le formulaire
                msgWarning(_Fmt("L'Entité '#1' est déjà verrouillée. Vous pouvez revérifier la disponibilité de l'Entité en cliquant sur le bouton Verrouiller l'Entité.<br>Si vous fermer la fenêtre, les modifications seront perdues.", [aNode.sName]));
                break;
            case lsAutomaticallyLocked:
            case lsUnlocked:
            case lsUnrelevant:                
                //popup de confirmation de reverrouillage
                var ot = getOT(aNode.ID_OT);
                var fLockingDuration = Math.round(ot.fLocking_Duration);
                msgYesNo(_Fmt("Voulez-vous re-verrouiller l'Entité '#1' pour une durée de #2 minute(s) ?", [aNode.sName, fLockingDuration]),
                    function (aOk) {
                        if (aOk) {
                            self.CwdowWorflowForm.lock(false);
                            lockObject(aNode.ID);
                        } else
                            unlockObject(aNode.ID);
                    });
                break;
        }
    }

    function displayForm(aLockingDuration) {
        aLockingDuration = getValue(aLockingDuration, 0) * 60;

        var fctLockingCallback = aLockingDuration > 0 ? function () { lockingObjectTimeout(object) } : null;

        var settingTxWebForm = {
            idOT: parseInt(idOT),
            idObject: self.idObject,
            fTimeoutLockingInSeconds: aLockingDuration,
            fctLockingCallback: fctLockingCallback,
            sWindowCaption: sHeader,
            bIgnoreRights: self.bIgnoreRights,
            sMandatoryAttributesIds: sMandatoryAtt
        }

        if (self.out.sWriteFormType === "wftAttributesList") {
            settingTxWebForm.sType = "aptId";
            settingTxWebForm.sData = "[" + sData + "]";
            settingTxWebForm.bReturnAttributesValue = false;
        }

        self.CwdowWorflowForm = new CGenericForm(settingTxWebForm, function (aValidated, aResults, aDummyData) { self.cbCallAdvancedForm(aValidated, aResults, aDummyData); }, {});
    }

    var sHeader = _("Formulaire"),
        idOT = 0,
        sData = "",
        sMandatoryAtt = "",
        fLockingDuration,
        self = this;

    //sWriteFormType : "wftDefaultForm"
    if (this.out) {
        sHeader = this.out.sName;
        idOT = this.out.idObjectType;
        if (this.out.Fields) {
            this.out.Fields.forEach(function (element) {
                sData = qc(sData, element.idAttribute, ',');
                if (element.Properties && element.Properties.bMandatory == "true")
                    sMandatoryAtt = qc(sMandatoryAtt, element.idAttribute, ',');
            });
        }
        var ot = getOT(idOT);
        var object = getObject(this.idObject);
        if (ot && ot.iLocking_Type != ltNone) {
            var iLockingState = checkObjectLocked(this.idObject);
            fLockingDuration = Math.round(ot.fLocking_Duration);
            switch (iLockingState) {
                case lsAutomaticallyLocked:
                    lockObject(this.idObject);
                    displayForm(fLockingDuration);
                    break;
                case lsLockedAndDisabled:
                case lsLocked:
                    msgWarning(_Fmt("L'Entité '#1' est verrouillée.", [object.sName]));
                    break;
                case lsUnlocked:
                    if (ot.iLocking_Type == ltManual)
                        msgYesNo(_Fmt("Voulez- vous verrouiller l'Entité '#1' pour une durée de #2 minute(s) ?", [object.sName, fLockingDuration]),
                            function (aOk) {
                                if (aOk)
                                    lockObject(self.idObject);
                                else
                                    fLockingDuration = 0;

                                displayForm(fLockingDuration);
                            });
                    break;
            }
        } else
            displayForm(fLockingDuration);
    }

    
}

// CallBack after a form
CWorkflowActionExecution.prototype.cbCallAdvancedForm = function (aValidated, aResults, aDummyData) {
    if (aValidated) { // Click on validate = continu action(s)
        // reload object informations (in case of renaming with writting data)
        var newObjects = [];
        var object = {
            updateObject: getObject(this.idObject)
        };
        newObjects.push(object);
        this.classWorkflow.resultsWF = mergeWebModelJsonInstructions(this.classWorkflow.resultsWF, newObjects);
        this.executeAction();
    } else { // Click on cancel = break actions and close Windows
        var result = { cancel: true };
        this.fctCallBack(result, this.dummydata);
    }
}

// Execute Web Model Application
CWorkflowActionExecution.prototype.callWebModelApplication = function () {
    var self = this;

    //Initialize the settings for model application execution 
    var setting = {
        sObjectIds: ""+this.out.idObject,
        idModelApplication: this.out.ID,
        sObjectDependency: this.out.sObjectDependency,
        idObjectType: this.idOT
    }

    //launch the model application
    new CModelApplicationExecution(setting, function (aResult, aDummyData) { self.cbCallWebMA(aResult, aDummyData); }, this.dummydata);
}

// CallBack after a Web model application
CWorkflowActionExecution.prototype.cbCallWebMA = function (aResult, aDummyData) {
    var results;
    // Add result to gloabl results for workflow
    if (Object.prototype.toString.call(aResult) !== '[object Array]') {
        results = [];
        results.push(aResult);
    } else
        results = aResult;
    this.classWorkflow.resultsWF = mergeWebModelJsonInstructions(this.classWorkflow.resultsWF, results, this.idOT);
    if (aDummyData.cancel == true) {
        var result = { cancel: true };
        this.fctCallBack(result, this.dummydata);
    } else  // continue actions of worflow
        this.executeAction();
}