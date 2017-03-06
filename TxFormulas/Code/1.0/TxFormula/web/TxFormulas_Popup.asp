<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">
<head>
    <title>Formulas Popup</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />

    <script type="text/javascript" src="js/Math.js"></script>
    <script type="text/javascript" src="js/TxFormulas.js"></script>
    <script type="text/javascript" src="../../../code/js/lib/jquery.js"></script>
    <script type="text/javascript" src="js/TxFormulasForms.js"></script>
    <script type="text/javascript"> var J = jQuery.noConflict();</script>
    <script type="text/javascript" src="../../../code/js/framework_bassetti.js"></script>
    <script type="text/javascript" src="../../../code/js/dhtmlx/dhtmlxcommon.js"></script>
    <script type="text/javascript" src="DHTMLX_Temp/dhtmlxcontainer.js"></script>
    <script type="text/javascript" src="DHTMLX_Temp/windows/dhtmlxwindows.js"></script>
    <script type="text/javascript" src="../../../code/js/dhtmlx/grid/dhtmlxgrid.js"></script>
    <script type="text/javascript" src="../../../code/js/dhtmlx/grid/dhtmlxgridcell.js"></script>
    <script type="text/javascript" src="../../../code/js/dhtmlx/grid/dhtmlxgrid_srnd.js"></script>
    <script type="text/javascript" src="../../../code/js/dhtmlx/grid/dhtmlxgrid_excell_link.js"></script>
    <script type="text/javascript" src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"/> 
    <link rel="stylesheet" type="text/css" href="../../../resources/theme/css/dhtmlx/grid/dhtmlxgrid.css" />
    <link rel="stylesheet" type="text/css" href="../../../resources/theme/css/dhtmlx/grid/dhtmlxgrid_dhx_skyblue.css" />
    <link rel="stylesheet" type="text/css" href="css/Style.css" />
</head>
<body>
    <div class="button" id="">
        <button type="button" class="button tab" id="Grid" onclick="display_formula(1);">tab</button>
        <button type="button" class="button tab" id="form" onclick="display_formula(0);">form</button>
        <button type="button" class="button tab" id="save" onclick="save();">save</button>
        <button type="button" class="button tab" id="close" onclick="formula_display();">show formula</button>

    </div>
    <div class="divFormula" id="divFormula">
    </div>

    <script type="text/javascript">

        var IDObject = '<%=Request("Param1")%>';
        var ID_AS = '<% = Request("Param2")%>';
        var ID_Att_Inifile = '<% = Request("Param3")%>';
        var sDiv_Name = '<% = Request("Param4")%>';
        var sDisplay_Type = '<% = Request("Param5")%>';
        var iStoreMode = '<% = Request("Param6")%>';

        var ObjFormula = {}

        var jMAInput = {

            ID_Object: IDObject,
            ID_AS: ID_AS,
            ID_Att_Inifile: ID_Att_Inifile,
            sDiv_Name: sDiv_Name,
            sDisplay_Type: sDisplay_Type,
            iStore_Mode : iStoreMode
        };

        ObjFormula = new TxFormula(jMAInput);
        // var checked = ObjFormula.chek_formula(jMAInput);
        var loaded = ObjFormula.load(jMAInput);

        if (ObjFormula.loaded == true) {
           // ObjFormula.check_formula();
            ObjFormula.display();
            ObjFormula.calculate();
           
        } else {
            alert("erreur lors du chargement");
            Close_Popup();

        }

    </script>
    <script type="text/javascript">
        function formula_display() {
             
            show_formula();
        }

        
    </script>

</body>
</html>
