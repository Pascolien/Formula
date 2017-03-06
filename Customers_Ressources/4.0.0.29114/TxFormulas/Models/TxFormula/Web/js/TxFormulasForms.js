
function Close_Popup() {
    parent.dhxWins.window("txFormula_simple").close();
}

function Cancel() {
    Close_Popup();
}

function remove(divDisplay) {
    while (divDisplay.childNodes.length > 0) {
        divDisplay.removeChild(divDisplay.childNodes[divDisplay.childNodes.length - 1]);
    }
}

function display_formula(i) {
    ObjFormula.iDisplay_Format = i;
    ObjFormula.display();
    ObjFormula.calculate();
};

function show_formula() {
    parent.dhtmlx.message({
        title: "formule",
        type: "alert-warning",
        text: ObjFormula.formula
    })
};

function editFormula() {
    displayFormulaWindow(ObjFormula);
};

function editVariable() {
    displayVariableWindow(selectedVariable);
    selectedVariable = null;
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

