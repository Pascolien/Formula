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
var result1;

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
    this.iDisplay_Format = aSettings.iDisplay_Format;
    this.sDiv_Formula = aSettings.sDiv_Formula;
    this.iStore_Mode = aSettings.iStore_Mode;
    this.iEdit_Rights = aSettings.iEdit_Rights;
    this.sTag_Formula = aSettings.sTag_Formula;

    this.read = function (aJson) {
        this.name = aJson.name;
        this.ID_Formula = aJson.ID_Formula;

        for (var i = 0; i < aJson.variables.length; i++) {
            var newvar = new TxVariable(aJson.variables[i]);
            newvar.cell_id = i + 1;
            this.variables.push(newvar);
        };

        this.formula = aJson.formula;

        this.result.value = aJson.result.value;
        this.result.unit = aJson.result.unit;
    }


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
            divShowFormula.innerText = this.formula;
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
            dhtmlx.alert("no div defined for element display");
            return false;
        }

        remove(divFormula);
        if (this.iEdit_Rights > 0) {
            divToolbar = document.createElement("div")
            divToolbar.setAttribute("id", sDivToolbarId);
            divToolbar.setAttribute("class", "clToolbar");
            divFormula.appendChild(divToolbar);
        }

        divShowFormula = document.createElement("div");
        divShowFormula.setAttribute("id", sDivShowFormula);
        divShowFormula.setAttribute("class", "clShowFormula");
        divShowFormula.setAttribute("style", "display: none !important;");
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
        if (this.iEdit_Rights == 0) return

        var formulaToolbar = new dhtmlXToolbarObject(divToolbar);
        formulaToolbar.setIconsPath("/Resources/theme/img/");

        if (this.iEdit_Rights > 1) {
            var EditOptions = [['AddVariable', 'obj', 'Edit/Add Variable'],
                               ['DelVariable', 'obj', 'Edit/Del Variable'],   //Ajout Suppression
                                ['editFormula', 'obj', 'Edit Formula'],
                                ['EditResult', 'obj', 'Convert Unit'] //
            ];

            formulaToolbar.addButtonSelect("edit", 10, "Edit", EditOptions, 'iconsToolbar/edit.png');
        };

        var displayOptions = [['displayForm', 'obj', 'As Form'],
                                ['displayGrid', 'obj', 'As Grid'],
                                ['showFormula', 'obj', 'Show/Hide formula']
        ];
          
        var ChartOptions = [['lineChart', 'obj', 'LineChart'],
                            ['barChart', 'obj', 'bar'],
                            ['pieChart','obj','pie']
        ];

        formulaToolbar.addButtonSelect("display", 20, "Display", displayOptions, 'btn_titre/module_export.png');

        formulaToolbar.addButton('save', 30, 'Save', 'btn_form/save_html_editor.png');

        formulaToolbar.addButton("compare", 40, "Compare",'iconsToolbar/check.png');

        formulaToolbar.addButtonSelect("chart",50,"Charts",ChartOptions,'btn_titre/TxCharts.png'); // charts

        formulaToolbar.addButton('exit', 60, 'Exit', 'btn_titre/exit.png');

        formulaToolbar.attachEvent("onClick", function (id) {


            switch (id) {

                case "AddVariable":                  
                   editVariable();
                    break;

                case "DelVariable":
                    deleteVariable();
                    break;

                case "EditResult":
                    convertResult();
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

                case "compare":
                    compare();
                    break;
                
                case "chart":
                   ObjFormula.variables.forEach(function (variable) {
                        if (variable.name == "x") {
                            dataChart(variable.value);
                        }

                    });
                    
                    charts();
                    viewChart(0);
                    break;
                case "lineChart":
                   
                    charts();
                    viewChart(1);                   
                    break;

                case "barChart":
                                      
                    charts();
                    viewChart(2);
                    break;

                case "pieChart":
                    
                    charts();
                    viewChart(3);
                    break;

                case "exit":
                    Close_Popup();
                    break;
            }
        });
    }

    this.load = function (aInput) {
        var self = this;
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
                    self.read(json);
                    self.loaded = true;
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
        this.calculateseToolbar
    }

    this.getVariableFromName = function (aNameseToolbar) {
        for (var i = 0; i < this.variables.length; i++) {
            if (this.variables[i].name == aName) {
                return this.variables[i];
            }
        }
        return null;
    }

    this.display = function () {

             parent.dhxWins.wins['txFormula_simple'].addEventListener("resize", function () {
                 var h = parent.dhxWins.wins['txFormula_simple'].h - (divToolbar.clientHeight + divShowFormula.clientHeight)
                 divDisplay.h = h;
               //  debugger;
              });
       

        var self = this;
        remove(divDisplay);
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
                input.setAttribute('required', 'required');
                input.setAttribute('size', '15');
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
                    var sValue = this.value;//.replace(',', '.');

                    if (sValue == "") {
                        dhtmlx.alert(("Please enter a value"));
                        return false
                    }
                    if (isNaN(sValue)) {
                       // debugger;
                        //check if svalue is an array
                        var a = JSON.parse("[" + sValue + "]");
                        debugger;
                        var nValue = a;
                        var fValue = math.matrix(nValue);
                        if (Array.isArray(a)) {
                           
                           // for (var i = 0; i < a.length; i++) { nValue += Number(a[i]); }
                           
                            //alert(a.length);
                            //var fValue = math.divide(nValue, a.length);
                           
                        } else {
                            dhtmlx.alert(("Please enter a numerical value"));
                            return false;
                        }
                        
                                           
                       
                    } else {
                        var fValue = Number(sValue);
                    }

                    this.value = fValue;
                    variable.setValue(fValue);
                    result1 = ObjFormula.result.value;
                    self.calculate();

                })
            });

            //display result 
            var div_result = document.createElement('div');
            div_result.setAttribute('class', 'div_cell');
            var legend_txt = document.createElement('label')
            //legend_txt.innerHTML = this.name.replace(/_/g, ' ') + ' : ';
            legend_txt.innerHTML = 'Result : ';
            div_result.appendChild(legend_txt);

            var input = document.createElement('input');
            input.setAttribute('class', 'input_result');
            input.setAttribute('type', 'text');
            input.setAttribute('id', 'result');
            input.setAttribute('name', this.name);
            input.setAttribute('size', '15');
            input.setAttribute('value', this.result.value);
            input.setAttribute('readonly', 'readonly');
            input.addEventListener('click', function () {
                selectedresult = this.result.value;
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

            //ajout Menu

            //FormulasGrid.attachMenu()
            var FGContextMenu = new dhtmlXMenuObject();
            FGContextMenu.setIconsPath("/Resources/theme/img/");
            FGContextMenu.renderAsContextMenu();

            FGContextMenu.addNewChild(FGContextMenu.TopId, 0, 'deleteRow', 'Delete Row', false, 'iconsToolbar/delete.png', 'iconsToolbar/deleteDisabled');
            FGContextMenu.setTooltip("DeleteRow", "Delete the selected line.");

            FGContextMenu.addNewChild(FGContextMenu.TopId, 1, 'editRow', 'Edit Row', false, 'iconsToolbar/edit.png', 'iconsToolbar/editDisabled');
            FGContextMenu.setTooltip("EditRow", "Edit a line.");


            FGContextMenu.attachEvent("onclick", onButtonclick);

            //Fin Ajout

            //initializing a grid
            FormulasGrid = new dhtmlXGridObject(sDivDisplayId);
            FormulasGrid.setSkin("dhx_skyblue");
            FormulasGrid.setHeader("Name,Value,Unit");
            FormulasGrid.setInitWidths("*,200,60");
            FormulasGrid.setColAlign("left,right,left");
            FormulasGrid.setColTypes("ro,edn,ro");
            FormulasGrid.enableDragAndDrop(true);
            FormulasGrid.enableResizing("false,false,false");
            FormulasGrid.enableContextMenu(FGContextMenu);
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
                    var v = self.getVariable(rId);
                    if (Number(nValue.replace(',', '.')) >= 0) {
                        // if (typeof nValue == "number") {
                        if ((FormulasGrid.cells(rId, 2).cell.textContent === "%") && (nValue.replace(',', '.') > 100)) {
                            dhtmlx.alert("Pourcentage trop grand.");
                            return false;

                        }
                        //var v = self.getVariable(rId);
                        if (v === null) {
                            return false;
                        }
                        v.setValue(Number(nValue.replace(',', '.')));
                        self.calculate();
                        return true;

                    }
                    var a = JSON.parse("[" + nValue + "]");
                   // debugger;
                     if (Array.isArray(a)) {
                         var sValue = 0;
                         for (var i = 0; i < a.length; i++) { sValue += Number(a[i]); }
                        // alert(a.length);
                         var fValue = math.divide(sValue, a.length);

                         v.setValue(Number(nValue));
                         alert(Math.cos(0));
                         self.calculate();
                         return true;

                     } else {
                         dhtmlx.alert("Valeur incorrecte.");
                         return false;
                     }

                }
                return true;
            });

            FormulasGrid.attachEvent("onDrop", function (sId, tId, dId, sObj, tObj, sCol, tCol) {
                self.renumVarIds();
            });

            FormulasGrid.attachEvent("onMouseout", function (id) {
                self.calculate();
            });

            FormulasGrid.attachEvent("onRowSelect", function (id, ind) {
                selectedVariable = self.getVariable(id);
            });

            function onButtonclick(id, zoneId, cas) {
                switch (id) {
                    case "deleteRow":
                        deleteVariable();
                        break;

                    case "editRow":
                        editVariable();
                        break;
                }
            };
        }
    }

    this.save = function () {
        var self = this;
        var sFormula = JSON.stringify(self);

        if (this.iStore_Mode == 2)
            return sFormula;

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
    //test
    

    //fin test

    function randValue() {
        return Math.floor(Math.random() * nMax) + 1;
    }

    function dejaPresent(Value) {
        var Element, Valeur;
        for (var i = MinVlaue; i <= MaxValue; i++) {


            // Si il existe
            if (Element) {
                // On r�cup�re son contenu
                Valeur = parseInt(Element.innerHTML);
                // Si c'est un nombre, et que ce nombre est �gal � notre nombre de reference...
                if (!isNaN(Valeur) && Valeur == NValue) {
                    return true;
                }
            }
        }
        return false;
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

