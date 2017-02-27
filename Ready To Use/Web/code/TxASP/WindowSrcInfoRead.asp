<!DOCTYPE>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">
<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<script type="text/javascript">
	    J(function(){
	        idObject = "<%=request("idObject")%>";
	        idObjectSource = "<%=request("idObjectSource")%>";
	        idAttribute = "<%=request("idAttribute")%>";
	        bSource = "<%=request("bSource")%>";
	        J.ajax({
	            url:sPathTxAspAjax,
	            async: false,
	            cache:false,
	            data:{
	                sFunctionName:"getFormSrcInfo",
	                idObject : idObject, 
	                idObjectSource: idObjectSource, 
	                idAttribute: idAttribute, 
	                bSource :  bSource,
	            },
	            success:function(aResult){
	                var results = aResult.split("|");
	                if (results[0] == sOk)
	                    J('#idDivContentSrcInfo').html(results[1]);
	                else
	                    msgWarning(results[0]);
	            }
	        });
	    });
	</script>	
</head>
<body>
	<div id="idDivContentSrcInfo"></div>
</body>
</html>
