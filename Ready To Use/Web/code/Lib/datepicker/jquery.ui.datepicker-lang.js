/* French initialisation for the jQuery UI date picker plugin. */
/* Written by Keith Wood (kbwood{at}iinet.com.au),
			  Stéphane Nahmani (sholby@sholby.net),
			  Stéphane Raimbault <stephane.raimbault@gmail.com> */
jQuery(function ($) {
    var sSunday = _("Dimanche"),
        sMonday = _("Lundi"),
        sTuesday = _("Mardi"),
        sWednesday = _("Mercredi"),
        sThursday = _("Jeudi"),
        sFriday = _("Vendredi"),
        sSaturday = _("Samedi"),
        sJanuary = _("Janvier"),
        sFebruary = _("Février"),
        sMarch = _("Mars"),
        sApril = _("Avril"),
        sMay = _("Mai"),
        sJune = _("Juin"),
        sJuly = _("Juillet"),
        sAugust = _("Août"),
        sSeptember = _("Septembre"),
        sOctober = _("Octobre"),
        sNovember = _("Novembre"),
        sDecember = _("Décembre");        
	$.datepicker.regional[_("fr").toLowerCase()] = {
	    closeText: _("Valider"),
		prevText: _("Précédent"),
		nextText: _("Suivant"),
		currentText: _("Aujourd'hui"),
		monthNames: [ sJanuary, sFebruary, sMarch, sApril, sMay, sJune,	sJuly, sAugust, sSeptember, sOctober, sNovember, sDecember],
		monthNamesShort: [
            //sJanuary.substring(0, 3) + (sJanuary.length > 4 ? "." : ""),
            sJanuary,
            sFebruary,
            sMarch,
            sApril,
            sMay,
            sJune,
            sJuly,
            sAugust,
            sSeptember,
            sOctober,
            sNovember,
            sDecember
		],
		dayNames: [sSunday, sMonday, sTuesday, sWednesday, sThursday, sFriday, sSaturday],
		dayNamesShort: [
            sSunday.substring(0, 2) + ".",
            sMonday.substring(0, 2) + ".",
            sTuesday.substring(0, 2) + ".",
            sWednesday.substring(0, 2) + ".",
            sThursday.substring(0, 2) + ".",
            sFriday.substring(0, 2) + ".",
            sSaturday.substring(0, 2) + "."
		],
		dayNamesMin: [
            sSunday.substring(0, 1),
            sMonday.substring(0, 1),
            sTuesday.substring(0, 1),
            sWednesday.substring(0, 1),
            sThursday.substring(0, 1),
            sFriday.substring(0, 1),
            sSaturday.substring(0, 1)
		],
		weekHeader: _("Sem."),
		dateFormat: 'dd/mm/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional[_("fr").toLowerCase()]);
});
