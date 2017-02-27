<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//FR"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">
<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />

    <script type="text/javascript">
        var rResultsAddObj = [];
        var rCallBackAddObj, rDummyDataAddObj;
        var initCallBackMA = initCallBackMA || {};

        //Initializing the inputs container which will be sent to all functions
        var inputs = {
            idObject: '<%=request("var0")%>',
            idOT: '<%=request("var1")%>',
            iNbObjectsToAdd: '<%=request("var2")%>', // 0 : ask to user
            iNbMaxObjectsToAdd: '<%=request("var3")%>', // 0 : ask to user
            sAdvCreationTag: '<%=request("var4")%>', // Default : comportement par défaut, None: création standard forcée 
            bNForms: getValue('<%=request("var5")%>',"Yes"), // Yes : 1 formulaire par entités, No : 1 formulaire pour toutes les entités
            sCreationOrDuplication: '<%=request("var6")%>', // string "Creation" ou "Duplication"
            sDuplicationSourceType: '<%=request("var7")%>', // "SelectedObjects", "LkdObjects" (entité liée à l'entitée sélectionneée), "Tags", "Identifiers"
            sSourceLnkAttTags: getValue('<%=request("var8")%>',sNull), // if "LkdObjects" : string of Att to get object to duplicate ("attTestType;attTestTemplates")
            sSourceObjectsTags: getValue('<%=request("var9")%>',sNull), // if "Tags" : tags of objects to duplicate ("objTemplate1;objTemplate2")
            sAdvDuplicationTag: '<%=request("var10")%>', // Default : comportement par défaut, None: duplication standard forcée
            bAllowSwitchCreation: ('<%=request("var11")%>') ? '<%=request("var11")%>' : true, // if no entity to duplicate
            sErrorMsg: '<%=Replace(request("var12"),"'","\\'")%>',
            sMandatoryAttTags: '<%=request("var13")%>',
            sRepeatValueAttTags: '<%=request("var14")%>',
            sFocusObject: getValue('<%=request("var15")%>', "Yes"),
            bIgnoreRights: (getValue('<%=request("var16")%>', 'No') == 'Yes') ? true : false,
            sSourceObjectsIDs: sNull, // if "Identifiers" : ids of objects to duplicate ("1234;1235;1236")
            sIdsAttributesToDuplicate: sNull,
            arrSelectedObjects: []
        }

        // init function to get callback function
        initCallBackMA['<%=request("sIdsMaAndObj")%>'] = function (aCB, aDD) {
            rCallBackAddObj = aCB;
            rDummyDataAddObj = aDD;
            initializeAddObjects(inputs);
        }

        // function to execute callBack when the AddObjects is finished
        function endAddObjetcs(aResult, aDummyData) {
            if (aDummyData && aDummyData.sMsgObjectsAdded) {  // display message information
                msgWarning(aDummyData.sMsgObjectsAdded);
            }
			if (aDummyData)
                rDummyDataAddObj.cancel = aDummyData.cancel;
            rCallBackAddObj(rResultsAddObj, rDummyDataAddObj);
        }
    </script>
</head>
<body>
</body>
</html>

