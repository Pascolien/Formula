<%
	sRPathFileDll = "TxObjects\TxObjects.dll"
	'sRPathFileDll = "D:\CodeBASSETTI\Branches\4.0.0\TEEXMA\Customer resources\Models\TxObjects\TxObjects.dll"
    SELECT CASE (request("sFunctionName"))
        CASE "GetOTDestinationName"
            sParameters = Session("sTxDir") & "|" & request("sTagAttDirectLink")
            API_ASP_TxASP.Execute_DLL sRPathFileDll, "GetOTDestinationName", sParameters, sResult
        CASE "WEBAddAndLinkObjectsStep1"
	        sParameters = Session("sTxDir") & "|" & request("idObject") & "|" & request("sTagAttDirectLink") & "|" & request("sExistingLinkManagement") & "|" & request("iNbObjectsToAddAndLink") & "|" & request("sAdvCreationTag") & "|" & request("sCreationOrDuplication") & "|" & request("sAdvDuplicationTag") & "|" & request("sDuplicationSourceType") & "|" & request("sSourceObjectsIDs") & "|" & request("sSourceObjectsTags") & "|" & request("sSourceLnkAttTags") & "|" & request("bAllowSwitchCreation") & "|" & request("sErrorMsg") & "|" & request("sMandatoryAttTags") & "|" & request("sRepeatValueAttTags") & "|" & request("sFocusLinkObject")
			API_ASP_TxASP.Execute_DLL sRPathFileDll, "WEBAddAndLinkObjectsStep1", sParameters, sResult
		CASE "WEBAddAndLinkObjectsStep2"
	        sParameters = Session("sTxDir") & "|" & request("idObject") & "|" & request("sTagAttDirectLink") & "|" & request("sExistingLinkManagement") & "|" & request("sCreationMode") & "|" & request("idAdvFunction") & "|" & request("bNForms") & "|" & request("sDataJSONs") & "|" & request("sObjectsToAddJson") & "|" & request("sFocusLinkObject")
			API_ASP_TxASP.Execute_DLL sRPathFileDll, "WEBAddAndLinkObjectsStep2", sParameters, sResult
		Case "WEBAddObjectsStep1"
            sParameters = Session("sTxDir") & "|" & request("idObject") & "|" & request("idOT") & "|" & request("iNbObjectsToAdd") & "|" & request("sAdvCreationTag") & "|" & request("sCreationOrDuplication") & "|" & request("sAdvDuplicationTag") & "|" & request("sDuplicationSourceType") & "|" & request("sSourceObjectsIDs") & "|" & request("sSourceObjectsTags") & "|" & request("sSourceLnkAttTags") & "|" & request("bAllowSwitchCreation") & "|" & request("sErrorMsg") & "|" & request("sMandatoryAttTags") & "|" & request("sRepeatValueAttTags") & "|" & request("sFocusObject") & "|" & request("sIdsAttributesToDuplicate") & "|" & request("arrSelectedObjects")
			API_ASP_TxASP.Execute_DLL sRPathFileDll, "WEBAddObjectsStep1", sParameters, sResult
        CASE "WEBAddObjectsStep2"
            sParameters = Session("sTxDir") & "|" & request("idObject") & "|" & request("idOT") & "|" & request("sCreationMode") & "|" & request("idAdvFunction") & "|" & request("bNForms") & "|" & request("sDataJSONs") & "|" & request("sObjectsToAddJson") & "|" & request("sFocusObject") & "|" & request("idParent")  & "|" & request("arrSelectedObjects")
			API_ASP_TxASP.Execute_DLL sRPathFileDll, "WEBAddObjectsStep2", sParameters, sResult
        CASE "WEBModifyObjectsStep1"
            sParameters = Session("sTxDir") & "|" & request("sAttributesTags") & "|" & request("sSourceObjectTag")
			API_ASP_TxASP.Execute_DLL sRPathFileDll, "WEBModifyObjectsStep1", sParameters, sResult
        CASE "WEBModifyObjectsStep2"
            sParameters = Session("sTxDir") & "|" & request("idOT") & "|" & request("sObjectsIds") & "|" & request("sAttributesIds") & "|" & request("sSourceObjectId")
            API_ASP_TxASP.Execute_DLL sRPathFileDll, "WEBModifyObjectsStep2", sParameters, sResult
        CASE "WEBModifyObjectsStep3"
            sParameters = Session("sTxDir") & "|" & request("sObjectsToAddJson") & "|" & request("sDataJSONs") & "|" & request("bNForms")
			API_ASP_TxASP.Execute_DLL sRPathFileDll, "WEBModifyObjectsStep3", sParameters, sResult
        CASE Else
			Response.Write "TxObjectsAjax.asp : Wrong method"
    END SELECT
	
	Response.Write sResult
%>
