
	<!-- #include virtual="/code/includes/includeCommon.asp" --> 
    <!-- #include virtual="/code/includes/includeVisualComponents.asp" --> 
	<!-- #include virtual="/code/includes/includeWriteForm.asp" -->
    
    <link href="<%=Session("sIISApplicationName")%>/temp_resources/Texts and illustrations/HTML/CR_Default.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />

    <script type="text/javascript">
		// compatibilité de DHTMLX avec IE8
        if (_isIE && (Get_IE_Version() == 8)) _isIE = 8;
	</script>

    <link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/dhtmlx/toolbar/dhtmlxtoolbar_dhx_web.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/TxModelApplication/CModelApplicationExecution.js"></script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/TxASP/CMainToolbar.js?v=<%=Session("iRevision")%>" > </script>
	<script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/TxASP/CTxBanner.js?v=<%=Session("iRevision")%>" > </script>
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/code/TxASP/readForm.js?v=<%=Session("iRevision")%>" > </script>

	<div id="id_div_cell_a">
		<div id="id_div_MainToolbar">
			<div id="id_div_logo" class="cl_float_left">
				<img src="<%=Session("sIISApplicationName") %>/resources/theme/img/icone.png" style="margin-top:0px;margin-left:5px;" class="cl_float_left"/>
				<img src="<%=Session("sIISApplicationName")%>/temp_resources/theme/img/logo.png" style="margin-top:5px;margin-left:5px;" class="cl_float_left"/>
			</div>
			<div id="MainToolbarButtons"></div>
			<div id="id_div_tableName"></div>
			<!-- block for MCS indicators -->
			<div id="id_ind_MCS" style="display:none;">
				<span class="MCS_information"></span>
				<div class="btn_switch_MCS" title="Désactiver la sélection multicritère">
					<div id="onoffswitch_3" class="Switch On">
						<div class="Toggle"></div>
						<span class="On">ON</span> <span class="Off">OFF</span>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<div id="id_div_cell_b">	
		<div id="id_div_TxTableGrid" class="div_TxTableGrid"></div> 
	</div>	
	<div id="id_div_cell_c">		
		<div id="id_div_TxTableGridToolbar"></div>
	</div>
	<iframe name="hiddenFrame" style="display:none;"></iframe>
	<div id="viewportWindows"></div>
