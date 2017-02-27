<html xmlns="http://www.w3.org/1999/xhtml">
<!--#include file="connection.asp" -->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>filebrowser</title>
<link href="css/file_browser.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />
<script src="js/TxImage.js?v=<%=Session("iRevision")%>" type="text/javascript"></script>	
	<script type="text/javascript">
	<!--
	function FileChosen(FileName)
	{
	// fill the path - textbox and show a preview of the image
	 self.parent.document.forms[0].elements['src'].value='<%=mappFromRoot%>' + "/" + FileName;
	 self.parent.showPreviewImage('<%=mappFromRoot%>' + "/" + FileName);
				
	}
	//-->
	</script>
</head>
<body>
<table width="100%" cellpadding="0" cellspacing="0">
  <tr> 
    <td width="19" colspan="4"> 
      <%
IF Len(Request("kat")) <> 0 then
%>
      <a href="javascript:history.go(-1)"><img src="img/up_folder.gif" width="19" height="19" border="0"/></a> 
      <%
END IF
%>
      </td>
  </tr>
  <%
' H岠h宴as alla undermappar
For Each under In undermapp
%>
  <tr> 
    <td width="19"> 
      <%
Response.Write "<img src='img\folder.gif' height='19' width='19'>"
%>
	</td>
    <td><a href="?kat=<%
	IF Len(Request("kat")) <> 0 then 
	Response.Write Request("kat") & "\"
	END IF
	Response.Write under.Name %>"> 
      <%Response.Write under.Name%>
      </a></td>
    <td align="right">
      <%
storlek = under.Size/1024
IF storlek > 1024 then
Response.Write Round(storlek/1024) & " Mb"
ELSEIF storlek > 1048576 then
Response.Write Round(storlek/1024/1024) & " Gb"
ELSE
Response.Write Round(storlek) & " Kb"
END IF
%>
    </td>
	<!--
	<td width="20" align="right">
	<a href="?vad=raderamapp&mapp=
	<%
	' IF Len(Request("kat")) <> 0 then 
	' Response.Write Request("kat") & "\"
	' END IF
	' Response.Write under.Name 
	%>
	"><img src="img/trashcan.gif"/></a>
	</td>-->
  </tr>
  <%Next%>
  <%
For Each filen In mapp.files

namn = LCase(filen.name)
IF Instr(namn,".") then
	Dim count 
	count = Len(namn) - Len(Replace(namn,".",""))
	
	arrNamn = Split(namn, ".", -1)
	IF count = 1 then 
		valde = arrNamn(1)
	END IF	
ELSE
	arrNamn = "ingen"
	valde = arrNamn
END IF
bild = "img/" & valde & ".gif"

IF NOT filer.FileExists(Server.MapPath(bild)) then
bild = "img/unknown.gif"
END IF

If Instr(strAccept, valde) OR strAccept = "*" then
%>
 <tr> 
    <td width="19"> 
		<img src="<%=bild%>" height="19" width="19"/>
    </td>
    <td><a href="javascript:FileChosen('<%=filen.Name%>');"> 
      <%=filen.name%>
      </a></td>
    <td align="right">
      <%
storlek = filen.Size/1024
IF storlek > 1024 then
Response.Write Round(storlek/1024) & " Mb"
ELSE
Response.Write Round(storlek) & " Kb"
END IF
%>
      </td>
	<!--
	 <td width="20" align="right"><a href="?vad=raderafil&fil=
	<%
	' IF Len(Request("kat")) <> 0 then 
	' Response.Write Request("kat") & "\"
	' END IF
	' Response.Write filen.Name 
	%>
	"><img src="img/trashcan.gif"/></a></td>
	-->
  </tr>
  <%
  END IF
  Next%>
</table>
</body>
</html>