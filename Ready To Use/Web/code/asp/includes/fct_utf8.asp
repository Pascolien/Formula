<%
'option explicit 

' Simple functions to convert the first 256 characters 
' of the Windows character set from and to UTF-8.

' Written by Hans Kalle for Fisz
' http://www.fisz.nl

'IsValidUTF8
'  Tells if the string is valid UTF-8 encoded
'Returns:
'  true (valid UTF-8)
'  false (invalid UTF-8 or not UTF-8 encoded string)
function IsValidUTF8(s)
  dim i
  dim c
  dim n

  IsValidUTF8 = false
  i = 1
  do while i <= len(s)
    c = asc(mid(s,i,1))
    if c and &H80 then
      n = 1
      do while i + n < len(s)
        if (asc(mid(s,i+n,1)) and &HC0) <> &H80 then
          exit do
        end if
        n = n + 1
      loop
      select case n
      case 1
        exit function
      case 2
        if (c and &HE0) <> &HC0 then
          exit function
        end if
      case 3
        if (c and &HF0) <> &HE0 then
          exit function
        end if
      case 4
        if (c and &HF8) <> &HF0 then
          exit function
        end if
      case else
        exit function
      end select
      i = i + n
    else
      i = i + 1
    end if
  loop
  IsValidUTF8 = true 
end function

'DecodeUTF8
'  Decodes a UTF-8 string to the Windows character set
'  Non-convertable characters are replace by an upside
'  down question mark.
'Returns:
'  A Windows string
function DecodeUTF8(s)
  dim i
  dim c
  dim n

  i = 1
  do while i <= len(s)
    c = asc(mid(s,i,1))
    if c and &H80 then
      n = 1
      do while i + n < len(s)
        if (asc(mid(s,i+n,1)) and &HC0) <> &H80 then
          exit do
        end if
        n = n + 1
      loop
      if n = 2 and ((c and &HE0) = &HC0) then
        c = asc(mid(s,i+1,1)) + &H40 * (c and &H01)
      else
        c = 191 
      end if
      s = left(s,i-1) + chr(c) + mid(s,i+n)
    end if
    i = i + 1
  loop
  DecodeUTF8 = s 
end function

'EncodeUTF8
'  Encodes a Windows string in UTF-8
'Returns:
'  A UTF-8 encoded string
function EncodeUTF8(s)
  dim i
  dim c

  i = 1
  do while i <= len(s)
    c = asc(mid(s,i,1))
    if c >= &H80 then
      s = left(s,i-1) + chr(&HC2 + ((c and &H40) / &H40)) + chr(c and &HBF) + mid(s,i+1)
      i = i + 1
    end if
    i = i + 1
  loop
  EncodeUTF8 = s 
end function

function RepareUTF8(s)
	s = Replace(s,"Ã¹","à")
	s = Replace(s,"Ã¢","â")
	s = replace(s,"Ã ","à")
	s = replace(s,"Ã¤","ä")
	s = Replace(s,"Ã§","ç")
	s = Replace(s,"Ã©","é")
	s = Replace(s,"Ã¨","è")
	s = Replace(s,"Ãª","ê")
	s = replace(s,"Ã«","ë")
	s = replace(s,"Ã®","î")
	s = replace(s,"Ã¯","ï")
	s = Replace(s,"Ã´","ô")
	s = Replace(s,"Ã¶","ö")
	s = Replace(s,"Ã»","û")
	s = Replace(s,"Ã¹","ù")	
	s = Replace(s,"Ã¼","ü")	
	s = replace(s,"Â¤","¤")
	s = replace(s,"Â£","£")
	s = replace(s,"Âµ","µ")
	s = replace(s,"Â§","§")
	s = replace(s,"Â°","°")
    
	RepareUTF8 = s
end function

function encode_accents(texto)
	encode_accents = replace(texto,"é","&#233;")
end function

function encode_accents2(texto)
	If not isNull(texto) Then
		texto = Replace(texto, "¡", "&iexcl;")
		texto = Replace(texto, "¿", "&iquest;")
		texto = Replace(texto, "'", "&apos;")

		texto = Replace(texto, "á", "&aacute;")
		texto = Replace(texto, "é", "&eacute;")
		texto = Replace(texto, "í", "&iacute;")
		texto = Replace(texto, "ó", "&oacute;")
		texto = Replace(texto, "ú", "&uacute;")
		texto = Replace(texto, "ñ", "&ntilde;")
		texto = Replace(texto, "ç", "&ccedil;")

		texto = Replace(texto, "Á", "&Aacute;")
		texto = Replace(texto, "É", "&Eacute;")
		texto = Replace(texto, "Í", "&Iacute;")
		texto = Replace(texto, "Ó", "&Oacute;")
		texto = Replace(texto, "Ú", "&Uacute;")
		texto = Replace(texto, "Ñ", "&Ntilde;")
		texto = Replace(texto, "Ç", "&Ccedil;")

		texto = Replace(texto, "à", "&agrave;")
		texto = Replace(texto, "è", "&egrave;")
		texto = Replace(texto, "ì", "&igrave;")
		texto = Replace(texto, "ò", "&ograve;")
		texto = Replace(texto, "ù", "&ugrave;")

		texto = Replace(texto, "À", "&Agrave;")
		texto = Replace(texto, "È", "&Egrave;")
		texto = Replace(texto, "Ì", "&Igrave;")
		texto = Replace(texto, "Ò", "&Ograve;")
		texto = Replace(texto, "Ù", "&Ugrave;")

		texto = Replace(texto, "ä", "&auml;")
		texto = Replace(texto, "ë", "&euml;")
		texto = Replace(texto, "ï", "&iuml;")
		texto = Replace(texto, "ö", "&ouml;")
		texto = Replace(texto, "ü", "&uuml;")

		texto = Replace(texto, "Ä", "&Auml;")
		texto = Replace(texto, "Ë", "&Euml;")
		texto = Replace(texto, "Ï", "&Iuml;")
		texto = Replace(texto, "Ö", "&Ouml;")
		texto = Replace(texto, "Ü", "&Uuml;")

		texto = Replace(texto, "â", "&acirc;")
		texto = Replace(texto, "ê", "&ecirc;")
		texto = Replace(texto, "î", "&icirc;")
		texto = Replace(texto, "ô", "&ocirc;")
		texto = Replace(texto, "û", "&ucirc;")

		texto = Replace(texto, "Â", "&Acirc;")
		texto = Replace(texto, "Ê", "&Ecirc;")
		texto = Replace(texto, "Î", "&Icirc;")
		texto = Replace(texto, "Ô", "&Ocirc;")
		texto = Replace(texto, "Û", "&Ucirc;")
	Else
		texto = ""
	End If
	encode_accents = texto
End Function
%>