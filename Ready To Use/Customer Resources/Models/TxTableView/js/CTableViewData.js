"use strict";
/**
 * @class : Data for one cell in a TableView
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.tableView *** Mandatory ***
        aSettings.idRow *** Mandatory ***
        aSettings.idColumn *** Mandatory ***
        aSettings.sType *** Mandatory ***
        aSettings.sValue
 * @returns CTableViewData object.
 */

var CTableViewData = function (aSettings) {
    checkMandatorySettings(aSettings, ["tableView", "idRow", "idColumn", "sType"]);
    
    // privileged variables
    this.tableView = aSettings.tableView;
    this.dhxGrid = this.tableView.dhxGrid;
    this.idRow = aSettings.idRow;
    this.idColumn = aSettings.idColumn;
    this.sType = aSettings.sType;
    this.sOldValue;
    this.sNewValue;
    this.fValue; // float value for date and numeric
    this.bModified;
    this.bToDelete = false;
    this.iStage;
    this.bToRefresh = false;
    this.bEdited = false;
    this.idEvRS = null; // id event "onRowSelect" for calendar & text input edition
    this.dhxPopupInput;
    
    // init
	this.refreshDataFromAttributesCell(aSettings.sValue);
	this.bModified = false;
}

CTableViewData.prototype.refreshDataFromAttributesCell = function (aValue) {
    this.sOldValue = getValue(aValue, "");
    this.sNewValue = this.sOldValue;
    this.bToRefresh = false;
    // test : TO Remove
    var dhxCell = this.dhxGrid.cells(this.idRow, this.idColumn);
}

CTableViewData.prototype.edit = function (aValue) {
    var self = this;
    switch (this.sType) {
        case "customBool":
            var sValue = self.dhxGrid.cells(self.idRow, self.idColumn).getValue();
            self.sNewValue = sValue;
            self.tableView.afterEditCell(self);
            return true;
        case "customFile":
            msgWarning(_("L'édition d'un fichier n'est pas disponible."));
            return true;
        case "listAtt":
            msgWarning(_("L'édition d'une liste de Caractéristiques n'est pas disponible."));
            return true;
        case "readRight":
            msgWarning(_("Vous ne possèdez pas les droits pour éditer la cellule."));
            return true;
        default:
            return true;
    }
}