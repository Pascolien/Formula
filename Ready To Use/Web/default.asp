<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//<%=Session("sLanguageCode") %>"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" >
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<%=Session("sLanguageCode") %>" lang="<%=Session("sLanguageCode") %>" ng-app="TxGenerator">
<head>
    <base href="">
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />

    <title><%=Session("sTabTitle")%></title>
    <link rel="shortcut icon" type="image/x-icon" href="<%=Session("sIISApplicationName")%>/TEEXMA.ico" />
    <!-- #include virtual="/code/includes/includeCommon.asp" -->
    <!-- #include virtual="/code/includes/includeVisualComponents.asp" -->
    <!-- #include virtual="/code/includes/includeTxLogin.asp" -->
	<!-- #include virtual="/code/includes/includeWriteForm.asp" -->
	<!-- #include virtual="/code/includes/includeTxTextSearch.asp" -->
	<!-- #include virtual="/code/includes/includeTxASP.asp" -->
    <script type="text/javascript">
        var nRefreshFrequency = <%=Session.Timeout%>;
        var iRevision = <%=Session("iRevision")%>;
    </script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/Components/CHtml.js?v=<%=Session("iRevision")%>"> </script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/TxGenerator/libs/angular.min.js"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/TxGenerator/libs/angular-recursion.min.js"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/TxGenerator/libs/angular-route.min.js"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/TxGenerator/js/TxGenerator.js?v=<%=Session("iRevision")%>"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/TxGenerator/factories/TxGenerator.factory.js?v=<%=Session("iRevision")%>"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/Startup.js?v=<%=Session("iRevision")%>"> </script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/TxASP/executeFunction.js?v=<%=Session("iRevision")%>"> </script>
    <link rel="stylesheet" type="text/css" href="<%=Session("sIISApplicationName")%>/Resources/theme/css/teexma_new.css?v=<%=Session("iRevision")%>" />
    <link rel="stylesheet" type="text/css" href="<%=Session("sIISApplicationName")%>/Resources/theme/css/teexma.css?v=<%=Session("iRevision")%>" />
    <link rel="stylesheet" href="<%=Session("sIISApplicationName")%>/code/TxGenerator/css/TxGenerator.css?v=<%=Session("iRevision")%>" />
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/TxGenerator/components/pattern/pattern.directive.js?v=<%=Session("iRevision")%>"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/TxGenerator/components/pattern/pattern.controller.js?v=<%=Session("iRevision")%>"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/TxGenerator/components/module/module.directive.js?v=<%=Session("iRevision")%>"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/TxGenerator/components/module/module.controller.js?v=<%=Session("iRevision")%>"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/TxExtraction/CTxExtraction.js?v=<%=Session("iRevision")%>" type="text/javascript"></script>
    <link href="<%=Session("sIISApplicationName")%>/code/TxExtraction/TxExtraction.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
    <link href="<%=Session("sIISApplicationName")%>/temp_resources/Texts and illustrations/HTML/CR_Default.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
    <link ng-repeat="css in resources.css" ng-href="{{css}}" rel="stylesheet"/>
    <%
        IF request("copyCR") = "true" THEN
			Application("bCopyCR") = true
			Session.Abandon
			response.redirect("/")
		END IF
    %>
</head>
<body>
    <div ng-view style="height: 100%; width: 100%;"></div>
</body>
</html>
