define(["require", "exports", "core", "net"], function (require, exports, core_1, net_1) {
    var AlertWindow = (function (_super) {
        __extends(AlertWindow, _super);
        function AlertWindow(p_title, p_msg) {
            _super.call(this, 'div', '<div class="modal-dialog">'
                + '<div class="modal-content">'
                + '<div class="modal-header">'
                + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>'
                + '<h4 class="modal-title">' + p_title + '</h4>'
                + '</div>'
                + '<div class="modal-body">'
                + '<p>' + p_msg + '</p>'
                + '</div>'
                + '<div class="modal-footer"></div>'
                + '</div>'
                + '</div>');
            this._title = p_title;
            this.getEle().addClass("AlertWindow modal").css("z-index", (this._uid + 500));
            this.getEle("button.close").on('click', function (evt) {
                evt.preventDefault();
                this.show(false);
            }.bind(this));
        }
        AlertWindow.prototype.addButton = function (p_ele) {
            this.getEle(".modal-footer").append(p_ele.getEle());
        };
        AlertWindow.prototype.setTitle = function (p_title) {
            this.getEle(".modal-title").text(p_title);
        };
        AlertWindow.prototype.setMsg = function (p_msg) {
            this.getEle(".modal-body p").text(p_msg);
        };
        return AlertWindow;
    })(core_1.Component);
    exports.AlertWindow = AlertWindow;
    var ModWindow = (function (_super) {
        __extends(ModWindow, _super);
        function ModWindow(p_subtitle) {
            _super.call(this, 'div', '<h3 class="col-sm-12 col-xs-12 subtitlemodwindow">' + p_subtitle + '</h3>' +
                '<div class="conteudo_form">' +
                '<div class="form-group fbody"></div>' +
                '<div style="" class="col-sm-12 col-xs-12 form-actions"></div>' +
                '</div>' +
                '<h5 class="col-xs-12 col-sm-12 column block_module_details"><span></span></h5>');
            if (!this._configModWindow) {
                this._configModWindow = {
                    _urlmodule: "",
                    _revision: "",
                    _dmap: [],
                    _dmaplenth: 0,
                    _subtitle: p_subtitle
                };
            }
            ;
            this.getEle().addClass("col-sm-12 col-xs-12 column windowC ModWindow").css({ "z-index": (this._uid + 1) });
        }
        ModWindow.prototype.setTitle = function (p_title) {
            this._configModWindow._subtitle = p_title;
            this.getEle('h3.subtitlemodwindow:first').text(p_title);
        };
        ModWindow.prototype.getTitle = function () {
            return this._configModWindow._subtitle;
        };
        ModWindow.prototype._onStart = function () {
            var _this = this;
            var tmList = this._configModWindow._dmaplenth;
            $.each(this, function (key) {
                if (tmList == 0) {
                    return true;
                }
                ;
                if (!key.match("_configModWindow|_configListsViews|$caller|caller|_uid|_html")) {
                    if (this[key]["getColumn"]) {
                        if (this[key].getColumn()) {
                            this._configModWindow._dmap.push({ column: this[key].getColumn(), field: key });
                            if (this[key].isPrimaryKey()) {
                                this.setIdField(key);
                            }
                            ;
                            tmList--;
                        }
                        ;
                    }
                    else if (this[key]["_istoolbar"]) {
                        this._configModWindow._maintoolbar = key;
                    }
                    else if (this[key]["_islistview"]) {
                        if (!this._configModWindow._mainlist) {
                            this.setMainList(key);
                            tmList--;
                        }
                        ;
                    }
                    ;
                }
                ;
            }.bind(this));
            if (this._configModWindow._maintoolbar) {
                this[this._configModWindow._maintoolbar].activate(true);
                if (this._configModWindow._mainlist) {
                    this.getMainList().changeToIndex(0);
                }
                ;
            }
            ;
            if (this._configModWindow._configListsViews) {
                this._configModWindow._configListsViews.forEach(function (listconfig) {
                    if (listconfig.list == "") {
                        if (_this._configModWindow._mainlist) {
                            listconfig.list = _this._configModWindow._mainlist;
                        }
                        ;
                    }
                    ;
                    if (listconfig.list != "") {
                        _this[listconfig.list]["_urlTemplate"] = listconfig.url;
                    }
                    ;
                });
            }
            ;
            this.changeDsModule();
            this.setDsModule();
        };
        ModWindow.prototype.onStart = function () {
        };
        ModWindow.prototype.getFormItem = function () {
            var modTmp = this;
            var tmpColumns = modTmp.getColumns();
            var objForm = {};
            $.each(tmpColumns, function (index, cfield) {
                var fieldTmp = cfield.field;
                if (!modTmp[fieldTmp]) {
                    console.log("change item #erro: field " + fieldTmp + " not exist!");
                }
                else {
                    objForm[cfield["column"]] = modTmp[fieldTmp].getValue();
                }
            });
            return objForm;
        };
        ModWindow.prototype.clearFormItem = function () {
            var modTmp = this;
            var tmpColumns = modTmp.getColumns();
            $.each(tmpColumns, function (index, cfield) {
                var fieldTmp = cfield.field;
                if (!modTmp[fieldTmp]) {
                    console.log("change item #erro: field " + fieldTmp + " not exist!");
                }
                else {
                    if (!(modTmp[fieldTmp].getEle().hasClass("Select") || modTmp[fieldTmp].isFixed())) {
                        modTmp[fieldTmp].setValue("");
                    }
                }
            });
        };
        ModWindow.prototype.setRevision = function (p_txt_revision) {
            this._configModWindow._revision = p_txt_revision.replace(/[^\d]+/g, '');
        };
        ModWindow.prototype.getRevision = function () {
            return this._configModWindow._revision;
        };
        ModWindow.prototype.getDsModule = function () {
            var urltmp = this.getUrlModule().toUpperCase();
            var urltmpa = urltmp.split(".");
            var tmurls = urltmpa.length;
            return urltmpa[tmurls - 3] + " | " + urltmpa[tmurls - 1];
        };
        ModWindow.prototype.changeDsModule = function () {
            var tmpModule = this.getUrlModule();
            var lstPart = tmpModule.substring(tmpModule.lastIndexOf(".") + 1, tmpModule.length);
            this.getEle().addClass(lstPart);
        };
        ModWindow.prototype.setUrlModule = function (p_url_m) {
            this._configModWindow._urlmodule = p_url_m;
        };
        ModWindow.prototype.getUrlModule = function () {
            return this._configModWindow._urlmodule;
        };
        ModWindow.prototype.getModView = function () {
            return this._configModWindow._modview;
        };
        ModWindow.prototype.append = function (childtoappend) {
            childtoappend._modwindow = this;
            if (childtoappend.getEle().hasClass("btn")) {
                this.getEle("div.form-actions").append(childtoappend.getEle());
            }
            else if (childtoappend.getEle().hasClass("ListView") || childtoappend.getEle().hasClass("ListViewAdv")) {
                this.getEle("div.conteudo_form").append(childtoappend.getEle());
                this._configModWindow._dmaplenth++;
            }
            else {
                this.getEle("div.fbody").append(childtoappend.getEle());
                if (childtoappend["getColumn"]) {
                    var column = childtoappend["getColumn"]();
                    if (column) {
                        this._configModWindow._dmaplenth++;
                    }
                    ;
                }
                ;
            }
            ;
        };
        ModWindow.prototype.setDsModule = function () {
            this.getEle("h5.block_module_details").html("<span>" + this.getDsModule() + " :" + this.getRevision() + "</span>");
        };
        ModWindow.prototype.getColumns = function () {
            return this._configModWindow._dmap;
        };
        ModWindow.prototype.setIdField = function (p_field) {
            this.getEle().attr("data-idfieldcod", p_field);
        };
        ModWindow.prototype.getIdField = function () {
            if (!this.getEle().attr("data-idfieldcod")) {
                var pkC = this.getColumns()[0];
                if (pkC) {
                    this.setIdField(pkC.field);
                }
                else {
                    console.log("id nao definido");
                }
                ;
            }
            ;
            return this.getEle().attr("data-idfieldcod");
        };
        ModWindow.prototype.getMainList = function () {
            return this[this._configModWindow._mainlist];
        };
        ModWindow.prototype.setMainList = function (p_main_list) {
            this._configModWindow._mainlist = p_main_list;
        };
        ModWindow.prototype.show = function (on) {
            if (on) {
                this.getEle().css("display", "block");
            }
            else {
                this.getEle().css("display", "none");
            }
            ;
        };
        ModWindow.prototype.beforeSave = function (p_obj) {
            return p_obj;
        };
        ModWindow.prototype.beforeInsert = function (p_req_obj) {
            return p_req_obj;
        };
        ModWindow.prototype.beforeQuery = function (p_req) {
            return p_req;
        };
        ModWindow.prototype.onChangeItem = function (p_obj) {
            return p_obj;
        };
        ModWindow.prototype.beforeDelete = function (p_req_delete, p_old_obj) {
            return p_req_delete;
        };
        ModWindow.prototype.beforeUpdate = function (p_req_new_obj, p_old_obj) {
            return p_req_new_obj;
        };
        return ModWindow;
    })(core_1.Component);
    exports.ModWindow = ModWindow;
    ;
    var ModView = (function (_super) {
        __extends(ModView, _super);
        function ModView(p_title) {
            _super.call(this, 'div', '<div class="blockrequest normal_load">' +
                '<div class="BoxTaskRequestProgress"></div>' +
                '<div class="BoxTasks" style="display:none"></div>' +
                '</div>');
            this._title = "";
            this._icone = "file";
            this._title = p_title;
            this._childrenMods = [];
            this.getEle().attr("data-firstmod", "no").addClass("tab-content ModView");
            $("#navbarlist li:first.active").removeClass("active");
            $("#navbarlist").append('<li class="active" id="aba_s_' + this._uid + '"><a href="#" data-modviewuid="' + this._uid + '" class="btnsabapages"><span class="hidden-xs glyphicon glyphicon-' + this._icone + '"></span> ' + this._title + '<span class="x_rmv hidden-xs" data-modviewuid="' + this._uid + '">&otimes;</span></a></li>');
            this.getEle().append('<nav id="pgmod_' + this._uid + '" style="display:none" class="invisible">'
                + '<ul class="pager">'
                + '<li id="previous_' + this._uid + '" class="previous disabled"><a href="#" data-modviewuid="' + this._uid + '"><span class="glyphicon glyphicon-hand-left"></span></a></li>'
                + '<li id="next_' + this._uid + '" class="next"><a href="#" data-modviewuid="' + this._uid + '"><span class="glyphicon glyphicon-hand-right"></span></a></li>'
                + '</ul>'
                + '</nav>');
            this.getEle("nav ul.pager li.previous a").on('click', function (evt) {
                evt.preventDefault();
                var uidmodview = $(this).attr("data-modviewuid");
                $("#uid_" + uidmodview + " .ModWindow:last").addClass("hidden-xs");
                $("#uid_" + uidmodview + " .ModWindow:first").removeClass("hidden-xs");
                $("#next_" + uidmodview).removeClass("disabled");
                $("#previous_" + uidmodview).addClass("disabled");
            });
            this.getEle("nav ul.pager li.next a").on('click', function (evt) {
                evt.preventDefault();
                var uidmodview = $(this).attr("data-modviewuid");
                $("#uid_" + uidmodview + " .ModWindow:first").addClass("hidden-xs");
                $("#uid_" + uidmodview + " .ModWindow:last").removeClass("hidden-xs");
                $("#previous_" + uidmodview).removeClass("disabled");
                $("#next_" + uidmodview).addClass("disabled");
            });
            this.getEle(".blockrequest").attr("id", "tge_" + this._uid).on('click', function (evt) {
                var tmpEle = $(evt.target);
                if (tmpEle.hasClass("taskBoxVisible")) {
                    tmpEle.removeClass("taskBoxVisible");
                    net_1.RequestManager.removeAllTasks($(evt.target).attr("id"));
                }
                else {
                    tmpEle.addClass("taskBoxVisible");
                    net_1.RequestManager.showAllTasks(tmpEle.attr("id"));
                }
                ;
            });
        }
        ModView.prototype.append = function (p_ele) {
            var alradyappended = p_ele.getEle().attr("data-modview");
            if (!alradyappended) {
                if (this.getEle().attr("data-firstmod") == "no") {
                    this.getEle().attr("data-firstmod", p_ele._uid);
                }
                else {
                    p_ele.getEle().addClass("hidden-xs");
                    if (this.getEle("nav.invisible")) {
                        this.getEle("nav.invisible").attr("style", "").removeClass("invisible").addClass("visible-xs");
                    }
                    else {
                        console.log("not suport append more than 2 modules!");
                    }
                    ;
                }
                ;
                p_ele.getEle().attr("data-modview", this._uid);
                p_ele._configModWindow._modview = this;
                this.getEle().append(p_ele.getEle());
                p_ele._onStart();
                p_ele.onStart();
            }
            ;
        };
        ModView.prototype.destroy = function () {
            var tmChildrens = this._childrenMods.length;
            for (var x = 0; x < tmChildrens; x++) {
                window[this._childrenMods[x]] = null;
            }
            ;
        };
        ModView.prototype.setIcon = function (p_icon) {
            this._icone = p_icon;
            $("#aba_s_" + this._uid + " a span.glyphicon").attr('class', 'hidden-xs glyphicon glyphicon-' + this._icone);
        };
        ModView.prototype.showNav = function (on) {
            if (on) {
                $("#aba_s_" + this._uid).css("display", "block");
            }
            else {
                $("#aba_s_" + this._uid).css("display", "none");
            }
            ;
            return this;
        };
        ModView.prototype.show = function (on) {
            if (!this._appended) {
                this._appended = true;
                $("#conteudo").append(this.getEle());
            }
            ;
            if (on) {
                $("#conteudo .ModView").removeClass("windowCA").css("display", "none");
                $("#navbarlist li.active").removeClass("active");
                $("#aba_s_" + this._uid).addClass("active").css("display", "block");
                this.getEle().addClass("windowCA").css("display", "block");
            }
            else {
                this.getEle().css("display", "none").removeClass("windowCA");
            }
            ;
            return this;
        };
        return ModView;
    })(core_1.Component);
    exports.ModView = ModView;
});
