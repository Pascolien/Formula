var idOTCurrent = 0;
var idObjectChecked = "";

var rTree;
var rCombo;

var Current_Tab;
var sLabel;
var bSearchObject = false;


J(function () {
    translate();
    Int_Tabs();
    init();
    Get_Text_Selected();
    TreeInit();
})

// Initializing DHTMLX tabbar for inserting links
function Int_Tabs(){
	tabbar=new dhtmlXTabBar("a_tabbar","top");
	tabbar.setImagePath(_url("/resources/theme/img/dhtmlx/tabbar/"));
	tabbar.enableAutoSize(true,true); 
	tabbar.addTab("tab1",_("Général"),"100px");
	tabbar.addTab("tab2",_("Apparence"),"100px");
	tabbar.setContent("tab1","a1");
	tabbar.setContent("tab2","a2");
	tabbar.setTabActive("tab1");		
	Current_Tab = "a1";
	tabbar.attachEvent("onTabClick", function(id){
		if (id=="tab2") {
			Current_Tab = "a2";
			var ed = parent.tinymce.activeEditor.windowManager.windows[0];
			var width = '650';
			var height = '170';
			ed.resizeTo(width,height); 
			document.getElementById("table").style.marginRight = "6px";
		}
		
		if (id=="tab1") { 
			Current_Tab = "a1";
			var ed = parent.tinymce.activeEditor.windowManager.windows[0];
			var width = '650';
			var height = '410';
			ed.resizeTo(width,height); 
			document.getElementById("table").style.marginRight = "6px";
		}	
	});			
}

// Load informations about the link
function init() {
	var inst = parent.tinymce.activeEditor;
	var elm = inst.selection.getNode();
	var formObj = document.forms[0];
	var action = "insert";
	elm = inst.dom.getParent(elm, "A"); //retourne le lien du noeud
	//set up popup element when update.
	if (elm == null) {
		var prospect = inst.dom.create("p", null, "test");
		if (prospect.childNodes.length === 1) {
			elm = prospect.firstChild;
		}
	}
	if (elm != null && elm.nodeName == "A") {
		var action = "update";
		var reg=new RegExp("[0-9]+");
		var sHref = inst.dom.getAttrib(elm, 'href');
		idObjectChecked = "" + reg.exec(sHref);
		var ID_OT;
		if (idObjectChecked != null) {
		    ID_OT = getObjectIdOT(idObjectChecked);
		    idOTCurrent = ID_OT;
		}
		
		// Get parameters of internal link 
		sLabel = inst.dom.getAttrib(elm,'object_name');
		if (sLabel == ""){
			sLabel= Get_Text_Selected();
		}	
		
		if (typeof idObjectChecked != "undefined")  {
			J("#entityText").val(sLabel);
			J("#ID_Object").val(idObjectChecked);
		}
		
		
		// Get parameters of  external link
		var text2 = inst.dom.getAttrib(elm,'object_name');
		var text3 = inst.dom.getAttrib(elm,'href');
		var text4 = inst.dom.getAttrib(elm,'target');
		if (text2 == "" ){
			text2 = Get_Text_Selected();
		}		
	
		if  (text4 == "_blank"  ){
			tabbar.setTabActive("tab2");	
			J("#entityText2").val(text2);	
			J("#URL").val(text3);	
		}	 
	} else {
		var Selected_Text = Get_Text_Selected();

		if (Selected_Text != "") J("#entityText").val(Selected_Text);
		if (Selected_Text != "") J("#entityText2").val(Selected_Text);
	}
}

	function Get_Text_Selected(){
		var inst2 =parent.tinymce.activeEditor;
		var elm2 = inst2.selection.getNode();
		var selEditor = inst2.selection;
		var sValue = selEditor.getContent({format: 'text'});
		return Replace_From_XML(sValue);	
	}

// Close the tinymce popup
function CloseTinyPop(){
	parent.tinymce.activeEditor.windowManager.windows[0].close();
}

// Condition on the link
function insertLink() {	
	if (Current_Tab == "a1") {
		insertInternalLink();
	} else {
		insertExternalLink();
	}	
}	

//Generate internal link and insert the link into the editor
function insertInternalLink() {
	// var insert_url = '<a href="www.google.fr ">'+ document.getElementById("entityText").value+'</a>';
	var elm= parent.tinymce.activeEditor.selection.getNode()			
	 
	// var ID_Object = document.getElementById("ID_Object").value;
	var ID_Object = rTree.getCheckedIds();
	var ID_OT = rCombo.getSelectedValue();
	if (ID_OT == 0) {
		ID_OT = Get_Object_ID_OT(ID_Object,"../");
	}
	var LinkName = J("#entityText").val();
	var hrefNav = _url("/temp_resources/portals/navigation.asp?ID_Obj="+ID_Object);		
	var onMouseOverAction = "this.style.cursor='hand';";
	
	elm2 = parent.tinymce.activeEditor.dom.getParent(elm, 'a');
	if (elm2 == null) {
		//ça, ça fonctionne
		//var elementCreated = parent.tinymce.activeEditor.dom.create('a', {href: hrefNav, title: 'some title'},LinkName);
	    var elementCreated = parent.tinymce.activeEditor.dom.create('a', { href: hrefNav, 'id_object': ID_Object, 'onmouseover': onMouseOverAction, 'target': 'hiddenFrame', 'object_name': LinkName, 'ID_OT': ID_OT }, LinkName);
		parent.tinymce.activeEditor.selection.setNode(elementCreated);
	}else{
	    var newElement = parent.tinymce.activeEditor.dom.create('a', { href: hrefNav, 'id_object': ID_Object, 'onmouseover': onMouseOverAction, 'target': 'hiddenFrame', 'object_name': LinkName, 'ID_OT': ID_OT }, LinkName);
		parent.tinymce.activeEditor.dom.replace(newElement, elm2);
	}
	 CloseTinyPop();
}

//Generate external link and insert the link into the editor
function insertExternalLink() {
	// var insert_url = '<a href="www.google.fr ">'+ document.getElementById("entityText").value+'</a>';
	var elm = parent.tinymce.activeEditor.selection.getNode()			
	 

	var LinkName = document.getElementById("entityText2").value;
	var hrefNav =  document.getElementById("URL").value;
	var onMouseOverAction = "this.style.cursor='hand';";
	
	elm2 = parent.tinymce.activeEditor.dom.getParent(elm, 'a');
	if (elm2 == null) {
		//ça, ça fonctionne
		//var elementCreated = parent.tinymce.activeEditor.dom.create('a', {href: hrefNav, title: 'some title'},LinkName);
		var elementCreated = parent.tinymce.activeEditor.dom.createHTML('a', {href: hrefNav, 'object_name':LinkName, 'target':'_blank'},LinkName);
		parent.tinymce.activeEditor.selection.setContent(elementCreated);
	} else {
		var newElement = parent.tinymce.activeEditor.dom.create('a', {href:hrefNav,  'object_name':LinkName, 'target':'_blank'}, LinkName);
		parent.tinymce.activeEditor.dom.replace(newElement, elm2);
	}
	 CloseTinyPop();
}
	
// Initialize Tree 
function TreeInit(){
	var sValueSearch = J("#entityText").val();
	
	if (!idObjectChecked && sValueSearch)
		bSearchObject = true;

	rCombo = new CComboBoxOT({
	    sIdDivCombo: "id_div_combo",
	    iWidth: 510,
	    iDefaultValueSelected: idOTCurrent,
	    defaultOption: { ID: 0, sName: _("Toute la base"), iIcon: 1 },
	    onChange: comboOnChange
	});
	//rCombo = Add_ComboOT("id_div_combo", 463, 200, true, false, false, true, "Toute la base", idOTCurrent);
	comboOnChange();
}
	
function comboOnChange() {
    if (rTree != null) 
        rTree.unload();
    
    idOT = rCombo.getSelectedValue();
	if (idOT == 0){
	    //cas de l'arbre dans toute la base
	    rTree = new CTreeObject({
	        idOT: idOT,
	        sIdDivTree: "id_div_tree",
	        sIdDivToolbar: "id_div_toolbar",
	        sCheckType: ctRadioboxes,
	        bSearchInLkdObjects: false,
	        bSearchInData: false,
	        onXLE: treeOnXle,
	        onCheck: treeOnCheck
	    });
	    treeOnXle();
	} else {
	    rTree = new CTreeObject({
	        sIdDivTree: "id_div_tree",
	        sIdDivToolbar: "id_div_toolbar",
	        sCheckType: ctRadioboxes,
	        sIdsChecked: idObjectChecked,
	        bSearchInLkdObjects: false,
	        bSearchInData: false,
	        idOT:idOT,
	        onCheck: treeOnCheck
	    });
	    idObjectChecked = '';
	}
}

function treeOnXle() {
    if (bSearchObject) {
        bSearchObject = false;
        var sValueSearch = J("#entityText").val();
        rTree.switchToLinearView(sValueSearch);
    }
    rTree.toolbar.hideItem(btnDisplaySelection);
    rTree.toolbar.hideItem(btnDisplayTree);
}

function treeOnCheck() {
    sObjectChecked = rTree.getCheckedIds();
    if (J("#entityText").val() == "" && sObjectChecked != '')
        J("#entityText").val(rTree.getCheckedNames());
	
	idObjectChecked = "";
}
