<!-- #include virtual="/code/asp/includes/charset.inc" -->
<!-- #include virtual="/code/asp/includes/fct_urldecode.asp" -->
<% 

	IF request("grid_values") <> "" THEN
		AGrid_Values = request("grid_values")
	END IF
	IF request("id_object") <> "" THEN
		AsID_Object = request("id_object")
	END IF
	IF request("checked") <> "" THEN
		AChecked = request("checked")
	END IF
	IF request("sid_grid") <> "" THEN
		AsID_Grid = request("sid_grid")
	END IF
	
  	SELECT CASE (request("sFunctionName"))
		CASE "Get_Grid_Values_Filtered" 
			API_ASP_TxASP.Get_Grid_Values_Filtered AGrid_Values,sResult
		CASE "OnCheck" 
			API_ASP_TxASP.MCS_Result_OnCheck AsID_Grid,AsID_Object,AChecked,sResult
		CASE "Check_All" 
			API_ASP_TxASP.MCS_Result_Check_All AsID_Grid,AChecked,sResult
		CASE "Run_MCSResultsSimplifiedExportation" 
			API_ASP_TxASP.Run_MCSResultsSimplifiedExportation request("bDisplay_Wrong_Mark"),sResult
		CASE "Table_OnCheck" 
			API_ASP_TxASP.Table_OnCheck request("ID_Table"),request("bChecked"),request("sID_Object_Selected"),sResult
		CASE "Table_Check_All" 
			API_ASP_TxASP.Table_Check_All request("ID_Table"),request("bChecked"),request("sID_Object_Selected"),sResult
		CASE "Get_Id_Object_Grid" 
			API_ASP_TxASP.Get_Id_Object_Grid request("ID_Grid"),request("sID_Object"),sResult
  	END SELECT
	response.write sResult
	' inF.write(sResult)
	' inF.close

	
%>