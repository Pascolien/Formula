/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param
        aSetting = {
             sIdDiv : the div id of the container of the banner,
             object : the object concerns by the banner,
             idTab : the tab id permit to focus a tab with copyToClipboard function,
             sTitle : the title displayed in the middle of the banner, by default it's the name of object.sName,
             bCopyToClipboard : display the button copy to clipboard,
             bDisplayObjectPath : display the parents objects names,
             onBtnLeftClicked : the function called when the left button is clicked,
             onBtnRightClicked : the function called when the rigth button is clicked
        }

 * @returns CTxBanner object.
 */

var CTxBanner = function (aSettings) {
    this.id = getUniqueId();
    this.object = getValue(aSettings.object, {});
    this.idTab = getValue(aSettings.idTab, 0);
    this.sIdDiv = aSettings.sIdDiv;
    this.iHeight = getValue(aSettings.iHeight, 46);
    this.onBtnLeftClicked = aSettings.onBtnLeftClicked;
    this.onBtnRightClicked = aSettings.onBtnRightClicked;
    this.bCopyToClipboard = getValue(aSettings.bCopyToClipboard, false);
    this.bDisplayObjectPath = getValue(aSettings.bDisplayObjectPath, false);
    this.sTitle = getValue(aSettings.sTitle, getValue(this.object.sName));
    this.sIdDivTitle = "idDivBannerMiddle" + this.id;
    this.sUrl = sTxUrl;
    
    var self = this,
        sBtnLeftBanner = "",
        sBtnRightBanner = "",
        sBtnCopyToClipboard = "";

    if (this.onBtnLeftClicked)
        sBtnLeftBanner =
            '<a href="#" id="idACollapseNav' + this.id + '">' +
                '<img src="' + _url("/Resources/theme/img/btn_content/collapse_nav.gif") + '" id="idImgCollapseNav' + this.id + '" title="' + _("Cacher le panneau de Navigation") + '" />' +
            '</a>';

    if (this.onBtnRightClicked)
        sBtnRightBanner =
            '<a href="#" id="idACollapseBanner' + this.id + '">' +
                '<img src="' + _url("/Resources/theme/img/btn_content/collapse_header.gif") + '" id="idImgCollapseBanner' + this.id + '" title="' + _("Cacher le bandeau de l'Entité") + '" />' +
            '</a>';

    if (this.bCopyToClipboard)
        sBtnCopyToClipboard =    
            '<a href="#" id="idACopyToClipboard' + this.id + '">' +
                '<img src="' + _url("/Resources/theme/img/btn_form/link.png") + '" id="idImgCopyToClipboard' + this.id + '" title="' + _("Copier l'url vers cette Entité dans le presse papier") + '" />' +
            '</a>';

    var sHtml =
        '<div id="idDivBannerContent' + this.id + '">' +
            '<div id="idDivBannerLeft' + this.id + '">' +
                sBtnLeftBanner +
            '</div>' +
            '<div id="' + this.sIdDivTitle + '"></div>' +
            '<div id="idDivBannerRight' + this.id + '">' +
                sBtnCopyToClipboard +
                sBtnRightBanner +
            '</div>' +
        '</div>';

    J("#" + this.sIdDiv).append(sHtml);
    this.updateTitle(this.sTitle);

    //javascript instructions
    J("#idACollapseNav" + this.id).click(this.onBtnLeftClicked);
    J("#idACollapseBanner" + this.id).click(this.onBtnRightClicked);
    J("#idACopyToClipboard" + this.id).click(function () { self.copyToClipboard(); });

    //css instructions
    J("#idDivBannerContent" + this.id).css({
        "position":"absolute",
        "line-height":this.iHeight+"px",
        "height":this.iHeight+"px",
        "font-weight" : "bold",
        "top":"0px",
        "right":"0px",
        "left":"0px",
        "background": "url('" + _url("/temp_resources/theme/img/Default.jpg") + "') no-repeat",
        "border" : "#A4BED4 1px solid"
    });

    J("#idDivBannerLeft" + this.id).css({
        "position":"absolute",
        "z-index": "30",
        "width":"auto"
    });

    J("#idImgCopyToClipboard" + this.id).css({
        "position": "absolute", 
        "top" : "15px",
        "right":"30px"
    });

    J("#idImgCollapseNav" + this.id).css({
        "position": "absolute",
        "top" : "25px",
        "left":"5px",
        "cursor":"pointer"
    });

    J("#idDivBannerMiddle" + this.id).css({
        "position":"absolute",
        "left":"0px",
        "right":"0px",
        "width":"100%",
        "text-align":"center",
        "margin-left":"5px",
        "font-size":"20px"
    });
	
    J("#idDivBannerRight" + this.id).css({
        "float": "right",
        "height": "100%",
        "margin-right": "5px"
    });

    J("#idImgCollapseBanner" + this.id).css({
        "position": "absolute",
        "top": "2px",
        "right": "2px"
    });    
};

CTxBanner.prototype.toString = function() {
    return "CTxBanner";
}

CTxBanner.prototype.updateObject = function (aObject) {
    if (!aObject)
        return;

    this.object = aObject;
    var sTitle = this.object.sName;

    if (this.bDisplayObjectPath) {
        var paths = [];
        this.getParentsName(this.object, paths);
        if (paths.length > 1)
            sTitle = paths.join(" / ");
    }

    this.updateTitle(sTitle);
}

CTxBanner.prototype.updateTitle = function (aTitle) {
    this.sTitle = aTitle;

    J("#" + this.sIdDivTitle).html(this.sTitle);
}

CTxBanner.prototype.getParentsName = function (aNode, aPaths) {
    var sParentName = "";
    if (aNode.parent)
        this.getParentsName(aNode.parent, aPaths);

    aPaths.push(aNode.sName);
}

CTxBanner.prototype.copyToClipboard = function () {
    if (!this.object)
        return;

    var sParams = this.idTab > 0 ? "#1?idObject=#2&idTab=#3" : "#1?idObject=#2",
        sUrl = format(sParams, [this.sUrl, this.object.ID, this.idTab]);

    if (isIE()) { // IE  
        window.clipboardData.setData("Text", sUrl);
    } else {
        var wdow = new CQueryString({
            wContainer: this.wdowContainer,
            sCaption: _("Pour copier le lien dans le presse-papier faites : Ctrl+C puis Entrer"),
            sLabel: _("Lien vers l'Entité :"),
            sInputValue: sUrl,
            bHighlightInput: true,
            iWidth: 480,
            sInputWidth: "350px",
            onEnter: function () {
                wdow.close();
            }
        });
    }
}

CTxBanner.prototype.setBtnLeftVisible = function (aVisible) {
    if (getValue(aVisible, true))
        J("#idACollapseNav" + this.id).css("display", "inline");
    else
        J("#idACollapseNav" + this.id).css("display", "none");
}