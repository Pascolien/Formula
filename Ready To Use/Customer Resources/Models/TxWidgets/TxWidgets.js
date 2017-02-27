function Load_XML_TxWidget(AID_Application_Model,AID_Div_Grid,AID_RL,AID_User_Criterion,AID_Criterion_Date){
	J("#"+AID_Div_Grid + " .objbox").append("<center><div id='id_div_loading"+AID_Application_Model+"'><img src='../../resources/theme/img/gif/ajax-loader.gif' /></div></center>")
	new J.ajax({
		url:"../../temp_resources/models/TxWidgets/TxWidgets.asp",
		async:true,
		cache:false,
		dataType:"html",
		data:{
			ID_Application_Model:AID_Application_Model,
			ID_RL:AID_RL,
			sID_User_Criterion:AID_User_Criterion,
			ID_Criterion_Date:AID_Criterion_Date
		},
		success:function(data){
			J("#id_div_loading"+AID_Application_Model).css("display","none");
			rWidget = eval("Widget_MCS"+AID_Application_Model);
			try{
				rWidget.loadXML(data);
			}catch(e){}
		}
	});
}