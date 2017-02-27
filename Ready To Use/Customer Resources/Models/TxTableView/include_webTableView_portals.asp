	
	<!-- #include virtual="/code/includes/includeCommon.asp" --> 
    <!-- #include virtual="/code/includes/includeVisualComponents.asp" --> 
	<!-- #include virtual="/code/includes/includeWriteForm.asp" -->

    <link href="<%=Session("sIISApplicationName")%>/temp_resources/Texts and illustrations/HTML/CR_Default.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />

    <script type="text/javascript">
		// compatibilité de DHTMLX avec IE8
        if (_isIE && (Get_IE_Version() == 8)) _isIE = 8;
	</script>

    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/TxModelApplication/CModelApplicationExecution.js"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/TxASP/readForm.js?v=<%=Session("iRevision")%>" > </script>
