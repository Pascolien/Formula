var CBanner = (function () {

    var sPathTxBannerAjax = _url("/code/TxBanner/TxBannerAjax.asp");

    function CBanner(aSettings) {
        if (!aSettings)
            return;

        this.settings = aSettings;
        var self = this;

        checkMandatorySettings(aSettings, ["sIdDiv"]);

        var sDivName = aSettings.sIdDiv;
        var BannerSettings = [
            {
                sIdDiv: sDivName,
                sType: "div",
                id: "idDivBannerLeft",
                Children: [
                    {
                        sType: "a",
                        id: "idACollapseNav",
                        ArrHtmlTag: { href: "#" },
                        Children: [
                            {
                                sType: "img",
                                id: "idImgCollapseNav",
                                ArrHtmlTag: { src: _url("/Resources/theme/img/btn_content/collapse_nav.gif"), title: _("Cacher le panneau de Navigation") }
                            }
                        ]
                    }
                ]
            },
            {
                sIdDiv: sDivName,
                sType: "div",
                id: "idDivBannerMiddle",
                "class": "txBanner",
                ArrHtmlTag: { style: "background:url('/temp_resources/theme/img/Default.jpg') no-repeat; width: 100%; height:100%;" }
            },
            {
                sIdDiv: sDivName,
                sType: "div",
                id: "idDivBannerMiddleFrame",
                ArrHtmlTag: { style: "display:none;" },
                Children: [
                    {
                        sType: "iFrame",
                        id: "idFrameTxBanner",
                        ArrHtmlTag: { style: "border:0px; width:100%; height:46px;" }
                    }
                ]
            },
            {
                sIdDiv: sDivName,
                sType: "div",
                id: "idDivBannerRight",
                Children: aSettings.DivBannerRight
            }];
        var html = new CHtml(BannerSettings);

        J("#idACopyToClipboard").hide();

        J("#idACollapseBanner").on("click", function () {
            self._collapseParentCell();
        });

        J("#idImgCollapseNav").on("click", function () {
            //J(this).hide();
            self.onCollapseNavTree();
        });

        J("#idACopyToClipboard").on("click", function () {
            self.copyToClipboard();
        });
        J("#idAOpenCollapseComment").on("click", function () {
            self.onCollapseExpandTreeComment();
        });

        if (!txASP.bBannerVisibleByDefault) {
            setTimeout(function () {
                self._collapseParentCell();
            }, 500);
        }

        this.functionsToExecute = {
            "idOT": ["onObjectTypechange"],
            "txObjs": ["onObjectSelected"],
            "idTab": ["changeTab"],
            "refreshBanner": ["refreshBanner"],
            "showBtnCollapseNav": ["showBtnCollapseNav"],
            "hideBtnCollapseNav": ["hideBtnCollapseNav"]
        }
    };

    CBanner.prototype = {
        onObjectTypechange: function () {
            this.onObjectSelected([]);
        },

        changeTab: function (aIdTab) {
            this.idTab = aIdTab;
        },

        refreshBanner: function () {
            this.onObjectSelected([this.txObject]);
        },

        onObjectSelected: function (aObjects) {
            if (!aObjects || aObjects.length !== 1) {
                this._getParentCell().attachObject("idDivBanner");
                this.updateBanner("");
                return;
            }
            this.txObject = aObjects[0];
            var self = this,
                txObject = this.txObject;

            J.ajax({
                url: _url("/code/TxBanner/TxBannerAjax.asp"),
                async: false,
                cache: false,
                data: {
                    sFunctionName: "getBanner",
                    idOt: txObject.ID_OT,
                    idObject: txObject.ID
                },
                success: function (aResult) {
                    var results = aResult.split("|");
                    if (results[0] === sOk){
                        var sBannerPath = results[1],
                            sBannerHeader = results[2];

                        self.updateBanner(!isEmpty(sBannerPath) ? sBannerPath : (!isEmpty(sBannerHeader) ? sBannerHeader : txObject.sName));
                    } else
                        msgWarning(results[0]);
                }
            });
        },

        updateBanner: function (aValue) {
            J("#idDivBannerMiddle").css("display", "block");
            J("#idFrameTxBanner").html("");
            J("#idDivBannerMiddleFrame").css("display", "none");
            J("#idDivBannerMiddle").html(aValue);
        },

        copyToClipboard: function () {
            var self = this,
                sParams = this.idTab > 0 ? "#1?idObject=#2&idTab=#3" : "#1?idObject=#2",
                sUrl = format(sParams, [txASP.sUrl, this.txObject.ID, this.idTab]);

            if (Check_IE()) { // IE  
                window.clipboardData.setData("Text", sUrl);
            } else {
                var wdow = new CQueryString({
                    wContainer: self.wdowContainer,
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
        },

        onCollapseNavTree: function () {
            var array = this.settings.functions["onCollapseNavTree"];
            this._changeDataStorage(array, (new Date()).toString());
        },

        onCollapseExpandTreeComment: function () {
            var array = this.settings.functions["onCollapseExpandTreeComment"];
            this._changeDataStorage(array, (new Date()).toString());
        },

        showBtnCollapseNav: function () {
            J("#idImgCollapseNav").css("display", "block");
        },

        hideBtnCollapseNav: function () {
            J("#idImgCollapseNav").css("display", "none");
        },
    }

    return CBanner;
})();