<%
    sPathFileTxLoginDll =  Session("sTxDir") & "Core\dlls\TxLogin.dll"
    SELECT CASE (request("sFunctionName"))
        CASE "InitializeAuthentication"
            sParameters = request("bAllowAutomaticConnection") & "|" & request("sTimezoneInformation") & "|" & request("sBrowserDateFormat")
			API_ASP_TxASP.Execute_DLL sPathFileTxLoginDll, "InitializeAuthentication", sParameters, sResult 
        CASE "Login"
            sParameters = request("sLogin") & "|" & request("sPassword") & "|" & request("idLanguage")
            Session("sLanguageCode") = request("sLang")
            API_ASP_TxASP.UpdateLanguage Session("sLanguageCode"), sResult
			API_ASP_TxASP.Execute_DLL sPathFileTxLoginDll, "Login", sParameters, sResult 
        CASE "LoadTEEXMA"
            API_ASP_TxASP.Execute_DLL sPathFileTxLoginDll, "LoadTEEXMA", "", sResult
        CASE "setManualConnectionProhibited"
            Session("bManualConnectionProhibited") = request("bManualConnectionProhibited")
        CASE "GetManualConnectionProhibited"
            sResult = Session("bManualConnectionProhibited")
        CASE "setIdLogin"
			Session("ID_Login") = request("idLogin")
        CASE "setMaxSizeUpload"
			Session("iMaxSizeUpload") = request("iMaxSizeUpload")
            sResult = "ok"
        CASE "setSessionVariables"
			Session("ID_Login") = request("idLogin")
			Session("iMaxSizeUpload") = request("iMaxSizeUpload")
            Session("bManualConnectionProhibited") = request("bManualConnectionProhibited")
            Session("sDllConstructionMode") = request("sDllConstructionMode")
            sResult = "ok"
        case "getWebDir"
            sResult = Session("sWebDir")
        case "getTxDir"
            sResult = Session("sTxDir")
        case "getTmpDir"
            sResult = Session("sTmpDir")
        case "UpdateLanguage"
            Session("sLanguageCode") = request("sLanguageCode")
            API_ASP_TxASP.UpdateLanguage request("sLanguageCode"), sResult
    END SELECT 

    Response.Write sResult
%>