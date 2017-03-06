var wFDV;
var lFDV;

function deleteVariableWindow(aVariable) {
    if (aVariable == undefined) aVariable = new TxVariable('{"cell_id": -1, "name": "Variable Name", "value": 0, "unit": "tbd"}');

    if (!dhxWins) {
        dhxWins = new dhtmlXWindows("dhx_blue");
        dhxWins.setImagePath('../../../resources/theme/img/dhtmlx/windows/');
    }

    wFDV = dhxWins.createWindow("editVariable", 10, 10, 250, 300);
    wFDV.setText("Delete Variable");
    wFDV.center();
    wFDV.denyPark();
    wFDV.button("close").hide();
    wFDV.denyResize();
    wFDV.setIcon("windowIcon");

    lFDV = wFDV.attachLayout("2E");
    lFDV.setAutoSize("", "a");

    var a = lFDV.cells('a');
    a.hideHeader();

    /* Data */
    /** Big div **/
    var bigdiv = document.createElement("div");
    bigdiv.setAttribute('style', 'width: 100%; height: 100%;  background: #e7f2ff;');
    a.attachObject(bigdiv);

    /*** Div variable Name ***/
    var divVariableName = document.createElement("div");
    divVariableName.setAttribute("id", "divVariableName");
    divVariableName.setAttribute("class", 'editdiv');

    /**** Caption for Name ****/
    var sNameVariableName = document.createTextNode('Variable Name :');
    divVariableName.appendChild(sNameVariableName);

    /**** Input for Name ****/
    var inputName = document.createElement('input');
    inputName.setAttribute('id', 'efVariableName')
    inputName.setAttribute('class', 'editinput');
    inputName.value = aVariable.name;

    divVariableName.appendChild(inputName);

    bigdiv.appendChild(divVariableName);

    /*** Div variable Value ***/
    var divVariableValue = document.createElement("div");
    divVariableValue.setAttribute("id", "divVariableValue");
    divVariableValue.setAttribute("class", 'editdiv');

    /**** Caption for Value ****/
    var sNameVariableValue = document.createTextNode('Variable Value :');
    divVariableValue.appendChild(sNameVariableValue);

    /**** Input for Value ****/
    var inputValue = document.createElement('input');
    inputValue.setAttribute('id', 'efVariableValue')
    inputValue.setAttribute('class', 'editinput');
    inputValue.value = aVariable.value;
    divVariableValue.appendChild(inputValue);

    bigdiv.appendChild(divVariableValue);

    /*** Div variable Unit ***/
    var divVariableUnit = document.createElement("div");
    divVariableUnit.setAttribute("id", "divVariableUnit");
    divVariableUnit.setAttribute("class", 'editdiv');

    /**** Caption for Value ****/
    var sNameVariableUnit = document.createTextNode('Variable Unit :');
    divVariableUnit.appendChild(sNameVariableUnit);

    /**** Input for Value ****/
    var inputUnit = document.createElement('input');
    inputUnit.setAttribute('id', 'efVariableUnit')
    inputUnit.setAttribute('class', 'editinput');
    if (aVariable.unit) inputUnit.value = aVariable.unit;
    divVariableUnit.appendChild(inputUnit);

    bigdiv.appendChild(divVariableUnit);

    a.attachObject(bigdiv);

    /** ToolBar in Layout B **/
    var b = lFDV.cells('b');
    b.hideHeader();
    b.setHeight(38);
    b.fixSize(1, 1);

    var divtoolbar = document.createElement('div');
    divtoolbar.setAttribute('id', 'divEditVarToolbar');
    divtoolbar.setAttribute('style', 'margin-top: 2px; height: 30px; overflow: hidden; margin-left:0px; padding-right:6px;')
    b.attachObject(divtoolbar);

    var editformtoolbar = new dhtmlXToolbarObject('divEditVarToolbar');
    editformtoolbar.setIconsPath("/Resources/theme/img/");
    editformtoolbar.setAlign("right");

    /*--Buttons--*/
    editformtoolbar.addButton('delete', 0, 'delete', 'btn_form/16x16_true.png');
    editformtoolbar.addButton('cancel', 1, 'Cancel', 'btn_form/16x16_false.png');

    editformtoolbar.attachEvent("onClick", function (id) {

        switch (id) {
            case "delete":   
                 
                dhxWins.window("editVariable").close();
                break;

            default:
                dhxWins.window("editVariable").close();
        }

    });

}