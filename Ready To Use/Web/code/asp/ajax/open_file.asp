<!-- #include virtual="/code/asp/includes/charset.inc" -->
<!-- #include virtual="/code/asp/framework_bassetti.asp" -->
<!-- #include virtual="/code/asp/includes/fct_utf8.asp" -->
<%
	bExtraction = False
	File = request("file")
	sMessage = request("file")
	File = Right(File, Len(File) - InStrRev(File, "\"))
	Extension = Right(File,4)
	IF Left(Extension,2) = "." THEN
		Extension = Right(Extension,2)
	ELSEIF Left(Extension,1) = "." THEN
		Extension = Right(Extension,3)
	END IF 
	ID_Temp0 = Left(Session("sTmpDir"), Len(Session("sTmpDir")) - 1) 
	ID_Temp = Right(ID_Temp0, Len(ID_Temp0) - InStrRev(ID_Temp0, "\"))
	sFilename = RepareUTF8("../../../temp/"& ID_Temp & "/" & File)
	sFile_Path = Session("sTmpDir") + File

	'Création de l'objet FSO
	Set FSO = Server.CreateObject("Scripting.FileSystemObject")	
	IF NOT FSO.FileExists(sFile_Path) THEN
		IF NOT FSO.FileExists(sMessage) THEN
			Response.Write sMessage
			Response.End()
		ELSE
			sFile_Path = sMessage
			bExtraction = True
	END IF	
	END IF	
	
	Function in_array(element, arr)
	  in_array = False
	  For i=0 To Ubound(arr)
		 If Trim(arr(i)) = Trim(element) Then
			in_array = True
			Exit Function      
		 End If
	  Next
	End Function
	
	popup_ext = Array("pdf")

	IF in_array(LCASE(Extension), popup_ext) AND not bExtraction  THEN %>
		<script type="text/javascript">
		    <% sFilename = RepareUTF8("../../../temp/"& ID_Temp & "/" & Replace_For_URL(File)) %>
			window.open('<%=sFilename%>' + "?v=" + new Date());																						
		</script><%
		 Response.End()
	ELSE
		IF trim(File)<>"" THEN  
              
			File = DeleteForbiddenCaracters(File)
			'Dialogue du téléchargement
			Response.AddHeader "content-disposition", "attachment; filename=""" & File & ""
			Response.ContentType = "application/octet-stream"

			'écriture du fichier				
			Set Stream = server.CreateObject("ADODB.Stream")
			Stream.Open
			Stream.Type = 1 
			Stream.LoadFromFile(sFile_Path)
			Response.flush	
			While not Stream.eos
				Response.BinaryWrite Stream.Read(32768)
				Response.flush
			Wend
			Stream.Close			
			Set Stream = Nothing			
			
			Response.End()					
		END IF
	END IF
	Set FSO = Nothing
%>	
