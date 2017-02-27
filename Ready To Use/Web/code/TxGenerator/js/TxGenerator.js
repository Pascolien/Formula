"use strict";

translate();

var txASP,
    arrOpenTab = []; // global variable to store new Tab open from teexma

jQuery.extend({
    getScript: function (url, callback) {
        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        script.src = url;

        // Handle Script loading
        {
            var done = false;

            // Attach handlers for all browsers
            script.onload = script.onreadystatechange = function () {
                if (!done && (!this.readyState ||
                    this.readyState == "loaded" || this.readyState == "complete")) {
                    done = true;
                    if (callback)
                        callback();

                    // Handle memory leak in IE
                    script.onload = script.onreadystatechange = null;
                } else {
                    //console.log("Big fail !");
                }
            };
        }

        head.appendChild(script);

        // We handle everything using the script element injection
        return undefined;
    }
});

var app = angular.module("TxGenerator", [
    "RecursionHelper",
    "ngRoute"
]);

function isHtml5Supported() {
    return history && history.pushState;
}

// Html5 not supported by the client browser
if (!isHtml5Supported()) {
    J(document).on("click", "a", function (e) {
        if (J(this).attr("href") === "#") e.preventDefault();
    });
}

app.config(["$routeProvider", "$locationProvider",
function ($routeProvider, $locationProvider) {

    if (isHtml5Supported()) $locationProvider.html5Mode(true);
    else $locationProvider.html5Mode(false).hashPrefix('!');

    var routeUrl = function (aUrl) {
        return isHtml5Supported() ? _url(aUrl) : aUrl;
    }
    // Système de routage
    $routeProvider
        .when(routeUrl("/login"), {
            templateUrl: "Login.asp",
            resolve: {
                "check": function (TxGeneratorFactory, $location) {   //function to be resolved, accessFac and $location Injected
                    if (TxGeneratorFactory.idUser !== -1) {    //check if the user has permission -- This happens before the page loads
                        $location.path(routeUrl("/teexma")).replace();
                    }
                }
            }
        })
        .when(routeUrl("/teexma"), {
            templateUrl: "teexma.asp",
            resolve: {
                "check": function (TxGeneratorFactory, $location, $routeParams) {   //function to be resolved, accessFac and $location Injected
                    TxGeneratorFactory.idObject = $routeParams.idObject || getURLParameter("idObject");
                    TxGeneratorFactory.idFormTab = $routeParams.idTab || getURLParameter("idTab");
                    $location.url($location.path());
                    if (TxGeneratorFactory.idUser === -1) {
                        //check if the user has permission -- This happens before the page loads
                        $location.path(routeUrl("/login")).replace();
                    } 
                }
            }
        })
        .otherwise({
            resolve: {
                "check": function (TxGeneratorFactory, $location) {   //function to be resolved, accessFac and $location Injected
                    if (TxGeneratorFactory.idUser === -1 ) {    //check if the user has permission -- This happens before the page loads
                        $location.path(routeUrl("/login")).replace();
                    }
                }
            }
        });
    }
]);

app.controller("UrlCtrl", ["$scope", "$routeParams", "$location", "$http", "TxGeneratorFactory",
    function ($scope, $routeParams, $location, $http, TxGeneratorFactory) {
        $scope.txConnect = function () {
            $scope.isDisabledLoginBtn = true;

            var sLogin;
            if (comboUser) {
                var iTxId = comboUser.getSelectedValue();
                sLogin = comboUser.getOption(iTxId).sLogin.replace("\\\\","\\");
            } else if (J("#idUsername")) {
                sLogin = J("#idUsername").val();
            } else {
                msgWarning(_("Ce login n'est pas autorisé. Veuillez contacter votre administrateur TEEXMA."));
            }

            var sPassword = J("#idPassword").val();
            var idLanguage;
            var sLang;
            if (comboLang) {
                idLanguage = comboLang.getSelectedValue();
                sLang = comboLang.getOption(idLanguage).sCode;
            }

            if (sLang) TxStart.txLogin.updateLanguage(sLang);

            if (!sPassword && this.sDllConstructionMode == "release") {
                msgWarning(_("Veuillez renseigner le champ \"Mot de passe\"."));
                return;
            } 
            $http({
                method: "POST",
                url: _url("/code/TxLogin/TxLoginAjax.asp"),
                params: {
                    sFunctionName: "Login",
                    sLogin: sLogin,
                    sPassword: sPassword,
                    idLanguage: idLanguage,
                    sLang: sLang
                }
            }).success(function (data) {
                //Création d'un visuel de chargement de la structure.
                var arrResult = data.split("|");
                if (arrResult[0] === sOk) {
                    TxStart.txLogin.idLogin = parseInt(arrResult[2]);
                    TxStart.txLogin.callBackFunction(TxStart.txLogin, sOk, arrResult[1]);
                } else {
                    var settings = {
                        iError: arrResult[1]
                    };
                    TxStart.txLogin.callBackFunction(TxStart.txLogin, sKo, arrResult[0], settings);
                }
            }).error(function (a, b, c) { //bugs
                msgWarning(c);
            }).finally(function () {
                $scope.isDisabledLoginBtn = false;
            });
        }
    }
]);

app.controller("InitCtrl", function ($rootScope, $timeout ,TxGeneratorFactory, $location) {
    var cssResources; // TO DO
    var jsResources; // TO DO
    $rootScope.configLoaded = $rootScope.configLoaded || false;
    if ($rootScope.configLoaded) return;
    $rootScope.loading = true;

    try {
        txASP = new CTxASP({
            idOT: getValue(TxGeneratorFactory.idOT, 0),
            idView: getValue(TxGeneratorFactory.idView, 0),
            idObject: getValue(TxGeneratorFactory.idObject, 0),
            idTab: getValue(TxGeneratorFactory.idFormTab, 0)
        });
    } catch (e) {
        $rootScope.error = "An error occured while loading TEEXMA :\n\n" + e.stack;
        return;
    }

    txASP.bUpdateDataStorage = true;

    // Getting generator configuration
    TxGeneratorFactory.getConfig().then(function (data) {
        if (data.resources.css) {
            data.resources.css = data.resources.css.map(function (css) {
                return _url(css + "?v=" + iRevision);
            });
        }
        if (data.resources.js) {
            data.resources.js = data.resources.js.map(function (js) {
                return _url(js + "?v=" + iRevision);
            });
        }
        $rootScope.resources = data.resources;
        $rootScope.config = data.config;
        if ($rootScope.resources.js) {
            getScripts($rootScope.resources.js, function () {
                $rootScope.configLoaded = true;
                $rootScope.$apply();
                initInterface();
                initHistoryManager();
            });
        }
    }, function (data) {
        $rootScope.error = data;
    });

    function initInterface() {
        var expectedModulesNumber = TxGeneratorFactory.expectedModulesNumber;
        $rootScope.$watch(function () { return TxGeneratorFactory.loadedModulesNumber }, function (newValue, oldValue) {
            if (newValue === expectedModulesNumber) {
                $rootScope.loading = false;
            }
        });
    }

    // Managing browser history
    function initHistoryManager() {

        $rootScope.dataStorage = TxGeneratorFactory.dataStorage;
        txASP.browsingHistory = TxGeneratorFactory.history;
        $rootScope.dataStorage[txASP.browsingHistory.idOt] = { value: txASP.idOT };
        var state = {};
        var sTitle = J(document).find("title").text();

        angular.forEach(txASP.browsingHistory, function (value, key) {
            $rootScope.$watchCollection("dataStorage['" + value + "']", function (newValue, oldValue) {
                if (!newValue) return;
                newValue = newValue.value;
                oldValue = oldValue ? oldValue.value : oldValue;
                if (!newValue) return;
                var sName = sTitle;
                if (key === "txObject") {
                    if (newValue.length !== 1) return;
                    sName = newValue[0].sName;
                    if (history.state) {
                        if (history.state.txObject && newValue[0].ID === history.state.txObject[0].ID) {
                            document.title = sTitle + " - " + sName;
                            return;
                        }
                    }
                    if (oldValue && oldValue.length > 0) {
                        if (newValue[0].ID === oldValue[0].ID) return;
                    }
                }
                if ((newValue === oldValue) || state === {}) return;
                var idOTStorage = $rootScope.dataStorage[txASP.browsingHistory.idOt];
                state.idOt = idOTStorage ? idOTStorage.value : idOTStorage;
                state.txObject = (key === "txObject") ? newValue : [];

                if (txASP.bUpdateDataStorage === true) {
                    history.pushState(state, sTitle + " - " + sName, $location.absUrl());
                    document.title = sTitle + " - " + sName;
                } else {
                    txASP.bUpdateDataStorage = true;
                }
            }, true);
        });

        window.onpopstate = function (event) {
            var state = event.state;
            if (!state) {
                window.location.assign(_url("/"));
                return;
            }

            if (state.txObject) {
                setTimeout(function () {
                    if (state.txObject.length > 1) return;
                    $rootScope.dataStorage[txASP.browsingHistory.txObject] = { value: state.txObject };
                    $rootScope.$apply();
                });
            }
        }
    }

    function getScripts(aScripts, aCallback) {
        if (aScripts.length === 0) {
            if (aCallback) {
                aCallback();
            }
            return;
        }
        J.getScript(aScripts[0], function () {
            aScripts.shift();
            getScripts(aScripts, aCallback);
        });
    }

    function refresherReloader() {
        clearInterval(interval);
        msgWarning(format(_("Vous êtes inactif depuis #1 minute(s), votre session a expiré. Veuillez-vous reconnecter."), [nRefreshFrequency]), function () {
            window.location.assign(_url("/"));
        });
    }

    var interval = setInterval(refresherReloader, nRefreshFrequency * 60000);

    J.ajaxSetup({
        beforeSend: function () {
            clearInterval(interval);
            interval = setInterval(refresherReloader, nRefreshFrequency * 60000);
        }
    });
});

J(function () {
    J(window).bind("beforeunload", function () {
        closeAllWindow();
        J.ajax({
            url: _url("/code/StartupAjax.asp"),
            async: false,
            cache: false,
            data: {
                sFunctionName: "logout"
            }
        });
    });
});