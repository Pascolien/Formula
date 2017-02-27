<link href="<%=Session("sIISApplicationName")%>/temp_resources/models/TxMCS/css/TxMCSManager.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/temp_resources/models/TxMCS/js/CTxMCSManager.js?v=<%=Session("iRevision")%>"></script>

<link href="<%=Session("sIISApplicationName")%>/temp_resources/models/TxMCS/css/TxMCS.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/temp_resources/models/TxMCS/js/CTxMCS.js?v=<%=Session("iRevision")%>"></script>

<script type="text/javascript">
        
    var rCallBack,
        rDummyData,
        rResults = {},
        initCallBackMA = {},
        sDivElement = '<%=request("divElement")%>',
        idObjectType = '<%=request("var0")%>',
        idRequirementSet = '<%=request("var1")%>';

    initCallBackMA['<%=request("sIdsMaAndObj")%>'] = function(aCB, aDD) {
        rCallBack = aCB;
        rDummyData = aDD;            
    }

    setTimeout(function () {
        /*var txMCS = new CTxMCS({
            idObjectType: idObjectType,
            idRequirementSet: idRequirementSet,
            bModal: true,
            sIdDivElement: sDivElement
        }, function () {
            rCallBack(rResults, rDummyData);
        });*/
        var txMCSManager = new CTxMCSManager({
            idObjectType: idObjectType,
            sIdDivElement: sDivElement
        }, function () {
            rCallBack(rResults, rDummyData);
        });
    })
</script>