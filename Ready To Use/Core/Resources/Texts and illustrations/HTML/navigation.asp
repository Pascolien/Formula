<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">
<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<script src="<%=Session("sIISApplicationName")%>/code/js/framework_bassetti.js?v=<%=Session("iRevision")%>" type="text/javascript" language="JavaScript"></script>
	<script src="<%=Session("sIISApplicationName")%>/code/ExternalLibs/jquery.js?v=<%=Session("iRevision")%>" type="text/javascript" language="JavaScript"></script>
</head>
<body>
<%
	teexma_mode = ""
	IF ((request("write_mode") = "true") and (Session("teexma_mode") <> "ecriture")) THEN
		teexma_mode = "change" 
	END IF

	ID_NV = request("id_bv")
	IF (ID_NV = "") THEN
		ID_NV = request("id_nv")
	END IF

	ID_TE = request("id_ot")
	IF (ID_TE = "") THEN
		ID_TE = request("id_te")  
	END IF

	ID_E = request("id_obj")
	IF (ID_E = "") THEN
		IF request("id_e") = "" THEN
			ID_E = 0
		ELSE
			ID_E = request("id_e")
		END IF  
	END IF
	
	IF (ID_E = "") THEN
		ID_E = 0
	END IF

	ID_ACS = 0
	IF (request("ID_acs") <> "") THEN
		ID_ACS = request("ID_acs")  
	END IF  	

	ID_MCS = request("id_mcs")

	ID_GDC 	= request("id_cg")
	IF (ID_GDC = "") THEN
		ID_GDC = request("id_gdc")  
	END IF  

	lien  	= request("lien")  

	IF (ID_TE = "" AND ID_E = "" AND ID_GDC = "") THEN
		IF instr(lien,"dte") > 0 THEN
			ID_TE = mid(lien,instr(lien, "dte")+3,instr(lien,"fte") - instr(lien,"dte") - 3)
		ELSE
			ID_TE = 0
		END IF

		IF instr(lien,"den") > 0 THEN
			ID_E  = mid(lien,instr(lien, "den")+3,instr(lien,"fen") - instr(lien,"den") - 3)
		ELSE
			ID_E = 0
		END IF
	END IF                          

	IF (ID_GDC <> "") THEN 
%>
		<script language="javascript">
			if (IE6) { 
				//window.open('../../code/asp/cg_form.asp?id_gdc=<%=ID_GDC%>','GDC','height=680px,width=960px,status=no,toolbar=no,menubar=no,location=no');
				
				CenterWindow('../../code/asp/cg_form.asp?id_gdc=<%=ID_GDC%>','GDC',960,680,'status=no,toolbar=no,menubar=no,location=no');				 	
			} else { 
				CenterWindow('../../code/asp/cg_form.asp?id_gdc=<%=ID_GDC%>','GDC',960,680,'resizable=yes,status=yes,toolbar=no,menubar=no,location=no'); 
			}
			window.history.back();
		</script>
<%
	ELSEIF (ID_MCS <> "") THEN 
%>
		<script language="javascript">
			CenterWindow('../../code/asp/mcs.asp?id_te=<%=ID_TE%>&id_cdc=<%=id_mcs%>','MCS',780,600,'status=yes,resizable=yes,toolbar=no,menubar=no,location=no');   
			window.history.back();
		</script>
<%
	ELSEIF (ID_MA <> "") THEN 
%>
		<script language="javascript">
		    window.parent.frames['frame_blanc'].document.location.replace("../../code/TxModelApplication/TxModelApplicationAjax.asp?idModelApplication=<%=ID_MA%>");
			window.history.back();
		</script><%
	ELSEIF (ID_ACS <> 0) THEN 
%>
		<script language="javascript">
			window.parent.Tree_Add_Object_And_Write(0, 0, "",<%=ID_ACS%>);
		</script>
<% 
	ELSE 
%>	
		<form action="../../code/asp/nav.asp" target="frame_blanc" method="post" name="redirect_form">
			<input type="hidden" name="envoyeur"	value="form"	/>
			<input type="hidden" name="teexma_mode"	value="<%=teexma_mode%>"	/>      
<% 
		IF ID_NV <> "" THEN  
			Session("ID_TE") = 0 
%>                            		  
  			<input type="hidden" name="nav_mode"	value="NV"	/>
  			<input type="hidden" name="ID_NV"	value="<%=ID_NV%>"	/>
  			<input type="hidden" name="ID_TE"	value="0"	/>	
<% 
		ELSE 
%>		  
			<input type="hidden" name="ID_TE"	value="<%=ID_TE%>"	/>		
<% 
		END IF 
%>
			<input type="hidden" name="ID_E"	value="<%=ID_E%>"		/>
			<input type="hidden" name="id" value="<%=request("id")%>" />
		</form>
	
		<script language="javascript">
<%
		IF (ID_TE > 0) THEN
%>
			window.parent.Tree_Display_OT(<%=ID_TE%>);
<%
		ELSEIF (ID_E > 0) THEN
			IF ID_Tab = "" then
				ID_Tab = 0
			END IF
%>
			window.parent.Tree_Display_Node(<%=ID_E%>,<%=ID_Tab%>);
<%
		ELSEIF (ID_NV > 0) THEN
%>
			window.parent.Tree_Display_Business_View(<%=ID_NV%>);
<%
		END IF
%>
		</script>
<%
	END IF 
%>
</body>

</html>
