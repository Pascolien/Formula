<!-- #include file="includes/header.inc" -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//FR"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">
<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />

    <!-- #include virtual="/code/includes/includeCommon.asp" -->
	<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/js/windows.js?v=<%=Session("iRevision")%>" > </script>

	<script>
		message = "Le fichier ne doit pas dépasser <%=CDbl(Session("iMaxSizeUpload"))%> Mo !"
	</script>
</head>
<!-- #include file="includes/fct_utf8.asp" -->
<!-- #include file="clsUplFich.asp" -->

<%
	SET MonUpload = New UplFichier
	
	ID_Object =    MonUpload.ChampForm("id_object")
	ID_Attribute = MonUpload.ChampForm("id_attribute")
	sFile_Name =   MonUpload.ChampForm("sFile_Name")
	' sNow = replace(Date(),"/","_") & "_" 
	NouveauNom_Tmp = sFile_Name
	MonUpload.NouveauNom =  NouveauNom_Tmp
	Chemin_Source = Var_chemin_documents_temp & NouveauNom_Tmp
	MonUpload.SauveFichier(1)
		
	SET MonUpload = Nothing 
%>
<body>
	
<script type="text/javascript">
	window.parent.frames["frame_e"].dhxWins.window("dhxPopup_Import_Data_Array").getFrame().contentWindow.UpdateTab(<%=ID_Object%>, <%=ID_Attribute%>, '<%=NouveauNom_Tmp%>')    
</script>
</body>
</html>