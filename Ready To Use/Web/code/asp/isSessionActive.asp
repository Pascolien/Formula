<!-- #include file="includes/charset.inc" -->
- TEEXMA -<br />
<br />
IIS : ok<br />
<%	
    'IMPORTANT : it's a check file which permit to connect and deconnect the session
	response.write("ASP : ok<br />")	  
  API_ASP_TxASP.IsSessionActive AResult
 	response.write("DLL : "& AResult &"<br />")
 	response.write("SQL : "& AResult &"<br />")  
  On Error Resume Next
    API_ASP_TxASP.Halt_APIWeb 	
%>
