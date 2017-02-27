<%
    sPathFileTxWebComponentsDLL = Session("sTxDir") + "core/dlls/TxWebComponents.dll"
	SELECT CASE (request("sFunctionName"))
        'object type
		CASE "OTsToJSON"
			sParameters = request("bDisplayAssociatives") & "|" & request("bDisplayListing") 
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "OTsToJSON", sParameters, sResult
        CASE "getOTHint"
			sParameters = request("idOT")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "getOTHint", sParameters, sResult

        'objects
        CASE "objectsToJSON"
			sParameters = request("idOT") & "|" & request("idObjParent") & "|" & request("bRecursive") & "|" & request("bIncludeFolder") & "|" & request("bRemoveTrashedObj") 
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "objectsToJSON", sParameters, sResult
        CASE "getIdsObjectFromParent"
			sParameters = request("idOT") & "|" & request("idObjParent") & "|" & request("bRecursive") & "|" & request("bIncludeFolder")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "getIdsObjectFromParent", sParameters, sResult
        CASE "objectsFromIdsToJSON"
			sParameters = request("sIdObjects")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "objectsFromIdsToJSON", sParameters, sResult
        CASE "objectsFromValueToJSON"
			sParameters = request("sValue") & "|" & request("idOT") & "|" & request("idAttribute") & "|" & request("idParentFiltering") & "|" & request("bSearchInLkdObjects") & "|" & request("bSearchInData")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "objectsFromValueToJSON", sParameters, sResult
        CASE "getObjectHint"
			sParameters = request("idObject")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "getObjectHint", sParameters, sResult
        CASE "getObjectPath"
			sParameters = request("idObject")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "getObjectPath", sParameters, sResult
        CASE "listObjectsToJSON"
            sParameters = request("sIdObjects")
            API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "listObjectsToJSON", sParameters, sResult
        CASE "removeObject"
			sParameters = request("sIdObject") & "|" & request("idDeletionSetting")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "removeObject", sParameters, sResult
        CASE "moveObject"
			sParameters = request("idOT") & "|" & request("idObject") & "|" & request("idParent") & "|" & request("idNexSibling") & "|" & request("iMode")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "moveObject", sParameters, sResult
        CASE "switchFolderObject"
			sParameters = request("idOT") & "|" & request("sJsonObject")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "switchFolderObject", sParameters, sResult
        CASE "renameObject"
			sParameters = request("idObject") & "|" & request("sName")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "renameObject", sParameters, sResult
        CASE "sortObject"
			sParameters = request("idOT") & "|" & request("sIdsParent") & "|" & request("bAscending")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "sortObject", sParameters, sResult
        CASE "wGetTxPropertyInfo"
			sParameters = request("idObject")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "wGetTxPropertyInfo", sParameters, sResult
        CASE "wGetTxDuplicationInfo"
			sParameters = request("idOT")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "wGetTxDuplicationInfo", sParameters, sResult
        CASE "wGetTxCompareInfo"
			sParameters = request("idOT") & "|" & request("idObject") & "|" & request("idAdvancedComparison")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "wGetTxCompareInfo", sParameters, sResult
        CASE "getContextMenuOptions"
			sParameters = request("idOT") & "|" & request("idObject") & "|" & request("iRWMode")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "getContextMenuOptions", sParameters, sResult
        CASE "getContextMenuApplicationModelOptions"
			sParameters = request("idOT") & "|" & request("idObject") & "|" & request("iRWMode")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "getContextMenuApplicationModelOptions", sParameters, sResult
        CASE "ExpandBranch"
			sParameters = request("idOT") & "|" & request("sParentIds")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "ExpandBranch", sParameters, sResult

        'businessObjects
        CASE "businessObjectsToJSON"
			sParameters = request("idView") & "|" & request("sParents")  & "|" & request("bRecursive") 
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "businessObjectsToJSON", sParameters, sResult
        CASE "UpdateBusinessObject"
			sParameters = request("idView") & "|" & request("sParent")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "UpdateBusinessObject", sParameters, sResult
        CASE "getContextMenuBusinessOptions"
			sParameters = request("idView") & "|" & request("idAttributeSetLevel")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "getContextMenuBusinessOptions", sParameters, sResult
        CASE "getBusinessObjectPath"
            sParameters = request("idView") & "|" & request("idObject") & "|" & request("sIdsParents")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "getBusinessObjectPath", sParameters, sResult
        CASE "GetBtnLinkInfo"
            sParameters = request("idView") & "|" & request("idAttributeSetLevel")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "GetBtnLinkInfo", sParameters, sResult

        'attributes
        CASE "attributesToJSON"
			sParameters = request("idOT") & "|" & request("idParent") & "|" & request("bRecursiveLink") & "|" & request("bDisplayAssociativeOT") & "|" & request("bInheritedAttributeCheckable")  & "|" & request("iTypeSLTD") & "|" & request("iADR") & "|" & request("sTD") 
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "attributesToJSON", sParameters, sResult
        CASE "getIdsAttributesFromParent"
			sParameters = request("idOT") & "|" & request("idParent") & "|" & request("bRecursiveLink") & "|" & request("bDisplayAssociativeOT") & "|" & request("bInheritedAttributeCheckable")  & "|" & request("iTypeSLTD") & "|" & request("iADR") & "|" & request("sTD") 
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "getIdsAttributesFromParent", sParameters, sResult
        CASE "getAttributeHint"
			sParameters = request("idAttribute")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "getAttributeHint", sParameters, sResult
        CASE "GetExportation"
			sParameters = request("sTag")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "GetExportation", sParameters, sResult

        'array
		CASE "getDataTableAndTableType"
			sParameters = request("idObject") & "|" & request("idAttribute") 
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "getDataTableAndTableType", sParameters, sResult
        CASE "saveDataTable"
			sParameters = request("idObject") & "|" & request("idAtt") & "|" & request("sData")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "saveDataTable", sParameters, sResult
        CASE "ExportTable"
			sParameters = request("idObject") & "|" & request("idAtt") & "|" & request("sData")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "ExportTable", sParameters, sResult
        CASE "ImportTable"
			sParameters = request("sFileName") & "|" & request("idTableType") & "|" & request("sColSeparator") & "|" & request("bTranspose")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "ImportTable", sParameters, sResult

        'associative
		CASE "assoToJSON"
			sParameters = request("idObject") & "|" & request("idAttribute") 
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "assoToJSON", sParameters, sResult
        CASE "saveAsso"
			sParameters = request("idObj") & "|" & request("idAtt") & "|" & request("sData")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "saveAsso", sParameters, sResult

        'publisher
		CASE "getDataFileFiles"
			sParameters = request("idObject") & "|" & request("idAttribute") 
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "getDataFileFiles", sParameters, sResult
        CASE "getArchivedFiles"
			sParameters = request("idAttribute") 
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "getArchivedFiles", sParameters, sResult
        CASE "saveDataFile"
			sParameters = request("idObject") & "|" & request("idAtt") & "|" & request("sData")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "saveDataFile", sParameters, sResult

        'others
        CASE "DeleteFile"
            sDirPathFile = request("sDirPathFile")
            IF sDirPathFile = "" THEN
                sDirPathFile = Session("sTmpDir")
            END IF
			sParameters = sDirPathFile & request("sFileName")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "DeleteFile", sParameters, sResult

        'ExcelFile
        CASE "LoadExcelFile"
			sParameters = request("sFileName") & "|" & request("idObj") & "|" & request("idAtt") & "|" & request("idDataFile")
			API_ASP_TxASP.Execute_DLL sPathFileTxWebComponentsDLL, "LoadExcelFile", sParameters, sResult
	END SELECT	
	response.write sResult	
%>