/// <reference path="../../lib/jquery2.d.ts"/>
define(["require", "exports"], function (require, exports) {
    var Underas = (function () {
        function Underas() {
        }
        Underas.getUid = function () {
            this._uid++;
            return this._uid;
        };
        Underas.getLastUid = function () {
            return this._uid;
        };
        Underas.getNextUid = function () {
            return this._uid + 1;
        };
        Underas.cache = function (p_on) {
            this._cache = p_on;
        };
        Underas.setProjectVersion = function (p_version) {
            this._version = p_version;
        };
        Underas.getUrlParam = function (p_name) {
            var results = new RegExp('[\?&]' + p_name + '=([^&#]*)').exec(window.location.href);
            if (results == null) {
                return "";
            }
            ;
            return results[1] || "";
        };
        Underas.getLocation = function () {
            var tmpUrl = window.location.href;
            return tmpUrl.substring(0, tmpUrl.lastIndexOf("/") + 1);
        };
        Underas.printDataProvider = function (p_dta, p_url_template) {
        };
        Underas.getInstanceOf = function (context, name, args) {
            var instance = Object.create(context[name].prototype);
            instance.constructor.apply(instance, args);
            return instance;
        };
        Underas.templateCompile = function (template, data) {
            return template.replace(/\{([\w\.]*)\}/g, function (str, key) {
                var keys = key.split("."), v = data[keys.shift()];
                for (var i = 0, l = keys.length; i < l; i++) {
                    v = v[keys[i]];
                }
                ;
                return (typeof v !== "undefined" && v !== null) ? v : "";
            });
        };
        Underas._uid = 571;
        Underas._cache = true;
        Underas._version = "1";
        return Underas;
    })();
    exports.Underas = Underas;
    ;
    var Component = (function () {
        function Component(tagh, tagc) {
            this._uid = 0;
            this._uid = Underas.getUid();
            this._html = $("<" + tagh + ">");
            this.getEle().html(tagc).attr("id", "uid_" + this._uid).css("z-index", this._uid + 1);
        }
        Component.prototype.getEle = function (p_sel) {
            if (!p_sel) {
                return this._html;
            }
            ;
            return this._html.find(p_sel);
        };
        Component.prototype.append = function (p_childtoappend) {
            this.getEle().append(p_childtoappend.getEle());
        };
        Component.prototype.setSize = function (nsize) {
            var classes = this.getEle().attr("class");
            var ns = classes.replace(/col\-sm\-(\d{1,2})/, "col-sm-" + nsize);
            this.getEle().removeClass().addClass(ns);
        };
        Component.prototype.addEvent = function (p_on, p_event_fn, p_bind) {
            if (p_bind) {
                this.getEle().on(p_on, $.proxy(p_event_fn, p_bind));
            }
            else {
                this.getEle().on(p_on, p_event_fn);
            }
            return this.getEle();
        };
        Component.prototype.show = function (pshow) {
            if (pshow) {
                this.getEle().css("display", "block");
            }
            else {
                this.getEle().css("display", "none");
            }
        };
        Component.prototype.getModule = function () {
            return this._modwindow;
        };
        return Component;
    })();
    exports.Component = Component;
});
