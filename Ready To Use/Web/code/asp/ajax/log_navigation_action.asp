<!-- #include virtual="/code/asp/includes/charset.inc" -->
<%	
  Response.write("origin:"& request("origin") & " id_obj:" & request("id_obj"))
  API_ASP_TxASP.Log_Navigation_Action request("origin"), request("id_obj") 
%>