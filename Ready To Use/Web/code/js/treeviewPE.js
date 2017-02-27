// JavaScript TreeviewPE
var J = jQuery.noConflict();
var treePE_id_select = new Array();

function Ouvrir_TreeviewPE(id_tree, type, id, id_branche) {
	var img  = J("#tree_"+id_tree+"_img_"+id_branche);
	var e1   = J("#tree_"+id_tree+"_node_"+id_branche);
	var obj  = J("#tree_"+id_tree+"_span_"+id_branche);
	var id_c_pere;

	if(e1.css("display") == 'none'){
		e1.css("display",'');
		if(img){
		    img.attr("src", _url('/resources/theme/img/iconsToolbar/minus.png'));
		}
	} else {
		e1.css("display",'none');
		if(img){
		    img.attr("src", _url('/resources/theme/img/iconsToolbar/plusik.png'));
		}
	}
	if ((e1.html() == '') && (type == 'pe')){
	    e1.html('<div><img src="'+_url("/resources/theme/img/gif/ajax-loader.gif")+'" width="20px" /></div>');
		if (obj.attr("id_c") != "0"){
			id_c_pere = obj.attr("id_c");
		} else {
			id_c_pere = obj.attr("id_c_pere");
		}

		J.ajax({
		    url: _url('/code/asp/ajax/actions_Treeview.asp'),
			async: false,
			cache:false,
			data:{  
				sFunctionName :"Get_HTML_TreeviewPE_LoadLinkAPI",
				id_tree: id_tree, 
				id_pe: id, 
				id_critere_pere: id_c_pere
			},
			success: function (aResult) {
			    J(e1).html(aResult);
			}
		});
	}
}

function TreePE_Coche(id_tree, id_treePE) {
	var check_value;
	obj = J('#tree_'+ id_tree +'_check_'+id_treePE);
	
	var Obj_Liste = Jn("Liste_ID_PE_"+id_tree).eq(0);
	var Str_Liste = Obj_Liste.val();
 	
	if (obj.attr("disabled") == true){
		obj.prop("checked",false);
 	}
 	
	// Lorsqu'on coche une checkbox
	if (obj.is(':checked') == true){
		check_value = true;
		if (Str_Liste.indexOf(';'+obj.val()+';') == -1) {
			Obj_Liste.val(Verif_Liste(Obj_Liste.val(), obj.val()) + obj.val() + ';');
		}
	} else { // Lorqu'on décoche une checkbox
		check_value = false;
		Obj_Liste.val(Verif_Liste(Obj_Liste.val(), obj.val()));
	}

	//On répercute cela sur les PE enfants:
	if (J('#tree_'+ id_tree +'_node_'+ id_treePE)) {
		var liste_id = J('#tree_'+ id_tree +'_node_'+ id_treePE).find('input.check_'+id_tree); 
		for(var i = 0; i < liste_id.length; i++) {	  
			if (liste_id[i] != '') {		  
				liste_id[i].prop("checked",check_value);
				temp = liste_id[i].id;															
				if (J('#tree_'+ id_tree +'_check_'+temp.substr(temp.lastIndexOf("_")+1))) {
					TreePE_Coche(id_tree, temp.substr(temp.lastIndexOf("_")+1));
				}
			}
		}
	}
}

// Cette fonction enlève "element" de "liste"
function Verif_Liste (liste, element) {
	element = ';'+ element +';';
	var pos1 = liste.indexOf(element);
	if ( pos1 >= 0) {
		return liste.substr(0, pos1) +';'+ liste.substr(pos1 + element.length,liste.length-(pos1+element.length) );
	} else {
		return liste;
	}
}

function Select_Branche_apd_ID_PE(id_tree, type, id_c) {
	liste_span_pe = J('#smc_zone_gauche').find('[id_c="'+ id_c +'"]');						
	for (i = 0;i<liste_span_pe.length;i++) {
		tmp = liste_span_pe[i].id;
		break;
	}
	id_branche = tmp.substr(tmp.lastIndexOf("_")+1, tmp.length -tmp.lastIndexOf("_"));
	Select_Branche(id_tree, type, id_branche);
}

function Select_Branche(id_tree, type, AID_Branche) {
	var elts = Jclass('nom_'+id_tree, 'span', J('#tree_'+id_tree));
	var id;
	var nom_obj = AID_Branche + 'test123'; // pour qu'il y ait au minimum un texte dans ce nom.
	if (nom_obj != "" && nom_obj.substr(0, 4) != 'tree') {
		var obj = J('#tree_'+id_tree+'_span_'+AID_Branche);
	} else {
		var obj = J('#'+AID_Branche);
	}
	var test = true;
	if (Modif_Critere) {
		test = Enregistrement_Critere(id_tree, true);
	}

	// On initialise les bouton radio
	Jn("type_smc").eq(0).prop("checked",true);
	Jn("smc_abs_critere").eq(0).prop("checked",true);

	if (test) {
	    J('#smc_zone_droite').html('<div style="width: 100%; text-align:center;"><img src="' + _url("/resources/theme/img/gif/ajax-loader.gif") + '" /></div>');
		for(var i = 0 ; i <  elts.length ; i++) {
			J(elts[i]).css("backgroundColor",'transparent');
			
		}	  

		obj.css("backgroundColor",'#cccccc');
		treePE_id_select[id_tree] = obj.attr("id");

		// Lorsqu'on a sélectionné une caractéristique on mets à jour l'affichage du critère
		page_id_branche_select = obj.attr("id");
		page_id_type_select = type;

		if (obj.attr("id_c") != 0) {
			if (obj.attr("type_critere") != "1"){
				J('#inp_efface_critere').removeAttr("disabled");
			} else {
				J('#inp_efface_critere').attr("disabled",'disabled');
			}		  
			id = obj.attr("id_c");
			type = -181;
		} else {			
			J('#inp_efface_critere').attr("disabled",'disabled');
			id = obj.attr("id_met");
		}

		J.ajax({
			url: _url('/code/asp/ajax/actions_MCS.asp'),
			async: false,
			cache:false,
			data:{
				sFunctionName : "Get_HTML_SMC_LoadCriterion", 
				id: id, 
				type: type,
				id_attribute:obj.attr("id_met")
			},
			success: function (aResult) {
			    J('#smc_zone_droite').html(aResult);
			}
		});

		// Modification des variables JS de la page		
		Type_Critere = obj.attr("type_critere");
		ID_Branche = AID_Branche;
		ID_Critere = obj.attr("id_c");
		ID_Critere_Pere = obj.attr("id_c_pere");
		ID_PE = obj.attr("id_met");
		Modif_Critere = false;
	}
}

function TreePE_CheckAll(id_tree, check_value) {
	var liste_id = J('#tree_'+ id_tree).find('input.check_'+id_tree);

  // On parcours les enfants pour les cochés si ils existent et mettre à jours les champs du formulaire
	for(var i = 0; i < liste_id.length; i++) {
	  if (liste_id[i] != '') {
		liste_id[i].prop("checked",check_value);
		temp = liste_id[i].id;
		if (J('#tree_'+ id_tree +'_check_'+temp.substr(temp.lastIndexOf("_")+1))) {
				TreePE_Coche(id_tree, temp.substr(temp.lastIndexOf("_")+1));
			}
		}
	}
}

function TreePE_CheckChild(id_tree, check_value) {
	if (treePE_id_select[id_tree] >= 0) {
		if (J("#tree_"+ id_tree +"_check_"+treePE_id_select[id_tree])) {
			J("#tree_"+ id_tree +"_check_"+treePE_id_select[id_tree]).prop("checked",check_value)
			TreePE_Coche(id_tree, treePE_id_select[id_tree]);
		}
		
  } else {
	    Popup_Alert(_("Aucune Entité sélectionnée !"));
  }
}

function TreePE_Select_TS_Object(id_tree, id_treePE, obj) {
	var elts = Jclass('nom_'+id_tree, 'span', J('#tree_'+id_tree));
	for(var i = 0 ; i <  elts.length ; i++) {
		J(elts[i]).css("backgroundColor",'transparent');
	}
	obj.css("backgroundColor",'#cccccc');
	treePE_id_select[id_tree] = id_treePE;
}
