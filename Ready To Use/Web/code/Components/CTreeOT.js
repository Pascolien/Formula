/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        <aSettings from CTree>
        aSettings.bDisplayAssociatives
        aSettings.bDisplayListing
 * @returns CTreeOT object.
 */

var CTreeOT = function (aSettings) {
    bDisplayAssociatives = (aSettings.bDisplayAssociatives == null) ? false : aSettings.bDisplayAssociatives;
    bDisplayListing = (aSettings.bDisplayListing == null) ? false : aSettings.bDisplayListing;

    J.ajax({
        url: sPathFileComponentsAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "OTsToJSON",
            bDisplayAssociatives: bDisplayAssociatives,
            bDisplayListing: bDisplayListing
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                aSettings.sTxObjects = results[1];
                CTreeOT.prototype.initialize(aSettings);
            } else
                msgDevError(results[0], "CTreeOT.OTsToJSON");
        }
    });
};

//inheritage
CTreeOT.prototype = createObject(CTree.prototype);;
CTreeOT.prototype.constructor = CTreeOT; // Otherwise instances of CTreeOT would have a constructor of CComboBox