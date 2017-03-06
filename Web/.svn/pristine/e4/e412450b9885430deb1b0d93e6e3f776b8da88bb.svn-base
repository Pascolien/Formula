
function Close_Popup() {
    parent.dhxWins.window("txFormula_simple").close();
}

function Cancel() {
    Close_Popup();
}

function remove(divDisplay) {
    if (divDisplay != undefined )
    while (divDisplay.childNodes.length > 0) {
        divDisplay.removeChild(divDisplay.childNodes[divDisplay.childNodes.length - 1]);
    }
}

function display_formula(i) {
    ObjFormula.iDisplay_Format = i;
    ObjFormula.display();
    ObjFormula.calculate();
};

function editFormula() {
    displayFormulaWindow(ObjFormula);
};

function editVariable() {
    displayVariableWindow(selectedVariable);
    selectedVariable = null;
}
 
function deleteVariable() {
    if (selectedVariable == undefined) return
    dhtmlx.confirm({
        title: "Delete Variable",
        text: "Variable '" + selectedVariable.name + "' will be deleted, continue ?",
        ok: "Continue",
        cancel: "Cancel",
        callback: function (result) {
            if (result == true) {
                ObjFormula.remVariable(selectedVariable.cell_id);

                // FormulasGrid.deleteRow(FormulasGrid.getSelectedRowId());
                ObjFormula.calculate();
                ObjFormula.display();
                selectedVariable = null;
            }
        }
    });
  

}
//choice if its a new formulation or not
 
function formula_Value() {
    ObjFormula.show_formula();
}
function save() {
    ObjFormula.save();
}

function check_formula() {

}

