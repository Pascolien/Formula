/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 * @param 
        aSettings(ro by default)
        aSettings
        aSettings
        aSettings
 * @returns Teexmas's action panel.
 */
var goJs = go.GraphObject.make;
var CGoActionPanel = (function ($) {
    //private attribute
    CGoActionPanel.wrapper = _url("/temp_resources/models/TxVisualDesign/VDAjax.asp");

    //constructor
    function CGoActionPanel(aSettings) {
        this.settings = aSettings;
        this.sIdDiv = aSettings.sIdDiv;
        this.parameters = {};
    }
    //private methods

    //public methods
    CGoActionPanel.prototype = {
        open: function (e) {
            console.log('new action panel');
        }
    }
    return CGoActionPanel;
})(jQuery);