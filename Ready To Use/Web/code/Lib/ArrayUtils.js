Array.prototype.unique = function () {
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

Array.prototype.uniqueFromId = function () {
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i].txId == parseInt(a[j].ID) || a[i].ID == parseInt(a[j].ID))
                a.splice(j--, 1);
        }
    }

    return a;
}

Array.prototype.uniqueFromAttribute = function (aAttribute) {
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i][aAttribute] == parseInt(a[j][aAttribute])) {
                a.splice(j--, 1);
            }
        }
    }

    return a;
}

Array.prototype.concatObjectArray = function (aArr1, aArr2, aAttribute) {
    if (!isAssigned(aArr1) || !isAssigned(aArr2))
        return;

    var arr = aArr1.concat(aArr2);
    return arr.uniqueFromAttribute(aAttribute);
}

Array.prototype.insert = function (aIndex, aItem) {
    this.splice(aIndex, 0, aItem);
};

Array.prototype.deleteElement = function (aField, aValue) {
    var iIndexToDelete = -1;
    J.each(this, function (i, aElement) {
        if (aElement[aField] == aValue) {
            iIndexToDelete = i;
            return false;
        }
    });

    if (iIndexToDelete > -1) {
        this.splice(iIndexToDelete, 1);
    }
};

Array.prototype.getElement = function (aField, aValue) {
    var rElement;
    J.each(this, function (i, aElement) {
        if (aElement[aField] == aValue) {
            rElement = aElement;
            return false;
        }
    });
    return rElement;
};

if (!Array.prototype.map) {
    Array.prototype.map = function (callback, thisArg) {

        var T, A, k;

        if (this == null) {
            throw new TypeError(" this is null or not defined");
        }

        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (thisArg) {
            T = thisArg;
        }

        // 6. Let A be a new array created as if by the expression new Array(len) where Array is
        // the standard built-in constructor with that name and len is the value of len.
        A = new Array(len);

        // 7. Let k be 0
        k = 0;

        // 8. Repeat, while k < len
        while (k < len) {

            var kValue, mappedValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                kValue = O[k];

                // ii. Let mappedValue be the result of calling the Call internal method of callback
                // with T as the this value and argument list containing kValue, k, and O.
                mappedValue = callback.call(T, kValue, k, O);

                // iii. Call the DefineOwnProperty internal method of A with arguments
                // Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
                // and false.

                // In browsers that support Object.defineProperty, use the following:
                // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });

                // For best browser support, use the following:
                A[k] = mappedValue;
            }
            // d. Increase k by 1.
            k++;
        }

        // 9. return A
        return A;
    };
}

if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function(aCondition) {
        var array = this;
        if (!array) throw new TypeError("cannot apply findIndex method of undefined");
        for (var i = 0; i < array.length; i++) {
            if (aCondition(array[i])) return i;
        }
        return -1;
    };
}
function inArray(aArray, aValue) {
    sValue = "" + aValue
    var bResult = false;
    J.each(aArray, function (aIndex, aObj) {
        sObj = "" + aObj;
        if (sObj == sValue) {
            bResult = true;
            return;
        }
    });

    return bResult;
}

function inArrayFromField(aArray, aField, aValue) {
    var sValue = "" + aValue,
        bResult = false;

    aArray.find(function (aObj) {
        var sObjValue = "" + aObj[aField];
        if (sObjValue == sValue) {
            bResult = true;
            return true;
        }
    });

    return bResult;
}

if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.find a été appelé sur null ou undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate doit être une fonction');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}

if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.findIndex appelé sur null ou undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate doit être une fonction');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  };
}

function findObject(aArray, aField, aValue) {
    var obj;
    if (isIE()) {
        aArray.forEach(function (aObj) {
            if (aObj[aField] == aValue) {
                obj = aObj;
                return false;
            }
        });
    } else {
        aArray.find(function (aObj) {
            if (aObj[aField] == aValue) {
                obj = aObj;
                return false;
            }
        });

    }

    return obj;
}

Array.from = Array.from || (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
        return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
        var number = Number(value);
        if (isNaN(number)) { return 0; }
        if (number === 0 || !isFinite(number)) { return number; }
        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
        var len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // La propriété length de la méthode vaut 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
        // 1. Soit C, la valeur this
        var C = this;

        // 2. Soit items le ToObject(arrayLike).
        var items = Object(arrayLike);

        // 3. ReturnIfAbrupt(items).
        if (arrayLike == null) {
            throw new TypeError("Array.from doit utiliser un objet semblable à un tableau - null ou undefined ne peuvent pas être utilisés");
        }

        // 4. Si mapfn est undefined, le mapping sera false.
        var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
        var T;
        if (typeof mapFn !== 'undefined') {
            // 5. sinon      
            // 5. a. si IsCallable(mapfn) est false, on lève une TypeError.
            if (!isCallable(mapFn)) {
                throw new TypeError('Array.from: lorsqu il est utilisé le deuxième argument doit être une fonction');
            }

            // 5. b. si thisArg a été fourni, T sera thisArg ; sinon T sera undefined.
            if (arguments.length > 2) {
                T = arguments[2];
            }
        }

        // 10. Soit lenValue pour Get(items, "length").
        // 11. Soit len pour ToLength(lenValue).
        var len = toLength(items.length);

        // 13. Si IsConstructor(C) vaut true, alors
        // 13. a. Soit A le résultat de l'appel à la méthode interne [[Construct]] avec une liste en argument qui contient l'élément len.
        // 14. a. Sinon, soit A le résultat de ArrayCreate(len).
        var A = isCallable(C) ? Object(new C(len)) : new Array(len);

        // 16. Soit k égal à 0.
        var k = 0;  // 17. On répète tant que k < len… 
        var kValue;
        while (k < len) {
            kValue = items[k];
            if (mapFn) {
                A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
            } else {
                A[k] = kValue;
            }
            k += 1;
        }
        // 18. Soit putStatus égal à Put(A, "length", len, true).
        A.length = len;  // 20. On renvoie A.
        return A;
    };
}());