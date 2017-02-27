<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">	
<head>	
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />

	<link href="<%=Session("sIISApplicationName")%>/temp_resources/Texts and illustrations/HTML/CR_Default.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/table_view.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
	
	<script src="<%=Session("sIISApplicationName")%>/code/js/treegrid.js?v=<%=Session("iRevision")%>" type="text/javascript"></script>
	<script src="<%=Session("sIISApplicationName")%>/code/asp/TxTableView/TxTableView.js?v=<%=Session("iRevision")%>" type="text/javascript"></script>
    <title>Vue tableau</title>	
    <script type="text/javascript">
        J(function () {
            var idOT = '<%=request("idOT")%>';
            J.ajax({
                url: sPathTxTableViewAjax,
                async: false,
                cache: false,
                data: {
                    sFunctionName: "getHTMLTableView",
                    idOT: idOT
                },
                success: function (aResult) {
                    var results = aResult.split("|");
                    if (results[0] == sOk) {
                        J("#idDivTableViewContent").html(results[1]);
                        J("#table_tree_view").css("width", "868px");
                        J("#table_tree_view").css("height", "460px");
                        J("#table_linear_view").css("width", "868px");
                        J("#table_linear_view").css("height", "460px");
                    } else
                        msgWarning(results[0]);
                }
            });
            J(".objbox").unbind("click");
            J(".objbox").click(function () { OnClick_Out() });
            J("#div_bordure_ext").unbind("click");
            J("#div_bordure_ext").click(function () { OnClick_Out() });
        });
    </script>
</head>
<body>
    <div id="idDivTableViewContent"></div>	
</body>
</html>
