<% 		
	sPathDllTxWorkflow ="TxWorkflow\TxWorkflow.dll"
	SELECT CASE (request("sFunctionName"))
		 CASE "ListActions"
			sParameters = Session("sTxDir") & "|" & request("idObject") & "|" & Request("var0") & "|" & Request("var1")
			API_ASP_TxAsp.Execute_DLL sPathDllTxWorkflow, "ListActions", sParameters, sResult
        CASE "ExecuteAction"
			sParameters = Session("sTxDir") & "|" & request("idObject") & "|" & request("iActionOrder") & "|" & request("sWorkflowTag") & "|" & request("idCurrentTask")
			API_ASP_TxAsp.Execute_DLL sPathDllTxWorkflow, "ExecuteAction", sParameters, sResult
        CASE "UnlockAction"
            sParameters = Session("sTxDir") & "|" & request("idObject")
			API_ASP_TxAsp.Execute_DLL sPathDllTxWorkflow, "UnlockAction", sParameters, sResult
	END SELECT
	
	response.write sResult
%>
