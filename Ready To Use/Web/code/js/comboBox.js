/* Javascript for ComboBox component of TEEXMA */

function select_valeur_cmb(obj1, obj2) {
	J(obj1).html(J(obj2).html());
	ID_TE_cmb = J(obj2).attr("ident");
}

function fermer_cmb(e) {
	if ( browser.ie8 || browser.ie7 || browser.ie6 )
		nom = window.event.srcElement.id;
	else
		nom = e.target.id;

	if (nom != 'cmb_fleche' && nom != 'cmb_titre' && nom != 'cmb_img')
		J('#cmb_liste').css("display",'none');
}

function ouvrir_cmb(obj) {
	document.onclick = fermer_cmb;
	J(obj).css("display",'block');
}
