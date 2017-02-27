<%
	' On execute la DLL Workflow pour vérifier si les conditions sont bonnes 
	' pour demander une validation sur cette entité	  
	sDLL_Path = "Workflow\Workflow.dll"	
		
	sConfig_Filename = request("var2")
	IF sConfig_Filename = "" THEN
		sConfig_Filename = "Workflow\\" & Session("ID_OT") & ".ini"
	END IF
	
	sRightsConfiguration = request("var3")
	IF sRightsConfiguration = "" THEN
	  sRightsConfiguration = "Cfg_" & Session("ID_OT")
	END IF
	
	sParameters = Session("sTxDir") & "|" & request("idObject") & "|" & Session("ID_OT") & "|" & request("var0") & "|" & request("var1") & "|1|0|null|" & sConfig_Filename & "|" & sRightsConfiguration   			  			

	'This is true in case of multiple rights file. When the choice depends on another status (the confidential status for example).
	if request("var4")<>"" and request("var5")<>"" then
		ID_Att_StatusForRights = request("var5")
		ID_Object = request("idObject")
	
		ID_ObjStatusForRights = API_ASP_App.Read_Data_Link_Single_ID_Object(ID_Att_StatusForRights,ID_Object,0)
		
		'The parameter "var4" contains the identifier of the equivalences set.
		sParameters = sParameters & "|" & request("var4") & "|" & ID_ObjStatusForRights
	end if
	
	API_ASP_TxASP.Execute_DLL sDLL_Path, "WFMA_WEB_Validate_WF", sParameters, sResults

	  ' Si les conditions sont bonnes on demande la validation avec l'ajout d'un commentaire 
%>
      <script src="<%=Session("sIISApplicationName")%>/temp_resources/models/WorkFlow/lang/WorkFlow_<%=Session("sLanguageCode") %>.js?v=<%=Session("iRevision")%>" type="text/javascript"></script>
      
	  <script type="text/javascript">
	    var rResultsWF = {};
        var rCallBackWF, rDummyDataWF;
        var initCallBackMA = {};
        var sDivElement = '<%=request("divElement")%>';
        var idObject = '<%=request("idObject")%>';
        var idOT = '<%=Session("ID_OT")%>';
        var sResult = "<%=replace(sResults,"""","'")%>";

        // init function to get callback function
        initCallBackMA['<%=request("sIdsMaAndObj")%>'] = function (aCB, aDD) {
            rCallBackWF = aCB;
            rDummyDataWF = aDD;
        }

	    if (sResult == "")
		    Init_Popup(_url('/temp_resources/models/Workflow/workflow_validation_popup.asp?idObject=')+idObject+'&var0=<%=request("var0")%>&var1=<%=request("var1")%>&var2=<%=Replace(sConfig_Filename,"\","\\")%>&var3=<%=Replace(sRightsConfiguration,"\","\\")%>',_("Voulez-vous valider l'Entité ?"),406,195,''); 	
	    else 	
	        msgWarning(sResult);
		// Réponse : 1 vrai, 2 faux, 3 cancel 
		// Mode : 2 validation finale
		
		function Validation(AAnswer, AComment) {
			//alert("Validation");
			if (AComment == "") {
				AComment = "null";
			}

			params = '<%=Replace(Session("sTxDir"),"\","\\")%>|"+idObject+"|"+idOT"|<%=request("var0")%>|<%=request("var1")%>|2|"+AAnswer+"|"+AComment+"|<%=Replace(sConfig_Filename,"\","\\")%>|<%=Replace(sRightsConfiguration,"\","\\")%>';  

			//alert(params);
			
			Results = 'Error';
			new J.ajax({
			    url:'<%=Session("sIISApplicationName")%>/code/asp/ajax/execute_dll.asp',
				async: false,
				data: { dll_name: 'Workflow\\Workflow.dll', 
					function_name:'WFMA_WEB_Validate_WF', 
					parameters: params 
				},
				success: function(data) {
					Results = data;
				}
			});
      
			endWorkflow();		  		  
		}

	    function endWorkflow() {
	        rResultsWF.updateObject = new Object();
	        rResultsWF.updateObject.ID = idObject;
	        rResultsWF.updateObject.ID_OT = idOT;
	        rCallBackWF(rResultsWF, rDummyDataWF);
	        J("#"+sDivElement).remove();
	    }
	</script>