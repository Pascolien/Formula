// JavaScript Document

/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.idObject *** mandatory ***
        aCallBack
        aDummyData
 * @returns CTxDuplicatePartially object.
 */

var sUrlTxDuplicatePartiallyAjax = _url('/code/Components/ComponentsAjax.asp');

function CTxDuplicatePartially(aSettings, aCallBack, aDummyData) {
    checkMandatorySettings(aSettings, ["idObject", "idOT"]);
   
    var idObject = aSettings.idObject,
        idOT = aSettings.idOT,
        sObjectName = aSettings.sObjectName,
        iIcon = aSettings.iIcon,
        bCheckAll = getValue(aSettings.bCheckAll, false);
        self = this,
        sAttributesForbiden = "",
        disabledIds = [],
        mainDiv = J("<div id='idDivMainTxDuplicatePartially'></div>"),
        sHtml = '<div id="idDivContainerTxDuplicatePartially">'+
                    '<label>'+_("Entité en cours :")+'</label>'+
                    '<input type="text" id="idTextObjectNameTxDuplicatePartially" disabled="disabled" />' +
	                '<div id="idDivAttributesTxDuplicatePartially">' +
		                '<label>'+_("Caractéristiques disponibles :")+'</label>'+
		                '<div id="idDivTreeTxDuplicatePartially"></div>' +
		                '<div id="idDivToolbarTxDuplicatePartially"></div>' +
	                '</div>'+
                '</div>'+
	            '<div id="idDivButtonBarTxDuplicatePartially"></div>';
    mainDiv.append(sHtml);
    J(document.body).append(mainDiv);

    this.wDuplicate = new CWindow({
        sName: "wDuplicate",
        iWidth: 410,
        iHeight: 470,
        bDenyResize: true,
        bHidePark: true,
        sIcon: format('temp_resources/theme/img/png/#1.png', [iIcon]),
        sHeader: _("Duplication"),
        sObjectAttached: "idDivMainTxDuplicatePartially"
    });

    //get TxDuplication info
    J.ajax({
        url: sUrlTxDuplicatePartiallyAjax,
        cache: false,
        async: false,
        data: {
            sFunctionName: 'wGetTxDuplicationInfo',
            idOT: idOT
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                sAttributesForbiden = results[1];
                sMessage = results[2];
            } else
                parent.msgError(results[0]);
        }
    });

    //init ButtonBar
    this.buttonBar = new CButtonBar({
        btns: [
            { iBtnType: btValidate, onClick: function () { aCallBack(self.tree.attributeSet.Levels.map(function(aLevel) {
                return aLevel.ID;
            }).filter(function (aLevel) {
                return disabledIds.indexOf(aLevel) == -1;
            }).join(";")); self.wDuplicate.close(); } },
            { iBtnType: btCancel, onClick: function () { self.wDuplicate.close(); } }
        ],
        sIdDivParent: 'idDivButtonBarTxDuplicatePartially'
    });

    //init tree attributes
    if (!isEmpty(sAttributesForbiden)) {
        attributes = JSON.parse(sAttributesForbiden);
        attributes.forEach(function (aNode) {
            disabledIds.push(aNode.ID);
        });
    }

    this.tree = new CTreeAttribute({
        idOT: idOT,
        sIdDivTree: "idDivTreeTxDuplicatePartially",
        sIdDivToolbar: "idDivToolbarTxDuplicatePartially",
        bFolderCheckable: false,
        bRecursiveLink: false,
        bDisplayAssociativeOT: false,
        bAllowCheckAssociative: false,
        bInheritedAttributeCheckable : false,
        bEnableContextMenu: true,
        sCheckType: ctCheckboxes,
        sIdsDisabled: disabledIds.join(";")
    });
    setTimeout(function () {
        if (bCheckAll)
            self.tree.checkAll();
    });

    //set inputs
    J("#idTextObjectNameTxDuplicatePartially").val(sObjectName);

    return this;
}

CTxDuplicatePartially.prototype.toString = function() {
    return "CTxDuplicatePartially";
}
