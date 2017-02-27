<%
Function GetSubstringCount(strToSearch, strToLookFor, bolCaseSensative)
  If bolCaseSensative then
    GetSubstringCount = UBound(split(strToSearch, strToLookFor))
  Else
    GetSubstringCount = UBound(split(UCase(strToSearch), UCase(strToLookFor)))
  End If
End Function

Dim tillbaka
tillbaka = Request.ServerVariables("HTTP_REFERER")

file = Request.ServerVariables("SCRIPT_NAME")
file=Right(file, Len(file) - InStrRev(file, "/"))


Dim huvud, kontroll, imgPath
imgPath = "/Pictures"
huvud = "/Pictures"
kontroll = Server.MapPath(huvud)


Dim mapp1, mapp2, mapp3
IF Len(Request("kat")) <> 0 AND Not Request("kat") = "huvud" then
mapp1 = huvud & "/" & Request("kat")
ELSE
mapp1 = huvud
END IF
session("kat")=Request("kat")
mapp2 = Server.MapPath(mapp1)

	if not file="upload.asp" then
		session("mapp2")=mapp2
	end if

'mappen frroot
down=GetSubstringCount(mapp1, "../", False)*3
fromright=Len(mapp1)-down
'mappFromRoot = Right(mapp1,fromright)
mappFromRoot = imgPath

'filtyper osm ska visas
strAccept=".gif .jpg .jpeg .bmp .png"

' Skapar ett FileSystemObject
Dim filer, mapp, undermapp, undermapp2
Set filer = Server.CreateObject("Scripting.FileSystemObject")

' Kollar om mappen existerar, g򲠤en inte det skapas den
If  Not filer.FolderExists(kontroll) Then
filer.CreateFolder(kontroll)
End If

' Kod f radera mappar
IF Request("vad") = "raderamapp" then
rad = huvud & "\" & Request("mapp") & "\"
radera = Server.MapPath(rad)
Set radera2 = filer.GetFolder(radera)
radera2.Delete [true]
IF bekrafta = "ja" then
Session("messe") = "Mappen raderad."
END IF
Response.Redirect tillbaka

' Kod f radera filer
ELSEIF Request("vad") = "raderafil" then
rad = huvud & "\" & Request("fil") & "\"
radera = Server.MapPath(rad)
Set radera2 = filer.GetFile(radera)
radera2.Delete [true]
IF bekrafta = "ja" then
Session("messe") = "Filen raderad."
END IF
Response.Redirect tillbaka
END IF

Set mapp = filer.getFolder(mapp2)
Set undermapp = mapp.SubFolders  
Set undermapp2 = mapp.SubFolders   
%>