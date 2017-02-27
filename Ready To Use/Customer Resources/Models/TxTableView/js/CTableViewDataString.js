"use strict";
/**
 * @class : String Data for one cell in a TableView -> inherits from CTableViewData
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.dhxGrid *** Mandatory ***
        aSettings.idRow *** Mandatory ***
        aSettings.idColumn *** Mandatory ***
        aSettings.sType *** Mandatory ***
        aSettings.sValue
 * @returns CTableViewDataString object.
 */

var CTableViewDataString = function (aSettings) {
    CTableViewData.call(this, aSettings);
}

//inheritage
CTableViewDataString.prototype = createObject(CTableViewData.prototype);
CTableViewDataString.prototype.constructor = CTableViewDataString; // Otherwise instances of CTableViewDataString would have a constructor of CTableViewData

CTableViewDataString.prototype.edit = function () {
    var self = this;
	this.rCell = this.dhxGrid.cells(this.idRow, this.idColumn);
	this.sValue = this.rCell.getValue();
	this.idInput = "input_custom_" + this.idRow + "_" + this.idColumn;

    // Init edition
	this.rCell.setValue("<input id=" + this.idInput + " type='text' style='width:97%;'>");
    J("#" + this.idInput).val(this.sValue);
    J("#" + this.idInput).focus();
	
	var input = document.getElementById(this.idInput);
	// Get position of input
	this.xInput = getAbsoluteLeft(input);
	this.yInput = getAbsoluteTop(input);
	this.wInput = input.offsetWidth;
	this.hInput = input.offsetHeight;

    this.dhxPopupInput = new dhtmlXPopup({ mode: "right" });

    // Event for Enter Key press
    J("#" + this.idInput).keyup(function (e) {
        var code = e.keyCode || e.which;
        if (code == 13) { //Enter keycode
            if (self.stopEditString()) {
                self.dhxGrid.detachEvent(self.idEvRS);
                self.idEvRS = null;
				
				// This is a bug fix for IE and edition in fixed column (button is no more accessible after validate edition)
				// The only solution found is to simulate another edition of cell and close it normaly (not by enter key)
				setTimeout(function() {
					var tableViewData = self.tableView.getTableViewData(self.idRow, self.idColumn);
					if (tableViewData.bEdited)
						return;
					// set Stage for data edition
					tableViewData.iStage = 1;
					tableViewData.edit();
					if (tableViewData.stopEditString()) {
						self.dhxGrid.detachEvent(tableViewData.idEvRS);
						tableViewData.idEvRS = null;
					}
				}, 200);
            }
        }
		return true;
    });
    
    // Attach event to stop edition
    this.idEvRS = this.dhxGrid.attachEvent("onBeforeSelect", function (aIdRow, aIdOldRow) {
        if (!this.cell) return true;
		// close edition if click outside of cell
        if (aIdRow != self.idRow || this.cell._cellIndex != self.idColumn) {
            if (self.stopEditString()) {
                self.dhxGrid.detachEvent(self.idEvRS);
                self.idEvRS = null;
            }
        }
        return true;
    });

    this.bEdited = true;
}

CTableViewDataString.prototype.stopEditString = function () {
	var sNewValue = this.rCell.cell.childNodes[0].value;
	var reg_mail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}[.][a-zA-Z0-9]{2,4}$/;
	var reg_url = /^((?:(?:https?|ftp):\/\/)|www\.)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

	// AND if length of text is less than 255 (property of Teexma String data)
	if (((this.sType == "customString") && (sNewValue.length <= 255)) ||
			((sNewValue != '') && (this.sType == "customEmail") && (reg_mail.exec(sNewValue) != null)) ||
			((sNewValue != '') && (this.sType == "customURL")) ||
			(sNewValue == '')) {
		
		this.dhxPopupInput.hide();

		this.rCell.setValue(sNewValue);
		if (this.sValue != sNewValue) {
			this.sNewValue = sNewValue;
			this.tableView.afterEditCell(this);
		}
		this.bEdited = false;
		this.iStage = 2;
		return true;
	} else {
		var sMsg = '';
		switch (this.sType) {
			case "customString":
				sMsg = _("Texte trop long, il ne doit pas excéder 250 caractères.");
				break;
			case "customURL":
				sMsg = _("URL invalide.");
				break;
			case "customEmail":
				sMsg = _("Email invalide.");
				break;
		}
		this.dhxPopupInput.attachHTML("<span class='textError'>" + sMsg + "</span>");
		this.dhxPopupInput.show(this.xInput, this.yInput, this.wInput, this.hInput);
		J("#" + this.idInput).focus();
		return false;
	}
}