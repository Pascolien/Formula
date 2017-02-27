<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//FR"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">
<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <title></title>
    <link type="text/css" href="<%=Session("sIISApplicationName")%>/temp_resources/models/TxObjects/css/TxObjects.css" rel="stylesheet" />	
    <script type="text/javascript" src="<%=Session("sIISApplicationName")%>/temp_resources/models/TxObjects/js/CModifyObjects.js?v=<%=Session("iRevision")%>" > </script>

    <script type="text/javascript">
        var initCallBackMA = initCallBackMA || {};

        //Initializing the inputs container which will be sent to all functions
        var inputs = {
            idOT: '<%=request("var0")%>',
            sTagTableView: '<%=request("var1")%>', // string ID of table view ("sId" in XML file)
            sAttributesTags: '<%=request("var2")%>', // Attributes to selected by default in tree (and to be displayed in form(s))
            sModifyAttributes: '<%=request("var3")%>', // "Yes" : user can modify the list of Attributes, "No": he can't
            sSourceObjectTag: '<%=request("var4")%>', // Object source to get default values for attributes in form
            sModifySourceObject: '<%=request("var5")%>', // "Yes" : user can modify the source object, "No": he can't
            bNForms: '<%=request("var6")%>', // "Yes" : display 1 form per object to modify, "No": display 1 form for all objects to modify
            sModifyRepeatForm: '<%=request("var7")%>', // "Yes" : user can modify the repeatability of form, "No": he can't
            bIgnoreRights: (getValue('<%=request("var8")%>', 'No') == 'Yes') ? true : false, // "Yes" : user can modify all attributes in forms, "No" : it depends on Rights give to the user
        }

        // init function to get callback function
        initCallBackMA['<%=request("sIdsMaAndObj")%>'] = function (aCB, aDD) {
            var modifyObj = new CModifyObjects(inputs, aCB, aDD);
        }
    </script>
</head>
<body>
    <!--#include virtual="/temp_resources/models/TxTableView/include_webTableView_filters.asp"-->
</body>
</html>

