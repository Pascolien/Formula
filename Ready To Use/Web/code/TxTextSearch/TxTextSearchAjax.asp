
<%      
	sPathFileTxTextSearchDll = Session("sTxDir") & "Core\Dlls\TxTextSearch.dll"	
	
	SELECT CASE Request("sFunctionName")
		CASE "wGetTextSearchSettings"   
		    sParameters = request("idTextSearchManager")
            API_ASP_TxASP.Execute_DLL sPathFileTxTextSearchDll, "wGetTextSearchSettings", sParameters, sResult
        CASE "wSearchIntoObjects"   
		    sParameters = request("idTextSearchManager") & "|" & request("sAndWords") & "|" & request("sOrWords") & "|" & request("sWithoutWords") & "|" & request("bSearchIntoData") & "|" & request("idOT")
            API_ASP_TxASP.Execute_DLL sPathFileTxTextSearchDll, "wSearchIntoObjects", sParameters, sResult
        CASE "wSearchIntoObjectsFiles"   
		    sParameters = request("idTextSearchManager") & "|" & request("sAndWords") & "|" & request("sOrWords") & "|" & request("sWithoutWords") & "|" & request("idOT")
            API_ASP_TxASP.Execute_DLL sPathFileTxTextSearchDll, "wSearchIntoObjectsFiles", sParameters, sResult
        CASE "wSearchIntoExternalServers"   
		    sParameters = request("idTextSearchManager") & "|" & request("sAndWords") & "|" & request("sOrWords") & "|" & request("sWithoutWords") & "|" & request("idOT")
            API_ASP_TxASP.Execute_DLL sPathFileTxTextSearchDll, "wSearchIntoExternalServers", sParameters, sResult
        CASE "wOnPageOrFilterChange"   
		    sParameters = request("idTextSearchManager") & "|" & request("iFilter") & "|" & request("iPageIndex")
            API_ASP_TxASP.Execute_DLL sPathFileTxTextSearchDll, "wOnPageOrFilterChange", sParameters, sResult
        CASE "wFreeTextSearchResults"   
		    sParameters = request("idTextSearchManager")
            API_ASP_TxASP.Execute_DLL sPathFileTxTextSearchDll, "wFreeTextSearchResults", sParameters, sResult
	END SELECT
    response.write(sResult)
%>