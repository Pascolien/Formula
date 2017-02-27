<%response.ContentType="text/xml"%>
<!-- #include virtual="/code/asp/includes/charset.inc" -->
<%         
  id = request("id") 

  IF (instr(id,"_") > 0) THEN
    id_tree = left(id, instr(id,"_")-1)
    id_node = right(id, len(id)-instr(id,"_"))
  ELSE
    id_tree = request("id")
    id_node = 0     
  END IF

  API_ASP_TxASP.Get_XML_WTO_Table id_tree, id_node, AXML
  
	response.write(AXML)

%>