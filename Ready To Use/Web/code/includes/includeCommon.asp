    <script src="<%=Session("sIISApplicationName")%>/code/ExternalLibs/jquery.js?v=<%=Session("iRevision")%>" type="text/javascript"></script>
	<script type="text/javascript">
	    var J = jQuery.noConflict();
	    var sIISApplicationName = '<%=Session("sIISApplicationName")%>';
	    //sDllConstructionMode = '<%=Session("sDllConstructionMode")%>';
	    var iUserSessionId = '<%= Session("iUserSessionId") %>';
	</script>
    <script src="<%=Session("sIISApplicationName")%>/code/ExternalLibs/timer/jquery.simple.timer.js?v=<%=Session("iRevision")%>" type="text/javascript"></script>
	<link href="<%=Session("sIISApplicationName")%>/code/ExternalLibs/timer/timer.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css"/>
	
    <script src="<%=Session("sIISApplicationName")%>/code/js/framework_bassetti.js?v=<%=Session("iRevision")%>" type="text/javascript"></script>    
	<script src="<%=Session("sIISApplicationName")%>/code/common/constants.js?v=<%=Session("iRevision")%>" type="text/javascript"></script>	
	<script src="<%=Session("sIISApplicationName")%>/code/common/customConstants.js?v=<%=Session("iRevision")%>" type="text/javascript"></script>	
	
	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/teexma_new.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css"/>
    
    <!-- dhtmlx -->
    <script src="<%=Session("sIISApplicationName")%>/code/ExternalLibs/dhtmlx/dhtmlxcommon.js?v=<%=Session("iRevision")%>" type="text/javascript"></script>
	<script src="<%=Session("sIISApplicationName")%>/code/ExternalLibs/dhtmlx/dhtmlxcontainer.js?v=<%=Session("iRevision")%>" type="text/javascript"></script>
	
	<!-- dhxMessage -->
	<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/ExternalLibs/dhtmlx/message/dhtmlxmessage.js?v=<%=Session("iRevision")%>" > </script>
	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/dhtmlx/message/dhtmlxmessage_dhx_skyblue.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
	
	<!-- Lib -->
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/Lib/ClassUtils.js?v=<%=Session("iRevision")%>" ></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/Lib/DateUtils.js?v=<%=Session("iRevision")%>" ></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/Lib/DialogsUtils.js?v=<%=Session("iRevision")%>"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/Lib/IntegerUtils.js?v=<%=Session("iRevision")%>"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/Lib/MailsUtils.js?v=<%=Session("iRevision")%>"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/Lib/Multilingualism.js?v=<%=Session("iRevision")%>"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/Lib/StringsUtils.js?v=<%=Session("iRevision")%>"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/Lib/SettingsUtils.js?v=<%=Session("iRevision")%>"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/Lib/UrlUtils.js?v=<%=Session("iRevision")%>"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/Lib/FileUtils.js?v=<%=Session("iRevision")%>"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/Lib/TxUtils.js?v=<%=Session("iRevision")%>"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/Lib/JsonUtils.js?v=<%=Session("iRevision")%>"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/Lib/ArrayUtils.js?v=<%=Session("iRevision")%>"></script>

    <!-- Loaded Variables -->
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/LoadedVariables/Conversions.js?v=<%=Session("iRevision")%>"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/LoadedVariables/CConversion.js?v=<%=Session("iRevision")%>"></script>

    <!-- Query -->
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/QueryForms/CQuery.js?v=<%=Session("iRevision")%>"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/QueryForms/CQueryString.js?v=<%=Session("iRevision")%>"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/QueryForms/CQueryInteger.js?v=<%=Session("iRevision")%>"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/QueryForms/CQueryFile.js?v=<%=Session("iRevision")%>"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/QueryForms/CQueryGrid.js?v=<%=Session("iRevision")%>"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/QueryForms/CQueryCombo.js?v=<%=Session("iRevision")%>"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/QueryForms/CQueryTree.js?v=<%=Session("iRevision")%>"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/QueryForms/CQueryTreeObject.js?v=<%=Session("iRevision")%>"></script>

	<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/lang/TEEXMA_<%=Session("sLanguageCode")%>.js?v=<%=Session("iRevision")%>" > </script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/temp_resources/models/TxWorkflow/lang/TxWorkflow_<%=Session("sLanguageCode")%>.js?v=<%=Session("iRevision")%>"></script>
	
    <script src="<%=Session("sIISApplicationName")%>/code/common/txDeprecated.js?v=<%=Session("iRevision")%>" type="text/javascript"></script>	