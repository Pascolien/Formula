 
<%
   Session("sPath_DLL") = "TxFormula\TxFormula.dll"

	SELECT CASE (request("event"))
        		
	 	CASE "Get_Formula"
			AParameters = Session("sTxDir") & "|" & request("Object")  
			API_ASP_TxASP.Execute_DLL Session("sPath_DLL"), "Get_Formula", AParameters, AResult
       
        CASE "Save_Formula"
			AParameters = Session("sTxDir") & "|" & request("ObjJSONFormula")
			API_ASP_TxASP.Execute_DLL Session("sPath_DLL"), "Save_Formula", AParameters, AResult

	 
	END SELECT

	response.write AResult
%> 