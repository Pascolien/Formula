function Grid_Check_All(AsID_Grid,AState){
	J.ajax({
		url: _url('/code/asp/ajax/actions_grid.asp'),
		async: true,
		cache: false,
		dataType:'script',
		data:{ 
			sFunctionName: "Check_All",
			checked : AState,
			sid_grid:AsID_Grid
		}
	});
	return true;
}

function Grid_OnCheck(AsID_Grid){
	dhxGrid = eval(AsID_Grid);
	dhxGrid.attachEvent("onCheck", function(ID_Row,ID_Cell,State){
		J.ajax({
			url: _url('/code/asp/ajax/actions_grid.asp'),
			async: false,
			dataType:'script',
			data:{ 
				sFunctionName: "OnCheck",
				id_object: ID_Row,
				checked : State,
				sid_grid: AsID_Grid
			}
		});
		return true;
	});	
}
