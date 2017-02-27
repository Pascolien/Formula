<!-- #include virtual="/code/asp/includes/charset.inc" -->

<%

	SELECT CASE (request("sFunctionName"))
		CASE "Create_MCS_From_CG"
			API_ASP_TxASP.Create_MCS_From_CG request("id_cg"), request("values"), AResult
		CASE "Extract_CG_To_Word"
			API_ASP_TxASP.Extract_CG_To_Word request("id_cg"), request("values"), AResult 
	END SELECT

	Response.write AResult
	
%>