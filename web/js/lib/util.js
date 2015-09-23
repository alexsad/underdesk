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
});
