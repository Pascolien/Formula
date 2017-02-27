<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">	
<head>	
    <title>TxWebExportation</title>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=8" />
	
    <!-- #include virtual="/code/includes/includeCommon.asp" -->	
    <!-- #include virtual="/code/includes/includeVisualComponents.asp" -->
    <!-- #include virtual="/code/TxWebComponents/include_webTree.asp" -->
    
    <script src="js/TxWebExportation_Manager.js?v=<%=Session("iRevision")%>" type="text/javascript"></script>
    <script src="js/CTxWebExportation.js?v=<%=Session("iRevision")%>" type="text/javascript"></script>
    <link href="css/TxWebExportation.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
    <link href="<%=Session("sIISApplicationName")%>/temp_resources/Texts and illustrations/HTML/CR_Default.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />

    <script type="text/javascript">
        var TxWebExportation;
        
        function initInterface(aSettings) {
            var TxWebExportation = new CTxWebExportation(aSettings);
        }
    </script>
</head>
<body>
	<div id="id_div_cell_a">
		<div id="id_div_comboboxes">
            <div style="height: 22px;margin-top: 6px;">
                <div class="clLabelExport"><label>Filtre :</label></div>
                <div style="float:left"><div id="idDivComboOT"></div></div>
            </div>
            <div style="height: 22px; margin-top: 6px;">
                <div class="clLabelExport"><label>Exportations :</label></div>
                <div style="float:left"><div id="idDivExportations"></div></div>
            </div>
		</div>
    </div>
    <div id="id_div_cell_b">
        <div id="id_div_cell_objects">
            <label>Entités</label>
            <div id="id_div_treeObject" class="cl_div_treeExport"></div>
            <div id="id_div_toolbarObject" class="cl_div_toolbarExport"></div>
        </div>
    </div>
    <div id="id_div_cell_c">
        <div id="id_div_cell_data">
            <label>Données</label>
            <div id="id_div_treeAttribute" class="cl_div_treeExport"></div>
            <div id="id_div_toolbarAttribute" class="cl_div_toolbarExport"></div>
        </div>
    </div>
    <div id="id_div_cell_d">
        <div id="id_div_zip">
            <input type="checkbox" id="id_check_compressFile" /><label>Compresser le fichier de données</label>
        </div>
		<div id="idDivBtnsExport">
            <input type="button" class="cl_btn_action" id="export" value="Exporter" disabled="disabled" />
            <input type="button" class="cl_btn_action" id="close" value="Fermer" />
		</div>		
	</div>
    <iframe id="idFrameUpload" name="hiddenFrame" style="display:none;"></iframe>
</body>
</html>