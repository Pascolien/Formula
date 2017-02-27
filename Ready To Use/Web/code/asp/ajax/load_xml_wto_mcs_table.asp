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
	
	AMajor=0
	IF request("major") <> "" THEN
		AMajor = request("major")
	END IF
	
	AMinor=0
	IF request("minor") <> "" THEN
		AMinor = request("minor")
	END IF

	API_ASP_TxASP.Get_XML_WTO_MCS_Table id_tree, id_node,AMajor,AMinor, AXML
	response.write(AXML)	
%>