var sID_Calendar_Active;
var rPopup_Form;
var sLastPortals = "";

SourceInfo = false;

function Add_Group(){
	document.form1.submit();
}
                        
function ModifEnCours() {
	try {
	    J('#contenu_form').html('<div style="text-align:center;"><img src="'+_url("/resources/theme/img/gif/ajax-loader.gif")+'" /></div>');
		J('#nom_entite_form').html('&nbsp;');		
	} catch (error) {}
}

function Convert_Unit(ID, ID_Unite_New,APopup_Form) {
	var sID_Val_Max = 'val_max_'+ID;
	var sID_Val_Min = 'val_min_'+ID;
	var sID_Val_Mean = 'val_mean_'+ID;
	var sID_Unit_Old = 'id_unite_old_'+ID;
	if (APopup_Form){
		sID_Val_Max = 'val_max_popup_'+ID;
		sID_Val_Min = 'val_min_popup_'+ID;
		sID_Val_Mean = 'val_mean_popup_'+ID;
		sID_Unit_Old = 'id_unite_old_popup_'+ID;
	}
	if ((J('#'+sID_Val_Max).length != 0) && (J('#'+sID_Val_Max).attr("value") != '')) {
		J.ajax({
		    url: _url('/code/asp/ajax/actions_MCS.asp'),
		    cache: false,
			data: { 
				sFunctionName :"Convert_Unit",
				Value: J('#'+sID_Val_Max).attr("value"), 
				ID_Unit_Old: J('#'+sID_Unit_Old).attr("value"), 
				ID_Unit_New: ID_Unite_New 
			},
			success: function (aResult) {
			    J('#' + sID_Val_Max).val(aResult);
			}
		});
		// Idem pour les bornes inf et bornes sup
		if (J('#'+sID_Val_Max).attr("b_inf") != "-INF") {
			J.ajax({
			    url: _url('/code/asp/ajax/actions_MCS.asp'),
			    cache: false,
				data: { 
					sFunctionName :"Convert_Unit",
					Value: J('#'+sID_Val_Max).attr("b_inf"), 
					ID_Unit_Old: J('#'+sID_Unit_Old).attr("value"), 
					ID_Unit_New: ID_Unite_New 
				},
				success: function (aResult) {
				    J('#' + sID_Val_Max).attr("b_inf", aResult);
				}
			});
		}
		
		if (J('#'+sID_Val_Max).attr("b_sup") != "INF") {
			J.ajax({
			    url: _url('/code/asp/ajax/actions_MCS.asp'),
			    cache: false,
				data: { 
					sFunctionName :"Convert_Unit",
					Value: J('#'+sID_Val_Max).attr("b_sup"), 
					ID_Unit_Old: J('#'+sID_Unit_Old).attr("value"), 
					ID_Unit_New: ID_Unite_New 
				},
				success: function (aResult) {
				    J('#' + sID_Val_Max).attr("b_sup", aResult);
				}
			});
		}
	}
	
	if ((J('#'+sID_Val_Mean).length != 0) && J('#'+sID_Val_Mean).attr("value") != '') {
		J.ajax({
		    url: _url('/code/asp/ajax/actions_MCS.asp'),
		    cache: false,
			data: { 
				sFunctionName :"Convert_Unit",
				Value: J('#'+sID_Val_Mean).attr("value"), 
				ID_Unit_Old: J('#'+sID_Unit_Old).attr("value"), 
				ID_Unit_New: ID_Unite_New 
			},
			success: function (aResult) {
			    J('#' + sID_Val_Mean).val(aResult);
			}
		});
		// Idem pour les bornes inf et bornes sup
		if (J('#'+sID_Val_Mean).attr("b_inf") != "-INF") {
			J.ajax({
			    url: _url('/code/asp/ajax/actions_MCS.asp'),
			    cache: false,
				data: { 
					sFunctionName :"Convert_Unit",
					Value: J('#'+sID_Val_Mean).attr("b_inf"), 
					ID_Unit_Old: J('#'+sID_Unit_Old).attr("value"), 
					ID_Unit_New: ID_Unite_New 
				},
				success: function (aResult) {
				    J('#' + sID_Val_Mean).attr("b_inf", aResult);
				}
			});
		}
		
		if (J('#'+sID_Val_Mean).attr("b_sup") != "INF") {
			J.ajax({
			    url: _url('/code/asp/ajax/actions_MCS.asp'),
			    cache: false,
				data: { 
					sFunctionName :"Convert_Unit",
					Value: J('#'+sID_Val_Mean).attr("b_sup"), 
					ID_Unit_Old: J('#'+sID_Unit_Old).attr("value"), 
					ID_Unit_New: ID_Unite_New 
				},
				success: function (aResult) {
				    J('#' + sID_Val_Mean).attr("b_sup", aResult);
				}
			});
		}
	}

	if (J('#'+sID_Val_Min).attr("value") != '') {
		J.ajax({
		    url: _url('/code/asp/ajax/actions_MCS.asp'),
		    cache: false,
			data: { 
				sFunctionName :"Convert_Unit",
				Value: J('#'+sID_Val_Min).attr("value"), 
				ID_Unit_Old: J('#'+sID_Unit_Old).attr("value"), 
				ID_Unit_New: ID_Unite_New 
			},
			success: function (aResult) {
			    J('#' + sID_Val_Min).val(aResult);
			}
		});
	  
		// Idem pour les bornes inf et bornes sup
		if (J('#'+sID_Val_Min).attr("b_inf") != "-INF") {
			J.ajax({
			    url: _url('/code/asp/ajax/actions_MCS.asp'),
			    cache: false,
				data: { 
					sFunctionName :"Convert_Unit",
					Value: J('#'+sID_Val_Min).attr("b_inf"), 
					ID_Unit_Old: J('#'+sID_Unit_Old).attr("value"), 
					ID_Unit_New: ID_Unite_New 
				},
				success: function (aResult) {
				    J('#' + sID_Val_Min).attr("b_inf", aResult);
				}
			});
		}
		
		if (J('#'+sID_Val_Min).attr("b_sup") != "INF") {
			J.ajax({
			    url: _url('/code/asp/ajax/actions_MCS.asp'),
			    cache: false,
				data: { 
					sFunctionName :"Convert_Unit",
					Value: J('#'+sID_Val_Min).attr("b_sup"), 
					ID_Unit_Old: J('#'+sID_Unit_Old).attr("value"), 
					ID_Unit_New: ID_Unite_New 
				},
				success: function (aResult) {
				    J('#' + sID_Val_Min).attr("b_sup", aResult);
				}
			});
		}
	}                              
	
	J('#'+sID_Unit_Old).val(ID_Unite_New);
}

function ExportTable(id) {
	window.open('ajax/export_table.asp?id='+id);
}

function modification(AID_Attribute, APopup_Form) {
	try{
		if(APopup_Form){
			nom_popup_form.chgt_form.value = '1';
			Jn('chgt_'+ AID_Attribute).eq(0).val('1');
			try{
				Jn('chgt_'+ AID_Attribute).eq(1).val('1');
			} catch (e) {
			    
			}
		} else {	
			nom_form.chgt_form.value = '1';
			Jn('chgt_'+ AID_Attribute).eq(0).val('1');	
		}
	} catch (e) {
	   
	}
}

function openWindow(pURL) {
	myWindow = window.open(pURL, 'ActionWindow', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,width=480,height=220');
}

function Get_Table_Value(obj_tab) {
    val = "";
    var i = 1;
    try {
        J('#' + obj_tab.attr("id") + ' tr').each(function () {
            if (i > 1) {
                val = val + '||';
            }
            obj_col = J('#' + obj_tab.attr("id") + ' tr:eq(' + (J('#' + obj_tab.attr("id") + ' tr').index(this) + 1) + ')');
            var j = 0;
            obj_col.find('td').each(function () {
                obj_cel = J(this);
                tab_temp = J(obj_cel).children('input');

                ID_Serie = J(tab_temp).eq(0).attr("id_serie");
                if (ID_Serie)
                    txt_temp = ID_Serie;
                else
                    txt_temp = J(tab_temp).eq(0).val();

                if (txt_temp == '') {
                    txt_temp = ' ';
                }
                if (j > 0) {
                    val = val + '|';
                }
                val = val + txt_temp;
                j = j + 1;
            });
            i = i + 1;
        });
    } catch (e) { }
    return val;
}

