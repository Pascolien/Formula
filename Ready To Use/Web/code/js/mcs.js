// Javascript de la page de sélection des critères

// Variable locale à la page
var ID_Branche;
var ID_Cdc = 0;
var Type_Critere = 0;
var ID_Critere = 0;
var ID_Critere_Pere = 0;
var ID_PE = 0;
var Modif_Critere = false;
var ID_TE_Destination;
var ID_Treeview = 0;
var ID_TreeviewPE = 0;
var page_id_branche_select = '';
var page_id_type_select = '';

// On remonte jusqu'a l'élément parent (en sautant l'affichage du type de propriété
// On vérifie si cet élément parent à un ID_C (id_critere)
// Si oui on l'utilise comme ID_Pere
// Si non on le crée de manière récursive
function RecupCriterePere(obj, id_tree) {
	if (J(obj).parent().parent().parent().prev()){	
		var elts = J(obj).parent().parent().parent().prev().children();
		var id_critere_pere = 0;
		for(var i=0; i<elts.length; i++){
		
			if (J(elts[i]).attr('class') == 'nom_'+id_tree) {
				if (J(elts[i]).attr("id_c") != '0') {
					return J(elts[i]).attr("id_c");
				} else {
					id_critere_pere = RecupCriterePere(elts[i],id_tree);
					J.ajax({
					    url: _url('/code/asp/ajax/actions_MCS.asp'),
						async: false,
						cache: false,
						data : { 
							sFunctionName :"Write_Link_Criterion",
							id_cdc: ID_Cdc, 
							id_critere_pere: id_critere_pere, 
							id_critere: 0, 
							id_pe: J(elts[i]).attr("id_met"),							
							type_critere_lien: 1, 
							liste_e: -1, 
							selection: 1,
							save_database: true
						},
						success: function (aResult) {
						    J(elts[i]).attr("id_c", aResult);
							J(elts[i]).css("fontWeight","bold");
						}
					});
					return J(elts[i]).attr('id_c');
				}
		 	}
		}
 	} else {
		return 0;
	}
}

function SMC_Valider(id_tree) {
	var validation = true;
	if (Modif_Critere) {
		validation = Enregistrement_Critere(id_tree, true);
	}
	if (validation) {
	//le timeout permet d'enregistrer le dernier critère avant de valider.
	    rFrame = parent.txASP.wdowContainer.getWindow("wMCS").getFrame().contentWindow;
		setTimeout('rFrame.UpdateTextCdc()',200);
		setTimeout('rFrame.LancerCalcul(false)',800);
		setTimeout('Close_Popup_Modify_Criteria()',1200);
	}
}

function Choix_CritereNum(choix, sID_Unique) {
	if (J('#range_type'+sID_Unique)) {
        if (choix == 'intervalle')  {
            J('#range_type'+sID_Unique).css('display','block');
        } else {
            J('#range_type'+sID_Unique).css('display','none');
        }
	}

	J('#sup_a'+sID_Unique).css('display','none');
	J('#inf_a'+sID_Unique).css('display','none');
	J('#egal_a'+sID_Unique).css('display','none');
	
	J('#inp_val_egal'+sID_Unique).val('');
	if (J('#inp_val_egal'+sID_Unique).attr('fValue'))
		J('#inp_val_egal'+sID_Unique).attr('fValue',"0");
	J('#inp_tol_egal'+sID_Unique).val('');
	J('#inp_val_sup'+sID_Unique).val('');
	
	if (J('#inp_val_sup'+sID_Unique).attr('fValue'))
		J('#inp_val_sup'+sID_Unique).attr('fValue',"0");
	
	J('#inp_val_inf'+sID_Unique).val('');
	
	if (J('#inp_val_inf'+sID_Unique).attr('fValue'))
		J('#inp_val_inf'+sID_Unique).attr('fValue',"0");
	
	J('#inp_tol_sup'+sID_Unique).val('');
	J('#inp_tol_inf'+sID_Unique).val('');
	
	J('#titre_critere_num'+sID_Unique).css('display','none');
	
	if (J('#inp_type_critere_num'+sID_Unique)) {
		J('#inp_type_critere_num'+sID_Unique).val('');
	}
	
	if ((choix == 'sup_a') && (J('#inp_sup' + sID_Unique).attr('class') != 'btn_choix_critere_enfonce')) {
	    J('#inp_type_critere_num'+sID_Unique).val('1');
		J('#sup_a'+sID_Unique).css('display','block');
		J('#inp_sup'+sID_Unique).attr('class','btn_choix_critere_enfonce');
		J('#inp_inf'+sID_Unique).attr('class','btn_choix_critere');
		J('#inp_egal'+sID_Unique).attr('class','btn_choix_critere');
		J('#inp_intervalle'+sID_Unique).attr('class','btn_choix_critere');
		J('#titre_critere_intervalle').css('display','none');
		J('#titre_critere_num'+sID_Unique).css('display','block');
 	} else if ((choix == 'inf_a') && (J('#inp_inf'+sID_Unique).attr('class') != 'btn_choix_critere_enfonce')) {
	  J('#inp_type_critere_num'+sID_Unique).val('2');
		J('#inf_a'+sID_Unique).css('display','block');
		J('#inp_inf' + sID_Unique).attr('class', 'btn_choix_critere_enfonce');
		J('#inp_sup'+sID_Unique).attr('class','btn_choix_critere');
		J('#inp_egal'+sID_Unique).attr('class','btn_choix_critere');
		J('#inp_intervalle'+sID_Unique).attr('class','btn_choix_critere');
		J('#titre_critere_num'+sID_Unique).css('display','block');
		J('#titre_critere_intervalle').css('display','none');
 	} else if ((choix == 'egal_a') && (J('#inp_egal'+sID_Unique).attr('class') != 'btn_choix_critere_enfonce')) {
 	 	J('#inp_type_critere_num'+sID_Unique).val('3');
 	 	J('#egal_a' + sID_Unique).css('display', 'block');
		J('#inp_egal'+sID_Unique).attr('class','btn_choix_critere_enfonce');
		J('#inp_sup'+sID_Unique).attr('class','btn_choix_critere');
		J('#inp_inf'+sID_Unique).attr('class','btn_choix_critere');
		J('#inp_intervalle'+sID_Unique).attr('class','btn_choix_critere');
		J('#titre_critere_num'+sID_Unique).css('display','block');
		J('#titre_critere_intervalle').css('display','none');
 	} else if ((choix == 'intervalle') && (J('#inp_intervalle'+sID_Unique).attr('class') != 'btn_choix_critere_enfonce')) {
		J('#inp_type_critere_num'+sID_Unique).val('4');
		J('#sup_a'+sID_Unique).css('display','block');
		J('#inf_a' + sID_Unique).css('display', 'block');
		J('#inp_intervalle'+sID_Unique).attr('class','btn_choix_critere_enfonce');
		J('#inp_sup'+sID_Unique).attr('class','btn_choix_critere');
		J('#inp_inf'+sID_Unique).attr('class','btn_choix_critere');
		J('#inp_egal'+sID_Unique).attr('class','btn_choix_critere');
		J('#titre_critere_num'+sID_Unique).css('display','block');
		J('#titre_critere_intervalle').css('display','block');
		J('#titre_critere_num').css('display','none');
 	} else {
		J('#inp_sup'+sID_Unique).attr('class','btn_choix_critere');
		J('#inp_inf'+sID_Unique).attr('class','btn_choix_critere');
		J('#inp_egal'+sID_Unique).attr('class','btn_choix_critere');
		J('#inp_intervalle'+sID_Unique).attr('class','btn_choix_critere');
		J('#titre_critere_intervalle').css('display','none');
	}
}

function modification(id) {
	Modif_Critere = true;
}

function CB_MCS_Link_Attribute_OnChange(AModify_Criterion) {
	if (AModify_Criterion) Modif_Critere = true;
	if (document.form1.smc_recurs_pe) {
		if (document.form1.smc_recurs_pe.value == '0') {
			Disabled_Part('id_field_mcs_recursive_link');
		} else {
			Enabled_Part('id_field_mcs_recursive_link');
		}
	}
}

function Delete_Criterion() {	
	J("#"+page_id_branche_select).css('fontWeight','normal');
	J("#"+page_id_branche_select).attr("id_c",'0');
	
	J.ajax({
	    url: _url('/code/asp/ajax/actions_MCS.asp'),
	    cache: false,
        async: false,
		data: { 
			sFunctionName :"Delete_Critere",
			id_c: ID_Critere,
			type_critere: Type_Critere			
		}
	});
	
	// Si c'est un lien on referme la branche de manière à signifier l'effacement des critères enfants
	id_treePE = page_id_branche_select.substr(page_id_branche_select.lastIndexOf("_") + 1);
	if (J('#tree_'+ ID_TreeviewPE +'_node_'+ id_treePE).length != 0) {
		J('#tree_'+ ID_TreeviewPE +'_node_'+ id_treePE).html('');
		Ouvrir_TreeviewPE(ID_TreeviewPE, '', 0, id_treePE);
		J('#tree_'+ ID_TreeviewPE +'_node_'+ id_treePE).css('display','none');
	}
	
	Select_Branche(ID_TreeviewPE, page_id_type_select, J("#"+page_id_branche_select).attr('id'));
	
	J('#inp_efface_critere').attr('disabled','disabled');	
}

function CB_MCS_Object_Linked_To_OnChange(AModify_Criterion){
	if (AModify_Criterion) Modif_Critere = true;
	ID_Select = J("#id_select_mcs_object_linked_to").val();
	J("#id_select_mcs_no_data").removeAttr("disabled");
	if (ID_Select == "7"){ //Aucune
		J("#id_select_mcs_no_data option[value='1']").attr("selected","selected");
		J("#id_select_mcs_no_data").attr("disabled","1");
	}
}

function CB_Series1_OnChange(AID_Serie1,AID_Serie2){
	iIndex1 = J("#"+AID_Serie1+" option:selected").attr('index');
	iIndex2 = J("#"+AID_Serie2+" option:selected").attr('index');
	if (iIndex1 == iIndex2){
		if (iIndex1 == 0)iIndex2=1;
		else iIndex2=iIndex2-1;
	}
	J("#"+AID_Serie2+" option[index='"+iIndex2+"']").attr("selected","selected");
}

function CB_Series2_OnChange(AID_Serie1,AID_Serie2){
	iIndex1 = J("#"+AID_Serie1+" option:selected").attr('index');
	iIndex2 = J("#"+AID_Serie2+" option:selected").attr('index');
	if (iIndex1 == iIndex2){
		if (iIndex1 == 0)iIndex1=1;
		else iIndex1=iIndex1-1;
	}
	J("#"+AID_Serie1+" option[index='"+iIndex1+"']").attr("selected","selected");
}

function Enregistrement_Critere(id_tree, save_database) {
	if (verif_form2(document.form1, false)) {
		var obj = J('#'+treePE_id_select[id_tree]); 
		var id_critere_pere = RecupCriterePere(obj, id_tree);
		if (document.form1.type_smc) {
			Type_SMC = ValeurButtonRadio(document.form1.type_smc);
		} else {
		    Type_SMC = true;
		}
		
		if (document.form1.smc_abs_critere) {
			Empty_Data = J("#id_select_mcs_no_data option:selected").val();
		} else {
			Empty_Data = 0;
		}
		
		if (Type_Critere == 3) { 
			J.ajax({
			    url: _url('/code/asp/ajax/actions_MCS.asp'),
				async: false,
				cache: false,
				data:{
					sFunctionName :"Write_Text_Criterion",
					id_cdc: ID_Cdc,
					id_critere_pere: id_critere_pere,
					id_critere: ID_Critere,
					id_pe: obj.attr("id_met"),          
					valeur: document.form1.valeur_texte.value,
					selection: Type_SMC,
					empty_data: Empty_Data,
					save_database: save_database
				},
				success: function (aResult) {
				    obj.attr("id_c", aResult);
					obj.css("fontWeight","bold"); 
				}
			});

		} else if (Type_Critere == 1) { 
			var liste_e;
			if (J("#id_inp_select_all").is(":checked")) {
			    liste_e = '-1';
			} else {
			    liste_e = eval('document.form1.id_e_coche_abs_' + ID_Treeview + '.value');
			}
			J.ajax({
			    url: _url('/code/asp/ajax/actions_MCS.asp'),
				async: false,
				cache: false,
				dataType:'script',
				data:{
					sFunctionName :"Write_Link_Criterion",
					id_cdc: ID_Cdc,
					id_critere_pere: id_critere_pere,
					id_critere: ID_Critere,
					id_pe: 0,
					type_critere_lien: 0,
					liste_e: liste_e,
					selection: Type_SMC,
					empty_data: Empty_Data,
					save_database: save_database
				}
			});   
		} else if (Type_Critere == 5) { 
			J.ajax({
			    url: _url('/code/asp/ajax/actions_MCS.asp'),
				async: false,
				cache: false,
				data:{
					sFunctionName :"Write_Boolean_Criterion",
					id_cdc: ID_Cdc,
					id_critere_pere: id_critere_pere,
					id_critere: ID_Critere,
					id_pe: obj.attr("id_met"),
					valeur: ValeurButtonRadio(document.form1.cri_booleen),
					selection: Type_SMC,
					empty_data: Empty_Data,
					save_database: save_database
				},
				success: function (aResult) {
				    obj.attr('id_c', aResult);
					obj.css("fontWeight","bold");
				}
			});

		} else if (Type_Critere == 6) {
			var liste_e;
			if (J("#id_inp_select_all").is(":checked")) {
				liste_e = '-1';
			} else {
				liste_e = eval('document.form1.id_e_coche_abs_'+ ID_Treeview +'.value');
			}
			
			J.ajax({
			    url:_url('/code/asp/ajax/actions_MCS.asp'),
				async: false,
				cache: false,
				data:{
				sFunctionName :"Write_Link_Criterion",
					id_cdc: ID_Cdc,
					id_critere_pere: id_critere_pere,
					id_critere: ID_Critere,
					id_pe: obj.attr("id_met"),
					type_critere_lien: J("#id_select_mcs_object_linked_to option:selected").val(),
					liste_e: liste_e,
					smc_recurs_type: ValeurButtonRadio(document.form1.smc_recurs_type),
					smc_recurs_pe: document.form1.smc_recurs_pe.value,
					selection: Type_SMC,
					empty_data: Empty_Data,
					save_database: save_database
				},
				success: function (aResult) {
				    obj.attr('id_c', aResult);
					obj.css("fontWeight","bold");
				}
			});
		} else if (Type_Critere == 2) { 
			var borne_inf = 0;
			var borne_sup = 0;
			var critere_inf = 0;
			var critere_sup = 0;
			var tolerance_sup = 0;
			var tolerance_inf = 0;
			var id_unit_egal = 0;
			var id_unit_inf = 0;
			var id_unit_sup = 0;
			var valeur_cible = 0;

			// Unité
			if (document.form1.unit_val_egal) {
				id_unit_egal = document.form1.unit_val_egal.value;
			} else {
				id_unit_egal = document.form1.unite.value;
			}
			
			if (document.form1.unit_val_inf) {
				id_unit_inf = document.form1.unit_val_inf.value;
			} else {
				id_unit_inf = document.form1.unite.value;
			}
			
			if (document.form1.unit_val_sup) {
				id_unit_sup = document.form1.unit_val_sup.value;
			} else {
				id_unit_inf = document.form1.unite.value;
			}                                                			

			// Supérieur à (valeur_inf renseigné)
			
			if ((document.form1.inp_type_critere_num.value == 1) || (document.form1.inp_type_critere_num.value == 4)|| (document.form1.inp_type_critere_num.value == 5)||(document.form1.inp_type_critere_num.value == 6)) {
				if(J("#inp_val_inf").attr("fValue"))
					borne_inf = J("#inp_val_inf").attr("fValue");
				else
					borne_inf = document.form1.inp_val_inf.value;
				if (document.form1.inp_strict_inf.checked) {
					critere_inf = 1;
				} else {
					critere_inf = 2;
				}
			}

			// "Inférieur à" (valeur_sup renseigné)
			if ((document.form1.inp_type_critere_num.value == 2) || (document.form1.inp_type_critere_num.value == 4)|| (document.form1.inp_type_critere_num.value == 5)||(document.form1.inp_type_critere_num.value == 6)) {
				if(J("#inp_val_sup").attr("fValue"))
					borne_sup = J("#inp_val_sup").attr("fValue");
				else
					borne_sup = document.form1.inp_val_sup.value;
				if (document.form1.inp_strict_sup.checked) {
					critere_sup = 1;
				} else {
				  critere_sup = 2;
				}
			}
			if ((document.form1.inp_type_critere_num.value == 4)|| (document.form1.inp_type_critere_num.value == 5)||(document.form1.inp_type_critere_num.value == 6)) { // cas des intervalles
			    if ((borne_sup == "") || (borne_inf == "") || (parseFloat(borne_sup) < parseFloat(borne_inf))) { // on vérifie que la borne sup soit supérieur à la borne inf
			        parent.Popup_Alert(_("Erreur: La borne supérieur doit être supérieure à la borne inférieure"));
					return false;
				}
			}
			// "Egal à"
			if (document.form1.inp_type_critere_num.value == 3) {
				if(J("#inp_val_egal").attr("fValue"))
					borne_inf = J("#inp_val_egal").attr("fValue");
				else
					borne_inf = document.form1.inp_val_egal.value;
			}

			if ((document.form1.inp_val_cible) && (document.form1.inp_val_cible.value != '')) {
				valeur_cible = document.form1.inp_val_cible.value;
			}

			if (document.form1.inp_tol_sup.value != '') {
				tolerance_sup = document.form1.inp_tol_sup.value;
			}

			if (document.form1.inp_tol_inf.value != '') {
				tolerance_inf = document.form1.inp_tol_inf.value;
			}

			if (document.form1.inp_tol_egal.value != '') {
				tolerance_inf = document.form1.inp_tol_egal.value;
			}
			if ((document.form1.inp_type_critere_num.value == '4')||(document.form1.inp_type_critere_num.value == '6')||(document.form1.inp_type_critere_num.value == '5')) {
				type_critere_num = parseInt(document.form1.inp_range_type.value)+4;
			} else {
				type_critere_num = document.form1.inp_type_critere_num.value;
			}
			
			J.ajax({
			    url: _url('/code/asp/ajax/actions_MCS.asp'),
				async: false,
				cache: false,
				data:{
					sFunctionName :"Write_Numerical_Criterion",
				    id_cdc: ID_Cdc,
					id_critere_pere: id_critere_pere,
					id_critere: ID_Critere,
					id_pe: obj.attr("id_met"),
					type_critere_numerique: type_critere_num,
					critere_optimisation: ValeurButtonRadio(document.form1.optimisation),
					valeur_optimisation_cible: valeur_cible,
					id_unite_valeur_cible: document.form1.unite.value,
					critere_inf: critere_inf, borne_inf: borne_inf,
					tolerance_inf: tolerance_inf,
					id_unite_inf: document.form1.unite.value,
					critere_sup: critere_sup, borne_sup: borne_sup,
					tolerance_sup: tolerance_sup,
					id_unite_sup: document.form1.unite.value,
					selection: Type_SMC,
					empty_data: Empty_Data,
					save_database: save_database
				},
				success: function (aResult) {
				    obj.attr("id_c", aResult);
					obj.css("fontWeight","bold");
				}
			});
		} else if (Type_Critere == 7) { 
			if (document.form1.serie1.value == document.form1.serie2.value) {
			    parent.Popup_Alert(_("Erreur: Les séries doivent être différentes."));
				return false;															
			} else {
				var borne_inf = 0;
				var borne_sup = 0;
				var critere_inf = 0;
				var critere_sup = 0;
				var tolerance_sup = 0;
				var tolerance_inf = 0;
	
				// Supérieur à (valeur_inf renseigné)
				if ((document.form1.inp_type_critere_num.value == 1) || (document.form1.inp_type_critere_num.value == 4)) {		
					borne_inf = document.form1.inp_val_inf.value.replace(".",",");
					if (document.form1.inp_strict_inf.checked) {
						critere_inf = 1;
					} else {
					  critere_inf = 2;
					}
				}
	
				// "Inférieur à" (valeur_sup renseigné)
				if ((document.form1.inp_type_critere_num.value == 2) || (document.form1.inp_type_critere_num.value == 4)) {
					borne_sup = document.form1.inp_val_sup.value.replace(".",",");
					if (document.form1.inp_strict_sup.checked) {
						critere_sup = 1;
					} else {
					  critere_sup = 2;
					}
				}
	
				// "Egal à"
				if (document.form1.inp_type_critere_num.value == 3) {
					borne_inf = document.form1.inp_val_egal.value.replace(".",",");
				}
	
				if (document.form1.inp_tol_sup.value != '') {
					tolerance_sup = document.form1.inp_tol_sup.value;
				}
				
				if (document.form1.inp_tol_inf.value != '') {
					tolerance_inf = document.form1.inp_tol_inf.value;
				}
				
				if (document.form1.inp_tol_egal.value != '') {
					tolerance_inf = document.form1.inp_tol_egal.value;
				}
				
				abscissa_curve = document.form1.valeur_abcisse.value.replace(".",",");
				if (abscissa_curve=="") abscissa_curve = 0;
				
			J.ajax({
			    url: _url('/code/asp/ajax/actions_MCS.asp'),
				async: false,
				cache: false,
				data:{
				    sFunctionName :"Write_Graph_Criterion",
				    id_pe: obj.attr("id_met"),
				    id_cdc: ID_Cdc,
				    id_critere_pere: id_critere_pere,
				    id_critere: ID_Critere,
				    type_critere_numerique: document.form1.inp_type_critere_num.value,
				    critere_optimisation: 0,
				    valeur_optimisation_cible: 0,
				    id_unite_valeur_cible: 0,
				    critere_inf: critere_inf,
				    borne_inf: borne_inf,
				    tolerance_inf: tolerance_inf,
				    id_unite_inf: document.form1.unite.value,
				    critere_sup: critere_sup,
				    borne_sup: borne_sup,
				    tolerance_sup: tolerance_sup,
				    id_unite_sup: document.form1.unite.value,
				    abscisse_courbe: abscissa_curve,
				    id_colx: document.form1.serie2.value,
				    id_coly: document.form1.serie1.value,
				    courbe_existe: true,
				    selection: Type_SMC,
				    empty_data: Empty_Data,
				    save_database: save_database
				},
				success: function (aResult) {
				    obj.attr("id_c", aResult);
					obj.css("fontWeight","bold");
				}	
			});
			}
		}
				
		Modif_Critere = false;
		return true;
		
	} else {
		return false;
	}
}

function Criterion_OnClick(val){
	if (val == 0){
		Modif_Critere = true;
		J('#interieur_critere').css('display','none');
		J('#id_select_mcs_no_data option[value="0"]').attr('selected','selected');
		J('#id_select_mcs_no_data').attr('disabled','disabled');
	}
	else if (val == 1){
		Modif_Critere = true;
		J('#interieur_critere').css('display','block');
		J('#id_select_mcs_no_data').removeAttr('disabled');
		J('#id_select_mcs_no_data option[value="0"]').attr('selected','selected');
		
	}
}

function DisplayMCSGraphique(aIdAttribute) {
    J.ajax({
        url: _url('/code/asp/ajax/actions_MCS.asp'),
        async: false,
        cache: false,
        data: {
            sFunctionName: "DisplayMCSGraphique",
            idAttribute: aIdAttribute
        },
        success: function (aResult) {
            J("#representation_valeur").html(aResult);
        }
    })
}

function Convert_Unit_SMC(ID, ID_Unite_New) {
    if ((J('#inp_val_' + ID).length != 0) && (J('#inp_val_' + ID).val() != '')) {
        sValue = J('#inp_val_' + ID).val();
        sUnit_Old = J('#id_unite_old_' + ID).attr('value');
        J.ajax({
            url: _url('/code/asp/ajax/actions_MCS.asp'),
            cache: false,
            data: {
                sFunctionName: "Convert_Unit",
                Value: sValue,
                ID_Unit_Old: sUnit_Old,
                ID_Unit_New: ID_Unite_New
            },
            success: function (aResult) {
                J('#inp_val_' + ID).val(aResult);
            }
        });
    }
    J('#id_unite_old_' + ID).val(ID_Unite_New);
}