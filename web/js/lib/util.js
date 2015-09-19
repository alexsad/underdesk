define(["require", "exports"], function (require, exports) {
    var ValidationType = (function () {
        function ValidationType() {
        }
        ValidationType.EMAIL = /^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/;
        ValidationType.TIME = /((?:[01]\d)|(?:2[0-3])):([0-5]\d)/;
        ValidationType.DATE = /^(\d+)\D(\d+)\D(\d{4})$/;
        ValidationType.ONLY_TEXT = /\D+/;
        ValidationType.ONLY_NUMBER = /\d+/;
        return ValidationType;
    })();
    exports.ValidationType = ValidationType;
    ;
    ;
    ;
    var ArrayList = (function () {
        function ArrayList(p_array_obj) {
            this._indx = 0;
            this._size = 0;
            this._matrix = [];
            this._size = 0;
            this._indx = 0;
            this.addAll(p_array_obj);
        }
        ArrayList.prototype.size = function () {
            return this._size;
        };
        ArrayList.prototype.get = function (p_indx) {
            return this._matrix[p_indx];
        };
        ArrayList.prototype.getAll = function () {
            return this._matrix;
        };
        ArrayList.prototype.add = function (p_obj) {
            this._matrix[this._size] = p_obj;
            this._size++;
        };
        ArrayList.prototype.set = function (p_obj, p_indx) {
            this._matrix[p_indx] = p_obj;
        };
        ArrayList.prototype.remove = function (p_indx) { };
        ArrayList.prototype.removeAll = function () {
            this._size = 0;
            this._matrix = [];
        };
        ArrayList.prototype.addAll = function (p_array_obj) {
            this.removeAll();
            if (p_array_obj) {
                this._size = p_array_obj.length;
                this._matrix = p_array_obj;
            }
            else {
                this._size = 0;
                this._matrix = [];
            }
            ;
        };
        ArrayList.prototype.orderAsc = function (campo) {
            var tmpArray = this._matrix.sort(function () {
                return function (a, b) {
                    var objectIDA = a[campo];
                    var objectIDB = b[campo];
                    if (objectIDA === objectIDB) {
                        return 0;
                    }
                    return objectIDA > objectIDB ? 1 : -1;
                };
            }());
        };
        ArrayList.prototype.orderDesc = function (campo) {
            var tmpArray = this._matrix.sort(function () {
                return function (a, b) {
                    var objectIDA = a[campo];
                    var objectIDB = b[campo];
                    if (objectIDA === objectIDB) {
                        return 0;
                    }
                    ;
                    return objectIDA > objectIDB ? 1 : -1;
                };
            }());
        };
        ArrayList.prototype.getIndexOf = function (p_criterio) {
            var indexFind = -1;
            var tmpKey = "";
            for (var key in p_criterio) {
                tmpKey = key;
            }
            ;
            for (var x = 0; x < this.size(); x++) {
                if (this._matrix[x][tmpKey] == p_criterio[tmpKey]) {
                    indexFind = x;
                    break;
                }
                ;
            }
            ;
            return indexFind;
        };
        return ArrayList;
    })();
    exports.ArrayList = ArrayList;
});
