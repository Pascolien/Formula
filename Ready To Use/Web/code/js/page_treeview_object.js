// JavaScript Document
var id_treeviewE = 0;
var id_te = 0;
var teexma_mode;

function ObjHint(id_obj) {
	J.ajax({
		url: _url('/code/asp/ajax/actions_Abstract.asp'),
		async: true,
		cache: false,
		data: { 
			sFunctionName :"Get_Object_Hint",
			id_obj: id_obj
		},
		success: function (aResult) {
		    J('#id_e_' + id_obj).attr('title', aResult);
		} 
	});  
}

// Fonction qui surligne l'entité sur laquel on a cliqué et qui mets à jour le formulaire
function Tree_SelectE(id_tree, obj) {
	J('#action').html(' ');
	var elts = Jclass('tree_'+id_tree+'_e_name', 'span', J('#tree_'+id_tree));
  
	for(var i = 0 ; i <  elts.length ; i++) {
		J(elts[i]).css('backgroundColor','transparent');
	}
	if (obj) {
		obj.css("backgroundColor",'#cccccc');
		var str_temp = obj.id;
		document.form_nav.id_e.value = str_temp.substr(str_temp.length - (str_temp.length-5));
	} else {
		document.form_nav.id_e.value = 0;	
	}
	if (Prototype.Browser.IE) {
		document.form_nav.submit();		
	} else {	
		J.ajax({
			url:_url('/code/asp/nav.asp'),
			async: false,
			cache: false,
			data: { envoyeur: 'e', id_e: document.form_nav.id_e.value },
			success: function (aResult) {
			    window.parent.frames['frame_blanc'].document.body.append(aResult);
			}
	  });	
	}
	if ((document.form_nav.id_e.value != '0') && ((document.form_nav.id_e.value != ''))) {
		if (document.form_nav.nav_mode.value == 'TE') {
			id_origin = 1;  
		} else {
			id_origin = 2;
		}                          
		J.ajax({
		    url: _url('/code/asp/ajax/log_navigation_action.asp'),
		    cache: false,
			data: { origin : id_origin, id_obj : document.form_nav.id_e.value }
		});
	} 
	Chargement_ActionEntite(teexma_mode);			
}   

function openWindow(pURL)	{
	myWindow = window.open(pURL, 'ActionWindow', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=350,height=300');
}
