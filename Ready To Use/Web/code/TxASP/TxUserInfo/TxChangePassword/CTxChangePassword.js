function CTxChangePassword(aCallBack, aDummyData) {
    var self = this,
        sPathTxChangePasswordAjax = _url("/code/TxASP/TxUserInfo/TxChangePassword/TxChangePasswordAjax.asp"),
        mainDiv = J("<div id='idDivMainTxChangePassword'></div>"),
        sHtml = '<form id="changePasswordForm">'+
                    '<label id="idLabelOldPwd" for="oldPass">'+_("Ancien mot de passe :")+' </label>'+//(?=.*\d.*)(?=.*[a-zA-Z].*)(?=.*[!#\$\-+*/\\,._()~@#\'%&\?].*).{7,}
                    '<input id="oldPass" type="password" name="oldPass" required autofocus/>'+
                    '<label id="idLabelNewPwd" for="newPass">'+_("Nouveau mot de passe :")+'</label>'+
                    '<input id="newPass" type="password" name="newPass" required/>' +
                    '<label id="idLabelNewPwd2" for="newPass2">'+_("Confirmer le nouveau mot de passe :")+'</label>'+
                    '<input id="newPass2" type="password" name="newPass2" required />'+
                    '<div id="idDivBtnBarTxChangePassword" style="left:0px"></div>'+
                '</form>';

    mainDiv.append(sHtml);
    J(document.body).append(mainDiv);

    // init window
    this.wTxChangePassword = new CWindow({
        sName: "wChangePassword",
        sHeader: _("Changement de mot de passe"),
        sIcon: "resources/theme/img/btn_form/cadena.png",
        iWidth: 340,
        iHeight: 160,
        bDenyResize: true,
        bHidePark: true,
        sObjectAttached: "idDivMainTxChangePassword"
    });

    //init ButtonBar
    this.buttonBar = new CButtonBar({
        btns: [
            { sId: "idBtnValidate", iBtnType: btValidate, bSubmit: true },
            { sId: "idBtnCancel", iBtnType: btCancel, onClick: function () { self.wTxChangePassword.close(); } }
        ],
        sIdDivParent: 'idDivBtnBarTxChangePassword'
    });

    var sTitle = bTxStrongPwd ? _("le mot de passe doit contenir au moins :\n \
         - 7 caractères;\n \
         - une minuscule;\n \
         - une majuscule;\n \
         - un chiffre;\n \
         - un caractère spécial.") : _("le mot de passe doit contenir au moins 4 caractères"),
        newPass = J("#newPass"),
        newPass2 = J("#newPass2"),
        olPass = J("#oldPass");
    newPass.attr("title", sTitle);

    newPass.on("keyup", function () {
        if (checkPassword(J(this).val()))
            J(this).removeClass("error");
        else
            J(this).addClass("error");
    });

    newPass2.on("keyup", function () {
        if (newPass.val() !== J(this).val()) {
            J(this).addClass("error");
        } else {
            J(this).removeClass("error");
        }
    });

    J("#changePasswordForm").on("submit", function (e) {
        e.preventDefault();
        var form = J(this);
        if (olPass.val() === "") {
            msgWarning(_("Veuillez renseigner votre ancien mot de passe !"));
            return;
        }

        //force the strong password
        if (!checkPassword(newPass.val())) {
            newPass.focus();
            msgWarning(sTitle);
            return;
        }
        if (newPass.val() !== newPass2.val()) {
            newPass2.focus();
            msgWarning(_("Le mot de passe et sa confirmation sont différents !"));
            return;
        }
        J.post(sPathTxChangePasswordAjax, form.serialize(), function (aResponse) {
            msgWarning(aResponse === "ok" ? _("Votre mot de passe a été changé avec succès !") : _("Votre ancien mot de passe est incorrect !"));
            if (aResponse === "ok") {
                form.trigger("reset");
            }
        });
    });

    J("#changePasswordForm").on("reset", function () {
        self.wTxChangePassword.close();
    });

    function checkPassword(aValue) {
        if (bTxStrongPwd) 
            return containStrRegex(aValue, "([0-9]){1,}") && containStrRegex(aValue, "([a-z]){1,}") && containStrRegex(aValue, "([A-Z]{1,})") && containStrRegex(aValue, "([@#$%]{1,})") && aValue.length > 6
        else
            return aValue.length > 3;
    }
};
