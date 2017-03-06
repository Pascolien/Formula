 

<!-- base de prog -->
<%
	Session("sPath_DLL") = "FormulasWeb\TxFormulas.dll"
%>
 <script type="text/javascript" src="../../../../code/js/lib/jquery.js"></script>
 <script type="text/javascript" src="../../../../code/js/framework_bassetti.js"></script>

 <script type="text/javascript"> 
    var J = jQuery.noConflict(); 
 </script>

<script type="text/javascript">

new J.ajax({
    url:"ajax.asp",
    async:false,
    data:{
        sfunction:"Get_Formula",
        Id_Obj: Id_Obj,
        TxObj_CycleTime:TxObj_CycleTime,
        fCycleTime:fCycleTime 
        sFormula : sFormula
        
    },
    success:function(data){
    var sResult = StrToArray(data);
    if (sResult[0] === "ok"){
	 //....
     prompt("ok");
	} else
	    alert(sResult[0]);
	}
    error: function (data) {
        alert(sResult[1]);
    }
    
});

</script> 
 