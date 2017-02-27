<%
    sPathFileVdDll = "TxVisualDesign\TxVisualDesign.dll"
    SELECT CASE (request("sFunctionName"))
        CASE "getCfgModel"    
            sParameters = Session("sTxDir") &"|"& request("idOT")
            API_ASP_TxASP.Execute_DLL sPathFileVdDll, "GetCfgModel", sParameters, sResult    
		CASE "checkObjRight"    
            sParameters = Session("sTxDir") &"|"& request("idObject")
            API_ASP_TxASP.Execute_DLL sPathFileVdDll, "CheckObjRight", sParameters, sResult
		CASE "getTxObjects"    
            sParameters = request("idOt")
            API_ASP_TxASP.Execute_DLL sPathFileVdDll, "GetTxObjects", sParameters, sResult 
		CASE "getModelFromDB"    
            sParameters = request("idObject")
            API_ASP_TxASP.Execute_DLL sPathFileVdDll, "GetModelFromDB", sParameters, sResult 
		CASE "getAsStruct"    
            sParameters = Session("sTxDir") &"|"& request("idObject") &"|"& request("as")
            API_ASP_TxASP.Execute_DLL sPathFileVdDll, "GetAsStruct", sParameters, sResult
		CASE "saveThumbnail"    
            sParameters = request("img") &"|"& request("idObject") &"|"& request("sTagThumbnail")
            API_ASP_TxASP.Execute_DLL sPathFileVdDll, "SaveThumbnail", sParameters, sResult
		CASE "matchObjectData"    
            sParameters = Session("sTxDir") &"|"& request("idObject")
            API_ASP_TxASP.Execute_DLL sPathFileVdDll, "MatchObjectData", sParameters, sResult
		CASE "saveCfg"    
            sParameters = request("idObject") &"|"& request("model")
            API_ASP_TxASP.Execute_DLL sPathFileVdDll, "SaveCfg", sParameters, sResult
		CASE "updateDesign"    
            sParameters = request("idObject") &"|"& request("design") &"|"& request("links")
            API_ASP_TxASP.Execute_DLL sPathFileVdDll, "UpdateDesign", sParameters, sResult
    END SELECT 

    Response.Write sResult
%>