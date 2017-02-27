
function openClientMail(aMails) {
    var iFrame = J('<iframe id="hiddenFrame" style="display:none"></iframe>')
    J(document.body).after(iFrame);
    iFrame[0].contentWindow.location.href = 'mailto:' + aMails;
    setTimeout(function () { J(iFrame).remove(); }, 100);
}