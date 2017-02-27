<%
	sPathFileTxWebComponentsDll = Session("Dir_TEEXMA_Path") & "Core\Dlls\TxWebComponents.dll"
	SELECT CASE (request("sFunctionName"))
		CASE "Initialize_Combo"
			sParameters = request("sCombo_Name")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDll, "Initialize_Combo", sParameters, sResult
		CASE "Add_ComboStd"
			sParameters = request("sID_Div_Combo") & "|" & request("iWidth") & "|" & request("iHeight") & "|" & request("sDefaultOption") & "|" & request("sOptions_Names")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDll, "Add_ComboStd", sParameters, sResult
		CASE "Add_ComboObject"
			sParameters = request("sID_Div_Combo") & "|" & request("iWidth") & "|" & request("iHeight") & "|" & request("sDefaultOption") & "|" & request("ID_OT") & "|" & request("ID_Parent") & "|" & request("bContains_Img") & "|" & request("bRecursive") & "|" & request("bInclude_Folder") & "|" & request("ID_Object_ToSelect")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDll, "Add_ComboObject", sParameters, sResult
		CASE "Add_ComboOT"
			sParameters = request("sID_Div_Combo") & "|" & request("iWidth") & "|" & request("iHeight") & "|" & request("sDefaultOption") & "|" & request("bContains_Img") & "|" & request("bDisplayAssociatives") & "|" & request("bDisplayPortals") & "|" & request("bDisplayListing") & "|" & request("ID_Object_ToSelect") 
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDll, "Add_ComboOT", sParameters, sResult
        CASE "Add_ComboListOT"
			sParameters = request("sID_Div_Combo") & "|" & request("iWidth") & "|" & request("iHeight") & "|" & request("sDefaultOption") & "|" & request("IDs_Options") & "|" & request("bContains_Img") & "|" & request("ID_Object_ToSelect") 
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDll, "Add_ComboListOT", sParameters, sResult
	END SELECT	
	response.write sResult	
%>