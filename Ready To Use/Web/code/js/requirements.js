function Open_CDC(AMessage){
	if (document.form1.select_cdc1.value != "") {
	    parent.Launch_MCS(ID_TE_cmb, document.form1.select_cdc1.value, "");
	    parent.txASP.mainToolbar.wdowContainer.getWindow("wRequirementSet").close();
	} else { 
		parent.Popup_Alert(AMessage);
	} 
}

function Open_New_CDC(){
    parent.Launch_MCS(ID_TE_cmb);
    parent.txASP.mainToolbar.wdowContainer.getWindow("wRequirementSet").close();
}

function UploadRequirementSet() {
    J("#idFormUploadRequirementSet").submit();
}