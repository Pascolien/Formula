"use strict";

angular.module("TxGenerator")
    .directive("module", function ($timeout,$compile, TxGeneratorFactory) {
    return {
        restrict: "EA",
        templateUrl: _url("/code/TxGenerator/components/module/module.html"),
        scope: {
            config: "="
        },
        controller: "ModuleCtrl",
        replace: true,
        link: function (scope, element, attrs) {
            var config = scope.config;

            scope._getParentLayout = function () {
                return TxGeneratorFactory.getLayout(config._parentLayoutId);
            };

            scope._getParentCell = function () {
                return scope._getParentLayout().layout.items[config._idCell];
            };

            scope._collapseParentCell = function () {
                var cell = scope._getParentCell();
                cell.showHeader();
                cell.collapse();
            }

            scope._expandParentCell = function () {
                var cell = scope._getParentCell();
                cell.hideHeader();
                cell.expand();
            }

            scope._hideParentCell = function() {
                var cell = scope._getParentCell();
                cell.collapse();
                J(cell).parents("tr:first").hide();
            }

            scope._showParentCell = function () {
                var cell = scope._getParentCell();
                cell.expand();
                J(cell).parents("tr:first").show();
            }
            // Ajout Jonathan
            scope._emptyCell = function () {
                var cell = scope._getParentCell();
                cell.detachObject(true);;
            }
            scope._replaceModule = function (aIdConfigSource, aIdConfigTarget) {
                // TO JONATHAN
                //Récupérer le module initial depuis la factory facto.getmodule
                var moduleToReplace = TxGeneratorFactory.getModule(aIdConfigSource);
                // Accéder à la cellule Module._getParentCell ==> attach html string ("")

                if (!moduleToReplace) throw new Error(_("Le module '" + aIdConfigSource + "' est introuvable"));

                J("#" + moduleToReplace._sParentIdDivAttach).empty();

                //Construire nouvelle config
                var configTarget = TxGeneratorFactory.getConfigById(aIdConfigTarget, true);

                if (!configTarget) throw new Error("...");

                configTarget._sParentIdDivAttach = moduleToReplace._sParentIdDivAttach;
                
                if(configTarget.config) {
                    TxGeneratorFactory.initConfiguration(configTarget, TxGeneratorFactory.configs);
                } else {
                    if (configTarget.module) {
                        configTarget.module._idCell = moduleToReplace._settings._idCell;
                        configTarget.module._parentLayoutId = moduleToReplace._settings._parentLayoutId;
                        configTarget.module.settings._sConfigId = aIdConfigTarget;
                        configTarget.module.settings._sParentIdDivAttach = configTarget._sParentIdDivAttach;
                    }
                    if (configTarget.internalDivs) {
                        configTarget.internalDivs.forEach(function (element) {
                            var e = J("<div id='" + element.id + "'></div>");
                            J("#" + configTarget._sParentIdDivAttach).append(e);
                        });
                    }
                }
                // ensuite détruire le module !
                TxGeneratorFactory.deleteModule(aIdConfigSource);

               //compile HTM
                var moduleHtml = document.createElement(configTarget.config ? 'pattern' : 'module');
                moduleHtml.setAttribute("config", configTarget.config ? "config.config" : "config.module");
                var moduleContent = angular.element(moduleHtml);
                var dummyScope = scope.$new();
                dummyScope.config = configTarget;
               

                //where do you want to place the new element?
                angular.element(document.getElementById(configTarget._sParentIdDivAttach)).append(moduleContent);
                
                var el = $compile(moduleContent)(dummyScope);
            }
            // Fin ajout
            $timeout(function() {
                if (scope.config.bHide) {
                    scope._hideParentCell();
                };
            });
        }
    };
});
