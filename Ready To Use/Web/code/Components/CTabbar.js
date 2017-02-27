/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.sIdDivTabbar *** MANDATORY ***
        aSettings.sSkin : the dhtmlx skin name, "dhx_light" by default.
        aSettings.sImgPath
        aSettings.tabs : Json columns parameters.
            tabs = [
                {ID:"", sName:"", iWidth:"", sContentZone:"the div id according to the tab", bActive:true/false, bHidden:true/false}
            ];
        aSettings.onSelect : the dhtmlx skin name, true by default.
 * @returns CTabbar object.
 */

var CTabbar = function (aSettings) {
	if (aSettings.sIdDiv)
        aSettings.sIdDivTabbar = aSettings.sIdDiv;
    checkMandatorySettings(aSettings, ["sIdDivTabbar"]);

    this.tabbar;
    this.sId = aSettings.sIdDivTabbar;
    this.tabs = [];

    var self = this,
        sImgPath = getValue(aSettings.sImgPath,_url('/resources/theme/img/dhtmlx/tabbar/')),
        sSkin = getValue(aSettings.sSkin, 'default');

    this.tabbar = new dhtmlXTabBar(this.sId);
    this.tabbar.setImagePath(sImgPath);
    this.tabbar.setSkin(sSkin);

    if (!isEmpty(aSettings.tabs))
        this.reloadFromTxObjects(aSettings.tabs);

    this.tabbar.attachEvent("onSelect", function (aId, aLastId) {
        if (!isEmpty(aSettings.onSelect))
            aSettings.onSelect(aId, aLastId);

        self.onSelect(aId, aLastId);
        setTimeout(function () { self.updateFirstAndLastTab(); }, 10);
        return true;
    });

    this.tabbar.attachEvent("onTabClick", function (aId) {
        self.onTabClick(aId);

        if (!isEmpty(aSettings.onTabClick))
            aSettings.onTabClick(aId);

        return true;
    });
};

CTabbar.prototype.reloadFromTxObjects = function (aTabs) {
    var self = this;

    this.clearAll();
    aTabs.forEach(function (aTab) {
        self.addTab(aTab.ID, aTab.sName, aTab.iWidth);

        if (!isEmpty(aTab.sContentZone))
            self.tabbar.setContent(aTab.ID, aTab.sContentZone);

        if (aTab.bActive)
            self.setTabActive(aTab.ID);

        if (aTab.bHidden)
            self.hideTab(aTab.ID);

        self.tabs.push(aTab);
    });
}

CTabbar.prototype.clearAll = function () {
    this.tabs = [];
    this.tabbar.clearAll();
}

CTabbar.prototype.getTab = function (aId) {
    var tab;

    this.tabs.find(function (aTab) {
        if (aTab.ID == aId) {
            tab = aTab;
            return true;
        }
    });

    return tab;
}

CTabbar.prototype.getTabName = function (aId) {
    var tab = this.getTab(aId);
    return tab ? tab.sName : this.tabs[0].sName;
}

CTabbar.prototype.getActiveTabId = function () {
    return this.tabbar.getActiveTab();
}

CTabbar.prototype.getActiveTab = function () {
    return this.getTab(this.getActiveTabId());
}

CTabbar.prototype.getActiveTabName = function () {
    return this.getTabName(this.getActiveTabId());
}

CTabbar.prototype.getAllTabs = function () {
    return this.tabbar.getAllTabs();
}

CTabbar.prototype.goToPrevTab = function () {
    this.tabbar.goToPrevTab();
}

CTabbar.prototype.goToNextTab = function () {
    this.tabbar.goToNextTab();
}

CTabbar.prototype.setSize = function () {
    this.tabbar.setSize();
}

CTabbar.prototype.adjustOuterSize = function () {
    this.tabbar.adjustOuterSize();
}

CTabbar.prototype.setContentTab = function (aIdTab, aIdDivAttached) {
    this.tabbar.setContentHTML(aIdTab, aIdDivAttached);
}

CTabbar.prototype.setCustomStyle = function (aIdTab, aColor, aColorInSelectedState) {
    this.tabbar.setCustomStyle(aIdTab, aColor, aColorInSelectedState);
}

CTabbar.prototype.addTab = function (aId, aName, aWidth, aPosition) {
    //to active in case of css rule not work in the future to manage tab width.
    //aWidth = getValue(aWidth, getStringLength(aName, 20));
    this.tabbar.addTab(aId, aName, aWidth, aPosition);
    this.tabs.push({ ID: aId, sName: aName, iWidth: aWidth});
}

CTabbar.prototype.hideTab = function (aId) {
    this.tabbar.hideTab(aId);
}

CTabbar.prototype.showTab = function (aId) {
    this.tabbar.showTab(aId);
}

CTabbar.prototype.disableTab = function (aId) {
    this.tabbar.disableTab(aId);
}

CTabbar.prototype.disableAllTabs = function () {
    var self = this;
    this.tabs.forEach(function (aTab) {
        self.disableTab(aTab.ID);
    });
}

CTabbar.prototype.enableTab = function (aId) {
    this.tabbar.enableTab(aId);
}

CTabbar.prototype.enableAllTabs = function () {
    var self = this;
    this.tabs.forEach(function (aTab) {
        self.enableTab(aTab.ID);
    });
}

CTabbar.prototype.setAllTabsEnable = function (aEnabled) {
    aEnabled = getValue(aEnabled, true);

    if (aEnabled)
        this.enableAllTabs();
    else
        this.disableAllTabs();
}

CTabbar.prototype.setTabActive = function (aId, aFireOnSelect) {
    this.tabbar.setTabActive(aId, getValue(aFireOnSelect, true));
}

CTabbar.prototype.attachEvent = function (aEventName, aFunction) {
    this.tabbar.attachEvent(aEventName, aFunction);
}

CTabbar.prototype.updateFirstAndLastTab = function (aId, aLastId) {
    function updateTab(aLeft) {
        aLeft = getValue(aLeft, true);

        var sPosition = aLeft ? "left" : "right",
            elScroll = J("#" + self.sId).find(".dhx_tab_scroll_" + sPosition),
            bScrollVisible = elScroll.length > 0;

        if (bScrollVisible) {
            var elChildren = J("#" + self.sId).find(".dhx_tabbar_row").children(),
                elTab = aLeft ? elChildren.first() : elChildren.eq(elChildren.length - 4),
                rgWidth = /width:[ 0-9]+px;/,
                sStyle = elTab.attr("style"),
                arrWidth = sStyle.match(rgWidth);

            if (isAssigned(arrWidth) && arrWidth.length > 0) {
                var sText = aLeft ? self.tabs[0].sName : self.tabs[self.tabs.length-1].sName,
                    iWidth = getStringLength(sText, 20, true);

                sStyle = sStyle.replace(arrWidth, format("width: #1px!important;", [iWidth]));
                elTab.attr("style", sStyle);
                elTab.children().last().css("width",iWidth+"px")
            }
        }
    }
    var self = this;

    updateTab();
    updateTab(false);    
}

CTabbar.prototype.onTabClick = function (aId) {

}

CTabbar.prototype.onSelect = function (aId) {

}