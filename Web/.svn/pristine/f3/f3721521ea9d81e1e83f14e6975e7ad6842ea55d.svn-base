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

/*function viewChart(i) {
    switch (i) {

        case 1:
            var LineChart = new dhtmlXChart({
                view: "line",
                container: sDivChart,
                value: "#x#",
                label: "#y#",
                tooltip: "#y#",
                item: {
                    borderColor: "#ffffff",
                    color: "#000000"
                },
                line: {
                    color: "#ff9900",
                    width: 3
                },
                xAxis: {
                    title: "X",
                    template: "#x#"
                },
                yAxis: {
                    start: 0,
                    step: 10,
                    title: "Y",
                    template: "#y#"
                },
            });
            LineChart.parse(data, "json");
            break;
        case 2:
            var barChart = new dhtmlXChart({
                view: "bar",
                container: sDivChart,
                value: "#x#",
                label: "#y#",
                tooltip: "#y#",
                item: {
                    borderColor: "#ffffff",
                    color: "#000000"
                },
                line: {
                    color: "#ff9900",
                    width: 3
                },
                xAxis: {
                    title: "X",
                    template: "#x#"
                },
                yAxis: {
                    start: 0,
                    step: 10,
                    title: "Y",
                    template: "#y#"
                },
            });
            barChart.parse(data, "json");
            break;
        case 3:
            var pieChart = new dhtmlXChart({
                view: "pie",
                container: sDivChart,
                value: "#x#",
                label: "#y#",
                tooltip: "#y#",
                item: {
                    borderColor: "#ffffff",
                    color: "#000000"
                },
                line: {
                    color: "#ff9900",
                    width: 3
                },
                xAxis: {
                    title: "X",
                    template: "#x#"
                },
                yAxis: {
                    start: 0,
                    step: 10,
                    title: "Y",
                    template: "#y#"
                },
            });
            debugger;
            pieChart.parse(data, "json");
            break;
    }
}*/
 
//end test

function compare() {

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
