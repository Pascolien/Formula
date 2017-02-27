<%
    sPathFileTxWebExportationDll = Session("sTxDir") & "Core\Dlls\TxWebExportation.dll"	 
    
    Select Case request("sFunctionName")
        CASE "OnNewExportationForm"		
			sParameters = request("idOTInitiallySelected") & "|" & request("sSelectedObjectsKey") & "|" & request("idObjects")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebExportationDll, "OnNewExportationForm", sParameters, sResult
        CASE "OnObjectTypeChange"
            sParameters = request("idOTInitiallySelected") & "|" & request("idOTSelected") & "|" & request("sSelectedObjectsKey") & "|" & request("idObjects") & "|" & request("sIdTreeObject") & "|" & request("sIdTreeAttribute")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebExportationDll, "OnObjectTypeChange", sParameters, sResult
        CASE "OnExportationChange"
            sParameters = request("idOTInitiallySelected") & "|" & request("idOTSelected") & "|" & request("sSelectedObjectsKey") & "|" & request("idObjects") & "|" & request("iIndexExport") & "|" & request("sIdTreeObject") & "|" & request("sIdTreeAttribute")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebExportationDll, "OnExportationChange", sParameters, sResult
        CASE "OnExportationExecute"
            sParameters = request("idOTSelected") & "|" & request("iIndexExport") & "|" & request("bZipped") & "|" & request("sIdTreeObject") & "|" & request("sIdTreeAttribute")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebExportationDll, "OnExportationExecute", sParameters, sResult
        CASE "OnExportationFormClose"
            sParameters = request("sSelectedObjectsKey") & "|" & request("sIdTreeObject") & "|" & request("sIdTreeAttribute")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebExportationDll, "OnExportationFormClose", sParameters, sResult
    END SELECT
    response.Write sResult
%>