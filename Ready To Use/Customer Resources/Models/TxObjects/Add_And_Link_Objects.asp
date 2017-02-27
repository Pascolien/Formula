<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//FR"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">
<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />

    <script type="text/javascript">
        var rResultsAddAndLink = new Object();
        var rCallBackAAL, rDummyDataAAL;
        var initCallBackMA = initCallBackMA || {};

        //Initializing the inputs container which will be sent to all functions
        var inputs = {
            idObject: '<%=request("var0")%>',
            sTagAttDirectLink: '<%=request("var1")%>',
            sExistingLinkManagement: '<%=request("var2")%>',
            iNbObjectsToAdd: '<%=request("var3")%>',
            iNbMaxObjectsToAdd: '<%=request("var4")%>',
            sAdvCreationTag: '<%=request("var5")%>',
            bNForms: '<%=request("var6")%>',
            sCreationOrDuplication: '<%=request("var7")%>',
            sDuplicationSourceType: '<%=request("var8")%>',
            sSourceLnkAttTags: '<%=request("var9")%>',
            sSourceObjectsTags: '<%=request("var10")%>',
            sAdvDuplicationTag: '<%=request("var11")%>',
            bAllowSwitchCreation: '<%=request("var12")%>',
            sErrorMsg: '<%=Replace(request("var13"),"'","\\'")%>',
            sMandatoryAttTags: '<%=request("var14")%>',
            sRepeatValueAttTags: '<%=request("var15")%>',
            sFocusLinkObject: getValue('<%=request("var16")%>', "No"),
            bIgnoreRights: (getValue('<%=request("var17")%>', 'No') == 'Yes') ? true : false
        }

        // init function to get callback function
        initCallBackMA['<%=request("sIdsMaAndObj")%>'] = function (aCB, aDD) {
            rCallBackAAL = aCB;
            rDummyDataAAL = aDD;
            initializeAddAndLinkObjects(inputs, endAddAndLink);
        }

        // function to execute callBack when the Add&Link is finished
        function endAddAndLink(aCancel) {
            rDummyDataAAL.cancel = aCancel;
            rCallBackAAL(rResultsAddAndLink, rDummyDataAAL);
        }
    </script>
</head>
<body>
</body>
</html>

