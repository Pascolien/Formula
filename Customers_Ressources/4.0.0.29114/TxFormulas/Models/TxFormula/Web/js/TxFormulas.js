var sFileName_WebFormulas_ASP = "ajax.asp";
var FormulasGrid;
var divFormula;
var sDivShowFormula = "divShowFormula";
var divShowFormula;
var sDivToolbarId = "divFormulaToolbar"
var divToolbar;
var divDisplayMgr;
var sDivDisplayId = "divformulaDisplay";
var divDisplay;

var selectedVariable;

function parseJSON(aJSONString) {
    return eval("(" + aJSONString + ")");
};

function TxFormula(aSettings) {
    this.ID_Formula = 0;
    this.name = '';
    this.variables = [];
    this.formula = {};
    this.result = {};
    this.unit = '';
    this.iDisplay_Format = 0;
    this.sDiv_Formula = '';
    this.loaded = false;
    this.iStore_Mode = 0;
    this.iEdit_Rights = 0;
    this.sTag_Formula = '';

    this.read = function (aJson) {
        this.name = aJson.name;
        this.ID_Formula = aJson.ID_Formula;

        for (var i = 0; i < aJson.variables.length; i++) {
            var newvar = new TxVariable(aJson.variables[i]);
            newvar.cell_id = i;
            this.variables.push(newvar);
        };

        this.formula = aJson.formula;

        this.result.value = aJson.result.value;
        this.result.unit = aJson.result.unit;

        this.iDisplay_Format = aSettings.iDisplay_Format;
        this.sDiv_Formula = aSettings.sDiv_Formula;
        this.iStore_Mode = aSettings.iStore_Mode;
        this.iEdit_Rights = aSettings.iEdit_Rights;
        this.sTag_Formula = aSettings.sTag_Formula;
    }

    //chek formula
    this.check_formula = function () {
        if (parseParentheses(this.formula) == false) {
            parent.dhtmlx.message({
                title: "error",
                type: "alert-warning",
                text: "parenthèse de droite manquante"
            })


        }
    }
    //end of chek formula
   
    this.getResult = function () {
        this.calculate();
        return this.result;
    };

    this.calculate = function () {
        this.result.value = 0;

        //parcours des valeurs de l'objet equivalent d'une boucle for

        var scope = this.variables.reduce(function (prev, cur) {
            prev[cur.name] = cur.value; return prev;
        }, {});
        try {
            this.result.value = math.eval(this.formula, scope);
            this.result.value = math.round(this.result.value, 2);

            if (this.iDisplay_Format == 0) {
                var res = document.getElementById('result');
                res.value = this.result.value;
            }
            else {
                var res = FormulasGrid.cells('result_row', 1);
                res.setValue(this.result.value);
            }
            divShowFormula.setAttribute("style", "color: green");
            return true;
            
        } catch (err) {
            divShowFormula.style.display = "block";
            divShowFormula.setAttribute("style", "color: red");
            divShowFormula.innerText = err.message;
            return false;
        }
    }

    this.checkDisplay = function () {
        divFormula = document.getElementById(this.sDiv_Formula);

        if (divFormula == null) {
            alert("no div defined for element display");
            return false;
        }

        divToolbar = document.createElement("div")
        divToolbar.setAttribute("id", sDivToolbarId);
        divToolbar.setAttribute("class", "clToolbar");
        divFormula.appendChild(divToolbar);

        divShowFormula = document.createElement("div");
        divShowFormula.setAttribute("id", sDivShowFormula);
        divShowFormula.setAttribute("class", "clShowFormula");
        divShowFormula.setAttribute("style", "display: none !important");
        if (this.iEdit_Rights > 1) {
            divShowFormula.addEventListener("mouseover", function () {
                $(this).css('cursor', 'text');
            })
            divShowFormula.addEventListener("dblclick", editFormula);
        }
        divFormula.appendChild(divShowFormula);

        divDisplay = document.createElement("div");
        divDisplay.setAttribute("id", sDivDisplayId)
        divDisplay.setAttribute("class", "clDisplay");
        divFormula.appendChild(divDisplay);

        return true;
    }

    this.setToolBar = function () {
        var formulaToolbar = new dhtmlXToolbarObject(divToolbar);
        formulaToolbar.setIconsPath("/Resources/theme/img/");
        
        if (this.iEdit_Rights>1){
            var EditOptions = [ ['editVariable', 'obj', 'Edit/Add Variable'],
                                ['editFormula', 'obj', 'Edit Formula']                    
            ];

            formulaToolbar.addButtonSelect("edit", 10, "Edit", EditOptions, 'iconsToolbar/edit.png');
        };

        var displayOptions = [  ['displayForm', 'obj', 'As Form'],
                                ['displayGrid', 'obj', 'As Grid'],
                                ['showFormula', 'obj', 'Show/Hide formula']
                             ];

        formulaToolbar.addButtonSelect("display", 20, "Display", displayOptions, 'btn_titre/module_export.png');

        formulaToolbar.addButton('save', 30, 'Save', 'btn_form/save_html_editor.png');

        formulaToolbar.addButton('exit', 40, 'Exit', 'btn_titre/exit.png');

        formulaToolbar.attachEvent("onClick", function (id) {

            switch (id) {

                case "editVariable":
                    editVariable();
                    break;

                case "editFormula":
                    editFormula();
                    break;

                case "displayForm":
                    display_formula(0);
                    break;

                case "displayGrid":
                    display_formula(1);
                    break;

                case "showFormula":
                    if (document.getElementById(sDivShowFormula).style.display == "none") {
                        document.getElementById(sDivShowFormula).style.display = "block";
                    } else {
                        document.getElementById(sDivShowFormula).style.display = "none"
                    }
                    break;

                case "save":
                    save();
                    break;

                case "exit":
                    Close_Popup();
                    break;
            }
        });
    }

    this.load = function (aInput) {
        new J.ajax({
            url: sFileName_WebFormulas_ASP,
            async: false,
            cache: false,
            method: "post",
            dataType: "html",
            data: {
                event: "Get_Formula",
                Object: JSON.stringify(aInput)                
            },
            success: function (data) {
                var sResult = data.split('|');

                if (sResult[0] === 'ok') {
                    var json = parseJSON(sResult[1]);
                    ObjFormula.read(json);
                    ObjFormula.loaded = true;
                }
            },
            error: function (a, b, c) {
                alert(b);
                return false;
            }
        });
    }

    this.getVariable = function (aID) {
        for (var i = 0; i < this.variables.length; i++) {
            if (this.variables[i].cell_id == aID) {
                return this.variables[i];
            }
        }
        return null;

    }

    this.renumVarIds = function () {
        for (var i = 0; i < this.variables.length; i++) {
            this.variables[i].cell_id = i;
        }
    };

    this.remVariable = function (aID) {
        for (var i = 0; i < this.variables.length; i++) {
            if (this.variables[i].cell_id == aID) {
                this.variables.splice(i, 1);
                break;
            }
        }
        this.renumVarIds();
        this.calculate();
    }

    this.getVariableFromName = function (aName) {
        for (var i = 0; i < this.variables.length; i++) {
            if (this.variables[i].name == aName) {
                return this.variables[i];
            }
        }
        return null;
    }

    this.display = function () {

        parent.dhxWins.wins['txFormula_simple'].attachEvent("onResizeFinish", function (win) {
            var h = parent.dhxWins.wins['txFormula_simple'].h - (divToolbar.clientHeight + )
        divDisplay.
        });

        remove(divDisplay);
        var self = this;
        divShowFormula.innerText = self.formula;
        if (this.iDisplay_Format == 0) {
            //display as form
            this.variables.forEach(function (variable) {
                //display names          
                var div_var = document.createElement('div');
                div_var.setAttribute('class', 'div_cell');
                var legend_txt = document.createElement('label');
                legend_txt.innerHTML = variable.name.replace(/_/g, ' ') + ' : ';
                div_var.appendChild(legend_txt);

                //display inputs with variable's values
                var input = document.createElement('input');
                input.setAttribute('type', 'text');
                input.setAttribute('class', 'input_variable');
                input.setAttribute('name', variable.name);
                input.setAttribute('value', variable.value);
                input.setAttribute('required','required');
                input.setAttribute('size', '5');
                div_var.appendChild(input);

                //prevent display of null unit
                if (variable.unit != null) {
                    var Unit_txt = document.createTextNode(variable.unit);
                    div_var.appendChild(Unit_txt);
                }

                divDisplay.appendChild(div_var);

                //management of events
                input.addEventListener('click', function () {
                    selectedVariable = variable;
                });
                input.addEventListener('change', function () {
                    var sValue = this.value.replace(',', '.');

                    if (sValue == "") {
                        alert(("Please enter a value"));
                        return false
                    } 
                    if (isNaN(sValue)) {
                        alert(("Please enter a numerical value"));
                        return false
                    } else {
                        var fValue = Number(sValue);
                    }
                    
                    this.value = fValue;
                    variable.setValue(fValue);
                    self.calculate();

                })
            });

            //display result 
            var div_result = document.createElement('div');
            div_result.setAttribute('class', 'div_cell');
            var legend_txt = document.createElement('label')
            legend_txt.innerHTML = this.name.replace(/_/g, ' ') + ' : ';
            div_result.appendChild(legend_txt);

            var input = document.createElement('input');
            input.setAttribute('class', 'input_result');
            input.setAttribute('type', 'text');
            input.setAttribute('id', 'result');
            input.setAttribute('name', this.name);
            input.setAttribute('size', '5');
            input.setAttribute('value', this.result.value);
            input.setAttribute('readonly', 'readonly');
            input.addEventListener('click', function () {
                selectedresult = this.result;
            });

            div_result.appendChild(input);

            //prevent display of null unit
            if (this.result.unit != null) {
                var Unit_txt = document.createTextNode(this.result.unit);
                div_result.appendChild(Unit_txt);
            }

            divDisplay.appendChild(div_result);
        } else {
            //Display as Grid                
            FormulasGrid = new dhtmlXGridObject(sDivDisplayId);
            FormulasGrid.setSkin("dhx_skyblue");           
            FormulasGrid.setHeader("Name,Value,Unit");
            FormulasGrid.setInitWidths("*,100,60");
            FormulasGrid.setColAlign("left,right,left");
            FormulasGrid.setColTypes("ro,edn,ro");
            FormulasGrid.enableResizing("false,false,false");
            FormulasGrid.init();

            this.variables.forEach(function (variable) {
                var cell_id = variable.cell_id;
                FormulasGrid.addRow(cell_id, ['Variable : ' + variable.name.replace(/_/g, ' '), variable.value, variable.unit]);
                FormulasGrid.cells(cell_id, 1).setTextColor('green');
            });

            FormulasGrid.addRow('result_row', ['Result : ' + this.name, this.result.value, this.result.unit]);

            var result = FormulasGrid.cells('result_row', 1);
            result.setDisabled(true);

            FormulasGrid.attachEvent("onEditCell", function (stage, rId, cInd, nValue, oValue) {
                if (stage == 2) {
                    if (Number(nValue.replace(',', '.')) >=0 ) {
                   // if (typeof nValue == "number") {
                        if ((FormulasGrid.cells(rId, 2).cell.textContent === "%") && (nValue.replace(',', '.') > 100) ) {
                            alert("Pourcentage trop grand.");
                            return false;

                        }
                        var v = ObjFormula.getVariable(rId);
                        if (v === null) {
                            return false;
                        }
                         v.setValue(Number(nValue.replace(',', '.')));
                        ObjFormula.calculate();
                        return true;
                        
                    }
                    alert("Valeur incorrecte.");
                    return false;
                }
                return true;
            });
        }
    }

    this.show_formula = function () { 
        var formula = this.formula;
        alert('formule :' + formula);
    }

    this.save = function () {
        var sFormula = JSON.stringify(ObjFormula);
        new J.ajax({
            url: sFileName_WebFormulas_ASP,
            async: false,
            cache: false,
            type: "post",
            dataType: "html",
            data: {
                event: "Save_Formula",
                ObjJSONFormula: sFormula
            },
            success: function (data) {
                var sResult = data.split("|");

                if (sResult[0] === 'ko') {
                    alert(sResult[1]);
                }
            },
            error: function (a, b, c) {
                alert(b);

            }
        });

    }
};

function TxVariable(aJson) {
    this.cell_id = aJson.cell_id;
    this.name = aJson.name;
    this.idAttribute = aJson.idAttribute;
    this.value = aJson.value;
    this.unit = aJson.unit;
    this.iAction = 0;

    this.setValue = function (Avalue) {
        this.iAction = 2;
        this.value = Avalue;
    }
}

