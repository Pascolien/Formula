var X = [];
var data = [];
var datajs = {};
var i = 1;
function Close_Popup() {
    parent.dhxWins.window("txFormula_simple").close();
}

function Cancel() {
    Close_Popup();
}

function remove(divDisplay) {
    if (divDisplay != undefined)
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


//test

function dataChart(X) {
  
   var y=ObjFormula.result.value;
    X.forEach(function (val, index){
        data.push({ x: val, y: ObjFormula.result.value[index] });
    });
  //  datajs = JSON.stringify((data, null, 2));
    return data;
    
}

function charts() {    
    
    displayChartWindow();

}

 

function compare() {

    if (!result1) { result1 = 0;}

    if (ObjFormula.result.value > result1) {

        dhtmlx.alert("resultat : " + ObjFormula.result.value + " superieur au resultat precedent :" + result1);


    } else if (ObjFormula.result.value < result1) {

        dhtmlx.alert("resultat  " + ObjFormula.result.value + " inferieur au resultat precedent " + result1);

    }
    else {

        dhtmlx.alert("resultat egaux " + ObjFormula.result.value + " = " + result1);

    }



}

function convertResult() {

    var r = math.unit(ObjFormula.result.unit);
    var a = math.unit(ObjFormula.result.value, r.unit.name);
    var b;
    var c;

    switch (r.unit.name) {

        case "s":

            b = a.to("min");
            //  b = math.round(b,0);
            c = b.to("h");
            // c = math.round(c,0);

            dhtmlx.message({
                title: "Unit Convert",
                type: "alert-warning",
                text: ObjFormula.result.value + r + " = " + b + " or " + c,
                callback: function () { }
            });



            break;

        case "min":
            b = a.to("s");
            c = b.to("h");
            c = math.round(c, 0);
            dhtmlx.message({
                title: "Unit Convert",
                type: "alert-warning",
                text: ObjFormula.result.value + " = " + b + " or" + c
                // callback: function () { dhtmlx.alert("Test alert"); }
            });

        case "h":
            b = a.to("min");
            c = b.to("s");
            // c = math.round(c,0);
            dhtmlx.message({
                title: "Unit Convert",
                type: "alert-warning",
                text: ObjFormula.result.value + " = " + b + " or" + c
            });
            break;

        case "cm":
            debugger;
            b = a.to("m");
            c = b.to("Km");
            dhtmlx.message({
                title: "Unit Convert",
                type: "alert-warning",
                text: ObjFormula.result.value + " = " + b  
                // callback: function () { dhtmlx.alert("Test alert"); }
            });

    }


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