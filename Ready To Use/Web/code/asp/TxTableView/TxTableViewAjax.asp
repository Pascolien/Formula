<%
    SELECT CASE (request("sFunctionName"))
        CASE "getHTMLTableView"
			API_ASP_TxASP.getHTMLTableView request("idOT"), sResult 
    END SELECT 

    Response.Write sResult
%>