var sFileNameWebTreeAjax = _url('/code/TxWebComponents/WebTree/ajax.asp');
var sNull = "<null>";
var sOk = "ok";
var sErrDev_Param = "Please fill the parameter ";

function Add_ObjTree(AID_OT,AID_Div_Tree,AID_Div_Toolbar,ACheck_Type,AAllow_Switch_View,AAllow_Search,AID_Object_Checked,AID_Object_Disabled,AID_Object_Parent){
    var rTree;

    if (AID_OT == null)
        return Popup_Error(Get_MsgErr_Param("AID_OT"));

    if (AID_Div_Tree == null)
        return Popup_Error(Get_MsgErr_Param("AID_Div_Tree"));

    if (AID_Div_Toolbar == null)
        return Popup_Error(Get_MsgErr_Param("AID_Div_Tree"));

    ACheck_Type = (ACheck_Type == null) ? 1 : ACheck_Type;
    AAllow_Switch_View = (AAllow_Switch_View == null) ? true : AAllow_Switch_View;
    AAllow_Search = (AAllow_Search == null) ? true : AAllow_Search;
    AID_Object_Checked = (AID_Object_Checked == null || AID_Object_Checked == "") ? sNull : AID_Object_Checked;
    AID_Object_Disabled = (AID_Object_Disabled == null || AID_Object_Disabled == "") ? sNull : AID_Object_Disabled;
    AID_Object_Parent = (AID_Object_Parent == null || AID_Object_Parent == "") ? 0 : AID_Object_Parent;
		
	J.ajax({
		url:sFileNameWebTreeAjax,
		async:false,
		cache:false,
		dataType:'script',
		type:'post',
		data:{
			sFunctionName:"Add_ObjTree",
			ID_OT:AID_OT,
			ID_Div_Tree:AID_Div_Tree,
			ID_Div_Toolbar:AID_Div_Toolbar,
			iCheckType:ACheck_Type,
			bAllow_Switch_View:AAllow_Switch_View,
			bAllow_Search:AAllow_Search,
			sID_Object_Checked:AID_Object_Checked,
			ID_Object_Parent: AID_Object_Parent,
			sID_Object_Disabled: AID_Object_Disabled
		},
		success:function(aResult){
			sTree_Name = eval("sTreeName");
			sToolbarName = eval("sToolbarName");
			rTree = new WebTreeObject(sTree_Name, sToolbarName, true, AID_Object_Checked);
		}
	});	
	return rTree;
}

function Add_ListOTTree(AIDs_OT,AID_Div_Tree,AID_Div_Toolbar,ACheck_Type,AAllow_Switch_View,AID_Object_Checked,AID_Object_Disabled){
    var rTree;

    if (AIDs_OT == null)
        return Popup_Error(Get_MsgErr_Param("AIDs_OT"));

    if (AID_Div_Tree == null)
        return Popup_Error(Get_MsgErr_Param("AID_Div_Tree"));

    if (AID_Div_Toolbar == null)
        return Popup_Error(Get_MsgErr_Param("AID_Div_Toolbar"));
	
    ACheck_Type = (ACheck_Type == null) ? 1 : ACheck_Type;
	AAllow_Switch_View = (AAllow_Switch_View == null) ? false : AAllow_Switch_View;
	AID_Object_Checked = (AID_Object_Checked == null || AID_Object_Checked == "") ? sNull : AID_Object_Checked;
	AID_Object_Disabled = (AID_Object_Disabled == null || AID_Object_Disabled == "") ? sNull : AID_Object_Disabled;
		
	J.ajax({
		url:sFileNameWebTreeAjax,
		async:false,
		cache:false,
		dataType: "script",
		type: 'post',
		data:{
			sFunctionName:"Add_ListOTTree",
			sIDs_OT: AIDs_OT,
			ID_Div_Tree:AID_Div_Tree,
			ID_Div_Toolbar:AID_Div_Toolbar,
			iCheckType:ACheck_Type,
			bAllow_switch_view:AAllow_Switch_View,
			sID_Objects_Checked: AID_Object_Checked,
			sID_Object_Disabled: AID_Object_Disabled
		},
		success:function(){
		    sTree_Name = eval("sTreeName");
			sToolbarName = eval("sToolbarName");
			rTree = new WebTreeObject(sTree_Name, sToolbarName, true, AID_Object_Checked);
		}
	});	
	return rTree;
}

function Add_ListObjTree(AIDs_Object,AID_Div_Tree,AID_Div_Toolbar,ACheck_Type,AAllow_Switch_View,AAllow_Search,AID_Object_Checked,AID_Object_Disabled,ANoChild){
    var rTree;

    if (AIDs_Object == null)
        return Popup_Error(Get_MsgErr_Param("AIDs_Object"));

    if (AID_Div_Tree == null)
        return Popup_Error(Get_MsgErr_Param("AID_Div_Tree"));

    if (AID_Div_Toolbar == null)
        return Popup_Error(Get_MsgErr_Param("AID_Div_Toolbar"));

    ACheck_Type = (ACheck_Type == null) ? 1 : ACheck_Type;
    AAllow_Switch_View = (AAllow_Switch_View == null) ? true : AAllow_Switch_View;
    AAllow_Search = (AAllow_Search == null) ? true : AAllow_Search;
    AID_Object_Checked = (AID_Object_Checked == null || AID_Object_Checked == "") ? sNull : AID_Object_Checked;
    AID_Object_Disabled = (AID_Object_Disabled == null || AID_Object_Disabled == "") ? sNull : AID_Object_Disabled;
    ANoChild = (ANoChild == null) ? true : ANoChild;
		
	J.ajax({
		url:sFileNameWebTreeAjax,
		async:false,
		cache:false,
		dataType: "script",
		type: 'post',
		data:{
			sFunctionName:"Add_ListObjTree",
			sIDs_Object: AIDs_Object,
			ID_Div_Tree:AID_Div_Tree,
			ID_Div_Toolbar:AID_Div_Toolbar,
			iCheckType:ACheck_Type,
			bAllow_Switch_View:AAllow_Switch_View,
			bAllow_Search:AAllow_Search,
			sID_Objects_Checked: AID_Object_Checked,
			sID_Object_Disabled: AID_Object_Disabled,
			bNoChild:ANoChild
		},
		success:function(){
			sTree_Name = eval("sTreeName");
			sToolbarName = eval("sToolbarName");
			rTree = new WebTreeObject(sTree_Name, sToolbarName, true, AID_Object_Checked);
		}
	});	
	return rTree;
}

function Add_AttributeTree(AID_OT, AID_Div_Tree, AID_Div_Toolbar, ACheck_Type, ARecursive_Link, ADisplay_Associative_OT, AAllow_Check_Associative, AID_Object_Checked, AID_Object_Disabled) {
    var rTree;

    if (AID_OT == null)
        return Popup_Error(Get_MsgErr_Param("AID_OT"));

    if (AID_Div_Tree == null)
        return Popup_Error(Get_MsgErr_Param("AID_Div_Tree"));

    if (AID_Div_Toolbar == null)
        return Popup_Error(Get_MsgErr_Param("AID_Div_Toolbar"));

    ACheck_Type = (ACheck_Type == null) ? 1 : ACheck_Type;
    ARecursive_Link = (ARecursive_Link == null) ? true : ARecursive_Link;
    ADisplay_Associative_OT = (ADisplay_Associative_OT == null) ? true : ADisplay_Associative_OT;
    AAllow_Check_Associative = (AAllow_Check_Associative == null) ? true : AAllow_Check_Associative;
    AID_Object_Checked = (AID_Object_Checked == null || AID_Object_Checked == "") ? sNull : AID_Object_Checked;
    AID_Object_Disabled = (AID_Object_Disabled == null || AID_Object_Disabled == "") ? sNull : AID_Object_Disabled;

    J.ajax({
        url: sFileNameWebTreeAjax,
        async: false,
        cache: false,
        dataType: 'script',
        type: 'post',
        data: {
            sFunctionName: "Add_AttributeTree",
            ID_OT: AID_OT,
            ID_Div_Tree: AID_Div_Tree,
            ID_Div_Toolbar: AID_Div_Toolbar,
            iCheckType: ACheck_Type,
            bRecursive_Link: ARecursive_Link,
            bDisplay_Associative_OT: ADisplay_Associative_OT,
            bAllow_Check_Associative: AAllow_Check_Associative,
            sID_Objects_Checked: AID_Object_Checked,
            sID_Object_Disabled: AID_Object_Disabled
        },
        success: function () {
            sTree_Name = eval("sTreeName");
            sToolbarName = eval("sToolbarName");
            rTree = new WebTreeObject(sTree_Name, sToolbarName, true, AID_Object_Checked);
        }
    });
    return rTree;
}

function Add_AttributeSetTree(AID_AttributeSet, AID_Div_Tree, AID_Div_Toolbar, ACheck_Type, ARecursive_Link, ADisplay_Associative_OT, AAllow_Check_Associative, AID_Object_Checked, AID_Object_Disabled) {
    var rTree;

    if (AID_AttributeSet == null)
        return Popup_Error(Get_MsgErr_Param("AID_AttributeSet"));

    if (AID_Div_Tree == null)
        return Popup_Error(Get_MsgErr_Param("AID_Div_Tree"));

    if (AID_Div_Toolbar == null)
        return Popup_Error(Get_MsgErr_Param("AID_Div_Toolbar"));

    ACheck_Type = (ACheck_Type == null) ? 1 : ACheck_Type;
    ARecursive_Link = (ARecursive_Link == null) ? true : ARecursive_Link;
    ADisplay_Associative_OT = (ADisplay_Associative_OT == null) ? true : ADisplay_Associative_OT;
    AAllow_Check_Associative = (AAllow_Check_Associative == null) ? true : AAllow_Check_Associative;
    AID_Object_Checked = (AID_Object_Checked == null || AID_Object_Checked == "") ? sNull : AID_Object_Checked;
    AID_Object_Disabled = (AID_Object_Disabled == null || AID_Object_Disabled == "") ? sNull : AID_Object_Disabled;

    J.ajax({
        url: sFileNameWebTreeAjax,
        async: false,
        cache: false,
        dataType: 'script',
        type: 'post',
        data: {
            sFunctionName: "Add_AttributeTree",
            ID_AtributeSet: AID_AttributeSet,
            ID_Div_Tree: AID_Div_Tree,
            ID_Div_Toolbar: AID_Div_Toolbar,
            iCheckType: ACheck_Type,
            bRecursive_Link: ARecursive_Link,
            bDisplay_Associative_OT: ADisplay_Associative_OT,
            bAllow_Check_Associative: AAllow_Check_Associative,
            sID_Objects_Checked: AID_Object_Checked,
            sID_Object_Disabled: AID_Object_Disabled
        },
        success: function () {
            sTree_Name = eval("sTreeName");
            sToolbarName = eval("sToolbarName");
            rTree = new WebTreeObject(sTree_Name, sToolbarName, true, AID_Object_Checked);
        }
    });
    return rTree;
}

function Add_ListAttributeTree(AID_Attributes,AID_Div_Tree,AID_Div_Toolbar,ACheck_Type,AID_Object_Checked,AID_Object_Disabled){
	var rTree;
	
	if (AID_Attributes == null)
	    return Popup_Error(Get_MsgErr_Param("AID_Attributes"));

	if (AID_Div_Tree == null)
	    return Popup_Error(Get_MsgErr_Param("AID_Div_Tree"));

	if (AID_Div_Toolbar == null)
	    return Popup_Error(Get_MsgErr_Param("AID_Div_Toolbar"));

	ACheck_Type = (ACheck_Type == null) ? 1 : ACheck_Type;
	AID_Object_Checked = (AID_Object_Checked == null || AID_Object_Checked == "") ? sNull : AID_Object_Checked;
	AID_Object_Disabled = (AID_Object_Disabled == null || AID_Object_Disabled == "") ? sNull : AID_Object_Disabled;

	J.ajax({
		url:sFileNameWebTreeAjax,
		async:false,
		cache:false,
		dataType: "script",
		type: 'post',
		data:{
			sFunctionName:"Add_ListAttributeTree",
			sID_Attributes:AID_Attributes,
			ID_Div_Tree:AID_Div_Tree,
			ID_Div_Toolbar:AID_Div_Toolbar,
			iCheckType:ACheck_Type,
			sID_Objects_Checked: AID_Object_Checked,
			sID_Objects_Disabled: AID_Object_Disabled
		},
		success: function () {
			tree = eval("dhxTree");
			sTree_Name = eval("sTreeName");
			sToolbarName = eval("sToolbarName");
			rTree = new WebTreeObject(sTree_Name, sToolbarName, true, AID_Object_Checked);
		}
	});	
	return rTree;
}

function Get_MsgErr_Param(AParamName) {
    return sErrDev_Param + AParamName;
}