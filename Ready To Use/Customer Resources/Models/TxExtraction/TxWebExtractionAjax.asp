<%
    sPathFileTxWebExtractionDll = "TxExtraction\TxExtraction.dll"

    Select Case request("sFunctionName")
        CASE "InitializeTxExtract"
            sParameters = Session("sTxDir")
            API_ASP_TxASP.Execute_DLL sPathFileTxWebExtractionDll, "InitializeTxExtract", sParameters, sResult
        CASE "OnNewExtractionForm"
            sParameters = request("idOTInitiallySelected")
            API_ASP_TxASP.Execute_DLL sPathFileTxWebExtractionDll, "OnNewExtractionForm", sParameters, sResult
        CASE "OnObjectTypeChange"
        	sParameters = request("idOTSelected")
        	API_ASP_TxASP.Execute_DLL sPathFileTxWebExtractionDll, "OnObjectTypeChange", sParameters, sResult
        CASE "OnExtractionExecute"
            sParameters = request("sExtractionTag") & "|" & request("sObjectsSelected")
            API_ASP_TxASP.Execute_DLL sPathFileTxWebExtractionDll, "OnExtractionExecute", sParameters, sResult
    END SELECT
    response.Write sResult
%>
