export declare class ValidationType {
    static EMAIL: RegExp;
    static TIME: RegExp;
    static DATE: RegExp;
    static ONLY_TEXT: RegExp;
    static ONLY_NUMBER: RegExp;
}
export interface IPaginationParam {
    pag: number;
    max: number;
    orderBy: string;
    order: string;
    filterBy: string;
    filterValue: string;
}
export declare class ArrayList {
    _indx: number;
    _matrix: any[];
    _size: number;
    constructor(p_array_obj: any[]);
    size(): number;
    get(p_indx: number): any;
    getAll(): any[];
    add(p_obj: any): void;
    set(p_obj: any, p_indx: number): void;
    remove(p_indx: number): void;
    removeAll(): void;
    addAll(p_array_obj: any[]): void;
    orderAsc(campo: string): void;
    orderDesc(campo: string): void;
    getIndexOf(p_criterio: Object): number;
}
