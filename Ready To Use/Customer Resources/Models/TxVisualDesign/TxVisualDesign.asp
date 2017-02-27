<!DOCTYPE html>
<html>
<head>
	<meta content="text/html; charset=UTF-8" />  
    <title>TxVisualDesign</title>

	<link rel="stylesheet" media="screen" href="<%=Session("sIISApplicationName")%>/temp_resources/models/TxVisualDesign/css/TxVisualDesign.css"/>
	<link rel="stylesheet" type="text/css" href="<%=Session("sIISApplicationName")%>/code/ExternalLibs/goJS/goJS.css"/>
    
	<!-- #include virtual = '/code/includes/includeCommon.asp'-->
	<!-- #include virtual = '/code/includes/includeVisualComponents.asp'-->
	<!-- #include virtual = '/code/includes/includeWriteForm.asp'-->
    
	<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/ExternalLibs/goJS/go.js"></script>
	<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/ExternalLibs/goJS/DataInspector.js"></script>
	<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/temp_resources/models/TxVisualDesign/js/CGoModel.js"></script>
	<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/temp_resources/models/TxVisualDesign/js/CGoActionPanel.js"></script>
	<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/temp_resources/models/TxVisualDesign/js/CGoScene.js"></script>
	<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/temp_resources/models/TxVisualDesign/js/CGoToolbox.js"></script>
	<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/temp_resources/models/TxVisualDesign/js/mainTxVisualDesign.js"></script>
	<!-- Langue -->
    <script type="text/javascript" src="lang/TxVisualDesign_<%=Session("sLanguageCode")%>.js"></script> 
</head>
<body class="bodyVisualDesign">
    <div id="idTxVDMainLayout" class="fillParent">
        <div id="idDivVDToolbarUp" class="clVDToolbar">
		    <div id="idLogo" class="clFloatLeft">
			    <img src="<%=Session("sIISApplicationName")%>/resources/theme/img/icone.png" style="margin-top:0;margin-left:5px;" class="clFloatLeft"/>
			    <img src="<%=Session("sIISApplicationName")%>/resources/theme/img/logo.png" style="margin-top:5px;margin-left:5px;" class="clFloatLeft"/>
		    </div>
		    <div id="txVDNameSelectedObject" style="text-align:center;"></div>
		    <div id="mainToolBarVDButtons" class="toolbarVDButtons">
			    <img src="<%=Session("sIISApplicationName")%>/temp_resources/models/TxVisualDesign/img/32x32-Folder.png" class="clFloatLeft clButtonsMainToolbar" title="Changer l'Entité source..." id="txVDImgSelectedObject"/>
                <img src="<%=Session("sIISApplicationName")%>/temp_resources/models/TxVisualDesign/img/24x24_Save.png" class="clFloatLeft clButtonsMainToolbar" title="Enregistrer la configuration" id="idSaveJSONBtn"/>
			    <img src="<%=Session("sIISApplicationName")%>/temp_resources/models/TxVisualDesign/img/24x24-New.png" class="clFloatLeft clButtonsMainToolbar" title="Nouveau" id="idNewDrawingBtn"/>
				<img src="<%=Session("sIISApplicationName")%>/temp_resources/models/TxVisualDesign/img/32x32_Workflows.png" class="clFloatLeft clButtonsMainToolbar" title="Repositionnement automatique" id="idAutoRepositionningBtn" />
		    </div>
        </div>
        <div id="idTxVDToolBox">
            <div id="txVDToolbox"></div>
        </div>
		<div id="idTxVDScene" style="height:100%; width: 100%">
		</div> 
		<div id="idTxVDAction">
			<div class="txVdPanelParameters">
                <div class="txVDSubtitle">Paramétrages</div>
                <table id="txVDParameters" class="txVDListParameters">
                    <tr>
                        <td>Conserver les positions :</td>
                        <td><input id="idVDKeepLocation" type="checkbox" checked="true"/></td>
                    </tr>
                    <tr>
                        <td>Direction du positionnement automatique :</td>
                        <td><select id="idVDLayoutAngle">
                                <option value="0" selected="true">Horizontal</option>
                                <option value="90">Vertical</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Afficher les formes libres :</td>
                        <td><input id="idVDDisplayFreeShape" type="checkbox" checked="true"/></td>
                    </tr>
                </table>
            </div>
            <div class="txVdPanelProperties">
                <div class="txVDSubtitle">Propriétés</div>
                <div id="txVDInspector" class="txVDListProperties"></div>
            </div>
            <div class="txVdPanelActions">
                <div class="txVDSubtitle">Actions</div>
                <div id="idTxVDPanelActions" class="txVDListActions"></div>
            </div>
		</div>
    </div>
	
	<script type="text/javascript">
		// Session variable initialisation
		iTxUserSessionId = <%=Session("iUserSessionId")%>
		//variables initialization
		var mode = '<%=request("mode")%>'.toLowerCase(),
			idObj = '<%=request("idObject")%>',
			asCfg = '<%=request("asCfg")%>',
			title = "";

		switch(mode){
			case "config":
				// set Title
				title = _("TxVisualDesign -  Configuration des propriétés visuelles");
				document.title = title;
				J("#txVDNameSelectedObject").html(title);
				openTxVisualCfg({
					"idObject": idObj,
					"asCfg": asCfg
				});
				break;
			case "design":
				// set Title
				title = _("TxVisualDesign -  réalisation graphique");
				document.title = title;
				openTxVisualInterface({
					"idObject": idObj
				});
				break;
          default:
              msgError(_("Le paramètre d'entrée 'mode' de l'application de modèle n'est pas correcte. Veuillez contacter l'administrateur."));
              break;
		}
	</script>
</body>
</html>