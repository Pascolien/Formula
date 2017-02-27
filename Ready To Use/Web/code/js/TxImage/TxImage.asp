<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="<%=Session("sLanguageCode")%>">
<head>
    <!-- #include virtual="/code/includes/includeCommon.asp" -->
    <!-- #include virtual="/code/includes/includeVisualComponents.asp" -->
	<link rel="stylesheet" type="text/css" href="css/aspimage.css?v=<%=Session("iRevision")%>" />
	<link rel="stylesheet" type="text/css" href="css/styleImage.css?v=<%=Session("iRevision")%>" />
    <link href="<%=Session("sIISApplicationName")%>/temp_resources/Texts and illustrations/HTML/CR_Default.css?v=<%=Session("iRevision")%>" rel="stylesheet" type="text/css" />

	<script type="text/javascript" src="js/TxImage.js?v=<%=Session("iRevision")%>"></script>
    <style type="text/css">
        body{
            overflow:hidden;
            margin-left:2px;
        }
    </style>
</head>
<body onload="onLoad()">
	<form action="#"> 
		<div id="a_tabbar"  style="width:765px; height: 10000px;" >
			<div class="panel_wrapper">
				<div id="a1" name="Général"> 	
					<div id="leftfield">
						<fieldset style="width: 360px;">
							<legend>Général</legend>
							<iframe src="upload.asp" id="upload" frameborder="0"></iframe>							
							<table style="margin-left: 20px; margin-top : -10px; font-family : Tahoma, Verdana, Arial, Helvetica, sans-serif, monospace; font-size : 11px; " class="properties">
								<tr>
									<td class="column1" align="right"><label id="srclabel" for="src">Lien de l'image :</label></td>
									<td colspan="2">
										<table border="0" cellspacing="0" cellpadding="0">
											<tr> 
												<td>
												<!--[if !IE]><!--><input style="width: 167px;height : 10px;" name="src" type="src" id="src"  class="mceFocus cl_input_insertImage"  disabled="disabled" onchange="showPreviewImage(this.value);" /><!--<![endif]-->
											   <!--[if IE]><input name="src" type="src" id="src"  class="mceFocus"  disabled="true" onchange="showPreviewImage(this.value);" style="" /><![endif]-->
												</td> 
												<td id="srcbrowsercontainer"></td>
											</tr>
										</table>
									</td>
								</tr>
								<tr> 
									<td class="column1" align="right"><label id="altlabel" for="alt">Description de l'image :</label></td> 
									<td colspan="2"><input class="cl_input_insertImage" style="height : 10px;" id="alt" name="alt" type="text" /></td> 
								</tr> 
								<tr> 
									<td class="column1" align="right"><label for="title">Titre :</label></td> 
									<td colspan="2"><input style="height : 10px;" class="cl_input_insertImage" id="title" name="title" type="text" /></td> 
								</tr>	
							</table>
						</fieldset>
						<fieldset style=" height: 230px; width: 360px ; padding-bottom: 20px;">
							<legend>Aperçu</legend>
							<div id="prev" style="margin-left: 5px; width : 345px; height : 200px; margin-right : 5px;" ></div>
						</fieldset>
						<div id="rightfield" >
							<fieldset   id="imagelist" class="imagelist" style = "width: 340px; height: 391px">
								<legend>Liste d'images</legend>
								<iframe src="file_browser.asp" name="fileWindow" id="fileWindow" frameborder="0" style="margin-top : -15px"></iframe>
							</fieldset>	
						</div>												
					</div>
					<br/>
	 			</div>
		        <div id="a2">
			        <fieldset style="width: 730px; margin-left : 6px">
				        <legend>Apparence</legend>
				        <table style ="font-family : Tahoma, Verdana, Arial, Helvetica, sans-serif, monospace; font-size : 11px;" border="0" cellpadding="4" cellspacing="0">
					        <tr> 
						        <td class="column1"><label id="alignlabel" for="align">Alignement</label></td> 
						        <td><select id="align" name="align" onchange="changeappearance()"> 
								        <option ></option> 
								        <option value="baseline">Aligné sur le texte</option>
								        <option value="top">Haut</option>
								        <option value="middle">Milieu</option>
								        <option value="bottom">Bas</option>
								        <option value="left">Gauche</option>
								        <option value="right">Droite</option>
							        </select> 
						        </td>
						        <td style="width: 520px;" rowspan="6" valign="top">
							        <div  style = "border : 1px solid ;  border-color: grey margin-left: 5px ; padding-left: 5px;padding-top: 5px;padding-right: 5px;padding-bottom: 5px;">
								        <img id="myImg"  src="img/sample.gif" alt="The Pulpit Rock" width="45px" height="45px" hspace="20" />
								        <p style="display : inline;">Lorem ipsum, Dolor sit amet, consectetuer adipiscing loreum ipsum edipiscing elit, sed diam
								        nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Lorem ipsum, Dolor sit amet, consectetuer adipiscing loreum ipsum edipiscing elit, sed diam
								        nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>
							        </div>
						        </td>
					        </tr>
					        <tr>
						        <td class="column1"><label id="widthlabel" for="width">Dimensions</label></td>
						        <td nowrap="nowrap">
							        <input name="width" type="text" id="w"  size="5" maxlength="5" class="size" onchange="changeHeight();" /> x 
							        <input name="height" type="text" id="h"  size="5" maxlength="5" class="size" onchange="changeWidth();" /> px
							        <input name="" type="hidden" id="w_hidden"  onchange="ReturnTrueWidth();" />  
							        <input name="" type="hidden" id="h_hidden"  onchange="ReturnTrueHeight();" />  
						        </td>
					        </tr>
					        <tr>
						        <td class="column1"><input id="constrain" type="checkbox"  style="float:right;" name="constrain" class="checkbox" checked="checked" /></td>
						        <td><label id="constrainlabel" for="constrain">Contraindre les proportions</label></td>	
					        </tr>
				        </table>
			        </fieldset>
		        </div>  
			</div>
		</div>
    </form>
	
	<div class="mceActionPanel" id="formdhx" style="float:right">
		<input id="ID_Object" type="hidden" />
		<table id="table" style="margin-right: 9px;">
			<tr>
				<td>
					<input id="ID_Object" type="hidden" />
					<input class="cl_btn_action" type="button" id="insert" name="insert" value="Insérer" style="display:block;" onclick=" Insert();return false;"/>
				</td>
				<td>
					<input  class="cl_btn_action"  type="button" id="cancel" name="cancel" value="Annuler" style="display:block;" onclick="CloseTinyPop();return false;"/>
				</td>
			</tr>
		</table>
	</div>
	
</body> 
</html> 
