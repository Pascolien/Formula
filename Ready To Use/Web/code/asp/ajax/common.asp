<!-- #include virtual="/code/asp/includes/charset.inc" -->
<!-- #include virtual="/code/asp/includes/fct_urldecode.asp" -->
<%
	
	IF request("id_advanced_creation") <> "" THEN
		AID_Advanced_Creation = request("id_advanced_creation")
	END IF
		
  	SELECT CASE (request("sFunctionName"))
		CASE "Get_ID_OT_From_Advanced_Creation" 
			API_ASP_TxASP.Get_ID_OT_From_Advanced_Creation AID_Advanced_Creation,AResult
		CASE "Get_ID_OT_Portal" 
			API_ASP_TxASP.Get_ID_Portal AResult
		CASE "Get_Selected_Object_ID_Icon" 
			API_ASP_TxASP.Get_Selected_Object_ID_Icon AResult
		CASE "Get_Object_Name" 
			API_ASP_TxASP.Get_Object_Name request("id_object"), false, AResult
  	END SELECT
	response.write AResult
	' inF.write(AResult)
	' inF.close

	
%>