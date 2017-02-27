function saveTextAsFile(aFileName, aText) {
    /* Saves a text string as a blob file*/
    var ie = navigator.userAgent.match(/MSIE\s([\d.]+)/),
        ie11 = navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/rv:11/),
        ieEDGE = navigator.userAgent.match(/Edge/g),
        ieVer = (ie ? ie[1] : (ie11 ? 11 : (ieEDGE ? 12 : -1)));

    if (ie && ieVer < 10) {
        return;
    }

    var textFileAsBlob = new Blob([aText], {
        type: 'text/plain'
    });

    if (ieVer > -1)
        window.navigator.msSaveBlob(textFileAsBlob, aFileName);
    else {
        var downloadLink = document.createElement("a");
        downloadLink.download = aFileName;
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = function (e) { document.body.removeChild(e.target); };
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }
}

function extractFileName(aPath) {
    if (aPath.substr(0, 12) == "C:\\fakepath\\")
        return aPath.substr(12); // modern browser
    var x;
    x = aPath.lastIndexOf('/');
    if (x >= 0) // Unix-based path
        return aPath.substr(x + 1);
    x = aPath.lastIndexOf('\\');
    if (x >= 0) // Windows-based path
        return aPath.substr(x + 1);
    return aPath; // just the filename
}

function extractFileExt(aFileName) {
    var regEx = /(?:\.([^.]+))?$/;

    if (regEx.exec(aFileName)[1])
        return regEx.exec(aFileName)[1].toLowerCase();

    return "";
}

function getFileIcon(aFileName) {
    var sExt = extractFileExt(aFileName),
        sIcon = "icon_txt.gif";

    switch (sExt) {
        case "docx":
        case "doc":
        case "rtf":
        case "dot":
            sIcon = "icon_doc.gif";
            break;
        case "xls":
        case "xlt":
        case "xlsx":
            sIcon = "icon_xls.gif";
            break;
        case "txt":
            sIcon = "icon_txt.gif";
            break;
        case "rss":
        case "atom":
            sIcon = "icon_feed.gif";
            break;
        case "opml":
            sIcon = "icon_opml.gif";
            break;
        case "phps":
            sIcon = "icon_phps.gif";
            break;
        case "torrent":
            sIcon = "icon_torrent.gif";
            break;
        case "vcard":
            sIcon = "icon_vcard.gif";
            break;
        case "exe":
            sIcon = "icon_exe.gif";
            break;
        case "dmg":
        case "app":
            sIcon = "icon_dmg.gif";
            break;
        case "pps":
        case "ppsx":
        case "ppt":
        case "pptx":
            sIcon = "icon_pps.gif";
            break;
        case "pdf":
            sIcon = "icon_pdf.gif";
            break;
        case "xpi":
            sIcon = "icon_plugin.gif";
            break;
        case "fla":
        case "swf":
            sIcon = "icon_flash.gif";
            break;
        case "zip":
        case "rar":
        case "gzip":
        case "bzip":
        case "ace":
            sIcon = "icon_archive.gif";
            break;
        case "ical":
            sIcon = "icon_ical.gif";
            break;
        case "css":
            sIcon = "icon_css.gif";
            break;
        case "ttf":
            sIcon = "icon_ttf.gif";
            break;
        case "jpg":
        case "jpeg":
        case "gif":
        case "png":
        case "bmp":
        case "svg":
        case "eps":
            sIcon = "icon_pic.gif";
            break;
        case "mov":
        case "wmv":
        case "mp4":
        case "avi":
        case "mpg":
            sIcon = "icon_film.gif";
            break;
        case "mp3":
        case "wav":
        case "ogg":
        case "wma":
        case "m4a":
            sIcon = "icon_music.gif";
            break;
    }
    return _url(format("/resources/theme/img/icons/#1", [sIcon]));
}

function isPictureFile(aFileName) {
    return inArray(['jpg', 'bmp', 'jpeg', 'raw', 'skc', 'png', 'gif', 'tif', 'tiff'], extractFileExt(aFileName));
}

function isExcelFile(aFileName) {
    return inArray(['xls', 'xlt', 'xlsx', 'xlsm', 'csv'], extractFileExt(aFileName));
}

function isGrapherFile(aFileName) {
    return isExcelFile(aFileName) || inArray(['txt', 'csv'], extractFileExt(aFileName));
}

function uploadFileInTmpDir(aFile, aAsync, aDeleteDouble) {
    if (getValue(aDeleteDouble, false))
        deleteFile(aFile.name);

    var formData = new FormData(),
        xhr = new XMLHttpRequest();

    formData.append('file', aFile);

    xhr.open('POST', _url('/code/TxWebForms/UploadFile.asp'), getValue(aAsync, false));
    xhr.send(formData);

    //callback, just in case
    //xhr.onreadystatechange = function () {
        //if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            //alert(xhr.responseText); 
        //}
    //};
}

function deleteFile(aFileName, aDirPathFile) {
    J.ajax({
        url: sPathFileComponentsAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "DeleteFile",
            sFileName: aFileName,
            sDirPathFile: getValue(aDirPathFile)
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] != sOk) 
                msgWarning(results[0]);
        }
    });
}

function openDataFileFile(aIdData, aDownload) {
    J.ajax({
        url: sPathTxAspAjax,
        async: false,
        cache: false,
        data: {
            sFunctionName: "openDocument",
            idData: aIdData
        },
        success: function (aResult) {
            var results = aResult.split("|");
            if (results[0] == sOk) {
                sFileName = results[1];
                if (getValue(aDownload, true)) {
                    downloadFile(sFileName);
                }
            } else
                msgWarning(results[0]);
        }
    });
}

function downloadFile(aFileName) {
    if (!frames['hiddenFrame']) {
        J(document.body).append('<iframe name="hiddenFrame" style="display:none;"></iframe>');
    }
    frames['hiddenFrame'].location.replace(_url("/code/asp/ajax/open_file.asp?file=") + aFileName);
}

function uploadFiles(aSettings, aCallback) {
    var div = J("#idDivUploadFile"),
        bMultiple = getValue(aSettings.bMultiple, false),
        sMultiple = bMultiple ? "multiple" : "",
        fileSelector = J('<input type="file" name="idFileQueryForm" style="display:none;" ' + sMultiple + ' />'),
        iFrame = J('<iframe style="display:none" name="frameImportArray"></iframe>'),
        sFileName = "";

    div.append(fileSelector);
    div.append(iFrame);
    J(document.body).append(div);

    fileSelector.change(function (e) {
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
            aCallback(uploadedFiles);

        div.remove();
    });

    iFrame.html("");
    fileSelector.val("");
    fileSelector.click();
}

/**
 * @function
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings = { 
            sIdInputFile : the input file html id,
            event : the event on change function of the input type file
            sReadType : "json", "form", "csv" by default 
        }
 * @comment you have to fill one of the two parameters between sIdInputFile and event.
 * @returns excel file content.
 */
function readExcelFile(aSettings, aCallBack, aDummyData) {
    var X = XLSX,
        XW = {
            msg: 'xlsx'
        },
        xlf = J('#' + aSettings.sIdInputFile),
        sReadType = getValue(aSettings.sReadType, "csv"),
        event = aSettings.event;

    function fixdata(data) {
        var o = "", l = 0, w = 10240;
        for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
        return o;
    }

    function ab2str(data) {
        var o = "", l = 0, w = 10240;
        for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint16Array(data.slice(l * w, l * w + w)));
        o += String.fromCharCode.apply(null, new Uint16Array(data.slice(l * w)));
        return o;
    }

    function s2ab(s) {
        var b = new ArrayBuffer(s.length * 2), v = new Uint16Array(b);
        for (var i = 0; i != s.length; ++i) v[i] = s.charCodeAt(i);
        return [v, b];
    }

    function xw_noxfer(data, cb) {
        var worker = new Worker(XW.noxfer);
        worker.onmessage = function (e) {
            switch (e.data.t) {
                case 'ready': break;
                case 'e': console.error(e.data.d); break;
                case XW.msg: cb(JSON.parse(e.data.d)); break;
            }
        };
        var arr = rABS ? data : btoa(fixdata(data));
        worker.postMessage({ d: arr, b: rABS });
    }

    function to_json(workbook) {
        var result = {};
        workbook.SheetNames.forEach(function (sheetName) {
            var roa = X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            if (roa.length > 0) {
                result[sheetName] = roa;
            }
        });
        return result;
    }

    function to_csv(workbook) {
        var result = [];
        workbook.SheetNames.forEach(function (sheetName) {
            var csv = X.utils.sheet_to_csv(workbook.Sheets[sheetName]);
            if (csv.length > 0) {
                result.push("SHEET: " + sheetName);
                result.push("");
                result.push(csv);
            }
        });
        return result.join("\n");
    }

    function to_formulae(workbook) {
        var result = [];
        workbook.SheetNames.forEach(function (sheetName) {
            var formulae = X.utils.get_formulae(workbook.Sheets[sheetName]);
            if (formulae.length > 0) {
                result.push("SHEET: " + sheetName);
                result.push("");
                result.push(formulae.join("\n"));
            }
        });
        return result.join("\n");
    }

    function process_wb(wb) {
        var output = "";
        switch (sReadType) {
            case "json":
                output = JSON.stringify(to_json(wb), 2, 2);
                break;
            case "form":
                output = to_formulae(wb);
                break;
            case "csv":
                output = to_csv(wb);
        }
        
        if (aCallBack)
            aCallBack(output, aDummyData);
    }

    function onChange(e) {
        var files = e.target.files;
        var f = files[0];
        {
            var reader = new FileReader();
            var name = f.name;
            reader.onload = function (e) {
                var data = e.target.result;
                var wb;
                var arr = fixdata(data);
                wb = X.read(btoa(arr), { type: 'base64' });
                process_wb(wb);
            };
            reader.readAsArrayBuffer(f);
        }
    }

    if (event) {
        onChange(event);
    } else if (xlf)
        xlf.change(onChange);
}

// Grayscale w canvas method, return image in base64 format
function applyGrayscaleToIcon(src, aCallback) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var imgObj = new Image();
    imgObj.src = src;
    imgObj.onload = function () {
        canvas.width = imgObj.width;
        canvas.height = imgObj.height;
        ctx.drawImage(imgObj, 0, 0);
        var imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (var y = 0; y < imgPixels.height; y++) {
            for (var x = 0; x < imgPixels.width; x++) {
                var i = (y * 4) * imgPixels.width + x * 4;
                var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
                imgPixels.data[i] = avg;
                imgPixels.data[i + 1] = avg;
                imgPixels.data[i + 2] = avg;
            }
        }
        ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
        imgObj.onload = null;
        aCallback(canvas.toDataURL());
    }
}