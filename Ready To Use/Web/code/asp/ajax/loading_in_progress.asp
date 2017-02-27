<!-- #include virtual="/code/asp/includes/charset.inc" -->
<div id="en_cours_de_chargement" style="font-size:12px;">
	<img src="<%=Session("sIISApplicationName")%>/resources/theme/img/gif/ajax-loader.gif" <% IF (request("taille") <> "") THEN %> width="<%=request("taille")%>" <% END IF %> alt="chargement" /><br>
	<%=request("loading_message")%>
</div>
