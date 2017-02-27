function CLinkTree(aSettings, aCallBackFunction, aDummyData) {
    var dhxTree;
    var rResult = new Object();

    //initialize settings
    var idAtt = getValue(aSettings.idAtt, 0);
    var idOT = getValue(aSettings.idOT, 0);
    var sIdsObjectChecked = getValue(aSettings.idsObjectChecked, "");
    var sCheckType;
    if (aSettings.checkType) { sCheckType = (aSettings.checkType == 1) ? "ctCheckboxes" : "ctRadioboxes"; }
    else { sCheckType = "ctNone"; }
    var idParent = getValue(aSettings.idParent, 0);
    var jFilteredLink = getValue(aSettings.jFilteredLink, sNull);
    var bStrongFilter = getValue(aSettings.bStrongFilter, false);
   
    //initialize pop-up
    var jWdowSettings = {
        sName: "wFormLinkTree",
        sHeader: _("Formulaire de saisie"),
        sIcon: 'resources/theme/img/icon-16.png',
        iWidth: 400,
        iHeight: 300,
        bDenyResize: false,
        bHidePark: true,
        bHideClose: true,
        bModal: true,
        sHTMLAttached: '<div id="divFormLinkTree" class="divForm"></div>'
    };
    var wdow = new CWindow(jWdowSettings);
    var sHtml = '<div class="wrapperDivTree">' +
                    '<div id="tree_popup_TableView" class="div_tree_popup"></div>' +
                    '<div id="toolbar_tree_popup_TableView"></div>' +
                '</div>';
    J("#divFormLinkTree").append(sHtml);

    sHtml = '<div class="divBtnsAction">' +
                '<input type="button" id="btnValidForm" value="' + _("Valider") + '" class="cl_btn_action"/>' +
                '<input type="button" id="btnQuitForm" value="' + _("Annuler") + '" class="cl_btn_action"/>' +
            '</div>';
    J("#divFormLinkTree").append(sHtml);

    dhxTree = new CTreeObject({
        sIdDivTree: "tree_popup_TableView",
        sIdDivToolbar: "toolbar_tree_popup_TableView",
        sCheckType: sCheckType,
        idOT: idOT,
        idAttribute: idAtt,
        idParentFiltering: idParent,
        sIdsChecked: sIdsObjectChecked,
        bEnableEdition: true,
        bStrongFilter: bStrongFilter
    });
            
    if (jFilteredLink != sNull) {
        dhxTree.reloadFilteredLink(jFilteredLink.Objects, jFilteredLink.bFullOT); 
    }
        
    //associate event with button ok
    J("#btnValidForm").click(OnButtonClick);
    
    //associate event with button cancel
    J("#btnQuitForm").click(OnButtonClick)

    function OnButtonClick() {
        wdow.close();
        rResult.tree = dhxTree;
        aCallBackFunction(this.id, rResult, aDummyData);
       
    }
}


