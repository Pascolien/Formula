function downloadFile(aUri) {
    if (J('frame[name="frame_enregistrement"]', top.document)[0])
        J('frame[name="frame_enregistrement"]', top.document)[0].contentDocument.location.replace(_url("/code/asp/ajax/open_file.asp?file=") + Replace_For_URL(aUri));
    else {
        // another Tab : frame doesn't exist -> create new iframe (only if not already created)
        if (!J('#iFrameUploadExtract').length) {
            J('body').append('<iframe id="iFrameUploadExtract" name="iFrameUploadExtract" src="#" style="width:0;height:0;border:0px solid #fff; display:none;"></iframe>');
        }
        J('#iFrameUploadExtract')[0].contentDocument.location.replace(_url("/code/asp/ajax/open_file.asp?file=") + Replace_For_URL(aUri));
    }
}

function initializeExtractBtn(aTObjectsTree) {
    J("#extract").prop("disabled", (isEmpty(aTObjectsTree.getCheckedIds())) ? true : false);
}