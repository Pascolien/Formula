<script type="text/javascript">
	var initCallBackMA = {},
        wrapper = _url("/temp_resources/models/TxVisualDesign/VDAjax.asp");

    // init function to get callback function
	initCallBackMA['<%=request("sIdsMaAndObj")%>'] = function (aCB, aDD) {
		var jMAInput = {
			idObject : '<%=request("IdObject")%>',
			mode : '<%=request("var2")%>',
			asCfg: '<%=request("var3")%>'
		};
		
		checkMAInputs(jMAInput);
		
		J.ajax({
            url: wrapper,
            async: false,
            cache: false,
            dataType: 'html',
            data: {
                sFunctionName: 'checkObjRight',
                idObject: jMAInput.idObject
            },
            success: function (aResult) {
                var results = aResult.split('|');
                if (results[0] === sOk) {
                    window.open(_url("/temp_resources/models/TxVisualDesign/TxVisualDesign.asp?idObject=") + jMAInput.idObject + "&mode=" + jMAInput.mode + "&asCfg=" + jMAInput.asCfg);
                } else {
                    msgWarning(aResult);
                }
            }
        });

        aCB([],aDD);
	};
	
	function checkMAInputs (ajMAInput){
        if(isNaN(parseInt(ajMAInput.idObject))  || !Boolean(ajMAInput.mode))
            msgWarning(_('Mauvaise configuration des paramètres d\'entrée de l\'application de modèle'));
    }
</script>