import { Component } from "core";
import { Label, Button } from "controller";
import { ModWindow } from "container";
export interface ITaskConfig {
    s: string;
    t?: number;
    idRequest?: number;
}
export interface IRequestConf {
    module?: ModWindow;
    url: string;
    rootUrl?: string;
    format?: string;
    t?: number;
    idRequest?: number;
    data?: any;
    onLoad?: JQueryPromiseCallback<Function>;
    method?: string;
}
export interface IDefaultRequest {
    format: string;
    url: string;
    method: string;
    module?: ModWindow;
    rootUrl?: string;
    data?: any;
    onLoad?: JQueryPromiseCallback<Function>;
}
export declare class Task extends Component {
    s: string;
    t: number;
    idView: string;
    idRequest: number;
    lbMsg: Label;
    constructor(p_dts: ITaskConfig);
    setIdView(p_idView: string): void;
    getIdView(): string;
    finalizar(dtk2: any): void;
    reload(): void;
    cancel(): void;
    setErro(isErr: boolean): void;
    setMSG(strMSG: string): void;
    setTaskDesc(strMSG: string): void;
    getTaskDesc(): string;
    erroState(msge: string[]): void;
}
export declare class RequestManager {
    static type: string;
    static format: string;
    static url: string;
    static _rootUrl: string;
    static _displayLoad: boolean;
    static TP_JSON: string;
    static TP_JSONP: string;
    static _log_erro(args: {
        "s": string;
        "e": string[];
    }): void;
    static _log_success(args: {
        "s": string;
        "m": string;
    }): void;
    static addRequest(req: IRequestConf): void;
    static refresh(): void;
    static finalizar(): void;
    static notifyTaskErro(p_idView: string, erro: string): void;
    static showAllTasks(p_idWiew: string): void;
    static hideAllTasks(p_idWiew: string): void;
    static setFormat(p_format: string): void;
    static setUrl(p_url: string): void;
    static setRootUrl(p_rootUrl: string): void;
    static enableDisplayLoad(p_on: boolean): void;
    static removeAllTasks(p_idWinMod: string): void;
}
export declare class SimpleToolBar extends Component {
    constructor();
    addButton(nbuttom: Button): void;
}
export declare class ToolBar extends SimpleToolBar {
    _config: {
        "domain": string;
    };
    _istoolbar: boolean;
    _isactive: boolean;
    btAdd: Button;
    btDel: Button;
    btSave: Button;
    constructor(p_config: {
        "domain": string;
    });
    getDefaultRequest(p_act: string, p_method: string): IDefaultRequest;
    updateItem(p_objToUpdate: Object): void;
    insertItem(p_objToInsert: Object): void;
    deleteItem(event: Event): void;
    activate(p_on: boolean): void;
    reloadItens(event?: Event): void;
    syncItem(): Object;
    saveItem(event: Event): void;
}
