/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.idAttribute
        aSettings.serieType
        aSettings.wdowContainer,
        aSettings.onValidate
        aSettings.onClose
 * @returns CTxImportArray object.
 */

function CTxImportArray(aSettings) {
    this.idAttribute = aSettings.idAttribute;
    this.serieType = aSettings.serieType;
    this.onValidate = aSettings.onValidate;
    this.wdowContainer = aSettings.wdowContainer;
    this.onClose = aSettings.onClose;

    var self = this,
        sHtml =
            '<div id="idDivContainerTxImportArray">' +
                '<div id="idDivMainTxImportArray" style="margin:5px;">' +
                    '<div id="idDivGridArrayImport" style="margin-bottom: 6px;"></div>' +
                    '<label id="idLabelSeparatorTxImportArray" style="margin-left:6px; margin-right:6px; margin-top:3px; float:left; width: 250px; text-align: right;">' + _("Séparateur :") + '</label>' +
                    '<div id="idDivComboSeparatorArrayImport"></div>' +
                    '<div id="idDivTransposeArrayImport">'+
                        '<label style="margin-left:6px; margin-right:6px; margin-top:3px; float:left; width: 250px; text-align: right;">' + _("Réaliser une transposée du tableau à importer :") + '</label>' +
                        '<input id="idCheckboxTransposeArrayImport" type="checkbox" style="margin-top:4px;" checked />' +
                    '</div>' +
                '</div>' +
                '<div id="idDivButtonBarArrayImport"></div>' +
            '</div>';
    J(document.body).append(sHtml);

    var windowSettings = {
        sName: "wImportDataArray",
        sHeader: _("Importation d'un tableau de données"),
        sIcon: 'temp_resources/theme/img/btn_titre/module_extract-16.png',
        iWidth: 630,
        iHeight: 340,
        bDenyResize: true,
        bHidePark: true,
        sObjectAttached: "idDivContainerTxImportArray"
    };

    if (isAssigned(this.wdowContainer))
        this.wImportDataArray = this.wdowContainer.addWindow(windowSettings, function () { self.onClose(); return true; });
    else
        this.wImportDataArray = new CWindow(windowSettings, function () { self.onClose(); return true; });

    this.gridArray = new CGridArray({
        sIdDivGrid: "idDivGridArrayImport",
        idAttribute: this.idAttribute,
        serieType: this.serieType,
        bDisplayToolbar: false,
        iWidth: 600,
        iHeight: 235
    });

    var buttonBar = new CButtonBar({
        btns: [
            { sId: "idBtnImportFromFile", sCaption: _("Importer depuis un fichier..."), onClick: function () { self.importFromFile() } },
            { sId: "idBtnValidate", sCaption: _("Valider"), onClick: function () { self.validate() } },
            { sId: "idBtnClose", sCaption: _("Fermer"), onClick: function () { self.close() } }
        ],
        sIdDivParent: 'idDivButtonBarArrayImport'
    });

    this.comboSeparator = new CComboBox({
        sIdDivCombo: "idDivComboSeparatorArrayImport",
        iWidth: 338,
        objects: [
            { value: "\t", text: "TAB" },
            { value: ";", text: ";" },
            { value: ",", text: "," }
        ]
    });
}

CTxImportArray.prototype.toString = function () {
    return "CTxImportArray";
}

CTxImportArray.prototype.importDataFromTEEXMA = function () {
    //todo
}

CTxImportArray.prototype.importFromFile = function () {
    var self = this;
    uploadFiles({}, function (aFiles) {
        if (aFiles[0])
            J.ajax({
                url: sPathFileComponentsAjax,
                async: false,
                cache: false,
                data: {
                    sFunctionName: "ImportTable",
                    sFileName: aFiles[0].name,
                    idTableType: self.serieType.ID,
                    sColSeparator: self.comboSeparator.getActualValue(),
                    bTranspose: J("#idCheckboxTransposeArrayImport").is(":checked")
                },
                success: function (aResult) {
                    var results = aResult.split("|");
                    if (results[0] == sOk) {
                        var data = JSON.parse(results[1]);
                        self.gridArray.rows = [];
                        self.gridArray.cols = [];
                        self.gridArray.fillGrid(self.gridArray.serieType, data, true, dbaModif);
                        if (self.gridArray.fctOnAddRow)
                            self.gridArray.fctOnAddRow();
                    } else
                        msgWarning(results[0]);
                }
            });
    });
}

CTxImportArray.prototype.validate = function (aValidate) {
    var self = this;

    if (!isAssigned(aValidate)) {
        msgYesNo(_("Voulez-vous valider ? Ceci entraînera l'écrasement du tableau."), function (aValidate) {
            if (aValidate)
                self.validate(true);
        });
        return;
    }

    this.onValidate(this.gridArray.getCurrentData());
    this.close();
}

CTxImportArray.prototype.close = function () {
    this.wImportDataArray.close();
}
