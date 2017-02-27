// JavaScript Document

var page_id_gc_select;
var page_id_cdc;
var calcul_a_refaire = true;
var tab_result;
var tab_entete;
var confirmTEST = false;

function UpdateTextCdc() {
	calcul_a_refaire = true;
	J.ajax({
	    url: _url('/code/asp/ajax/actions_MCS.asp'),
		async: false,
        cache: false,
		data:{
			sFunctionName :"Get_HTML_Text_CDC",
			id_cdc: page_id_cdc
		},
		success: function (aResult) {
		    J('#smc_text_cdc').html(aResult);
		}
	});
}

function selectionGC(obj) {
	obj = J(obj);
	try{
		if (obj != null) {
			// On active ou désactive les boutons
			page_id_gc_select = obj.attr("id").substr(3,obj.attr("id").length);
			if (page_id_gc_select == page_id_cdc) {
				J("#btn_modifGC").attr("disabled", "disabled");
				J("#btn_supprGC").attr("disabled", "disabled");
			} else {
			  J("#btn_modifGC").removeAttr("disabled");
		      J("#btn_supprGC").removeAttr("disabled");
			}
		}
		// on remets en transparent tous les autres objets :
		var elts = Jclass('sp_nom_gc', 'div', J('#smc_text_cdc'));
		for(var i = 0 ; i <  elts.length ; i++) {
			J(elts[i]).css("backgroundColor",'transparent');
		}
		if (obj != null) {
			obj.css("backgroundColor",'#cccccc');
		}
	}catch(e){}
}

function AfficherCDC() {
	J('#onglet_cdc').attr('class','selected');
	J('#onglet_resultat_detaille').removeAttr('class');
	J('#smc_affiche_cdc').css('display','block');
	J('#smc_affiche_resultat_detaille').css('display','none');
	J('#affichage_resultat').css('display','none');
	J('#btn_export').css('display','none');
	J('#table_mcs_view_filtered').css('display','none');
	J('#table_mcs_view').css('display','block');
	J('#btn_smc_all').css('display','none');
	J('#btn_smc_selection').css('display','block');
	J("#inp_mcs_view").removeAttr("disabled");
}

function AfficherResult() {
	J('#onglet_cdc').removeAttr('class');
	J('#smc_affiche_cdc').css('display','none');
	J('#affichage_resultat').css('display','block');
	J('#btn_export').css('display','block');
	J('#onglet_resultat_detaille').attr('class','selected');
	J('#smc_affiche_resultat_detaille').css('display','block');
}

function LancerCalcul() {
	AfficherResult();
	J("#table_mcs_view_filtered").css("display","none");
	J("#table_mcs_view").css("display","block");
	aff_elt_rejete = J('#inp_mcs_view').is(':checked');
	J('#table_mcs_view').html('<div style="width: 100%; text-align:center;"><img src="' + _url("/resources/theme/img/gif/ajax-loader.gif") + '" /></div>');
	
	J.ajax({
	    url: _url('/code/asp/ajax/actions_MCS.asp'),
		async: false,
		cache: false,
		data:{
			sFunctionName :"Get_HTML_MCS_Detailed_View",
			id_cdc: page_id_cdc,
			aff_elt_rejete: aff_elt_rejete
		},
		success: function (aResult) {
		    J('#table_mcs_view').html(aResult);
		}
	});
}

function AfficherEltIncertain() {
	if (EltIncertainAff) {
		var elts = J('div.smc_tr_r');
		for(var i=0; i<elts.length; i++) {
		  if ((J(elts[i]).css("display") == 'block') || (J(elts[i]).css("display") == '')) { // si la ligne est affiché on veux la cacher
		    J(elts[i]).css("display",'none'); // valable dans tous les cas
			} else { // si la ligne est caché on veux l'affiché sauf si "Ne voir que les Entités cochées" est cochées et que l'entité en question n'est pas coché
			  if ((Jn('elt_cocher').eq(0).is(':checked') == false) || (Jn('elt_cocher').eq(0).is(':checked')) && (J(elts[i]).attr("id").down(1).is(':checked'))) {
					J(elts[i]).css("display",'block');
				}
			}
		}
		
		elts = Jclass('smc_tr_i', 'div', J('#resultat_smc'));
		for(i=0; i<elts.length; i++){
		  if ((J(elts[i]).css("display") == 'block') || (J(elts[i]).css("display") == ''))  {
		    J(elts[i]).css("display",'none');
			} else {
			  if ((Jn('elt_cocher').eq(0).is(':checked') == false) || (Jn('elt_cocher').eq(0).is(':checked')) && (J(elts[i]).attr("id").down(1).is(':checked'))) {
					J(elts[i]).css("display",'block');
				}
			}
		}
	} else {
		EltIncertainAff = true;

        J.ajax({
            url: _url('/code/asp/ajax/actions_MCS.asp'),
			async: false,
			cache: false,
			data:{
				sFunctionName :"Get_HTML_MCS_Detailed_View",
				id_cdc: page_id_cdc, 
				aff_elt_rejete : 'true'
			},
			success: function (aResult) {
			    J('#resultat_smc_int').html(J('#resultat_smc_int').html() + aResult);
			}
		});			
	}
}

function ResultSMC_CheckAll(check_value) {
	var sID_Grid = "current_mcs_treegrid";
	if (J("#table_mcs_view").css("display") == "block"){
		current_mcs_treegrid.setCheckedRows(0,check_value);
	} else {
		sID_Grid = "current_mcs_treegrid_flt";
		current_mcs_treegrid_flt.setCheckedRows(0,check_value);
		current_mcs_treegrid.setCheckedRows(0,check_value);		
	}
	Grid_Check_All(sID_Grid,check_value);
}

function select_valeur_cmb(obj1, obj2) {
	if (confirmTEST) {
	    if (confirm(_("Attention le Cahier des Charges en cours n'est pas enregistré. Voulez-vous quand même changer de Type d'Entités ?"))) {
			bOk = true;
		} else {
			bOk = false;		
		}	
	} else {
		bOk = true;
	}
	if (bOk) {
		ID_TE_cmb = J(obj2).attr("ident");
		J("#"+obj1).html(J(obj2).html());
		document.form1.id_te.value = (ID_TE_cmb);
		document.form1.id_cdc.value =(0);
		document.form1.submit();
	}
}

function smc1(obj) {
	id = obj.attr("id_e");
	if (obj.is(':checked')) { // Lorsqu'on coche une checkbox		
		if (J('#entite_select').val().indexOf(';'+id+';') == -1) {
			J('#entite_select').val(J('#entite_select').val() + id + ';');
		}
	} else { // Lorqu'on décoche une checkbox
		J('#entite_select').val(Verif_Liste(J('#entite_select').val(), id));
	}
}

function MCSResultsToExcel() {
    J.ajax({
        url: _url('/code/asp/ajax/actions_grid.asp'),
        async: false,
        cache: false,
        data: {
            sFunctionName: "Run_MCSResultsSimplifiedExportation",
            bDisplay_Wrong_Mark: J("#inp_mcs_view").is(":checked")
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] === sOk) {
                var sPathFile = results[1];
                // Create new iframe (only if not already created)
                if (!J('#iFrameUploadExport').length) {
                    J('body').append('<iframe id="iFrameUploadExport" name="iFrameUploadExport" src="#" style="width:0;height:0;border:0px solid #fff; display:none;"></iframe>');
                }
                J('#iFrameUploadExport')[0].contentDocument.location.replace(_url("/code/asp/ajax/open_file.asp?file=") + sPathFile);
            } else
                msgDevError(results[0]);
        }
    });
}

function Open_Treegrid_Object(AID) {
	J.ajax({
	    url: _url('/code/asp/ajax/actions_MCS.asp'),
		async: false,
		cache: false,
		data : { 
			sFunctionName :"Get_Ids_SMC",
			id_tree: id_mygrid, 
			list_id: AID 
		},
		success: function (aResult) {
		    id_obj = aResult;
		}
 	});
	msg = '';
    
	if (msg == '') {
		parent.navigation(0, id_obj, 'search', false);
	} else {
		Popup_Alert(msg);
	}
}

function Filter_Results(AMode){
	var rowValue,rowValues;
	var dataGrid;
	if (AMode){
		
		current_mcs_treegrid_flt.clearAll();
		checkedIDs = current_mcs_treegrid.getCheckedRows(0);
		if (checkedIDs != ""){
			J("#table_mcs_view").css("display","none");
			J('#div_loading').css('display','block');
			J("#btn_smc_selection").css("display","none");
			J("#inp_mcs_view").attr("disabled",'disabled');
			J("#btn_smc_all").css("display","block");
			var SL_checkedIDs =  checkedIDs.split(",");
			rowValues = "";		
			for(var i=0; i< SL_checkedIDs.length; i++){
				rowValue = SL_checkedIDs[i]+",";
				if (rowValues == "") rowValues = rowValue;
				else rowValues = rowValues +"|"+ rowValue;
			}
			
			J.ajax({
				url: _url('/code/asp/ajax/actions_grid.asp'),
				async: false,
				cache: false,
				data : { sFunctionName:"Get_Grid_Values_Filtered",
					     grid_values:rowValues },
				success: function (aResult) {
				    current_mcs_treegrid_flt.parse(aResult);
					current_mcs_treegrid_flt.setCheckedRows(0,true);
					current_mcs_treegrid_flt.setColLabel(1, col_label+" ("+current_mcs_treegrid_flt.getRowsNum()+")");
					Grid_OnCheck("current_mcs_treegrid_flt");
					J('#div_loading').css('display','none');
					J('#table_mcs_view_filtered').css('display','block');
				}
			});
			
		}
	} else {
		J("#table_mcs_view").css("display","block");
		J("#table_mcs_view_filtered").css("display","none");
		J("#btn_smc_selection").css("display","block");
		J("#btn_smc_all").css("display","none");
		J("#inp_mcs_view").removeAttr("disabled");
		current_mcs_treegrid_flt.clearAll();
	}
}

function Fct_Loading() {
	bCalculNbResult = true;
	J('#div_loading').css('display','block');
	J('#table_mcs_view').css('display','none');
}

function Fct_Unloading() {
	bCalculNbResult = false;
	J('#table_mcs_view').css('display','block');
	J('#div_loading').css('display','none');
}

function Exportation() {
	J.ajax({            
		url: _url('/code/asp/ajax/actions_Treeview.asp'),
		async: false,
		cache: false,
		data:{
			sFunctionName :"Get_IDs_From_IDs_Fictives",
			id_tree: id_mygrid,
			id_ot:ID_TE_cmb,
			list_id: ''
		},
		success: function (aResult) {
		    parent.txASP.displayExportation(ID_TE_cmb, aResult);
		}
	});
}

function Extraction(AUse_IE) {
	list_id_obj = '';	
	if (J("#table_mcs_view").css("display") == "block"){
		checkedIDs = current_mcs_treegrid.getCheckedRows(0);
	} else {
		checkedIDs = current_mcs_treegrid_flt.getCheckedRows(0);	
	}

	J.ajax({
	    url: _url('/code/asp/ajax/actions_MCS.asp'),
		async: false,
		cache:false,
		data : {
			sFunctionName :"Get_Ids_SMC",
			id_tree: id_mygrid, 
			list_id: checkedIDs 
		},
		success: function (aResult) {
		    list_id_obj = aResult;
			if (AUse_IE) {
			    if (Check_IE()) {
			        parent.txASP.wdowContainer.getWindow("wMCS").setModal(false);
				    parent.txASP.displayExtraction(ID_TE_cmb, list_id_obj);
				} else { 
				    msgWarning(_("Cette fonction n'est disponible que sous Internet Explorer !"));
				}
			} else if ((list_id_obj != ';') && (list_id_obj != '')) {
			    //parent.txASP.wdowContainer.getWindow("wMCS").hide();
			    //parent.txASP.wdowContainer.getWindow("wMCS").setModal(false);
			    parent.txASP.displayExtraction(ID_TE_cmb, list_id_obj);
			    //parent.txASP.wdowContainer.getWindow("wMCS").show();
			} else {
			    msgWarning(_("Aucune Entité sélectionnée."));
			}
		}
	});
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

function Supprimer_GC(ok, type){
	if (type == 'gc') {
		J.ajax({
		    url: _url('/code/asp/ajax/actions_MCS.asp'),
			async: false,
			cache:false,
			data : { 
				sFunctionName :"Delete_CDC",
				id_gc: page_id_gc_select 
			}
		});
		UpdateTextCdc();
		selectionGC(J('#gc_'+page_id_cdc));
	} else {
		J.ajax({
		    url: _url('/code/asp/ajax/actions_MCS.asp'),
			async: false,
            cache:false,
			data: { 
				sFunctionName :"Delete_CDC",
				id_gc: page_id_cdc 
			},
			success:function(){
			    location.replace(_url("/code/asp/mcs.asp?id_cdc=0&id_te=" + id_ot_pending));
			}
		});
	}
}

function SupprimerGC(type) {
	if (type == 'gc') { // Supprimer du GC
	    msgOkCancel(_("Etes-vous sûr de vouloir supprimer ce groupe de critères, tous les critères et tous les sous-groupes de critères qu'il contient ?"), Supprimer_GC, ["gc"]);
	} else { // Supprimer le CDC
	    msgOkCancel(_("Etes-vous sûr de vouloir supprimer ce Cahier des Charges et tous les Groupes de Critères qu'il contient ?"), Supprimer_GC);
	}
}

function Export_RL_To_XML() { 
    parent.window.open(_url('/code/asp/ajax/export_rl_to_xml.asp?id_rl=' + page_id_cdc));
}

function onClickSaveRequirementSet(aMessage){
    Popup_Alert(aMessage, "EnregistrerCDC()");
}

function EnregistrerCDC(aMessage) {
	confirmTEST = false;
	ID_New_RL = 0;
	J.ajax({
	    url: _url('/code/asp/ajax/actions_MCS.asp'),
		async:false,
		cache:false,
		data: {
			sFunctionName :"Write_MCS_RL",
			id_cdc: page_id_cdc 
		},
		success: function (aResult) {
		    ID_New_RL = aResult;
			if (ID_New_RL > 0) {
			    window.document.location.replace(_url("/code/asp/mcs.asp?id_cdc=" + ID_New_RL));
			} else {
				parent.Popup_Alert("Error 1");
			}
		}
	});
}

function ExpressionLitteraireCDC() {
	parent.window.open('ajax/actions_MCS.asp?sFunctionName=Get_Literary_Expression&id_cdc='+page_id_cdc,'WrittenExpression','height=600,width=900,resizable=yes,status=yes,toolbar=yes,menubar=yes,location=yes');
}

function MCS_OnXLE(ATotal,AsID_Grid){
	current_mcs_treegrid.attachEvent("onXLE", function(grid_obj,count){
	    grid_obj.setColLabel(1, _("Entités affichées") + " (" + grid_obj.getRowsNum() + "/" + ATotal + ") ");
		Fct_Unloading();
		Resize_Div("table_mcs_view",40,100);
		Grid_OnCheck(AsID_Grid,"current_mcs_treegrid"); 
	});
}

function Reload_Grid() {
	current_mcs_treegrid.clearAll();
	current_mcs_treegrid.loadXML(_url('/code/asp/ajax/load_xml_wto_mcs_table.asp?id=0&major=' + major + '&minor=' + minor + ''), 'xml');
}

function Init_Buttons_From_Page_Number(){
	if (nbPage != 1){
		pageNumber_Fictive = pageNumber;
		if (!dhxToolbar_MCS.isEnabled("prev")){
			dhxToolbar_MCS.enableItem("prev");
			dhxToolbar_MCS.enableItem("first");
		}
		if (!dhxToolbar_MCS.isEnabled("next")){
			dhxToolbar_MCS.enableItem("next");
			dhxToolbar_MCS.enableItem("last");
		}
		if (pageNumber_Fictive == 1){
			dhxToolbar_MCS.disableItem("prev");
			dhxToolbar_MCS.disableItem("first");
		} else if (pageNumber_Fictive == nbPage){
			dhxToolbar_MCS.disableItem("next");
			dhxToolbar_MCS.disableItem("last");
		}
	}
}

function Option_Page_OnClick(AID_Option){
	idParent = "pages";
	pageNumber = dhxToolbar_MCS.getListOptionPosition(idParent, AID_Option);
	Init_Label_Result();
	value = dhxToolbar_MCS.getListOptionText(idParent,AID_Option);
	dhxToolbar_MCS.setItemText(idParent,value);
	pageNumber_Fictive = pageNumber;
	Reload_Grid();
}

function Option_Result_OnClick(AID_Option){
	idParent = "results";
	var reg=new RegExp("[0-9]+");
	
	chaine = dhxToolbar_MCS.getListOptionText(idParent, AID_Option).replace(",","");
	if (Check_Number(chaine)){
	    nbPerPage_Fictive = parseInt(reg.exec(chaine));
		if (nbPerPage_Fictive != nbPerPage){
			nbPerPage = nbPerPage_Fictive;
			nbPage = Math.ceil(nbResults/nbPerPage);
			dhxToolbar_MCS.removeItem("pages");
			pageNumber = 1;
			pageNumber_Fictive = 1;
			Init_Select_Button_Pages();
			Init_Label_Result();
			Init_Buttons();
			Reload_Grid();
			dhxToolbar_MCS.setListOptionSelected("pages","page_"+pageNumber);
		}
	} else {
		nbPerPage = nbResults;
		pageNumber = 1;
		dhxToolbar_MCS.disableItem("first");
		dhxToolbar_MCS.disableItem("prev");
		dhxToolbar_MCS.disableItem("last");
		dhxToolbar_MCS.disableItem("next");
		dhxToolbar_MCS.disableItem("pages");
		Init_Label_Result();
		Reload_Grid();
	}
		
	value = dhxToolbar_MCS.getListOptionText(idParent,AID_Option);
	dhxToolbar_MCS.setItemText(idParent,value);
}

function Init_Buttons(){
	dhxToolbar_MCS.disableItem("first");
	dhxToolbar_MCS.disableItem("prev");
	if (nbPage == 1){
		dhxToolbar_MCS.disableItem("last");
		dhxToolbar_MCS.disableItem("next");
	}else {
		dhxToolbar_MCS.enableItem("last");
		dhxToolbar_MCS.enableItem("next");

	}
}

function Init_Select_Button_Pages(){
	dhxToolbar_MCS.addButtonSelect("pages", 5, "Page 1", [], "", "", true, true,10);
	for(var i=1;i<nbPage+1;i++){
		id = "page_"+i;
		value = "Page "+i;
		dhxToolbar_MCS.addListOption("pages", id, i, "button", value);
	}
}

function Init_Label_Result(){
	if (pageNumber == 1){
		minor = 1;
		major = nbPerPage;
	} else {
		minor = (pageNumber-1) * nbPerPage + 1;
		major = (pageNumber) * nbPerPage;
	}
	if (pageNumber == nbPage){
		major = nbResults;
	}
	results = _("Résultat ") + minor + " " + _("à") + " " + major;
	dhxToolbar_MCS.setItemText("records",results);
}

//toolbar functions
function Toolbar_MCS_OnClick(AsID_Toolbar, AsID_Tree) {
    dhxToolbar_MCS = eval(AsID_Toolbar);
    dhxToolbar_MCS.attachEvent("onClick", function (id) {
        var type = dhxToolbar_MCS.getType(id);
        switch (type) {
            case "buttonSelectButton":
                var idParent;
                if (id.match("page_")) {
                    Option_Page_OnClick(id);
                    Init_Buttons_From_Page_Number();
                } else if (id.match("results_")) {
                    Option_Result_OnClick(id);
                }
                break;
            case "button":
                switch (id) {
                    case "first":
                        Init_Buttons();
                        pageNumber_Fictive = 1;
                        break;
                    case "prev":
                        if (!dhxToolbar_MCS.isEnabled("next")) {
                            dhxToolbar_MCS.enableItem("next");
                            dhxToolbar_MCS.enableItem("last");
                        }
                        pageNumber_Fictive = pageNumber_Fictive - 1;
                        if (pageNumber_Fictive == 1) {
                            dhxToolbar_MCS.disableItem("prev");
                            dhxToolbar_MCS.disableItem("first");
                        }
                        break;
                    case "next":
                        if (!dhxToolbar_MCS.isEnabled("prev")) {
                            dhxToolbar_MCS.enableItem("prev");
                            dhxToolbar_MCS.enableItem("first");
                        }
                        pageNumber_Fictive = pageNumber_Fictive + 1;
                        if (pageNumber_Fictive == nbPage) {
                            dhxToolbar_MCS.disableItem("next");
                            dhxToolbar_MCS.disableItem("last");
                        }
                        break;
                    case "last":
                        dhxToolbar_MCS.disableItem("last");
                        dhxToolbar_MCS.disableItem("next");
                        dhxToolbar_MCS.enableItem("prev");
                        dhxToolbar_MCS.enableItem("first");
                        pageNumber_Fictive = nbPage;
                        break;
                }
                Option_Page_OnClick("page_" + pageNumber_Fictive);
                dhxToolbar_MCS.setListOptionSelected("pages", "page_" + pageNumber_Fictive);
                break;
        }
    });

}

function Init_Toolbar_MCS() {
    Init_Select_Button_Pages();
    Init_Label_Result();
    J("#id_div_toolbar_mcs_paging").css("display", "block");
    J("#table_mcs_view").css("top", "40px");
    dhxToolbar_MCS.disableItem("first");
    dhxToolbar_MCS.disableItem("prev");
    if (nbPage == 1) {
        dhxToolbar_MCS.disableItem("last");
        dhxToolbar_MCS.disableItem("next");
    }
    dhxToolbar_MCS.setListOptionSelected("results", "results_1");
    dhxToolbar_MCS.setListOptionSelected("pages", "page_1");
    var text = dhxToolbar_MCS.getListOptionText("results", "results_1");
    dhxToolbar_MCS.setItemText("results", text);
}

