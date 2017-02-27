<%
    sPathFileTxLogDll =  Session("sTxDir") & "Core\dlls\TxLog.dll"
    SELECT CASE (request("sFunctionName"))
        CASE "isTxLogActive"
			API_ASP_TxASP.Execute_DLL sPathFileTxLogDll, "IsTxLogActive", "", sResult 
        CASE "resetLog"
			API_ASP_TxASP.Execute_DLL sPathFileTxLogDll, "ResetLog", "", sResult 
        CASE "captureLog"
            sParameters = request("sPrefix") & "|" & request("bZip")
            API_ASP_TxASP.Execute_DLL sPathFileTxLogDll, "CaptureLog", sParameters, sResult
    END SELECT 

    Response.Write sResult
%>