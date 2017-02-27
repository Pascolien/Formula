//class CGroup
function CGroup(aSettings, aDummydata) {
    var self = this;

    this.field = aSettings.field,
    this.childrenFields = getValue(aSettings.childrenFields, []);
    this.bChildrenMaxSize = false;
    this.bOCG = getValue(aSettings.bOCG, false);
    this.settings = aSettings;
    if (aSettings.htmlDiv)
        this.initDomElement();

    CField.call(this, aSettings, null, aDummydata);
}

CGroup.prototype = createObject(CField.prototype);
CGroup.prototype.constructor = CGroup;

CGroup.prototype.toString = function(){
    return "CGroup";
}

CGroup.prototype.initDomElement = function () {
    var self = this;

    this.sIdDivParent = J(this.settings.htmlDiv).attr('id');
    this.sId = this.sIdDivParent.replace("group", "divGroup");
    J("#" + this.sIdDivParent + " > legend").click(function () {
        var sState = "block"
        if (J("#" + self.sId).css("display") == "block")
            sState = "none";

        J("#" + self.sId).css("display", sState);
    });
}

CGroup.prototype.show = function () {
    CField.prototype.show.call(this);

    this.updateChildrenVisibility(true);
}

CGroup.prototype.hide = function (aRecursive) {
    aRecursive = getValue(aRecursive, true);
    CField.prototype.hide.call(this);

    if (aRecursive)
        this.updateChildrenVisibility(false);
}

CGroup.prototype.updateChildrenVisibility = function (aVisible) {
    var self = this,
        bAdjustComponentSize = false,
        fieldsToModify = [],
        indexesToDelete = [];

    //transform objects into fields
    if (aVisible) {
        this.childrenFields.forEach(function (aField, i) {
            if (!isAssigned(aField)) // this condition must be deleted when all attributes type will be manage
                return true;

            //update child group
            if (!(aField instanceof CGroup) && !aField.bInitialized) {
                //initialize the field in case of open close visible for the first time
                fieldsToModify.push(aField.formTab.createField(aField.field));
                indexesToDelete.push(i);
                bAdjustComponentSize = true;
            }
        });

        if (indexesToDelete.length > 0) {
            //remove objects and replace them by fields
            indexesToDelete.reverse();
            indexesToDelete.forEach(function (aIndex) {
                self.childrenFields.splice(aIndex, 1);
            });
        }
    }

    //create new fields
    this.childrenFields.forEach(function (aField) {
        if (!isAssigned(aField)) // this condition must be deleted when all attributes type will be manage
            return true;

        //update child group
        if (aField instanceof CGroup) {
            if (aVisible && !aField.bInitialized) {
                aField.formTab.createFieldGroup(aField.field);
                aField.settings.htmlDiv = aField.htmlDiv;
                aField.initDomElement();

                if (aField.bOCG)
                    aField.hide(false);
            }

            if (!aField.bOCG)
                aField.updateChildrenVisibility(aVisible);
        } else {
            //initialize the field in case of open close visible for the first time
            if (aVisible && !aField.bInitialized) {
                fieldsToModify.push(aField.formTab.createField(aField.field));
                bAdjustComponentSize = true;
            }

            if (aVisible && inArray(["CLinkAttribute"], aField.toString()))
                aField.reInit();
        }        
    });

    if (bAdjustComponentSize)
        this.formTab.adjustComponentSize();

    this.updateFieldsState(aVisible);
}

CGroup.prototype.updateFieldsState = function (aVisible) {
    //set fields to delete mode if it's group is hidden
    this.childrenFields.forEach(function (aField) {
        if (!isAssigned(aField)) // this condition must be deleted when all attributes type will be manage
            return true;

        //update child group
        if (aField instanceof CGroup) {
            aField.updateFieldsState(aVisible);
        } else {
            aField.bVisible = aVisible;
            aField.bDelete = !aVisible;
            if (!isEmpty(aField.sValue)) {
                aField.bUpdate = aVisible;
            }
        }
    });
}

CGroup.prototype.applyMandatoryCss = function () {
    var bApplyCss = false,
        sColor = "";

    this.childrenFields.find(function (aField) {
        if (aField.bMandatory) {
            bApplyCss = true;
            return true;
        } else if (aField.toString() == "CGroup") {
            if (J("#" + aField.sIdDivParent + " legend").first().attr("sColor") == "red") {
                bApplyCss = true;
                return true;
            }
        }
    });

    sColor = bApplyCss ? "red" : getValue(this.sColor, "black");
    J("#" + this.sIdDivParent + " legend").first().css("color", sColor);
    J("#" + this.sIdDivParent + " legend").first().attr("sColor", sColor);
    if (this.fieldGroup)
        this.fieldGroup.applyMandatoryCss(this.fieldGroup);
}