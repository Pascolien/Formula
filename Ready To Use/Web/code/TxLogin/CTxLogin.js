/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings. :  *** MANDATORY ***
        aSettings
 * @returns CTxWebLogin object.
 */
var sPathTxWebLoginAjax = _url("/code/TxLogin/TxLoginAjax.asp"),
    comboUser,
    comboLang;

function CTxLogin(aSettings, aCallBackFunction, aDummyData) {
    //declaration
    this.loginSettings = aSettings;
    this.dhxWins;
    this.dhxLoginPanel;
    this.loginForm;
    this.callBackFunction = aCallBackFunction;
    this.settings = aSettings;
    this.dummyData = aDummyData;
    this.bRedirect = false;
    var self = this;
    this.idOT = getValue(aSettings.idOT, 0);
    this.idView = getValue(aSettings.idView, 0);
    this.idObject = getValue(aSettings.idObject, 0);
    this.idTab = getValue(aSettings.idTab, 0);
    this.iMaxSizeUpload = 10;
    this.bManualConnectionProhibited = false;
    this.idLogin = 0;
    this.sDllConstructionMode = "release";

    //bind onBeforeUnload
    J(window).bind('beforeunload', function () {
        if (!self.bRedirect)
            new J.ajax({
                url: sPathStartUpAjax,
                async: false,
                cache: false,
                data: {
                    sFunctionName: "logout"
                }
            });
    });

    this.initialize();
}

CTxLogin.prototype.toString = function () {
    return "CTxLogin Object";
};

CTxLogin.prototype.initialize = function () {
    var self = this;
    var sTimezoneInformation = this.getTimeZoneInformation();
    var sBrowserDateFormat = this.getBrowserDateFormat();

    J.ajax({
        url: sPathTxWebLoginAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: 'InitializeAuthentication',
            bAllowAutomaticConnection: self.loginSettings.bAllowAutomaticConnection,
            sTimezoneInformation: sTimezoneInformation,
            sBrowserDateFormat: sBrowserDateFormat
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] === sOk) {
                //Two possible cases here: either no user connected, either a user connected but a warning message (cPasswordSoonExpirating).
                sMessage = results[2];
                sUserList = results[4];
                idLogin = results[6];
                iMaxSize = results[7];
                bProhibitManualConnection = results[8] == 1;
                self.sDllConstructionMode = results[9];

                switch (parseInt(results[1])) {
                    case cNoError:
                    case cPasswordSoonExpirating:
                        self.idLogin = idLogin;
                        self.iMaxSize = iMaxSize;
                        self.callBackFunction(self, sOk, sMessage, self.settings, self.dummyData);
                        break;
                    case cManualConnectionOnly:
                        self.iMaxSize = iMaxSize;
                        self.loginSettings.bDisplayUsersList = results[3];
                        self.loginSettings.jUsersList = (sUserList == sNull ? sUserList : JSON.parse(sUserList));   
                        self.loginSettings.jLanguageList = JSON.parse(results[5]);
                        self.displayWebLoginPanel();
                        break;
                    case cManualConnectionProhibited:
                        self.idLogin = idLogin;
                        self.iMaxSize = iMaxSize;
                        self.bManualConnectionProhibited = true;
                        self.callBackFunction(self, sOk, sMessage, self.settings, self.dummyData);
                        break;
                    case cErrorBindNotCorrect:
                        if (!isEmpty(sMessage))
                            msgWarning(sMessage);
                        self.iMaxSize = iMaxSize;
                        self.loginSettings.bDisplayUsersList = results[3];
                        self.loginSettings.jUsersList = (sUserList == sNull ? sUserList : JSON.parse(sUserList));
                        self.loginSettings.jLanguageList = JSON.parse(results[5]);
                        self.displayWebLoginPanel();
                        break;
					case cConeectionByDefaultNoStg:
                        msgWarning(results[2]);
                        break;
                    default:
                        //to Do 
                        if (!isEmpty(sMessage))
                            msgWarning(sMessage, function () {
                                if (!bProhibitManualConnection)
                                    self.displayWebLoginPanel();
                            });
                        break;
                }
                self.setSessionVariables();
            } else {
                msgError(results[0]);
            }
        },
        error: function (a, b, c) { //bugs
            // toDo: error handling a.responseText
            self.callBackFunction(self, sKo, c, self.settings, self.dummyData);
        }
    });
};

CTxLogin.prototype.displayWebLoginPanel = function () {
    var self = this;
    if (this.loginSettings.bDisplayUsersList === 'DisplayUsersList') {
        J('#idDivLoginLayoutPH').append("<div id='idDivSelectUsername'></div>");
        var iUserLength = this.loginSettings.jUsersList.length;
        var iHeight;
        if (iUserLength > 10) {
            iHeight = 200;
        }
        comboUser = new CComboBox({
            sIdDivCombo: "idDivSelectUsername",
            txObjects: this.loginSettings.jUsersList,
            iWidth: 272,
            iMaxExpandedHeight: iHeight
        });

    } else if (this.loginSettings.bDisplayUsersList === 'DisplayLoginEdit') {
        J('#idDivLoginLayoutPH').append('<input id="idUsername" type="text" name="user" placeholder="' + _("Nom d'utilisateur") + '">');
    } else {
        //no printing loginPanel
        msgWarning('Wrong configuration: cause might be the automatic authentication. \n Please contact TEEXMA admin.');
    }
    J('#idDivLoginLayoutPH').append("<input id='idPassword' type='password' name='pass' placeholder='" + _("Mot de passe") + "'>");
    J('#idDivLoginLayoutPH').append("<div id='selectBoxLanguage'></div>");
    //todo: build all combobox txJson

    var defaultLanguageOption = {
        ID: 0,
        sName: _("Par défaut") + " (" + this.loginSettings.sActiveLanguageCode + ")",
        sCode: this.loginSettings.sActiveLanguageCode
    };
    this.loginSettings.jLanguageList.splice(0, 0, defaultLanguageOption);

    J('#idDivLoginLayoutPH').append("");
    J('#idDivLoginLayoutPH').append("<div id='idDivLoginHelp' class='login-help'></div>");
    // toDo :add Forgot password fonctionality
    //J('#idDivLoginHelp').append("<a href='www.bassetti.fr'>www.bassetti.fr</a> • <a href='#'>Forgot Password</a>");
    var iLangLength = this.loginSettings.jLanguageList.length,
        iHeight;

    if (iLangLength > 10) {
        iHeight = 200;
    }
    comboLang = new CComboBox({
        sIdDivCombo: "selectBoxLanguage",
        txObjects: this.loginSettings.jLanguageList,
        iWidth: 272,
        iMaxExpandedHeight: iHeight
    });
};

CTxLogin.prototype.loadTEEXMA = function () {
    var self = this;
    J.ajax({
        url: sPathTxWebLoginAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: 'LoadTEEXMA'
        },
        success: function (aResult) {
            var results = aResult.split('|');
            if (results[0] === sOk) {
                var bUpdateLanguageCode = results[1],
                    sLanguageCode = results[2],
                    modelApplications = JSON.parse(results[4]),
                    sMessage = results[5];

                if (!isEmpty(sMessage))
                    msgWarning(sMessage);

                self.bRedirect = true;

                if (bUpdateLanguageCode !== "0")
                    self.updateLanguage(sLanguageCode);

                //ASP application model launching
                if (modelApplications.length > 0) {
                    for (i = 0; i < modelApplications.length; i++) {
                        var rSettings = { idModelApplication : modelApplications[i].ID };
                        var rDummyData = {};
                        new CModelApplicationExecution(rSettings, function (aResults, aDummyData) { self.callBackAfterAuthenticate(aResults, aDummyData) }, rDummyData);
                    }
                } else {
                    // TO DO redefine args
                    //MOUGIN
                    //redirect(location, _url("/default.asp"), [["idOT", self.idOT], ["idView", self.idView], ["idObject", self.idObject], ["idTab", self.idTab]]);
                }
            } else {
                msgWarning(results[0]);
            }
        },
        error: function (a, b, c) { //bugs
            msgWarning(c);
        }
    });
};

CTxLogin.prototype.callBackAfterAuthenticate = function (aResults, aDummyData) {
    if (aResults) {
        if (aResults.launchTEEXMA) {
            //MOUGIN
            //redirect(location, _url("/default.asp"), [["idOT", this.idOT], ["idView", this.idView], ["idObject", this.idObject], ["idTab", this.idTab]]);
        } else {
            msgWarning(_("Le démarrage de TEEXMA a échoué :") + aResults.msg);
        }
        msgWarning(_("Le déclencheur \"après authentification\" a relevé une erreur dans un modèle d\'application :") + aResults.msg);
    }
};

CTxLogin.prototype.updateLanguage = function (aLanguageCode) {
    J.getScript(_url("/code/lang/TEEXMA_" + aLanguageCode + ".js"));
    J.ajax({
        url: sPathTxWebLoginAjax,
        async: false,
        cache: false,
        dataType: 'html',
        data: {
            sFunctionName: 'UpdateLanguage',
            sLanguageCode: aLanguageCode
        }
    })
}

CTxLogin.prototype.setIdLogin = function (aIdLogin) {
    J.ajax({
        url: sPathTxWebLoginAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: 'setIdLogin',
            idLogin: aIdLogin
        }
    })
}

CTxLogin.prototype.setManualConnectionProhibited = function (aManualConnectionProhibited) {
    J.ajax({
        url: sPathTxWebLoginAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: 'setManualConnectionProhibited',
            bManualConnectionProhibited: aManualConnectionProhibited
        }
    })
}

CTxLogin.prototype.setMaxSizeUpload = function (aMaxSizeUpload) {
    new J.ajax({
        url: sPathTxWebLoginAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: 'setMaxSizeUpload',
            iMaxSizeUpload: aMaxSizeUpload
        }
    })
}

CTxLogin.prototype.setSessionVariables = function () {
    J.ajax({
        url: sPathTxWebLoginAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: 'setSessionVariables',
            iMaxSizeUpload: this.iMaxSizeUpload,
            bManualConnectionProhibited: this.bManualConnectionProhibited,
            idLogin: this.idLogin,
            sDllConstructionMode: this.sDllConstructionMode
        }
    })
}

CTxLogin.prototype.getTimeZoneInformation = function() {
    var dateObj = new Date();
    var rFullYear = dateObj.getFullYear();
    var firstDayOfYearDate = new Date(rFullYear, 0, 1, 13);
    var Offset = firstDayOfYearDate.getTimezoneOffset();
    var previousOffset = Offset;
    var decalage = false;

    for (i = 0; i < 365; i++) {
        firstDayOfYearDate.setDate(firstDayOfYearDate.getDate() + 1);
        Offset = firstDayOfYearDate.getTimezoneOffset();

        if (previousOffset < Offset) {
            decalage = true;
            summerChangeDate = previousDate;
            do {
                summerChangeDate.setHours(summerChangeDate.getHours() + 1);
                previousOffset = summerChangeDate.getTimezoneOffset();
            } while ((previousOffset < Offset))
            summerChangeDate.setHours(summerChangeDate.getHours() + 1);
        } else if (previousOffset > Offset) {
            decalage = true;
            winterChangeDate = previousDate;
            j = 0;
            do {
                j = j + 1;
                winterChangeDate.setHours(winterChangeDate.getHours() + j);
                previousOffset = winterChangeDate.getTimezoneOffset();
            } while ((previousOffset > Offset))
            winterChangeDate.setHours(winterChangeDate.getHours() - 1);
        }

        previousOffset = Offset;
        previousDate = new Date(firstDayOfYearDate);
    }
    if (decalage) {
        return (summerChangeDate.getMonth() + 1) + ';' + (Math.ceil(summerChangeDate.getDate() / 7)) + ';' + summerChangeDate.getDay() + ';' + summerChangeDate.getHours() + ';' + summerChangeDate.getTimezoneOffset() + ';' + (winterChangeDate.getMonth() + 1) + ';' + (Math.ceil(winterChangeDate.getDate() / 7)) + ';' + winterChangeDate.getDay() + ';' + winterChangeDate.getHours() + ';' + winterChangeDate.getTimezoneOffset();
    } else {
        return '0; 0; 0; 0; ' + Offset + '; 0; 0; 0; 0; 0';
    }
}

CTxLogin.prototype.getBrowserDateFormat = function() {
    //Create a known date string
    var y = new Date(2013, 9, 25);
    var lds = y.toLocaleDateString();

    //search for the position of the year, day, and month
    var yPosi = lds.search("2013");
    var dPosi = lds.search("25");
    var mPosi = lds.search("10");

    //Sometimes the month is displayed by the month name so guess where it is
    if (mPosi == -1) {
        mPosi = lds.search("9");
        if (mPosi == -1) {
            //if the year and day are not first then maybe month is first
            if (yPosi != 0 && dPosi != 0) {
                mPosi = 0;
            }
                //if year and day are not last then maybe month is last
            else if ((yPosi + 4 < lds.length) && (dPosi + 2 < lds.length)) {
                mPosi = Infinity;
            }
                //otherwist is in the middle
            else if (yPosi < dPosi) {
                mPosi = ((dPosi - yPosi) / 2) + yPosi;
            } else if (dPosi < yPosi) {
                mPosi = ((yPosi - dPosi) / 2) + dPosi;
            }
        }
    }

    var formatString = "";
    var order = [yPosi, dPosi, mPosi];
    order.sort(function (a, b) { return a - b });

    for (i = 0; i < order.length; i++) {
        if (order[i] == yPosi) {
            formatString += "YYYY/";
        } else if (order[i] == dPosi) {
            formatString += "DD/";
        } else if (order[i] == mPosi) {
            formatString += "MM/";
        }
    }

    return formatString.substring(0, formatString.length - 1);
}
