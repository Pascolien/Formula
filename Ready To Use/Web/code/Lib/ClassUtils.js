/**
 * @class
 * @author <a href="mailto:dev@bassetti.fr">Dev</a>
 */

var Class = function () {
    this.initialize && this.initialize.apply(this, arguments);
};

Class.extend = function (childPrototype) { // defining a static method 'extend'
    var parent = this;
    var child = function () { // the child constructor is a call to its parent's
        return parent.apply(this, arguments);
    };
    child.extend = parent.extend; // adding the extend method to the child class
    var Surrogate = function () { }; // surrogate "trick" as seen previously
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;
    for (var key in childPrototype) {
        child.prototype[key] = childPrototype[key];
    }
    return child; // returning the child class
};

var inherits = function (ctor, superCtor) { // took this right from requrie('util').inherits
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
};

Function.prototype.inheritsFrom = function (parentClassOrObject) {
    if (parentClassOrObject.constructor == Function) {
        //Normal Inheritance 
        this.prototype = new parentClassOrObject;
        this.prototype.constructor = this;
        this.prototype.parent = parentClassOrObject.prototype;
    }
    else {
        //Pure Virtual Inheritance 
        this.prototype = parentClassOrObject;
        this.prototype.constructor = this;
        this.prototype.parent = parentClassOrObject;
    }
    return this;
}

function createObject(proto) {
    function ctor() { }
    ctor.prototype = proto;
    return new ctor();
}


var ClassUtils = ClassUtils || {};

/**
 * 
 * @param {} aClassName 
 * @param {} aSettings 
 * @param {} aNamespace 
 * @returns {} 
 */
ClassUtils.createObject = function (aClassName, aSettings, aNamespace) {
    var constructor = aNamespace ? aNamespace[aClassName] : window[aClassName];
    if (!constructor) {
        throw new Error(_("La classe " + aClassName + " est introuvable"));
    }

    return new aNamespace ? aNamespace[aClassName] : window[aClassName](aSettings);
}

ClassUtils.createTaggedObject = function (aNamespace, aTagName, aSettings) {
    var className = Object.keys(aNamespace).find(function (innerClass) {
        var tags = aNamespace[aTagName];
        return Array.isArray(tags) && tags.indexOf(sType) > -1;
    });
    if (aNamespace[className]) {
        throw new Error(_("La classe " + className + " est introuvable"));
    }

    return new aNamespace[className];
}