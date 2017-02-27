/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings.sCheckType
        aSettings.idOT
        aSettings.sIdsObjectChecked,
        aSettings.filteredObjects,        
        aSettings.wdowContainer
        aSettings.onValidate
 * @returns CTxAddAssociative object.
 */

function CTxAddAssociative(aSettings) {
    var self = this;

    this.wdowContainer = aSettings.wdowContainer;
    this.sDivName = 'idDivAddAssociative';
    this.sCheckType = aSettings.sCheckType;
    this.idOT = aSettings.idOT;
    this.rOT = getOT(this.idOT);
    this.sIdsObjectChecked = aSettings.sIdsObjectChecked;
    this.onValidate = aSettings.onValidate;
    this.filteredObjects = aSettings.filteredObjects;
    this.bFilteredTree = aSettings.bFilteredTree;
    this.sIdDiv = aSettings.sIdDivGrid;
    this.bStrongFilter = aSettings.bStrongFilter;
    this.bFullOT = aSettings.bFullOT;
    
    setTimeout(function () { self.initInterface()},100)
}

CTxAddAssociative.prototype.initInterface = function () {
    var self = this,
        mainDiv = J("<div id='" + this.sIdDiv + "Main' style='/*margin:5px;*/'></div>"),
        sHTML =
            '<div style="margin:5px;">' +
                '<div id="idDivTreeAsso"></div>' +
                '<div id="idDivToolbarAsso"></div>'+
            '</div>'+
            '<div id="idDivButtonBarAsso"></div>';
    mainDiv.append(sHTML);

    J(document.body).append(mainDiv);

    windowSettings = {
        sName: "wAddAssociative",
        sHeader: _Fmt("Ajouter des liens '#1'", [this.rOT.sName]),
        sIcon: 'temp_resources/theme/img/btn_titre/module_extract-16.png',
        iWidth: 450,
        iHeight: 310,
        bDenyResize: true,
        bHidePark: true,
        sObjectAttached: this.sIdDiv + "Main"
    };

    if (isAssigned(this.wdowContainer))
        this.wAddAssociative = this.wdowContainer.addWindow(windowSettings);
    else
        this.wAddAssociative = new CWindow(windowSettings);

    this.treeAsso = new CTreeObject({
        idOT: this.idOT,
        filteredObjects: this.filteredObjects,
        sIdDivTree: "idDivTreeAsso",
        sIdDivToolbar: "idDivToolbarAsso",
        sCheckType: this.sCheckType,
        sIdsChecked: this.sIdsObjectChecked,
        sIdsDisabled: this.sIdsObjectChecked,
        bKeepTreeVisu : true,
        bEnableContextMenu: true,
        bFolderCheckable: false,
        bFilteredTree: this.bFilteredTree,
        bFullOT: this.bFullOT,
        bEnableEdition: true,
        bStrongFilter: this.bStrongFilter,
        wdowContainer: this.wdowContainer,
        onCheckAll: function () { self.checkValidForm() },
        onUnCheckAll: function () { self.checkValidForm() },
        onCheck: function () { self.checkValidForm() }
    });

    this.buttonBar = new CButtonBar({
        btns: [
            { sId: "idBtnValidateAsso", sCaption: _("Valider"), onClick: function () { self.validate() } },
            { sId: "idBtnCloseAsso", sCaption: _("Annuler"), onClick: function () { self.close() } }
        ],
        sIdDivParent: 'idDivButtonBarAsso'
    });

    this.checkValidForm();
}

CTxAddAssociative.prototype.toString = function() {
    return "CTxAddAssociative";
}

CTxAddAssociative.prototype.checkValidForm = function () {
    var bIsObjectChecked = this.treeAsso.isObjectChecked();
    if (bIsObjectChecked)
        this.buttonBar.enableButton("idBtnValidateAsso");
    else
        this.buttonBar.disableButton("idBtnValidateAsso");
}

CTxAddAssociative.prototype.validate = function () {
    var self = this,
        objects = [];

    this.treeAsso.checkedIds.forEach(function (aId) {
        if (!inArray(self.sIdsObjectChecked.split(";"), aId)) {
            var obj = self.treeAsso.getNodeFromTxId(aId);
            if (!isAssigned(obj))
                obj = { ID: parseInt(aId) }
            objects.push(obj);
        }
    });

    this.askFormType(objects);
}

CTxAddAssociative.prototype.askFormType = function (aObjects, aFormType) {
    var self = this;
    if (!aFormType) {
        if (aObjects.length > 0){
            if (aObjects.length > 1) {
                var sAsk = _Fmt("Indiquez le mode de saisie des #1 nouveaux liens '#2'", [aObjects.length, this.rOT.sName]),
                    sYes = _("Un formulaire"),
                    sNo = _Fmt("#1 formulaires", [aObjects.length]);
                msgYesNoExt(sAsk, { sYes: sYes, sNo: sNo }, function (aOk) {
                    if (aOk) {
                        self.askFormType(aObjects, aft1Form)
                    } else
                        self.askFormType(aObjects, aftNForm)
                });
            } else
                self.askFormType(aObjects, aftNForm)
            return;
        }
        aFormType = aftNoForm;
    } 

    this.onValidate(aObjects, aFormType);
    this.close();
}

CTxAddAssociative.prototype.close = function () {
    this.wAddAssociative.close();
}
