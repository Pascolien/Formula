<!-- #include file="includes/charset.inc" -->
<%
	IF request("import_file") <> "" THEN
		sFile_Name = request("import_file")
	END IF
	IF sFile_Name <> "" THEN
		Import_File = Session("sTmpDir") +sFile_Name
	END IF
	ID_CG = request("id_gdc")
		
	sTitle = AResult
	
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//FR"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">	
<head>	
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=7" />	

    <!-- #include virtual="/code/includes/includeCommon.asp" -->

	<script src="<%=Session("sIISApplicationName")%>/code/ExternalLibs/datepicker/jquery-ui.min.js?v=<%=Session("iRevision")%>" type="text/javascript" ></script>
	<script src="<%=Session("sIISApplicationName")%>/code/Lib/datepicker/jquery-ui-timepicker-addon.js?v=<%=Session("iRevision")%>" type="text/javascript" ></script>
	<script src="<%=Session("sIISApplicationName")%>/code/ExternalLibs/datepicker/jquery.ui.core.js?v=<%=Session("iRevision")%>" type="text/javascript" ></script>
	<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/Lib/datepicker/jquery.ui.datepicker-lang.js?v=<%=Session("iRevision")%>" > </script>
    <script src="<%=Session("sIISApplicationName")%>/code/Components/CDatePicker.js?v=<%=Session("iRevision")%>" type="text/javascript"></script>
	<script src="<%=Session("sIISApplicationName")%>/code/ExternalLibs/prototype.js?v=<%=Session("iRevision")%>" type="text/javascript"></script>
	<script src="<%=Session("sIISApplicationName")%>/code/js/form.js?v=<%=Session("iRevision")%>" type="text/javascript"></script>
	<script src="<%=Session("sIISApplicationName")%>/code/js/mcs.js?v=<%=Session("iRevision")%>" type="text/javascript"></script>
	<script src="<%=Session("sIISApplicationName")%>/code/js/cg.js?v=<%=Session("iRevision")%>" type="text/javascript"></script>
	<script src="<%=Session("sIISApplicationName")%>/code/js/data_entry_form.js?v=<%=Session("iRevision")%>" type="text/javascript"></script>
	<script src="<%=Session("sIISApplicationName")%>/code/js/treeview2.js?v=<%=Session("iRevision")%>" type="text/javascript"></script>

	<link href="<%=Session("sIISApplicationName")%>/code/ExternalLibs/datepicker/jquery-ui.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
	<link href="<%=Session("sIISApplicationName")%>/code/ExternalLibs/datepicker/jquery-ui-timepicker-addon.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/teexma.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/dhtmlx/windows/dhtmlxwindows.css?v=<%=Session("iRevision")%>" type="text/css" rel="stylesheet" />
	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/dhtmlx/windows/dhtmlxwindows_dhx_skyblue.css?v=<%=Session("iRevision")%>" type="text/css" rel="stylesheet" />
	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/treeview.css?v=<%=Session("iRevision")%>" type="text/css" rel="stylesheet"/>
	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/smc.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/gdc.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/print_gdc.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css"/>
    <link href="<%=Session("sIISApplicationName")%>/temp_resources/Texts and illustrations/HTML/CR_Default.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
		
	<style>
		#GDC_Form{
			
			width:100%;
			height:100%;
		}	
	</style>
</head>
<body>
	<div id="Waiting_Message" style="margin-top:200px;"></div>
	<div id="GDC_Form">

	<%
		API_ASP_TxASP.Get_HTML_GDC ID_CG, Import_File, AResult
		response.write(AResult)
	%>
	<script>
		Focus_Element("id_btn_select_cg");
	</script>
	
	</div>
    <iframe id="idFrameExport" name="hiddenFrame" style="display:none;"></iframe>
</body>
</html>