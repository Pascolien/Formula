<%	
	sPathDLLTxModelApplication = Session("sTxDir") & "core/dlls/TxModelApplication.dll"
    SELECT CASE (request("sFunctionName")) 
        CASE "ExecuteModelApplication"
	        sParameters = request("idModelApplication") & "|" & request("sObjectIds") & "|" & request("idObjectType")
	        API_ASP_TxAsp.Execute_DLL sPathDLLTxModelApplication, "ExecuteModelApplication", sParameters, sResult
        CASE "ExecuteModelApplicationOnSpecificEvent"
	        sParameters = request("idObjectType") & "|" & request("idObject") & "|" & request("sEvent") & "|" & request("sIdAttributes")
	        API_ASP_TxAsp.Execute_DLL sPathDLLTxModelApplication, "ExecuteModelApplicationOnSpecificEvent", sParameters, sResult
		CASE "ManageWebModelApplicationOutputs"
	        Response.Write "TxModelApplicationAjax.asp : ""ManageWebModelApplicationOutputs"" is not avaliable yet"
        CASE "GetJsonObjectFromIdObject"
	        sParameters = request("idObject")
	        API_ASP_TxAsp.Execute_DLL sPathDLLTxModelApplication, "GetJsonObjectFromIdObject", sParameters, sResult 
        CASE "GetModelApplicationObjectsDependency"
            sParameters = request("idModelApplication")
	        API_ASP_TxAsp.Execute_DLL sPathDLLTxModelApplication, "GetModelApplicationObjectsDependency", sParameters, sResult
        CASE Else
			Response.Write "TxModelApplicationAjax.asp : Wrong method"
    END SELECT
	
	response.write(sResult)
%>                    
