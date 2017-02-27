"use strict";

angular.module("TxGenerator")
    .directive("pattern", function (RecursionHelper) {
        return {
  	        restrict: "A",
  	        templateUrl: _url("/code/TxGenerator/components/pattern/pattern.html"),
            scope: {
                config: "="
            },
            priority: 1,
            controller: "PatternCtrl",
            compile: function (element) {
                return RecursionHelper.compile(element, function (scope, iElement, iAttrs, controller, transcludeFn) {
                    // Define your normal link function here.
                    // Alternative: instead of passing a function,
                    // you can also pass an object with 
                    // a 'pre'- and 'post'-link function.
                });
            }
        };
    });