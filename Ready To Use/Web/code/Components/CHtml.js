/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param
        aSettings.sIdDiv *** MANDATORY ***
        aSettings.sType *** MANDATORY ***
        aSettings.id *** MANDATORY ***
        aSettings.class
        aSettings.ArrHtmlTag
        aSettings.Children
 * @returns CHtml object.
 */

var CHtml = function (aSettings) {
    this.html = "";

    this.initialize(aSettings);
};
CHtml.prototype.initialize = function (aSettings) {
    function setHtmlAttribute(aElement, aKey, aValue) {
        var ClasseAttr = document.createAttribute(aKey);
        ClasseAttr.value = aValue;
        aElement.setAttributeNode(ClasseAttr);
    }
    var self = this;
    if (aSettings !== undefined && aSettings.length > 0) {
        J.each(aSettings, function (key, HtmlObject) {
            if (HtmlObject.sType !== '') {

                var htmlElement = document.createElement(HtmlObject.sType);

                if (HtmlObject.id) {
                    setHtmlAttribute(htmlElement, "id", HtmlObject.id);
                }
                if (HtmlObject.class) {
                    setHtmlAttribute(htmlElement, "class", HtmlObject.class);
                }

                if (HtmlObject.title) {
                    setHtmlAttribute(htmlElement, "title", _(HtmlObject.title));
                }

                if (HtmlObject.ArrHtmlTag !== undefined && HtmlObject.ArrHtmlTag !== {}) {
                    J.each(HtmlObject.ArrHtmlTag, function (key, value) {
                        setHtmlAttribute(htmlElement, key, (["src", "href"].indexOf(key.toLowerCase()) > -1) ? _url(value) : value);
                    });
                }
                self.html = htmlElement;
                document.getElementById(HtmlObject.sIdDiv).appendChild(self.html);
                if (HtmlObject.Children !== undefined && HtmlObject.Children.length > 0) {
                    
                    J.each(HtmlObject.Children, function (key, value) {
                        value.sIdDiv = HtmlObject.id;
                    });
                    var ChildElement = new CHtml(HtmlObject.Children);
                }
            }
        });
    }
    return true;
}
CHtml.prototype.getHtml = function () {
    var self = this;
    return self.html.outerHTML;
}