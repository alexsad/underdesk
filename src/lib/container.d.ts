import { Component } from "core";
import { Controller, Button, IListView } from "controller";
import { IDefaultRequest } from "net";
export declare class AlertWindow extends Component {
    _title: string;
    constructor(p_title: string, p_msg: string);
    addButton(p_ele: Button): void;
    setTitle(p_title: string): void;
    setMsg(p_msg: string): void;
}
export interface IModWindowColumn {
    column: string;
    field: string;
}
export interface IConfigsLists {
    list: string;
    url: string;
}
export interface IConfigModWindow {
    _urlmodule: string;
    _revision: string;
    _subtitle: string;
    _dmap: IModWindowColumn[];
    _dmaplenth: number;
    _modview?: ModView;
    _maintoolbar?: string;
    _mainlist?: string;
    _embedItem?: string;
    _embedFather?: string;
    _modName?: string;
    _configListsViews?: IConfigsLists[];
}
export declare class ModWindow extends Component {
    _configModWindow: IConfigModWindow;
    constructor(p_subtitle: string, p_modpath: string);
    setTitle(p_title: string): void;
    getTitle(): string;
    _onStart(): void;
    onStart(): void;
    getFormItem(): Object;
    clearFormItem(): void;
    setRevision(p_txt_revision: string): void;
    getRevision(): string;
    getDsModule(): string;
    changeDsModule(): void;
    setUrlModule(p_url_m: string): void;
    getUrlModule(): string;
    getModView(): ModView;
    append(childtoappend: Component | Controller): void;
    setDsModule(): void;
    getColumns(): IModWindowColumn[];
    setIdField(p_field: string): void;
    getIdField(): string;
    getMainList(): IListView;
    setMainList(p_main_list: string): void;
    show(on: boolean): void;
    beforeSave(p_obj: Object): Object;
    beforeInsert(p_req_obj: IDefaultRequest): IDefaultRequest;
    beforeQuery(p_req: IDefaultRequest): IDefaultRequest;
    onChangeItem(p_obj: Object): Object;
    beforeDelete(p_req_delete: IDefaultRequest, p_old_obj: Object): IDefaultRequest;
    beforeUpdate(p_req_new_obj: IDefaultRequest, p_old_obj: Object): IDefaultRequest;
}
export declare class ModView extends Component {
    _title: string;
    _icone: string;
    _childrenMods: string[];
    _appended: boolean;
    constructor(p_title: string);
    append(p_ele: ModWindow): void;
    destroy(): void;
    setIcon(p_icon: string): void;
    showNav(on: boolean): ModView;
    show(on: boolean): ModView;
}
