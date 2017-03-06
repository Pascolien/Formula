var sFileName_WebFormulas_ASP = "ajax.asp";
var FormulasGrid;

function parseJSON(aJSONString) {
    return eval("(" + aJSONString + ")");
};

function TxFormula(aSettings) {
    this.name = '';
    this.variables = [];
    this.formula = {};
    this.result = 0;
    this.unit = '';
    this.displaytype = 0;
    this.divname = '';
    this.loaded = false;
    this.iStoreMode = 0;

    this.read = function (aJson) {
        this.name = aJson.name;
        this.id_formula = aJson.id_formula;
        for (var i = 0; i < aJson.variables.length; i++) {
            var newvar = new TxVariable(aJson.variables[i]);
            this.variables.push(newvar);
        }
        this.formula = aJson.formula;
        this.unit = aJson.result.unit;

        this.displaytype = aSettings.sDisplay_Type;
        this.divname = aSettings.sDiv_Name;
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
    

    this.calculate = function () {

        this.result = 0;

        //parcours des valeurs de l'objet equivalent d'une boucle for

        var scope = this.variables.reduce(function (prev, cur) {
            prev[cur.name] = cur.value; return prev;
        }, {});

        this.result = math.eval(this.formula, scope);
        this.result = math.round(this.result, 2);

        if (this.displaytype == 0) {
            var res = document.getElementById('result');
            res.value = this.result;
        }
        else {
            var res = FormulasGrid.cells('result_row', 1);
            res.setValue(this.result);
        }
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
                ID_Object: aInput.ID_Object,
                ID_AS: aInput.ID_AS,
                ID_Att_Inifile: aInput.ID_Att_Inifile,
                iStoreMode: aInput.iStoreMode
            },
            success: function (data) {
                var sResult = StrToArray(data);

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

    this.display = function () {

        var display_div = document.getElementById(this.divname);
        if (display_div == null) {
            return;
        }

        var self = this;
        if (this.displaytype == 0) {
            //display as form
            remove(this.divname);
            this.variables.forEach(function (variable) {

                //display names          
                var div_var = document.createElement('div');
                div_var.setAttribute('class', 'div_cell');
                var legend_txt = document.createElement('label');
                legend_txt.innerHTML = variable.name + ' : ';
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

                //management of variables'change
                display_div.appendChild(div_var);
                input.addEventListener('change', function () {
                    if (this.value == "") {
                       alert("veuillez entrer une valeur");

                    } else if (variable.unit === '%') {

                        if (this.value > 100) {                           
                            variable.setValue(variable.value);
                            this.value = variable;
                             
                        } else {                           
                            variable.setValue(this.value);
                        }

                    }
                    // variable.setValue(this.value);
                    variable.setValue(this.value.replace(',', '.'));
                    self.calculate();

                })
                //end of variable management

            });

            //display result 
            var div_result = document.createElement('div');
            div_result.setAttribute('class', 'div_cell');
            var legend_txt = document.createElement('label')
            legend_txt.innerHTML = this.name + ' : ';
            div_result.appendChild(legend_txt);

            var input = document.createElement('input');
            input.setAttribute('class', 'input_result');
            input.setAttribute('type', 'text');
            input.setAttribute('id', 'result');
            input.setAttribute('name', this.name);
            input.setAttribute('size', '5');
            input.setAttribute('value', this.result);
            input.setAttribute('readonly', 'readonly');
            div_result.appendChild(input);


            //prevent display of null unit
            if (this.unit != null) {
                var Unit_txt = document.createTextNode(this.unit);
                div_result.appendChild(Unit_txt);
            }

            display_div.appendChild(div_result);



        } else {
            remove(this.divname);

            //Display as Grid                
            FormulasGrid = new dhtmlXGridObject(this.divname);
            FormulasGrid.setSkin("dhx_skyblue");           
            FormulasGrid.setHeader("Name,Value,Unit");
            FormulasGrid.setInitWidths("120,*,40");
            FormulasGrid.setColAlign("left,right,left");
            FormulasGrid.setColTypes("ro,ed,ro");
            FormulasGrid.init();

            this.variables.forEach(function (variable) {

                var cell_id = FormulasGrid.uid();
                variable.cell_id = cell_id;
                FormulasGrid.addRow(cell_id, ['Variable : ' + variable.name, variable.value, variable.unit]);
                FormulasGrid.cells(cell_id, 1).setTextColor('green');

            });

            FormulasGrid.addRow('result_row', ['Result : ' + this.name, this.result, this.unit]);
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
                            v.setValue(nValue.replace(',', '.'));
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
                var sResult = StrToArray(data);

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
    this.cell_id = 0;
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

