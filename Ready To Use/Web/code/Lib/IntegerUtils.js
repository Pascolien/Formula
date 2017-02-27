function round(aValue, aNbDecimals) {
    if (!parseInt(aNbDecimals))
        var aNbDecimals = 0;
    if (!parseFloat(aValue))
        return false;
    return Math.round(aValue * Math.pow(10, aNbDecimals)) / Math.pow(10, aNbDecimals);
}