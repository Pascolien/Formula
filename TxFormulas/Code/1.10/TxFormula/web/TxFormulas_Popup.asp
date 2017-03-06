<html >
<head>
    <title>Formulas Popup</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
   
    <script type="text/javascript" src="/code/ExternalLibs/jquery.js"></script>   
    <script type="text/javascript" src="/code/js/framework_bassetti.js"></script>
    <script type="text/javascript" src="../../../../code/Lib/ArrayUtils.js"></script>
    <script type="text/javascript" src="/temp_resources/models/TxFormula/Web/dhtmlx43/dhtmlx.js"></script>
    <link rel="stylesheet" type="text/css" href="/temp_resources/models/TxFormula/Web/dhtmlx43/dhtmlx.css" />
    
    <script type="text/javascript" src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"/> 

    <script type="text/javascript" src="js/Math.js"></script>
    <script type="text/javascript" src="js/TxFormulas.js"></script>
    <script type="text/javascript" src="/code/ExternalLibs/jquery.js"></script>
    <script type="text/javascript" src="js/TxFormulasForms.js"></script>
    <script type="text/javascript" src="js/TxFormulaAddVariableFrm.js"></script>
    <script type="text/javascript" src="js/TxFormulaDelVariableFrm.js"></script>
    <script type="text/javascript" src="js/TxFormulaEditFormulaFrm.js"></script>  

    <link rel="stylesheet" type="text/css" href="css/Style.css" />
</head>
<body>   
    <div class="clFormula" id="divFormula">
    </div>

    <script type="text/javascript">
        var J = jQuery.noConflict();
        var dhxWins;
        var sjMAInput = '<%=Request("Param1")%>'
        var jMAInput = parseJSON(sjMAInput);
        var ObjFormula = {}

        ObjFormula = new TxFormula(jMAInput);
        /*debugger;*/
        var loaded = ObjFormula.load(jMAInput);

        if (ObjFormula.loaded == true) {
            if (ObjFormula.checkDisplay() == true) {
                ObjFormula.setToolBar();
                ObjFormula.display();
                ObjFormula.calculate();
            }
           
        } else {
            alert("An error occured on loading formula");
            Close_Popup();

        }

    </script>
</body>
</html>
