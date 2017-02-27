<%    
    Select Case request("sFunctionName")
        CASE "onNewExtractionForm"		
			API_ASP_TxASP.onNewExtractionForm request("idOT"), sResult
        CASE "comboOTOnChange"		
			API_ASP_TxASP.comboOTOnChange request("idOT"), sResult
        CASE "comboExtractOnChange"		
			API_ASP_TxASP.comboExtractOnChange request("idOT"), request("iIndexExtraction"), sResult
        CASE "extract"		
			API_ASP_TxASP.extract request("idOT"), request("iIndexExtraction"), request("idObjects"), request("bConvertPDF"), sResult
        CASE "publishDocument"		
			API_ASP_TxASP.publishDocument request("idExtraction"),request("idObject"),request("iPublishingType"),request("sFileNameOld"),request("sFileNameNew"), sResult
    END SELECT
    response.Write sResult
%>