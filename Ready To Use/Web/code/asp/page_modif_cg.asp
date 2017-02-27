<!-- #include file="includes/charset.inc" -->
<%
  API_ASP_TxASP.Get_HTML_Change_GC request("id"), request("id_rl_owner"), request("id_pere"), sResult
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//FR"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr" >
<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=8" />

    <!-- #include virtual="/code/includes/includeCommon.asp" -->

	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/teexma.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/teexma_new.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
	<link href="<%=Session("sIISApplicationName")%>/temp_resources/Texts and illustrations/HTML/CR_Default.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/js/windows.js?v=<%=Session("iRevision")%>"></script>
	<script src="<%=Session("sIISApplicationName")%>/code/js/form.js?v=<%=Session("iRevision")%>"  type="text/javascript"></script>
	<script src="<%=Session("sIISApplicationName")%>/code/js/data_entry_form.js?v=<%=Session("iRevision")%>" type="text/javascript" ></script>
</head>
<body>
	<div class="selection_multicritere">
		<%response.write(sResult)%>
	</div>
</body>
</html>