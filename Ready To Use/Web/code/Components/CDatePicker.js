/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @documentation refeference datepicker Jquery <a href="http://api.jqueryui.com/datepicker/">Doc</a>
 * @param 
        aSettings.sIdInputDate *** MANDATORY ***
        aSettings.sCodeLangue (default : "fr")
        aSettings.bTime : use datetimepicker (default : false)
        aSettings.sDateFormat (default : "dd/mm/yy")
        aSettings.setDateValue : fill field with date value, accept float, string and date format (if string must respect format date specified) (default : null)
        aSettings.bNoWeekends : display saturday and sunday on datepicker or not (default : false)
        aSettings.sButtonImage : specify the icon for calendar
        aSettings.sButtonText: specify the text tooltip of icon for calendar (default : _("calendrier")),
        aSettings.bButtonImageOnly : rendered by itself if true or inside a button element (default : true)
        aSettings.bChangeMonth : add combo box to change month
        aSettings.bChangeYear : add combo box to change year
        aSettings.defaultDate : set a default date to highlight if field is blank (refer to documentation for usage) (default : null)
        aSettings.sDuration : control the speed at wich the datepicker appears ["slow", "normal", "fast"] (default : "normal")
        aSettings.iFirstDay : set the first day of the week (default : 0 (=Sunday))
        aSettings.iWidth : datepicker size
        aSettings.bHideIfNoPrevNext : hide previous and next links (default : false)
        aSettings.fMaxDate : the maximum selectable date (refer to documentation for usage) (default : null)
        aSettings.fMinDate : the minimum selectable date (refer to documentation for usage) (default : null)
        aSettings.bGoToCurrent : moves current day to the current selected date (default : true)
        aSettings.onClose : function called when the datepicker is closed (parameters : String dateText, Object inst)
        aSettings.onSelect : function called when the datepicker is selected (parameters : String dateText, Object inst)
        aSettings.onChange : function called when value of input of datepicker change (default : empty function)
        aSettings.onClick : function called when input of datepicker is clicekd (default : function fill today date)
        aSettings.onCancel : function called when cancel button is clicked (if activated) (default : function empty field)
        aSettings.bShowButtonPanel : display two buttons "Today" and "Done" that closed datepicker (default : true)
        aSettings.sShowOn : defined when the datepicker should appear ["focus", "button", "both"]
        aSettings.bShowOtherMonths : display days of other months at the start and end of current month (not selectable) (default : false)
        aSettings.bSelectOtherMonths : if ShowOtherMonths is true allows to select days before and after current month (default : false)
        aSettings.bShowWeek : add a column to show the week of the year (default : false)
        aSettings.bReadOnly : boolean for readOnly mode (default : false)
        aSettings.bCancelButton : add or not a red cross to empty the input datepicker (default : false)
        /--- Next Parameters only avaliable for datetimepicker ---/
        aSettings.sTimeFormat (default : "HH:mm:ss")
        aSettings.sControlType : set type display for time ["slider", "select"] (default : "slider")
        aSettings.bOneLine : display select box on one line (default : true)
        aSettings.iStepHour : define the step between two values for hour (default : 1)
        aSettings.iStepMinute : define the step between two values for minute (default : 1)
        aSettings.iStepSecond : define the step between two values for second (default : 1)
 * @returns CDatePicker object.
 */

function CDatePicker(aSettings) {

    checkMandatorySettings(aSettings, ["sIdInputDate"]);
    var self = this;
    // init language
    J.timepicker.setDefaults(J.timepicker.regional[getValue(aSettings.sCodeLangue, _("fr"))]);
    // init datepicker
    this.inputDatepicker = J("#" + aSettings.sIdInputDate);
    this.fctOnCancel = aSettings.onCancel;
    this.fctOnChange = aSettings.onChange;
    this.bTimepicker = getValue(aSettings.bTime, false);
    this.bReadOnly = getValue(aSettings.bReadOnly, false);
    this.iWidth = aSettings.iWidth;
    // init datepicker options
    if (getValue(aSettings.bNoWeekends, false)) {
        this.inputDatepicker.datepicker({
            beforeShowDay: J.datepicker.noWeekends
        })
    }
    if (this.bTimepicker) {
        this.inputDatepicker.datetimepicker({
            dateFormat: getValue(aSettings.sDateFormat, 'dd/mm/yy'),
            timeFormat: getValue(aSettings.sTimeFormat, 'HH:mm:ss'),
            buttonImage: getValue(aSettings.sButtonImage, _url('/resources/theme/img/btn_form/calendrier.png')),
            buttonText: getValue(aSettings.sButtonText, _("Calendrier")),
            buttonImageOnly: getValue(aSettings.bButtonImageOnly, true),
            changeMonth: getValue(aSettings.bChangeMonth, true),
            changeYear: getValue(aSettings.bChangeYear, true),
            defaultDate: getValue(aSettings.defaultDate, null),
            duration: getValue(aSettings.sDuration, "normal"),
            firstDay: getValue(aSettings.iFirstDay, 1),
            hideIfNoPrevNext: getValue(aSettings.bHideIfNoPrevNext, false),
            maxDate: getValue(aSettings.fMaxDate, null),
            minDate: getValue(aSettings.fMinDate, null),
            goToCurrent: getValue(aSettings.bGoToCurrent, true),
            showButtonPanel: getValue(aSettings.bShowButtonPanel, true),
            showOn: getValue(aSettings.sShowOn, "both"),
            showOtherMonths: getValue(aSettings.bShowOtherMonths, false),
            selectOtherMonths: getValue(aSettings.bSelectOtherMonths, false),
            showWeek: getValue(aSettings.bShowWeek, false),
            controlType: getValue(aSettings.sControlType, "slider"),
            oneLine: getValue(aSettings.bOneLine, true),
            stepHour: getValue(aSettings.iStepHour, 1),
            stepMinute: getValue(aSettings.iStepMinute, 1),
            stepSecond: getValue(aSettings.iStepSecond, 1),
            yearRange: "1850:2150"
        });
    } else {
        this.inputDatepicker.datepicker({
            dateFormat: getValue(aSettings.sDateFormat, 'dd/mm/yy'),
            buttonImage: getValue(aSettings.sButtonImage, _url('/resources/theme/img/btn_form/calendrier.png')),
            buttonText: getValue(aSettings.sButtonText, _("Calendrier")),
            buttonImageOnly: getValue(aSettings.bButtonImageOnly, true),
            changeMonth: getValue(aSettings.bChangeMonth, true),
            changeYear: getValue(aSettings.bChangeYear, true),
            defaultDate: getValue(aSettings.defaultDate, null),
            duration: getValue(aSettings.sDuration, "normal"),
            firstDay: getValue(aSettings.iFirstDay, 1),
            hideIfNoPrevNext: getValue(aSettings.bHideIfNoPrevNext, false),
            maxDate: getValue(aSettings.fMaxDate, null),
            minDate: getValue(aSettings.fMinDate, null),
            goToCurrent: getValue(aSettings.bGoToCurrent, true),
            showButtonPanel: getValue(aSettings.bShowButtonPanel, true),
            showOn: getValue(aSettings.sShowOn, "both"),
            showOtherMonths: getValue(aSettings.bShowOtherMonths, false),
            selectOtherMonths: getValue(aSettings.bSelectOtherMonths, false),
            showWeek: getValue(aSettings.bShowWeek, false),
            yearRange: "1850:2150"
        });
    }
    // set value
    this.date = getValue(aSettings.setDateValue, null);
    this.fVal = getValue(aSettings.setDateValue, 0);
    if (this.date !== null) {
        if (typeof this.date == "number") {
            this.date = floatToDate(this.date);
        } else if (typeof this.date == "string") {
            this.date = strToDate(this.date, this.bTimepicker);
        }
        self.setDate(this.date);
    }
    // read only mode
    if (this.bReadOnly) {
        this.inputDatepicker.datepicker("option", "disabled", true);
    } else {
        // Manage events on datePicker
        if (aSettings.onClose) {
            this.inputDatepicker.datepicker({
                onClose: aSettings.onClose()
            })
        }
        if (aSettings.onSelect) {
            this.inputDatepicker.datepicker({
                onSelect: aSettings.onSelect()
            })
        }
        // Manage events on input
        this.inputDatepicker.change(function () { self.onChange(); return true; });
        this.inputDatepicker.keyup(function () { self.onChange(); return true; });
        var fctInputClick = getValue(aSettings.onClick, function () {
            if (isEmpty(self.inputDatepicker.val())) {
                id = "#" + aSettings.sIdInputDate;
                var inst = J.datepicker._getInst(J(id)[0]),
                    $dp = inst.dpDiv;
                J.datepicker._base_gotoToday(id);
                var tp_inst = J.datepicker._get(inst, 'timepicker');
                var now = new Date();
                J.datepicker._setTime(inst, now);
                J('.ui-datepicker-today', $dp).click();
                return false
            }
            return false;
        });
        this.inputDatepicker.click(fctInputClick);
        // cancel button
        if (getValue(aSettings.bCancelButton, false)) {
            this.idCancel = "cancel" + aSettings.sIdInputDate;
            J("#" + aSettings.sIdInputDate).next().after('<img id="' + this.idCancel + '" title="' + _("Supprimer la donnée") + '" class="clIcon" style="margin-left:6px;margin-top:-5px;" src="'+ _url("/resources/theme/img/btn_form/16x16_false.png") +'"/>');
            J("#" + this.idCancel).click(function () { self.onCancel(); });
            if (this.fVal > 0)
                J("#cancel" + aSettings.sIdInputDate).css("display", "inline");
            else
                J("#cancel" + aSettings.sIdInputDate).css("display", "none");
        }
    }

    if (isAssigned(this.iWidth))
        this.inputDatepicker.css("width", (this.iWidth)+"px");
}

// Removes the datepicker functionality completely
CDatePicker.prototype.destroy = function () {
    this.inputDatepicker.unbind('click');
    this.inputDatepicker.unbind('change');
    this.inputDatepicker.datepicker("destroy");
}

CDatePicker.prototype.onCancel = function () {
    this.inputDatepicker.val('');
    if (this.fctOnCancel)
        this.fctOnCancel();

    J("#" + this.idCancel).css("display", "none");
    return true;
}

CDatePicker.prototype.onChange = function () {
    
    var self = this,
        currentDate = this.getDate(),
        fDate = dateToFloat(currentDate, self.bTimepicker);

    if (fDate < 0) {
        fDate = null;
    } else if (fDate == 0) {
        this.onCancel();
        return;
    }

    if (this.fctOnChange) {
        this.fctOnChange(fDate);
    }

    J("#" + this.idCancel).css("display", "inline");
}

CDatePicker.prototype.lock = function (aLocked) {
    aLocked = getValue(aLocked, true);

    var self = this;

    this.inputDatepicker.datepicker("option", "disabled", aLocked);

    if (aLocked)
        J("#" + this.idCancel).unbind("click");
    else
        J("#" + this.idCancel).click(function () { self.onCancel(); });
}


// Returns the current date for the datepicker or null if no date has been selected
CDatePicker.prototype.getDate = function () {
    return this.inputDatepicker.datepicker("getDate");
}

// Close a previously opened date picker
CDatePicker.prototype.hide = function () {
    this.inputDatepicker.datepicker("hide");
}

// Determine whether a date picker has been disabled
CDatePicker.prototype.isDisabled = function () {
    return this.inputDatepicker.datepicker("isDisabled");
}

// Gets the value currently associated with the specified optionName
CDatePicker.prototype.getOptionValue = function (aOptionName) {
    return this.inputDatepicker.datepicker("option", aOptionName);
}

// Sets the value of the datepicker option associated with the specified optionName
CDatePicker.prototype.setOption = function (aOptionName, aValue) {
    this.inputDatepicker.datepicker("option", aOptionName, aValue);
}

// Sets one or more options for the datepicker with Object option-value pairs
CDatePicker.prototype.setOptions = function (aObjOptions) {
    this.inputDatepicker.datepicker("option", aObjOptions);
}

// Redraw the date picker, after having made some external modifications
CDatePicker.prototype.refresh = function () {
    this.inputDatepicker.datepicker("refresh");
}

// Sets the date for the datepicker. The new date may be a Date object or a string in the current date format
CDatePicker.prototype.setDate = function (aDate) {
    this.inputDatepicker.datepicker("setDate", aDate);
}

// Open the date picker. If the datepicker is attached to an input, the input must be visible for the datepicker to be shown
CDatePicker.prototype.show = function () {
    this.inputDatepicker.datepicker("show");
}

CDatePicker.prototype.hide = function () {
    this.inputDatepicker.datepicker("hide");
}
