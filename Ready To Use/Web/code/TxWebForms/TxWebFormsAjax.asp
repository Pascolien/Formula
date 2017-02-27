<%	
    sPathFileTxWebFormDll = Session("sTxDir") & "Core\Dlls\TxWebForm.dll"	

	SELECT CASE (request("sFunctionName")) 
		CASE "GetAttributes"
            sParameters = request("sOTTag") & "|" & request("idOT") & "|" & request("idObject") & "|" & request("sAPT") & "|" & request("DataList") & "|" & request("mandatoryAttributesIds") & "|" & request("sDefaultValues") & "|" & request("bIgnoreRights") & "|" & request("bWriteMode")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebFormDll, "GetAttributes", sParameters, sResult 
        CASE "SaveAttributes"
            sParameters = request("idOT") & "|" & request("idObject") & "|" & request("sAttributes") & "|" & request("idObjectNav") & "|" & request("idAttribute")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebFormDll, "SaveAttributes", sParameters, sResult  
        CASE "GetFilteredObjects"
            sParameters = request("idObject") & "|" & request("sData")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebFormDll, "GetFilteredObjects", sParameters, sResult 
        CASE "deleteSource"
            sParameters = request("idAtt") & "|" & request("idObject")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebFormDll, "DeleteSource", sParameters, sResult 
        CASE "deleteInfo"
            sParameters = request("idAtt") & "|" & request("idObject")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebFormDll, "DeleteInfo", sParameters, sResult 
        CASE "GetAttributeHint"
            sParameters = request("idAtt")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebFormDll, "GetAttributeHint", sParameters, sResult 
		CASE Else
			Response.Write "ajax.asp : Wrong method"
    END SELECT
	
	Response.Write sResult		
%>