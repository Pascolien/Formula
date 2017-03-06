 
<%
   Session("sPath_DLL") = "TxFormulas\TxFormulas.dll"

	SELECT CASE (request("event"))
        		
	 	CASE "Get_Formula"
			AParameters = Session("Dir_TEEXMA_Path") & "|" & request("ID_Object") & "|" & request("ID_AS") & "|" & request("ID_Att_Inifile") & "|" & request("Display_Div") & "|" & request("sDisplay_Type") & "|" & request("iStoreMode")   
			API_ASP_TxASP.Execute_DLL Session("sPath_DLL"), "Get_Formula", AParameters, AResult
       
        CASE "Save_Formula"
			AParameters = Session("Dir_TEEXMA_Path") & "|" & request("ObjJSONFormula")
			API_ASP_TxASP.Execute_DLL Session("sPath_DLL"), "Save_Formula", AParameters, AResult

	 
	END SELECT

	response.write AResult
%> 