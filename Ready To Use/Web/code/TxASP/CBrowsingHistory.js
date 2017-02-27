/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
       aSettings.idObject 
        aSettings.idTab.
        
 * @returns CBrowsingHistory object.
 */

var currentBH;

var CBrowsingHistory = function (aSettings) {
    aSettings = getValue(aSettings, {});
    this.idObject = getValue(aSettings.idObject, 0);
    this.idTab = getValue(aSettings.idTab, 0);
    this.bhNext;
    this.bhPrev;
};

CBrowsingHistory.prototype.toString = function() {
    return "CBrowsingHistory";
}

CBrowsingHistory.prototype.update = function (aIdObject, aIdTab) {
    if ((aIdObject == this.idObject && aIdTab == this.idTab) || (aIdObject == 0 || aIdTab == 0))
        return;

    this.bhNext = null;

    if (this.idObject != 0 && this.idTab != 0) {
        this.bhNext = new CBrowsingHistory({ idObject: aIdObject, idTab: aIdTab});
        this.bhNext.bhPrev = this;
        currentBH = this.bhNext;
    } else {
        this.idObject = aIdObject;
        this.idTab = aIdTab;
    }
}

function checkNextBrowsingHistory() {
    return isAssigned(currentBH.bhNext);
}

function checkPrevBrowsingHistory() {
    return isAssigned(currentBH.bhPrev);
}

function retrieveNextBrowsingHistory() {
    currentBH = currentBH.bhNext;
    if (!isAssigned(currentBH))
        return;
    else
        return { idObject: currentBH.idObject, idTab: currentBH.idTab};
}

function retrievePrevBrowsingHistory() {
    currentBH = currentBH.bhPrev;
    if (!isAssigned(currentBH))
        return;
    else
        return { idObject: currentBH.idObject, idTab: currentBH.idTab };
}

function updateBrowsingHistory(aIdObject, aIdTab) {
    currentBH.update(aIdObject, aIdTab);
}

function resetBrowsingHistory() {
    currentBH = null;
    currentBH = new CBrowsingHistory();
}