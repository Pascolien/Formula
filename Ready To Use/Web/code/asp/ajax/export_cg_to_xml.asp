<!-- #include virtual="/code/asp/includes/charset.inc" -->

<%
  API_ASP_TxASP.Export_CG_To_XML request("id_cg"), request("values"), AHTML 
	response.write(AHTML)
%>

<script language="javascript">
	location.replace("open_file.asp?file=<%=Replace(AHTML,"\","\\")%>");
</script>
