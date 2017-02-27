<!-- #include virtual="/code/asp/includes/charset.inc" -->
<%
	API_ASP_TxASP.Change_RL request("id_gc"), request("id_rl_owner"), request("id_gc_pere"), request("type_gc"), request("nom_gc"), sResult
	Response.write(sResult)
%>
