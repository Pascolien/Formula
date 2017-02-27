<!-- #include file="includes/charset.inc" -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//FR"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en" >
<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=8" />

    <!-- #include virtual="/code/includes/includeCommon.asp" -->

	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/teexma.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/teexma_new.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
	<link type="text/css" href="<%=Session("sIISApplicationName")%>/Resources/theme/css/treeview.css?v=<%=Session("iRevision")%>"    rel="stylesheet" />
	<link type="text/css" href="<%=Session("sIISApplicationName")%>/Resources/theme/css/smc.css?v=<%=Session("iRevision")%>" rel="stylesheet" />
	<link href="<%=Session("sIISApplicationName")%>/code/ExternalLibs/datepicker/jquery-ui.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
	<link href="<%=Session("sIISApplicationName")%>/code/ExternalLibs/datepicker/jquery-ui-timepicker-addon.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
	
	<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/js/form.js?v=<%=Session("iRevision")%>"></script>
	<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/js/page_treeview_object.js?v=<%=Session("iRevision")%>"></script>
	<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/js/windows.js?v=<%=Session("iRevision")%>"></script>
	<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/js/treeview2.js?v=<%=Session("iRevision")%>"  ></script>
	<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/js/mcs.js?v=<%=Session("iRevision")%>"></script>
	<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/js/treeviewPE.js?v=<%=Session("iRevision")%>"></script>
	<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/js/data_entry_form.js?v=<%=Session("iRevision")%>"></script>
	<!-- datepicker -->
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/ExternalLibs/datepicker/jquery-ui.min.js?v=<%=Session("iRevision")%>"></script>
	<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/ExternalLibs/datepicker/jquery.ui.core.js?v=<%=Session("iRevision")%>"> </script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/Lib/datepicker/jquery-ui-timepicker-addon.js?v=<%=Session("iRevision")%>"></script>
	<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/Lib/datepicker/jquery.ui.datepicker-lang.js?v=<%=Session("iRevision")%>" > </script>
    <script src="<%=Session("sIISApplicationName")%>/code/Components/CDatePicker.js?v=<%=Session("iRevision")%>" type="text/javascript"></script>
	<link href="<%=Session("sIISApplicationName")%>/code/ExternalLibs/datepicker/jquery-ui-timepicker-addon.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
	<link href="<%=Session("sIISApplicationName")%>/code/ExternalLibs/datepicker/jquery-ui.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
    <link href="<%=Session("sIISApplicationName")%>/temp_resources/Texts and illustrations/HTML/CR_Default.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
	<style>
		html{
			width:100%;
			height:100%;
			overflow:auto;
		}
	</style>
</head>
<body>
<%
	API_ASP_TxASP.Get_HTML_SMC_Criterion request("ID_GC"), sResult
	response.write(sResult)
%>
</body>
</html>