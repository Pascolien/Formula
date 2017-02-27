<%response.ContentType="text/xml"%>
<!-- #include virtual="/code/asp/includes/charset.inc" -->
<%
  API_ASP_TxASP.Get_XML_WTO_Table_Linear request("id_wto"), request("id_linear_wto"), request("id_selected"), AXML
	response.write(AXML)
%>