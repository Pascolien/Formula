var iBtnCancel = 70;
var iBtnInsert = 70;
var iBtnValid = 70;
var iBtnApply = 70;
var iBtnSearch = 120;
var iBtnReplace = 70;
var iBtnReplaceAll = 100;
var iColumnSpace = 5;

function Get_Insert_Cancel_Buttons(){
	var larg = (document.body.clientWidth);
	formData = [
		{type: "button",width:iBtnInsert,name: "insert", value:document.getElementById("insert").value,offsetLeft:larg-180},
		{type: "newcolumn",offset:iColumnSpace},
		{type: "button",width:iBtnCancel,name: "cancel", value:document.getElementById("cancel").value}
	];
	dhxForm = new dhtmlXForm("formdhx",formData);
}

function Init_Form_Data(ElementId){
	var larg = (document.body.clientWidth);
	var FormData_UC = [
		{type: "button",width:iBtnInsert,name: "insert", value:document.getElementById("insert").value,offsetLeft:larg/2-80},
		{type: "newcolumn",offset:iColumnSpace},
		{type: "button",width:iBtnCancel,name: "cancel", value:document.getElementById("cancel").value}
	];
	var FormData_UDC = [
		{type: "button",width:iBtnInsert,name: "insert", value:document.getElementById("insert").value,offsetLeft:larg/2-110},
		{type: "newcolumn",offset:iColumnSpace},
		{type: "button",width:iBtnCancel,name: "remove", value:document.getElementById("remove").value},
		{type: "newcolumn",offset:iColumnSpace},
		{type: "button",width:iBtnCancel,name: "cancel", value:document.getElementById("cancel").value}
	];
	var style = document.getElementById(ElementId).style.display;
	if (style == "none"){
		dhxForm = new dhtmlXForm("formdhx",FormData_UC);
	}else{
		document.getElementById(ElementId).style.display = "none";
		dhxForm = new dhtmlXForm("formdhx",FormData_UDC);
	}
}

function Get_TXPlugin_Button(){
	Get_Insert_Cancel_Buttons();
	dhxForm.attachEvent("onButtonClick",function(name, command){
		switch (name){
			case "cancel":
				tinyMCEPopup.close();
			break;
			case "insert":
				insertAction();return false;
			break;
		}
		dhxForm.unload();
	});
}

function Get_ASPImage_Image_Button(){
	Get_Insert_Cancel_Buttons();
	dhxForm.attachEvent("onButtonClick",function(name, command){
		switch (name){
			case "cancel":
				tinyMCEPopup.close();
			break;
			case "insert":
				ImageDialog.insert();return false;
			break;
		}
		dhxForm.unload();
	});
}

function Get_Style_Props_Button(){
	var larg = (document.body.clientWidth);
	formData = [
		{type: "button",width:iBtnInsert,name: "insert", value:document.getElementById("insert").value,offsetLeft:larg/2-150},
		{type: "newcolumn",offset:iColumnSpace},
		{type: "button",width:iBtnApply,name: "apply", value:document.getElementById("apply").value},
		{type: "newcolumn",offset:iColumnSpace},
		{type: "button",width:iBtnCancel,name: "cancel", value:document.getElementById("cancel").value}
	];
	dhxForm = new dhtmlXForm("formdhx",formData);
	dhxForm.attachEvent("onButtonClick",function(name, command){
		switch (name){
			case "cancel":
				tinyMCEPopup.close();
			break;
			case "insert":
				updateAction();return false;
			break;
			case "apply":
				applyAction();return false;
			break;
		}
		dhxForm.unload();
	});
} 

function Get_Theme_About_Button(){
	var larg = (document.body.clientWidth);
	formData = [
		{type: "button",width:iBtnCancel,name: "cancel", value:document.getElementById("cancel").value,offsetLeft:larg/2-50},
	];
	dhxForm = new dhtmlXForm("formdhx",formData);
	dhxForm.attachEvent("onButtonClick",function(name, command){
		switch (name){
			case "cancel":
				tinyMCEPopup.close();
			break;
		}
		dhxForm.unload();
	});
}

function Get_Theme_ColorPicker_Button(){
	Get_Insert_Cancel_Buttons();
	dhxForm.attachEvent("onButtonClick",function(name, command){
		switch (name){
			case "cancel":
				tinyMCEPopup.close();
			break;
			case "insert":
				insertAction();return false;
			break;
		}
		dhxForm.unload();
	});
} 

function Get_Media_Media_Button(){
	Get_Insert_Cancel_Buttons();
	dhxForm.attachEvent("onButtonClick",function(name, command){
		switch (name){
			case "cancel":
				tinyMCEPopup.close();
			break;
			case "insert":
				Media.insert();return false;
			break;
		}
		dhxForm.unload();
	});
} 

function Get_Table_Cell_Button(){
	Get_Insert_Cancel_Buttons();
	dhxForm.attachEvent("onButtonClick",function(name, command){
		switch (name){
			case "cancel":
				tinyMCEPopup.close();
			break;
			case "insert":
				updateAction();return false;
			break;
		}
		dhxForm.unload();
	});
}

function Get_Table_MergeCells_Button(){
	Get_Insert_Cancel_Buttons();
	dhxForm.attachEvent("onButtonClick",function(name, command){
		switch (name){
			case "cancel":
				tinyMCEPopup.close();
			break;
			case "insert":
				MergeCellsDialog.merge();return false;
			break;
		}
		dhxForm.unload();
	});
}

function Get_Table_Table_Button(){
	Get_Insert_Cancel_Buttons();
	dhxForm.attachEvent("onButtonClick",function(name, command){
		switch (name){
			case "cancel":
				tinyMCEPopup.close();
			break;
			case "insert":
				insertTable();return false;
			break;
		}
		dhxForm.unload();
	});
}

function Get_Table_Row_Button(){
	Get_Insert_Cancel_Buttons();
	dhxForm.attachEvent("onButtonClick",function(name, command){
		switch (name){
			case "cancel":
				tinyMCEPopup.close();
			break;
			case "insert":
				updateAction();return false;
			break;
		}
		dhxForm.unload();
	});
} 

function Get_Template_Template_Button(){
	Get_Insert_Cancel_Buttons();
	dhxForm.attachEvent("onButtonClick",function(name, command){
		switch (name){
			case "cancel":
				tinyMCEPopup.close();
			break;
			case "insert":
				TemplateDialog.insert();return false;
			break;
		}
		dhxForm.unload();
	});
} 

function Get_Theme_Image_Button(){
	Get_Insert_Cancel_Buttons();
	dhxForm.attachEvent("onButtonClick",function (name, command){
		switch (name){
			case "cancel":
				tinyMCEPopup.close();
			break;
			case "insert":
				ImageDialog.update();return false;
			break;
		}
		dhxForm.unload();
	});
}

function Get_Theme_SourceEditor_Button(){
	Get_Insert_Cancel_Buttons();
	dhxForm.attachEvent("onButtonClick",function(name, command){
		switch (name){
			case "cancel":
				tinyMCEPopup.close();
			break;
			case "insert":
				saveContent();return false;
			break;
		}
		dhxForm.unload();
	});
} 

function Get_Theme_Anchor_Button(){
	Get_Insert_Cancel_Buttons();
	dhxForm.attachEvent("onButtonClick",function(name, command){
		switch (name){
			case "cancel":
				tinyMCEPopup.close();
			break;
			case "insert":
				AnchorDialog.update();return false;
			break;
		}
		dhxForm.unload();
	});
}

function Get_Theme_Link_Button(){
	Get_Insert_Cancel_Buttons();
	dhxForm.attachEvent("onButtonClick",function(name, command){
		switch (name){
			case "cancel":
				tinyMCEPopup.close();
			break;
			case "insert":
				LinkDialog.update();return false;
			break;
		}
		dhxForm.unload();
	});
}

function Get_ADVLink_Link_Button(){
	Get_Insert_Cancel_Buttons();
	dhxForm.attachEvent("onButtonClick",function(name, command){
		switch (name){
			case "cancel":
				tinyMCEPopup.close();
			break;
			case "insert":
				insertAction();
				return false;
			break;
		}
		dhxForm.unload();
	});
}

function Get_Paste_PasteText_Button(){
	Get_Insert_Cancel_Buttons();
	dhxForm.attachEvent("onButtonClick",function(name, command){
		switch (name){
			case "cancel":
				tinyMCEPopup.close();
			break;
			case "insert":
				return PasteTextDialog.insert();
			break;
		}
		dhxForm.unload();
	});
}

function Get_Paste_PasteWord_Button(){
	Get_Insert_Cancel_Buttons();
	dhxForm.attachEvent("onButtonClick",function(name, command){
		switch (name){
			case "cancel":
				tinyMCEPopup.close();
			break;
			case "insert":
				return PasteWordDialog.insert();
			break;
		}
		dhxForm.unload();
	});
}

function Get_ADVHR_Rule_Button(){
	Get_Insert_Cancel_Buttons();
	dhxForm.attachEvent("onButtonClick",function(name, command){
		switch (name){
			case "cancel":
				tinyMCEPopup.close();
			break;
			case "insert":
				AdvHRDialog.update();return false;
			break;
		}
		dhxForm.unload();
	});
}

function Get_XHTML_Attributes_Button(){
	Get_Insert_Cancel_Buttons();
	dhxForm.attachEvent("onButtonClick",function(name, command){
		switch (name){
			case "cancel":
				tinyMCEPopup.close();
			break;
			case "insert":
				insertAction();return false;
			break;
		}
		dhxForm.unload();
	});
}

function Get_XHTML_Abbr_Button(){
	Init_Form_Data("remove");
	dhxForm.attachEvent("onButtonClick",function(name, command){
		switch (name){
			case "insert":
				insertAbbr();return false;
			break;
			case "remove":
				removeAbbr();return false;
			break;
			case "cancel":
				tinyMCEPopup.close();
			break;
		}
		dhxForm.unload();
	});
}

function Get_XHTML_Acronym_Button(){
	Init_Form_Data("remove");
	dhxForm.attachEvent("onButtonClick",function(name, command){
		switch (name){
			case "insert":
				insertAcronym();return false;
			break;
			case "remove":
				removeAcronym();return false;
			break;
			case "cancel":
				tinyMCEPopup.close();
			break;
		}
		dhxForm.unload();
	});
}

function Get_XHTML_Ins_Button(){
	Init_Form_Data("remove");
	dhxForm.attachEvent("onButtonClick",function(name, command){
		switch (name){
			case "insert":
				insertIns();return false;
			break;
			case "remove":
				removeIns();return false;
			break;
			case "cancel":
				tinyMCEPopup.close();
			break;
		}
		dhxForm.unload();
	});
}

function Get_XHTML_Del_Button(){
	Init_Form_Data("remove");
	dhxForm.attachEvent("onButtonClick",function(name, command){
		switch (name){
			case "insert":
				insertDel();return false;
			break;
			case "remove":
				removeDel();return false;
			break;
			case "cancel":
				tinyMCEPopup.close();
			break;
		}
		dhxForm.unload();
	});
}

function Get_XHTML_Cite_Button(){
	Init_Form_Data("remove");
	dhxForm.attachEvent("onButtonClick",function(name, command){
		switch (name){
			case "insert":
				insertCite();return false;
			break;
			case "remove":
				removeCite();return false;
			break;
			case "cancel":
				tinyMCEPopup.close();
			break;
		}
		dhxForm.unload();
	});
}

function Get_SR_Search_Button(){
	var larg = (document.body.clientWidth);
	formData1 = [
		{type: "button",width:iBtnSearch,name: "insert", value:document.getElementById("insert").value,offsetLeft:larg/2-100},
		{type: "newcolumn",offset:iColumnSpace},
		{type: "button",width:iBtnCancel,name: "cancel", value:document.getElementById("cancel").value}
	];
	if (dhxForm2 != null) dhxForm2.unload();
	dhxForm1 = new dhtmlXForm("formdhx",formData1);
	dhxForm1.attachEvent("onButtonClick",function(name, command){
		switch (name){
			case "insert":
				SearchReplaceDialog.searchNext('none');return false;
			break;
			case "cancel":
				tinyMCEPopup.close();
			break;
		}
	});
}

function Get_SR_Replace_Button(){
	formData2 = [
		{type: "button",width:iBtnSearch,name: "insert", value:document.getElementById("insert").value,offsetLeft:5,style:"padding: 1px -20px;",className:"test"},
		{type: "newcolumn",offset:iColumnSpace},
		{type: "button",width:iBtnReplace,name: "replaceBtn", value:document.getElementById("replaceBtn").value},
		{type: "newcolumn",offset:iColumnSpace},
		{type: "button",width:iBtnReplaceAll,name: "replaceAllBtn", value:document.getElementById("replaceAllBtn").value},
		{type: "newcolumn",offset:iColumnSpace},
		{type: "button",width:iBtnCancel,name: "cancel", value:document.getElementById("cancel").value},
	];
	if (dhxForm1 != null) dhxForm1.unload();
	dhxForm2 = new dhtmlXForm("formdhx",formData2);
	dhxForm2.attachEvent("onButtonClick",function(name, command){
		switch (name){
			case "insert":
				SearchReplaceDialog.searchNext('none');return false;
			break;
			case "replaceBtn":
				SearchReplaceDialog.searchNext('current');
			break;
			case "replaceAllBtn":
				SearchReplaceDialog.searchNext('all');
			break;
			case "cancel":
				tinyMCEPopup.close();
			break;
		}
	});
}




