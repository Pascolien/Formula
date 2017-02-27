//methods modified
CComboBox.prototype.reloadFromTxJSON = function (aOptions, aRealSelection) {
    displayDeprecatedMessage(getIntro("reloadFromTxJSON", "reloadFromTxObjects"));
    this.reloadFromTxObjects(aOptions, aRealSelection);
}

CGrid.prototype.reloadFromTxJSON = function (aRows, aFirstInit) {
    displayDeprecatedMessage(getIntro("reloadFromTxJSON", "reloadFromTxObjects"));
    this.reloadFromTxObjects(aRows, aFirstInit);
}

CTabbar.prototype.reloadFromTxJSON = function (aTabs) {
    displayDeprecatedMessage(getIntro("reloadFromTxJSON", "reloadFromTxObjects"));
    this.reloadFromTxObjects(aTabs);
}

CTree.prototype.reloadFromTxJSON = function (aNodes) {
    displayDeprecatedMessage(getIntro("reloadFromTxJSON", "reloadFromTxObjects"));
    this.reloadFromTxObjects(aNodes);
};