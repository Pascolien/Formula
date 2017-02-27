var sPathTxTableViewAjax = _url("/code/asp/TxTableView/TxTableViewAjax.asp");

// JavaScript Document
var bClick_On_Button = false;

function Table_OnCheck(AID_Table) {
    Table = eval("mygrid" + AID_Table);
    Table.attachEvent("onCheckbox", function (AID_Row, AID_Cell, AChecked) {
        J.ajax({
            url: _url('/code/asp/ajax/actions_grid.asp'),
            async: false,
            cache: false,
            dataType: 'script',
            data: {
                sFunctionName: "Table_OnCheck",
                ID_Table: AID_Table,
                sID_Object_Selected: AID_Row,
                bChecked: AChecked
            }
        });
    });
}

function Table_Check_All(AID_Table, AID_Table_Linear, AChecked) {
    bClick_On_Button = true;
    if (J("#table_tree_view").css("display") == "block")
        ID_Table = AID_Table;
    else
        ID_Table = AID_Table_Linear;

    Table = eval("mygrid" + ID_Table);
    ID_Row = Table.getSelectedRowId();
    J.ajax({
        url: _url('/code/asp/ajax/actions_grid.asp'),
        async: false,
        cache: false,
        dataType: 'script',
        data: {
            sFunctionName: "Table_Check_All",
            ID_Table: ID_Table,
            sID_Object_Selected: ID_Row,
            bChecked: AChecked
        }
    });
}

function Switch_View_Table(AID_Table, AID_Table_Linear) {
    obj_linear_grid = window['mygrid' + id_lineargrid];
    obj_tree_grid = window['mygrid' + id_treegrid];

    if (J("#table_tree_view").css("display") == "block") {
        //table view arbo
        obj_linear_grid.clearAll();
        J('#table_tree_view').css('display', 'none');
        J('#id_btn_arbo_view').css('display', 'none');
        J('#table_linear_view').css('display', 'block');
        J('#id_btn_linear_view').css('display', 'block');
        obj_linear_grid.loadXML(_url('/code/asp/ajax/load_xml_wto_table_linear.asp?id_wto=' + id_treegrid + '&id_linear_wto=' + id_lineargrid));
    } else {
        //table view linear
        J('#table_linear_view').css('display', 'none');
        J('#id_btn_linear_view').css('display', 'none');
        J('#table_tree_view').css('display', 'block');
        J('#id_btn_arbo_view').css('display', 'block');
    }
}

function OnClick_Out() {
    if (!bClick_On_Button) {
        obj_linear_grid = window['mygrid' + id_lineargrid];
        obj_tree_grid = window['mygrid' + id_treegrid];

        if (J("#table_tree_view").css("display") == "block") {
            obj_tree_grid.clearSelection();
        } else {
            obj_linear_grid.clearSelection();
        }
    }
    bClick_On_Button = false;
}

function Display_Object_From_Table_View(AID_Grid, ARow_Index) {
    ID_Object = Get_ID_Object_Grid(AID_Grid, ARow_Index);
    navigation(0, ID_Object, 'search', false);
}

function Get_ID_Object_Grid(AID_Grid, AsID_Object) {
    var ID_Object;
    J.ajax({
        url: _url('/code/asp/ajax/actions_grid.asp'),
        async: false,
        cache: false,
        dataType: 'script',
        data: {
            sFunctionName: "Get_Id_Object_Grid",
            ID_Grid: AID_Grid,
            sID_Object: AsID_Object
        },
        success: function (aResult) {
            ID_Object = aResult;
        }
    });
    return ID_Object;
}

