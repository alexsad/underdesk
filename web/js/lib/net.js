/// <reference path="../../lib/jquery2.d.ts"/>
define(["require", "exports", "core", "controller"], function (require, exports, core_1, controller_1) {
    var Task = (function (_super) {
        __extends(Task, _super);
        function Task(p_dts) {
            _super.call(this, "div", "");
            this.s = "";
            this.t = 11;
            this.idRequest = 0;
            this.getEle().addClass("Task");
            if (p_dts.idRequest) {
                this._uid = p_dts.idRequest;
            }
            ;
            this.idRequest = this._uid;
            this.s = p_dts.s;
            this.getEle().attr("id", "uid_" + this._uid).css("width", "100%");
            if (!p_dts.t) {
                this.t = p_dts.idRequest;
            }
            ;
            this.lbMsg = new controller_1.Label("20% --> " + this.getTaskDesc());
            this.lbMsg.getEle().css({ "font-size": "8px", "font-weight": "normal", "float": "left", "margin-bottom": "2px", "width": "100%" });
            this.getEle().append(this.lbMsg.getEle());
        }
        Task.prototype.setIdModWindow = function (p_idModWindow) {
            this.idModWindow = p_idModWindow;
        };
        Task.prototype.getIdModWindow = function () {
            return this.idModWindow;
        };
        Task.prototype.finalizar = function (dtk2) {
            this.getEle().addClass("finalizado");
            this.lbMsg.setText("100% --> " + this.getTaskDesc());
            RequestManager._log_success({ "s": this.s + "", "m": "ok" });
        };
        Task.prototype.reload = function () {
            if (this.getEle().hasClass("TaskErro")) {
            }
            else if (!this.getEle().hasClass("finalizado")) {
                this.cancel();
            }
        };
        Task.prototype.cancel = function () {
            this.getEle().addClass("finalizado");
        };
        Task.prototype.setErro = function (isErr) {
            if (isErr) {
                this.getEle().addClass("TaskErro");
                this.lbMsg.getEle().addClass("alert-warning");
                this.lbMsg.getEle().parent(".blockrequest").removeClass("normal_load").addClass("erro_load");
            }
            else {
                this.lbMsg.getEle().removeClass("alert-warning");
            }
            ;
        };
        Task.prototype.setMSG = function (strMSG) {
            this.lbMsg.setText(this.getTaskDesc() + ":" + strMSG);
        };
        Task.prototype.setTaskDesc = function (strMSG) {
            var textoT = this.getTaskDesc() + " " + strMSG;
            if (textoT.length > 55) {
                textoT = textoT.substr(0, 55) + "...";
            }
            ;
            this.setMSG(textoT);
        };
        Task.prototype.getTaskDesc = function () {
            return this.s.replace(".", " ").toUpperCase() + " #" + this.idRequest;
        };
        Task.prototype.erroState = function (msge) {
            this.setErro(true);
            if (msge.join()) {
                this.setMSG(msge.join());
            }
            ;
            RequestManager._log_erro({ "s": this.s + "", "e": msge });
        };
        return Task;
    })(core_1.Component);
    exports.Task = Task;
    ;
    var RequestManager = (function () {
        function RequestManager() {
        }
        RequestManager._log_erro = function (args) { };
        RequestManager._log_success = function (args) { };
        RequestManager.addRequest = function (req) {
            //console.log(arguments.callee.caller);
            req.url = req.url || this.url;
            if (req.rootUrl) {
                req.url = req.rootUrl + req.url;
            }
            else {
                req.url = this._rootUrl + req.url;
            }
            ;
            req.format = req.format || this.format;
            var tsk = new Task({ "t": req.t, "s": req.url });
            tsk.setIdModWindow(req.module.getEle().attr("id"));
            if (!req["method"]) {
                req["method"] = "GET";
            }
            ;
            var idWinMod = "#" + tsk.getIdModWindow();
            $(idWinMod + " .blockrequest").addClass("_req_" + tsk.idRequest).css("display", (this._displayLoad ? "block" : "none"));
            $(idWinMod + " .blockrequest .BoxTasks").append(tsk.getEle());
            var onLoad = function (dtr) {
                var eleM = $("#" + this.getIdModWindow());
                if (!dtr.erro) {
                    this.finalizar(dtr);
                    var paiRE = eleM.find(".blockrequest");
                    paiRE.removeClass("_req_" + this.idRequest);
                    var classes = paiRE.attr("class");
                    if (classes) {
                        if (classes.indexOf("_req_") < 0) {
                            paiRE.css("display", "none").find(".BoxTasks").css("display", "none").find(".Task").remove();
                            RequestManager.finalizar();
                        }
                        ;
                    }
                    ;
                }
                else {
                    this.erroState(dtr.erro);
                }
            };
            var req_c12667 = {
                dataType: req.format,
                url: req.url,
                contentType: "application/json",
                method: req.method.toUpperCase()
            };
            if (req.format != "json") {
                req_c12667["data"] = req.data;
            }
            ;
            if (req.format == "json") {
                if (req_c12667["method"] == "PUT" || req_c12667["method"] == "POST") {
                    if (req.data) {
                        req_c12667["data"] = JSON.stringify(req.data);
                    }
                    ;
                }
                else if (req.data) {
                    req_c12667["data"] = req.data;
                }
            }
            ;
            var rec_promisse = $.ajax(req_c12667);
            if (req.onLoad) {
                rec_promisse.always(req.onLoad);
            }
            ;
            rec_promisse.then(onLoad.bind(tsk), function (xhr) {
                var errotxt = "Unknow Error";
                if (xhr.status == 0) {
                    errotxt = 'You are offline!! Please Check Your Network.';
                }
                else if (xhr.status == 404) {
                    errotxt = 'URL not found.';
                }
                else if (xhr.status == 500) {
                    errotxt = 'Internal Server Error.';
                }
                else {
                    errotxt = 'Unknow Error.' + xhr.responseText;
                }
                ;
                RequestManager._log_erro({ "s": "RequestManager.Erro" + "", "e": [errotxt] });
            });
        };
        RequestManager.refresh = function () { };
        RequestManager.finalizar = function () {
        };
        RequestManager.notifyTaskErro = function (idTask, erro) {
        };
        RequestManager.showAllTasks = function (p_idWinMod) {
            $("#" + p_idWinMod + " .BoxTasks").css("display", "block");
        };
        RequestManager.hideAllTasks = function (p_idWinMod) {
            $("#" + p_idWinMod + " .BoxTasks").css("display", "none");
        };
        RequestManager.setFormat = function (p_format) {
            this.format = p_format;
        };
        RequestManager.setUrl = function (p_url) {
            this.url = p_url;
        };
        RequestManager.setRootUrl = function (p_rootUrl) {
            this._rootUrl = p_rootUrl;
        };
        RequestManager.enableDisplayLoad = function (p_on) {
            this._displayLoad = p_on;
        };
        RequestManager.removeAllTasks = function (p_idWinMod) {
            if ($("#" + p_idWinMod).hasClass("erro_load")) {
                $("#" + p_idWinMod + " .BoxTasks .TaskErro").remove();
                $("#" + p_idWinMod).css("display", "none").removeClass().addClass("blockrequest normal_load");
            }
            ;
            this.hideAllTasks(p_idWinMod);
        };
        RequestManager.type = "GET";
        RequestManager.format = "json";
        RequestManager.url = "";
        RequestManager._rootUrl = "";
        RequestManager._displayLoad = true;
        RequestManager.TP_JSON = "json";
        RequestManager.TP_JSONP = "jsonp";
        return RequestManager;
    })();
    exports.RequestManager = RequestManager;
    var SimpleToolBar = (function (_super) {
        __extends(SimpleToolBar, _super);
        function SimpleToolBar() {
            _super.call(this, 'div', '<div class="btn-group btn-group-justified"></div>');
            this.getEle()
                .addClass("SimpleToolBar col-sm-offset-0 col-sm-12 col-xs-12")
                .css({ "margin-bottom": "10px", "z-index": "13" });
        }
        SimpleToolBar.prototype.addButton = function (nbuttom) {
            nbuttom.getEle(".btnLabel").addClass("hidden-xs");
            this.getEle("div.btn-group").append(nbuttom.getEle());
        };
        return SimpleToolBar;
    })(core_1.Component);
    exports.SimpleToolBar = SimpleToolBar;
    var ToolBar = (function (_super) {
        __extends(ToolBar, _super);
        function ToolBar(p_config) {
            _super.call(this);
            this._istoolbar = true;
            this._isactive = false;
            this._istoolbar = true;
            this._isactive = false;
            this._config = p_config;
            this.btAdd = new controller_1.Button("Novo");
            this.btAdd.setIcon("plus");
            this.btAdd.addEvent('click', function (evt) {
                evt.preventDefault();
                var tfield = this.getModule().getIdField();
                this.getModule()[tfield].setValue("");
                this.getModule().clearFormItem();
            }.bind(this));
            this.addButton(this.btAdd);
            this.btSave = new controller_1.Button("Salvar");
            this.btSave.setIcon("floppy-disk");
            this.btSave.addEvent('click', this.saveItem.bind(this));
            this.addButton(this.btSave);
            this.btDel = new controller_1.Button("Excluir");
            this.btDel.setIcon("minus-sign");
            this.btDel.getEle().removeClass("btn-default").addClass("btn-warning");
            this.btDel.addEvent('click', this.deleteItem.bind(this));
            this.addButton(this.btDel);
        }
        ToolBar.prototype.getDefaultRequest = function (p_act, p_method) {
            return { "format": RequestManager.format, "url": RequestManager.url + this._config.domain + p_act, "method": p_method, "module": this.getModule() };
        };
        ToolBar.prototype.updateItem = function (p_objToUpdate) {
            var req_objToUpdate = $.extend(this.getDefaultRequest("/", "put"), { "data": p_objToUpdate });
            req_objToUpdate = this.getModule().beforeUpdate(req_objToUpdate, this.getModule().getMainList().getSelectedItem());
            if (req_objToUpdate) {
                var tmpObjectMerged = $.extend(this.getModule().getMainList().getSelectedItem(), req_objToUpdate.data);
                this.getModule().getMainList().updateItem(tmpObjectMerged);
                RequestManager.addRequest(req_objToUpdate);
                tmpObjectMerged = null;
            }
        };
        ToolBar.prototype.insertItem = function (p_objToInsert) {
            var req_objToInsert = $.extend(this.getDefaultRequest("/", "post"), { "data": p_objToInsert });
            var modTmp = this.getModule();
            var tfield1 = modTmp.getIdField();
            var tcolumn1 = modTmp[tfield1].getColumn();
            delete req_objToInsert["data"][tcolumn1];
            req_objToInsert = this.getModule().beforeInsert(req_objToInsert);
            if (req_objToInsert) {
                RequestManager.addRequest($.extend(req_objToInsert, {
                    "onLoad": function (dta_new) {
                        if (!dta_new.erro) {
                            var tfield2 = this.getModule().getIdField();
                            var tcolumn2 = this.getModule()[tfield2].getColumn();
                            req_objToInsert["data"][tcolumn2] = dta_new;
                            delete req_objToInsert["format"];
                            delete req_objToInsert["onLoad"];
                            delete req_objToInsert["puid"];
                            delete req_objToInsert["method"];
                            delete req_objToInsert["url"];
                            this.getModule().getMainList().insertItem(req_objToInsert.data, 'bottom');
                            if (this.getModule()._embedFather) {
                                var tmpEmbedFather = this.getModule()._embedFather;
                                var tmpEmbedItem = this.getModule()._embedItem;
                                var tmC = 0;
                                var tmpEmbedFatherVar = window[tmpEmbedFather];
                                if (!tmpEmbedFatherVar.getMainList().getSelectedItem()[tmpEmbedItem]) {
                                    tmpEmbedFatherVar.getMainList().getSelectedItem()[tmpEmbedItem] = [];
                                }
                                else {
                                }
                                ;
                            }
                        }
                        ;
                    }.bind(this)
                }));
            }
        };
        ToolBar.prototype.deleteItem = function (event) {
            if (event) {
                event.preventDefault();
            }
            ;
            var modTmp = this.getModule();
            var tfield = modTmp.getIdField();
            var tcolumn = modTmp[tfield].getColumn();
            var p_req_delete = this.getDefaultRequest("/" + modTmp[tfield].getValue(), "delete");
            p_req_delete["onLoad"] = function (dta) {
                if (this.getModule().getMainList()) {
                    this.getModule().getMainList().removeItem(this.getModule().getMainList().getSelectedItem());
                }
                ;
                this.getModule().clearFormItem();
                this.getModule().getMainList().changeToIndex(0);
            }.bind(this);
            p_req_delete = this.getModule().beforeDelete(p_req_delete, this.getModule().getMainList().getSelectedItem());
            if (p_req_delete) {
                RequestManager.addRequest(p_req_delete);
            }
            ;
        };
        ToolBar.prototype.activate = function (p_on) {
            if (this._isactive != p_on) {
                this._isactive = p_on;
                var modTmp = this.getModule();
                var tmpList = modTmp.getMainList();
                if (p_on && tmpList) {
                    if (!tmpList.itemChange) {
                        if (tmpList.pageRequest) {
                            tmpList.pageRequest = function (p_obj) {
                                var p_req_reload = $.extend(this.getDefaultRequest("/", "get"), p_obj);
                                p_req_reload = this.getModule().beforeQuery(p_req_reload);
                                if (p_req_reload) {
                                    if (!p_req_reload.onLoad) {
                                        p_req_reload.onLoad = function (dta_ret) {
                                            var mainlisttmp = this.getModule().getMainList();
                                            mainlisttmp.setDataProvider(dta_ret);
                                            if (mainlisttmp["_pag"]) {
                                                mainlisttmp["_loading"] = false;
                                                mainlisttmp.getEle(".tilecellgrid").scrollTo(0, 10);
                                            }
                                        }.bind(this);
                                    }
                                    RequestManager.addRequest(p_req_reload);
                                }
                            }.bind(this);
                        }
                        tmpList["itemChange"] = function (p_item) {
                            if (p_item) {
                                var tmpColumns = modTmp.getColumns();
                                $.each(tmpColumns, function (index, cfield) {
                                    var fieldTmp = cfield["field"];
                                    var tmpValue = p_item[cfield["column"]];
                                    var tmpField = modTmp[fieldTmp];
                                    if (!tmpField) {
                                        console.log("change item #erro: field " + fieldTmp + " not exist!");
                                    }
                                    else if (tmpField.isBlankWhenNull() && (tmpValue == "undefined" || tmpValue == "null" || (!tmpValue))) {
                                        tmpField.setValue("");
                                    }
                                    else {
                                        tmpField.setValue(tmpValue);
                                    }
                                    ;
                                });
                            }
                            ;
                        }.bind(this);
                    }
                    ;
                }
                else if (this.getModule().getMainList()) {
                    this.getModule().getMainList().itemChange = null;
                }
                ;
            }
            ;
        };
        ToolBar.prototype.reloadItens = function (event) {
            if (event) {
                event.preventDefault();
            }
            ;
            var p_obj;
            if (this.getModule().getMainList()["_pag"]) {
                p_obj = this.getModule().getMainList().getPaginationParam();
            }
            ;
            var p_req_reload = $.extend(this.getDefaultRequest("/", "get"), p_obj);
            p_req_reload = this.getModule().beforeQuery(p_req_reload);
            if (p_req_reload) {
                if (!p_req_reload.onLoad) {
                    p_req_reload.onLoad = function (dta_ret) {
                        var mainlisttmp = this.getModule().getMainList();
                        mainlisttmp.setDataProvider(dta_ret);
                        if (mainlisttmp["_pag"]) {
                            mainlisttmp["_loading"] = false;
                            mainlisttmp.getEle(".tilecellgrid").scrollTo(0, 10);
                        }
                        ;
                    }.bind(this);
                }
                ;
                RequestManager.addRequest(p_req_reload);
            }
            ;
            this.activate(true);
        };
        ToolBar.prototype.syncItem = function () {
            var rs_objt = {};
            var modTmp = this.getModule();
            var tmpColumns = modTmp.getColumns();
            var anyinvalidfield = false;
            $.each(tmpColumns, function (index, cfield) {
                var fieldTmp = cfield.field;
                if (!modTmp[fieldTmp]) {
                    console.log("save item erro# field " + fieldTmp + " not exist!");
                }
                else {
                    var tmpCampo = modTmp[fieldTmp];
                    rs_objt[cfield["column"]] = tmpCampo.getValue();
                    if (!tmpCampo.isPrimaryKey()) {
                        if (tmpCampo.isValid() || tmpCampo.isTransient()) {
                            tmpCampo.setValid(true);
                        }
                        else {
                            tmpCampo.setValid(false);
                            anyinvalidfield = true;
                        }
                        ;
                    }
                    ;
                }
                ;
            });
            if (anyinvalidfield) {
                return null;
            }
            ;
            return rs_objt;
        };
        ToolBar.prototype.saveItem = function (event) {
            if (event) {
                event.preventDefault();
            }
            ;
            var objToSave = {};
            var modTmp = this.getModule();
            objToSave = this.syncItem();
            if (objToSave) {
                objToSave = modTmp.beforeSave(objToSave);
                if (objToSave) {
                    var pkC = modTmp.getIdField();
                    if (modTmp[pkC].getValue() == "") {
                        this.insertItem(objToSave);
                    }
                    else {
                        this.updateItem(objToSave);
                    }
                    ;
                }
                ;
            }
            ;
        };
        return ToolBar;
    })(SimpleToolBar);
    exports.ToolBar = ToolBar;
});
