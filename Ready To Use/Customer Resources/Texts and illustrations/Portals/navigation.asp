<!DOCTYPE>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">
<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<!-- #include virtual="/code/includes/includeCommon.asp" --> 

    <script type="text/javascript">
        J(function () {
            var idBusinessView = getValue('<%=request("id_bv")%>', 0),
                idOT = getValue('<%=request("id_ot")%>', 0),
                idOTExport = getValue('<%=request("ID_OTExport")%>', 0),
                idObject = getValue('<%=request("id_obj")%>', 0),
                idTab = getValue('<%=request("ID_Tab_Att")%>', 0),
                idAdvancedCreation = getValue('<%=request("ID_acs")%>', 0),
                idRequirementSet = getValue('<%=request("id_mcs")%>', 0),
                idApplicationModel = getValue('<%=request("ID_ma")%>', 0),
                idChoiceGuide = getValue('<%=request("id_cg")%>', 0);

            if (idChoiceGuide > 0) { // display choice guide window
                parent.txASP.displayChoiceGuide(idChoiceGuide);
                parent.txASP.selectCurrentObject();
            } else if (idRequirementSet > 0) { // display multi-criterion selection window
                parent.txASP.displayMCS({ idOT: idOT, idRequirementSet: idRequirementSet });
                parent.txASP.selectCurrentObject();
            } else if (idApplicationModel > 0) { // execute an application model
                parent.txASP.executeApplicationModel({
                    ID: idApplicationModel
                }, parent.txASP.getSelectedObjectIds(), (idOT === 0) ? parent.txASP.idOT : idOT);
				parent.txASP.selectCurrentObject();
            } else if (idOTExport > 0) { // display exportation window
                parent.txASP.displayExportation(idOTExport, 0);
                parent.txASP.selectCurrentObject();
            } else if (idAdvancedCreation > 0) { // execute an advanced creation
                parent.txASP.executeAdvancedCreation(idAdvancedCreation);
                return;
            } else if (idOT > 0) { // display an object type
                parent.txASP.displayViewFromIdOT(idOT);
                return true;
            } else if (idBusinessView > 0) { // display a business view
                parent.txASP.displayBusinessView(idBusinessView);
                return;
            } else if (idObject > 0) { // display an object in object type view
                parent.txASP.displayObject(idObject, idTab);
                return;
            }
        });

    </script>
</head>
<body>
</body>
</html>
