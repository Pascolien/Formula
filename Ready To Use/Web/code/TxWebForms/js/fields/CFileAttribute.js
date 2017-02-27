function CFileAttribute(aSettings) {
    var sIdDivParent = getValue(J(aSettings.htmlDiv).attr('id'), getUniqueId());

    this.field = aSettings.field;
    this.sFileName = false;
    this.iFileCounter = 1;
    this.files = [];
    this.bList = this.field.sType == "File {}";
    this.sId = "idDivFileAtt" + sIdDivParent;

    if (isAssigned(this.field.Data))
        this.files = this.field.Data.Files;

    aSettings.sInput = "<div id='" + this.sId + "' class='divFileAtt'></div>";

    CAttributeField.call(this, aSettings);
}

CFileAttribute.prototype = createObject(CAttributeField.prototype);
CFileAttribute.prototype.constructor = CFileAttribute;

CFileAttribute.prototype.toString = function () {
    return "CFileAttribute";
}

CFileAttribute.prototype.initField = function () {
    var self = this;
    if (!this.bWriteMode) {
        var sHtml = "";
        this.files.forEach(function (aFile) {
            var sFileName = aFile.AF.sFileName,
                bPdfFile = extractFileExt(sFileName) == "pdf";

            if (!bPdfFile || (bPdfFile && !aFile.bView))
                sHtml +=
                    '<div>' +
                        '<a href="#" title="' + sFileName + '" onclick="openDataFileFile(' + aFile.AF.ID + ');">' + sFileName + '</a>' +
                        ' <a href="#" onclick="openDataFileFile(' + aFile.AF.ID + '); return false;"><img src="'+_url("/Resources/theme/img/btn_form/16x16_save.png")+'" title="' + _("Enregistrer le fichier...") + '"></a>' +
                    '</div>';

            if (aFile.bView) {
                self.bVisu = true;
                if (bPdfFile) {
                    var sFilePath = _url("/temp/" + iTxUserSessionId + "/" + sFileName);
                    sHtml += "<div><object data='" + sFilePath + "' type='application/pdf'>"
                                + "<embed src='" + sFilePath + "' type='application/pdf' />"
                            + "</objsect></div>";
                } else if (isPictureFile(sFileName))
                    sHtml += '<div><img class="clImgToCatchSize" idAtt="' + self.idAttribute + '" title="' + sFileName + '" src="/temp/' + iTxUserSessionId + '/' + sFileName + '"/></div>';
            }

        });
        J("#" + this.sId).html(sHtml);
        return;
    }

    var self = this,
        id = this.field.ID;

    this.iParentDivWidth = (this.iParentDivWidth > 0 && this.bTemplate) ? this.iParentDivWidth - 51 : iTxFormPublisherWidth;

    this.publisher = new CPublisher({
        sIdDiv: this.sId,
        idObject: this.idObject,
        idAtt: this.idAttribute,
        iWidth: this.iParentDivWidth,
        bMultiple: this.bList,
        bReadOnly: this.bReadOnly,
        wContainer: this.wdowContainer,
        idFileType: this.field.FileType.ID,
        rootFiles: this.files,
        onAddRow: function () { self.updateField(); },
        onDelRow: function () { self.updateField(); }
    });

    //manage drag and drop files
    var iNbDnDZone = J(document).find('#' + this.idActiveTabbar + ' div[DragNDrop="true"]').length,
        iHeight = 460,
        iWidth = 576,
        sColStyle = "";

    if (iNbDnDZone > 1) {
        iWidth = (iWidth-3) / 2;
        iHeight = (iHeight- ((iNbDnDZone-1)*3)) / Math.ceil(iNbDnDZone / 2);
        sColStyle = "float:left;";
    }
    var sDesc = format('<div class="clDragAndDropFileDesc">#1</div>', [getValue(this.field.sDescription)]),
        sFileContent =
        '<div id="' + id + '"class="dropContent">' +
            '<div class="clDropCell">' +
                '<div>' +
                    '<div style="float:left;width:32px; margin-left:3px">'+
                        '<img class="clDDImgBox" src="/resources/theme/img/btn_form/32x32_box.png" />' +
                    '</div>' +
                    '<div class="clDropAttr" style="float:left;margin-left:3px">' +
                        _Fmt("#1 (#2)", [this.field.sName, this.tabbar.getTabName(this.idTabSelected)]) +
                        sDesc +
                    '</div>'+
                '</div>' +
        '</div>';

    J('#dropzone' + this.iUniqueId).append(sFileContent);
    J('.dropContent').css('height', iHeight);
    J('.dropContent').css('width', iWidth);
    J('.clDropAttr').css('width', (iWidth - 40));
    if (!isEmpty(sColStyle))
        J('.dropContent').css('float', "left");

    J('.clDragAndDropFileDesc').css('max-height', (iHeight - 20) + "px");

    J('#' + id).on('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
        J.each(J("#dropzone" + self.iUniqueId + " > div"), function (i, aDiv) {
            J('#' + aDiv.id).css("background", "transparent");
            J('#' + aDiv.id).find(".clDDImgBox").attr("src", "/resources/theme/img/btn_form/32x32_box.png");
        })
        J('#' + id).css("background", "rgba(16,144,249,0.4)");
        J('#' + id).find(".clDDImgBox").attr("src", "/resources/theme/img/btn_form/32x32_box_filled.png");
    });

    J('#' + id).on('dragleave', function (e) {
        e.preventDefault();
        e.stopPropagation();
    });
    var bCreate = false;

    J('#' + id).on('drop', function (e) {
        // Stop the propagation of the event
        e.preventDefault();
        e.stopPropagation();
        var filesToUpload = e.originalEvent.dataTransfer.files,
            filesToAdd = [],
            formData = new FormData(),
            xhr = new XMLHttpRequest();

        J.each(filesToUpload, function (i, aFile) {
            filesToAdd.push({
                AF: { sFileName: aFile.name, sLeft_Ext: aFile.name, ID_FT: self.field.FileType.ID, sPath_File: aFile.name, sExt: "." + extractFileExt(aFile.name), sAction: dbaAdd },
                sAction: dbaAdd,
                sSize: _Fmt("#1 Ko", [(aFile.size / 1000).toFixed(2)])
            });

            formData.append('file', aFile);

            //we are not able to upload multiple files in same d&d
            return false;
        });

        // now post a new XHR request
        if (filesToAdd.length > 0) {
            xhr.open('POST', _url('/code/TxWebForms/UploadFile.asp'));
            xhr.send(formData);
            self.publisher.addFiles(filesToAdd);
        }
        self.wdowDrag.hide();
    });

    if (this.bMandatory) {
        if (this.publisher)
            this.bValid = this.publisher.hasRows();
    }
}

CFileAttribute.prototype.updateField = function () {
    if (!this.publisher)
        return;

    this.bValid = this.bMandatory ? this.publisher.hasRows() : true;

    CAttributeField.prototype.updateField.call(this);
}

CFileAttribute.prototype.getDataToSave = function () {
    var data = this.publisher.getDataToSave();
    if (isAssigned(data))
        data.sType = this.field.sType;

    return data;
}

CFileAttribute.prototype.lock = function (aLocked) {
    CAttributeField.prototype.lock.call(this, aLocked);

    if (!this.bReadOnly)
        this.publisher.lock(this.bLocked);
}