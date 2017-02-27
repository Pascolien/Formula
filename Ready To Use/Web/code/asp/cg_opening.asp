<!-- #include file="includes/charset.inc" -->
<%
IF (request("ID_OT") <> "") THEN
		ID_OT = request("ID_OT")
	ELSE
		ID_OT = Session("ID_OT")
	END IF
  API_ASP_TxASP.Get_HTML_List_GDC ID_OT, sResult
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//FR"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">	
<head>	
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=8" />
    <!-- #include virtual="/code/includes/includeCommon.asp" -->
	
	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/teexma.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/teexma_new.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/smc_cdc.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
    <link href="<%=Session("sIISApplicationName")%>/temp_resources/Texts and illustrations/HTML/CR_Default.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
    <script>var J = jQuery.noConflict();</script>
	<script>
        var sFileName = "";
        J(function(){
            J("#upload_file").change(function (e) {
                var arrFilesUploaded = e.target.files,
                    arrFiles = [];
                sFileName = arrFilesUploaded[0].name;
                uploadFileInTmpDir(arrFilesUploaded[0]);
                if (arrFilesUploaded.length > 0){
                    J("#id_label_input_file").html(Extract_File_Name(sFileName));
                    parent.OuvrirGDC("0", sFileName);
               
                }
            });
            
        });
	</script>
</head>
<body>
	<div class="selection_multicritere">
		<div id="id_div_refresh_cg_list">
			<%=response.write(sResult)%>	
			<script>
				Focus_Element("btn_open_gdc");
			</script>
		</div>	
        <script>
			//Hide_BrowseButtonTranslatedForIe8();
		</script>	
	</div>
</body>
</html>
