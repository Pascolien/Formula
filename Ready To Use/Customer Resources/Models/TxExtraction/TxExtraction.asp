<script src="<%=Session("sIISApplicationName")%>/temp_resources/models/TxExtraction/js/TxWebExtractionManager.js?v=<%=Session("iRevision")%>" type="text/javascript"></script>
<script src="<%=Session("sIISApplicationName")%>/temp_resources/models/TxExtraction/js/CTxWebExtraction.js?v=<%=Session("iRevision")%>" type="text/javascript"></script>
<link href="<%=Session("sIISApplicationName")%>/temp_resources/models/TxExtraction/css/TxWebExtraction.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />

<script type="text/javascript">
    var initCallBackMA = {},
        IdOt = '<%=request("var0")%>',
        IdObject = '<%=request("var1")%>';

    initCallBackMA['<%=request("sIdsMaAndObj")%>'] = function(aCB, aDD) {
        rCallBackExt = aCB;
        rDummyDataExt = aDD;

        new CTxWebExtraction({
            idObjectType: IdOt,
            idObject: IdObject,
            sIdDivElement: '<%=request("divElement")%>'
        }, aCB, aDD);
    }
</script>