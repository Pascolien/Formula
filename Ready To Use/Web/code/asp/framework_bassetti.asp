<%
	'function returning a float value from a str date. The AValue parameter must be in "dd|mm|yyyy" format, and "dd|mm|yyyy|hh|mm|ss" if ATime is true.
	FUNCTION DateStrToFloat(AValue, ATime)
		Arr_Date = SPLIT(AValue,"|")

		sDay = Arr_Date(0)
		sMonth = Arr_Date(1)
		sYear = Arr_Date(2)
		
		'Converting the date into a double using the 1900 convention (the number of days since the 31/12/1899).
		fDate = cdbl(DateSerial(sYear,sMonth,sDay))

		IF ATime THEN
			sHour = Arr_Date(3)
			sMinute = Arr_Date(4)
			sSec = Arr_Date(5)
			fDate = fDate + cdbl(TimeSerial(sHour,sMinute,sSec))
		END IF
		
		DateStrToFloat = cstr(fDate)
	END FUNCTION
	
	FUNCTION Replace_For_JS(AString)
		AString = Replace(AString,"'","\'")
		AString = Replace(AString,";","")
		
		Replace_For_JS = AString
	END FUNCTION
	
	FUNCTION Replace_For_URL(AString)
		AString = Replace(AString,"%","%25")
		AString = Replace(AString," ","%20")
		AString = Replace(AString,"!","%21")
		AString = Replace(AString,"""","%22")
		AString = Replace(AString,"#","%23") 
		AString = Replace(AString,"$","%24")
		AString = Replace(AString,"&","%26")
		AString = Replace(AString,"'","%27")
		AString = Replace(AString,"(","%28")
		AString = Replace(AString,")","%29")
		AString = Replace(AString,"*","%2A")
		AString = Replace(AString,"+","%2B")
		AString = Replace(AString,",","%2C")
		AString = Replace(AString,"-","%2D")
		AString = Replace(AString,"/","%2F")
		AString = Replace(AString,":","%3A")
		AString = Replace(AString,";","%3B")
		AString = Replace(AString,"<","%3C")
		AString = Replace(AString,"=","%3D")
		AString = Replace(AString,">","%3E")
		AString = Replace(AString,"?","%3F")
		AString = Replace(AString,"@","%40")
		AString = Replace(AString,"[","%5B")
		AString = Replace(AString,"\","%5C")
		AString = Replace(AString,"]","%5D")
		AString = Replace(AString,"^","%5E")
		AString = Replace(AString,"_","%5F")
		AString = Replace(AString,"`","%60")
		AString = Replace(AString,"{","%7B")
		AString = Replace(AString,"|","%7C")
		AString = Replace(AString,"}","%7D")
		AString = Replace(AString,"~","%7E")			
		Replace_For_URL = AString
	END FUNCTION

    FUNCTION Replace_From_URL(AString)
		AString = Replace(AString,"%25","%")
		AString = Replace(AString,"%20"," ")
		AString = Replace(AString,"%21","!")
		AString = Replace(AString,"%22","""")
		AString = Replace(AString,"%23","#") 
		AString = Replace(AString,"%24","$")
		AString = Replace(AString,"%26","&")
		AString = Replace(AString,"%27","'")
		AString = Replace(AString,"%28","(")
		AString = Replace(AString,"%29",")")
		AString = Replace(AString,"%2A","*")
		AString = Replace(AString,"%2B","+")
		AString = Replace(AString,"%2C",",")
		AString = Replace(AString,"%2D","-")
		AString = Replace(AString,"%2F","/")
		AString = Replace(AString,"%3A",":")
		AString = Replace(AString,"%3B",";")
		AString = Replace(AString,"%3C","<")
		AString = Replace(AString,"%3D","=")
		AString = Replace(AString,"%3E",">")
		AString = Replace(AString,"%3F","?")
		AString = Replace(AString,"%40","@")
		AString = Replace(AString,"%5B","[")
		AString = Replace(AString,"%5C","\")
		AString = Replace(AString,"%5D","]")
		AString = Replace(AString,"%5E","^")
		AString = Replace(AString,"%5F","_")
		AString = Replace(AString,"%60","`")
		AString = Replace(AString,"%7B","{")
		AString = Replace(AString,"%7C","|")
		AString = Replace(AString,"%7D","}")
		AString = Replace(AString,"%7E","~")			
		Replace_For_URL = AString
	END FUNCTION
	
	FUNCTION Replace_From_URL(AString)
		AString = Replace(AString,"%25","%")
		AString = Replace(AString,"%20"," ")
		AString = Replace(AString,"ceciEstUnEspaceTeexmaBassetti"," ")
		AString = Replace(AString,"%23","#")
		AString = Replace(AString,"%26","&")
		AString = Replace(AString,"%28","(")
		AString = Replace(AString,"%29",")")
		AString = Replace(AString,"%40","@")
		AString = Replace(AString,"%5B","[")
		AString = Replace(AString,"%5D","]")
		AString = Replace(AString,"%5E","^")
		AString = Replace(AString,"%29",")")
		AString = Replace(AString,"%2B","+")
		AString = Replace(AString,"%2C",",")
		AString = Replace(AString,"%E8","è")
		AString = Replace(AString,"%E9","é")
		AString = Replace(AString,"%21","!")
		AString = Replace(AString,"%A4","¤")
		AString = Replace(AString,"%F9","ù")
		AString = Replace(AString,"%2F","/")
		AString = Replace(AString,"%3A",":")
		AString = Replace(AString,"%3B",";")
		AString = Replace(AString,"%3E",">")
		AString = Replace(AString,"%3F","?")
		AString = Replace(AString,"%7E","~")
		AString = Replace(AString,"%5C","\")
		AString = Replace(AString,"%7B","{")
		AString = Replace(AString,"%7D","}")
		Replace_From_URL = AString
	END FUNCTION
	
	FUNCTION DeleteForbiddenCaracters(AString)
		AString = Replace(AString,","," ")
		AString = Replace(AString,";"," ")
		
		DeleteForbiddenCaracters = AString
	END FUNCTION
	
	Function URLEncode(ByVal Data, CharSet)
		Dim ByteArray
		Set ByteArray = CreateObject("ScriptUtils.ByteArray")
		ByteArray.CharSet = CharSet

		ByteArray.String = Data

		If Len(Data) > 0 Then
			Dim I, C, Out

			For I = 1 To ByteArray.Length
				C = ByteArray(I)'Asc(Mid(Data, I, 1))
				If C = 32 Then
					Out = Out + "+"
				ElseIf C < 46 Or c>126 Then
					Out = Out + "%" + Hex(C)
				Else
					Out = Out + Chr(c)
				End If
			Next
			URLEncode = Out
		End If
	End Function
	
	
	SELECT CASE (request("sFunctionName"))
		CASE "DateStrToFloat"
			sResult = DateStrToFloat(request("sValue"),request("bTime"))
		CASE "Set_ID_Cell_Layout_Form"
			API_ASP_TxASP.Set_ID_Cell_Layout_Form request("ID_Cell"),sResult
		CASE "Get_Object_ID_OT"
			sResult = API_ASP_TxASP.Get_Object_ID_OT(request("ID_Object"))
  	END SELECT
	response.write sResult
		
%>