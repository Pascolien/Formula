/**
 * @class
 * Set a class to control Actions to do for Workflow
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.sIdObject *** MANDATORY ***
        aSettings.sWorkflowTag *** MANDATORY ***
        aSettings.sFlag *** MANDATORY ***
        aCallBackFunction
        aDummyData
 * @returns CWorkflow object.
 */

var sPathFileTxWorkflowAjax = _url('/temp_resources/models/TxWorkflow/TxWorkflowAjax.asp');

var CWorkflow = function (aSettings, aCallBackFunction, aDummyData) {
    // check for mandatory attributes
    checkMandatorySettings(aSettings, ["sIdObject", "sWorkflowTag", "sFlag"]);

    //initialise settings
    var self = this;
    this.idObject = parseInt(aSettings.sIdObject);
    this.idOT = 0;
    this.sWorkflowTag = aSettings.sWorkflowTag;
    this.sFlag = aSettings.sFlag;
    this.idCurrentTask = 0;
    this.resultsWF = [];
    this.callBack = aCallBackFunction;
    this.dummyData = aDummyData;
    this.workflowActionExecution;
    this.sHtmlWF = '<ul id="listActionsWorkFlow"></ul>';

    this.popup = new CPopupInterface({
        sHtmlContent: this.sHtmlWF,
        iWidth: 610, 
        iHeight: 350,
		bModalScreen: true
    }, function () {
        self.cancelToClose();
    });

    this.popup.showPopup(J.lastMainToolbarItemClicked);

    // fixed z-index to put popup behind form if an action is executed
    J("#listActionsWorkFlow").closest(".dhx_popup_dhx_skyblue").css({
        "z-index": "10"
    });

    this.popup.progressOn();
    // Get JSON for Grid data
    J.ajax({
        url: sPathFileTxWorkflowAjax,
        type: 'post',
        async: true,
        cache: false,
        data: {
            sFunctionName: 'ListActions',
            idObject: self.idObject,
            var0: self.sWorkflowTag,
            var1: self.sFlag
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == "ok") {
                self.addListOfActions(JSON.parse(results[1]));
                // get Json object for instructions in callback
                self.object = new Object();
                self.object.updateObject = JSON.parse(results[2]);
                self.idOT = self.object.updateObject.ID_OT;
            } else {
                msgError(results[0]);
            }
			self.popup.progressOff();
        }
    });
}

CWorkflow.prototype.addListOfActions = function (aJsonData) {
    var sWorkflowTag = aJsonData.workflow.sTag,
        sActionHtml = '',
        sIconUrl = '',
        self = this;
    if (aJsonData.actions.length > 0) {
        aJsonData.actions.forEach(function (element) {
            sIconUrl = _url('/temp_resources/models/TxWorkflow/') + getValue(element.sIconUrl, 'img/48x48_Models.png');
            sActionHtml = '<li iOrder="' + element.iOrder + '" bIgnoreRights="' + element.bIgnoreRights + '" class="actionWorkflow" style="display: none;">' +
                                '<img src="' + sIconUrl + '">' +
                                '<div class="detailsActionWorkflow">' +
                                    '<div class="divVerticalCenter">' +
                                        '<div class="actionWorkflowName">' + element.sName + '</div>' +
                                        '<div class="actionWorkflowDescription" title="' + ((element.sDescription) ? element.sDescription : '') + '">' + ((element.sDescription) ? element.sDescription : '') + '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</li>';

            J("#listActionsWorkFlow").append(sActionHtml);
        });
        J(".actionWorkflow").fadeIn(400);
        J(".actionWorkflow").click(function () {
            var iActionOrder = J(this).attr("iOrder");
            var bIgnoreRights = strToBool(J(this).attr("bIgnoreRights"));
            self.executeAction(parseInt(iActionOrder), sWorkflowTag, bIgnoreRights);
        });
    } else {
        J("#listActionsWorkFlow").html("<div class='informationTexteWorkflow'>" + _("Aucune action disponible.") + "</div>");
    }
}

// launch a specific action select by user in grid
CWorkflow.prototype.executeAction = function (aActionOrder, aWorkflowTag, aIgnoreRights) {
    this.popup.hidePopup();
    var self = this,
        setting = {
            idCurrentTask: this.idCurrentTask,
            idObject: this.idObject,
            idOT: this.idOT,
            iActionOrder: aActionOrder,
            sWorkflowTag: aWorkflowTag,
            bIgnoreRights: aIgnoreRights,
            classWorkflow: self
        };
    // if an action is executed we need to refresh the object selected
    this.resultsWF.push(this.object);
    // initialise class for Execute actions of Worflow
    this.workflowActionExecution = new CWorkflowActionExecution(setting, function (aResults, aDummyData) { self.cbWFAction(aResults, aDummyData); }, {});
}

// Specify the cancel action from user before close
CWorkflow.prototype.cancelToClose = function () {
    var results = { cancel: true };
    this.cbWFAction(results, {});
}

// CallBack after Class CWorkflowAction
CWorkflow.prototype.cbWFAction = function (aResults, aDummyData) {
    var self = this;

    if (this.workflowActionExecution && this.workflowActionExecution.CwdowWorflowForm) {
        if (!this.workflowActionExecution.CwdowWorflowForm.bLocked)
            if (aResults.cancel == true) { // User cancel action = Unlock action
                J.ajax({
                    url: sPathFileTxWorkflowAjax,
                    async: false,
                    cache: false,
                    data: {
                        sFunctionName: 'UnlockAction',
                        idObject: self.idObject
                    },
                    success: function (aResult) {
                        self.popup.progressOff();
                        var results = aResult.split("|");
                        if (results[0] != "ok")
                            msgWarning(results[0]);
                    }
                });
            }
    }
    this.closeInterface();
}

CWorkflow.prototype.closeInterface = function () {
    this.popup.remove();
    this.callBack(this.resultsWF, this.dummyData);
    amWorkflow = undefined;
}