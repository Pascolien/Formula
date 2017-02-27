/** 
    *@author: <a href="mailto:dev@bassetti.fr">Dev</a>
   
    *@InitializeTEEXMA : 
    *@param: aSetting['bAllowedAutomaticConnection'] false in case of logout to switching session. 
    *@return: results
    * [0]:
    * [1]: 
    * [2]: sMessage {C_NO_ERROR, C_WARNING_Password_Soon_Expiring} *** MANDATORY ***
    * [3]: sDisplayUsersList {DisplayUsersList, DisplayLoginEdit, ''}
    * [4]: users or '';
    * [5]: languages or '';
    * [6]: sActiveLanguageCode;
    * [7]: sAM ???  
    */

var sPathStartUpAjax = _url("/code/StartupAjax.asp");
function CStartTEEXMA(aSettings) {
    //initialization of sessions var 
    var sessionSettings = aSettings;
    this.txLogin;
    this.bRedirect = false;
    var bAllowAutomaticConnection = true;
    var self = this;

    if (!isEmpty(aSettings.bForceManualConnexion)) {
        bAllowAutomaticConnection = !aSettings.bForceManualConnexion;
    }

    J.ajax({
        url: sPathStartUpAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: 'Init'
        },
        success: function (aResult) {
            var results = aResult.split('|');
            sessionSettings.sActiveLanguageCode = results[0];
            sessionSettings.bAllowAutomaticConnection = bAllowAutomaticConnection; //when starting teexma, automatic connection is allowed.
            self.txLogin = new CTxLogin(sessionSettings, function (txLogin, aState, aMessage, aSettings, aDummyData) { self.handleConnectionState(txLogin, aState, aMessage, aSettings, aDummyData) });
        },
        error: function (a, b, c) { //bugs
            self.handleConnectionState(sKo, c);
        }
    });
}

CStartTEEXMA.prototype.toString = function () {
    return "CStartTEEXMA Object"
}

CStartTEEXMA.prototype.handleConnectionState = function (aTxLogin, aState, aMessage, aSettings, aDummyData) {
    var self = this;
    if (aState == "ok") {
        if (!isEmpty(aMessage) && aMessage !== "<null>") {
            msgWarning(aMessage);
        }
        if (!(aTxLogin.idLogin && aTxLogin.idLogin !== -1)) return;
        J('#idDivLoginLayout').remove();
        aTxLogin.loadTEEXMA();
        var $injector = J('html').injector();
        $injector.invoke(function ($location, $timeout, TxGeneratorFactory) {
            $timeout(function () {
                TxGeneratorFactory.idUser = aTxLogin.idLogin;
                $location.path(TxGeneratorFactory._url("/teexma")).replace();
            });
        });
        
    } else {
        if (parseInt(aSettings.iError) === cErrorBindNotCorrect) {
            msgWarning(aMessage, function () {
                if (J('#idUsername'))
                    J('#idUsername').select();
                if (J('#idPassword'))
                    J('#idPassword').select();
            });
        } else {
            msgWarning(aMessage, redirect, _url('/')); //TU: never use ?
        }
    }

    function redirect(aPath) {
        // location.href = aPath;
    }
}

