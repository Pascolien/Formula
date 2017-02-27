var sFileNameWebComboAjax = _url('/code/TxWebComponents/WebCombo/ajax.asp');
var sNull = "<null>";
var sErrDev_Combo = "Please fill the parameter id div combo.";
var sErrDev_ID_OT = "Please fill the parameter Combo ID Object Type.";
var sErrDev_OptionsNames = "Please fill the parameter OptionsNames separated by ';'.";
var iDefaultWidth = 300;
var iDefaultHeight = 190;

function Add_ComboObject(AID_OT,AID_Div_Combo,AWidth,AHeight,AID_Parent,ADefault_Option,AContains_Img,ARecursive,AInclude_Folder,AID_Object_ToSelect){
	var rCombo;
	
	if (AID_OT == null)
		return Popup_Error(sErrDev_ID_OT);
	
	if (AID_Div_Combo == null)
		return Popup_Error(sErrDev_Combo);	
	
	AWidth = (AWidth == null) ? iDefaultWidth : AWidth;
	AHeight = (AHeight == null) ? iDefaultHeight : AHeight;
	AID_Parent = (AID_Parent == null) ? 0 : AID_Parent;
	ADefault_Option = (ADefault_Option == null) ? sNull : ADefault_Option;
	AContains_Img = (AContains_Img == null) ? true : AContains_Img;
	ARecursive = (ARecursive == null) ? false : ARecursive;
	AInclude_Folder = (AInclude_Folder == null) ? false : AInclude_Folder;
	AID_Object_ToSelect = (AID_Object_ToSelect == null) ? 0 : AID_Object_ToSelect;
		
	J.ajax({
		url:sFileNameWebComboAjax,
		async:false,
		cache:false,
		dataType:'script',
		type: 'post',
		data:{
			sFunctionName:"Add_ComboObject",
			sID_Div_Combo:AID_Div_Combo,
			iWidth:AWidth,
			iHeight:AHeight,
			sDefaultOption: ADefault_Option,
			bContains_Img:AContains_Img,
			bRecursive:ARecursive,
			bInclude_Folder:AInclude_Folder,
			ID_Parent:AID_Parent,
			ID_OT:AID_OT,
			ID_Object_ToSelect:AID_Object_ToSelect
		},
		success:function(){
			sCombo_Name = eval("sComboName");

			rCombo = new WebComboObject(sCombo_Name,true);
		}
	});	
	return rCombo;
}

function Add_ComboOT(AID_Div_Combo, AWidth, AHeight, ADisplayPortals, ADisplayAssociatives, ADisplayListing, AContains_Img, ADefault_Option, AID_Object_ToSelect) {
    var rCombo;

    if (AID_Div_Combo == null)
        return Popup_Error(sErrDev_Combo);
    AWidth = (AWidth == null) ? iDefaultWidth : AWidth;
    AHeight = (AHeight == null) ? iDefaultHeight : AHeight;
    ADisplayPortals = (ADisplayPortals == null) ? false : ADisplayPortals;
    ADisplayAssociatives = (ADisplayAssociatives == null) ? false : ADisplayAssociatives;
    ADisplayListing = (ADisplayListing == null) ? false : ADisplayListing;
    AContains_Img = (AContains_Img == null) ? true : AContains_Img;
    ADefault_Option = (ADefault_Option == null || ADefault_Option == "") ? sNull : ADefault_Option;
    AID_Object_ToSelect = (AID_Object_ToSelect == null || AID_Object_ToSelect == "") ? 0 : AID_Object_ToSelect;

    J.ajax({
        url: sFileNameWebComboAjax,
        async: false,
        dataType: 'script',
        type: 'post',
        data: {
            sFunctionName: "Add_ComboOT",
            sID_Div_Combo: AID_Div_Combo,
            iWidth: AWidth,
            iHeight: AHeight,
            bContains_Img: AContains_Img,
            bDisplayAssociatives: ADisplayAssociatives,
            sDefaultOption: ADefault_Option, 
            bDisplayPortals: ADisplayPortals,
            bDisplayListing: ADisplayListing,
            ID_Object_ToSelect: AID_Object_ToSelect

        },
        success: function () {
            sCombo_Name = eval("sComboName");

            rCombo = new WebComboObject(sCombo_Name, true, AID_Object_ToSelect);
        }
    });
    return rCombo;
}

function Add_ComboListOT(AID_Div_Combo,AIDs_Options, AWidth, AHeight, AContains_Img, ADefault_Option, AID_Object_ToSelect) {
    var rCombo;

    if (AID_Div_Combo == null)
        return Popup_Error(sErrDev_Combo);

    AIDs_Options = (AIDs_Options == null) ? sNull : AIDs_Options;
    AWidth = (AWidth == null) ? iDefaultWidth : AWidth;
    AHeight = (AHeight == null) ? iDefaultHeight : AHeight;
    AContains_Img = (AContains_Img == null) ? true : AContains_Img;
    ADefault_Option = (ADefault_Option == null) ? sNull : ADefault_Option;
    AID_Object_ToSelect = (AID_Object_ToSelect == null) ? 0 : AID_Object_ToSelect;

    J.ajax({
        url: sFileNameWebComboAjax,
        async: false,
        dataType: 'script',
        type: 'post',
        data: {
            sFunctionName: "Add_ComboListOT",
            sID_Div_Combo: AID_Div_Combo,
            iWidth: AWidth,
            iHeight: AHeight,
            sDefaultOption: ADefault_Option,
            IDs_Options: AIDs_Options,
            bContains_Img: AContains_Img,
            ID_Object_ToSelect: AID_Object_ToSelect

        },
        success: function () {
            sCombo_Name = eval("sComboName");

            rCombo = new WebComboObject(sCombo_Name, true);
        }
    });
    return rCombo;
}

function Add_ComboStd(AOptions_Names,AID_Div_Combo,AWidth,AHeight,ADefault_Option){
	var rCombo;
	if (AOptions_Names == null)
		return Popup_Error(sErrDev_OptionsNames);
	
	if (AID_Div_Combo == null)
		return Popup_Error(sErrDev_Combo);
	
	AWidth = (AWidth == null) ? iDefaultWidth : AWidth;
	AHeight = (AHeight == null) ? iDefaultHeight : AHeight;
	ADefault_Option = (ADefault_Option == null) ? sNull : ADefault_Option;
	
	J.ajax({
		url:sFileNameWebComboAjax,
		async:false,
		dataType:'script',
		type:'post',
		data:{
			sFunctionName:"Add_ComboStd",
			sID_Div_Combo:AID_Div_Combo,
			iWidth:AWidth,
			iHeight:AHeight,
			sDefaultOption: ADefault_Option,
			sOptions_Names:AOptions_Names
		},
		success:function(){
			sCombo_Name = eval("sComboName");

			rCombo = new WebComboObject(sCombo_Name,true);
		}
	});
	return rCombo;
}
