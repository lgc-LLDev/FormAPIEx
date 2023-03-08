/// <reference path="../../../LLSEAids/dts/llaids/src/index.d.ts" />
export declare const NAME = "FormAPIEx";
export declare const VERSION: readonly [0, 2, 2];
export declare const AUTHOR = "student_2333 <lgc2333@126.com>";
export declare const LICENSE = "Apache-2.0";
export declare function sendModalFormAsync(player: Player, title: string, content: string, confirmButton?: string, cancelButton?: string): Promise<boolean | null | undefined>;
export declare function sendFormAsync(player: Player, form: SimpleForm): Promise<number | null | undefined>;
export declare function sendFormAsync(player: Player, form: CustomForm): Promise<(string | boolean | number)[] | null | undefined>;
export interface CustomFormLabelObject {
    type: 'label';
    text: string;
}
export interface CustomFormInputObject {
    type: 'input';
    title: string;
    placeholder?: string;
    defaultVal?: string;
}
export interface CustomFormSwitchObject {
    type: 'switch';
    title: string;
    defaultVal?: boolean;
}
export interface CustomFormDropdownObject {
    type: 'dropdown';
    title: string;
    items: string[];
    defaultVal?: number;
}
export interface CustomFormSliderObject {
    type: 'slider';
    title: string;
    min: number;
    max: number;
    step?: number;
    defaultVal?: number;
}
export interface CustomFormStepSliderObject {
    type: 'stepSlider';
    title: string;
    items: string[];
    defaultVal?: number;
}
export type CustomFormObject = CustomFormLabelObject | CustomFormInputObject | CustomFormSwitchObject | CustomFormDropdownObject | CustomFormSliderObject | CustomFormStepSliderObject;
export declare function buildCustomForm(formTitle: string, objects: CustomFormObject[]): CustomForm;
export type CustomFormObjectReturnType<T extends CustomFormObject> = T extends CustomFormInputObject ? string : T extends CustomFormSwitchObject ? boolean : T extends CustomFormDropdownObject | CustomFormSliderObject | CustomFormStepSliderObject ? number : undefined;
export type CustomFormReturn<T extends {
    [id: string]: CustomFormObject;
}> = {
    [k in keyof T]: CustomFormObjectReturnType<T[k]>;
};
export declare class CustomFormEx<T extends {
    [id: string]: CustomFormObject;
} = {}> {
    #private;
    title: string;
    constructor(title?: string);
    get objects(): [string | undefined, CustomFormObject][];
    setTitle(val: string): this;
    push<TObj extends CustomFormObject, TId extends TObj extends CustomFormLabelObject ? string | undefined : string>(id: TId, obj: TObj): CustomFormEx<T & (TId extends string ? {
        [k in TId]: TObj;
    } : {})>;
    unshift<TObj extends CustomFormObject, TId extends TObj extends CustomFormLabelObject ? string | undefined : string>(id: TId, obj: TObj): CustomFormEx<T & (TId extends string ? {
        [k in TId]: TObj;
    } : {})>;
    insert<TObj extends CustomFormObject, TId extends TObj extends CustomFormLabelObject ? string | undefined : string>(index: number, id: TId, obj: TObj): CustomFormEx<T & (TId extends string ? {
        [k in TId]: TObj;
    } : {})>;
    remove<TId extends keyof T>(id: TId): CustomFormEx<Omit<T, TId>>;
    get<TId extends keyof T>(id: TId): T[TId] | null;
    addLabel(text: string): CustomFormEx<T>;
    addLabel<TId extends string>(id: TId, text: string): CustomFormEx<T & {
        [k in TId]: CustomFormLabelObject;
    }>;
    addInput<TId extends string>(id: TId, title: string, options?: {
        placeholder?: string;
        default?: string;
    }): CustomFormEx<T & {
        [k in TId]: CustomFormInputObject;
    }>;
    addSwitch<TId extends string>(id: TId, title: string, defaultVal?: boolean): CustomFormEx<T & {
        [k in TId]: CustomFormSwitchObject;
    }>;
    addDropdown<TId extends string>(id: TId, title: string, items: string[], defaultVal?: number): CustomFormEx<T & {
        [k in TId]: CustomFormDropdownObject;
    }>;
    addSlider<TId extends string>(id: TId, title: string, min: number, max: number, options?: {
        step?: number;
        default?: number;
    }): CustomFormEx<T & {
        [k in TId]: CustomFormSliderObject;
    }>;
    addStepSlider<TId extends string>(id: TId, title: string, items: string[], defaultVal?: number): CustomFormEx<T & {
        [k in TId]: CustomFormStepSliderObject;
    }>;
    private parseReturn;
    sendAsync(player: Player): Promise<CustomFormReturn<T> | null>;
}
export declare class SimpleFormAsync {
    title: string;
    content: string;
    /** [ text, image ] */
    buttons: [string, string?][];
    constructor(options?: {
        title?: string;
        content?: string;
        buttons?: [string, string?][];
    });
    setTitle(val: string): this;
    setContent(val: string): this;
    addButton(text: string, image?: string): this;
    sendAsync(player: Player): Promise<number | null | undefined>;
}
export declare class SimpleFormEx<T> {
    title: string;
    /**
     * {{currentPage}} - 当前页数
     * {{maxPage}} - 最大页数
     * {{count}} - 条目总数
     */
    content: string;
    buttons: T[];
    /** @returns [ text, image ] */
    formatter: (v: T, index: number, array: T[]) => [string, string?];
    canTurnPage: boolean;
    canJumpPage: boolean;
    maxPageNum: number;
    hasSearchButton: boolean;
    searcher: (buttons: T[], param: string) => T[];
    constructor(buttons?: T[]);
    formatButtons(buttons?: T[]): [string, string?][];
    getMaxPageNum(): number;
    getPage(page?: number): T[];
    /**
     * @returns null 为没搜到, false 为取消搜索
     */
    sendSearchForm(player: Player, defaultVal?: string): Promise<T | null | false>;
    sendAsync(player: Player, page?: number): Promise<T | null>;
}
