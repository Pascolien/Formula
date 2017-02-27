<!-- #include file="includes/charset.inc" -->
<%
	IF request("cg") THEN
		Use_CG_RL = true
	ELSE
		Use_CG_RL = false
	END IF
	
 	IF request("onglet") <> "resultats" THEN
		API_ASP_TxASP.Get_HTML_ViewCDC request("id_cdc"), request("id_te"), Use_CG_RL, 0,request("sPathFile"), sResult
 	ELSE
 		API_ASP_TxASP.Get_HTML_ViewCDC request("id_cdc"), request("id_te"), Use_CG_RL, 1,sPathFile, sResult
 	END IF
 	response.write(sResult)
%>
