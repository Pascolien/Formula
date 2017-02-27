function CTxAbout(aSettings, aCallBack, aDummyData) {
    aSettings = getValue(aSettings, {});
    this.iMajor = getValue(aSettings.iMajor, iTxMajor);
    this.iMinor = getValue(aSettings.iMinor, iTxMinor);
    this.iRelease = getValue(aSettings.iRelease, iTxRelease);
    this.iRevision = getValue(aSettings.iRevision, iTxRevision);
    this.sDate = getValue(aSettings.sDate, sTxDate);

    var mainDiv = J("<div id='idDivMainTxAbout'></div>"),
        sHtml = '<div id="id_div_img"><img src="'+ _url("/resources/theme/img/about.jpg") +'" /></div>'+
	            '<center>'+
		            '<div id="id_div_about">'+
			            '<label id="idLabelTxVersion"></label><br>'+
                        'Copyright 2002-<span id="idSpanYear"></span> BASSETTI SARL<br>'+
                        '<a href="http://www.bassetti.fr" title="www.bassetti.fr" target="_blank" >www.bassetti.fr</a><br>'+
                        '<a href="mailto:support@bassetti.fr">support@bassetti.fr</a>'+
                    '</div>' +
                '</center>';

    mainDiv.append(sHtml);
    J(document.body).append(mainDiv);

    // init window
    var wdowAbout = new CWindow({
        sName: "wAbout",
        sHeader: _("A propos"),
        sIcon: 'temp_resources/theme/img/btn_titre/about-16.png',
        iWidth: 523,
        iHeight: 390,
        bDenyResize: true,
        bHidePark: true,
        sObjectAttached: 'idDivMainTxAbout'
    });

    //init fields
    J("#idLabelTxVersion").html(format("Version #1.#2.#3 (" + _("Révision") + " : #4, Date : #5)", [this.iMajor, this.iMinor, this.iRelease, this.iRevision, this.sDate]));
    J("#idSpanYear").html(new Date().getFullYear());
};
