var TreeObject, TreeAttribute;

/* to remove when tree class created*/

function ReloadTreeObject(ATreeName, AToolbarName, AJSON, AIDObjectChecked) {
    if (TreeObject == null) {
        TreeObject = new WebTreeObject(ATreeName, AToolbarName, false, AIDObjectChecked);
    }
    TreeObject.loadJSON(AJSON);
    TreeObject.handleEventOnCheck(TreeObject_OnCheck);
    //TreeObject.handleEventOnXLE(DoUpdateExportButton);
    DoUpdateExportButton();
}

function TreeObject_OnCheck() {
    DoUpdateExportButton();
}

function HandleCheckAll() {
    DoUpdateExportButton();
}

function DoUpdateExportButton() {
    sIdObjectChecked = TreeObject.getObjectChecked();
    if (sIdObjectChecked == "")
        J("#export").attr("disabled", "disabled");
    else
        J("#export").removeAttr("disabled");
}

function ReloadTreeAttribute(ATreeName, AToolbarName, AJSON) {
    if (TreeAttribute == null) {
        TreeAttribute = new WebTreeObject(ATreeName, AToolbarName, false, sNull);
        TreeAttribute.loadJSON(AJSON);
    } else
        TreeAttribute.loadJSON(AJSON);
}

function ChangeStateZipCheckbox(AChecked, ADisabled) {
    if (AChecked)
        J("#id_check_compressFile").prop("checked", true);
    else
        J("#id_check_compressFile").prop("checked", false);

    if (ADisabled)
        J("#id_check_compressFile").attr("disabled", "disabled");
    else
        J("#id_check_compressFile").removeAttr("disabled");
}