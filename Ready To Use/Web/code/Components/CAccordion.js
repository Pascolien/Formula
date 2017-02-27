/**
 * @class : display a accordion
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.sIdDiv *** MANDATORY ***
        aSettings.items [
                            { id: '', text: '', iIcon: '', cssClass: '', sHtmlContent: '', onActive: function(aId) {} }
                          ]
 * @returns CAccordion object.
 */

var CAccordion = function (aSettings, aCallBack, aDummyData) {
    var self = this;
    this.sIdDiv = aSettings.sIdDiv;
    this.items = aSettings.items;
    this.uniqueId = getUniqueId();
    this.sHtmlItem = "";
    
    this.items.forEach(function (item) {
        self.sHtmlItem += "<div id='accItem" + item.id + "' class='accItem " + ((item.cssClass) ? item.cssClass : "") + "' idItem='" + item.id + "'>\
                            <div class='accItemLabel'>" + (("iIcon" in item) ? "<img src='/temp_resources/theme/img/png/" + item.iIcon + ".png' height='16' width='16'>" : "") + "<span class='" + (("iIcon" in item) ? "accLabelWithIcon" : "") + "'>" + item.text + "</span><div class='accItemArrow'></div></div>\
                            <div class='accItemContentArea'>" + ((item.sHtmlContent) ? item.sHtmlContent : "") + "</div>\
                         </div>";   
    });
    J("#" + this.sIdDiv).append(this.sHtmlItem);

    // attanch events
    J("#" + this.sIdDiv).on("click", "div.accItemLabel", function () {
        J(".accItemContentArea").hide();
        J(".accItemLabel").removeClass("accItemActive");
        J(this).addClass("accItemActive");
        J(this).next().show();

        // check if we need to execute the "onActive" event
        var id = J(this).parent().attr("idItem");
        var item = self.items.filter(function (aItem) {
            return aItem.id == id;
        });
        if (item[0].onActive) {
            item[0].onActive(id);
        }
    });
};

CAccordion.prototype.addItem = function (aItem) {
    this.items.push(aItem);
    var sHtmlItem = "<div id='accItem" + aItem.id + "' class='accItem " + ((aItem.cssClass) ? aItem.cssClass : "") + "' idItem='" + aItem.id + "'>\
                        <div class='accItemLabel'>" + (("iIcon" in aItem) ? "<img src='/temp_resources/theme/img/png/" + aItem.iIcon + ".png' height='16' width='16'>" : "") + "<span class='" + (("iIcon" in aItem) ? "accLabelWithIcon" : "") + "'>" + aItem.text + "</span><div class='accItemArrow'></div></div>\
                        <div class='accItemContentArea'>" + ((aItem.sHtmlContent) ? aItem.sHtmlContent : "") + "</div>\
                     </div>";
    J("#" + this.sIdDiv).append(sHtmlItem);

}

CAccordion.prototype.setContentToItem = function (aId, aContent) {
    J("#accItem" + aId).children(".accItemContentArea").first().html(aContent);
}

CAccordion.prototype.openItem = function (aId) {
    J("#accItem" + aId).children(".accItemLabel").first().trigger("click");
}

CAccordion.prototype.removeItem = function (aId) {
    J("#accItem" + aId).remove();
}

CAccordion.prototype.clear = function () {
    J("#" + this.sIdDiv).html("");
}