function format(aString, aParams) {
    var sReturn = aString;

    aParams.forEach(function (aParam, i) {
        sReturn = sReturn.replace("#" + (i+1), aParam);
    });
    return sReturn;
}

function qc(aS1, aS2, aSep) {
    aSep = getValue(aSep);
    if ((aS1 != "") && (aS2 != ""))
        return aS1 + aSep + aS2;
    else
        return aS1 + aS2;
}

function qcFmt(aS1, aS2, aParams, aSep) {
    return qc(aS1, format(aS2, aParams), aSep);
}

function isEmpty(aValue) {
    if (aValue == undefined)
        return true;
    else if (typeof aValue == "number") {
        if (isNaN(aValue))
            return true;
        else
            return false;
    } else if (typeof aValue == "boolean")
        return false;
    else if (aValue == "" || aValue == sNull)
        return true;
    else
        return false;
}

function isAssigned(aValue) {
    return aValue != undefined && aValue != null;
}

function parseFloatExt(aValue) {
    if (isAssigned(aValue) && typeof(aValue) == "string")
        aValue = aValue.replace(",", ".");
    return parseFloat(aValue)
}

function isNumeric(aValue) {
    aValue = ("" + aValue).replace(/,/g, ".");
    return J.isNumeric(aValue);
}

function strToBool(aValue) {
    var sValue = aValue.toLowerCase();
    switch (sValue) {
        case "true":
        case "yes":
        case "1":
            return true;
        case "false":
        case "no":
        case "0":
            return false;
    }
}

function getValue(aValue, aDefaultValue) {
    aDefaultValue = (aDefaultValue === undefined) ? "" : aDefaultValue;
    return isEmpty(aValue) ? aDefaultValue : aValue;
}

function getBValue(aValue) {
    return aValue == "-1"
}

function inStr(aString, aSubText, aFormatStrs) {
    aFormatStrs = getValue(aFormatStrs, false);
    aString = aFormatStrs ? formatStr(aString) : aString;
    aSubText = aFormatStrs ? formatStr(aSubText) : aSubText;
    aString = "" + aString;
    return aString.indexOf(aSubText) != -1
}

function formatStr(aStr) {
    var r = aStr.toLowerCase();
    r = r.replace(new RegExp(/\|/g), "");
    r = r.replace(new RegExp(/[àáâãäå]/g), "a");
    r = r.replace(new RegExp(/æ/g), "ae");
    r = r.replace(new RegExp(/ç/g), "c");
    r = r.replace(new RegExp(/[èéêë]/g), "e");
    r = r.replace(new RegExp(/[ìíîï]/g), "i");
    r = r.replace(new RegExp(/ñ/g), "n");
    r = r.replace(new RegExp(/[òóôõö]/g), "o");
    r = r.replace(new RegExp(/œ/g), "oe");
    r = r.replace(new RegExp(/[ùúûü]/g), "u");
    r = r.replace(new RegExp(/[ýÿ]/g), "y");
    return r;
};

jQuery.fn.extractText = function () {
    return J(this).clone().children().remove().end().text();
}

function replaceAll(aFind, aReplace, aString) {
    return aString.replace(new RegExp(aFind, 'g'), aReplace);
}

Array.prototype.transpose || (Array.prototype.transpose = function () {
    if (!this.length) {
        return [];
    }

    if (this[0] instanceof Array) {
        var tlen = this.length,
            dlen = this[0].length,
            newA = new Array(dlen);
    } else {
        throw new Error("");
    }

    for (var i = tlen; i--;) {
        if (this[i].length !== dlen) throw new Error("Index Error!");
    }

    for (var i = 0; i < dlen; ++i) {
        newA[i] = [];
        for (var j = 0, l = tlen; j < l; j++) {
            newA[i][j] = this[j][i];
        }
    }

    return newA;
});

function getStringLength(aString, aMargin, aBold) {
    if (isEmpty(aString))
        return 0;

    aString = "" + aString;
    aBold = getValue(aBold, false);
    var characters = aString.split(new RegExp("[.]*", "g")),
        iLenght = getValue(aMargin, 0),
        iAdd = aBold ? 0.5 : 0;

    characters.forEach(function (aLetter) {
        switch (aLetter) {
            case " ":
            case "f":
            case "i":
            case "j":
            case "l":
            case ":":
            case "!":
            case ",":
            case ";":
            case ".":
                iLenght += 3;
                break;
            case "m":
            case "w":
            case "_":
            case "@":
                iLenght += 9;
                break;
            default:
                if (aLetter == aLetter.toUpperCase()){
                    iLenght += 9;
                } else
                    iLenght += 6;
                break;
        }
        iLenght += iAdd;
    });
    return iLenght;
}

function removeLineBreakInSpecificElement(aHtml, aElementType) {
    var div = J("<div></div>");
    div.append(aHtml);

    var elements = div.find(aElementType);

    J.each(elements, function (i, aElement) {
        var sElement = J(aElement).html(),
            sElementTemp = "";
        sElement = sElement.replace(/<p>/g, "");
        sElement = sElement.replace(/<\/p>/g, "");
        var arr = sElement.split("\n");

        J.each(arr, function (i, aLine) {
            sElementTemp += aLine;
            var bOk = false;
            if (i > 0 && i < arr.length - 1) {
                var sCurrentLastCharacter = aLine.substr(aLine.length - 1, 1),
                    sNextCharacter = arr[i + 1].substr(0, 1);

                if (sNextCharacter != "<" && sCurrentLastCharacter != ">")
                    bOk = true;
            }
            if (bOk)
                sElementTemp += "\n";
        });
        aHtml = aHtml.replace(J(aElement).html(), sElementTemp);
    });
    return aHtml;
}

function removeForbiddenCharacters(aValue) {
    if (isEmpty(aValue) || !isAssigned(aValue))
        return aValue;

    aValue = aValue.replace(/<script/g, "&lt;script");
    aValue = aValue.replace(/</g, "&lt;");
    aValue = aValue.replace(/>/g, "&gt;");
    aValue = aValue.replace(/\|/g, "");

    return aValue;
}

function getFormatedString(aValue) {
    if (isEmpty(aValue) || !isAssigned(aValue))
        return aValue;

    aValue = "" + aValue;
    aValue = aValue.replace(/&lt;/g, "<");
    aValue = aValue.replace(/&gt;/g, ">");
    aValue = aValue.replace(/&#60;/g, "<");
    aValue = aValue.replace(/<br>/g, "\n");
    aValue = aValue.replace(/&amp;/g, "&");

    return aValue;
}

function getUniqueId() {
    return new Date().getTime();
}

String.prototype.startsWith = String.prototype.startsWith || function (searchString, position) {
    position = position || 0;
    return this.substr(position, searchString.length) === searchString;
};

function getMaxValue(aInt, aMax) {
    return aInt > aMax ? aMax : aInt;
}

function containStr(aStr, aSubStr) {
    return aStr.indexOf(aSubStr) > -1;
}

function containStrRegex(aStr, aSubStr) {
    return aStr.search(new RegExp(aSubStr)) > -1
}

//function returning true, false or undefined according to a abValue
function getbValue(abValue) {
    if (abValue == abTrue)
        return true;
    else if (abValue == abFalse)
        return false;
    else
        return undefined;
}

function getabValue(aValue) {
    if (aValue)
        return abTrue;
    else if (aValue != undefined)
        return abFalse;
    else
        return abUndefined;
}