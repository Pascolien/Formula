/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.sIdDiv: html div id for storing the publisher component
        aSettings.idObject,
        aSettings.idAtt,
        aSettings.sUniqueId: teexma object id
        aSettings.idFileType
        aSettings.rootFiles: array owns files information {'sName' : filename.png, 'size': 10}
        aSettings.bMultiple: boolean value, true if the multiple selection is allowed,
        aSettings.bLoadRootFiles
        aSettings.bReadOnly
        aSettings.wContainer: the window container permit to manage modals windows,
        aSettings.bLoadRootFiles: the idObject and idAtt are campelled in this boolean is true, it permit to load root file of the couple idObject/idAttribute, false by default.
        aSettings.rootFiles : [
            {}
        ]
 * @returns CPublisher object.
 */

var CPublisher = function (aSettings) {
    this.id = getValue(aSettings.sUniqueId, new Date().getTime());
    this.rootFiles = getValue(aSettings.rootFiles, []);
    this.bMultiple = getValue(aSettings.bMultiple, false);
    this.wContainer = aSettings.wContainer;
    this.idObject = getValue(aSettings.idObject,0);
    this.idAtt = aSettings.idAtt;
    this.idFileType = getValue(aSettings.idFileType,0);
    this.bLoadRootFiles = getValue(aSettings.bLoadRootFiles, false);
    this.bReadOnly = getValue(aSettings.bReadOnly, false);
    this.iWidthPublisher = getValue(aSettings.iWidthPublisher, 279); 
    this.iCount = 1;
    this.files = [];
    this.sIdDiv = "idDivGrid" + this.id;
    this.sIdFile = "idInputAddFile" + this.id;

    var self = this,
        sHtml =
        '<div id="' + this.sIdDiv + '" style="float:left;"></div>' +
        '<div style="float:left;" DragNDrop="'+!this.bReadOnly+'">' +
            '<input type="text" disabled="disabled" id="idTxtFileSelect' + this.id + '" style="width:' + this.iWidthPublisher + 'px;height:17px;" placeholder="' + _("Sélectionner un fichier") + '" />' +
        '</div>';

    if (!this.bReadOnly) {
        sHtml +=
            '<div style="float:left;">' +
                '<img class="clIconExt clIconHover" title="' + _("Publier un nouveau fichier...") + '" id="idImgAddFiles' + this.id + '" src="'+ _url("/resources/theme/img/btn_form/repertoire_visite.png") + '" />' +
                '<img class="clIconExt clIconHover" title="' + _("Faire référence à un fichier publié...") + '" id="idImgRefFiles' + this.id + '" src="' + _url("/resources/theme/img/btn_form/bloc-note.png") + '" />' +
            '</div>' +
            "<form enctype='multipart/form-data' id='idFormPublisher" + this.id + "' action='"+ _url('/code/TxWebForms/UploadFile.asp') + "' target='hiddenFrame' method='post' name='formPublisher'>" +
                '<div id="idDivImgAdd' + this.id + '"   class="fileuploader" style="position:relative; width: 40px; float:right">' +
                    "<input type='hidden' id='idHiddenFile' />" +
                    '<input type="file" id="' + this.sIdFile + '" name="filesToUpload" style="display:none;" />' +
                '</div>' +
            "</form>";
    }

    J("#" + aSettings.sIdDiv).append(sHtml);

    // the multiple upload of files is not working yet, only the first file of a multiple selection is uploaded...
    if (this.bMultiple) 
        J('#' + this.sIdFile).attr('multiple', 'multiple');

    //init grid
    CGrid.call(this, {
        sIdDivGrid: this.sIdDiv,
        bHideHeader: true,
        bReadOnly: this.bReadOnly,
        iWidth : aSettings.iWidth,
        cols: [
            { sWidth: "*", sColAlign: "left" },
            { sWidth: "70", sColAlign: "left" },
            { sWidth: "50", sColAlign: "center" }
        ],
        onAddRow: aSettings.onAddRow,
        onDelRow: aSettings.onDelRow
    });

    //this.grid.enableTooltips("false,false, false");
    J('#' + this.sIdDiv).css({
        'position': 'relative',
        'display': 'none'
    });

    if (!this.bReadOnly) {
        //onXLE event launched after the page loading, inter alia file deleting
        this.grid.attachEvent("onXLE", function () {
            J('#' + self.sIdDiv).find('.clOnXLEDelete').click(function (a) {
                var rId = a.currentTarget.id,
                    sId = rId.substring(rId.indexOf("_") + 1);
                self.deleteFile(parseInt(sId));
            });

            J('#' + self.sIdDiv).find('.clOnXLEView').click(function (a) {
                var rId = a.currentTarget.id,
                    sId = rId.substring(rId.indexOf("_") + 1);
                self.setViewFile(parseInt(sId));
            });
        });

        //File browser Btn action
        J("#idImgAddFiles" + this.id).click(function () {
            J("#" + self.sIdFile).click();
        });

        J("#idImgRefFiles" + this.id).click(function () {
            self.addArchivedFiles();
        });

        //onChange event launched by add file btn
        J("#" + this.sIdFile).change(function (e) {
            var uploadedFiles = e.target.files,
                files = [];

            J.each(uploadedFiles, function (i, aFile) {
                files.push({
                    AF: { sFileName: aFile.name, sLeft_Ext: aFile.name, ID_FT: self.idFileType, sPath_File: aFile.name, sExt: "." + extractFileExt(aFile.name), sAction: dbaAdd },
                    sAction: dbaAdd,
                    sSize: format(_("#1 Ko"), [(aFile.size / 1000).toFixed(2)])
                });
                J("#idDivImgAdd" + self.id + " #idHiddenFile").val(aFile.name);
                J("#idDivFrame" + self.id).html("");

                uploadFileInTmpDir(aFile, false, true);
            });
            if (files.length > 0)
                self.addFiles(files);

            J("#" + self.sIdFile).val("")
        });
    }

    this.loadRootExt();
};

//inheritage
CPublisher.prototype = createObject(CGrid.prototype);
CPublisher.prototype.constructor = CPublisher;

CPublisher.prototype.loadRootExt = function () {
    var self = this;

    if (this.rootFiles.length > 0) {
        this.setStateNone(this.rootFiles);
        this.addFiles(this.rootFiles);
    } else if (this.bLoadRootFiles) {
        J.ajax({
            url: sPathFileComponentsAjax,
            async: false,
            cache: false,
            data: {
                sFunctionName: "getDataFileFiles",
                idObject: this.idObject,
                idAttribute: this.idAtt
            },
            success: function (aResult) {
                var results = aResult.split("|");
                if (results[0] == sOk) {
                    var data = JSON.parse(results[1]);
                    self.idFileType = parseInt(results[2]);
                    if (data.Files) {
                        self.setStateNone(data.Files);
                        self.addFiles(data.Files);
                    }
                } else
                    msgWarning(results[0]);
            }
        });
    }
}

CPublisher.prototype.setStateNone = function (aFiles) {
    aFiles.forEach(function (aFile) {
        aFile.sAction = dbaNone;
    });
}

CPublisher.prototype.getFileFromName = function (aFileName) {
    var file;
    this.files.find(function (aFile) {
        if (aFile.AF.sFileName == aFileName) {
            file = aFile;
            return true;
        }
    });
    return file;
}

CPublisher.prototype.getFile = function (aIdFile) {
    var file;
    this.files.find(function (aFile) {
        if (aFile.AF.iUniqueId === aIdFile) {
            file = aFile;
            return true;
        }
    });
    return file;
}

CPublisher.prototype.getFileIndex = function (aIdFile) {
    var iIndex = -1;
    this.files.find(function (aFile, i) {
        if (aFile.AF.ID === aIdFile) {
            iIndex = i;
            return true;
        }
    });
    return iIndex;
}

CPublisher.prototype.addFiles = function (aFiles) {
    var self = this,
        rows = [];
    aFiles = getValue(aFiles, []);

    if (!this.bMultiple) {
        var bExit = false;
        this.files.find(function (aFile) {
            if (aFile.sAction != dbaFakelyDelete && aFile.sAction != dbaDel) {
                bExit = true;
                return true;
            }
        });

        if (bExit)
            return;
    }

    if(J("#idTxtFileSelect" + this.id).css('display') != 'none'){
        J("#idTxtFileSelect" + this.id).css('display', 'none');
        J('#' + this.sIdDiv).css('display', 'block');
    }

    // add new files in arrfiles
    aFiles.find(function (aFile) {
        if (!isAssigned(aFile.AF.sFileName))
            aFile.AF.sFileName = aFile.AF.sLeft_Ext;

        var file = self.getFileFromName(aFile.AF.sFileName);
        if (isAssigned(file)) {
            if (file.sAction == dbaFakelyDelete) {
                file.sAction = dbaAdd;
            }

            if (file.sAction == dbaDel) {
                file.sAction = dbaModif;
            }
            return false;
        }

        aFile.sAction = getValue(aFile.sAction, dbaAdd);
        if (!aFile.AF.iUniqueId)
            aFile.AF.iUniqueId = self.iCount;

        if (aFile.bView == undefined)
            aFile.bView = isPictureFile(aFile.AF.sFileName);

        self.files.push(aFile);
        self.iCount++;
    });

    //parse all files and add them into the grid if they are not in deleted state
    this.files.find(function (aFile) {
        if (aFile.sAction == dbaDel || aFile.sAction == dbaFakelyDelete)
            return false;

        var sClassBtnView = aFile.bView ? 'clOnXLEView clIconPressedExt' : 'clOnXLEView',
            deleteBtn = '<img id="idImgDelete' + self.id + "_" + aFile.AF.iUniqueId + '" title="' + _("Supprimer le fichier") + '" src="'+ _url("/resources/theme/img/btn_form/16x16_false.png") + '" style="cursor:pointer" class="clOnXLEDelete"/>',
            viewBtn = ' <img id="idImgView' + self.id + "_" + aFile.AF.iUniqueId + '" title="' + _("(Dés)Activer la visualisation du fichier") + '" src="' + _url("/resources/theme/img/btn_form/terre.png") + '" style="cursor:pointer" class="' + sClassBtnView + '"/>',
            sIcon = ' <img src="' + getFileIcon(aFile.AF.sFileName) + '" />';

        rows.push({
            ID: aFile.AF.iUniqueId,
            data: [sIcon + " " +aFile.AF.sFileName, getValue(aFile.sSize), deleteBtn + viewBtn]
        });        
    });

    var iHeight = 20 * rows.length;
    iHeight = (iHeight < 200) ? iHeight : 200; 
    J("#" + this.sIdDiv).css("height", iHeight);
    this.setSizes();

    this.reloadFromTxObjects(rows);
    if (isAssigned(this.fctOnAddRow))
        this.fctOnAddRow(this.files);

    if (!this.bMultiple) {
        J('#idImgAddFiles' + this.id).attr("src", _url("/resources/theme/img/btn_form/repoDisable.png"));
        J('#idImgRefFiles' + this.id).attr("src", _url("/resources/theme/img/btn_form/blocNoteDisabled.png"));
        J('#idImgAddFiles' + this.id + ", #idImgRefFiles" + this.id).removeClass("clIconHover");
        J("#idImgAddFiles" + this.id + ", #idImgRefFiles" + this.id).unbind("click");
    }
};

CPublisher.prototype.addArchivedFiles = function (aFilesSelected, aArchivedFiles) {
    var self = this;

    if (!isAssigned(aFilesSelected)) {
        //display ref files in window
        J.ajax({
            url: sPathFileComponentsAjax,
            async: false,
            cache: false,
            data: {
                sFunctionName: "getArchivedFiles",
                idAttribute: this.idAtt
            },
            success: function (aResult) {
                var results = aResult.split("|");
                if (results[0] == sOk) {
                    var files = JSON.parse(results[1]),
                        rows = [];

                    files.forEach(function (aFile) {
                        rows.push({ data: [' <img src="' + getFileIcon(aFile.sFileName) + '" />' + " " + aFile.sFileName] })
                    });

                    new CQueryGrid({
                        wContainer: self.wContainer,
                        sCaption: _("Fichier(s)"),
                        rows: rows,
                        bEnableMultiselection : true,
                    }, function (aId, aFilesSelected, aDummyData) {
                        if (aId == "ok") {
                            self.addArchivedFiles(aFilesSelected, aDummyData);
                        }
                    }, files);
                } else
                    msgWarning(results[0]);
            }
        });
    } else {
        //add ref files selected
        var files = [];

        aFilesSelected.forEach(function (aRow) {
            aArchivedFiles.forEach(function (aArchivedFile) {
                var sIcon = ' <img src="' + getFileIcon(aArchivedFile.sFileName) + '" />';

                if (sIcon + " " + aArchivedFile.sFileName == aRow.cells[0].sValue) {
                    files.push({ AF: aArchivedFile, bView: false })
                }
            });
        });

        this.addFiles(files)
    }
}

CPublisher.prototype.deleteFile = function (aIdFile) {
    var self = this;

    //update file state
    var file = this.getFile(aIdFile);

    //delete the archived file
    file.AF.sAction = dbaDel;

    if (file.sAction == dbaNone || file.sAction == dbaModif)
        file.sAction = dbaDel;
    else if (file.sAction == dbaAdd)
        file.sAction = dbaFakelyDelete;

    //delete row
    this.deleteRow(aIdFile);

    //resize the grid
    if (this.grid.getRowsNum() === 0) {
        J('#' + this.sIdDiv).css('display', 'none');
        J("#idTxtFileSelect" + this.id).css('display', 'block');

        if (!this.bMultiple) {
            J('#idImgAddFiles' + this.id).attr("src", _url("/resources/theme/img/btn_form/repertoire_visite.png"));
            J('#idImgRefFiles' + this.id).attr("src", _url("/resources/theme/img/btn_form/bloc-note.png"));
            J('#idImgAddFiles' + this.id + ", #idImgRefFiles" + this.id).addClass("clIconHover");
            J("#idImgAddFiles" + this.id).click(function () {
                J("#" + self.sIdFile).click();
            });
            J("#idImgRefFiles" + this.id).click(function () {
                self.addArchivedFiles();
            });
        }
    } else {
        var iHeight = 24 * this.grid.getRowsNum();
        J("#" + this.sIdDiv).css("height", iHeight);
    }
    if (isAssigned(this.fctOnDelRow))
        this.fctOnDelRow(this.files);
};

CPublisher.prototype.setViewFile = function (aIdFile) {
    var file = this.getFile(aIdFile),
        bView = !file.bView;

    if (file.sAction == dbaNone)
        file.sAction = dbaModif;

    J("#" + this.idView).attr("class", "clIconPressedExt");

    if (bView)
        J("#idImgView" + this.id + "_" + aIdFile).attr("class", "clOnXLEView clIconPressedExt");
    else
        J("#idImgView" + this.id + "_" + aIdFile).attr("class", "clOnXLEView");

    file.bView = bView;
}

CPublisher.prototype.getDataToSave = function () {
    var data = { ID_Obj: this.idObject, ID_Att: this.idAtt, Files: [], sAction: dbaModif },
        self = this;

    this.files.forEach(function (aFile) {
        if (aFile.sAction !== dbaFakelyDelete) {
            var file = J.extend({}, aFile);
            file.AF.sPath_File = file.AF.sFileName;

            data.Files.push(file);
            aFile.sAction = dbaNone;
        }
    });

    if (data.Files.length == 0)
        data = null;

    return data;
}

CPublisher.prototype.save = function () {
    checkMandatorySettings({ idAtt: this.idAtt }, ["idAtt"]);

    var data = this.getDataToSave();

    if (!isAssigned(data))
        return;

    J.ajax({
        url: sPathFileComponentsAjax,
        async: false,
        cache: false,
        type: "post",
        data: {
            sFunctionName: "saveDataFile",
            sData: JSON.stringify(data),
            idObject: this.idObject,
            idAtt: this.idAtt
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] != sOk)
                msgWarning(results[0]);
        }
    });
}

CPublisher.prototype.lock = function (aLocked) {
    aLocked = getValue(aLocked, true);

    CGrid.prototype.lock.call(this, aLocked);

    var self = this;

    if (aLocked) {
        J("#idImgAddFiles" + this.id + ", #idImgRefFiles" + this.id).unbind("click");
        J('#' + this.sIdDiv).find('.clOnXLEDelete').unbind("click");
        J('#' + this.sIdDiv).find('.clOnXLEView').unbind("click");
        J("#" + this.sIdFile).attr("disabled", "disabled");
    } else {
        J("#" + this.sIdFile).removeAttr("disabled");

        //File browser Btn action
        J("#idImgAddFiles" + this.id).click(function () {
            J("#" + self.sIdFile).click();
        });

        J("#idImgRefFiles" + this.id).click(function () {
            self.addArchivedFiles();
        });

        J('#' + this.sIdDiv).find('.clOnXLEDelete').click(function (a) {
            var rId = a.currentTarget.id,
                sId = rId.substring(rId.indexOf("_") + 1);
            self.deleteFile(parseInt(sId));
        });

        J('#' + this.sIdDiv).find('.clOnXLEView').click(function (a) {
            var rId = a.currentTarget.id,
                sId = rId.substring(rId.indexOf("_") + 1);
            self.setViewFile(parseInt(sId));
        });
    }
}

CPublisher.prototype.onMouseOver = function (aIdRow, aIndexCol) {
    return aIndexCol != 2;
}