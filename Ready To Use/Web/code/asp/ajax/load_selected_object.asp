<!-- #include virtual="/code/asp/includes/charset.inc" -->
<%
  
  'response.write("liste_id:"+request("liste_id"))
  
  id_e = request("id_e")
  liste_id = replace(request("liste_id"),"'","")
  liste_id = replace(liste_id,";;",";")
  'liste_id = replace(liste_id,";",",")
  
  'IF replace(liste_id,";","") <> "" THEN
    WHILE right(liste_id,1) = ";"
      liste_id = left(liste_id, len(liste_id)-1)
    WEND
    WHILE left(liste_id,1) = ";"
      liste_id = right(liste_id, len(liste_id) -1)
    WEND
    'response.write("ListeID:" & liste_id & " - SearchValue:" & request("searchValue"))
    API_ASP_TxASP.Get_HTML_Selected_Obj request("id_tree"), request("id_attr"), request("id_te"), Session("ID_E"), liste_id, request("type"), request("searchValue"), codeHTML
    response.write(codeHTML)
    
%>