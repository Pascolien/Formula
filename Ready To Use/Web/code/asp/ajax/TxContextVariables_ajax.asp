<%
    sPathFileTxContextVariablesDll = Session("sTxDir") & "Core\Dlls\TxContextVariables.dll"
    Select Case request("sFunctionName")
        CASE "SetVariable"
			sParameters = request("sValue") & "|" & request("sKey")
			API_ASP_TxASP.Execute_DLL sPathFileTxContextVariablesDll, "SetVariable", sParameters, sResult
        CASE "ExtractVariable"
            sParameters = request("sKey") & "|" & request("sDefault")
            API_ASP_TxASP.Execute_DLL sPathFileTxContextVariablesDll, "ExtractVariable", sParameters, sResult
        CASE "GetVariable"
            sParameters = request("sKey") & "|" & request("sDefault")
            API_ASP_TxASP.Execute_DLL sPathFileTxContextVariablesDll, "GetVariable", sParameters, sResult
        CASE "GetConstant"
            sParameters = request("sKey") & "|" & request("sDefault")
            API_ASP_TxASP.Execute_DLL sPathFileTxContextVariablesDll, "GetConstant", sParameters, sResult
        CASE "ReadObjectSettings"
            sParameters = request("idObject") & "|" & request("sTag")
            API_ASP_TxASP.Execute_DLL sPathFileTxContextVariablesDll, "ReadObjectSettings", sParameters, sResult
        CASE "WriteObjectSettings"
            sParameters = request("idObject") & "|" & request("sTag")& "|" & request("sSettings")
            API_ASP_TxASP.Execute_DLL sPathFileTxContextVariablesDll, "WriteObjectSettings", sParameters, sResult
    END SELECT
    response.Write sResult
%>