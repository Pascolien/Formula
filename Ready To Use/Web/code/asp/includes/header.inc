<!-- #include file="charset.inc" -->
<!-- #include virtual="/resources/theme/configuration.asp" -->
<!-- #include virtual="/temp_resources/theme/configuration.asp" -->
	
<!-- #include file="definition_variable_origine.inc" --><%
	IF Session("ID_Login") = "" AND request("Utilisateur") = "" THEN %> 
		
		<script language="JavaScript" type="text/javascript">
		<%		
		IF request("id_e") = "" AND request("id_te") = ""  THEN %>
				try {
					Popup_Alert("La session a expiré, veuillez vous reconnecter.");
				} catch (e) {
				
				}
				if (window.parent != '') {
					window.parent.location.replace("../../default.asp");
					window.close();
				} else {
					//top.location.href("../../default.asp");
				} <%
		
		ELSE %>
				if (window.parent != '') {
					window.parent.location.replace("../../default.asp");
				} <%
				
		END IF %>
		
		</script><%
		
		'response.end()
	END IF
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//FR"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr" <% IF (Session("Mode_debug") = "false") THEN %> oncontextmenu="return fct_contextmenu();" <% END IF %>>
<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<title><%=Session("sTabTitle")%></title>
	<script src="<%=Session("sIISApplicationName")%>/code/Lib/jquery.js" type="text/javascript" language="JavaScript"></script>
 	<script src="<%=Session("sIISApplicationName")%>/code/js/framework_bassetti.js" type="text/javascript" language="JavaScript"></script>
	<script type="text/javascript">Mode_Debug = "<%=Session("Mode_debug")%>"; var J = jQuery.noConflict();</script>	
	<link href="<%=Session("sIISApplicationName")%>/resources/theme/css/teexma.css" 	rel="stylesheet" type="text/css" />
	<link href="<%=Session("sIISApplicationName")%>/temp_resources/theme/css/teexma.css" 	rel="stylesheet" type="text/css" />
</head>
		<body <% IF (Session("Mode_debug") = "false") THEN %> oncontextmenu="fct_contextmenu();" <% END IF %>>
