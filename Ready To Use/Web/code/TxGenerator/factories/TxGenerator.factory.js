"use stric";

var app = angular.module("TxGenerator");

app.factory("TxGeneratorFactory", function ($q, $http) {
	var factory = {
		"cells": {},
		"layouts": {},
		"modules": {},
		"idUser": -1,
		"loadedModulesNumber": 0,
        "expectedModulesNumber": 0
	};

	factory.initConfiguration = function(aConfig, aConfigs) {
	    if (!aConfig.cellsSettings) return;
	    aConfig.cellsSettings.forEach(function (element, index) {
	        // DEBUT Jonathan
	        var bFound = aConfigs.some(function(config){
	            return config.configId === element.sConfigId;
	        });
	        if (!bFound)
	            throw msgDevError(_("La configuration \"" + element.module.sType + "\" n'est pas définie"));

	        var configToCopy = aConfigs.find(function (config) {
	            return config.configId === element.sConfigId;
	        });
	        element = J.extend(true, element, configToCopy);
	        // FIN Jonathan

		    if (element.module) {
				if (!element.module.settings) {
					throw msgDevError(_("Un module du type \"" + element.module.sType + "\" n'a pas de propriété \"settings\""));
				}
				element.module._parentLayoutId = aConfig.sParent;
				element.module._idCell = index;
				element.module.settings._sConfigId = element.sConfigId;
				element.module.settings._sParentIdDivAttach = element.sIdDivAttach || element.sParent;
			    factory.expectedModulesNumber++;
			}
			if (element.config) {
				element.config.sParent = element.sIdDivAttach;
				element.config._parentLayoutId = aConfig.sParent;
				element.config._idCell = index;
				element.config.bAttachToObject = true;
				delete element.sIdDivAttach;
				factory.initConfiguration(element.config, aConfigs);
			}
		});
	}

	factory.getConfig = function () {
		var deferred = $q.defer();
		$http.get(_url("/code/TxGenerator/config.js"))
            .success(function (data, status) {
                factory.initConfiguration(data.config, data.configs);
                factory.configs = data.configs;
            	factory.history = data.dataStorage.history;
            	factory.dataStorage = data.dataStorage || {};
            	deferred.resolve(data);
            }).error(function (data, status, res) {
            	deferred.reject(data);
            });
		return deferred.promise;
	};

	factory.getConfigById = function(aConfigId, aClone) {
	    var c = factory.configs.find(function (config) {
	        return config.configId === aConfigId;
	    });
	    return aClone ? angular.copy(c) : c;
	}

	factory.createModule = function (aModuleClass, aSettings) {
		var constructor = window[aModuleClass];
		if (!constructor) {
			throw new Error(_("Le module " + aModuleClass + " est introuvable"));
		}

		var module = new window[aModuleClass](aSettings);
		module._sParentIdDivAttach = aSettings._sParentIdDivAttach;
		factory.registerModule(aSettings._sConfigId, module);

		return module;
	}

	factory.registerModule = function (aId, aModule) {
	    factory.modules[aId] = aModule;
	}

	factory.getModule = function (aId) {
	    return factory.modules[aId];
	}

	factory.deleteModule = function (aId) {
	    var module = factory.modules[aId];
	    if (module) {
	        if (module.listeners) {
	            module.listeners.forEach(function(listener) {
	                listener();
	            });
	        }
	    }
	    delete factory.modules[aId];
	}

	factory.registerLayout = function (aId, aLayout) {
        // Partage du layout principal
	    if (Object.keys(factory.layouts).length === 0) {
	        factory.mainLayout = aLayout;
	        txASP.mainLayout = aLayout;
	    }
	    factory.layouts[aId] = aLayout;
	}

	factory.getLayout = function (aId) {
		return factory.layouts[aId];
	}

    factory.getMainLayout = function() {
        return factory.mainLayout;
    }

	factory.moduleLoaded = function () {
	    factory.loadedModulesNumber++;
	}

	factory.isHtlm5Supported = function () {
	    return history && history.pushState;
	}

	factory._url = function (aUrl) {
	    return factory.isHtlm5Supported() ? _url(aUrl) : aUrl;
	}

	return factory;
});