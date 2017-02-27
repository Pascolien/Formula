<%
    sPathFileTxWebMCSDll = "TxMCS\TxMCS.dll"

    Select Case request("sFunctionName")
        CASE "OnInitializeForm"
            sParameters = Session("sTxDir") & "|" & request("idObjectType")
            API_ASP_TxASP.Execute_DLL sPathFileTxWebMCSDll, "OnInitializeForm", sParameters, sResult
        CASE "OnQueryForMoreObjectTypes"
            sParameters = request("idObjectType")
            API_ASP_TxASP.Execute_DLL sPathFileTxWebMCSDll, "OnQueryForMoreObjectTypes", sParameters, sResult
        CASE "OnQueryForMoreRequirementsLists"
            sParameters = request("idObjectType")
            API_ASP_TxASP.Execute_DLL sPathFileTxWebMCSDll, "OnQueryForMoreRequirementsLists", sParameters, sResult
        CASE "OnMultiSelect"
            sParameters = request("idObjectType") & "|" & request("sRequirementsList")
            API_ASP_TxASP.Execute_DLL sPathFileTxWebMCSDll, "OnMultiSelect", sParameters, sResult
        CASE "OnSimplifiedExport"
            sParameters = request("idSelection") & "|" & request("bDisplayWrongMark")
            API_ASP_TxASP.Execute_DLL sPathFileTxWebMCSDll, "OnSimplifiedExport", sParameters, sResult
        CASE "FreeSelection"
            sParameters = request("idSelection")
            API_ASP_TxASP.Execute_DLL sPathFileTxWebMCSDll, "FreeSelection", sParameters, sResult
        CASE "OnLoadRequirementsList"
            sParameters = Session("sTxDir") & "|" & request("idObjectType") & "|" & request("idRequirementsList")
            API_ASP_TxASP.Execute_DLL sPathFileTxWebMCSDll, "OnLoadRequirementsList", sParameters, sResult
        CASE "OnDisplayNumericalAttribute"
            sParameters = request("idAttribute")
        	API_ASP_TxASP.Execute_DLL sPathFileTxWebMCSDll, "OnDisplayNumericalAttribute", sParameters, sResult
    END SELECT
    response.Write sResult
%>
