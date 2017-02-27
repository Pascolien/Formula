function txAjax(aPathFileAjax, aRequest, aRaiseResponse) {
    var response = {};
    var raiseException = false;
    if (aRaiseResponse !== null)
        raiseResponse = aRaiseResponse;
    new J.ajax({
        url: aPathFileAjax,
        type: "POST",
        async: false,
        dataType: "json",
        cache: false,
        data: {
            request: JSON.stringify(aRequest)
        },
        success: function (aData) {
            response = aData;
            if (response.sStatus === "ko") {

            }
        },
        error: function (a, b, c) {
            response.sStatus = sKo;
            response.error = {};
            response.error.a = a;
            response.error.b = b;
            response.error.c = c;
        }
    });
    if ((raiseResponse) && (response.sStatus === sKo))
        msgWarning(response.error.sMessage);

    return response;
}