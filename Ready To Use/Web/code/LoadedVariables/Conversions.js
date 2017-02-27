var txConversions,
    conversionsUnit;

/**
 * @requires StringUtils
 * @requires CConversion
 */

function getConversion(aIdUnitSrc, aIdUnitDest) {
    var conversionUnit;
    conversionsUnit.find(function (aConversionUnit) {
        if (aConversionUnit.isRelevant(aIdUnitSrc, aIdUnitDest)) {
            conversionUnit = aConversionUnit;
            return true;
        }
    });
    return conversionUnit;
}

function convert(aIdUnitSrc, aIdUnitDest, aValue) {
    loadConversions();
    
    var conversionUnit = getConversion(aIdUnitSrc, aIdUnitDest);
    if (!conversionUnit) {
        //StringUtils.format
        throw format("eDev: no conversion between #1 to #2 ", [aIdUnitSrc, aIdUnitDest]);
    }
    else {
        return conversionUnit.execute(aIdUnitSrc, aIdUnitDest, aValue);
    }
}

function loadConversions() {
    if (isAssigned(conversionsUnit))
        return;

    conversionsUnit = [];

    if (!isAssigned(txConversions)) {
        J.ajax({
            url: sPathTxAspAjax,
            async: false,
            cache: false,
            dataType: 'json',
            data: {
                sFunctionName: "LoadConversions"
            },
            success: function (aResult) {
                txConversions = aResult;
            },
            error: function (result, status, error) { //bugs
                msgError(error);
            }
        });
    }

    txConversions.forEach(function (aConversion) {
        var conversionUnit = new CConversion(aConversion);
        conversionsUnit.push(conversionUnit);
    });

}