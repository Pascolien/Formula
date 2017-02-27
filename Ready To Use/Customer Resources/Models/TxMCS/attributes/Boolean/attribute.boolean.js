CTxMCS.attributes.CBoolean = (function () {

    CBoolean.Tags = ["Bool"];

    function CBoolean(aAttribute) {
        CTxMCS.attributes.CAttribute.call(this, aAttribute);
        this.sCritType = "ctBoolean";
    };

    CBoolean.prototype = Object.create(CTxMCS.attributes.CAttribute.prototype, {

    });

    CBoolean.prototype.constructor = CBoolean;

    J.when(J.get(CTxMCS.attributes.CAttribute.path + "Boolean/attribute.boolean.html")).then(function (data) {
        CBoolean.contentTemplate = J(data);
    }, function (error) {
        throw new TypeError(error);
    });

    return CBoolean;
})();