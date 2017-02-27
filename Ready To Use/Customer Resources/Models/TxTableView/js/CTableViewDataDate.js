"use strict";
/**
 * @class : Date Data for one cell in a TableView -> inherits from CTableViewData
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.dhxGrid *** Mandatory ***
        aSettings.idRow *** Mandatory ***
        aSettings.idColumn *** Mandatory ***
        aSettings.sType *** Mandatory ***
        aSettings.sValue
 * @returns CTableViewDataDate object.
 */

var CTableViewDataDate = function (aSettings) {
    this.editedDatepicker;

    CTableViewData.call(this, aSettings);
}

//inheritage
CTableViewDataDate.prototype = createObject(CTableViewData.prototype);
CTableViewDataDate.prototype.constructor = CTableViewDataDate; // Otherwise instances of CTableViewDataDate would have a constructor of CTableViewData

CTableViewDataDate.prototype.edit = function () {
    var self = this,
        rFilter = this.tableView.getFilter(this.idColumn),
        rCell = this.dhxGrid.cells(this.idRow, this.idColumn),
        idInput = "input_calendar_" + this.idRow + "_" + this.idColumn,
        value = rCell.getValue();

    // Callaback function to init calendar
    var doInitCalendar = function () {
        rCell.setValue("<input id=" + idInput + " type='text' style='width:100%;' value=" + value + ">");
        var calendarSetting = {
            sIdInputDate: idInput,
            sCodeLangue: rFilter.sLangDate,
            bTime: rFilter.bIsDateTime,
            bShowOtherMonths: true,
            bSelectOtherMonths: true,
            bShowButtonPanel: true,
            bChangeMonth: true,
            bChangeYear: true,
            sShowOn: 'focus',
            bGotoCurrent: true
        }
        var sDateFormat, sDateTimeFormat;
        if (rFilter.sDateAndTimeFormat) {
            calendarSetting.sDateFormat = rFilter.sDateAndTimeFormat.substring(0, 8);
            calendarSetting.sTimeFormat = rFilter.sDateAndTimeFormat.substring(9, 17);
        } else if (rFilter.sDateFormat) {
            calendarSetting.sDateFormat = rFilter.sDateFormat;
        }

        self.editedDatepicker = new CDatePicker(calendarSetting);

        if (value != "") {
            self.editedDatepicker.setDate(strToDate(value, rFilter.bIsDateTime));
        }
        rCell.cell.childNodes[0].focus();
    }

    // Initialize calendar
    if (!rFilter.bInitialized) {
        rFilter.loadFilter(doInitCalendar);
    } else {
        doInitCalendar();
    }
    
    // Attach event to hide calendar and stop edition
    this.idEvRS = this.dhxGrid.attachEvent("onBeforeSelect", function (aIdRow, aIdOldRow) {
        if ((aIdRow != self.idRow || this.cell._cellIndex != self.idColumn) && self.idEvRS != null) {
            // click outside the cell : close edition
            var sNewValue = rCell.cell.childNodes[0].value;
            if (typeof sNewValue != 'undefined') {
                var fValue = dateToFloat(self.editedDatepicker.getDate(), rFilter.bIsDateTime);
                rCell.setValue(sNewValue);
            }
            if ((value != sNewValue) && (typeof sNewValue != 'undefined') && (self.iStage == 1)) {
                self.fValue = fValue;
                self.sNewValue = sNewValue;
                self.tableView.afterEditCell(self);
                self.iStage = 2;
            }
            self.dhxGrid.detachEvent(self.idEvRS);
            self.idEvRS = null;
        }
        return true;
    });
}