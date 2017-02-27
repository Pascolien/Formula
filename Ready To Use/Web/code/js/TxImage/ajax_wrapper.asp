<%
	sEvent = Request("sFunctionName")
	
	SELECT CASE (sEvent)

		CASE "Save_PathFile"
			Session("JS_Selection") = request("JS_Selection")
			sResult = "ok"	
			
		CASE "Save_NameFile"
			Session("FileName") = request("FileName")
			sResult = "ok"	
			
	END SELECT

	response.write sResult		
%>