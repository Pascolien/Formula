<%
    SELECT CASE (request("sFunctionName"))
        CASE "initInterface"
			API_ASP_TxASP.initInterface request("idOT"), request("idView"), request("idObject"), request("iRWMode"), sResult
            sResult = sResult & "|" & Session("iMajor") & "|" & Session("iMinor") & "|" & Session("iRelease") & "|" & Session("iRevision") & "|" & Session("sTxDate") & "|" & Session("iUserSessionId")
        CASE "getObjectIdOT"
			API_ASP_TxASP.getObjectIdOT request("idObject"), sResult
        CASE "getBusinessViewIdFromIdObject"
			API_ASP_TxASP.getBusinessViewIdFromIdObject request("idsView"), request("idObject"), sResult 
        CASE "getTabs"
			API_ASP_TxASP.getTabs request("idOT"), request("idObject"), request("idTab"), sResult 
        CASE "getFormTab"
			API_ASP_TxASP.getFormTab request("idObject"), request("idTab"), request("bPortals"), sResult 
        CASE "getMainToolbarButtonsState"
			API_ASP_TxASP.getMainToolbarButtonsState request("idOT"), request("iRWMode"), sResult 
        CASE "getFormSrcInfo"
			API_ASP_TxASP.getFormSrcInfo request("idObject"), request("idObjectSource"),request("idAttribute"),request("bSource"), sResult 
        CASE "openDocument"
			API_ASP_TxASP.openDocument request("idData"), sResult 
        CASE "getAdvancedCreation"
			API_ASP_TxASP.getAdvancedCreation request("idAdvancedCreation"), sResult 
        CASE "checkObjectLocked"
			API_ASP_TxASP.checkObjectLocked request("idObject"), request("iRWMode"), sResult 
        CASE "lockObject"
			API_ASP_TxASP.lockObject request("idObject"), sResult
        CASE "unlockObject"
			API_ASP_TxASP.unlockObject request("idObject"), sResult
        CASE "exportTable"
			API_ASP_TxASP.Get_Export_Table request("idAtt"), request("idObject"), sResult
        CASE "LoadConversions"
            API_ASP_TxASP.LoadConversions sResult
        CASE "GetOT"
            API_ASP_TxASP.GetOT request("idOT"),sResult
        CASE "GetObject"
            API_ASP_TxASP.GetObject request("idObject"),sResult
        CASE "WriteComparisonRequirementList"
            API_ASP_TxASP.WriteComparisonRequirementList request("idObject"), request("sIdsAtt"), request("idAdvancedComparison"), sResult
        CASE "getSessionTimeout"
            sResult = Session.Timeout
		CASE "HeartBeat"
            sResult = "ok"
    END SELECT 

    Response.Write sResult
%>