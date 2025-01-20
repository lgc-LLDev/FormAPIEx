export const NAME = "FormAPIEx";
export const VERSION: [number, number, number];
export const AUTHOR = "LgCookie <lgc2333@126.com>";
export const LICENSE = "Apache-2.0";
export const FormClose: unique symbol;
export type FormClose = typeof FormClose;
export function formatError(e: unknown): string;
export function wrapAsyncFunc<T extends unknown[]>(func: (...args: T) => Promise<unknown>): (...args: T) => void;
export function deepClone<T>(obj: T): T;
export function sendFormAsync(player: Player, form: SimpleForm): Promise<number | FormClose>;
export function sendFormAsync(player: Player, form: CustomForm): Promise<(string | boolean | number)[] | FormClose>;
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
export function buildCustomForm(formTitle: string, objects: CustomFormObject[]): CustomForm;
export type CustomFormObjectReturnType<T extends CustomFormObject> = T extends CustomFormInputObject ? string : T extends CustomFormSwitchObject ? boolean : T extends CustomFormDropdownObject | CustomFormSliderObject | CustomFormStepSliderObject ? number : undefined;
export type CustomFormReturn<T extends {
    [id: string]: CustomFormObject;
}> = {
    [k in keyof T]: CustomFormObjectReturnType<T[k]>;
};
export interface CustomFormInputOptions {
    placeholder?: string;
    default?: string;
}
export interface CustomFormSliderOptions {
    step?: number;
    default?: number;
}
export class CustomFormEx<T extends {
    [id: string]: CustomFormObject;
} = {}> {
    #private;
    title: string;
    constructor(title?: string);
    get objects(): [string | undefined, CustomFormObject][];
    get length(): number;
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
    get<TIndex extends number>(index: TIndex): this['objects'][TIndex];
    get<TId extends keyof T>(id: TId): T[TId] | null;
    addLabel(text: string): CustomFormEx<T>;
    addLabel<TId extends string>(id: TId, text: string): CustomFormEx<T & {
        [k in TId]: CustomFormLabelObject;
    }>;
    addInput<TId extends string>(id: TId, title: string, options?: CustomFormInputOptions): CustomFormEx<T & {
        [k in TId]: CustomFormInputObject;
    }>;
    addSwitch<TId extends string>(id: TId, title: string, defaultVal?: boolean): CustomFormEx<T & {
        [k in TId]: CustomFormSwitchObject;
    }>;
    addDropdown<TId extends string>(id: TId, title: string, items: string[], defaultVal?: number): CustomFormEx<T & {
        [k in TId]: CustomFormDropdownObject;
    }>;
    addSlider<TId extends string>(id: TId, title: string, min: number, max: number, options?: CustomFormSliderOptions): CustomFormEx<T & {
        [k in TId]: CustomFormSliderObject;
    }>;
    addStepSlider<TId extends string>(id: TId, title: string, items: string[], defaultVal?: number): CustomFormEx<T & {
        [k in TId]: CustomFormStepSliderObject;
    }>;
    private parseReturn;
    sendAsync(player: Player): Promise<CustomFormReturn<T> | FormClose>;
}
export function sendModalFormAsync(player: Player, title: string, content: string, confirmButton?: string, cancelButton?: string): Promise<boolean>;
export interface SimpleFormAsyncOptions {
    title?: string;
    content?: string;
    buttons?: [string, string?][];
}
export class SimpleFormAsync {
    title: string;
    content: string;
    buttons: [string, string?][];
    constructor(options?: SimpleFormAsyncOptions);
    setTitle(val: string): this;
    setContent(val: string): this;
    addButton(text: string, image?: string): this;
    sendAsync(player: Player): Promise<number | FormClose>;
}
export class SimpleFormEx<T> {
    title: string;
    content: string;
    buttons: T[];
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
    sendSearchForm(player: Player, defaultVal?: string): Promise<T | null | FormClose>;
    sendAsync(player: Player, page?: number): Promise<T | FormClose>;
}
export interface SimpleFormOperationalButton<R> {
    text: string;
    image?: string;
    operation: () => R;
}
export class SimpleFormOperational<R> {
    title: string;
    content: string;
    buttons: SimpleFormOperationalButton<R>[];
    constructor(title?: string, content?: string, buttons?: SimpleFormOperationalButton<R>[]);
    sendAsync(player: Player): Promise<R | FormClose>;
}
