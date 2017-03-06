
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

function editVariable(v, aCallback) {
    if (v) {
        v.setValue = function (Avalue) {
            this.iAction = 2;
            this.value = Avalue;
        }
    }
    displayVariableWindow(v || selectedVariable, aCallback);
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
                editFormula(); //test;
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


var flatten = function (arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

function getParams(aParams) {

    return flatten(aParams.map(function (e) {
        if (e.name) return e.name;
        else if (e.params) return getParams(e.params).concat(e);
    }));
};