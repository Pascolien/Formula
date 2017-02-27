var Lancement_Verif_Form = false;
var J = jQuery.noConflict();
function replacequote(txt)	{
	var forb = /\'\'/g;
	var newtxt=txt;

	if(!forb.test(txt)) {
		app = /\'/g;
		newtxt = txt.replace(app, "'");
	}
	return(newtxt);
}

function onlyNb(myField) {
	var reg1 = /^[-]{0,1}[0-9\s]{0,}[,.]{0,1}[0-9]{0,20}[E]{0,1}[-]{0,1}[0-9]{0,5}$/;
	if (reg1.exec(J(myField).val()) == null) {
	    msgWarning(_("Ce champ n'accepte que des caractères numériques"));
		J(myField).val('');
	}
}

// Code différent champs à vérifier pour le teexma :

// Il n'y a que les champs "chaine", "texte", "date" et "entier" à vérifier les autres sont des champs préformatés.

function verif_form(form) {
	Lancement_Verif_Form = false;
	test = verif_form2(form, true);
	return test;
}

function verif_form2(form, bool_submit) {
	try {
		var Debut = new Date();
		if (Lancement_Verif_Form == false) {
			Lancement_Verif_Form = true;
			var objet;
			var test				= true;
			var reg_nombre			= /^[-]{0,1}[0-9]{0,}$/;
			var reg_mail			= /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}[.][a-zA-Z0-9]{2,4}$/;
			var reg_chaine_sq		= /^[a-zA-Z ]{0,}$/;
			var reg_nb_monetaire	= /^[0-9\s]{0,}[,.]{1,1}[0-9]{2,2}$/;
			var reg_nb_flottant		= /^[-]{0,1}[0-9\s]{0,}[,.]{0,1}[0-9]{0,20}[E]{0,1}[-]{0,1}[0-9]{0,5}$/;
			var popup_form = false;
			test = true;
			J(form).find(':input').each(function(){
			    objet = J(this);

			    sValue = objet.val();
			    if (sValue != null){
			        sValue.replace(/\|/g, "");
				    objet.val(sValue);
			    }

				if (J(form).attr("name").match("_popup_"))
					popup_form = true;
				if (objet.attr("codage_nom") != null) {
					nom_caract = objet.attr("codage_nom");
				} else {
					nom_caract = objet.attr("name");
				}  
				if (objet.attr("fValue") && bool_submit){
					objet.val(objet.attr("fValue"));
				}

				// Sauvegarde des champs text enrichi
				if (objet.attr("codage") == "html_text") {
					try  {
						if (popup_form){
							var tinyTemp = tinyMCE.get('content_popup_'+ objet.attr('codage_nom'));
							if (tinyTemp != null)
								objet.val(Replace_From_XML(tinyTemp.getContent().replace(/\|/g,"")));
							tinyTemp.destroy();
						} else {
							var tinyTemp = tinyMCE.get('content_'+ objet.attr('codage_nom'));
							if (tinyTemp != null)
								objet.val(Replace_From_XML(tinyTemp.getContent().replace(/\|/g,"")));
							tinyTemp.destroy();
						}	
						if (Check_IE()){
							if (popup_form)
								tinyMCE.execCommand('mceRemoveControl',true,'content_popup_'+ objet.attr('codage_nom'));
							else 
								tinyMCE.execCommand('mceRemoveControl',true,'content_'+ objet.attr('codage_nom'));
						}
					} catch (e) { objet.val("") }
				}
				else if (objet.attr("codage") == "tableau") {
					var sID_Tab = 'tab_'+ objet.attr("id_pe");
					if (popup_form) 
						sID_Tab = 'tab_popup_'+ objet.attr("id_pe");
					objet.val(Get_Table_Value(J('#'+sID_Tab)));
				} 
				else if (objet.attr("codage") == "entier") {
					if (reg_nombre.exec(objet.val()) == null) {
					    msgWarning(_Fmt("Le champ '#1' est vide ou incorrect (Réponse attendue : Un entier). Les modifications ne seront pas enregistrées."), [nom_caract]);
						objet.val('');
					}
				} 
				else if (objet.attr("codage") == "entier_nn") {
					if ((reg_nombre.exec(objet.val()) == null) || (objet.val() == "")) {
					    msgWarning(_Fmt("Le champ '#1' est vide ou incorrect (Réponse attendue : Un entier). Les modifications ne seront pas enregistrées.", [nom_caract]));
						objet.val('');
					}
				} 
				else if (objet.attr("codage") == "mail") {
					if ((reg_mail.exec(objet.val()) == null) && (objet.val() != '')) {
					    msgWarning(_Fmt("Le champ '#1' est incorrect (Réponse attendue : Une adresse mail). Les modifications ne seront pas enregistrées.", [nom_caract]));
						objet.val('');
					}
				}
				else if (objet.attr("codage") == "flottant") {
					objet.val(objet.val().replace(".",","));
					if (reg_nb_flottant.exec(objet.val()) == null) {
					    msgWarning(_Fmt("Le champ '#1' est vide ou incorrect (Réponse attendue : Un nombre ex: '12 123,00'). Les modifications ne seront pas enregistrées.", [nom_caract]));
						objet.val('');
					}
					if (objet.attr("b_inf") != null) {
						if (Verif_Borne(nom_caract, objet.val(), objet.attr("b_inf"), objet.attr("b_sup"), objet.attr("b_inf_inc"), objet.attr("b_sup_inc")) == "false") {
							test = false;
						}
					}					
				} 
				else if (objet.attr("codage") == "flottant_nn") {
					objet.val(objet.val().replace(".",","));
					if ((reg_nb_flottant.exec(objet.val()) == null) || (objet.val() == "")) {
					    msgWarning(_Fmt("Le champ '#1' est vide ou incorrect (Réponse attendue : Un nombre ex: '12 123,00'). Les modifications ne seront pas enregistrées.", [nom_caract]));
						objet.val('');
					}
				} 
				else if (objet.attr("codage") == "point_intervalle") {
				    val1 = objet;
				    if (val1.val() != "") {
				        val1.val(val1.val().replace(".", ","));

				        val2 = J(this);
				        if ((val2 != null) && (val1.attr("name") == val2.attr("name"))) {
				            val2.val(val2.val().replace(".", ","));
				            if (val2.val() == '') {
				                test = false;
				                msgWarning(_Fmt("Le champ Max '#1' est vide ou incorrect ! Les modifications ne seront pas enregistrées.", [nom_caract]));
				                //return false;				  
				            }
				            val3 = J(this);
				            if ((val3 != null) && (val3.attr("name") == val2.attr("name"))) {
				                val3.val(val3.val().replace(".", ","));
				                if (val3.val() == '') {
				                    test = false;
				                    msgWarning(_Fmt("La moyenne du champ '#1' doit être comprise entre le min et le max ! Les modifications ne seront pas enregistrées.", [nom_caract]));
				                }
				                if ((parseFloat2(val3.val()) < parseFloat2(val1.val())) || (parseFloat2(val3.val()) > parseFloat2(val2.val()))) {
				                    test = false;
				                    msgWarning(_Fmt("La moyenne du champ '#1' doit être comprise entre le min et le max ! Les modifications ne seront pas enregistrées.", [nom_caract]));
				                } else {
				                    val3 = null;
				                }
				            } else {
				                val2 = null;
				            }

				            if (reg_nb_flottant.exec(val1.val()) == null) {
				                test = false;
				                msgWarning(_Fmt("Le champ Min '#1' est vide ou incorrect ! Les modifications ne seront pas enregistrées.", [nom_caract]));
				            }

				            if ((val1.val() != "") && (Verif_Borne(nom_caract, val1.val(), objet.attr("b_inf"), objet.attr("b_sup"), objet.attr("b_inf_inc"), objet.attr("b_sup_inc")) == "false")) {
				                test = false;
				            } else if ((val2) && (val2.val() != "") && (Verif_Borne(nom_caract, val2.val(), objet.attr("b_inf"), objet.attr("b_sup"), objet.attr("b_inf_inc"), objet.attr("b_sup_inc")) == "false")) {
				                test = false;
				            } else if ((val3) && (val3.val() != "") && (Verif_Borne(nom_caract, val3.val(), objet.attr("b_inf"), objet.attr("b_sup"), objet.attr("b_inf_inc"), objet.attr("b_sup_inc")) == "false")) {
				                test = false;
				            }

				            if (reg_nb_flottant.exec(val2.val()) == null) {
				                test = false;
				                msgWarning(_Fmt("Le champ Max '#1' est vide ou incorrect ! Les modifications ne seront pas enregistrées.", [nom_caract]));
				            }

				            if ((test == true) && (((val1.val() == "") && (val2.val() != "")) || ((val1.val() != "") && (val2.val() == "")))) {
				                test = false;
				                msgWarning(_Fmt("Le min (ou le max) du champ '#1' est rempli alors que le max (ou le min) ne l'est pas ! Les modifications ne seront pas enregistrées.", [nom_caract]));
				            }

				            if ((test == true) && (val1.val() != "") && (val2.val() != "")) {
				                if (parseFloat2(val1.val()) > parseFloat2(val2.val())) {
				                    test = false;
				                    msgWarning(_Fmt("Attention dans le champ '#1' le min est supérieur au max ! Les modifications ne seront pas enregistrées.", [nom_caract]));
				                }
				            }
				        } else {
				            val2 = J(':input:eq(' + (J(':input').index(this) + 1) + ')');
				            if ((val2 != null) && (val1.attr("name") == val2.attr("name"))) {
				                if (val2.val() != "") {
				                    test = false;
				                    msgWarning(_Fmt("Le champ Min '#1' est vide ou incorrect ! Les modifications ne seront pas enregistrées.", [nom_caract]));
				                    //return false;
				                }
				                val3 = J(':input:eq(' + (J(':input').index(this) + 1) + ')');
				                if ((val3 != null) && (val3.attr("name") == val1.attr("name"))) {
				                    if (val3.val() != "") {
				                        test = false;
				                        msgWarning(_Fmt("Le champ Min '#1' est vide ou incorrect ! Les modifications ne seront pas enregistrées.", [nom_caract]));
				                        //return false;
				                    }
				                }
				            }
				        }
				    } else if (objet.attr("codage") == "monetaire") {
				        if (reg_nb_monetaire.exec(objet.val()) == null) {
				            msgWarning(_Fmt("Le champ '#1' est vide ou incorrect (Réponse attendue : Un nombre avec 2 chiffres après la virgule). Les modifications ne seront pas enregistrées.", [nom_caract]));
				            objet.val('');
				        }
				        objet.val(traitement_monetaire(objet.val()));
				    } else if (objet.attr("codage") == "monetaire_nn") {
				        objet.val(traitement_monetaire(objet.val()));
				        if ((reg_nb_monetaire.exec(objet.val()) == null) || (objet.val() == "")) {
				            msgWarning(_Fmt("Le champ '#1' est vide ou incorrect (Réponse attendue : Un nombre avec 2 chiffres après la virgule). Les modifications ne seront pas enregistrées.", [nom_caract]));
				            objet.val('');
				        }
				    } else if (objet.attr("codage") == "chaine") {
				        objet.val(replacequote(objet.val()));
				        if (objet.attr("longueur")) {
				            longueur = objet.attr("longueur");
				        } else {
				            longueur = 254;
				        }
				        temp = objet.val().substr(0, longueur);
				        if (objet.val().length != temp.length) {
				            sResizedValue = objet.val().substr(0, longueur);
				            objet.val(sResizedValue);
				            msgWarning(_Fmt("Le champ '#1' est trop long. Il a été coupé à la bonne longueur, vous pouvez revalider votre enregistrement. Les modifications ne seront pas enregistrées.", [nom_caract]));
				        }
				    } else if (objet.attr("codage") == "chaine_sq_nn") {
				        if (reg_chaine_sq.exec(objet.val()) == null) {
				            test = false;
				            msgWarning(_Fmt("Le champ '#1' est vide ou incorrect (Réponse attendue : Une chaîne de caractères). Les modifications ne seront pas enregistrées.", [nom_caract]));
				            return false;
				        }
				        if (objet.attr("longueur")) {
				            longueur = objet.attr("longueur");
				        } else {
				            longueur = 254;
				        }
				        temp = objet.val().substr(0, longueur);
				        if (objet.val().length != temp.length) {
				            objet.val(objet.val().substr(0, longueur));
				            test = false;
				            msgWarning(_Fmt("Le champ '#1' est trop long. Il a été coupé à la bonne longueur, vous pouvez revalider votre enregistrement. Les modifications ne seront pas enregistrées.", [nom_caract]));
				        }
				    } else if (objet.attr("codage") == "chaine_nn") {
				        if (objet.val() == "") {
				            test = false;
				            msgWarning(_Fmt("Le champ '#1' est vide ou incorrect (Réponse attendue : Une chaîne de caractères). Les modifications ne seront pas enregistrées.", [nom_caract]));
				            return false;
				        } else {
				            objet.val(replacequote(objet.val()));
				        }
				    } else if (objet.attr("codage") == "texte") {
				        objet.val(replacequote(objet.val()));
				    } else if (objet.attr("codage") == "texte_nn") {
				        if (objet.val() == "") {
				            test = false;
				            msgWarning(_Fmt("Le champ '#1' est vide ou incorrect (Réponse attendue : Une chaîne de caractères). Les modifications ne seront pas enregistrées.", [nom_caract]));
				            return false;
				        } else {
				            objet.val(replacequote(objet.val()));
				        }
				    }
				}
			});
			if (test) {
				if (bool_submit) {
					J("#"+form.id).on('submit', function(e){
						e.preventDefault();				 
						var $this = J(this);
						J.ajax({
							url: $this.attr('action'),
							type: $this.attr('method'),
							data: $this.serialize(),
							dataType: 'script',
							async:false,
							cache: false
						});
					});
					J("#" + form.id).submit();
				} else {
				  Lancement_Verif_Form = false;
				}
				var Fin = new Date();
				return true;
			} else {
				Lancement_Verif_Form = false;
				return false;
			}
	 	}
	}	catch (err) {
		msgWarning(_("Erreur vérification du formulaire: ")+objet.attr("name") + "\n"+ err);
	} 
}

function parseFloat2(val) {
	var temp;
	if (val != null) {
		temp = val.replace(',','.');
		return parseFloat(temp);
	} else {
		return "";
	}
}

function Verif_Borne(nom_caract, val, b_inf, b_sup, b_inf_inc, b_sup_inc) {
	if ((b_inf != null) && (b_inf != '') && ((parseFloat2(val) < parseFloat2(b_inf)) || ((parseFloat2(val) == parseFloat2(b_inf)) && (b_inf_inc == "0")))) {
	    msgWarning(_Fmt("Erreur: La valeur du champ '#1' doit être supérieure à #2 !", [nom_caract,b_inf]));
		return "false";
	}
	
	if ((b_sup != null) && (b_sup != "") && ((parseFloat2(val) > parseFloat2(b_sup)) || ((parseFloat2(val) == parseFloat2(b_sup)) && (b_sup_inc == "0")))) {
	    msgWarning(_Fmt("Erreur: La valeur du champ '#1' doit être inférieure à #2 !", [nom_caract,b_sup]));
		return "false";
	}		
	return true;
}
