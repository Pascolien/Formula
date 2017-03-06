var wFC;
var lFC;
var sDivChart = "FormulaChart";
//var data = dataChart();

function displayChartWindow() {
    //if (aVariable == undefined) aVariable = new TxVariable({ "cell_id": -1, "name": "New Variable", "value": 0, "unit": "tbd" });

   if (!dhxWins) {
        dhxWins = new dhtmlXWindows("dhx_blue");
        dhxWins.setImagePath('../../../resources/theme/img/dhtmlx/windows/');
    }

    wFC = dhxWins.createWindow("FormulaChart", 10, 10, 350, 400);
    wFC.setText("Chart");
    wFC.center();
    wFC.denyPark();
    wFC.button("close");
    wFC.denyResize();
    wFC.setIcon("windowIcon");

    lFC = wFC.attachLayout("2E");
    lFC.setAutoSize("", "a");

    var a = lFC.cells('a');
    a.hideHeader();

    var bigdiv = document.createElement("div");
    bigdiv.setAttribute('style', 'width: 100%; height: 100%;  background: #e7f2ff;');
    // bigdiv.setAttribute('form');
    a.attachObject(bigdiv);

    /*** Div FormulaChart Name ***/
    var divFormulaChartName = document.createElement("div");
    divFormulaChartName.setAttribute("id", sDivChart);
    divFormulaChartName.setAttribute("class", "FormulaChart");
    divFormulaChartName.setAttribute("style", "width:100%;height:250px;border:1px solid #A4BED4;");

    bigdiv.appendChild(divFormulaChartName);
    /**
    var divGrid = document.createElement("div");
    divGrid.setAttribute("class", "FormulaChart");

    var ChartGrid = new dhtmlXGridObject('chart data');
    ChartGrid.setSkin("dhx_skyblue");
    ChartGrid.setColAlign("right,left,left");
    ChartGrid.setColTypes("ro,ro,ro");
    ChartGrid.setColSorting("int,int,int");
    chartGrid.init();
    ChartGrid.load(data, "array");

    divGrid.appendChild(ChartGrid);
    bigdiv.appendChild(divGrid);*/
 

    var b = lFC.cells('b');
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
    editformtoolbar.addButton('save', 0, 'Ok', 'btn_form/16x16_true.png');
    editformtoolbar.addButton('cancel', 1, 'Cancel', 'btn_form/16x16_false.png');

    editformtoolbar.attachEvent("onClick", function (id) {

        switch (id) {
            case "save":

                dhxWins.window("FormulaChart").close();
                break;
            default:
                dhxWins.window("FormulaChart").close();
        }

    });
}
function viewChart(i) {
    switch (i) {

        case 1:
            var LineChart = new dhtmlXChart({
                view: "line",
                container: sDivChart,
                value: "#y#",
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
                    title: "Y",
                    //   template: "#y#"
                }
            });
            LineChart.parse(data, "json");
            break;
        case 2:
            var barChart = new dhtmlXChart({
                view: "bar",
                container: sDivChart,
                value: "#y#",
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
                    title: "Y",
                    //   template: "#y#"
                }
            });
            barChart.parse(data, "json");
            break;
        case 3:
            var pieChart = new dhtmlXChart({
                view: "pie",
                container: sDivChart,
                value: "#y#",
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
                    title: "Y",
                    //   template: "#y#"
                }
            });
            debugger;
            pieChart.parse(data, "json");
            break;
        default:
            var AreaChart = new dhtmlXChart({
                view: "area",
                container: sDivChart,
                value: "#y#",
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
                    title: "Y",
                 //   template: "#y#"
                }
            });
            debugger;
           // console.log(JSON.stringify(data));
            AreaChart.parse(data, "json");

    }
}