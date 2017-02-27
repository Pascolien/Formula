/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings{
            idModelApplication *** MANDATORY ***
            sObjectDependency --> odASingleOne ; odZeroToOne ; odNone, odMany
            idObjectType
            sObjectIds 
        }
        aCallBackFunction
        aDummyData
 * @returns CModelApplicationExecution object.
 */

var CModelApplicationExecution = function (aSettings, aCallBackFunction, aDummyData) {
    checkMandatorySettings(aSettings, ["idModelApplication"]);

    var self = this;
    this.sPathFileModelApplicationAjax = _url("/code/TxModelApplication/TxModelApplicationAjax.asp");
    this.idModelApplication = getValue(aSettings.idModelApplication);
    this.sObjectDependency = getValue(aSettings.sObjectDependency, null);
    this.sObjectIds = getValue(aSettings.sObjectIds, '0');
    this.idObjectType = getValue(aSettings.idObjectType, 0);
    this.bLaunchExecution = getValue(aSettings.bLaunchExecution, true);
    this.callback = aCallBackFunction;
    this.dummyData = getValue(aDummyData, {});
    this.desactiveProgressLayout = this.dummyData.desactiveProgressLayout;
    this.sTypeModel = "";
    this.jResult = {};
    this.iNbOfExecution = 0;
    
    if (!this.sObjectDependency)
        this.getModelApplicationObjectsDependency();

    // if no object is required, ignore the object for execution of model application
    if (this.sObjectDependency === "odNone")
        this.sObjectIds = '0';
    // test number of execution 
    if (this.sObjectDependency === "odASingleOne" || this.sObjectDependency === "odZeroToOne") {
        var iNbObjectsSelected = this.sObjectIds.split(";").length;
        if (iNbObjectsSelected > 50) {
            msgWarning(_("L'exécution d'Applications de Modèles dépendantes d'une seule Entité ne peut être réalisée sur plus de 50 Entités d'un coup."));
            aCallBackFunction({}, aDummyData);
        } else if (iNbObjectsSelected > 10) {
            msgYesNo(format(_("L'Application de modèle sélectionnée ne peut être exécutée que sur une seule Entité. Lancer son exécution pour chacune des '#1' Entités sélectionnées ? Cette action peut prendre un certain temps."), ["" + iNbObjectsSelected]), function (aValidate) {
                if (aValidate && self.bLaunchExecution)
                    self.executeModelApplication();
                else
                    aCallBackFunction({}, aDummyData);
            });
        } else if (this.bLaunchExecution)
            this.executeModelApplication();
    } else if (this.bLaunchExecution)
        this.executeModelApplication();
    
    return this;
};

CModelApplicationExecution.prototype.getModelApplicationObjectsDependency = function () {
    var self = this;

    J.ajax({
        url: self.sPathFileModelApplicationAjax,
        type: 'post',
        async: false,
        cache: false,
        dataType: 'html',
        data: {
            sFunctionName: "GetModelApplicationObjectsDependency",
            idModelApplication: self.idModelApplication
        },
        success: function (aResult) {
            var arrResults = aResult.split("|");
            if (arrResults[0] === sOk) {
                self.sObjectDependency = arrResults[1];
            } else {
                self.callback({}, self.dummyData);
                msgWarning(arrResults[0]);
            }
        }
    });
};

CModelApplicationExecution.prototype.executeModelApplication = function () {
    var self = this;

    J.ajax({
        url: self.sPathFileModelApplicationAjax,
        type: 'post',
        async: true,
        cache: false,
        dataType: 'html',
        data: {
            sFunctionName: "ExecuteModelApplication",
            idModelApplication: self.idModelApplication,
            sObjectIds: self.sObjectIds,
            idObjectType: self.idObjectType
        },
        success: function (aResult) {
            var arrResults = aResult.split("|");
            if (arrResults[0] === sOk) {
                self.treatModelApplicationExecution(arrResults[1], JSON.parse(arrResults[2]));
            } else {
                self.callback({}, self.dummyData);
                msgWarning(arrResults[0]);
            }
        }
    });
};

CModelApplicationExecution.prototype.treatModelApplicationExecution = function (aTypeModel, aResult) {
    this.sTypeModel = aTypeModel;
    this.jResult = aResult;
    if (this.sTypeModel == "WebModel") {
        // desactive progress layout if it's a web model
        if (this.desactiveProgressLayout)
            this.desactiveProgressLayout();
		// Parse Json result
        if (this.jResult.length > 0)
            this.executeWebModelApplication();
        else
            this.callback({}, this.dummyData);
    } else { // "ServerModel"
        // Execute the Callback function with the instructions to do
        this.callback(this.jResult, this.dummyData);
    }
}

CModelApplicationExecution.prototype.executeWebModelApplication = function () {
    var self = this,
        rCurrentMA = this.jResult[this.iNbOfExecution];
    // Create a div
    var sDivName = 'pageLoadMA_' + this.idModelApplication + ((rCurrentMA.idObj) ? '_' + rCurrentMA.idObj : '');
	if (J("#" + sDivName).length == 0)
		J('body').append('<div id="' + sDivName + '"></div>');
    // Prepare params to request
    var jParams = {
        divElement: sDivName,
        sIdsMaAndObj: this.idModelApplication + ((rCurrentMA.idObj) ? '_' + rCurrentMA.idObj : '')
    }
    if (rCurrentMA.sParameters) { // add inputs in param send by POST method
        var params = rCurrentMA.sParameters.split("&");
        params.forEach(function (aParam) {
            var pair = aParam.split('=');
            jParams[pair[0]] = pair[1];
        });
    }
    this.dummyData.divElement = sDivName;
    if (rCurrentMA.idObj) {
        jParams.idObject = rCurrentMA.idObj;
        this.dummyData.idObjectMA = rCurrentMA.idObj;
    }
    // for security (of some client)
    rCurrentMA.sRelativePath = rCurrentMA.sRelativePath.replace(/\\\\/g, "/");
    // Add ASP to div created !
    J('#' + sDivName).load(_url('/temp_resources/models/') + rCurrentMA.sRelativePath, jParams, function () {
        initCallBackMA[jParams.sIdsMaAndObj](function (aDirectOutputs, aMAOutputs, aDummyData) {
            self.cbAfterWebModelExecution(aDirectOutputs, aMAOutputs, aDummyData);
        }, self.dummyData);
    });
    this.iNbOfExecution++;
}

CModelApplicationExecution.prototype.cbAfterWebModelExecution = function (aDirectOutputs, aMAOutputs, aDummyData) {
    var self = this;

    if (!isAssigned(aDummyData)) {
        aDummyData = aMAOutputs;
        // Execute the Callback function with the instructions to do
        this.callback(aDirectOutputs, aDummyData);
    } else if (isAssigned(aMAOutputs)) { // Manage outputs with outputs specified in MA
        J.ajax({
            url: self.sPathFileModelApplicationAjax,
            async: false,
            cache: false,
            dataType: 'html',
            data: {
                sFunctionName: "ManageWebModelApplicationOutputs",
                idModelApplication: self.idModelApplication,
                idObject: (aDummyData.idObjectMA) ? aDummyData.idObjectMA : 0,
                outputsMA: aMAOutputs,
                outputsDirect: aDirectOutputs
            },
            success: function (aResult) {
                var arrResults = aResult.split("|");
                if (arrResults[0] === sOk) {
                    aMAOutputs = JSON.pasre(arrResults[1]);
                    // Execute the Callback function with the instructions to do
                    self.callback(aMAOutputs, aDummyData);
                } else {
                    self.callback({}, aDummyData);
                    msgError(arrResults[0]);
                }
            }
        });
    } else {
        this.callback(aDirectOutputs, aDummyData);
    }
    // check if we need to remove the div created
    if (J("#" + aDummyData.divElement).length) {
        J("#" + aDummyData.divElement).remove();
    }
    // check if need to execute others MA
    if (this.iNbOfExecution < this.jResult.length) {
        this.executeWebModelApplication();
    }
}