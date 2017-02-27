var dhxWins;
var sTxIcon = 'temp_resources/theme/img/icon-16.png';
var sIcon_MCS = 'temp_resources/theme/img/btn_titre/module_mcs-16.png';
var sPathFileActionWindowAjax = _url("/code/asp/ajax/actions_window.asp");

function Close_Popup(AID_Popup){
    parent.txASP.wdowContainer.getWindow(AID_Popup).close();
}

function setWindowModal(aPopupName, aModal) {
    aModal = parent.getValue(aModal, true);
    parent.txASP.wdowContainer.getWindow(aPopupName).setModal(aModal);
		
}

	/*define criterion*/
function Display_Popup_Modify_Criteria() {
	var sParams = '?id_gc='+page_id_gc_select+'&id_te='+ID_TE_cmb;

    parent.txASP.wdowContainer.addWindow({
        sName: "wMCSCriteria",
        sHeader: _("Sélection Multicritère - Cahier des Charges"),
        iWidth: 960,
        iHeight: 550,
        bDenyResize: true,
        bHidePark: true,
        sIcon: sIcon_MCS,
        sUrlAttached: _url('/code/asp/selection_criteria.asp') + sParams
    }, function () { parent.txASP.wdowContainer.getWindow("wMCS").setModal(true) });
}
	
		function Close_Popup_Modify_Criteria(){
		    Close_Popup('wMCSCriteria');
		}

	function Display_Popup_Add_Group() {
	    setWindowModal("wMCS",false);
		var sParams = '?id_rl_owner='+page_id_cdc+'&id_pere='+page_id_gc_select+'&id=0';
		
		parent.txASP.wdowContainer.addWindow({
		    sName: "wMCSGroup",
		    sHeader: _("SMC - Ajout d'un Groupe de Critères"),
		    iWidth: 340,
		    iHeight: 145,
		    bDenyResize: true,
		    bHidePark: true,
		    sIcon: sIcon_MCS,
		    sUrlAttached: _url('/code/asp/page_modif_cg.asp') + sParams
		}, function () { parent.txASP.wdowContainer.getWindow("wMCS").setModal(false) });
	}

	function Display_Popup_Modify_Group() {
	    setWindowModal("wMCS", false);
		var sParams = '?id_rl_owner='+page_id_cdc+'&id='+page_id_gc_select+'&id=0';

		parent.txASP.wdowContainer.addWindow({
		    sName: "wMCSGroup",
		    sHeader: _("SMC - Modification du Groupe de Critères"),
		    iWidth: 340,
		    iHeight: 145,
		    bDenyResize: true,
		    bHidePark: true,
		    sIcon: sIcon_MCS,
		    sUrlAttached: _url('/code/asp/page_modif_cg.asp') + sParams
		}, function () { parent.txASP.wdowContainer.getWindow("wMCS").setModal(false) });
	}
	
	function Display_Popup_Modify_RS() {
	    setWindowModal("wMCS", false);
		var sParams = '?id_rl_owner='+page_id_cdc+'&id='+page_id_cdc;
		parent.txASP.wdowContainer.addWindow({
		    sName: "wMCSGroup",
		    sHeader: _("SMC - Modification du Cahier des Charges"),
		    iWidth: 340,
		    iHeight: 145,
		    bDenyResize: true,
		    bHidePark: true,
		    sIcon: sIcon_MCS,
		    sUrlAttached: _url('/code/asp/page_modif_cg.asp') + sParams
		}, function () { parent.txASP.wdowContainer.getWindow("wMCS").setModal(false) });
	}
	
		function Close_Popup_Add_Group(){
		    setWindowModal("wMCS", false);
		    Close_Popup('wMCSGroup');
		}
	
	function Update_Requirement_Set(AID_Requirement_Set){
	    rFrame = parent.txASP.wdowContainer.getWindow("wMCS").getFrame().contentWindow;
		rFrame.UpdateTextCdc();
		rFrame.page_id_gc_select = AID_Requirement_Set;
	    Close_Popup_Add_Group();	
	}

