<!-- #include virtual="/code/asp/includes/charset.inc" -->
<%
  API_ASP_TxASP.Execute_DLL request("dll_name"), request("function_name"), request("parameters"), AResult
	response.write(AResult)
%>

