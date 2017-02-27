"use strict";

angular.module("TxGenerator").
    controller("ModuleCtrl", function ($scope, $timeout, TxGeneratorFactory) {
        $timeout(function () {
            $scope.dataStorage = TxGeneratorFactory.dataStorage;
            var config = $scope.config;
            var settings = config.settings;

            settings._idCell = config._idCell;
            settings._parentLayoutId = config._parentLayoutId;
            settings._getParentCell = function() {
                return TxGeneratorFactory.getLayout(config._parentLayoutId).layout.items[config._idCell];
            }
            var sModuleName = config.sType;
            var module = TxGeneratorFactory.createModule(sModuleName, settings);
            module._settings = settings;

            module._getParentLayout = $scope._getParentLayout;

            module._getParentCell = $scope._getParentCell;

            module._replaceModule = $scope._replaceModule;

            module._collapseParentCell = $scope._collapseParentCell;

            module._expandParentCell = $scope._expandParentCell;

            module._showParentCell = $scope._showParentCell;

            module._hideParentCell = $scope._hideParentCell;

            module._emptyCell = $scope._emptyCell;

            module._changeDataStorage = function (aKeys, aValue) {
                $timeout(function() {
                    aKeys.forEach(function(element) {
                        $scope.dataStorage[element] = { value: aValue, module: module };
                    });
                });
            }

            var propertiesToWatch = settings["watch"];
            if (!propertiesToWatch) return;
            var events = module.functionsToExecute;

            if (!events)
                throw new Error(_("La collection functionToExecute n'est pas definie dans le module " + sModuleName));

            module.listeners = [];
            module.__values = {};

            $timeout(function () {
                TxGeneratorFactory.moduleLoaded();
                var iWatchCount = 0;

                angular.forEach(propertiesToWatch, function(element) {
                    var sName = element["sName"];
                    module.__values[sName] = module.__values[sName] || {};
                    var listener = $scope.$watchCollection("dataStorage['" + sName + "']", function (newValue, oldValue) {
                        iWatchCount++;
                        if (iWatchCount > propertiesToWatch.length) module._isLoaded = true;
                        if (!TxGeneratorFactory.getModule(module._settings._sConfigId)) return;

                        if (!newValue) return;

                        if (newValue.module === module) {
                            module.__values[sName] = newValue.value;
                            return;
                        }

                        if (JSON.stringify(newValue.value) === JSON.stringify(module.__values[sName])) return;

                        var value = $scope.dataStorage[sName].value;

                        if (!value) return;

                        module.__values[sName] = newValue.value;
                        
                        if (element.bPersistent === false && iWatchCount <= propertiesToWatch.length) return;

                        var methods = events[element.sType];
                        if (!methods)
                            throw _("La clé " + element.sType + " n'est pas definie dans la collection functionsToExecute du module " + sModuleName);

                        angular.forEach(methods, function(val) {
                            if (!module[val])
                                throw _(sModuleName + "." + val + " n'est pas une fonction");
                            module[val](value);
                        });

                    }, true);
                    module.listeners.push(listener);
                });
            });
        });
    });