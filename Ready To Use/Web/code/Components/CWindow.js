/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.sName *** MANDATORY ***
        aSettings.iWidth 
        aSettings.iHeight
        aSettings.sIcon : the header icon.
        aSettings.sHeader : the wdow header name.
        aSettings.sImgPath
        aSettings.sSkin : the dhtmlx skin name, "dhx_skyblue" by default.
        aSettings.bDenyResize
        aSettings.bHidePark
        aSettings.bHideClose
        aSettings.bModal
        aSettings.sUrlAttached : attaching an url to a file in a iframe.
        aSettings.sHTMLAttached : attaching html code in the wdow.
        aSettings.sObjectAttached : attaching div id to the wdow.
        aSettings.onMaximize : the javascript function to call when a window is maximized.
        aSettings.onMinimize : the javascript function to call when a window is minimized.
        aSettings.onResizeFinish : the javascript function to call when resize window finish. 
        aSettings.onContentLoaded : the javascript function to call when url content is loaded. 
        aCallBack
        aDummyData
 * @returns CWindow object.
 */

var CWindow = function (aSettings, aCallBack, aDummyData) {
    var self = this,
        setting = getValue(aSettings, {}),
        sImgPath = getValue(setting.sImgPath, _url("/")),
        bNewContainer = getValue(setting.bNewContainer, false),
        sSkin = getValue(setting.sSkin, 'dhx_skyblue');

    this.windows = [];

    if (bNewContainer) {
        this.container = new dhtmlXWindows();
    } else {
        if (typeof dhxGlobalContainer === "undefined") {
            dhxGlobalContainer = new dhtmlXWindows();
        }
        this.container = dhxGlobalContainer;
    }
    this.container.attachEvent("onClose", function (aWin) {
        self.setLastWindowModale(false);
        
        if (isAssigned(aCallBack) && (aSettings.sName == aWin.getId()))
            aCallBack(getValue(aWin.close.arguments,[]));

        //delete the window in this.windows
        var iIndex = -1;
        self.windows.find(function (aWdow, i) {
            if (!isAssigned(aWdow.wdow))
                return false;

            if (aWdow.sId == aWin.getId()) {
                iIndex = i;
                return true;
            }
        });
        if (iIndex > -1)
            self.windows.splice(iIndex, 1);

        return true;
    });
    
    if (!isEmpty(sImgPath)){
		this.container.setImagePath(sImgPath);
	}
    this.container.setSkin(sSkin);

    if (!isEmpty(setting.onMaximize))
        this.container.attachEvent("onMaximize", setting.onMaximize);

    if (!isEmpty(setting.onMinimize))
        this.container.attachEvent("onMinimize", setting.onMinimize);

    if (!isEmpty(setting.onResizeFinish))
        this.container.attachEvent("onResizeFinish", setting.onResizeFinish);

    if (isAssigned(aSettings))
        this.addWindow(aSettings);
};

CWindow.prototype.toString = function() {
    return "CWindow";
}

CWindow.prototype.getWindow = function (aId) {
    return this.container.window(aId);
}

CWindow.prototype.getWindowLayout = function (aId) {
    var layout;

    this.windows.find(function (aWdow) {
        if (isAssigned(aWdow.wdow))
            if (aWdow.sId == aId) {
                layout = aWdow.layout;
                return true;
            }
    });

    return layout;
}

CWindow.prototype.addWindow = function (aSettings, aCallBack) {
    checkMandatorySettings(aSettings, ["sName"]);
    this.setOthersWindowModal(aSettings.sName, false);

    if (this.getWindow(aSettings.sName)) {
        this.getWindow(aSettings.sName).show();
        return this.getWindow(aSettings.sName);
    }

    var iWidth = getValue(aSettings.iWidth, 100),
        iHeight = getValue(aSettings.iHeight, 100),
        sIcon = getValue(aSettings.sIcon, ''),
        sHeader = getValue(aSettings.sHeader, 'Empty Header'),
        bDenyResize = getValue(aSettings.bDenyResize, false),
        bDisableClose = getValue(aSettings.bDisableClose, false),
        bDisablePark = getValue(aSettings.bDisablePark, false),
        bDisableResize = getValue(aSettings.bDisableResize, false),
        bHidePark = getValue(aSettings.bHidePark, false),
        bHideClose = getValue(aSettings.bHideClose, false),
        bModal = getValue(aSettings.bModal, true),
        wdow = this.container.createWindow(aSettings.sName, 0, 0, iWidth, iHeight);

    if (aCallBack)
        this.container.attachEvent("onClose", function (aWin) {
            if (aWin == wdow) {
                if (aSettings.sName == aWin.getId())
                    aCallBack(getValue(aWin.close.arguments, []));
            }

            return true;
        });

    if (!isEmpty(sIcon)) {
        wdow.setIcon(sIcon);
    }
    wdow.centerOnScreen();
    wdow.setText(sHeader);

    // we need firstly add this event before attach URL 
    if (!isEmpty(aSettings.onContentLoaded))
        this.container.attachEvent("onContentLoaded", aSettings.onContentLoaded);

    if (!isEmpty(aSettings.sUrlAttached))
        wdow.attachURL(aSettings.sUrlAttached);
    else if (!isEmpty(aSettings.sHTMLAttached))
        wdow.attachHTMLString(aSettings.sHTMLAttached);
    else if (!isEmpty(aSettings.sObjectAttached))
        wdow.attachObject(aSettings.sObjectAttached);

    if (bHidePark)
        wdow.button("park").hide();

    if (bHideClose)
        wdow.button("close").hide();

    if (bDenyResize) {
        wdow.denyResize();
        wdow.button("minmax1").hide();
    }

    if (bDisableClose)
        wdow.button("close").disable();

    if (bDisablePark)
        wdow.button("park").disable();

    if (bDisableResize)
        wdow.button("minmax1").disable();

    if (bModal)
        wdow.setModal(true);

    this.attachEvent("onXLE", function (win) {
        if (win == wdow)
            if (aCallback)
                aCallback();
    })
    this.windows.push({ wdow: wdow, sId: aSettings.sName });
    this.wdow = wdow;
    return wdow;
}

CWindow.prototype.setModal = function (aModal, aIdWdow) {
    var wdow;
    if (isAssigned(aIdWdow))
        wdow = this.getWindow(aIdWdow);
    else
        wdow = this.wdow;
    wdow.setModal(aModal);
}

CWindow.prototype.setVisible = function (aVisible, aIdWdow) {
    var wdow;
    if (isAssigned(aIdWdow))
        wdow = this.getWindow(aIdWdow);
    else
        wdow = this.wdow;

    if (aVisible)
        wdow.show();
    else
        wdow.hide();
}

CWindow.prototype.close = function () {
    this.wdow.close();
    return true;
}

CWindow.prototype.getWidth = function () {
    return this.wdow.getDimension();
}

CWindow.prototype.setWidth = function (aWidth) {
    this.wdow.setDimension(aWidth);
}

CWindow.prototype.setMinDimension = function (aMinWidth, aMinHeight) {
    this.wdow.setMinDimension(aMinWidth, aMinHeight);
}

CWindow.prototype.attachEvent = function (aEvent, aFunction) {
    this.container.attachEvent(aEvent, aFunction);
}

CWindow.prototype.attachLayout = function (aId, aLayoutPattern) {
    return this.getWindow(aId).attachLayout(aLayoutPattern);
}

CWindow.prototype.appendObject = function (aIdDiv) {
    this.wdow.appendObject(aIdDiv);
}

CWindow.prototype.attachHTMLString = function (aIdWindow,aHTML) {
    this.getWindow(aIdWindow).attachHTMLString(aHTML);
}

CWindow.prototype.setOthersWindowModal = function (aIdWindow, aModal) {
    var windowsIds = getValue(aIdWindow, "").split(";"),
        self = this;

    aModal = getValue(aModal, true);

    if (aModal)
        windowsIds.forEach(function (aIdWdow) {
            self.getWindow(aIdWdow).setModal(false);
        });
    this.container.forEachWindow(function (aWdow) {
        if (!inArray(windowsIds, aWdow.getId())) {
            aWdow.setModal(aModal);
        }
    });
}

CWindow.prototype.setOthersWindowVisibility = function (aIdWindow, aVisible) {
    var windowsIds = getValue(aIdWindow, "").split(";");

    aVisible = getValue(aVisible, true);

    this.container.forEachWindow(function (aWdow) {
        if (!inArray(windowsIds, aWdow.getId())) {
            if (aVisible)
                aWdow.show();
            else
                aWdow.hide();
        }
    });
}

CWindow.prototype.setLastWindowModale = function () {
    var wdow = this.windows[this.windows.length - 2];

    if (isAssigned(wdow)) {
        if (!isAssigned(wdow.wdow))
            return;

        if (inStr(wdow.sId, "txDragnDrop"))
            wdow = this.windows[this.windows.length - 3];
        this.setOthersWindowModal(wdow.sId,false);
        wdow.wdow.setModal(true);
    }
}

CWindow.prototype.unload = function () {
    this.container.unload();
}