<!--#include file="connection.asp" -->
<!-- #include virtual="/code/asp/clsUplFich.asp" -->
<%
	' Uppladdningskoden
	If Request("do") = "upload" Then

		Dim MonUpload
		Set MonUpload = New UplFichier
		
		Dim ASP_FileName
			ASP_FileName = Session("FileName")
		
		NouveauNom_Tmp =  ASP_FileName
		MonUpload.NouveauNom =  NouveauNom_Tmp
		
		MonUpload.Dossier = Server.MapPath("\Pictures\") & "\" '..\..\..
		MonUpload.SauveFichier(1)

		Response.Redirect file & "?uploaded=true"
	END IF
%>
<%
	Dim ASP_JS_Selection
	ASP_JS_Selection = Session("JS_Selection")
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//FR"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<%=Session("sLanguageCode")%>" lang="<%=Session("sLanguageCode")%>">
<head>
    <title>upload form</title>

    <!-- #include virtual="/code/includes/includeCommon.asp" -->
    <script src="js/TxImage.js?v=<%=Session("iRevision")%>" type="text/javascript"></script>	

    <script type="text/javascript">
        function uploaded(){
	        <%if request("uploaded")="true" then%>
	        self.parent.fileWindow.location.reload(true);
	        var JS_Selection= "<%= ASP_JS_Selection %>" ;
	        self.parent.showPreviewImage(JS_Selection);
	        <%end if%>
        }
        function showerror(){

        }
        function doSubmit(){
	        if (document.frmUpload.file.value.length > 0) {
		        document.frmUpload.submit();
	        }
        }
        function DoOnChange(AValue){
	        JS_Picture_Name = AValue; 
	        selection(); 
	        doSubmit();
        }
    </script>
</head>
<body style="margin:0px;" onload="uploaded();showerror();">

<%
	Response.Write "<form name='frmUpload' method='post' enctype='multipart/form-data'"
	Response.Write "action='upload.asp?do=upload"
	IF Len(Session("kat")) <> 0 then 
		Response.Write "&kat=" & Request("kat") & "\"
	END IF
	Response.Write "'>"
	Response.Write "<input type='file' name='file' size='15' onchange='DoOnChange(this.value);' />"
	Response.Write "</form>"
%>
</body>
</html>