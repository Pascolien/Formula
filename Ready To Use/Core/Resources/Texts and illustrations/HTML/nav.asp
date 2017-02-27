<!-- #include virtual="/code/asp/includes/charset.inc" -->
<%
  IF request("id_e") = "" THEN
    ID_E = 0
  ELSE
    ID_E = request("id_e")
  END IF
  API_ASP_App.Get_HTML_Form Session("ID_Login"), ID_E, 0, 0, 0, 0, 0, "", false, 1, false, true, codeHTML
	response.write(codeHTML)
%>
