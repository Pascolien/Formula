<!-- #include file="includes/charset.inc" -->
<%
	ID_OT = 0
	IF request("id_te") <> "" THEN
		ID_OT = request("id_te")
	END IF
	ID_RS = 0
	IF request("id_cdc") <> "" THEN
		ID_RS = request("id_cdc")
	END IF
	'bLoad_Requirement_Set = false
	IF request("cg") <> "" THEN
		bLoad_Requirement_Set = request("cg")
	END IF
	sTab_Name = ""
	IF request("onglet") <> "" THEN
		sTab_Name = request("onglet")
	END IF
	IF request("sPathFile") <> "" THEN
		sPathFile = request("sPathFile")
	END IF
	sTitle = AResult
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//FR"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">	
<head>	
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <!-- #include virtual="/code/includes/includeCommon.asp" -->

	<script src="<%=Session("sIISApplicationName")%>/code/ExternalLibs/dhtmlx/grid/dhtmlxgrid.js?v=<%=Session("iRevision")%>" type="text/javascript"></script> 
	<script src="<%=Session("sIISApplicationName")%>/code/js/windows.js?v=<%=Session("iRevision")%>" type="text/javascript"></script> 
	<script src="<%=Session("sIISApplicationName")%>/code/ExternalLibs/dhtmlx/grid/dhtmlxgridcell.js?v=<%=Session("iRevision")%>" type="text/javascript"></script> 
	<script src="<%=Session("sIISApplicationName")%>/code/ExternalLibs/dhtmlx/grid/dhtmlxgrid_srnd.js?v=<%=Session("iRevision")%>" type="text/javascript"></script> 
	<script src="<%=Session("sIISApplicationName")%>/code/ExternalLibs/dhtmlx/grid/dhtmlxgrid_nxml.js?v=<%=Session("iRevision")%>" type="text/javascript"></script> 
	<script src="<%=Session("sIISApplicationName")%>/code/ExternalLibs/dhtmlx/grid/dhtmlxgrid_drag.js?v=<%=Session("iRevision")%>" type="text/javascript"></script> 
	<script src="<%=Session("sIISApplicationName")%>/code/ExternalLibs/dhtmlx/grid/dhtmlxgrid_filter.js?v=<%=Session("iRevision")%>" type="text/javascript"></script> 
	<script src="<%=Session("sIISApplicationName")%>/code/ExternalLibs/dhtmlx/grid/dhtmlxgrid_selection.js?v=<%=Session("iRevision")%>" type="text/javascript"></script> 
	<script src="<%=Session("sIISApplicationName")%>/code/ExternalLibs/dhtmlx/grid/dhtmlxgrid_splt.js?v=<%=Session("iRevision")%>" type="text/javascript"></script> 
	<script src="<%=Session("sIISApplicationName")%>/code/ExternalLibs/dhtmlx/grid/dhtmlxgrid_pgn.js?v=<%=Session("iRevision")%>" type="text/javascript"></script> 
	<script src="<%=Session("sIISApplicationName")%>/code/ExternalLibs/dhtmlx/treegrid/dhtmlxtreegrid.js?v=<%=Session("iRevision")%>" type="text/javascript"></script> 
	<script src="<%=Session("sIISApplicationName")%>/code/ExternalLibs/dhtmlx/treegrid/dhtmlxtreegrid_filter.js?v=<%=Session("iRevision")%>" type="text/javascript"></script> 
	<script src="<%=Session("sIISApplicationName")%>/code/ExternalLibs/dhtmlx/toolbar/dhtmlxtoolbar.js?v=<%=Session("iRevision")%>"></script>
	<script src="<%=Session("sIISApplicationName")%>/code/ExternalLibs/dhtmlx/windows/dhtmlxwindows.js?v=<%=Session("iRevision")%>"></script>
	<script src="<%=Session("sIISApplicationName")%>/code/js/comboBox.js?v=<%=Session("iRevision")%>"	type="text/javascript"></script>
	<script src="<%=Session("sIISApplicationName")%>/code/js/mcs_requirements.js?v=<%=Session("iRevision")%>"  type="text/javascript"></script>
	<script src="<%=Session("sIISApplicationName")%>/code/js/grid.js?v=<%=Session("iRevision")%>"  type="text/javascript"></script>
	
	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/teexma.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/dhtmlx/dhx.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/dhtmlx/grid/dhtmlxgrid_pgn_bricks.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css"> 
	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/dhtmlx/grid/dhtmlxgrid.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css"> 
	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/dhtmlx/toolbar/dhtmlxtoolbar_dhx_skyblue.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" >
	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/dhtmlx/windows/dhtmlxwindows.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" >
	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/dhtmlx/windows/dhtmlxwindows_dhx_skyblue.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" >

	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/smc_cdc.css?v=<%=Session("iRevision")%>" 	rel="stylesheet" type="text/css">
	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/comboBox.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css">
    <link href="<%=Session("sIISApplicationName")%>/temp_resources/Texts and illustrations/HTML/CR_Default.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />

	<script type="text/javascript">
		Resize_Div("table_mcs_view",40,80);
		Resize_Div("table_mcs_view_filtered",40,80);
		
		// compatibilité de DHTMLX avec IE8
		if (_isIE && (Get_IE_Version() == 8)) _isIE = 8;

		//var dhxWins = parent.dhxWins;
		var ID_OT,ID_RS,bLoad_Requirement_Set,sTab_Name,sPathFile;
		function doOnLoad(){
		    ID_OT = <%=ID_OT%>
			ID_RS = <%=ID_RS%>
			bLoad_Requirement_Set = <%=bLoad_Requirement_Set%>
			sTab_Name = <%=sTab_Name%>
			// laisser le txlog et bien désactiver la fonction txlog dans framework_bassetti.js sinon ça bug lorsqu'on enregistre le cdc : bizaaaaaaaaaare !!!
			TXLog("sPathFile : <%=sPathFile%>");
		    sPathFile = '<%=sPathFile%>'
			
		    Get_Waiting_Message(_("Veuillez patienter, le calcul de la sélection multicritères est en cours..."),"Waiting_Message");
		    //setTimeout("Load__SMC();",100);
		    Load_SMC();
		}
		function Load_SMC(){
		    J.ajax({
		        url:_url('/code/asp/mcs_visu.asp'),
		        async:false,
		        cache:false,
		        data:{
		            id_te: ID_OT,
		            cg:bLoad_Requirement_Set,
		            id_cdc:ID_RS,
		            onglet:sTab_Name,
		            sPathFile:sPathFile
		        },
		        success:function(aResult){
		            J("#Waiting_Message").css("display","none");
		            J("#SMC_Form").css("display","block");
		            J("#SMC_Form").html(aResult);
		            Focus_Element("id_btn_define_criterion");
		        }
		    });			
		}
	</script>
	<title><%=sTitle%></title>	
    <style>
		#SMC_Form{
			display:none;
			width:100%;
			height:100%;
			overflow:auto;
		}	
	</style>
</head>
<body id="idBodyParent" onload="doOnLoad();">
	
	<div id="Waiting_Message" style="width:100%;height:100%;margin-top:200px;"></div>
	<div id="SMC_Form"></div>
</body>
</html>