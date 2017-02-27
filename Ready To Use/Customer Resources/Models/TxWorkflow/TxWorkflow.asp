<link rel="stylesheet" type="text/css" href="<%=Session("sIISApplicationName")%>/temp_resources/models/TxWorkflow/TxWorkflow.css?v=<%=Session("iRevision")%>" />
<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/temp_resources/models/TxWorkflow/CWorkflow.js?v=<%=Session("iRevision")%>"></script>
<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/temp_resources/models/TxWorkflow/CWorkflowActionExecution.js?v=<%=Session("iRevision")%>"></script>

<script type="text/javascript">
	// declare global variable(s)
    var initCallBackMA = {};

	// init function to get callback function
    initCallBackMA['<%=request("sIdsMaAndObj")%>'] = function (aCB, aDD) {
        if (typeof amWorkflow != 'undefined') {
            amWorkflow.cancelToClose();
            amWorkflow = undefined;
        } else {
            amWorkflow = new CWorkflow({
	            sIdObject: '<%=request("var0")%>',
	            sWorkflowTag: '<%=request("var1")%>',
	            sFlag: '<%=request("var2")%>'
		    }, aCB, aDD);
        }
	}
</script>