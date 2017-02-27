
function getObjectSize(aJson) {
    return Object.keys(aJson).length;
}

function mergeWebModelJsonInstructions(aFirstJsonInstructions, aNewJsonInstructions, aIdOT) {
    var iNewId,
        iOldId,
        idOT = getValue(aIdOT, 0); // if != 0 : treat instructions only on this idOT

    aNewJsonInstructions.forEach(function (aNewInstruction) {
        if ("updateObject" in aNewInstruction) {
            if (idOT !== 0 && aNewInstruction.updateObject.ID_OT !== idOT)
                return true;
            iNewId = aNewInstruction.updateObject.ID;
        } else
            return true;
        // filter array to remove instructions on same ID
        aFirstJsonInstructions = aFirstJsonInstructions.filter(function (aElement) {
            if ("updateObject" in aElement)
                iOldId = aElement.updateObject.ID;
            else
                return false;
            return iNewId !== iOldId;
        });
        aFirstJsonInstructions.push(aNewInstruction);
    });
    return aFirstJsonInstructions;
}