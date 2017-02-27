
function CDateTimeAttribute(aSettings, aDummydata) {
    this.bTime = true;
    CDateAttribute.call(this, aSettings, aDummydata);
}

CDateTimeAttribute.prototype.toString = function () {
    return "CDateTimeAttribute";
}

CDateTimeAttribute.prototype = createObject(CDateAttribute.prototype);
CDateTimeAttribute.prototype.constructor = CDateTimeAttribute;
