// JavaScript Document

/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.idObject *** mandatory ***
        aCallBack
        aDummyData
 * @returns CTxCompare object.
 */

var sUrlTxCompareAjax = _url('/code/Components/ComponentsAjax.asp');

function CTxCompare(aSettings, aCallBack, aDummyData) {
    checkMandatorySettings(aSettings, ["idObject", "idOT"]);
   
    var idObject = aSettings.idObject,
        idOT = aSettings.idOT,
        sObjectName = aSettings.sObjectName,
        idAdvancedComparison = getValue(aSettings.idAdvancedComparison,0),
        iIcon = aSettings.iIcon,
        self = this,
        sIdAttributesForbiden = "",
        sIdAttributesChecked = "",
        mainDiv = J("<div id='idDivMainTxCompare'></div>"),
        sHtml = '<div id="idDivContainerTxCompare">'+
                    '<label>'+_("Entité en cours :")+'</label>'+
                    '<input type="text" id="idTextObjectNameTxCompare" disabled="disabled" />' +
	                '<div id="idDivAttributesTxCompare">' +
		                '<label>'+_("Caractéristiques disponibles :")+'</label>'+
		                '<div id="idDivTreeTxCompare"></div>' +
		                '<div id="idDivToolbarTxCompare"></div>' +
	                '</div>'+
                '</div>'+
	            '<div id="idDivButtonBar"></div>';

    mainDiv.append(sHtml);
    J(document.body).append(mainDiv);

    this.wCompare = new CWindow({
        sName: "wCompare",
        iWidth: 410,
        iHeight: 470,
        bDenyResize: true,
        bHidePark: true,
        sIcon: format('temp_resources/theme/img/png/#1.png', [iIcon]),
        sHeader: _("Nouveau cahier des charges de comparaison"),
        sObjectAttached: "idDivMainTxCompare"
    });

    //get TxDuplication info
    J.ajax({
        url: sUrlTxCompareAjax,
        cache: false,
        async: false,
        data: {
            sFunctionName: 'wGetTxCompareInfo',
            idOT: idOT,
            idAdvancedComparison: idAdvancedComparison,
            idObject: idObject
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                sIdAttributesForbiden = results[1];
                sIdAttributesChecked = results[2];
            } else
                parent.msgError(results[0]);
        }
    });

    //init ButtonBar
    this.buttonBar = new CButtonBar({
        btns: [
            {
                sId: "idBtnValidateCompare", iBtnType: btValidate, onClick: function () {
                    var sIdsAtt = self.tree.getCheckedIds(),
                        idRequirementList = 0;

                    J.ajax({
                        url: sPathTxAspAjax,
                        async: false,
                        cache: false,
                        data: {
                            sFunctionName: "WriteComparisonRequirementList",
                            sIdsAtt: sIdsAtt,
                            idObject: idObject,
                            idAdvancedComparison: idAdvancedComparison
                        },
                        success: function (aResult) {
                            var results = aResult.split("|");

                            if (results[0] == sOk){
                                idRequirementList = parseInt(results[1]);

                                if (aCallBack)
                                    aCallBack(self.tree.getCheckedIds());

                                Launch_MCS(idOT, idRequirementList, "resultats");

                                self.wCompare.close();
                            } else
                                msgWarning(results[0]);
                        }
                    });

                    
                }
            },
            { iBtnType: btCancel, onClick: function () { self.wCompare.close();} }
        ],
        sIdDivParent: 'idDivButtonBar'
    });

    //init tree attributes
    this.tree = new CTreeAttribute({
        idOT: idOT,
        sIdDivTree: "idDivTreeTxCompare",
        sIdDivToolbar: "idDivToolbarTxCompare",
        bFolderCheckable: false,
        bRecursiveLink: false,
        bDisplayAssociativeOT: false,
        bAllowCheckAssociative: false,
        bEnableContextMenu: true,
        sCheckType: ctCheckboxes,
        sIdsChecked : sIdAttributesChecked,
        sIdsDisabled: sIdAttributesForbiden,
        onCheck: function () { self.checkValidForm(); },
        onCheckAll: function () { self.checkValidForm(); },
        onUnCheckAll: function () { self.checkValidForm(); },
        onXLE: function () { self.tree.checkAll(); }
    });

    //set inputs
    J("#idTextObjectNameTxCompare").val(sObjectName);

    return this;
}

CTxCompare.prototype.checkValidForm = function () {
    var sIdsAttributes = this.tree.getCheckedIds();

    this.buttonBar.setButtonEnable("idBtnValidateCompare", !isEmpty(sIdsAttributes));
}

CTxCompare.prototype.toString = function() {
    return "CTxCompare";
}
