<!-- #include file="clsUplFich.asp" -->

<%
	SET MonUpload = New UplFichier
	
	Randomize
	NouveauNom_Tmp = "import_"& (Int(Rnd * 9999) + 1) & ".xml"
	MonUpload.NouveauNom =  NouveauNom_Tmp

	MonUpload.SauveFichier(1)
		
	SET MonUpload = Nothing 
%>
<!-- #include virtual="/code/includes/includeCommon.asp" -->

<script type="text/javascript">
    var ID_RL = 0,
        sPathFile = "<%=NouveauNom_Tmp%>"

<script type="text/javascript">
	ID_RL = 0;
	sPathFile = "<%=NouveauNom_Tmp%>"
	J.ajax({
	    url:_url('/code/asp/ajax/actions_MCS.asp'),
		async: false,
		cache: false,
		data: { 
			sFunctionName : "Import_RL_From_XML",
			filename : sPathFile
		},
		success: function (aResult) {
		    var results = aResult.split("|");
		    if (results[0] == "ok") {
		        window.parent.frames["iFrameTxASP"].txASP.displayMCS({
					idOT: 0,
					idRequirementSet: results[1],
					sTab: "",
					sPathFile: sPathFile
				});
		        window.parent.frames["iFrameTxASP"].txASP.mainToolbar.wdowContainer.getWindow("wRequirementSet").close();
		    } else {
				msgWarning(results[0]);
		        window.parent.frames["iFrameTxASP"].txASP.mainToolbar.displayPopupRequirementSet();
		    }
	    });  

</script>
  