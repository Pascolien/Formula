<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">
<head>
    <title>TxFormulas</title>
    <!-- base de prog -->
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <script type="text/javascript" src="../../../code/js/dhtmlx/dhtmlxcommon.js?v=<%=Session("iRevision")%>"></script>
    <script type="text/javascript" src="DHTMLX_Temp/layout/dhtmlxlayout.js"></script>
    <script type="text/javascript" src="DHTMLX_Temp/windows/dhtmlxwindows.js"></script>
    <script type="text/javascript" src="DHTMLX_Temp/dhtmlxcontainer.js"></script>
    <script type="text/javascript" src="js/TxFormulasForms.js"></script>
    <script type="text/javascript" src="../../../code/js/lib/jquery.js"></script>   
    <script type="text/javascript" src="../../../code/js/framework_bassetti.js"></script>
    <script type="text/javascript" src="../../../code/js/dhtmlx/grid/dhtmlxgrid.js"></script>
    <script type="text/javascript" src="../../../code/js/dhtmlx/grid/dhtmlxgridcell.js"></script>
	<script type="text/javascript" src="../../../code/js/dhtmlx/grid/dhtmlxgrid_srnd.js"></script>
	<script type="text/javascript" src="../../../code/js/dhtmlx/grid/dhtmlxgrid_excell_link.js"></script>
    <script type="text/javascript" src="js/TxFormulas.js"></script>
    <script type="text/javascript" src="js/Math.js"></script>
    <link rel="Stylesheet" type="text/css" href="css/Style.css" />    
    <link rel="Stylesheet" type="text/css" href="../../../Resources/theme/css/dhtmlx/grid/dhtmlxgrid.css" />
    <link rel="stylesheet" type="text/css" href="../../../resources/theme/css/dhtmlx/grid/dhtmlxgrid_dhx_skyblue.css"/>
    <link rel="Stylesheet" type="text/css" href="../../../Resources/theme/css/dhtmlx/dhtmlx.css" />
    

    <script type="text/javascript">
        var J = jQuery.noConflict();
    </script>
</head>
<body>    
    <script type="text/javascript">

        var ID_Object = '<%=Session("ID_Object")%>';
        var ID_AS = '<% = Request("var1")%>';
        var ID_Att_Inifile = '<% = Request("var2")%>';
        var sDiv_Name = '<% = Request("var3")%>';
        var sDisplay_Type = '<% = Request("var4")%>';
       
        window.parent.frames["frame_e"].Initialise_Popup("txFormula_simple", "../../temp_resources/models/TxFormulas/TxFormulas_Popup.asp?Param1=" + ID_Object + "&Param2=" + ID_AS + "&Param3=" + ID_Att_Inifile + "&Param4=" + sDiv_Name + "&Param5=" + sDisplay_Type, 'Formulas', 600, 400, '../../../temp_resources/models/TxFormulas/formulas.png', true, true, true, true);
       
    </script>
    
</body>
</html>

