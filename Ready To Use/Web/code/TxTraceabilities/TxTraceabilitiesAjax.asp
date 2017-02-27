<%	
	sPathDLLTxTraceabilities = Session("sTxDir") & "core/dlls/TxTraceabilities.dll"
    SELECT CASE (request("sFunctionName")) 
        CASE "GetObjectTraceabilities"
	        sParameters = request("idObject")
	        API_ASP_TxAsp.Execute_DLL sPathDLLTxTraceabilities, "GetObjectTraceabilities", sParameters, sResult
        CASE Else
			Response.Write "TxTraceabilitiesAjax.asp : Wrong method"
    END SELECT
	
	response.write(sResult)
%>                    
