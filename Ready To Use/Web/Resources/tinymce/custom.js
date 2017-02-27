function initTinyMCE(aSettings) {
    var sClassName = getValue(aSettings.sClassName),
        sLanguage = getValue(aSettings.sLanguage, _("fr")),
        fctOnChange = aSettings.fctOnChange,
        fctOnFullScreen = aSettings.fctOnFullScreen,
        iWidth = getValue(aSettings.iWidth, iTxTinyMceWidth),
        iHeight = getValue(aSettings.iHeight, iTxTinyMceHeight);

    function formatPaste(aString, aTag) {
        var ind = 0, sResult = "", reEnd, reSearch, sEndBalise = '';
        if (aTag == '<ul>') {
            sEndBalise = '</ul>';
            reEnd = /<\/ul>/;
            reSearch = /<ul>/;
        } else {
            sEndBalise = '</ol>';
            reEnd = /<\/ol>/;
            reSearch = /<ol>/;
        }
        while ((match = reEnd.exec(aString)) != null) {
            ind = match.index;
            var sTemp = aString.substring(0, ind);
            if (sTemp.search(reSearch) != -1) {
                sResult += sTemp + sEndBalise;
                aString = aString.substring(ind + 5);
            } else {
                sResult += sTemp + sEndBalise + '</li>' + aString.substring(ind + 5);
                break;
            }
        }
        return sResult;
    }

    function replaceListForIE8(aString) {
        aString = aString.replace(/<ul>/g, '');
        aString = aString.replace(/<\/ul>/g, '');
        aString = aString.replace(/<ol>/g, '');
        aString = aString.replace(/<\/ol>/g, '');
        aString = aString.replace(/<\/li><\/li>/g, '</li>');
        aString = aString.replace(/<br><br>/g, '<br>');
        aString = aString.replace(/<\/li><p/g, '</li></ul><p');
        aString = aString.replace(/<\/p><li/g, '</p><ul><li');
        aString = aString.replace(/(^>)<li/g, '<ul><li');
        var sBegin = '', sEnd = '';
        if (aString.substring(0, 3) == '<li') {
            sBegin = '<ul>';
        }
        if (aString.substring(aString.length - 5, aString.length) == '</li>') {
            sEnd = '</ul>';
        }
        aString = sBegin + aString + sEnd;
        return aString;
    }

    if (sLanguage == "fr")
        sLanguage += "_FR";
    else
        sLanguage += "_GB";

    tinymce.init({
        selector: "textarea." + sClassName,
        scrollbars: true,
        browser_spellcheck: true,
        skin: "lightblue",
        language: sLanguage,
        setup: function (ed) {
            ed.on("change", function (ed, l) {
                if (fctOnChange)
                    fctOnChange(ed.level.content);
            });
            ed.on("FullscreenStateChanged", function (ed) {
                if (fctOnFullScreen)
                    fctOnFullScreen(ed.state);
            });
        },
        plugins: [
                "advlist  autolink autosave lists charmap print preview hr anchor pagebreak",
                "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                "table  directionality  template textcolor paste textcolor colorpicker textpattern TxLink TxImage  spellchecker"
        ],
        width: iWidth,
        height: iHeight,
        autosave_ask_before_unload: false,
        resize: 'both',
        fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
        paste_preprocess: function (plugin, args) {
            // Expressions régulières visant à clean le code HTML pour bien gérer la copie de listes à puces.
            args.content = args.content.replace(/><(\/)?(i|b|strong)><(\/)?(i|b|strong)></g, '><');
            args.content = args.content.replace(/><(i|b|strong)><(?!span)/g, '><');
            args.content = args.content.replace(/(?!span)><\/(i|b|strong)></g, '><');
            if (Get_IE_Version() == 8) {
                args.content = replaceListForIE8(args.content);
            } else {
                var regEX = /<\/li>(<ul>|<ol>)/g;
                while ((match = regEX.exec(args.content)) != null) {
                    args.content = args.content.substring(0, match.index) + args.content.substring(match.index + 5, args.content.length); // remove </li>
                    var sSubstring = args.content.substring(match.index + 4);
                    var sBalise = args.content.substring(match.index, match.index + 4); // catch <ul> or <ol>
                    args.content = args.content.substring(0, match.index + 4) + formatPaste(sSubstring, sBalise);
                }
            }

        },
        toolbar1: " bold italic underline  | alignleft aligncenter alignright alignjustify |  fontselect fontsizeselect | forecolor backcolor | bullist numlist | TxLink TxImage fullscreen ",
        menubar: false,
        statusbar: false,
        fullscreen_new_window: true,
        toolbar_items_size: 'small',
        // permet le copier coller d'images mais ne gère pas l'upload dans les documents...
        // paste_data_images: true,

        // permet de prendre en compte les textes colorés copiés depuis word, mais "all" -> "perturbent" les puces, on utilise des propriétés restreintes
        paste_retain_style_properties: "font-size,text-align,color",
        convert_urls: false
    });
}

