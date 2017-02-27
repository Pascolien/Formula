<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<%=Session("sLanguageCode")%>" lang="<%=Session("sLanguageCode")%>">
<head>
    <!-- #include virtual="/code/includes/includeCommon.asp" -->
    <!-- #include virtual="/code/includes/includeVisualComponents.asp" -->
	<link rel="stylesheet" type="text/css" href="style.css?v=<%=Session("iRevision")%>"/>
    <link href="<%=Session("sIISApplicationName")%>/temp_resources/Texts and illustrations/HTML/CR_Default.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />

	<script type="text/javascript" src="js/TxLink.js?v=<%=Session("iRevision")%>"></script>	
</head>

<body>
    <div id="a_tabbar" style="width:600px;margin:6px;">
        <div id="a1" name="Liens internes" style="width:630px; height: 294px "> 
            <form onsubmit="insertInternalLink(); return false;" action="#" height="50" style="margin-left: 6px;margin-top:6px;"> 		
				<table border="0" role="presentation" style="width:620px;">
					<tr>
						<td align="right" class="nowrap"><label for="entityText">Nom du lien :</label></td>
						<td>
							<input id="entityText" name="entityText" type="text" />
							<img title="" src="<%=Session("sIISApplicationName")%>/resources/theme/img/btn_form/16x16_false.png" onclick="J('#entityText').val('')" class="clCross" />
						</td>
					</tr>
					<tr>
						<td align="right" class="nowrap"><label id="hreflabel" for="filterObject">Type d'Entités :</label></td>
						<td>
							<div id="id_div_combo" style="width:250px;"></div>
						</td>
					</tr>
					<tr>
						<td align="right" class="nowrap"><label id="aze" for="selectObject">Entités :</label></td>
						<td>
							<div id="id_div_treebox">
								<div id="id_div_tree" style=""></div>
								<div id="id_div_toolbar" style=""></div>
							</div>
						</td>
					</tr>
				</table>		
            </form>
        </div>
        <div id="a2" name="Liens externes" style=" width: 630px">
            <form onsubmit="insertExternalLink(); return false;" action="#" height="50" style="margin-left: 6px;margin-top:6px;"> 	
			    <table border="0" style="width:620px;">
				    <tr>
					    <td align="right" class="nowrap"><label for="entityText">Nom du lien :</label></td>
					    <td>
						    <input id="entityText2" name="entityText2" style="width:485px;" type="text" value="" />
						    <img title="" src="<%=Session("sIISApplicationName")%>/resources/theme/img/btn_form/16x16_false.png" onclick="J('#entityText2').val('')" class="clCross"/>
					    </td>
				    </tr>
				    <tr>
					    <td align="right" class="nowrap"><label for="entityText">Site internet :</label></td>
					    <td>
						    <input id="URL" name="URL" style="width:485px;" type="text" value="http://" />
						    <img title="" src="<%=Session("sIISApplicationName")%>/resources/theme/img/btn_form/16x16_false.png" onclick="J('#URL').val('')" class="clCross" />
					    </td>
				    </tr>
			    </table>
            </form>
        </div>
    </div>
    <div class="mceActionPanel" id="formdhx" style="float:right">
        <table id="table" style="margin-right:6px;margin-top:-7px;">
            <tr>
                <td>
                    <input  class="cl_btn_action" type="button" id="insert" name="insert" value="Valider" style="display:block;" onclick="insertLink();return false;"/>
                </td>				
                <td>
                    <input class="cl_btn_action" type="button" id="cancel" name="cancel" value="Annuler" style="display:block;" onclick="CloseTinyPop();return false;"/>
                </td>			
            </tr>
        </table>	
    </div>  
</body>
</html>
