<!-- #include virtual="/code/asp/includes/fct_utf8.asp" -->
<!-- #include file="uploadClass.asp" -->
<!-- #include virtual="/code/asp/framework_bassetti.asp" -->
<%  
	SET MonUpload = New UplFichier
	

	sFileName = MonUpload.ChampForm("idHiddenFile")	'ToDo: dynamize	this id

    'then upload the file
	MonUpload.NouveauNom = RepareUTF8(sFileName)
	MonUpload.SauveFichier(1)
	
	SET MonUpload = Nothing

	response.write "done " + Session("sTmpDir")
%>