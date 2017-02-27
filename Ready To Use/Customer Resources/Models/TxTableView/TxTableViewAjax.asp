<% 	
	sTableViewFilePath = "TxTableView/TxTableView.dll"	
	SELECT CASE (request("sFunctionName"))
		CASE "AddNewTableView"
			sParameters = Session("sTxDir") & "|" & request("ID") & "|" & request("sID") & "|" & request("bIsWidget")
			'ToDo - make the parameter generic'
			API_ASP_TxAsp.Execute_DLL sTableViewFilePath, "AddNewTableView", sParameters, sResult
		CASE "FreeTableView"
			sParameters = request("IdTable") & "|" & request("bIsWidget")
			API_ASP_TxAsp.Execute_DLL sTableViewFilePath, "FreeTableView", sParameters, sResult
		CASE "RefreshTableView"
			sParameters = request("IdTable")
			API_ASP_TxAsp.Execute_DLL sTableViewFilePath, "RefreshTableView", sParameters, sResult
		CASE "SaveAndRefresh"
			sParameters = request("IdTable") & "|" & request("jsonData")
			API_ASP_TxAsp.Execute_DLL sTableViewFilePath, "SaveAndRefresh", sParameters, sResult
		CASE "LoadTableView"
			sParameters = request("IdTable")
			API_ASP_TxAsp.Execute_DLL sTableViewFilePath, "LoadTableView", sParameters, sResult
		CASE "LoadStructureTxTable"
			sParameters = request("IdTable")
			API_ASP_TxAsp.Execute_DLL sTableViewFilePath, "LoadStructureTxTable", sParameters, sResult
		CASE "GetLinkAttLinkableObjects"
            sParameters = request("idTable") & "|" & request("idColumn")
			API_ASP_TxAsp.Execute_DLL sTableViewFilePath, "GetLinkAttLinkableObjects", sParameters, sResult
		CASE "DisplayPage"
			sParameters = request("IdTable") & "|" & request("iPageNumber")
			API_ASP_TxAsp.Execute_DLL sTableViewFilePath, "DisplayPage", sParameters, sResult
		CASE "GetColumnPossibleFiltersValues"
			sParameters = request("IdTable") & "|" & request("IdColumn")
			API_ASP_TxAsp.Execute_DLL sTableViewFilePath, "GetColumnPossibleFiltersValues", sParameters, sResult
		CASE "GetColumnFilter"
			sParameters = request("IdTable") & "|" & request("IdColumn")
			API_ASP_TxAsp.Execute_DLL sTableViewFilePath, "GetColumnFilter", sParameters, sResult
		CASE "ApplyColumnFilter"
			sParameters = request("IdTable") & "|" & request("IdColumn") & "|" & request("iFilterType") & "|" & request("sFilterValue")
			API_ASP_TxAsp.Execute_DLL sTableViewFilePath, "ApplyColumnFilter", sParameters, sResult
		CASE "ApplySorting"
			sParameters = request("IdTable") & "|" & request("IdColumn") & "|" & request("iSortType")
			API_ASP_TxAsp.Execute_DLL sTableViewFilePath, "ApplySorting", sParameters, sResult
		CASE "DeleteAllFilters"
			sParameters = request("IdTable")
			API_ASP_TxAsp.Execute_DLL sTableViewFilePath, "DeleteAllFilters", sParameters, sResult
		CASE "SetTableViewMCS"
			sParameters = request("IdTable") & "|" & request("bUseMCS")
			API_ASP_TxAsp.Execute_DLL sTableViewFilePath, "SetTableViewMCS", sParameters, sResult
		CASE "GetsKeyExportation"
			sParameters = request("IdTable")
			API_ASP_TxAsp.Execute_DLL sTableViewFilePath, "GetsKeyExportation", sParameters, sResult
		CASE "GetXmlObjectsToBrowse"
			sParameters = request("IdTable") & "|" & request("IdColumn") & "|" & request("IdRow")
			API_ASP_TxAsp.Execute_DLL sTableViewFilePath, "GetXmlObjectsToBrowse", sParameters, sResult
		CASE "TreatModelApplicationMessages"
			sParameters = request("idTable") & "|" & request("jsonObjects")
			API_ASP_TxAsp.Execute_DLL sTableViewFilePath, "TreatModelApplicationMessages", sParameters, sResult
		CASE "SaveModifiedData"
			sParameters = request("idTable") & "|" & request("jsonData")
			API_ASP_TxAsp.Execute_DLL sTableViewFilePath, "SaveModifiedData", sParameters, sResult
		CASE "SaveAndLaunchModelApplication"
			sParameters = request("idTable") & "|" & request("sObjectIds") & "|" & request("idModelApplication") & "|" & request("jsonData")
			API_ASP_TxAsp.Execute_DLL sTableViewFilePath, "SaveAndLaunchModelApplication", sParameters, sResult
		CASE "UpdateCellValue"
			sParameters = request("idTable") & "|" & request("JSON")
			API_ASP_TxAsp.Execute_DLL sTableViewFilePath, "UpdateCellValue", sParameters, sResult
		CASE "GetCellNumericalValue"
			sParameters = request("idTable") & "|" & request("idRow") & "|" & request("idColumn")
			API_ASP_TxAsp.Execute_DLL sTableViewFilePath, "GetCellNumericalValue", sParameters, sResult
		CASE "convertUnit"
			sParameters = request("idSrcUnit") & "|" & request("idDestUnit") & "|" & request("minValue") & "|" & request("maxValue") & "|" & request("meanValue") & "|" & request("LB") & "|" & request("UB")
			API_ASP_TxAsp.Execute_DLL sTableViewFilePath, "ConvertUnit", sParameters, sResult
        CASE "GetFilteredLinkAttLinkableObjects"
            sParameters = request("idTable") & "|" & request("idRow") & "|" & request("idColumn")
            API_ASP_TxAsp.Execute_DLL sTableViewFilePath, "GetFilteredLinkAttLinkableObjects", sParameters, sResult
        CASE "reloadTableView"
            sParameters = request("idTable") & "|" & request("jsonObject")
            API_ASP_TxAsp.Execute_DLL sTableViewFilePath, "ReloadTableView", sParameters, sResult
        CASE "setAllCheckedState"
            sParameters = request("idTable") & "|" & request("idColumn") & "|" & request("iState")
            API_ASP_TxAsp.Execute_DLL sTableViewFilePath, "SetAllCheckedState", sParameters, sResult
        CASE "setCellCheckedState"
            sParameters = request("idTable") & "|" & request("idRow") & "|" & request("idColumn") & "|" & request("iState")
            API_ASP_TxAsp.Execute_DLL sTableViewFilePath, "SetCellCheckedState", sParameters, sResult
        CASE "getAllChechedRows"
            sParameters = request("idTable") & "|" & request("idColumn")
            API_ASP_TxAsp.Execute_DLL sTableViewFilePath, "GetAllChechedRows", sParameters, sResult
	END SELECT
	
	response.write sResult
%>
