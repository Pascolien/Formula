"use strict";
/**
 * @class : Link Data for one cell in a TableView -> inherits from CTableViewData
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.dhxGrid *** Mandatory ***
        aSettings.idRow *** Mandatory ***
        aSettings.idColumn *** Mandatory ***
        aSettings.sType *** Mandatory ***
        aSettings.sValue
 * @returns CTableViewDataLink object.
 */

var CTableViewDataLink = function (aSettings) {
    // privileged variables, spécific to Tree
	this.idOTTree;
	this.sOldIdsTreeChecked;
	this.sIdsTreeChecked;
	this.iTreeCheckType;
	this.bFilteredLink;
	this.idParentLink;
	this.bStrongFilter;
	
	CTableViewData.call(this, aSettings);
}

//inheritage
CTableViewDataLink.prototype = createObject(CTableViewData.prototype);
CTableViewDataLink.prototype.constructor = CTableViewDataLink; // Otherwise instances of CTableViewDataLink would have a constructor of CTableViewData

CTableViewDataLink.prototype.edit = function () {
    var self = this;

    var stopEditLink = function (aIdInput, aResult) {
        if (aIdInput == 'btnValidForm') {
            var rCell = self.dhxGrid.cells(self.idRow, self.idColumn);
            var rTree = aResult.tree;
            var sIdsObjectsChecked = rTree.getCheckedIds();
            if (sIdsObjectsChecked != self.sIdsTreeChecked) { // data checked changed
                var sNewValue = rTree.getCheckedNames("<s>");
                rCell.setValue(replaceAll("<s>", " ; ", sNewValue));
                self.sIdsTreeChecked = sIdsObjectsChecked; // Update Ids of data checked
                self.sNewValue = sNewValue;
                self.tableView.afterEditCell(self);
            }
        } // else cancel edit
    }

    // init settings for popup edition
    var settings = {
        idOT: this.idOTTree,
        idsObjectChecked: this.sIdsTreeChecked,
        checkType: this.iTreeCheckType,
        idParent: this.idParentLink,
        bStrongFilter: this.bStrongFilter
    }
    // manage filtered links
    if (this.bFilteredLink) {
        settings.jFilteredLink = this.getFilteredLinkAttLinkableObjects();
    }
    // Call popup edition specific to Tree link
    var editWindow = new CLinkTree(settings, stopEditLink);
}

CTableViewDataLink.prototype.refreshDataFromAttributesCell = function (aValue) {
    CTableViewData.prototype.refreshDataFromAttributesCell.call(this, aValue);

    var dhxCell = this.dhxGrid.cells(this.idRow, this.idColumn);
    this.idOTTree = dhxCell.getAttribute('idOT');
    this.sOldIdsTreeChecked = dhxCell.getAttribute('idsLkd');
    this.sIdsTreeChecked = this.sOldIdsTreeChecked;
    this.iTreeCheckType = dhxCell.getAttribute('checkType');
    this.bFilteredLink = dhxCell.getAttribute('bFilteredLink');
    this.idParentLink = dhxCell.getAttribute('idParent');
    this.bStrongFilter = dhxCell.getAttribute('bStrongFilter');
}

CTableViewDataLink.prototype.getFilteredLinkAttLinkableObjects = function () {
    var self = this,
        jObjectsFiltered;
    J.ajax({
        url: sPathFileTableViewAjaxASP,
        async: false,
        cache: false,
        dataType: "html",
        data: {
            sFunctionName: "GetFilteredLinkAttLinkableObjects",
            idTable: self.tableView.idTable,
            idRow: self.idRow,
            idColumn: self.idColumn
        },
        success: function (data) {
            var arrResult = data.split('|');
            if (arrResult[0] == 'ok') {
                // get objects filtered
                var jResults = JSON.parse(arrResult[1]);
                J.each(jResults, function (aIndex, aObj) {
                    if (aObj.bNoNeedUpdate)
                        return true;
                    jObjectsFiltered = aObj;
                });
            } else {
                msgError(arrResult[0]);
            }
        }
    });
    return jObjectsFiltered;
}