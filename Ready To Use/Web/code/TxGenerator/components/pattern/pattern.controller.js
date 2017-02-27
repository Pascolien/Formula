"use strict";

angular.module("TxGenerator").
    controller("PatternCtrl", function ($scope, $rootScope, $timeout, TxGeneratorFactory) {
        $timeout(function () {
            var config = {};
            angular.copy($scope.config, config);
            if (config.bAttachToObject) {
                config.parentObject = TxGeneratorFactory.getLayout(config._parentLayoutId).layout.items[config._idCell];
            }
            config.onExpand = function (aIdCell) {
                cLayout.layout.cells(aIdCell).hideHeader();
            }
            var cLayout = new CLayout(config);

            cLayout.progressOn();
            TxGeneratorFactory.registerLayout(config.sParent, cLayout);
            $timeout(function () {
                cLayout.progressOff();
                $scope.rendered = true;
            });
        });
    });