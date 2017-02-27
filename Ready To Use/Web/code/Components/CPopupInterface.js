/**
 * @class : display a notification message for a few seconds
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.sHtmlContent *** MANDATORY ***
        aSettings.iWidth
        aSettings.iHeight
        aSettings.bHideCloseButton
        aSettings.bModalScreen
        aSettings.buttons [
                            { id: '', text: '', cssClass: '', style:"", title="", customAttrs:"" onClick: function(){}, bDisabled: true }
                          ]
 * @returns CPopupInterface object.
 */

var CPopupInterface = function (aSettings, aCallBack, aDummyData) {
    var self = this;
    this.uniqueId = getUniqueId();
    this.iWidth = ("iWidth" in aSettings) ? aSettings.iWidth : 610;
    this.iHeight = ("iHeight" in aSettings) ? aSettings.iHeight : 350;
    this.bHideCloseButton = getValue(aSettings.bHideCloseButton, false);
    this.callBack = aCallBack;
    this.bModalScreen = getValue(aSettings.bModalScreen, false);
    this.sHtmlPopup = '<div id="popupInterface' + this.uniqueId + '" class="popupInterface" style="display:none; height: ' + (this.iHeight) + 'px; width: ' + this.iWidth + 'px;">' +
                        '<div id="mainContainerPopup' + this.uniqueId + '" class="mainContainerPopup" style="height: ' + this.iHeight + 'px;">' +
                            '<div id="contentPopup' + this.uniqueId + '" class="contentPopup"></div>' +
                            '<div id="btnsContainerPopup' + this.uniqueId + '" class="btnsContainerPopup">' +
		                        '<button id="btnCancelPopup' + this.uniqueId + '" class="btnActionsPopup icon-close">' + _("Fermer") + '</button>' +
	                        '</div>' +
                            '<div id="layoutPopup' + this.uniqueId + '" class="layoutPopup"></div>' +
                        '</div>' +
                        '<div id="popupInterfaceModalScreen' + this.uniqueId + '" class="modalScreen"></div>' +
                    '</div>';

    J(document.body).append(this.sHtmlPopup);
    this.layout = J("#layoutPopup" + this.uniqueId);

    this.dhxPopup =  new dhtmlXPopup();
    this.dhxPopup.attachObject("popupInterface" + this.uniqueId);
    this.dhxPopup.attachEvent("onBeforeHide", function () {
        return false; // prevent auto close when just click outside popup. "onBeforeHide" is not triggered when "hide" method is explicitly called
    });
    // Override padding property of dhtmlx popup. 
    J("#popupInterface" + this.uniqueId).closest("td.dhx_popup_td")[0].style.setProperty('padding', '0px', 'important');

    if (this.bModalScreen)
        J("#popupInterfaceModalScreen" + this.uniqueId).show();

    // Manage close button
    if (this.bHideCloseButton)
        J("#btnCancelPopup" + this.uniqueId).hide();
    else
        J("#btnCancelPopup" + this.uniqueId).click(function () {
            self.remove();
        });

    // Add Buttons
    if (aSettings.buttons) {
        aSettings.buttons.forEach(function (button) {
            self.addButton(button);
        });
    } else if (this.bHideCloseButton) {
        J("#btnsContainerPopup" + this.uniqueId).hide();
        J("#contentPopup" + this.uniqueId).height('100%');
    }

    // Add content
    J("#contentPopup" + this.uniqueId).append(aSettings.sHtmlContent);
};

CPopupInterface.prototype.addButton = function (aButton) {
    var idButton = '' + aButton.id + this.uniqueId;
    var sHtmlButton = '<button id="' + idButton + '" class="btnActionsPopup ' + aButton.cssClass + '" style="' + getValue(aButton.style) + '" title="'+getValue(aButton.title)+'" '+getValue(aButton.customAttrs)+'>' + aButton.text + '</button>';
    J("#btnsContainerPopup" + this.uniqueId).append(sHtmlButton);

    if (aButton.bDisabled)
        J("#" + idButton).prop("disabled", "disabled");

    if (aButton.onClick)
        J("#" + idButton).click(function () {
            aButton.onClick();
        });
}

CPopupInterface.prototype.showPopup = function (aObjectClicked) {
    this.x = getAbsoluteLeft(aObjectClicked),
    this.y = getAbsoluteTop(aObjectClicked),
    this.w = aObjectClicked.offsetWidth,
    this.h = aObjectClicked.offsetHeight;

    this.dhxPopup.show(this.x, this.y, this.w, this.h);
}

CPopupInterface.prototype.hidePopup = function (aCallback) {
    this.dhxPopup.hide();
    if (aCallback)
        aCallback();
}

CPopupInterface.prototype.toggle = function (aCallback) {
    if (this.dhxPopup.isVisible())
        this.hidePopup();
    else
        this.dhxPopup.show(this.x, this.y, this.w, this.h);

    if (aCallback)
        aCallback(this.dhxPopup.isVisible());
}

CPopupInterface.prototype.remove = function () {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    if (this.dhxPopup.unload)
        this.dhxPopup.unload();

    if (this.callBack) this.callBack();
}

CPopupInterface.prototype.progressOn = function () {
    this.layout.show();
}

CPopupInterface.prototype.progressOff = function () {
    this.layout.hide();
}

CPopupInterface.prototype.disableButton = function (aIdButton, aState) {
    var bDisabled = getValue(aState, true);
    if (bDisabled)
        J("#" + aIdButton + this.uniqueId).prop("disabled", "disabled");
    else
        J("#" + aIdButton + this.uniqueId).prop("disabled", false);
}