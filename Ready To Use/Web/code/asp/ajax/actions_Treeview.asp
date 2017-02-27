<!-- #include virtual="/code/asp/includes/charset.inc" -->

<%
	SELECT CASE (request("sFunctionName"))
		CASE "Get_HTML_Treeview_LoadChild"
			API_ASP_TxASP.Get_HTML_Treeview_LoadChild request("id_tree"),  request("id_te"), request("id_pe"), request("id_pere"), request("liste_id_e_coche"), request("recurs"), request("type"), request("dossier_selectionnable"), sResult
		CASE "Get_HTML_TreeviewPE_LoadLinkAPI"
			API_ASP_TxASP.Get_HTML_TreeviewPE_LoadLinkAPI request("id_tree"), request("id_pe"), request("id_critere_pere"), sResult
		CASE "Get_HTML_TreeviewPE_Curves"
			API_ASP_TxASP.Get_HTML_TreeviewPE_Curves request("ID_TE"), sResult
		CASE "Get_HTML_TreeviewPEAPI"
			API_ASP_TxASP.Get_HTML_TreeviewPEAPI request("ID_TE"), 1, true, sResult
		CASE "Get_IDs_From_IDs_Fictives"
			API_ASP_TxASP.Get_IDs_From_IDs_Fictives request("id_tree"),request("id_ot"), replace(request("list_id"),",",";"), sResult
        CASE "Get_SL_ID_E_apd_ID_TE"
			API_ASP_TxASP.Get_SL_ID_E_apd_ID_TE request("id_te"), request("id_e_pere"), request("dossier"), sResult
	END SELECT
	
	Response.write sResult
	
%>