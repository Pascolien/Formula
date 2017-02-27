function getObject(aIdObject) {
    var obj;
    J.ajax({
        url: sPathTxAspAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "GetObject",
            idObject: aIdObject
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] === sOk) {
                obj = JSON.parse(results[1]);
            } else
                msgWarning(results[0]);
        }
    });
    return obj;
}

function getObjectsFromIds(aObjectsIds) {
    if (isEmpty(aObjectsIds))
        return [];

    var objects = [],
        sIdObjects = aObjectsIds.join(";");

    J.ajax({
        url: sPathFileComponentsAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "objectsFromIdsToJSON",
            sIdObjects: sIdObjects
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk)
                objects = isEmpty(results[1]) ? [] : JSON.parse(results[1]);
            else
                msgDevError(results[0], "TxUtils.js - getObjectsFromIds");
        }
    });
    return objects;
}

function getObject(aIdObject) {
    return getObjectsFromIds([aIdObject])[0];
};

function getObjectsFromSearchedValue(aIdOT, aValue, aIdAttribute, aIdParentFiltering, aSearchInLkdObjects, aSearchInData) {
    if (isEmpty(aIdOT) || isEmpty(aValue))
        return [];

    var objects = [];

    J.ajax({
        url: sPathFileComponentsAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "objectsFromValueToJSON",
            sValue: aValue,
            idOT: aIdOT,
            idAttribute: getValue(aIdAttribute,0),
            idParentFiltering: getValue(aIdParentFiltering, 0),
            bSearchInLkdObjects: getValue(aSearchInLkdObjects, true),
            bSearchInData: getValue(aSearchInData, true)
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk)
                objects = isEmpty(results[1]) ? [] : JSON.parse(results[1]);
            else
                msgWarning(results[0]);
        }
    });
    return objects;
}

function getObjectIdOT(aIdObject) {
    var idOT = 0;
    J.ajax({
        url: sPathTxAspAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "getObjectIdOT",
            idObject: aIdObject
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk)
                idOT = parseInt(results[1]);
            else
                msgWarning(results[0]);
        }
    });
    return idOT;
}

function getOT(aIdOT) {
    if (aIdOT < 1)
        return;
    var rOT;

    if (txOTs.length > 0)
        J.each(txOTs, function (aIndex, aOT) {
            if (aOT.ID == aIdOT) {
                rOT = aOT;
                return;
            }
        });

    if (!isAssigned(rOT)) {
        J.ajax({
            url: sPathTxAspAjax,
            async: false,
            cache: false,
            data: {
                sFunctionName: "GetOT",
                idOT: aIdOT
            },
            success: function (aResult) {
                var results = aResult.split("|");
                if (results[0] == sOk) {
                    rOT = JSON.parse(results[1]);
                    txOTs.push(rOT);
                } else
                    msgWarning(results[0]);
            }
        });
    }
    return rOT;
}

function getIconOT(aIdOT) {
    var rOT = getOT(aIdOT);
    return isAssigned(rOT) ? rOT.iIcon : 1;
}

function isListingOT(aIdOT) {
    var bResult = false,
        rOT = getOT(aIdOT);

    if (isAssigned(rOT))
        bResult = rOT.iType == C_Special_TE_Enumeration;

    return bResult;
}

function checkOTExist(aIdOT) {
    return inArrayFromField(txOTs, "ID", aIdOT);
}

function isIE() {
    if (navigator.appName == 'Microsoft Internet Explorer') return true;
    else if (navigator.userAgent.indexOf('Trident') != -1) return true;
    else return false;
}

function addObject(aIdOT, aMandatoryTags) {
    txASP.displayViewFromIdOT(aIdOT);
    txASP.addObject(aMandatoryTags);
}

function getDataSize(aData, aMaxSize) {
    aMaxSize = getValue(aMaxSize, 200);
    var iDataSize = 0;

    switch (aData.sType) {
        case "Object":
            iDataSize = getStringLength(aData.sVal);
            break;
        case 'ShortString':
            iDataSize = getStringLength(aData.sVal);
            break;
        case 'LongString':
            iDataSize = getStringLength(aData.sVal);
            break;
        case 'Url':
        case 'Url {}':
            var urls = aData.sVal.split("\n");

            urls.forEach(function (aUrl) {
                var iUrlSizeTmp = getStringLength(aUrl);

                if (iUrlSizeTmp > iDataSize)
                    iDataSize = iUrlSizeTmp;
            });

            break;
        case 'Email':
        case 'Email {}':
            var sMails = aData.sVal.replace(/<br>/g, ";");
            sMails = sMails.replace(/ /g, ";");
            var mails = sMails.split(";");
            mails.forEach(function (aMail) {
                var iMailSizeTmp = getStringLength(aMail);

                if (iMailSizeTmp > iDataSize)
                    iDataSize = iMailSizeTmp;
            });
            iDataSize += 10; //for btn send mail
            break;
        case 'Bool':
            iDataSize = getStringLength(getbValue(aData.abVal));
            break;
        case 'SingleValue':
            var sUnitName = getValue(aData.sUnitName, aData.Unit ? aData.Unit.sName : ""),
                sValue = qc(aData.fMin, getValue(aData.sUnitName, sUnitName), " ");

            iDataSize = getStringLength(sValue);
            break;
        case 'RangeOfValues':
            var sUnitName = getValue(aData.sUnitName, aData.Unit ? aData.Unit.sName : ""),
                sValue = _Fmt("de #1 à #2", [aData.fMin, qc(aData.fMax, sUnitName, " ")]);

            iDataSize = getStringLength(sValue);
            break;
        case 'Range+MeanValue':
            var sUnitName = getValue(aData.sUnitName, aData.Unit ? aData.Unit.sName : ""),
                sValue = _Fmt("de #1 à #2 - Moyenne : #3", [aData.fMin, qc(aData.fMax, sUnitName, " "), qc(aData.fMean, sUnitName, " ")]);

            iDataSize = getStringLength(sValue);
            break;
        case 'Date':
        case 'DateAndTime':
            iDataSize = getStringLength(floatToDateStr(aData.fVal));
            break;
        case 'File':
        case 'File {}':
            aData.Files.forEach(function (aFile) {
                var iFileSizeTmp = getStringLength(aFile.AF.sLeft_Ext);

                if (iFileSizeTmp > iDataSize)
                    iDataSize = iFileSizeTmp;
            });
            break;
        case 'Table':
            aData.Series.forEach(function (aSerie) {
                var sSerieTypeName = isAssigned(aSerie.SeriesTypes.sName) ? aSerie.SeriesTypes.sName + " " : "";
                sSerieTypeName = isAssigned(aSerie.SeriesTypes.jUnit) ? qc(sSerieTypeName, aSerie.SeriesTypes.jUnit.sName) + " " : sSerieTypeName;
                var sSerieName = isAssigned(aSerie.sName) ? aSerie.sName + " " : "",
                    sValue = sSerieTypeName + sSerieName + aSerie.Values.join(" ");

                var iSerieSizeTmp = getStringLength(sValue);

                if (iSerieSizeTmp > iDataSize)
                    iDataSize = iSerieSizeTmp;
            });
            break;
        case "InverseLink 1":
        case "InverseLink N":
        case "DirectLink 1":
        case "DirectLink N":
        case "Enumeration 1":
        case "Enumeration N":
        case "BidirectionalLink 1":
        case "BidirectionalLink N":
            aData.LkdObjects.forEach(function (aObj) {
                var iLinkSizeTmp = getStringLength(aObj.sName);

                if (iLinkSizeTmp > iDataSize)
                    iDataSize = iLinkSizeTmp;
            });
            break;
    }
    return getMaxValue(iDataSize, aMaxSize);
}

function checkObjectLocked(aIdObject) {
    var iLockingState;

    J.ajax({
        url: sPathTxAspAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "checkObjectLocked",
            idObject: aIdObject,
            iRWMode: 1
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk)
                iLockingState = parseInt(results[1]);
            else
                msgWarning(results[0]);
        }
    });

    return iLockingState;
}

function lockObject(aIdObject) {
    J.ajax({
        url: sPathTxAspAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "lockObject",
            idObject: aIdObject
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] != sOk)
                msgWarning(results[0]);
        }
    });
}

function unlockObject(aIdObject) {
    J.ajax({
        url: sPathTxAspAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "unlockObject",
            idObject: aIdObject
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] != sOk)
                msgWarning(results[0]);
        }
    });
}

function getTxDir() {
    var sTxDir = "";
    J.ajax({
        url: sPathTxWebLoginAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: 'getTxDir'
        },
        success: function (aData) {
            sTxDir = aData;
        }
    });
    return sTxDir;
}

function getWebDir() {
    var sWebDir = "";
    J.ajax({
        url: sPathTxWebLoginAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: 'getWebDir'
        },
        success: function (aData) {
            sWebDir = aData;
        }
    });
    return sWebDir;
}

function getTmpDir() {
    var sTmpDir = "";
    J.ajax({
        url: sPathTxWebLoginAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: 'getTmpDir'
        },
        success: function (aData) {
            sTmpDir = aData;
        }
    });
    return sTmpDir;
}

/*
    aSettings = {
        sPathInterface : path to the interface file. MANDATORY,
        sIdDivContainer : the div element id where the interface will be attached. the main div will be created by default if this parameter is empty,
        iUniqueId : all ids of the dom have to be unqiue
    }
*/
function loadInterface(aSettings, aCallBack, aDummyData) {
    function appendHtml() {
        var defer = J.Deferred();
        J.get(aSettings.sPathInterface, function (aData) {
            var htmlObject = changeHtmlId(J(aData));
            htmlObject.appendTo(J(document.body));
            defer.resolve();
        });
        return defer.promise();
    }

    function changeHtmlId(aHtmlObject) {
        var self = this;
        aHtmlObject.find("*").andSelf().each(function () {
            if (J(this).prop("id")) J(this).attr("id", J(this).attr("id") + aSettings.iUniqueId);
            if (J(this).prop("for")) J(this).attr("for", J(this).attr("for") + aSettings.iUniqueId);
        });
        return aHtmlObject;
    }

    aSettings.iUniqueId = getValue(aSettings.iUniqueId, getUniqueId());

    if (isEmpty(aSettings.sIdDivContainer)) {
        aSettings.sIdDivContainer = format("idDivMainContainer#1", [aSettings.iUniqueId]);
        J(document.body).append('<div id="' + aSettings.sIdDivContainer + '"></div>');
    }

    appendHtml().then(function () {
        if (aCallBack)
            aCallBack(aSettings, aDummyData);
    });
}