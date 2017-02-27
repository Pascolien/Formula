 <div id="id_div_main_toolbar_container">
    <div id="id_div_main_toolbar_left_side">
        <img id="idTxLogo" src="resources/theme/img/icone.png" />
        <img id="idBassettiLogo" src="resources/theme/img/logo.png" />
    </div>
</div>
<div id="login_page" data-ng-controller="UrlCtrl" style="background:url('/temp_resources/Texts and illustrations/HTML/folder.jpg') no-repeat; background-position: 50% 20%;">
    <form data-ng-submit="txConnect()">
        <div id="idDivLoginLayout">
            <h1>Connexion</h1>
            <div id="idDivLoginLayoutPH"></div>
            <input id="idBtnConnect" type="submit" name="login" class="login login-submit" data-ng-disabled="isDisabledLoginBtn" value="Se connecter" />
        </div>
    </form>
</div>
   
<script type="text/javascript">
    translate();
    var settings = {
        bForceManualConnexion: getURLParameter("bForceManualConnexion") === "true",
        idOT: getURLParameter("idOT"),
        idObject: getURLParameter("idObject"),
        idView: getURLParameter("idView"),
        idTab: getURLParameter("idTab")
    };
        
    try {
        var TxStart = new CStartTEEXMA(settings);
    } catch (e) {
        msgWarning(_("Le démarrage de TEEXMA a échoué :") + e);
    }
</script>