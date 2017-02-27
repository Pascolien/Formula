function displayDeprecatedMessage(aIntro, aCore) {
    msgWarning(qc(aIntro, getValue(aCore), "\n"));
}

function getIntro(aOld, aNew) {
    return format("The \"#1\" function has been removed, please use \"#2\" function", [aOld, aNew]);
}

function getIntroExt(aOld, aNew, aFilePath) {
    return qc(getIntro(aOld, aNew), format("of file \"#1\".", [aFilePath]));
}

function getIntroForParams(aOld, aParams) {
    return format("Function parameters \"#1\" have changed : (#2)", [aOld, getValue(aParams, []).join(',')]);
}

//methods modified
function Tree_Display_Node() {
    displayDeprecatedMessage(getIntroExt("Tree_Display_Node", "txASP.displayObject", "code/TxASP/CTxASP.js"));
}

function Form_Get_Content() {
    displayDeprecatedMessage(getIntroExt("Form_Get_Content", "txASP.refreshReadForm", "code/TxASP/CTxASP.js"));
}

function StrToArray(aString, aSeparator) {
    displayDeprecatedMessage(getIntro("StrToArray", "maVariableChaine.split('monSeparator');"));
    return aString.split(getValue(aSeparator, "|"));
}

function Ouvrir_Fichier() {
    displayDeprecatedMessage(getIntro("Ouvrir_Fichier", "openDataFileFile"));
}

