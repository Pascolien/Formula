/* La fonction Counter prend un seul paramêtre: l'id de la <div> qui doit apparaître lors du cochage de la checkbox */
var id_current_cg;

function Execute_CG_JQUERYTOCORRECT(id_cg, type) {
	// On va lister toutes les questions de type INPUT ou SELECT 	
	SL_CG_Question = J('#general').find('input,select,textarea');
 	SL_Answer = '';
	for (i=0; i<= SL_CG_Question.length -1;i++) {
		rQuestion = SL_CG_Question.eq(i);
		if (rQuestion.attr("name") && (rQuestion.attr("name").slice(0, 6) == 'inpCG_') && ((rQuestion.val()) != '') && ((rQuestion.val()) != null)) {
			ID_Q = rQuestion.attr("name").substr(6, rQuestion.attr("name").length);
			if (rQuestion.attr("qtype") in {'1':'', '2':'', '3':'', '5':''}) { // qtGroup, qtNumerical, qtText
				Valeur = (rQuestion.val());
				if (rQuestion.attr("qtype") == '2') {
					if (Valeur.charAt(0) == '#') {
					  Valeur = Valeur.subStr(1,Valeur.length-1);            
					} 
					if (Valeur.charAt(Valeur.length-1) ==  '#') {
					  Valeur = Valeur.SubStr(0,Valeur.length-1);
					}
					Valeur.replace('#','<v>');
				} 
				Criteria_Answer = (rQuestion.val());
			} else if (rQuestion.attr("qtype") == '0') {
				if (rQuestion.is(':checked')) {
					Criteria_Answer = 'true';						
				} else {
					Criteria_Answer = 'false';
				}
			} else if (rQuestion.attr("qtype") == '8') {
				Criteria_Answer = (rQuestion.val());
 			} else if (rQuestion.attr("qtype") == '4') { // qtNumerical_Range 
				if (((SL_CG_Question.eq(i+1).val()) != '') && (parseFloat((SL_CG_Question.eq(i+1)).val()) >= parseFloat((SL_CG_Question.eq(i+1)).val()))) { 
					Criteria_Answer = (rQuestion.val())+'<v>'+ (SL_CG_Question.eq(i+1).val());
				} else {
				    parent.Popup_Alert(_Fmt("Le min (ou le max) du champ '#1' est rempli alors que le max (ou le min) ne l'est pas ! Les modifications ne seront pas enregistrées.", [rQuestion.attr("codage_nom")]));
					return;
				}   			
				i = i + 1;
 			} else if (rQuestion.attr("qtype") == '6') { 	
				Criteria_Answer = '';
				if (rQuestion.attr("qtype_criteria") in {'50':'', '51':'', '52':'', '80':'', '81':'', '6':'' }) {
					if ((J('#unite_'+ID_Q) && (J('#unite_'+ID_Q).val() != ''))) {
						ID_Unite = J('#unite_'+ID_Q).val(); 
					} else {
						ID_Unite = 0;
					}	
					if (J("#inp_type_critere_num_"+ID_Q).val() == 0) 
						continue;
					Criteria_Answer = Criteria_Answer + J("inp_type_critere_num_"+ID_Q).val() + '<v>';
					Criteria_Answer = Criteria_Answer + J("#inp_type_critere_num_"+ID_Q).val() + '<v>';
					if ((J("#inp_type_critere_num_"+ID_Q).val() == '1') || (J("#inp_type_critere_num_"+ID_Q).val() == '4')) { // supérieur à (ou intervalle)
						bDate = J("#inp_val_inf_"+ID_Q).attr("fvalue");

						if (J("#inp_val_inf_"+ID_Q).val() != "" || J("#inp_val_inf_"+ID_Q).attr("fvalue") != ""){
							Criteria_Answer = Criteria_Answer + J('#inp_strict_inf_'+ID_Q).is(':checked') + '<v>';
							if (bDate)
								Criteria_Answer = Criteria_Answer + J('#inp_val_inf_'+ID_Q).attr("fvalue") + '<v>';
							else
								Criteria_Answer = Criteria_Answer + J('#inp_val_inf_'+ID_Q).val() + '<v>';
							
							if (J("#inp_tol_inf_"+ID_Q).val() != "")
								Criteria_Answer = Criteria_Answer + J('#inp_tol_inf_'+ID_Q).val() + '<v>';
							else
								Criteria_Answer = Criteria_Answer + '0<v>';
							Criteria_Answer = Criteria_Answer + ID_Unite + '<v>';
						}
					} else if (J("#inp_type_critere_num_"+ID_Q).val() == '2') {
						Criteria_Answer = Criteria_Answer + '<v><v><v><v>';
					}                                                    
					if ((J("#inp_type_critere_num_"+ID_Q).val() == '2') || (J("#inp_type_critere_num_"+ID_Q).val() == '4')) { // inférieur à (ou intervalle)
						if (J("#inp_val_sup_"+ID_Q).val() != ""){
							Criteria_Answer = Criteria_Answer + J('#inp_strict_sup_'+ID_Q).is(':checked') + '<v>';
							Criteria_Answer = Criteria_Answer + J('#inp_val_sup_'+ID_Q).val() + '<v>';
							if (J("#inp_tol_sup_"+ID_Q).val() != "")
								Criteria_Answer = Criteria_Answer + J('#inp_tol_sup_'+ID_Q).val() + '<v>';
							else
								Criteria_Answer = Criteria_Answer + '0<v>';
							Criteria_Answer = Criteria_Answer + ID_Unite + '<v>';
						}
					}				
	
					if (J("#inp_type_critere_num_"+ID_Q).val() == '3') { // egal à 
						if (J("#inp_val_egal_"+ID_Q).val() != ""){
							Criteria_Answer = Criteria_Answer + 'false<v>';
							Criteria_Answer = Criteria_Answer + J('#inp_val_egal_'+ID_Q).val() + '<v>';
							if (J("#inp_tol_egal_"+ID_Q).val() != "")
								Criteria_Answer = Criteria_Answer + J('#inp_tol_egal_'+ID_Q).val() + '<v>';
							else
								Criteria_Answer = Criteria_Answer + '0<v>';
							Criteria_Answer = Criteria_Answer + ID_Unite + '<v>';
						}
					}
					
					if ((J("#inp_type_critere_num_"+ID_Q).val() == '1') || (J("#inp_type_critere_num_"+ID_Q).val() == '3')) {
						Criteria_Answer = Criteria_Answer + '<v><v><v><v>';
					}
					
					if (rQuestion.attr("qtype_criteria") == '6') {
						Criteria_Answer = Criteria_Answer + J('#serie2_'+ID_Q).val() + '<v>';
						Criteria_Answer = Criteria_Answer + J('#serie1_'+ID_Q).val() + '<v>';	
						Criteria_Answer = Criteria_Answer + J('#valeur_abcisse_'+ID_Q).val() + '<v>';	
					} else {
						Criteria_Answer = Criteria_Answer + '<v><v><v>';
					}
				}
				
				if (rQuestion.attr("qtype_criteria") == '-1') {
					Criteria_Answer = J('#id_e_coche_abs_'+ID_Q).val();
					Criteria_Answer = Criteria_Answer.replace(/;/g,'<v>');
					Criteria_Answer = Criteria_Answer.replace(/<v><v>/g,'<v>');
					Criteria_Answer = Criteria_Answer.substr(3,Criteria_Answer.length - 6);
				}   								
			}
		
			if ((Criteria_Answer != '') && (Criteria_Answer != '<v>')) {
				SL_Answer = SL_Answer + ID_Q + '|' + Criteria_Answer + '||';
			}
		}
	}		
	
	// Permet de supprimer les "||" à la fin de la chaine
	if (SL_Answer.length > 0) {                                                                       	
		SL_Answer = SL_Answer.substr(0, SL_Answer.length - 2);
	} 
	if (type == 'run') {
		// On envoi les réponses à l'API pour qu'elle génère le GdC et calcul les résultats.
        J.ajax({
            url: _url('/code/asp/ajax/actions_Choice_Guide.asp'),
			async:false,
	        cache:false,
			type:'post',
			dataType:'script',
			data:{ 
				sFunctionName :"Create_MCS_From_CG",
				id_cg : id_cg, 
				values: SL_Answer 
			},
			success:function(aResult){
			    id_rl = aResult;
			}
		});
	 	if (id_rl!=0) {
			parent.Display_Popup_MCS(0,id_rl,"resultats",true);
		} else {
			parent.Popup_Alert("Error in generation of the requirement list.");
		}
	} else if (type == 'extract') {	
		if (Check_IE()) { 
			J.ajax({
			    url: _url('/code/asp/ajax/actions_Choice_Guide.asp'),
				dataType:'script',
				async:false,
				cache:false,
				data:{
					sFunctionName :"Extract_CG_To_Word",
					id_cg:id_cg,
					values:SL_Answer
				}
			});
		} else {
		    Popup_Alert(_("Cette fonction n'est disponible que sous Internet Explorer."));
		}
	} else if (type == 'export') {
	    frames['hiddenFrame'].location.replace(_url('/code/asp/ajax/export_cg_to_xml.asp?id_cg=') + id_cg + '&values=' + SL_Answer, 'ExtractCG', 'height=50,width=50,toolbar=no,menubar=no');
	}
}


function Execute_CG(id_cg, type) {
	// On va lister toutes les questions de type INPUT ou SELECT 	
 	SL_CG_Question = $('general').select('input', 'select', 'textarea');
 	SL_Answer = '';
	for (i=0; i<= SL_CG_Question.length -1;i++) {
		rQuestion = SL_CG_Question[i];

		if ((rQuestion.name.slice(0, 6) == 'inpCG_') && ($F(rQuestion) != '') && ($F(rQuestion) != null)) {
			ID_Q = rQuestion.name.substr(6, rQuestion.name.length);
			if (rQuestion.getAttribute("qtype") in {'1':'', '2':'', '3':'', '5':''}) { // qtGroup, qtNumerical, qtText
				Valeur = $F(rQuestion);
				if (rQuestion.getAttribute("qtype") == '2') {
					if (Valeur.charAt(0) == '#') {
					  Valeur = Valeur.subStr(1,Valeur.length-1);            
					} 
					if (Valeur.charAt(Valeur.length-1) ==  '#') {
					  Valeur = Valeur.SubStr(0,Valeur.length-1);
					}
					Valeur.replace('#','<v>');
				} 
				Criteria_Answer = $F(rQuestion);
			} else if (rQuestion.getAttribute("qtype") == '0') {
				if (rQuestion.checked) {
					Criteria_Answer = 'true';						
				} else {
					Criteria_Answer = 'false';
				}
			} else if (rQuestion.getAttribute("qtype") == '8') {
				Criteria_Answer = $F(rQuestion);
 			} else if (rQuestion.getAttribute("qtype") == '4') { // qtNumerical_Range
				if (($F(SL_CG_Question[i+1]) != '') && (parseFloat($F(SL_CG_Question[i+1])) >= parseFloat($F(SL_CG_Question[i])))) { 
					Criteria_Answer = $F(rQuestion)+'<v>'+ $F(SL_CG_Question[i+1]);
				} else {
				    parent.Popup_Alert(_Fmt("Le min (ou le max) du champ '#1' est rempli alors que le max (ou le min) ne l'est pas ! Les modifications ne seront pas enregistrées.", [rQuestion.getAttribute("codage_nom")]));
					return;
				}   			
				i = i + 1;
 			} else if (rQuestion.getAttribute("qtype") == '6') { 	
				Criteria_Answer = '';
				if (rQuestion.getAttribute("qtype_criteria") in {'50':'', '51':'', '52':'', '80':'', '81':'', '6':'' }) {
					if (($('unite_'+ID_Q) && ($('unite_'+ID_Q).value != ''))) {
						ID_Unite = $('unite_'+ID_Q).value; 
					} else {
						ID_Unite = 0;
					}	
					if (!$("inp_type_critere_num_"+ID_Q) || $("inp_type_critere_num_"+ID_Q).value == 0) continue;
					Criteria_Answer = Criteria_Answer + $("inp_type_critere_num_"+ID_Q).value + '<v>';
					
					if (($("inp_type_critere_num_"+ID_Q).value == '1') || ($("inp_type_critere_num_"+ID_Q).value == '4')) { // supérieur à (ou intervalle)
						if ($("inp_val_inf_"+ID_Q).value != ""){
							Criteria_Answer = Criteria_Answer + $('inp_strict_inf_'+ID_Q).checked + '<v>';
							Criteria_Answer = Criteria_Answer + $('inp_val_inf_'+ID_Q).value + '<v>';
							
							if ($("inp_tol_inf_"+ID_Q).value != "")
								Criteria_Answer = Criteria_Answer + $('inp_tol_inf_'+ID_Q).value + '<v>';
							else
								Criteria_Answer = Criteria_Answer + '0<v>';
							Criteria_Answer = Criteria_Answer + ID_Unite + '<v>';
						}
					} else if ($("inp_type_critere_num_"+ID_Q).value == '2') {
						Criteria_Answer = Criteria_Answer + '<v><v><v><v>';
					}                                                    
								
					if (($("inp_type_critere_num_"+ID_Q).value == '2') || ($("inp_type_critere_num_"+ID_Q).value == '4')) { // inférieur à (ou intervalle)
						if ($("inp_val_sup_"+ID_Q).value != ""){
							Criteria_Answer = Criteria_Answer + $('inp_strict_sup_'+ID_Q).checked + '<v>';
							Criteria_Answer = Criteria_Answer + $('inp_val_sup_'+ID_Q).value + '<v>';
							if ($("inp_tol_sup_"+ID_Q).value != "")
								Criteria_Answer = Criteria_Answer + $('inp_tol_sup_'+ID_Q).value + '<v>';
							else
								Criteria_Answer = Criteria_Answer + '0<v>';
							Criteria_Answer = Criteria_Answer + ID_Unite + '<v>';
						}
					}				
	
					if ($("inp_type_critere_num_"+ID_Q).value == '3') { // egal à 
						if ($("inp_val_egal_"+ID_Q).value != ""){
							Criteria_Answer = Criteria_Answer + 'false<v>';
							Criteria_Answer = Criteria_Answer + $('inp_val_egal_'+ID_Q).value + '<v>';
							if ($("inp_tol_egal_"+ID_Q).value != "")
								Criteria_Answer = Criteria_Answer + $('inp_tol_egal_'+ID_Q).value + '<v>';
							else
								Criteria_Answer = Criteria_Answer + '0<v>';
							Criteria_Answer = Criteria_Answer + ID_Unite + '<v>';
						}
					}
					
					if (($("inp_type_critere_num_"+ID_Q).value == '1') || ($("inp_type_critere_num_"+ID_Q).value == '3')) {
						Criteria_Answer = Criteria_Answer + '<v><v><v><v>';
					}
					
					if (rQuestion.getAttribute("qtype_criteria") == '6') {
						Criteria_Answer = Criteria_Answer + $('serie2_'+ID_Q).value + '<v>';
						Criteria_Answer = Criteria_Answer + $('serie1_'+ID_Q).value + '<v>';
						Criteria_Answer = Criteria_Answer + $('valeur_abcisse_'+ID_Q).value + '<v>';	
					} else {
						Criteria_Answer = Criteria_Answer + '<v><v><v>';
					}
				}
				
				if (rQuestion.getAttribute("qtype_criteria") == '-1') {
					Criteria_Answer = $('id_e_coche_abs_'+ID_Q).value;
					Criteria_Answer = Criteria_Answer.replace(/;/g,'<v>');
					Criteria_Answer = Criteria_Answer.replace(/<v><v>/g,'<v>');
					Criteria_Answer = Criteria_Answer.substr(3,Criteria_Answer.length - 6);
				}   								
			}
		
			if ((Criteria_Answer != '') && (Criteria_Answer != '<v>')) {
				SL_Answer = SL_Answer + ID_Q + '|' + Criteria_Answer + '||';
			}
		}
	}		
	
	// Permet de supprimer les "||" à la fin de la chaine
	if (SL_Answer.length > 0) {                                                                       	
		SL_Answer = SL_Answer.substr(0, SL_Answer.length - 2);
	} 
	
	if (type == 'run') {
		// On envoi les réponses à l'API pour qu'elle génère le GdC et calcul les résultats.
		J.ajax({
		    url:_url('/code/asp/ajax/actions_Choice_Guide.asp'),
			async:false,
	        cache:false,
			type:'post',
			dataType:'script',
			data:{ 
				sFunctionName :"Create_MCS_From_CG",
				id_cg : id_cg, 
				values: SL_Answer 
			},
			success:function(aResult){
			    id_rl = aResult;
			}
		});
		if (id_rl != 0) {
		    parent.txASP.wdowContainer.getWindow("wChoiceGuide").hide();
		    parent.txASP.displayMCS({ idRequirementSet: id_rl, sTab: "resultats", bFromCG: true });
		    parent.txASP.wdowContainer.getWindow("wChoiceGuide").show();
		} else {
	 	    parent.msgWarning("Error in generation of the requirement list.");
		}
	} else if (type == 'extract') {	
		if (Check_IE()) { 
			J.ajax({
			    url: _url('/code/asp/ajax/extract_cg_to_word.asp'),
			    cache: false,
				dataType:'script',
				data:{
					id_cg:id_cg,
					values:SL_Answer
				}
			});
		} else {
		    parent.Popup_Alert(_("Cette fonction n'est disponible que sous Internet Explorer."));
		}
	} else if (type == 'export') {
	    frames['hiddenFrame'].location.replace(_url('/code/asp/ajax/export_cg_to_xml.asp?id_cg=') + id_cg + '&values=' + SL_Answer, 'ExtractCG', 'height=50,width=50,toolbar=no,menubar=no');
	}
}

// Permet de cocher ou décocher une liste de checkbox dans une question de type choix multiple
function GDC_CheckAll(id, Value) {				
	for (i=0;i<=J("[name='inpCG_"+id+"_detail']").length-1;i++) {
		if (Jn('inpCG_'+id+'_detail').eq(i).is(':checked') != Value) {
			Jn('inpCG_'+id+'_detail').eq(i).prop("checked",Value); 
			UpdateList(Jn('inpCG_'+id+'_detail').eq(i),id);     
		}           		
	}
}	

function UpdateOpenGroups(list_id) {
	Arr = list_id.split('<v>');
	for (var i=0; i< Arr.length; i++) {  
		if (Arr[i] != '') {             
			UpdateGroup(Arr[i], true);
		}
	}
}

function UpdateGroup(id, is_open) {
  if (is_open) {  
		nb_elems = J('#cg_q'+id + ' input').length + J('#cg_q'+id + ' select').length + J('#cg_q'+id + ' textarea').length; 
		if (nb_elems > 1) {		
    	J('#cg_q'+id).css("display","block");
    	J('#div_'+id).css("display","block");    
		}      
		Jn('inpCG_'+id).eq(0).prop("checked",true);
  } else {      
    J('#cg_q'+id).css("display","none");
    Jn('inpCG_'+id).eq(0).prop("checked",false);
  }
}

function UpdateOpenCloseGroup(selectBox, id) {
	for (var i=1; i<selectBox.options.length; i++) {
		obj = selectBox.options[i];
		UpdateGroup(J(obj).val(), false);
	}  
	sOptionSelected = J("#id_select_cg_"+id).val();
	UpdateGroup(sOptionSelected, true);
}

function UpdateList(obj, id) {
	inp = J('#inpCG_'+id);
	UpdateGroup(J(obj).val(), J(obj).prop("checked"));
	if (J(obj).is(':checked')) {
		inp.val(inp.val() + J(obj).val() + '<v>');
	} else {
	    chaine_tmp = inp.val();
		sSearch = J(obj).val() + '<v>';
		pos = chaine_tmp.indexOf(sSearch);
		sNewVal = chaine_tmp.substr(0, pos) + chaine_tmp.substr(pos + sSearch.length, chaine_tmp.length);
		inp.val(sNewVal);
	}	 
}

function Counter(id, obj_inp) {
	/* Ouverture de la div lors du cochage de la checkbox */
	if (J(obj_inp).is(':checked')) {
		J("#"+id).css('display','block');
		J("#"+id).css('height','auto');
	} else{
		J("#"+id).css('display','none');
		J("#"+id).css('height','0');		

		/* Réinitialisation des <input> */
		var taille =  J("#"+id).find('div').length;      
		var t_input = J("#"+id).find('input');      
		for (var m = 0 ; m <= t_input.length -1; m ++) { 
			sTemp = t_input.eq(m).attr("name");		  
			if (sTemp.substr(0,15) == "id_tree_lien_te") {
				Supprimer_Donnee(t_input.eq(m).val(), 'f1');
			} else if (t_input.eq(m).attr("spe") == "gdc") {
				if (t_input.eq(m).attr("type") == 'checkbox') {
					t_input.eq(m).prop("checked",false);
				} else if (t_input.eq(m).attr("type") == 'text') {
					t_input.eq(m).val("");
				} else if (t_input.eq(m).attr("type") == 'radio') {
					t_input.eq(m).prop("checked",false);
				} else if ((t_input.eq(m).attr("type") == 'hidden') && (t_input.eq(m).attr("valeur_defaut") != "true")) {
					t_input.eq(m).val("");
				}
			}
		}

		/* Réinitialisation des <select> */  
		var t_select = J("#"+id).find('select');    
		for (var p = 0 ; p <= t_select.length -1; p ++) {
			if (t_select.eq(p).attr("spe") == "gdc") {
				t_select.eq(p).val("");
			}
		}

		/* Réinitialisation des <textarea> */
		var t_textarea = J("#"+id).find('textarea');
		for (var q = 0 ; q <= t_textarea.length -1; q ++) {
			if (t_textarea.eq(q).attr("spe") == "gdc") {
				t_textarea.eq(q).val("");
			}
		}
		
	}
}

function Reset_CG(){
    location.reload();
}
