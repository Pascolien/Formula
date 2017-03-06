var dhxWins;
var wSimple;
var Simple_Layout;
var JMAInput;
var main_layout;
var divFormula;

function Close_Popup() {
    parent.Form_Get_Content();
    parent.dhxWins.window("txFormula_simple").close();
}

function Cancel() {

    Close_Popup();
}

function remove() {
    var form = document.getElementById(ObjFormula.divname);
    while (form.childNodes.length > 0) {
        form.removeChild(form.childNodes[form.childNodes.length - 1]);
    }
}

function display_formula(i) {


    ObjFormula.displaytype = i;
    ObjFormula.display();
    ObjFormula.calculate();
};

function show_formula() {

    parent.dhtmlx.message({
        title: "formule",
        type: "alert-warning",
        text: ObjFormula.formula
    })

}
 
//choice if its a new formulation or not
 
function formula_Value() {
    ObjFormula.show_formula();
}
function save() {
    ObjFormula.save();
    Close_Popup();
}

function check_formula() {

}

