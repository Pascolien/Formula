// JavaScript Document
var tree_type_treeview 	= new Array();
var tree_id_te 					= new Array();
var tree_id_pe					= new Array();
var tree_dossier			 	= new Array();
var tree_id_select 			= new Array();
var tree_id_indice      = new Array();
var id_tree; 
	// variable temporaire qui est renvoyé par la DLL lors de l'affichage d'un treeview

function essai_modification(id_pe) {
	try {
		modification(id_pe);
		}
		catch (error) {
	}
}

function Ouvrir_Treeview(id_tree, id_te, id_pe, id_e, type, recurs, dossier_selectionnable) {
	var img  = J("#img_"+id_tree+"_"+id_e);
  	var e1   = J("#tree1_"+id_tree+"_"+id_e);
	if (id_e == 0) {  
		e1.css("display",'none');
		e1.html('');
	}   
	if(e1.css("display") == 'none') {
  		e1.css("display",'');
  		if(img)img.attr("src",_url('/resources/theme/img/iconsToolbar/minus.png'));
  	}else{
  		e1.css("display",'none');
  		if(img)img.attr("src",_url('/resources/theme/img/iconsToolbar/plusik.png'));
  	}  	
  	if(e1.html() == ''){
  		Charger_Enfant(id_tree, id_te, id_pe, id_e, type, recurs, dossier_selectionnable);
  	}
}
  
function Charger_Enfant(id_tree, id_te, id_pe, id_e, type, recurs, dossier_selectionnable) {
	J.ajax({
	    url:_url('/code/asp/ajax/actions_Treeview.asp'),
		async: false,
		cache: false,
        type:'post',
		data:{
			sFunctionName :"Get_HTML_Treeview_LoadChild",
			id_pe: id_pe, 
			liste_id_e_coche : Jn('id_e_coche_abs_'+id_tree).eq(0).val(), 
			id_tree: id_tree, 
			id_te: id_te, 
			id_pere : id_e, 
			type: type, 
			recurs: recurs, 
			dossier_selectionnable: dossier_selectionnable
		},
		success: function (aResult) {
		    J("#tree1_" + id_tree + "_" + id_e).html(aResult);
		}
	});
}   
  
function ClickOnRadio(id_tree, id_pe, obj) {
	var elements = Jn('inp_'+id_tree).eq(0); 
	try{
		for (var i = 0; i <  elements.length; i++) {
			if (elements[i].val() == obj.val()) {
				elements[i].prop("checked",true);
			} else {
				elements[i].prop("checked",false);
			}
		}
	}catch(e){}
	if (obj.val() != Jn('id_e_initiale_'+id_tree).eq(0).val()) {
		Jn('id_e_coche_'+id_tree).eq(0).val(obj.val());
		Jn('id_e_coche_abs_'+id_tree).eq(0).val(obj.val());
		Jn('id_e_decoche_'+id_tree).eq(0).val(Jn('id_e_initiale_'+id_tree).eq(0).val());
	} else {
		Jn('id_e_coche_'+id_tree).eq(0).val('');
		Jn('id_e_coche_abs_'+id_tree).eq(0).val(obj.val());
		Jn('id_e_decoche_'+id_tree).eq(0).val(''); 
	}
	try	{
		modification(id_pe);
	} catch (error) {} 
}
  
function ClickOnCheckbox(id_tree, id_pe, obj) {	
	if (Modif_Critere != null)Modif_Critere = true;
	var liste_id_e_ini = ';'+Jn('id_e_initiale_'+id_tree).eq(0).val()+';';
	var liste_id_e_coche_abs = ';'+Jn('id_e_coche_abs_'+id_tree).eq(0).val()+';';
	if (J(obj).is(':checked')) { // Lorsqu'on coche une checkbox
		Jn(obj.name).eq(0).attr('checked',true);
		Jn('id_e_decoche_'+id_tree).eq(0).val(Verif_Liste(Jn('id_e_decoche_'+id_tree).eq(0).val(), J(obj).val()));
		if (liste_id_e_ini.indexOf(';'+J(obj).val()+';') == -1) {
			Jn('id_e_coche_'+id_tree).eq(0).val(Verif_Liste(Jn('id_e_coche_'+id_tree).eq(0).val(), J(obj).val()) + J(obj).val() + ';');
		}
		if (liste_id_e_coche_abs.indexOf(';'+J(obj).val()+';') == -1) {
			Jn('id_e_coche_abs_'+id_tree).eq(0).val(Verif_Liste(Jn('id_e_coche_abs_'+id_tree).eq(0).val(), J(obj).val()) + J(obj).val() + ';');
		}
	} else { // Lorqu'on décoche une checkbox
		Jn(obj.name).eq(0).attr('checked',false);
		Jn('id_e_coche_'+id_tree).eq(0).val(Verif_Liste(Jn('id_e_coche_'+id_tree).eq(0).val(), J(obj).val()));
		if (liste_id_e_ini.indexOf(';'+J(obj).val()+';')!= -1) {
			Jn('id_e_decoche_'+id_tree).eq(0).val(Verif_Liste(Jn('id_e_decoche_'+id_tree).eq(0).val(), J(obj).val()) + J(obj).val() + ';');
		}
		Jn('id_e_coche_abs_'+id_tree).eq(0).val(Verif_Liste(Jn('id_e_coche_abs_'+id_tree).eq(0).val(), J(obj).val()));
	}
	try	{
		modification(id_pe); // Pour informer d'une modifictaion du formulaire ou de la SMC
	} catch (error) {}
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

function Display_Read_Tree(id_tree, id_pe, searchValue,AMultiplicity) {
  	try{
		J('#inp_search_'+id_tree).val('');
		J('#img_tree_'+id_tree).css("display",'none');
		J('#img_linear_'+id_tree).css("display",'inline');  
		
		J('#tree1_'+id_tree+'_0').css("display",'none');
		J('#tree2_'+id_tree+'_0').css("display",'block');
		
		id_ot = Jn('id_te_'+id_tree).eq(0).val();
		
		J.ajax({
		    url:_url('/code/asp/ajax/load_selected_object.asp'),
		    async: false,
		    cache: false,
            type:"post",
		    data:{  
			    id_tree : id_tree, 
			    id_te : id_ot, 
			    id_attr : id_pe, 
			    type : AMultiplicity, 
			    lien : true, 
			    liste_id : Jn('id_e_coche_abs_'+id_tree).eq(0).val(), 
			    searchValue: searchValue
		    },
		    success: function (aResult) {
		        J("#tree2_" + id_tree + "_0").html(aResult);
		    }
	});
	}catch(e){}
  	return false;
}
  
function Display_Write_Tree(id_tree) {
    J('#img_linear_'+id_tree).css("display",'none');
    J('#img_tree_'+id_tree).css("display",'inline');
    
    J('#tree2_'+id_tree+'_0').css("display",'none');
    J('#tree1_'+id_tree+'_0').css("display",'block');           
}

function Hauteur_Treeview(id_tree) {
	if (J('#fleche_jaune_'+id_tree)) {
		var str_image = J('#fleche_jaune_'+id_tree).attr("src");
		if (str_image.substr(str_image.length-13) == "bas_jaune.png") {
		  J('#tree1_'+id_tree+'_0').css("height",'auto');
		  J('#tree2_'+id_tree+'_0').css("height",'auto');
		  J('#fleche_jaune_'+id_tree).attr("src",_url('/resources/theme/img/btn_form/16x16_yellow_arrow_up.png'));
		} else {
		  J('#fleche_jaune_'+id_tree).attr("src",_url('/resources/theme/img/btn_form/16x16_yellow_arrow_down.png'));
		  J('#tree1_'+id_tree+'_0').css("height","95px");
		  J('#tree2_'+id_tree+'_0').css("height","95px");      
		}
	} 
}  

function CocherTout(id_tree,AID_OT,AMultiplicity) {
	if (Modif_Critere != null)
		Modif_Critere = true;
	var List_ID="";
    essai_modification(tree_id_pe[id_tree]);
	if (J('#tree1_'+id_tree+'_0').css("display") == "block"){
		J('#tree1_'+id_tree+'_0').find(':checkbox').prop("checked",true);
		
		// Appel à une fonction de l'API qui renvoi toutes les E pour un TE et un ID_E Pere (ici 0)
		 J.ajax({   
		    url: _url('/code/asp/ajax/actions_Treeview.asp'),
			async:false,
			cache:false,
			type:'post',
			dataType:'script',
			data:{ 
				sFunctionName :"Get_SL_ID_E_apd_ID_TE",
				id_te: AID_OT, 
				id_e_pere: 0, 
				dossier: tree_dossier[id_tree] 
			},
			success: function (aResult) {
			    List_ID = aResult;
			}
		});
	} else {
		var elts = J('#tree2_'+id_tree+'_0').find('input');
		for(var i = 0 ; i <  elts.length ; i++) {
			obj = J(elts[i]);
			if ((obj.attr("type") == 'checkbox') && (obj.attr("disabled") != true)) { 
				obj.prop("checked",true);
				List_ID = List_ID + ';' + obj.val();
			}
		}	
		var elts = J('#tree1_'+id_tree+'_0').find('input');
		for(var i = 0 ; i <  elts.length ; i++) {
			obj = J(elts[i]);
			if ((obj.attr("type") == 'checkbox') && (obj.attr("disabled") != true)&& (obj.val().indexOf(List_ID)>-1)) { 
				obj.prop("checked",true);
			}
		}		
	}
	  
    Jn('id_e_coche_'+id_tree).eq(0).val(';' + List_ID + ';');
    Jn('id_e_coche_abs_'+id_tree).eq(0).val(Jn('id_e_coche_'+id_tree).eq(0).val());
    Jn('id_e_decoche_'+id_tree).eq(0).val(';');
}
  
function Supprimer_Donnee(id_tree, nom_form) {
	essai_modification(tree_id_pe[id_tree]);
	form = Jn(nom_form).eq(0);
	var elts = J('#tree1_'+id_tree+'_0').find('input');
	for(var i = 0 ; i <  elts.length ; i++) {
		obj = J(elts[i]);
		if (obj.attr("id_tree") == id_tree) {
			if (obj.attr("type") == 'checkbox') {
				obj.prop("checked",false);
				ClickOnCheckbox(id_tree, tree_id_pe[id_tree], obj);
			} else if (obj.attr("type") == 'radio') {
				obj.prop("checked",false);
			}
		}
	}
	try {
		J('#tree2_'+id_tree+'_0').html('');
	} catch (error) {}
	Jn('id_e_coche_'+id_tree).eq(0).val(';');
	if (tree_type_treeview[id_tree] == 1) {
		Jn('id_e_decoche_'+id_tree).eq(0).val(Jn('id_e_decoche_'+id_tree).eq(0).val() + Jn('id_e_initiale_'+id_tree).eq(0).val());
	} else {
		Jn('id_e_decoche_'+id_tree).eq(0).val(Jn('id_e_initiale_'+id_tree).eq(0).val());
	}
	Jn('id_e_coche_abs_'+id_tree).eq(0).val(';');

	// On se place sur l'onglet "Arborescence" si l'on était sur l'onglet éléments sélectionné.
	if ((J('#tree2_'+id_tree+'_0')) && (J('#tree2_'+id_tree+'_0').css("display") == 'block')) {
		Display_Write_Tree(id_tree, tree_id_pe[id_tree]);
	} else {
		J('#tree2_'+id_tree+'_0').html('');
	} 
}
   
function CocherEnfant(id_tree,AID_OT,AMultiplicity) {
	if (Modif_Critere != null)Modif_Critere = true;
    essai_modification(tree_id_pe[id_tree]);
    var liste_id_e_ini = ';'+Jn('id_e_initiale_'+id_tree).eq(0).val()+';';
    var liste_id_e_coche_abs = ';'+Jn('id_e_coche_abs_'+id_tree).eq(0).val()+';';
    if (tree_id_select[id_tree] != '') {
		// Appel à une fonction de l'API qui renvoi toutes les E pour un TE et un ID_E Pere
		J.ajax({
		    url: _url('/code/asp/ajax/actions_Treeview.asp'),
			type:'post',
			dataType:'script',
			async: false,
			cache: false,
			data : { 
				sFunctionName :"Get_SL_ID_E_apd_ID_TE",
				id_te: AID_OT, 
				id_e_pere: tree_id_select[id_tree], 
				dossier: tree_dossier[id_tree] 
			},
			success: function (aResult) {
			    List_ID = aResult;
			}			
		});
	    var liste_id = List_ID.split(';');
	    
	    // On parcours les enfants pour les cochés si ils existent et mettre à jours les champs du formulaire
		for(var i = 0; i < liste_id.length; i++) {
			if (liste_id[i] != '') {
				obj = Jn('inp_'+ id_tree +'_'+ liste_id[i]).eq(0);
				if ((obj)&& (obj.attr("disabled") != true)) {
					obj.prop("checked",true);
				}
				Jn('id_e_decoche_'+id_tree).eq(0).val(Verif_Liste(Jn('id_e_decoche_'+id_tree).eq(0).val(), liste_id[i]));
				if ((liste_id_e_ini.indexOf(';'+liste_id[i]+';') == -1)) {
					Jn('id_e_coche_'+id_tree).eq(0).val(Verif_Liste(Jn('id_e_coche_'+id_tree).eq(0).val(), liste_id[i]) + liste_id[i] + ';');
				}

				if (liste_id_e_coche_abs.indexOf(';'+liste_id[i]+';') == -1) {
					Jn('id_e_coche_abs_'+id_tree).eq(0).val(Verif_Liste(Jn('id_e_coche_abs_'+id_tree).eq(0).val(), liste_id[i]) + liste_id[i] + ';');
				}
			}
		}

	    // On rafraichit la liste des entités cochés si on se situe dans le cadre "Entité(s) Sélectionnée(s)"
	    if ((J('#tree2_'+id_tree+'_0')) && (J('#tree2_'+id_tree+'_0').css("display") == 'block')) {
			Display_Read_Tree(id_tree, tree_id_pe[id_tree],'',AMultiplicity);
	    } else {
	    	J('#tree2_'+id_tree+'_0').html('');
	    }
    } else {
        Popup_Alert(_("Aucune Entité sélectionnée !"));
    }
}
  
function DecocherEnfant(id_tree,AID_OT) {
    essai_modification(tree_id_pe[id_tree]);
    var liste_id_e_ini = ';'+Jn('id_e_initiale_'+id_tree).eq(0).val()+';';
    var liste_id_e_coche_abs = ';'+Jn('id_e_coche_abs_'+id_tree).eq(0).val()+';';

    if (tree_id_select[id_tree] != '') {
		// On coche la case sélectionné si elle ne l'ai pas déjà

		if (Jn('inp_'+ id_tree +'_'+ tree_id_select[id_tree]).eq(0)) {
			Jn('inp_'+ id_tree +'_'+ tree_id_select[id_tree]).eq(0).prop("checked",false);
		}
		Jn('id_e_coche_'+id_tree).eq(0).val(Verif_Liste(Jn('id_e_coche_'+id_tree).eq(0).val(), tree_id_select[id_tree]));
		if (liste_id_e_ini.indexOf(';'+tree_id_select[id_tree]+';')!= -1) {
			Jn('id_e_decoche_'+id_tree).eq(0).val(Verif_Liste(Jn('id_e_decoche_'+id_tree).eq(0).val(), tree_id_select[id_tree]) + tree_id_select[id_tree] + ';');
		}
		Jn('id_e_coche_abs_'+id_tree).eq(0).val(Verif_Liste(Jn('id_e_coche_abs_'+id_tree).eq(0).val(), tree_id_select[id_tree]));

		// Appel à une fonction de l'API qui renvoi toutes les E pour un TE et un ID_E Pere

        J.ajax({   
            url: _url('/code/asp/ajax/actions_Treeview.asp'),
			async:false,
			cache:false,
			type:'post',
			dataType:'script',
			data:{
				sFunctionName :"Get_SL_ID_E_apd_ID_TE",
				id_te: AID_OT, 
				id_e_pere: tree_id_select[id_tree], 
				dossier: tree_dossier[id_tree] 
			},
			success: function (aResult) {
			    List_ID = aResult;
			}
		});		
	    var liste_id = List_ID.split(';');

	    // On parcours les enfants pour les cochés si ils existent et mettre à jours les champs du formulaire
		for(var i = 0; i < liste_id.length; i++) {
			if (liste_id[i] != '') {
				if (Jn('inp_'+ id_tree +'_'+ liste_id[i]).eq(0)) {
					Jn('inp_'+ id_tree +'_'+ liste_id[i]).eq(0).prop("checked",false);
				}
				Jn('id_e_coche_'+id_tree).eq(0).val(Verif_Liste(Jn('id_e_coche_'+id_tree).eq(0).val(), liste_id[i]));
				if (liste_id_e_ini.indexOf(';'+liste_id[i]+';')!= -1) {
					Jn('id_e_decoche_'+id_tree).eq(0).val(Verif_Liste(Jn('id_e_decoche_'+id_tree).eq(0).val(), liste_id[i]) + liste_id[i] + ';');
				}
				Jn('id_e_coche_abs_'+id_tree).eq(0).val(Verif_Liste(Jn('id_e_coche_abs_'+id_tree).eq(0).val(), liste_id[i]));
			}
		}

	    // On rafraichit la liste des entités cochés si on se situe dans le cadre "Entité(s) Sélectionnée(s)"
	    if ((J('#tree2_'+id_tree+'_0')) && (J('#tree2_'+id_tree+'_0').css("display") == 'block')) {
			Display_Read_Tree(id_tree, tree_id_pe[id_tree]);
	    } else {
	    	J('#tree2_'+id_tree+'_0').html('');
	    }
    } else {
        Popup_Alert(_("Aucune Entité sélectionnée !"));
    }
}
  
function Tree_SelectE(id_tree, obj) {
	var elts = Jclass('tree_'+id_tree+'_e_name', 'span', J('#tree_'+id_tree));
    for(var i = 0 ; i <  elts.length ; i++) {
	    J(elts[i]).css("backgroundColor",'transparent');
	}
	J(obj).css("backgroundColor",'#cccccc');
	tree_id_select[id_tree] = J(obj).attr("id");
}

function Initialize_Tree_Heritage(AID_Attribute){
	J("treebox_form_"+AID_Attribute).css("height",'240px');
	J("treebox_form_filtered_"+AID_Attribute).css("height",'240px');
	J("treebox_heritage").css("top",'50px');	
}