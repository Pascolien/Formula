function Get_Cell(AGrid,AID_Row,AID_Col){
	return AGrid.cells(AID_Row,AID_Col);
}

function Get_Cell_Value(AGrid,AID_Row,AID_Col){
	return Get_Cell(AGrid,AID_Row,AID_Col).getValue();
}