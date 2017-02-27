<%
	sPath_DLL = "TxWidgets\TxWidgets.dll"
	
	sParameters = request("ID_Application_Model") & "|" & request("ID_RL") & "|" & request("sID_User_Criterion") & "|" & request("ID_Criterion_Date")   			  			
	API_ASP_TxASP.Execute_DLL sPath_DLL, "Load_XML_TxWidget", sParameters, sResult
	response.write sResult
%>