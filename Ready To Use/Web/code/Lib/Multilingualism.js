var jTranslation = {};

function getKey(aValue) {
    var sKey = "";

    J.each(jTranslation, function (aKey, aElement) {
        if (aElement == aValue) {
            sKey = aKey;
            return;
        }
    });
    return sKey;
}

function _(aKey) {
    if (aKey == null) 
        return;

    return getValue(jTranslation[aKey],aKey);   
}

function _Fmt(aKey, aParams) {
    return format(_(aKey), aParams);
}

function translateElement(aElement) {
    if (isEmpty(aElement))
        return;

    rElement = J(aElement);
    if (!isEmpty(rElement.attr("title"))) {
        rElement.attr("title", _(rElement.attr("title")));
    }

    switch (aElement.tagName.toLowerCase()) {
        case "option":
            sToTrad = rElement.extractText();
            sTrad = _(sToTrad);
            if (sToTrad == sTrad)
                return;

            sKey = getKey(sTrad);

            sNewHTML = rElement.html().replace(sKey, sTrad);
            rElement.html(sNewHTML);
            break;
        case "div":
        case "td":
		case "fieldset":
		case "th":
        case "label":
        case "a":
        case "textarea":
        case "button":
        case "legend":
        case "span":
        case "h1":
        case "h2":
			sToTrad = rElement.extractText();
            sTrad = _(sToTrad);
            if (sToTrad == sTrad)
                return;

            sKey = getKey(sTrad);
 
			sNewHTML = rElement.html().replace(sKey, sTrad);
            sNewHTML = replaceAll(sKey, sTrad, rElement.html());
			
            rElement.html(sNewHTML);
			
            rElement.find('*').each(function () {
                translateElement(this);
            });
			break;
        case "input":
            rElement.val(_(rElement.val()));
            break;
    }
}

function translate(aParentHTML) {
    if (isEmpty(aParentHTML))
        rParent = J(document.body);
    else {
        rParent = J("#" + aParentHTML);
        translateElement(document.getElementById(aParentHTML));
    }
    rParent.find('*').not("br").each(function () {
        translateElement(this);
    });
}

function translateExt(aArrIds) {
    J.each(aArrIds, function (aIndex, aId) {
        translate(aId);
    })
}
