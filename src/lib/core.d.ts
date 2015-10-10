import { ModWindow } from "container";
export interface IConfMod {
    mod: string;
    act?: string;
    puid?: string;
    p?: any[];
    icon?: string;
    title?: string;
    url?: string;
    extmod?: string;
    obj?: string;
    embed?: string;
    onLoad?: Function;
}
export declare class Underas {
    static _uid: number;
    static _cache: boolean;
    static _version: string;
    static getUid(): number;
    static getLastUid(): number;
    static getNextUid(): number;
    static cache(p_on: boolean): void;
    static setProjectVersion(p_version: string): void;
    static getUrlParam(p_name: string): string;
    static getLocation(): string;
    static printDataProvider(p_dta: any[], p_url_template: string): void;
    static getInstanceOf<T>(context: Object, name: string, args: any[]): T;
    static templateCompile(template: string, data: Object): string;
}
export declare class Component {
    _uid: number;
    _html: JQuery;
    _modwindow: ModWindow;
    constructor(tagh: string, tagc: string);
    getEle(p_sel?: string): JQuery;
    append(p_childtoappend: Component): void;
    setSize(nsize: number): void;
    addEvent(p_on: string, p_event_fn: Function, p_bind?: any): JQuery;
    show(pshow: boolean): void;
    getModule(): ModWindow;
}
