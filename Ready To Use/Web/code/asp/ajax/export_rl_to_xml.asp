<%
  response.ContentType="application/octet-stream"
  response.addHeader "Content-Disposition","attachment; filename=exportRL.xml"
%>
<!-- #include virtual="/code/asp/includes/charset.inc" -->
<%
  API_ASP_TxASP.Export_RL_To_XML request("id_rl"), codeXML
	response.write(codeXML)
%>