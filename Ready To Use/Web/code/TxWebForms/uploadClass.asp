<!-- #include virtual="/code/asp/includes/fct_utf8.asp" -->
<!-- #include virtual="/code/asp/includes/charset.inc" -->
<!-- #include virtual="/code/asp/framework_bassetti.asp" -->
<%
' Option Explicit

' *****************************************************************************
' Cette Class a été réalisé par Nicolas SOREL ( Nix pour les intimes :) )
' Pour le site ASPFr.com
' Retrouvez d'autres scripts ASP sur www.ASPFr.com
' Vous avez le droit d'utiliser ce script dans vos pages mais si vous souhaitez
' l'exposer sur un autre site de programmation merci de me contacter
' (contact@vbfrance.com)
' *****************************************************************************

Class UplFichier

	Private ToutEnvoi

	Private VarFichierBin
	Private VarTailleFichier
	Private VarTailleBinFichier
	
	Private NomDesFichier()
	Private TailleDesFichier()
	Private NbDeFichiers
	Private LesFichiers()
	Private NomDesForm()
	Private CheminLocal
	Private CheminDistant()
	Private LocalNomFichier
	Private NomChampTXT()
	Private LesChampTXT()
	
	Private Property Let AjoutChampTXT(LeTxt)
		Redim Preserve LesChampTXT(Ubound(LesChampTXT) + 1)
		LesChampTXT(Ubound(LesChampTXT)) = LeTxt
	End Property

	Private Property Let AjoutChampNOM(LeNom)
		Redim Preserve NomChampTXT(Ubound(NomChampTXT) + 1)
		NomChampTXT(Ubound(NomChampTXT)) = LeNom
	End Property

	Private Property Let AjoutNomFichier(LeNom)
		Redim Preserve NomDesFichier(Ubound(NomDesFichier) + 1)
		NomDesFichier(Ubound(NomDesFichier)) = LeNom
	End Property

	Private Property Let AjoutTailleFichier(LaTaille)
		Redim Preserve TailleDesFichier(Ubound(TailleDesFichier) + 1)
		TailleDesFichier(Ubound(TailleDesFichier)) = LaTaille
	End Property

	Private Property Let AjoutCheminDistant(LeCheminDistant)
		Redim Preserve CheminDistant(Ubound(CheminDistant) + 1)
		CheminDistant(Ubound(CheminDistant)) = LeCheminDistant
	End Property

	Private Property Let AjoutFichier(LeFichier)
		Redim Preserve LesFichiers(Ubound(LesFichiers) + 1)
		LesFichiers(Ubound(LesFichiers)) = LeFichier
	End Property

	Private Property Let AjoutNomForm(LeNomForm)
		Redim Preserve NomDesForm(Ubound(NomDesForm) + 1)
		NomDesForm(Ubound(NomDesForm)) = LeNomForm
	End Property

	Public Property Let Dossier(LeDossier)
		CheminLocal = LeDossier
	End Property

	Public Property Let NouveauNom(NouvNomFichier)
		LocalNomFichier = NouvNomFichier
	End Property

	Public Function SauveFichier(Lequel)
		On Error Resume Next
		Dim fso, fs
		If LocalNomFichier = "" Then
			LocalNomFichier = NomDesFichier(Lequel)
		End If
		LocalNomFichier = RepareUTF8(LocalNomFichier)
		Set fso = CreateObject("Scripting.FileSystemObject")
		Set fs = fso.OpenTextFile(CheminLocal & LocalNomFichier, 2, True)
			If Err.Number <> 0 Then Response.Write "1-Erreur lors de l'écriture du fichier : " & CheminLocal & NomDesFichier(Lequel) & vbCrLf & Err.Description & "<br>":LocalNomFichier = "":Exit Function
			fs.Write LesFichiers(LeQuel)
			If Err.Number <> 0 Then Response.Write "2-Erreur lors de l'écriture du fichier : " & CheminLocal & NomDesFichier(Lequel) & vbCrLf & Err.Description & "<br>":LocalNomFichier = "":Exit Function
		Set fs = Nothing
		Set fso = Nothing
		LocalNomFichier = ""
	End Function

	Public Property Get ChampForm(Lequel)
		For i = 1 To UBound(NomChampTXT)
			If NomChampTXT(i) = Lequel Then
				ChampForm = LesChampTXT(i)
				Exit For
			End If
		Next
	End Property

	Public Property Get NomFichier(Lequel)
		NomFichier = CheminLocal & NomDesFichier(Lequel)
	End Property

	Public Property Get CheminFichierDistant(Lequel)
		CheminFichierDistant = CheminDistant(Lequel)
	End Property

	Public Property Get TailleFichier(Lequel)
		TailleFichier = TailleDesFichier(Lequel)
	End Property

	Public Property Get NomForm(Lequel)
		NomForm = NomDesForm(Lequel)
	End Property

	Public Property Get NbFichiers()
		NbFichiers = NbDeFichiers
	End Property

	Private Property Get HttpContentType()
		HttpContentType = Request.ServerVariables("HTTP_CONTENT_TYPE")
	End Property

	Public Property Get TypeFichier(Lequel)
		TypeFichier = TypeDeFichier(NomDesFichier(Lequel))
	End Property

	Public Property Get ExtensionFichier(Lequel)
		ExtensionFichier = Right(NomDesFichier(Lequel), Len(NomDesFichier(Lequel)) - InStrRev(NomDesFichier(Lequel),"."))
	End Property

	Private Function Preliminaires()
		VarFichierBin = Request.BinaryRead(Request.TotalBytes)
		VarTailleBinFichier = LenB(VarFichierBin)
	End Function

	Private Sub Class_Initialize()
		ReDim NomDesFichier(0)
		ReDim LesFichiers(0)
		ReDim TailleDesFichier(0)
		Redim NomDesForm(0)
		ReDim CheminDistant(0)
		Redim LesChampTXT(0)
		Redim NomChampTXT(0)
		CheminLocal = Session("sTmpDir") ' Server.MapPath(".\") & "\" ' Dossier d'upload par defaut
		LocalNomFichier = "" ' Nom du fichier si l'on souhaite forcer un autre nom que le fichier envoyé
		
 		Call Preliminaires
		Call LetsGOOOO
	End Sub

	Private Sub Class_Terminate()
		' J'ai mis ces lignes en commentaire car des fois, il me dit type incompatible ?!?
		'Set NomDesFichier = Nothing
		'Set LesFichiers = Nothing
		'Set TailleDesFichier = Nothing
	End Sub

	Private Function Upl2ADO()
		On Error Resume Next
		Upl2ADO = False
		Dim MonObjRs
		Set MonObjRs = CreateObject("ADODB.Recordset")
			MonObjRs.Fields.Append "TmpBin", 201, VarTailleBinFichier
			MonObjRs.Open
			MonObjRs.AddNew
			MonObjRs("TmpBin").AppendChunk VarFichierBin
			MonObjRs.Update
			ToutEnvoi = MonObjRs("TmpBin")
			MonObjRs.Close
		Set MonObjRs = Nothing
		If Err.Number <> 0 Then Response.Write "Erreur lors de l'upload du/des fichier(s) : " & vbCrLf & Err.Description & "<br>" : Exit Function
		Upl2ADO = True
	End Function

	Public Function LetsGOOOO()
		Dim LesLimites, LimitePosition
		Dim CompteFichier
		Dim DernierFichierDebut, DernierFichierFin, FichierEnCours
		Dim DebutNomFichier, FinNomFichier, NomDuFichier, DernierFichier
		Dim DebutFichier, FinFichier, DonneesDuFichier
		Dim LeContentType, TailleDuFichier, NomInput
		Dim EstFichier
		
		If Not VarTailleBinFichier > 0 Then
			Response.Write "Aucun fichier n'a été sélectionné"
			Exit Function
		End If

		If Upl2ADO = True Then
			' On Récupère l'entête HTTP
			LesLimites = HttpContentType

			' On met notre compteur de Fichier à 0
			CompteFichier = 0

			' On cherche les limites (les Boundaries)
		    LimitePosition = InStr(1, LesLimites, "boundary=") + 8
		    LesLimites = "--" & Right(LesLimites, Len(LesLimites) - LimitePosition)

			' ********************************************
			' ** Les choses sérieuses commencent ici :) **
			' ********************************************

			' On cherche le 1er fichier
			DernierFichierDebut = InStr(1, ToutEnvoi, LesLimites)
		    DernierFichierFin = InStr(InStr(1, ToutEnvoi ,LesLimites) + 1 , ToutEnvoi , LesLimites) - 1
			DernierFichier = False

			Do While DernierFichier = False
				FichierEnCours = Mid(ToutEnvoi, DernierFichierDebut, DernierFichierFin - DernierFichierDebut)
		    	DebutNomFichier = InStr(1, FichierEnCours, "filename=") + 10
		    	FinNomFichier = InStr(DebutNomFichier, FichierEnCours, Chr(34))
				
				' On vérifie que le champ du fichier n'est pas vide
		    	If DebutNomFichier <> FinNomFichier Then
					CompteFichier = CompteFichier + 1
					' On récupère le(s) nom(s) du/des champ(s) Input du formulaire
		    		NomInput = InStr(1, FichierEnCours, "name=""")
		    		If NomInput > 0 Then
		    			NomInput = Mid(FichierEnCours, NomInput + 6, InStr(NomInput + 6, FichierEnCours, """") - NomInput - 6)
		    		End If
					AjoutNomForm = NomInput
					
					' On récupère le chemin du fichier (distant) puis on extrait juste le non du fichier
		    		NomDuFichier = InStr(1, FichierEnCours, "filename=""")
					EstFichier = False
		    		If NomDuFichier > 0 Then
						EstFichier = True
		    			NomDuFichier = Mid(FichierEnCours, NomDuFichier + 10, InStr(NomDuFichier + 10, FichierEnCours, """") - NomDuFichier - 10)
		    		End If
				
					' Ici la petite astuce, on vérifie si cet "input" contient un Fichier
					If EstFichier = True Then
						AjoutCheminDistant = NomDuFichier
						NomDuFichier = Right(NomDuFichier, Len(NomDuFichier) - InStrRev(NomDuFichier,"\"))

						' On repère le début du fichier qui se trouve après le Content-Tpye
			    		LeContentType = InStr(1, FichierEnCours, "Content-Type:")
			    		If LeContentType > 0 Then
			    			DebutFichier = InStr(LeContentType, FichierEnCours, vbCrLf) + 4
			    		End If
			    		FinFichier = Len(FichierEnCours)

					    ' Calcul de la taille du fichier
			    		TailleDuFichier = FinFichier - DebutFichier

					    ' Recup. du fichier
			    		DonneesDuFichier = Mid(FichierEnCours, DebutFichier, TailleDuFichier)

						AjoutFichier = DonneesDuFichier
						AjoutNomFichier = NomDuFichier
						AjoutTailleFichier = Len(DonneesDuFichier) 'LaTaille

					Else
						' C'est ici que cela se passe pour récupérer les valeurs 
						' tapées dans un champ text, textaera, radio button, checkbox etc...
						CompteFichier = CompteFichier - 1
						DebutFichier = InStr(InStr(1, FichierEnCours, "name=""") + 6, FichierEnCours, """") + 5
			    		FinFichier = Len(FichierEnCours)

					    ' Calcul de la taille du texte
			    		TailleDuFichier = FinFichier - DebutFichier 

					    ' Recup. du texte
			    		DonneesDuFichier = Mid(FichierEnCours, DebutFichier, TailleDuFichier)

						AjoutChampNOM = NomInput
						AjoutChampTXT = DonneesDuFichier
					End If
				End If
				' On va au fichier suivant
				' On repère le début et la fin du fichier suivant
			    DernierFichierDebut = InStr(DernierFichierFin + 1, ToutEnvoi, LesLimites)
			    DernierFichierFin = InStr(DernierFichierDebut + 1 , ToutEnvoi, LesLimites) - 1
				If Not DernierFichierFin > 0 Then DernierFichier = True
			Loop
			NbDeFichiers = CompteFichier
			' ************************
			' ** La Fin du bazar :) **
			' ************************
			Response.write("{state: true, info: 'Fichier uploader avec succès'}")

		Else
			Response.Write "{state: false, info: 'Il y a eu une erreur lors de l'upload'}"
		End If

	End Function

	Private Function TypeDeFichier(LeFichier)
		Dim TmpExt
			TmpExt = Right(LeFichier, Len(LeFichier) - InStrRev(LeFichier,"."))
        Select Case LCase(TmpExt)
			Case "avi"
				TypeDeFichier = "video/avi"
            Case "asp"
                TypeDeFichier = "text/asp"
			Case "au"
				TypeDeFichier = "audio/basic"
			Case "dll"
				TypeDeFichier = "application/x-msdownload"
            Case "doc"
                TypeDeFichier = "application/msword"
            Case "doc"
                TypeDeFichier = "application/vnd.ms-excel"
            Case "exe"
                TypeDeFichier = "application/x-msdownload"
            Case "gif"
                TypeDeFichier = "image/gif"
            Case "html", "htm"
                TypeDeFichier = "text/html"
			Case "inp"
				TypeDeFichier = "text/plain"
            Case "jpg", "jpeg"
                TypeDeFichier = "image/jpeg"
            Case "log"
                TypeDeFichier = "text/plain"
			Case "mp3", "mp2"
				TypeDeFichier = "audio/mpeg"
			Case "mpg", "mpeg"
				TypeDeFichier = "video/mpeg"
            Case "png", "PNG"
                TypeDeFichier = "image/png"
            Case "pdf"
                TypeDeFichier = "application/pdf"
            Case "txt"
                TypeDeFichier = "text/plain"
            Case "xml"
                TypeDeFichier = "text/xml"
            Case "zip"
                TypeDeFichier = "application/x-compressed"
            Case "rar"
                TypeDeFichier = "application/x-rar-compressed"
			Case "wav"
				TypeDeFichier = "audio/x-wav"
			' Liste non exhaustive, vous pouvez en rajouter autant que vous voulez

            Case Else
                TypeDeFichier = "application/unknown"
        End Select
	End Function

End Class
%>