<!-- #include file="includes/charset.inc" -->
<%
	IF (request("id_ot") <> "") THEN
		ID_OT = request("id_ot")
	ELSE
		ID_OT = Session("id_ot")
	END IF
	API_ASP_TxASP.Get_HTML_Cdc_Choice ID_OT, sResult
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//FR"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">	
<head>	
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=8" />
	
    <!-- #include virtual="/code/includes/includeCommon.asp" -->

	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/teexma.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/teexma_new.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/comboBox.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css">
	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/smc.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css">
    <link href="<%=Session("sIISApplicationName")%>/temp_resources/Texts and illustrations/HTML/CR_Default.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
	
	<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/js/comboBox.js?v=<%=Session("iRevision")%>" ></script>
	<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/js/page_comparison.js?v=<%=Session("iRevision")%>" ></script>
	<script src="<%=Session("sIISApplicationName")%>/code/js/windows.js?v=<%=Session("iRevision")%>" type="text/javascript" ></script>
	<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/js/menu.js?v=<%=Session("iRevision")%>" ></script>
	<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/js/requirements.js?v=<%=Session("iRevision")%>" ></script>
</head>
<body>
	<div class="selection_multicritere">
		<div id="id_div_refresh_mcs_cdc">
			<%=response.write(sResult)%>	
		</div>	
        <iframe name="hiddenFrame" style="display:none;"></iframe>
		<script>
			Hide_BrowseButtonTranslatedForIe8();
		</script>
	</div>
</body>
</html>
