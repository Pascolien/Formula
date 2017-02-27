<!-- #include virtual="/code/asp/includes/charset.inc" -->
<!-- #include virtual="/code/asp/includes/fct_urldecode.asp" -->
<!-- #include virtual="/code/includes/includeCommon.asp" -->
<% 
    sTxDir = Replace(Session("sTxDir"),"\","\\")
    idObject = request("idObject")
    idOT = Session("ID_OT")
    sVar0 = request("var0")
    sVar1 = request("var1")
    sVar2 = Replace(request("var2"),"\","\\")
    sVar3 = Replace(request("var3"),"\","\\")
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">
<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />

	<link href="<%=Session("sIISApplicationName")%>/Resources/theme/css/teexma.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
	<script src="<%=Session("sIISApplicationName")%>/code/ExternalLibs/jquery.js?v=<%=Session("iRevision")%>"></script>
	<script src="<%=Session("sIISApplicationName")%>/code/Lib/Multilingualism.js?v=<%=Session("iRevision")%>"></script>
	<script src="lang/Workflow_<%=Session("sLanguageCode")%>.js?v=<%=Session("iRevision")%>"></script>
	<script>var J = jQuery.noConflict();</script>
    <script src="<%=Session("sIISApplicationName")%>/temp_resources/models/WorkFlow/lang/WorkFlow_<%=Session("sLanguageCode") %>.js?v=<%=Session("iRevision")%>" type="text/javascript"></script>

	<script type="text/javascript">
	    J(function () {
	        parent.translate();
	    })
	    function Close_Popup() {
	        parent.dhxPopup.close();
	    }

	    function Launch_Validation(AIndex) {
	        s = J("#id_area_comment").val().replace(/\n|\r\n|\r/g, "<br>");
	        Validation(AIndex, s);
	    }

	    function Validation(AAnswer, AComment) {
	        if (AComment == "") {
	            AComment = "<null>";
	        }

	        params = "<%=sTxDir%>|<%=idObject%>|<%=idOT%>|<%=sVar0%>|<%=sVar1%>|2|" + AAnswer + "|" + AComment + "|<%=sVar2%>|<%=sVar3%>";
	        Results = 'Error';
	        new J.ajax({
	            url: '<%=Session("sIISApplicationName")%>/code/asp/ajax/execute_dll.asp',
	            async: false,
	            data: {
	                dll_name: 'Workflow\\Workflow.dll',
	                function_name: 'WFMA_WEB_Validate_WF',
	                parameters: params
	            },
	            success: function (data) {
	                sResults = data;
	                if (sResults != "")
	                    parent.msgWarning(sResults);
	            },
	            error: function (data) {
	                alert(data);
	            }
	        });
	        parent.endWorkflow();
	    }

	</script>
</head>
<body>
	<div class="smc_bordure_ext">
		<div id="idDivValidation" class="smc_bordure_int">
			<span id="id_span_comment">Commentaire de validation : </span><br/>
			<textarea rows="4" cols="5" id="id_area_comment" style="width:350px;" ></textarea>
			<div class="smc_btn_action">
				<input type="button" id="id_btn_yes" value="Oui" onclick="Launch_Validation(1); Close_Popup();" class="btn_std" />
				<input type="button" id="id_btn_no" value="Non" onclick="Launch_Validation(2); Close_Popup();" class="btn_std" />
				<input type="button" id="id_btn_cancel" value="Annuler" onclick="Close_Popup();" class="btn_std" />
			</div>
		</div>
    </div>
	
</body>
</html>