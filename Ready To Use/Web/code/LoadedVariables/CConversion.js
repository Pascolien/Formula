function CConversion(aSettings) {
    this.fA = aSettings.fA;
    this.fB = aSettings.fB;
    this.idUnitDest = aSettings.ID_Unit_Dest;
    this.idUnitSrc = aSettings.ID_Unit_Src;
}

CConversion.prototype.execute = function (aIdUnitSrc, aIdUnitDest, aValue) {
    if (!aValue) 
        return;
    else if (aIdUnitSrc == this.idUnitSrc)
        return this.fA * aValue + this.fB;
    else
        return (aValue - this.fB) / this.fA;
}

CConversion.prototype.isRelevant = function (aIdUnitSrc, aIdUnitDest) {
    return ((aIdUnitSrc == this.idUnitSrc) && (aIdUnitDest == this.idUnitDest)) || ((aIdUnitSrc == this.idUnitDest) && (aIdUnitDest == this.idUnitSrc));
}