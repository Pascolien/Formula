<%
    select case (request("sFunctionName"))
        case "Init"
            Response.Write(Session("sLanguageCode"))
        case "getApplicationName"
            Response.Write(Session("sIISApplicationName"))
        case "logout"
            Session.Abandon
        case else
            Response.Write("The function '" & request("sFunctionName") & "' is not handled")
    end select

%>