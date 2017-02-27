<%
	sPath_File_TxWebComponents_DLL = Session("sTxDir") + "core/dlls/TxWebComponents.dll"
    SELECT CASE (request("sFunctionName"))
		CASE "OnRootNodeExpand"
			sParameters = request("sTreeName")
			API_ASP_TxASP.Execute_DLL sPath_File_TxWebComponents_DLL, "OnRootNodeExpand", sParameters, sResult
		CASE "OnExpand"
			sParameters = request("sTreeName") & "|" & request("id") & "|" & request("IdObject") 
			API_ASP_TxASP.Execute_DLL sPath_File_TxWebComponents_DLL, "OnExpand", sParameters, sResult
		CASE "OnCheck"
			sParameters = request("sTreeName") & "|" & request("id_object") & "|" & request("bChecked") 
			API_ASP_TxASP.Execute_DLL sPath_File_TxWebComponents_DLL, "OnCheck", sParameters, sResult
		CASE "OnSelect"
			sParameters = request("sTreeName") & "|" & request("id_object") 
			API_ASP_TxASP.Execute_DLL sPath_File_TxWebComponents_DLL, "OnSelect", sParameters, sResult
		CASE "Set_IDs_Object_Checked"
			sParameters = request("sTreeName") & "|" & request("ids_object_checked") 
			API_ASP_TxASP.Execute_DLL sPath_File_TxWebComponents_DLL, "Set_IDs_Object_Checked", sParameters, sResult
		CASE "Set_IDs_Object_Disabled"
			sParameters = request("sTreeName") & "|" & request("ids_object_disabled") 
			API_ASP_TxASP.Execute_DLL sPath_File_TxWebComponents_DLL, "Set_IDs_Object_Disabled", sParameters, sResult
		CASE "Check_All"
			sParameters = request("sTreeName") & "|" & request("id_selected") 
			API_ASP_TxASP.Execute_DLL sPath_File_TxWebComponents_DLL, "Check_All", sParameters, sResult
		CASE "UnCheck_All"
			sParameters = request("sTreeName") & "|" & request("id_selected") 
			API_ASP_TxASP.Execute_DLL sPath_File_TxWebComponents_DLL, "UnCheck_All", sParameters, sResult
		CASE "Switch_To_Linear_View"
			sParameters = request("sTreeName") 
			API_ASP_TxASP.Execute_DLL sPath_File_TxWebComponents_DLL, "Switch_To_Linear_View", sParameters, sResult
		CASE "Switch_To_TreeView_View"
			sParameters = request("sTreeName") 
			API_ASP_TxASP.Execute_DLL sPath_File_TxWebComponents_DLL, "Switch_To_TreeView_View", sParameters, sResult
		CASE "OnSearchEditEnter"
			sParameters = request("sTreeName") & "|" & request("value_searched") 
			API_ASP_TxASP.Execute_DLL sPath_File_TxWebComponents_DLL, "OnSearchEditEnter", sParameters, sResult
        CASE "GetNodesLegacy"
			sParameters = request("sTreeName")
			API_ASP_TxASP.Execute_DLL sPath_File_TxWebComponents_DLL, "GetNodesLegacy", sParameters, sResult
        CASE "Get_WebTree_IdObjectsChecked"
			sParameters = request("sTreeName")
			API_ASP_TxASP.Execute_DLL sPath_File_TxWebComponents_DLL, "Get_WebTree_IdObjectsChecked", sParameters, sResult

		CASE "Add_ObjTree"
			sParameters = request("ID_OT") & "|" & request("ID_Div_Tree") & "|" & request("ID_Div_Toolbar") & "|" & request("iCheckType") & "|" & request("bAllow_Switch_View") & "|" & request("bAllow_Search") & "|" & request("sID_Object_Checked") & "|" & request("ID_Object_Parent") & "|" & request("sID_Object_Disabled")
			API_ASP_TxASP.Execute_DLL sPath_File_TxWebComponents_DLL, "Add_ObjTree", sParameters, sResult
		CASE "Add_ListObjTree"
			sParameters = request("sIDs_Object") & "|" & request("ID_Div_Tree") & "|" & request("ID_Div_Toolbar") & "|" & request("iCheckType") & "|" & request("bAllow_Switch_View") & "|" & request("bAllow_Search") & "|" & request("sID_Objects_Checked") & "|" & request("bNoChild") & "|" & request("sID_Object_Disabled")
			API_ASP_TxASP.Execute_DLL sPath_File_TxWebComponents_DLL, "Add_ListObjTree", sParameters, sResult
		CASE "Add_AttributeTree"
			sParameters = request("ID_OT") & "|" & request("ID_Div_Tree") & "|" & request("ID_Div_Toolbar") & "|" & request("iCheckType") & "|" & request("bRecursive_Link") & "|" & request("bDisplay_Associative_OT") & "|" & request("bAllow_Check_Associative") & "|" & request("sID_Objects_Checked") & "|" & request("sID_Object_Disabled")
			API_ASP_TxASP.Execute_DLL sPath_File_TxWebComponents_DLL, "Add_AttributeTree", sParameters, sResult
        CASE "Add_AttributeSetTree"
			sParameters = request("ID_AtributeSet") & "|" & request("ID_Div_Tree") & "|" & request("ID_Div_Toolbar") & "|" & request("iCheckType") & "|" & request("bRecursive_Link") & "|" & request("bDisplay_Associative_OT") & "|" & request("bAllow_Check_Associative") & "|" & request("sID_Objects_Checked") & "|" & request("sID_Object_Disabled")
			API_ASP_TxASP.Execute_DLL sPath_File_TxWebComponents_DLL, "Add_AttributeSetTree", sParameters, sResult
		CASE "Add_ListAttributeTree"
			sParameters = request("sID_Attributes") & "|" & request("ID_Div_Tree") & "|" & request("ID_Div_Toolbar") & "|" & request("iCheckType") & "|" & request("sID_Objects_Checked") & "|" & request("sID_Objects_Disabled")
			API_ASP_TxASP.Execute_DLL sPath_File_TxWebComponents_DLL, "Add_ListAttributeTree", sParameters, sResult
		CASE "Add_ListOTTree"
			sParameters = request("sIDs_OT") & "|" & request("ID_Div_Tree") & "|" & request("ID_Div_Toolbar") & "|" & request("iCheckType") & "|" & request("bAllow_switch_view") & "|" & request("sID_Objects_Checked") & "|" & request("sID_Object_Disabled")
			API_ASP_TxASP.Execute_DLL sPath_File_TxWebComponents_DLL, "Add_ListOTTree", sParameters, sResult
	END SELECT	
	response.write sResult	
%>