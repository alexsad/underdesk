import { IPaginationParam } from "util";
import { Component } from "core";
import { IConfigModWindow, ModWindow } from "container";
import { IRequestConf } from "net";
export declare class Controller {
    _uid: number;
    _html: JQuery;
    _modwindow: ModWindow;
    constructor(tagh: string, tagc: string);
    getEle(p_sel?: string): JQuery;
    setBlankWhenNull(on: boolean): void;
    addEvent(p_on: string, p_event_fn: Function, p_bind?: any): JQuery;
    getInput(): JQuery;
    setLabel(nlabel: string): void;
    setValue(vl: string): void;
    setTransient(on: boolean): void;
    isTransient(): boolean;
    isBlankWhenNull(): boolean;
    setFixed(on: boolean): void;
    isFixed(): boolean;
    getValue(): string;
    setEnable(on: boolean, p_posi?: number): void;
    isEnable(p_posi?: number): boolean;
    setSize(nsize: number): void;
    setMaxLength(p_lgt: number): void;
    setMinLength(p_lgt: number, p_msgerro: string): void;
    setValidation(p_mask: RegExp, p_msgerro: string): void;
    setPlaceHolder(p_placeholder: string): void;
    show(pshow: boolean): void;
    isPrimaryKey(): boolean;
    isValid(): boolean;
    setValid(p_on: boolean): void;
    setColumn(p_column: string): void;
    getColumn(): string;
    getModule(): ModWindow;
}
export declare class ListViewItemRender extends Component {
    _maxCells: number;
    _maxRows: number;
    constructor(p_obj: Object, p_html: string);
    getMaxCells(): number;
    getMaxRows(): number;
    setMaxCells(p_maxcells: number): void;
    setMaxRows(p_maxrows: number): void;
}
export interface IListView {
    getSelectedItem(): Object;
    updateItem(p_item: Object): void;
    getPaginationParam(): IPaginationParam;
    setDataProvider(p_data: any[]): void;
    getDataProvider(): any[];
    changeToIndex(p_index: number): void;
    itemChange?: Function;
    pageRequest?: Function;
}
export declare class Img extends Component {
    constructor(p_sourceimgp?: string);
    setSource(p_source: string): void;
}
export declare class Text extends Controller {
    constructor(p_text: string);
    setText(p_text: string): void;
}
export declare class Input extends Controller {
    constructor(tipo: string, valor: string);
    setIcon(p_src: string): void;
    setAddonText(p_txt: string): void;
}
export declare class InputDouble extends Controller {
    constructor(tipo: string, valor: string);
    setIcon(psrc: string, posi?: number): void;
    setAddonText(ptxt: string, posi?: number): void;
}
export declare class InputText extends Input {
    constructor(p_text?: string);
}
export declare class InputTextDouble extends InputDouble {
    constructor(p_text?: string);
}
export declare class CheckBox extends Controller {
    checkedValue: string;
    unCheckedValue: string;
    constructor(p_label: string, p_innerLabel: string);
    setCheckedValue(p_vl: string): void;
    setUnCheckedValue(p_vl: string): void;
    isValid(): boolean;
    setValue(p_vl: string): void;
    getValue(): string;
}
export declare enum DatePartType {
    day = 0,
    month = 1,
    year = 2,
}
export declare class DatePicker extends InputText {
    dtaA: Date;
    constructor();
    getValue(): string;
    setValue(p_value: string): void;
    getDate(): Date;
    getDateString(): string;
    addDate(typeD: DatePartType, pluss: number): void;
    setDate(typeD: DatePartType, vl: number): void;
    refresh(): void;
    isValid(): boolean;
}
export declare class InputPassWord extends Input {
    constructor(p_text?: string);
}
export declare class InputPercent extends InputText {
    constructor(p_text?: string);
}
export declare class InputMoney extends InputText {
    constructor(p_text?: string);
}
export declare class InputTime extends InputText {
    constructor(p_text?: string);
}
export declare class InputEmail extends InputText {
    constructor(p_text?: string);
    isValid(): boolean;
}
export declare class InputPhone extends InputText {
    constructor(p_text?: string);
}
export declare class Label extends Controller {
    constructor(p_text?: string);
    setText(p_text: string): void;
}
export declare class Button extends Controller {
    constructor(p_label: string);
    setIcon(psrc: string): void;
    setLabel(p_label: string): void;
    setEnable(on: boolean): void;
    isEnable(): boolean;
}
export declare class LinkButton extends Controller {
    constructor(p_label: string);
    setIcon(psrc: string): void;
    setLabel(p_label: string): void;
    setEnable(on: boolean): void;
    isEnable(): boolean;
}
export interface IMenuTabConfig {
    domain: string;
    target: string;
}
export interface IMenuTab {
    label: string;
    icone: string;
    children: any[];
}
export interface IItemMenuTab {
    label: string;
    icone: string;
    tela: string;
    funcao: string;
}
export declare class MenuTab extends Component {
    _config: IMenuTabConfig;
    constructor(p_config: IMenuTabConfig);
    addTab(label: string, boxM: JQuery, iconeM: string, tmItens: number, tabid: number): void;
    setIcon(p_src: string): void;
    appendTo(p_idFather: string): void;
    setDataProvider(p_dta: any[]): void;
    criarTabNova(label: string, picone: string, childrens: IItemMenuTab[], tabid: number): void;
}
export declare class Select extends InputDouble {
    _valuefield: string;
    _labelfield: string;
    constructor(p_placeholder?: string);
    onNotFound(evt: Event): void;
    reSizeList(evt: Event): void;
    showList(p_on: boolean): JQuery;
    getFromUpList(evt: Event): void;
    setFilter(evt: JQueryEventObject): void;
    setValueField(p_column: string): void;
    setLabelField(p_column: string): void;
    getValueField(): string;
    getLabelField(): string;
    setDataProvider(p_dta: any[]): void;
    getValue(): string;
    getText(): string;
    isValid(): boolean;
    setValue(p_vl: string): void;
    getDescFromServiceByValue(p_vl: string): string;
    reloadService(): void;
    fromService(p_req_service: IRequestConf): void;
}
export declare class ListView extends Component implements IListView {
    dataProvider: any[];
    _urlTemplate: string;
    _itemTemplateHtml: string;
    _ind: number;
    _itFilter: InputText;
    _itOrderBy: Select;
    itemChange: Function;
    _islistview: boolean;
    _rowhtml: string;
    constructor(p_title: string);
    getPaginationParam(): IPaginationParam;
    setDataProvider(p_dta: any[]): ListView;
    getDataProvider(): any[];
    setHeight(p_height: number): void;
    setRow(p_html: string): void;
    addRow(p_pg: number, p_html?: string): void;
    setHeadGrid(p_html: string): void;
    getRow(p_index?: number): JQuery;
    clear(): void;
    refresh(): ListView;
    _getTmpUrl(fnAfter: Function): void;
    setFilter(evt: JQueryEventObject): void;
    setOrderField(evt: Event): void;
    setOrder(evt: Event): void;
    orderDesc(p_campo: string): void;
    orderAsc(p_campo: string): void;
    getSelectedIndex(): number;
    getSelectedItem(): Object;
    setSelectedItem(p_item: Object): void;
    setSelectedIndex(p_index: number): void;
    changeToIndex(p_index: number): void;
    updateItem(p_item: Object): void;
    insertItem(p_item: Object, p_where?: string): void;
    removeSelectedItem(): void;
    removeItem(p_item: Object): void;
    changePg(evt: Event): boolean;
    onChangeSelectedItem(evt: Event): void;
    changeSelectedItem(tgt: JQuery): void;
}
export interface IItemNotify {
    title: string;
    subtitle: string;
    count: number;
    type: string;
    varmod: string;
    actmod?: string;
    titlemod: string;
    iconmod: string;
}
export declare class DefaultNotifyItemRender extends Component {
    constructor(p_obj: IItemNotify);
}
export declare class Notify {
    static TP_SUCCESS: string;
    static TP_INFO: string;
    static TP_PRIMARY: string;
    static TP_WARNING: string;
    static TP_ERROR: string;
    _item: IItemNotify;
    _itemRender: string;
    constructor(p_item: IItemNotify);
    getItemRender(): string;
    setItemRender(p_item_render: string): void;
    setItem(p_item: IItemNotify): void;
    getItem(): IItemNotify;
}
export declare class NotifyPool extends Component {
    static TP_SUCCESS: string;
    static TP_INFO: string;
    static TP_PRIMARY: string;
    static TP_WARNING: string;
    static TP_ERROR: string;
    static TP_DEFAULT: string;
    _vlcount: number;
    constructor(p_title: string);
    executeActionNotify(evt: Event): void;
    showNotifications(evt: Event): void;
    addNotify(p_notify: Notify): void;
    setValue(p_vl: number): void;
    getValue(): number;
    setType(ptype: string): void;
    setIcon(p_icon: string): void;
}
export declare class NumericStepper extends InputTextDouble {
    maxvl: number;
    minvl: number;
    stepvl: number;
    constructor(p_text?: number);
    getVL(): number;
    setVL(vl: number): void;
    aumentar(): void;
    diminuir(): void;
    setMin(vl: number): void;
    setMax(vl: number): void;
    setStep(vl: number): void;
}
export declare class ProgressBar extends Component {
    _vl: number;
    constructor(p_vl?: number);
    setProgress(p_vl: number): void;
    setValue(p_vl: number): void;
    getValue(): number;
    setBarColor(bgc: string): void;
    setToolTip(tooltip: string): void;
    setLabel(nlabel: string): void;
}
export declare class TextArea extends Controller {
    constructor(p_text?: string);
    getValue(): string;
}
export declare class AlertMsg extends Controller {
    static TP_SUCCESS: string;
    static TP_INFO: string;
    static TP_WARNING: string;
    static TP_ERROR: string;
    constructor(p_text?: string);
    setText(p_text: string): void;
    getText(): string;
    setValue(p_text: string): void;
    getValue(): string;
    isPrimaryKey(): boolean;
    isValid(): boolean;
    setType(p_type: string): void;
}
export interface IViewClass extends Function {
    prototype: {};
    _configModWindow: IConfigModWindow;
    name: string;
    new (): Function;
}
export declare function ItemView(p_url_source: string, p_mainlist_name?: string): ClassDecorator;
