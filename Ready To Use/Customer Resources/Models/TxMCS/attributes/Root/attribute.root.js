CTxMCS.attributes.CRoot = (function ($) {

	CRoot.Tags = ["RootOT"];
	var CLink = CTxMCS.attributes.CLink;

	function CRoot(aSettings) {
        CLink.call(this, aSettings);

        this.criterion.PreselectionCriterion.sCritType = "ctPreselection";
	};

	CRoot.prototype = Object.create(CLink.prototype);
	CRoot.prototype.constructor = CRoot;

    $.extend(CRoot.prototype, {
        _updateCriterion: function () {
            CLink.prototype._updateCriterion.call(this);
            this.criterion.ID_OT = this.criterion.ID_Att;
            delete this.criterion.ID_Att;
            delete this.criterion.sCritType;
        }
    });

	$.when($.get(CTxMCS.attributes.CAttribute.path + "Link/attribute.link.html")).then(function (data) {
	    CRoot.contentTemplate = $(data);
	}, function (error) {
	    throw new Error(error);
	});

	return CRoot;
})(jQuery);