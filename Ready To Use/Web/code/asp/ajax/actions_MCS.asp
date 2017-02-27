<!-- #include virtual="/code/asp/includes/charset.inc" -->
<!-- #include virtual="/code/asp/includes/fct_urldecode.asp" -->

<%	
	SELECT CASE (request("sFunctionName"))
		CASE "Write_Boolean_Criterion"
			API_ASP_TxASP.Write_Boolean_Criterion request("id_cdc"), request("id_critere"), request("id_critere_pere"), request("id_pe"), request("valeur"), request("selection"), request("save_database"), request("empty_data"), sResult
		CASE "Write_Graph_Criterion"
			API_ASP_TxASP.Write_Graph_Criterion request("id_cdc"), request("id_critere"), request("id_critere_pere"), request("id_pe"), request("type_critere_numerique"), request("critere_optimisation"), request("valeur_optimisation_cible") , request("id_unite_valeur_cible"), request("critere_inf"), request("borne_inf"), request("tolerance_inf"), request("id_unite_inf"), request("critere_sup"), request("borne_sup"), request("tolerance_sup"), request("id_unite_sup"), request("abscisse_courbe"), request("id_colx"), request("id_coly"), request("selection"), request("save_database"), request("empty_data"), sResult
		CASE "Write_Link_Criterion"
			API_ASP_TxASP.Write_Link_Criterion request("id_cdc"), request("id_critere"), request("id_critere_pere"), request("id_pe"), request("type_critere_lien"), request("liste_e"), request("smc_recurs_type"), request("smc_recurs_pe"), request("selection"), request("save_database"), request("empty_data"), sResult
		CASE "Write_Numerical_Criterion"	
			API_ASP_TxASP.Write_Numerical_Criterion request("id_cdc"), request("id_critere"), request("id_critere_pere"), request("id_pe"), request("type_critere_numerique"), request("critere_optimisation"), request("valeur_optimisation_cible"), request("id_unite_valeur_cible"), request("critere_inf"), request("borne_inf"), request("tolerance_inf"), request("id_unite_inf"), request("critere_sup"), request("borne_sup"), request("tolerance_sup"), request("id_unite_sup"), request("selection"), request("save_database"), request("empty_data"), sResult
		CASE "Write_Text_Criterion"	
			API_ASP_TxASP.Write_Text_Criterion request("id_cdc"), request("id_critere"), request("id_critere_pere"), request("id_pe"), request("valeur"), request("selection"), request("save_database"), request("empty_data"), sResult
		CASE "Change_RL"
			API_ASP_TxASP.Change_RL request("id_gc"), request("id_rl_owner"), request("id_gc_pere"), request("type_gc"), request("nom_gc"), sResult
		CASE "Get_HTML_SMC_LoadCriterion"
			API_ASP_TxASP.Get_HTML_SMC_LoadCriterion request("id"), request("type"),request("id_attribute"), sResult
		CASE "Get_HTML_Cdc_List"
			API_ASP_TxASP.Get_HTML_Cdc_List request("id_te"), sResult
		CASE "Get_HTML_Text_CDC"
			API_ASP_TxASP.Get_HTML_Text_CDC request("id_cdc"), false, false, sResult
		CASE "Get_HTML_Text_Criterion"
			API_ASP_TxASP.Get_HTML_Text_Criterion request("id_c"), request("version_longue"), request("version_html"), sResult
		CASE "Write_MCS_RL"
			API_ASP_TxASP.Write_MCS_RL request("id_cdc"), sResult
		CASE "Import_RL_From_XML"
			API_ASP_TxASP.Import_RL_From_XML request("filename"), sResult
		CASE "Write_Comparison_CDC"
			API_ASP_TxASP.Write_Comparison_CDC request("ID_E"), request("ID_Advanced_Comparison"), request("Liste_ID_PE"), sResult
		CASE "Delete_CDC"
			API_ASP_TxASP.Delete_CDC request("id_gc"), sResult
		CASE "Get_HTML_MCS_Detailed_View"
			API_ASP_TxASP.Get_HTML_MCS_Detailed_View request("id_cdc"), request("aff_elt_rejete"), sResult
		CASE "Delete_Critere"
			API_ASP_TxASP.Delete_Critere request("id_c"), true, request("type_critere")
		CASE "Get_Literary_Expression"
			API_ASP_TxASP.Get_Literary_Expression request("ID_CDC"), sResult
        CASE "DisplayMCSGraphique"
			API_ASP_TxASP.DisplayMCSGraphique request("idAttribute"), sResult
        CASE "Convert_Unit"
			API_ASP_TxASP.Convert_Unit request("ID_Unit_Old"), request("ID_Unit_New"), replace(request("Value"),".",","), sResult
        CASE "Get_Ids_SMC"
			API_ASP_TxASP.Get_Ids_SMC request("id_tree"),request("id_ot"), replace(request("list_id"),",",";"), sResult
	END SELECT
	
	Response.write sResult
	
%>
