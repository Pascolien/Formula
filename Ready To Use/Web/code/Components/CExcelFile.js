/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings = {
            sFileName : *** MANDATORY ***,
            idObj,
            idAtt,
            idDataFile
        }
 * @returns CExcelFile object.
 */

var CExcelFile = (function ($) {
    var sPathWrapper = _url("/code/Components/ComponentsAjax.asp");

    function CExcelFile(aSettings, aCallBack, aDummyData) {

        this.workbook = null;

        if (aSettings)
            this.loadFile(aSettings);
    }

    CExcelFile.prototype = {
        loadFile: function (aSettings) {
            var self = this;
            checkMandatorySettings(aSettings, ["sFileName"]);

            this.sFileName = aSettings.sFileName;
            this.idObj = getValue(aSettings.idObj, 0);
            this.idAtt = getValue(aSettings.idAtt, 0);
            this.idDataFile = getValue(aSettings.idDataFile, 0);

            J.ajax({
                url: sPathWrapper,
                async: false,
                cache: false,
                data: {
                    sFunctionName: "LoadExcelFile",
                    sFileName: this.sFileName,
                    idObj: this.idObj,
                    idAtt: this.idAtt,
                    idDataFile: this.idDataFile,
                },
                success: function (aResult) {
                    var results = aResult.split("|");
                    if (results[0] == sOk)
                        self.workbook = JSON.parse(aResult.replace("ok|", ""));
                    else
                        msgWarning(results[0]);
                }
            });

            return this.workbook;
        },

        getWorkSheets: function () {
            var workSheets = [];

            this.workbook.worksheets.forEach(function (aWorksheet, i) {
                workSheets.push({ ID: i + 1, sName: aWorksheet.sName })
            });

            return workSheets;
        },

        getWorkSheet: function (aIndexWorkSheet) {
            return this.workbook.worksheets.find(function (aWorkSheet, i) { return i + 1 == aIndexWorkSheet; });
        },

        getRows: function (aIndexWorkSheet, aIndexRow) {
            var workSheet = this.getWorkSheet(aIndexWorkSheet);

            if (!workSheet)
                return;

            var rows = [];

            workSheet.rows[aIndexRow - 1].forEach(function (aValue, i) {
                rows.push({ ID: i, sName: aValue });
            });

            return rows;
        },

        getValues: function (aIndexWorkSheet, aIndexColumn, aStartIndex) {
            var workSheet = this.getWorkSheet(aIndexWorkSheet);

            if (!workSheet)
                return;

            var values = [];

            workSheet.rows.forEach(function (aRow, i) {
                if (i < (aStartIndex-1))
                    return;

                aRow.forEach(function (aValue, j) {
                    if (j == aIndexColumn)
                        values.push(aValue);
                });                
            });

            return values;
        }

    };
    
    return CExcelFile;
})(jQuery);
