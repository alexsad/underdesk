/// <reference path="../../lib/jquery2.d.ts"/>
define(["require", "exports", "util", "core", "net"], function (require, exports, util_1, core_1, net_1) {
    var Controller = (function () {
        function Controller(tagh, tagc) {
            this._uid = 0;
            this._html = null;
            this._uid = core_1.Underas.getUid();
            this._html = $("<" + tagh + ">");
            this.getEle().addClass("Controller").html(tagc).attr("id", "uid_" + this._uid);
            this.setBlankWhenNull(true);
        }
        Controller.prototype.getEle = function (p_sel) {
            if (!p_sel) {
                return this._html;
            }
            ;
            return this._html.find(p_sel);
        };
        Controller.prototype.setBlankWhenNull = function (on) {
            var whennull = (on) ? "y" : "n";
            this.getEle().attr("data-blankwhennull", whennull);
        };
        Controller.prototype.addEvent = function (p_on, p_event_fn, p_bind) {
            if (p_bind) {
                this.getEle().on(p_on, p_event_fn.bind(p_bind));
            }
            else {
                this.getEle().on(p_on, p_event_fn);
            }
            ;
            return this.getEle();
        };
        Controller.prototype.getInput = function () {
            return this.getEle(".inputtt");
        };
        Controller.prototype.setLabel = function (nlabel) {
            this.getEle("label").text(nlabel);
        };
        Controller.prototype.setValue = function (vl) {
            this.getInput().val(vl);
        };
        Controller.prototype.setTransient = function (on) {
            var readyS = (on) ? "y" : "n";
            this.getEle().attr("data-transient", readyS);
        };
        Controller.prototype.isTransient = function () {
            return this.getEle().attr("data-transient") == "y";
        };
        Controller.prototype.isBlankWhenNull = function () {
            return this.getEle().attr("data-blankwhennull") == "y";
        };
        Controller.prototype.setFixed = function (on) {
            var readyS = (on) ? "y" : "n";
            this.getEle().attr("data-fixed", readyS);
        };
        Controller.prototype.isFixed = function () {
            return this.getEle().attr("data-fixed") == "y";
        };
        Controller.prototype.getValue = function () {
            return this.getInput().val().trim();
        };
        Controller.prototype.setEnable = function (on, p_posi) {
            if (on) {
                if (!p_posi) {
                    this.getEle(".input-group .cposis").attr("data-enable", "y");
                    this.getEle(".input-group .cposis").attr("disabled", !on).removeClass("Disabled").css("opacity", 1);
                }
                else {
                    this.getEle(".cposi_" + p_posi).attr("data-enable", "y");
                    this.getEle(".cposi_" + p_posi).attr("disabled", !on).removeClass("Disabled").css("opacity", 1);
                }
            }
            else {
                if (!p_posi) {
                    this.getEle(".input-group .cposis").attr("data-enable", "n");
                    this.getEle(".input-group .cposis").attr("disabled", !on).addClass("Disabled").css("opacity", 0.6);
                }
                else {
                    this.getEle(".cposi_" + p_posi).attr("data-enable", "n");
                    this.getEle(".cposi_" + p_posi).attr("disabled", !on).addClass("Disabled").css("opacity", 0.6);
                }
            }
        };
        Controller.prototype.isEnable = function (p_posi) {
            var enableS = "n";
            if (!p_posi) {
                enableS = this.getInput().attr("data-enable");
            }
            else {
                enableS = this.getEle(".cposi_" + p_posi).attr("data-enable");
            }
            ;
            return enableS != "n";
        };
        Controller.prototype.setSize = function (nsize) {
            var classes = this.getEle().attr("class");
            var ns = classes.replace(/col\-sm\-(\d{1,2})/, "col-sm-" + nsize);
            ns = ns.replace(/col\-md\-(\d{1,2})/, "col-md-" + nsize);
            this.getEle().removeClass().addClass(ns);
        };
        Controller.prototype.setMaxLength = function (p_lgt) {
            this.getInput().attr('maxlength', p_lgt);
        };
        Controller.prototype.setMinLength = function (p_lgt, p_msgerro) {
        };
        Controller.prototype.setValidation = function (p_mask, p_msgerro) {
        };
        Controller.prototype.setPlaceHolder = function (p_placeholder) {
            this.getEle(".inputtt").attr("placeholder", p_placeholder);
        };
        Controller.prototype.show = function (pshow) {
            if (pshow) {
                this.getEle().css("display", "block");
            }
            else {
                this.getEle().css("display", "none");
            }
            ;
        };
        Controller.prototype.isPrimaryKey = function () {
            return this.getEle().attr("data-primarykey") == "y";
        };
        Controller.prototype.isValid = function () {
            var vl = this.getValue();
            return vl.length > 0 == true;
        };
        Controller.prototype.setValid = function (p_on) {
            if (p_on) {
                this.getEle().removeClass("has-error");
            }
            else {
                this.getEle().addClass("has-error");
            }
            ;
        };
        Controller.prototype.setColumn = function (p_column) {
            var tcolumn = p_column;
            this.getEle().attr("data-primarykey", "n");
            if (p_column.indexOf("#") == 0) {
                this.setTransient(true);
                p_column = p_column.replace("#", "@");
            }
            else if (p_column.indexOf("$") == 0) {
                this.getEle().attr("data-primarykey", "y");
                p_column = p_column.replace("$", "@");
            }
            else if (p_column.indexOf("!") == 0) {
                this.setFixed(true);
                p_column = p_column.replace("!", "@");
            }
            this.getEle().attr("data-column", p_column.replace("@", ""));
        };
        Controller.prototype.getColumn = function () {
            return this.getEle().attr("data-column");
        };
        Controller.prototype.getModule = function () {
            return this._modwindow;
        };
        return Controller;
    })();
    exports.Controller = Controller;
    var ListViewItemRender = (function (_super) {
        __extends(ListViewItemRender, _super);
        function ListViewItemRender(p_obj, p_html) {
            _super.call(this, 'div', '');
            this._maxCells = 0;
            this._maxRows = 5;
            this._html = $(core_1.Underas.templateCompile(p_html, p_obj));
            this.getEle().attr("id", "uid_" + this._uid).css("z-index", this._uid + 1);
        }
        ListViewItemRender.prototype.getMaxCells = function () {
            if (this._maxCells == 0) {
                var tmsA = this.getEle().attr("class").match(/col\-sm\-(\d{1,2})/);
                if (tmsA) {
                    this._maxCells = 12 / parseInt(tmsA[1]);
                }
                ;
            }
            ;
            return this._maxCells;
        };
        ListViewItemRender.prototype.getMaxRows = function () {
            return this._maxRows;
        };
        ListViewItemRender.prototype.setMaxCells = function (p_maxcells) {
            this._maxCells = p_maxcells;
        };
        ListViewItemRender.prototype.setMaxRows = function (p_maxrows) {
            this._maxRows = p_maxrows;
        };
        return ListViewItemRender;
    })(core_1.Component);
    exports.ListViewItemRender = ListViewItemRender;
    var Img = (function (_super) {
        __extends(Img, _super);
        function Img(p_sourceimgp) {
            if (p_sourceimgp === void 0) { p_sourceimgp = ""; }
            _super.call(this, "img", "");
            this.getEle().addClass("Img");
            this.setSource(p_sourceimgp);
        }
        Img.prototype.setSource = function (p_source) {
            this.getEle().attr("src", p_source);
        };
        return Img;
    })(core_1.Component);
    exports.Img = Img;
    var Text = (function (_super) {
        __extends(Text, _super);
        function Text(p_text) {
            _super.call(this, 'label', '');
            this.getEle().text(p_text).addClass("Text col-xs-12");
        }
        Text.prototype.setText = function (p_text) {
            this.getEle().text(p_text);
        };
        return Text;
    })(Controller);
    exports.Text = Text;
    var Input = (function (_super) {
        __extends(Input, _super);
        function Input(tipo, valor) {
            _super.call(this, 'div', '');
            this.getEle()
                .addClass("form-group col-xs-12 col-sm-4 col-md-4")
                .append('<label class="control-label" for="inputIcon_' + this._uid + '">Exemplo</label>' +
                '<div class="col-xs-12 input-group input-group-sm">' +
                '<input class="inputtt form-control cposi_2 cposis" id="inputIcon_' + this._uid + '" type="' + tipo + '" value="' + valor + '">' +
                '</div>');
        }
        Input.prototype.setIcon = function (p_src) {
            if (this.getEle(".addon1").length == 0) {
                this.getEle(".input-group").append('<span class="input-group-addon addon1 cposi_1 cposis">');
            }
            ;
            this.getEle(".addon1").html('<span class="icon1 glyphicon iconeinput glyphicon-' + p_src + '"></span>');
        };
        Input.prototype.setAddonText = function (p_txt) {
            if (this.getEle(".addon1").length == 0) {
                this.getEle(".input-group").append('<span class="input-group-addon addon1 cposi_1 cposis">');
            }
            ;
            this.getEle(".addon1").html("").text(p_txt);
        };
        return Input;
    })(Controller);
    exports.Input = Input;
    var InputDouble = (function (_super) {
        __extends(InputDouble, _super);
        function InputDouble(tipo, valor) {
            _super.call(this, 'div', '');
            this.getEle()
                .addClass("form-group col-xs-12 col-sm-4 col-md-4")
                .append('<label class="control-label" for="inputIcon_' + this._uid + '">Exemplo</label>' +
                '<div class="col-xs-12 input-group input-group-sm">' +
                '<span class="input-group-addon addon1 cposi_1 cposis"></span>' +
                '<input class="inputtt col-xs-9 form-control cposi_2 cposis" id="inputIcon_' + this._uid + '" type="' + tipo + '" value="' + valor + '">' +
                '<span class="input-group-addon addon2 imgDown cposi_3 cposis"></span>' +
                '</div>');
        }
        InputDouble.prototype.setIcon = function (psrc, posi) {
            if (posi === void 0) { posi = 1; }
            this.getEle(".addon" + posi).html('<span class="icon' + posi + ' glyphicon iconeinput glyphicon-' + psrc + '"></span>');
        };
        InputDouble.prototype.setAddonText = function (ptxt, posi) {
            if (posi === void 0) { posi = 1; }
            this.getEle(".addon" + posi).html("").text(ptxt);
        };
        return InputDouble;
    })(Controller);
    exports.InputDouble = InputDouble;
    var InputText = (function (_super) {
        __extends(InputText, _super);
        function InputText(p_text) {
            if (p_text === void 0) { p_text = ""; }
            _super.call(this, 'text', p_text);
            this.getEle().addClass("InputText");
        }
        return InputText;
    })(Input);
    exports.InputText = InputText;
    var InputTextDouble = (function (_super) {
        __extends(InputTextDouble, _super);
        function InputTextDouble(p_text) {
            if (p_text === void 0) { p_text = ""; }
            _super.call(this, 'text', p_text);
            this.getEle().addClass("InputTextDouble");
        }
        return InputTextDouble;
    })(InputDouble);
    exports.InputTextDouble = InputTextDouble;
    var CheckBox = (function (_super) {
        __extends(CheckBox, _super);
        function CheckBox(p_label, p_innerLabel) {
            _super.call(this, 'div', '');
            this.checkedValue = "S";
            this.unCheckedValue = "N";
            this.getEle()
                .html('<label class="control-label" for="inputIcon_' + this._uid + '">' + p_label + '</label>' +
                '<div class="input-group  input-group-sm">' +
                '<span class="input-group-addon">' +
                '<input class="inputtt cposi_1 cposis" id="inputIcon_' + this._uid + '" type="checkbox">' +
                '</span>' +
                '<input type="text" disabled="true" class="form-control cposi_2 cposis" value="' + p_innerLabel + '"/>' +
                '</div>')
                .addClass("col-xs-12 col-sm-12 form-group CheckBox");
        }
        CheckBox.prototype.setCheckedValue = function (p_vl) {
            this.checkedValue = p_vl;
        };
        CheckBox.prototype.setUnCheckedValue = function (p_vl) {
            this.unCheckedValue = p_vl;
        };
        CheckBox.prototype.isValid = function () {
            return true;
        };
        CheckBox.prototype.setValue = function (p_vl) {
            var checked = false;
            if (p_vl == this.checkedValue) {
                checked = true;
            }
            ;
            this.getEle("input.inputtt").prop("checked", checked);
        };
        CheckBox.prototype.getValue = function () {
            return this.getEle("input.inputtt").is(':checked') ? this.checkedValue : this.unCheckedValue;
        };
        return CheckBox;
    })(Controller);
    exports.CheckBox = CheckBox;
    (function (DatePartType) {
        DatePartType[DatePartType["day"] = 0] = "day";
        DatePartType[DatePartType["month"] = 1] = "month";
        DatePartType[DatePartType["year"] = 2] = "year";
    })(exports.DatePartType || (exports.DatePartType = {}));
    var DatePartType = exports.DatePartType;
    var DatePicker = (function (_super) {
        __extends(DatePicker, _super);
        function DatePicker() {
            _super.call(this, "");
            this.dtaA = new Date();
            this.refresh();
            this.setIcon("calendar");
            this.setSize(3);
            this.setMaxLength(10);
            this.getEle().addClass("DatePicker");
        }
        DatePicker.prototype.getValue = function () {
            var txtDate = this.getInput().val();
            if (txtDate != null) {
                var ArrayDta = txtDate.split("-");
                var tmpMonthS = "" + ArrayDta[1];
                if (parseInt(ArrayDta[1]) < 10) {
                    tmpMonthS = "0" + parseInt(tmpMonthS);
                }
                ;
                var tmpDayS = "" + ArrayDta[0];
                if (parseInt(ArrayDta[0]) < 10) {
                    tmpDayS = "0" + parseInt(tmpDayS);
                }
                ;
                return ArrayDta[2] + "-" + tmpMonthS + "-" + tmpDayS + "T23:59:59Z";
            }
            ;
            return null;
        };
        DatePicker.prototype.setValue = function (p_value) {
            var dtaTxt = "";
            if (p_value) {
                this.dtaA = new Date(p_value);
                dtaTxt = this.dtaA.getDate() + "-" + (this.dtaA.getMonth() + 1) + "-" + this.dtaA.getFullYear();
            }
            ;
            this.getInput().val(dtaTxt);
        };
        DatePicker.prototype.getDate = function () {
            return this.dtaA;
        };
        DatePicker.prototype.getDateString = function () {
            var ArrayDta = this.getValue().split("-");
            this.dtaA.setFullYear(parseInt(ArrayDta[2]), parseInt(ArrayDta[1]), parseInt(ArrayDta[0]));
            return "dtaA";
        };
        DatePicker.prototype.addDate = function (typeD, pluss) {
            var tipoS = [0, 0, 0];
            tipoS[typeD] = pluss;
            this.dtaA.setFullYear(this.dtaA.getFullYear() + tipoS[DatePartType.year], this.dtaA.getMonth() + tipoS[DatePartType.month], this.dtaA.getDate() + tipoS[DatePartType.day]);
            this.refresh();
        };
        DatePicker.prototype.setDate = function (typeD, vl) {
            var tipoS = [this.dtaA.getDate(), (this.dtaA.getMonth() + 1), this.dtaA.getFullYear()];
            tipoS[typeD] = vl;
            this.dtaA.setFullYear(tipoS[DatePartType.year], tipoS[DatePartType.month], tipoS[DatePartType.day]);
            this.refresh();
        };
        DatePicker.prototype.refresh = function () {
            var dtaTxt = (this.dtaA.getDate()) + "-" + (this.dtaA.getMonth() + 1) + "-" + (this.dtaA.getFullYear());
            this.getInput().val(dtaTxt);
        };
        DatePicker.prototype.isValid = function () {
            if (util_1.ValidationType.DATE.test(this.getInput().val())) {
                return true;
            }
            ;
            return false;
        };
        return DatePicker;
    })(InputText);
    exports.DatePicker = DatePicker;
    var InputPassWord = (function (_super) {
        __extends(InputPassWord, _super);
        function InputPassWord(p_text) {
            if (p_text === void 0) { p_text = ""; }
            _super.call(this, "password", p_text);
            this.getEle().addClass("InputPassWord InputText");
            this.setIcon("lock");
        }
        return InputPassWord;
    })(Input);
    exports.InputPassWord = InputPassWord;
    var InputPercent = (function (_super) {
        __extends(InputPercent, _super);
        function InputPercent(p_text) {
            if (p_text === void 0) { p_text = ""; }
            _super.call(this, p_text);
            this.setAddonText("%");
            this.setSize(3);
            this.getEle().addClass("InputPercent");
        }
        return InputPercent;
    })(InputText);
    exports.InputPercent = InputPercent;
    var InputMoney = (function (_super) {
        __extends(InputMoney, _super);
        function InputMoney(p_text) {
            if (p_text === void 0) { p_text = ""; }
            _super.call(this, p_text);
            this.setAddonText("$");
            this.setSize(3);
            this.getEle().addClass("InputMoney");
        }
        return InputMoney;
    })(InputText);
    exports.InputMoney = InputMoney;
    var InputTime = (function (_super) {
        __extends(InputTime, _super);
        function InputTime(p_text) {
            if (p_text === void 0) { p_text = ""; }
            _super.call(this, p_text);
            this.setIcon("time");
            this.setSize(2);
            this.setMaxLength(5);
            this.getEle().addClass("InputTime");
        }
        return InputTime;
    })(InputText);
    exports.InputTime = InputTime;
    var InputEmail = (function (_super) {
        __extends(InputEmail, _super);
        function InputEmail(p_text) {
            if (p_text === void 0) { p_text = ""; }
            _super.call(this, p_text);
            this.setAddonText("@");
            this.setSize(2);
            this.getEle().addClass("InputEmail");
        }
        InputEmail.prototype.isValid = function () {
            if (util_1.ValidationType.EMAIL.test(this.getValue())) {
                return true;
            }
            ;
            return false;
        };
        return InputEmail;
    })(InputText);
    exports.InputEmail = InputEmail;
    var InputPhone = (function (_super) {
        __extends(InputPhone, _super);
        function InputPhone(p_text) {
            if (p_text === void 0) { p_text = ""; }
            _super.call(this, "(0" + p_text + ")");
            this.setIcon("earphone");
            this.setSize(3);
            this.setMaxLength(16);
            this.getEle().addClass("InputPhone");
        }
        return InputPhone;
    })(InputText);
    exports.InputPhone = InputPhone;
    var Label = (function (_super) {
        __extends(Label, _super);
        function Label(p_text) {
            if (p_text === void 0) { p_text = ""; }
            _super.call(this, 'label', '');
            this.getEle().text(p_text).addClass("Label col-xs-12 col-sm-12");
        }
        Label.prototype.setText = function (p_text) {
            this.getEle().text(p_text);
        };
        return Label;
    })(Controller);
    exports.Label = Label;
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button(p_label) {
            _super.call(this, 'a', '<span class="btnLabel cposi_1 cposis">&nbsp;' + p_label + '&nbsp;</span>');
            this.getEle().addClass("btn btn-default Button").attr("href", "#");
        }
        Button.prototype.setIcon = function (psrc) {
            if (this.getEle('span.iconeinput').length == 0) {
                this.getEle().append('<span class="imgI iconeinput glyphicon glyphicon-' + psrc + '"></span>');
            }
            else {
                var classes = this.getEle('span.iconeinput').attr("class");
                var ns = classes.replace(/glyphicon\-\w+/, "glyphicon-" + psrc);
                this.getEle('span.iconeinput').removeClass().addClass(ns);
            }
            ;
        };
        Button.prototype.setLabel = function (p_label) {
            this.getEle("span.btnLabel").text("&nbsp;" + p_label + "&nbsp;");
        };
        Button.prototype.setEnable = function (on) {
            if (on) {
                this.getEle().attr("disabled", !on).removeClass("Disabled").css("opacity", 1);
            }
            else {
                this.getEle().attr("disabled", !on).addClass("Disabled").css("opacity", 0.6);
            }
            ;
        };
        Button.prototype.isEnable = function () {
            return this.getEle().hasClass("Disabled");
        };
        return Button;
    })(Controller);
    exports.Button = Button;
    var LinkButton = (function (_super) {
        __extends(LinkButton, _super);
        function LinkButton(p_label) {
            _super.call(this, 'li', '<a href="#"><label>&nbsp;' + p_label + '&nbsp;</label></a>');
            this.getEle().addClass("LinkButton");
        }
        LinkButton.prototype.setIcon = function (psrc) {
            if (this.getEle('span.iconeinput').length == 0) {
                this.getEle('a').append('<span class="imgI hidden-xs iconeinput glyphicon glyphicon-' + psrc + '"></span>');
            }
            else {
                var classes = this.getEle('span.iconeinput').attr("class");
                var ns = classes.replace(/glyphicon\-\w+/, "glyphicon-" + psrc);
                this.getEle('span.iconeinput').removeClass().addClass(ns);
            }
            ;
        };
        LinkButton.prototype.setLabel = function (p_label) {
            this.getEle("a label").text("&nbsp;" + p_label + "&nbsp;");
        };
        LinkButton.prototype.setEnable = function (on) {
            if (on) {
                this.getEle().attr("disabled", !on).removeClass("Disabled").css("opacity", 1);
            }
            else {
                this.getEle().attr("disabled", !on).addClass("Disabled").css("opacity", 0.6);
            }
            ;
        };
        LinkButton.prototype.isEnable = function () {
            return this.getEle().hasClass("Disabled");
        };
        return LinkButton;
    })(Controller);
    exports.LinkButton = LinkButton;
    var MenuTab = (function (_super) {
        __extends(MenuTab, _super);
        function MenuTab(p_config) {
            _super.call(this, 'div', '');
            this._config = p_config;
        }
        MenuTab.prototype.addTab = function (label, boxM, iconeM, tmItens, tabid) {
            var menuToPut = $('<li id="tabmenu_' + tabid + '" class="navitem"><a class="" href="#"><span class="imgI glyphicon iconeinput glyphicon-' + iconeM + '"></span><label class="hidden-xs">' + label + '</label></a></li>');
            $(this._config.target).parent("div.menu_main").find(".tab_content_menu").append(boxM);
            $(this._config.target).append(menuToPut);
        };
        MenuTab.prototype.setIcon = function (p_src) {
        };
        MenuTab.prototype.appendTo = function (p_idFather) {
            $(p_idFather).append(this.getEle());
        };
        MenuTab.prototype.setDataProvider = function (p_dta) {
            var tml = p_dta.length;
            for (var z = 0; z < tml; z++) {
                var menuItemTmp = p_dta[z];
                this.criarTabNova(menuItemTmp.label, menuItemTmp.icone, menuItemTmp.children, z);
            }
            ;
            this.appendTo(this._config.target);
        };
        MenuTab.prototype.criarTabNova = function (label, picone, childrens, tabid) {
            var boxM = $('<ul id="tabmenu_' + tabid + '_l" class="nav nav-pills"></ul>');
            boxM.css("display", "none");
            var tml = childrens.length;
            var iconeM = "file";
            for (var z = 0; z < tml; z++) {
                var btTab = new LinkButton(childrens[z].label);
                btTab.getEle().addClass("elegibleToClick");
                if (childrens[z].icone != " ") {
                    btTab.setIcon(childrens[z].icone);
                    btTab.getEle(".imgI").addClass("hidden-xs");
                    iconeM = childrens[z].icone;
                }
                ;
                if (childrens[z].tela != "") {
                    btTab.getEle().attr({ "data-varmod": childrens[z].tela, "data-actmod": childrens[z].funcao, "data-iconmod": iconeM, "data-titlemod": childrens[z].label });
                }
                else {
                    btTab.setEnable(false);
                }
                boxM.append(btTab.getEle());
            }
            this.addTab(label, boxM, picone, tml, tabid);
        };
        return MenuTab;
    })(core_1.Component);
    exports.MenuTab = MenuTab;
    var Select = (function (_super) {
        __extends(Select, _super);
        function Select(p_placeholder) {
            if (p_placeholder === void 0) { p_placeholder = ""; }
            _super.call(this, "text", "");
            this._valuefield = "id";
            this._labelfield = "label";
            this.getEle().addClass("Select");
            this.setIcon("search", 1);
            this.setIcon("triangle-bottom", 2);
            this.setPlaceHolder(p_placeholder);
            this.getEle().append('<ul id="uid_' + this._uid + '_2" style="z-index:9999;top:56px;left:18px;display:none;max-height:160px;overflow:auto" class="select-content dropdown-menu" role="menu"></ul>');
            this.addEvent('keyup', this.setFilter.bind(this));
            this.getEle(".addon2").on('click', this.reSizeList.bind(this));
            this.getEle("ul.select-content").on('click', 'li.select_option_value', this.getFromUpList.bind(this));
        }
        Select.prototype.onNotFound = function (evt) {
        };
        Select.prototype.reSizeList = function (evt) {
            evt.preventDefault();
            if ($('#uid_' + this._uid + '_2').css("display") == "block") {
                this.showList(false).css({ "width": (this.getEle().offset().top - 30) + "px" });
            }
            else if (this.isEnable(2)) {
                this.showList(true);
            }
        };
        Select.prototype.showList = function (p_on) {
            return $('#uid_' + this._uid + '_2').css("display", (p_on) ? "block" : "none");
        };
        Select.prototype.getFromUpList = function (evt) {
            evt.preventDefault();
            var _this = $(evt.target);
            var p_vl = _this.attr("data-vl");
            this.getEle().attr({ "data-prevalue": p_vl, "data-vl": p_vl });
            this.showList(false);
            this.getInput().val(_this.text()).trigger("change");
        };
        Select.prototype.setFilter = function (evt) {
            if (evt.which == 40) {
            }
            else if (evt.which == 13) {
            }
            else {
                $('#uid_' + this._uid + '_2').css({ "display": "block" });
                var p_filter = $(evt.target).val().toLowerCase();
                $('#uid_' + this._uid + '_2 li.select_option_value').each(function () {
                    var item = $(this);
                    if (item.text().toLowerCase().indexOf(p_filter) > -1) {
                        item.css("display", "block");
                    }
                    else {
                        item.css("display", "none");
                    }
                    ;
                });
            }
        };
        Select.prototype.setValueField = function (p_column) {
            this._valuefield = p_column;
        };
        Select.prototype.setLabelField = function (p_column) {
            this._labelfield = p_column;
        };
        Select.prototype.getValueField = function () {
            return this._valuefield;
        };
        Select.prototype.getLabelField = function () {
            return this._labelfield;
        };
        Select.prototype.setDataProvider = function (p_dta) {
            var tm = p_dta.length;
            var t_html = "";
            for (var x = 0; x < tm; x++) {
                var itemS = p_dta[x];
                t_html += '<li role="presentation" data-vl="' + itemS[this.getValueField()] + '" data-text="' + itemS[this.getLabelField()] + '" class="select_option_value"><a role="menuitem" tabindex="-1" data-vl="' + itemS[this.getValueField()] + '" href="#">' + itemS[this.getLabelField()] + '</a></li>';
            }
            ;
            $('#uid_' + this._uid + '_2').html(t_html);
            t_html = null;
            p_dta = [];
            p_dta = null;
        };
        Select.prototype.getValue = function () {
            return this.getEle().attr("data-vl");
        };
        Select.prototype.getText = function () {
            return this.getValue();
        };
        Select.prototype.isValid = function () {
            var vl = this.getValue();
            if (!vl) {
                return false;
            }
            ;
            return vl.length > 0 == true;
        };
        Select.prototype.setValue = function (p_vl) {
            var tmpVl = "";
            if (!p_vl) {
                this.getInput().val("");
                return;
            }
            else {
                tmpVl = p_vl + "";
            }
            ;
            if (tmpVl.length > 0) {
                this.getEle().attr({ "data-prevalue": p_vl, "data-vl": p_vl });
                var tmpDesc = this.getDescFromServiceByValue(p_vl);
                this.getInput().val(tmpDesc);
            }
            else {
                this.getInput().val("");
            }
            ;
        };
        Select.prototype.getDescFromServiceByValue = function (p_vl) {
            var tmpDesc = "";
            $('#uid_' + this._uid + '_2 li.select_option_value').each(function () {
                var item = $(this);
                if (item.attr("data-vl") == p_vl) {
                    tmpDesc = item.attr("data-text");
                    return false;
                }
                ;
                return true;
            });
            return tmpDesc;
        };
        Select.prototype.reloadService = function () {
            var _serv = this.getEle().attr("data-serv");
            if (_serv) {
            }
            ;
        };
        Select.prototype.fromService = function (p_req_service) {
            this.getEle().attr("data-serv", p_req_service.url);
            p_req_service.onLoad = function (rs) {
                this.setDataProvider(rs);
                var _prevl = this.getEle().get("data-prevalue");
                if (_prevl) {
                    this.setValue(_prevl);
                }
            }.bind(this);
            net_1.RequestManager.addRequest(p_req_service);
        };
        return Select;
    })(InputDouble);
    exports.Select = Select;
    var ListView = (function (_super) {
        __extends(ListView, _super);
        function ListView(p_title) {
            _super.call(this, "div", '<div class="headgridview col-xs-12 col-sm-12 col-md-12"></div><div class="tilecellgrid col-xs-12 col-sm-12 col-md-12"></div>');
            this._ind = 0;
            this._islistview = true;
            this._rowhtml = '<div><div class="col-sm-12 col-sx-12"></div></div>';
            this._islistview = true;
            this.dataProvider = [];
            this.getEle()
                .addClass("boxTileLine ListView")
                .append('<div class="col-xs-12"><ul id="pagination_' + this._uid + '" class="pagination pagination-sm"></ul></div>');
            this._itFilter = new InputText("");
            this._itFilter.setSize(12);
            this._itFilter.setLabel("filtrar");
            this._itFilter.setIcon("search");
            this._itFilter.addEvent('keydown', this.setFilter.bind(this));
            this._itOrderBy = new Select("");
            this._itOrderBy.setSize(5);
            this._itOrderBy.setLabel("ordem");
            this._itOrderBy.setIcon("chevron-down");
            this._itOrderBy.setValueField("idColumn");
            this._itOrderBy.setLabelField("column");
            this._itOrderBy.getInput().attr("data-orderfield", "asc");
            this.getEle().prepend(this._itFilter.getEle());
            this.getEle(".tilecellgrid").on('click', '.tilecell', this.onChangeSelectedItem.bind(this));
            this.getEle('#pagination_' + this._uid).on('click', 'li a', this.changePg.bind(this));
        }
        ListView.prototype.getPaginationParam = function () {
            return null;
        };
        ListView.prototype.setDataProvider = function (p_dta) {
            if (p_dta) {
                this.dataProvider = p_dta;
                if (this.dataProvider.length > 0) {
                    var tmpColumns = this.getModule().getColumns();
                    var dtaOrder = [];
                    $.each(tmpColumns, function (index, cfield) {
                        var tcolumn = cfield.column;
                        dtaOrder.push({ "idColumn": tcolumn, "column": tcolumn });
                    });
                    this._itOrderBy.setDataProvider(dtaOrder);
                }
                ;
            }
            else {
                this.dataProvider = [];
            }
            ;
            return this.refresh();
        };
        ListView.prototype.getDataProvider = function () {
            return this.dataProvider;
        };
        ListView.prototype.setHeight = function (p_height) {
            this.getEle().css({ "height": p_height + "px" });
        };
        ListView.prototype.setRow = function (p_html) {
            this._rowhtml = p_html;
        };
        ListView.prototype.addRow = function (p_pg, p_html) {
            var tmpRow;
            if (p_html) {
                tmpRow = $(p_html);
            }
            else {
                tmpRow = $(this._rowhtml);
            }
            ;
            tmpRow.attr("data-citens", 0).addClass('row_cells col pg_u' + p_pg);
            this.getEle(".tilecellgrid").append(tmpRow);
        };
        ListView.prototype.setHeadGrid = function (p_html) {
            this.getEle(".headgridview").html(p_html);
        };
        ListView.prototype.getRow = function (p_index) {
            if (p_index === void 0) { p_index = 0; }
            return this.getEle(".tilecellgrid .row_cells:last");
        };
        ListView.prototype.clear = function () {
            this.getEle(".tilecellgrid").html("");
            $('#pagination_' + this._uid).html("");
        };
        ListView.prototype.refresh = function () {
            var tmpOnWithTemplate = function () {
                var dpt = this.dataProvider.length;
                this.clear();
                if (dpt > 0) {
                    var qt_pg = 1;
                    var qt_row = 0;
                    var qt_cells = 0;
                    var pgvisible = "block";
                    var tmpItemRender = new ListViewItemRender(this.dataProvider[0], this._itemTemplateHtml);
                    var max_cells = tmpItemRender.getMaxCells();
                    var max_rows = tmpItemRender.getMaxRows();
                    tmpItemRender = null;
                    $('#pagination_' + this._uid).append($('<li><a class="active" data-pg="' + qt_pg + '" href="#">' + qt_pg + '</a></li>'));
                    this.addRow(qt_pg);
                    this.getRow().css("display", pgvisible);
                    for (var z = 0; z < dpt; z++) {
                        if (qt_cells >= max_cells) {
                            qt_cells = 0;
                            qt_row++;
                            if (qt_row >= max_rows) {
                                qt_row = 0;
                                qt_pg++;
                                pgvisible = "none";
                                $('#pagination_' + this._uid).append('<li><a class="disabled" data-pg="' + qt_pg + '" href="#">' + qt_pg + '</a></li>');
                            }
                            ;
                            this.addRow(qt_pg);
                            this.getRow().css("display", pgvisible);
                        }
                        ;
                        qt_cells++;
                        this.getRow().attr("data-citens", qt_cells);
                        var item = this.dataProvider[z];
                        item["_ind"] = z;
                        var itemRender = new ListViewItemRender(item, this._itemTemplateHtml);
                        itemRender.getEle().attr("data-ind", z).addClass("tilecell list-group-item");
                        this.getRow().append(itemRender.getEle());
                    }
                    ;
                    this.changeToIndex(0);
                }
                ;
            }.bind(this);
            if (!this._itemTemplateHtml) {
                this._getTmpUrl(tmpOnWithTemplate);
            }
            else {
                tmpOnWithTemplate();
            }
            ;
            tmpOnWithTemplate = null;
            return this;
        };
        ListView.prototype._getTmpUrl = function (fnAfter) {
            var urlModule = this.getModule().getUrlModule();
            urlModule = urlModule.replace(/\.+/g, "/");
            urlModule = urlModule.substring(0, urlModule.lastIndexOf("/"));
            this._urlTemplate = urlModule + "/" + this._urlTemplate;
            $.get(this._urlTemplate, function (p_templateHtml) {
                this._itemTemplateHtml = p_templateHtml;
                fnAfter();
            }.bind(this));
        };
        ListView.prototype.setFilter = function (evt) {
            if (evt.which == 13) {
                var p_filter = $(evt.target).val().toLowerCase();
                this.getEle(".tilecellgrid .row_cells").each(function () {
                    var _item = $(this);
                    if (_item.text().toLowerCase().indexOf(p_filter) > -1) {
                        _item.css("display", "block");
                        _item.find(".tilecell").each(function () {
                            var item2 = $(this);
                            if (item2.text().toLowerCase().indexOf(p_filter) > -1) {
                                item2.css("display", "block");
                            }
                            else {
                                item2.css("display", "none");
                            }
                        });
                    }
                    else {
                        _item.css("display", "none");
                    }
                });
            }
        };
        ListView.prototype.setOrderField = function (evt) {
            var oldOrder = this._itOrderBy.getInput().attr("data-orderfield");
            var icontmp = "chevron-down";
            if (oldOrder == "asc") {
                oldOrder = "desc";
                icontmp = "chevron-up";
                this.orderDesc(this._itOrderBy.getValue());
            }
            else {
                oldOrder = "asc";
                icontmp = "chevron-down";
                this.orderAsc(this._itOrderBy.getValue());
            }
            ;
            this._itOrderBy.getInput().attr("data-orderfield", oldOrder);
            this._itOrderBy.setIcon(icontmp);
        };
        ListView.prototype.setOrder = function (evt) {
            this.orderAsc(this._itOrderBy.getValue());
        };
        ListView.prototype.orderDesc = function (p_campo) {
            this.dataProvider.sort(function () {
                return function (a, b) {
                    var objectIDA = a[p_campo];
                    var objectIDB = b[p_campo];
                    if (objectIDA === objectIDB) {
                        return 0;
                    }
                    return objectIDA > objectIDB ? 1 : -1;
                };
            }());
            this.refresh();
        };
        ListView.prototype.orderAsc = function (p_campo) {
            this.dataProvider.sort(function () {
                return function (a, b) {
                    var objectIDA = a[p_campo];
                    var objectIDB = b[p_campo];
                    if (objectIDA === objectIDB) {
                        return 0;
                    }
                    ;
                    return objectIDA > objectIDB ? 1 : -1;
                };
            }());
            this.refresh();
        };
        ListView.prototype.getSelectedIndex = function () {
            return this._ind;
        };
        ListView.prototype.getSelectedItem = function () {
            if (this.dataProvider.length < this._ind) {
                this._ind = 0;
            }
            ;
            return this.dataProvider[this._ind];
        };
        ListView.prototype.setSelectedItem = function (p_item) {
            this.dataProvider[this._ind] = p_item;
        };
        ListView.prototype.setSelectedIndex = function (p_index) {
            this._ind = p_index;
        };
        ListView.prototype.changeToIndex = function (p_index) {
            if (this.getDataProvider().length > p_index) {
                this.setSelectedIndex(p_index);
                this.getEle(".tilecellgrid .row_cells .selectedLine").removeClass("active");
                if (this.getSelectedItem()) {
                    this.getEle(".tilecellgrid .row_cells .tilecell:eq(" + p_index + ")").addClass("selectedLine active");
                }
                ;
                if (this.itemChange && this.getSelectedItem()) {
                    this.getModule().onChangeItem(this.getSelectedItem());
                    this.itemChange(this.getSelectedItem());
                }
                ;
            }
            else {
                if (this.getModule()) {
                    this.getModule().clearFormItem();
                }
                ;
                if (this.itemChange) {
                    this.itemChange();
                }
                ;
            }
            ;
        };
        ListView.prototype.updateItem = function (p_item) {
            this.setSelectedItem(p_item);
            var itemRender = new ListViewItemRender(p_item, this._itemTemplateHtml);
            itemRender.getEle().attr("data-ind", this.getSelectedIndex()).addClass("tilecell list-group-item");
            itemRender.getEle().addClass("selectedLine");
            this.getEle(".tilecellgrid .selectedLine").replaceWith(itemRender.getEle());
        };
        ListView.prototype.replaceItem = function (p_item, p_index) {
            var p_index_s = 0;
            if (!p_index) {
                p_index_s = this.getSelectedIndex();
            }
            else {
                p_index_s = p_index;
            }
            ;
            p_item["_ind"] = p_index_s;
            var itemRender = new ListViewItemRender(p_item, this._itemTemplateHtml);
            itemRender.getEle().attr("data-ind", p_index_s).addClass("tilecell list-group-item");
            itemRender.getEle().addClass("selectedLine");
            this.setSelectedItem(p_index);
            this.getEle(".tilecellgrid .selectedLine").replaceWith(itemRender.getEle());
        };
        ListView.prototype.insertItem = function (p_item, p_where) {
            if (p_where === void 0) { p_where = "top"; }
            var tmpOnWithTemplate = function () {
                if (!this.dataProvider) {
                    this.dataProvider = [];
                }
                ;
                var nind = this.dataProvider.length;
                p_item["_ind"] = nind;
                this.dataProvider.push(p_item);
                this._ind = nind;
                var itemRender = new ListViewItemRender(p_item, this._itemTemplateHtml);
                itemRender.getEle().attr("data-ind", nind).addClass("tilecell selectedLine list-group-item");
                var tcitens = 1;
                if (nind == 0) {
                    this.addRow(1);
                    this.getRow().css("display", "block");
                }
                else {
                    var maxCells = itemRender.getMaxCells();
                    var tmpCitens = maxCells + "";
                    if (this.getRow()) {
                        tmpCitens = this.getRow().attr("data-citens");
                    }
                    ;
                    var tcitens = parseInt(tmpCitens);
                    if (tcitens == maxCells) {
                        this.addRow(1);
                        this.getRow().css("display", "block");
                        tcitens = 0;
                    }
                    ;
                    tcitens++;
                }
                ;
                this.getRow().attr("data-citens", tcitens).append(itemRender.getEle());
                this.changeSelectedItem(itemRender.getEle());
            }.bind(this);
            if (!this._itemTemplateHtml) {
                this._getTmpUrl(tmpOnWithTemplate);
            }
            else {
                tmpOnWithTemplate();
            }
            ;
            tmpOnWithTemplate = null;
        };
        ListView.prototype.removeSelectedItem = function () {
            var indexEmbed = this.getSelectedIndex();
            if (indexEmbed > -1) {
                this.dataProvider.splice(indexEmbed, 1);
            }
            ;
            this.getEle(".tilecellgrid .selectedLine").remove();
        };
        ListView.prototype.removeItem = function (p_item) {
            this.removeSelectedItem();
        };
        ListView.prototype.changePg = function (evt) {
            evt.preventDefault();
            var tgt = $(evt.target);
            $('#pagination_' + this._uid + ' li a.active').removeClass("active").addClass("disabled");
            tgt.addClass("active");
            this.getEle(".tilecellgrid .row_cells").css("display", "none");
            this.getEle('.tilecellgrid .pg_u' + tgt.attr("data-pg")).css("display", "block").find(".tilecell").css("display", "block");
            return false;
        };
        ListView.prototype.onChangeSelectedItem = function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
            var tgt = $(evt.target);
            if (tgt.hasClass("tilecell")) {
                this.changeSelectedItem(tgt);
            }
            else {
                this.changeSelectedItem(tgt.closest(".tilecell"));
            }
            ;
        };
        ListView.prototype.changeSelectedItem = function (tgt) {
            this.getEle(".tilecellgrid .row_cells .selectedLine").removeClass("selectedLine active");
            tgt.addClass("selectedLine active");
            this._ind = parseInt(tgt.attr("data-ind"));
            if (this.itemChange && this.getSelectedItem()) {
                this.itemChange(this.getSelectedItem());
            }
            ;
            if (this.getSelectedItem()) {
                this.getModule().onChangeItem(this.getSelectedItem());
            }
            ;
        };
        return ListView;
    })(core_1.Component);
    exports.ListView = ListView;
    var DefaultNotifyItemRender = (function (_super) {
        __extends(DefaultNotifyItemRender, _super);
        function DefaultNotifyItemRender(p_obj) {
            _super.call(this, 'div', '<a href="#" data-varmod="' + p_obj.varmod + '" data-titlemod="' + p_obj.titlemod + '" data-iconmod="' + p_obj.iconmod + '"><strong>' + p_obj.title + '</strong></a><span class="badge pull-right alert-' + p_obj.type + '">' + p_obj.count + '</span><br><span class="text-' + p_obj.type + '">' + p_obj.subtitle + '</span>');
            if (!p_obj.actmod) {
                this.getEle("a").attr("data-actmod", p_obj.actmod);
            }
            ;
            this.getEle().addClass("divnotificao");
        }
        return DefaultNotifyItemRender;
    })(core_1.Component);
    exports.DefaultNotifyItemRender = DefaultNotifyItemRender;
    var Notify = (function () {
        function Notify(p_item) {
            this._item = null;
            this._itemRender = "DefaultNotifyItemRender";
            this._item = p_item;
        }
        Notify.prototype.getItemRender = function () {
            return this._itemRender;
        };
        Notify.prototype.setItemRender = function (p_item_render) {
            this._itemRender = p_item_render;
        };
        Notify.prototype.setItem = function (p_item) {
            this._item = p_item;
        };
        Notify.prototype.getItem = function () {
            return this._item;
        };
        Notify.TP_SUCCESS = "success";
        Notify.TP_INFO = "info";
        Notify.TP_PRIMARY = "primary";
        Notify.TP_WARNING = "warning";
        Notify.TP_ERROR = "danger";
        return Notify;
    })();
    exports.Notify = Notify;
    var NotifyPool = (function (_super) {
        __extends(NotifyPool, _super);
        function NotifyPool(p_title) {
            _super.call(this, 'div', '<span class="glyphicon glyphicon-bell badge alert-success pull-right"><span class="notifycount">' + 0 + '</span></span>');
            this._vlcount = 0;
            this.getEle(".glyphicon").append('<div style="z-index:9999;top:20px; left:-210px; display: none;" id="popover_' + this._uid + '" class="popover bottom in" role="tooltip"><div style="left: 90%;" class="arrow"></div><h3 class="popover-title">' + p_title + '</h3><div class="popover-content"></div></div>');
            this.getEle().addClass("column NotifyPool col-xs-2 col-sm-1 pull-right").css({ "z-index": "9999" });
            this.getEle("span.glyphicon").on("click", this.showNotifications.bind(this));
            this.getEle("div.popover-content").on('click', '.divnotificao a', this.executeActionNotify);
        }
        NotifyPool.prototype.executeActionNotify = function (evt) {
            var _linkM = $(this);
            var nextload = false;
            var moduleToLoad = _linkM.attr("data-varmod").toLowerCase();
            if (!_linkM.hasClass("loading_module")) {
                _linkM.addClass("loading_module");
                nextload = true;
            }
            else if (window[moduleToLoad]) {
                nextload = true;
            }
            ;
            if (nextload) {
                var tmpPathModule = _linkM.attr("data-varmod");
                var varModuleToLoadTmpM = tmpPathModule.split(".");
                var varModuleToLoadTmp = varModuleToLoadTmpM[varModuleToLoadTmpM.length - 1];
                var varModuleToLoadTmpCapt = varModuleToLoadTmp;
                requirejs(['container', 'app/' + tmpPathModule.replace(/\./g, "/")], function (_container, _modwindow) {
                    var tmp_modwindow = new _modwindow[varModuleToLoadTmpCapt]();
                    var mdw_tmp = new _container.ModView(_linkM.attr("data-titlemod"));
                    mdw_tmp.setIcon(_linkM.attr("data-iconmod"));
                    mdw_tmp.show(true);
                    mdw_tmp.append(tmp_modwindow);
                    if (_linkM.attr("data-actmod")) {
                        tmp_modwindow[_linkM.attr("data-actmod")]();
                    }
                });
            }
            ;
        };
        NotifyPool.prototype.showNotifications = function (evt) {
            var pop_tmp = $("#popover_" + this._uid);
            var display_tmp = pop_tmp.css("display");
            var _display_tmp = display_tmp;
            if (display_tmp == "block") {
                display_tmp = "none";
            }
            ;
            if (this._vlcount > 0 && _display_tmp != "block") {
                display_tmp = "block";
            }
            ;
            pop_tmp.css({ "display": display_tmp });
        };
        NotifyPool.prototype.addNotify = function (p_notify) {
            if (p_notify.getItem()) {
                this._vlcount++;
                this.setValue(this._vlcount);
                var itemTmp = new DefaultNotifyItemRender(p_notify.getItem());
                $("#popover_" + this._uid + " div.popover-content").append(itemTmp.getEle());
            }
        };
        NotifyPool.prototype.setValue = function (p_vl) {
            this._vlcount = p_vl;
            this.getEle(".notifycount").text(p_vl + "");
        };
        NotifyPool.prototype.getValue = function () {
            return this._vlcount;
        };
        NotifyPool.prototype.setType = function (ptype) {
            var classes = this.getEle(".glyphicon").attr("class");
            var ns = classes.replace(/alert\-([^\s]*)/, "alert-" + ptype);
            this.getEle(".glyphicon").attr('class', ns);
        };
        NotifyPool.prototype.setIcon = function (p_icon) {
            var classes = this.getEle(".glyphicon").attr("class");
            var ns = classes.replace(/glyphicon\-([^\s]*)/, "glyphicon-" + p_icon);
            this.getEle(".glyphicon").attr('class', ns);
        };
        NotifyPool.TP_SUCCESS = "success";
        NotifyPool.TP_INFO = "info";
        NotifyPool.TP_PRIMARY = "primary";
        NotifyPool.TP_WARNING = "warning";
        NotifyPool.TP_ERROR = "danger";
        NotifyPool.TP_DEFAULT = "default";
        return NotifyPool;
    })(core_1.Component);
    exports.NotifyPool = NotifyPool;
    var NumericStepper = (function (_super) {
        __extends(NumericStepper, _super);
        function NumericStepper(p_text) {
            if (p_text === void 0) { p_text = 0; }
            _super.call(this, p_text + "");
            this.maxvl = 9999;
            this.minvl = 0;
            this.stepvl = 1;
            this.setIcon("circle-arrow-up", 1);
            this.setIcon("circle-arrow-down", 2);
            this.getEle().addClass("NumericStepper");
            this.getEle(".addon2").on("click", this.diminuir.bind(this));
            this.getEle(".addon1").on("click", this.aumentar.bind(this));
            this.setEnable(true, 1);
            this.setEnable(true, 2);
            this.setEnable(true, 3);
        }
        NumericStepper.prototype.getVL = function () {
            return parseInt(this.getValue());
        };
        NumericStepper.prototype.setVL = function (vl) {
            var tmpVl = 0;
            if (vl) {
                tmpVl = vl;
            }
            ;
            this.setValue(tmpVl + "");
            if (tmpVl > this.minvl) {
                this.setEnable(true, 3);
            }
            else {
                this.setEnable(false, 3);
            }
            ;
            if (tmpVl < this.maxvl) {
                this.setEnable(true, 1);
            }
            else {
                this.setEnable(false, 1);
            }
            ;
        };
        NumericStepper.prototype.aumentar = function () {
            if (this.isEnable(1)) {
                if (this.getValue() == "") {
                    this.setVL(this.minvl);
                }
                else if ((this.getVL() + this.stepvl) <= this.maxvl) {
                    this.setVL(this.getVL() + this.stepvl);
                }
                ;
            }
            ;
        };
        NumericStepper.prototype.diminuir = function () {
            if (this.isEnable(3)) {
                if (this.getValue() == "") {
                    this.setVL(this.minvl);
                }
                else if ((this.getVL() - this.stepvl) >= this.minvl) {
                    this.setVL(this.getVL() - this.stepvl);
                }
                ;
            }
            ;
        };
        NumericStepper.prototype.setMin = function (vl) {
            this.minvl = vl;
        };
        NumericStepper.prototype.setMax = function (vl) {
            this.maxvl = vl;
        };
        NumericStepper.prototype.setStep = function (vl) {
            this.stepvl = vl;
        };
        return NumericStepper;
    })(InputTextDouble);
    exports.NumericStepper = NumericStepper;
    var ProgressBar = (function (_super) {
        __extends(ProgressBar, _super);
        function ProgressBar(p_vl) {
            if (p_vl === void 0) { p_vl = 0; }
            _super.call(this, 'div', '<div class="progress progress-striped active" style="height:20px;margin-bottom:4px"><div class="barra progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: ' + p_vl + '%"><span class="sr-only">0% Completo</span></div></div>');
            this._vl = 0;
            this._vl = p_vl;
            this.getEle().addClass("ProgressBar col-xs-12 col-sm-12 form-group");
        }
        ProgressBar.prototype.setProgress = function (p_vl) {
            this._vl = p_vl;
            this.getEle("div.barra").css("width", (p_vl) + "%");
            this.getEle("div.barra").attr("aria-valuenow", p_vl);
        };
        ProgressBar.prototype.setValue = function (p_vl) {
            this.setProgress(p_vl);
        };
        ProgressBar.prototype.getValue = function () {
            return this._vl;
        };
        ProgressBar.prototype.setBarColor = function (bgc) {
            this.getEle("div.barra").css("background-color", bgc);
        };
        ProgressBar.prototype.setToolTip = function (tooltip) {
            this.getEle().attr("alt", tooltip);
        };
        ProgressBar.prototype.setLabel = function (nlabel) {
            this.setToolTip(nlabel);
        };
        return ProgressBar;
    })(core_1.Component);
    exports.ProgressBar = ProgressBar;
    var TextArea = (function (_super) {
        __extends(TextArea, _super);
        function TextArea(p_text) {
            if (p_text === void 0) { p_text = ""; }
            _super.call(this, 'div', '');
            this.getEle()
                .addClass("form-group col-xs-12 col-sm-12")
                .append('<label class="control-label" for="inputIcon_' + this._uid + '">' + p_text + '</label>' +
                '<div class="col-xs-12 input-group">' +
                '<textarea class="form-control inputtt cposi_1 cposis" id="inputIcon_' + this._uid + '">' + p_text + '</textarea>' +
                '</div>');
        }
        TextArea.prototype.getValue = function () {
            var palavra = this.getInput().val() + "";
            palavra = palavra.replace(/,|\./gm, " ");
            return palavra.replace(/(\r\n|\n|\r)/gm, " ").trim();
        };
        return TextArea;
    })(Controller);
    exports.TextArea = TextArea;
    var AlertMsg = (function (_super) {
        __extends(AlertMsg, _super);
        function AlertMsg(p_text) {
            if (p_text === void 0) { p_text = ""; }
            _super.call(this, 'div', '<div class="inputtt col-xs-12 col-md-12 form-group alert alert-success fade in" data-alert="alert">' + p_text + '</div>');
            this.getEle().addClass("AlertMsg col-xs-12 col-md-12");
        }
        AlertMsg.prototype.setText = function (p_text) {
            this.getEle(".inputtt").text(p_text);
        };
        AlertMsg.prototype.getText = function () {
            return this.getEle(".inputtt").text();
        };
        AlertMsg.prototype.setValue = function (p_text) {
            this.setText(p_text);
        };
        AlertMsg.prototype.getValue = function () {
            return this.getText();
        };
        AlertMsg.prototype.isPrimaryKey = function () {
            return false;
        };
        AlertMsg.prototype.isValid = function () {
            return true;
        };
        AlertMsg.prototype.setType = function (p_type) {
            var classes = this.getEle(".inputtt").attr("class");
            var ns = classes.replace(/alert\-([^\s]*)/, "alert-" + p_type);
            this.getEle(".inputtt").removeClass().addClass(ns);
        };
        AlertMsg.TP_SUCCESS = "success";
        AlertMsg.TP_INFO = "info";
        AlertMsg.TP_WARNING = "warning";
        AlertMsg.TP_ERROR = "danger";
        return AlertMsg;
    })(Controller);
    exports.AlertMsg = AlertMsg;
    function ItemView(p_url_source, p_mainlist_name) {
        if (p_mainlist_name === void 0) { p_mainlist_name = ""; }
        return function (target) {
            var tmpClass = target.prototype;
            if (!tmpClass._configModWindow) {
                tmpClass._configModWindow = {
                    _urlmodule: "",
                    _revision: "",
                    _dmap: [],
                    _dmaplenth: 0,
                    _subtitle: "",
                    _configListsViews: []
                };
            }
            ;
            if (!tmpClass._configModWindow._configListsViews) {
                tmpClass._configModWindow._configListsViews = [];
            }
            ;
            tmpClass._configModWindow._modName = target.name;
            tmpClass._configModWindow._configListsViews.push({ list: p_mainlist_name, url: p_url_source });
        };
    }
    exports.ItemView = ItemView;
    $(function () {
        $("#logo_menu").on('click', function (event) {
            event.preventDefault();
            $("#sidebar li.navitem_simple").removeClass("navitem_simple");
            $("#sidebar").parent("div.menu_main").find(".tab_content_menu ul").css("display", "none");
        });
        $("#sidebar").on('click', 'li', function (event) {
            event.preventDefault();
            var _this = $(this);
            $("#sidebar li.navitem_simple").removeClass("navitem_simple");
            _this.addClass("navitem_simple");
            $("#sidebar").parent("div.menu_main").find(".tab_content_menu ul").css("display", "none");
            $("#" + _this.attr("id") + "_l").css("display", "block");
        });
        $("#navbarlist").on('click', 'a', function (event) {
            event.preventDefault();
            var tmp_uid = $(this).attr("data-modviewuid");
            $("#conteudo .ModView").css("display", "none");
            $("#navbarlist li.active").removeClass("active");
            $("#aba_s_" + tmp_uid).addClass("active").css("display", "block");
            $("#uid_" + tmp_uid).show();
        });
        $("#navbarlist").on('click', 'a span.x_rmv', function (event) {
            event.preventDefault();
            var uidToRemove = $(this).attr("data-modviewuid");
            $("#uid_" + uidToRemove).remove();
            $("#aba_s_" + uidToRemove).remove();
            $("#navbarlist li:first a").click();
        });
        $(".tab_content_menu").on('click', 'li.elegibleToClick', function (event) {
            event.preventDefault();
            var _linkM = $(this);
            var nextload = false;
            var moduleToLoad = _linkM.attr("data-varmod");
            var varModuleToLoadTmpM = moduleToLoad.split(".");
            var varModuleToLoadTmp = varModuleToLoadTmpM[varModuleToLoadTmpM.length - 1];
            var varModuleToLoadTmpCapt = varModuleToLoadTmp;
            varModuleToLoadTmp = varModuleToLoadTmp.toLowerCase();
            if (!_linkM.hasClass("loading_module")) {
                _linkM.addClass("loading_module");
                nextload = true;
            }
            ;
            if (nextload) {
                var urlModuleLoad = _linkM.attr("data-varmod");
                requirejs(['container', urlModuleLoad.replace(/\./g, "/")], function (_container, _modwindow) {
                    var tmp_modwindow = new _modwindow[varModuleToLoadTmpCapt]();
                    var mdw_tmp = new _container.ModView(_linkM.attr("data-titlemod"));
                    mdw_tmp.setIcon(_linkM.attr("data-iconmod"));
                    mdw_tmp.show(true);
                    mdw_tmp.append(tmp_modwindow);
                    if (_linkM.attr("data-actmod")) {
                        tmp_modwindow[_linkM.attr("data-actmod")]();
                    }
                    ;
                    _linkM.removeClass("loading_module");
                });
            }
            ;
            $("#sidebar li.navitem_simple").removeClass("navitem_simple");
            $("#sidebar").parent("div.menu_main").find(".tab_content_menu ul").css("display", "none");
        });
    });
    ;
});
