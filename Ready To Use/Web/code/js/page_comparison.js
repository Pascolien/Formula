function select_cdc(obj, nb) {
    document.form1.select_cdc1.value = nb;
 	elts = Jclass('cdc_liste_detail', 'div', J('#div_select_cdc1'));
 	for(i=0; i< elts.length; i++) {  
		J(elts[i]).css("backgroundColor",'');
		if ((J(elts[i]).css("backgroundColor",'#cccccc')) || (J(elts[i]).css("backgroundColor",'rgb(204,204,204)'))) {
			J(elts[i]).css("backgroundColor",'');;
		}
 	}
 	J(obj).css("backgroundColor",'#cccccc');
}

function select_valeur_cmb(obj1, obj2) {
	ID_TE_cmb = J(obj2).attr("ident");
	J.ajax({
		url:'ajax/actions_MCS.asp',
		async: false,
        cache:false,
		data : { 
			sFunctionName : "Get_HTML_Cdc_List",
			id_te : ID_TE_cmb 
		},
		success: function (aResult) {
		    J('#div_select_cdc1').html(aResult);
		}
	});                                    
	J("#"+obj1).html(J(obj2).html());
}
