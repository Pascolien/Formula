CTxMCS.attributes.CTextual = (function () {

    CTextual.Tags = ["ShortString", "LongString", "File", "Email", "Url"];
    var CAttribute = CTxMCS.attributes.CAttribute;

    function CTextual(aAttribute) {
        CAttribute.call(this, aAttribute);
        this.sCritType = "ctText";
    };

    CTextual.prototype = Object.create(CAttribute.prototype);
    CTextual.prototype.constructor = CTextual;

    J.when(J.get(CAttribute.path + "Textual/attribute.textual.html")).then(function (data) {
        CTextual.contentTemplate = J(data);
    }, function(error) {
        throw new TypeError(error);
    });

    return CTextual;
})();