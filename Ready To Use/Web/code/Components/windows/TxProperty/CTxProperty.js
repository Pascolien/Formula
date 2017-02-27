// JavaScript Document

/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.idObject *** mandatory ***
        aCallBack
        aDummyData
 * @returns CTxProperty object.
 */

var sUrlTxPropertyAjax = _url('/code/Components/ComponentsAjax.asp');

function CTxProperty(aSettings, aCallBack, aDummyData) {
    checkMandatorySettings(aSettings, ["idObject"]);

    var sObjectName = aSettings.sObjectName,
        idObject = aSettings.idObject,
        iIcon = aSettings.iIcon,
        sOwnerName = "",
        sCreationDate = "",
        sLocation = "",
        sType = "",
        iNbChildren = 0,
        bShowIdObject = false,
        mainDiv = J("<div id='idDivMainTxProperty'></div>"),
        sHtml = '<div id="idDivTabbarTxProperty"></div>' +
                '<div id="idDivTxProperty">'+
                    '<div style="margin-bottom:6px;">' +
                        '<img src="#" id="idImgObjectTxProperty" />' +
                        '<input id="idTextObjectNameTxProperty" type="text" disabled="disabled" />' +
                        '<input id="idTextObjectIdTxProperty" title="' + _("L'identifiant de l'Entité") + ' type="text" disabled="disabled" />' +
                    '</div>'+
                    '<hr/>' +
                    '<div style="margin-top:6px;margin-bottom:6px;">' +
                        '<table>'+
                            '<tr>'+
                                '<td>'+_("Propriétaire :")+'</td>'+
                                '<td><label id="idLabelOwnerTxProperty"></label></td>' +
                            '</tr>'+
                            '<tr>'+
                                '<td>'+_("Créé(e) le :")+'</td>'+
                                '<td><label id="idLabelCreationDateTxProperty"></label></td>' +
                            '</tr>'+
                        '</table>'+
                    '</div>'+
                    '<hr/>' +
                    '<div style="margin-top:6px;">' +
                        '<table>'+
                            '<tr>'+
                                '<td>'+_("Emplacement :")+'</td>'+
                                '<td><label id="idLabelLocationTxProperty"></label></td>' +
                            '</tr>'+
                            '<tr>'+
                                '<td>'+_("Type :")+'</td>'+
                                '<td><label id="idLabelTypeTxProperty"></label></td>' +
                            '</tr>'+
                            '<tr>'+
                                '<td>' + _("Nombre d'enfants :") + '</td>' +
                                '<td><label id="idLabelNbChildrenTxProperty"></label></td>' +
                            '</tr>'+
                        '</table>'+
                    '</div>'+
                '</div>';

    mainDiv.append(sHtml);
    J(document.body).append(mainDiv);

    this.wProperty = new CWindow({
        sName: "wProperty",
        iWidth: 360,
        iHeight: 230,
        bDenyResize: true,
        bHidePark: true,
        sIcon: format('temp_resources/theme/img/png/#1.png', [iIcon]),
        sHeader: _("Nouveau cahier des charges de comparaison"),
        sObjectAttached: "idDivMainTxProperty"
    });

    //get TxProperty info
    J.ajax({
        url: sUrlTxPropertyAjax,
        cache: false,
        async: false,
        data: {
            sFunctionName: 'wGetTxPropertyInfo',
            idObject: aSettings.idObject
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                sOwnerName = results[3];
                sCreationDate = results[4];
                sLocation = results[5];
                sType = results[6];
                iNbChildren = results[7];
                bShowIdObject = results[8];
            } else
                parent.msgError(results[0]);
        }
    });

    //init Tabbar
    this.tabbar = new CTabbar({
        sIdDivTabbar: "idDivTabbarTxProperty",
        tabs: [
            { ID: "tabData", sName: _("Général"), iWidth: "60px", bActive: true, sContentZone: "idDivTxProperty" }
        ]
    });

    //set inputs
    J("#idImgObjectTxProperty").attr("src", format(_url("/temp_resources/theme/img/png/#1.png"), [iIcon]));
    J("#idTextObjectNameTxProperty").val(sObjectName);
    if (bShowIdObject) {
        J("#idTextObjectIdTxProperty").val(idObject);
        J("#idTextObjectIdTxProperty").show();
        J("#idTextObjectNameTxProperty").css("width", "226px");
    }
    J("#idLabelOwnerTxProperty").html(sOwnerName);
    J("#idLabelCreationDateTxProperty").html(sCreationDate);
    J("#idLabelLocationTxProperty").html(sLocation);
    J("#idLabelTypeTxProperty").html(sType);
    J("#idLabelNbChildrenTxProperty").html(iNbChildren);

    return this;
}

CTxProperty.prototype.toString = function() {
    return "CTxProperty";
}
