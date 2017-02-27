<%response.ContentType="text/xml"%>
<!-- #include virtual="/code/asp/includes/charset.inc" -->
<%         
  API_ASP_TxASP.Get_XML_Search_Result request("id_ot"), request("str_and"), request("str_or"), request("str_without"), request("bLink"), request("bDoc"), AXML
  if (request("path_level") <> "") then
	AXML = replace(AXML,"../../", request("path_level"))
  end if  
  response.write(AXML)
%>