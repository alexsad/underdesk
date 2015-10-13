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
