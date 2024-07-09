export const NAME = "FormAPIEx";
export const VERSION: [number, number, number];
export const AUTHOR = "student_2333 <lgc2333@126.com>";
export const LICENSE = "Apache-2.0";
export const FormClose: unique symbol;
export type FormClose = typeof FormClose;
/**
 * 格式化错误堆栈
 * @param e 错误对象
 * @returns 格式化后的错误
 */
export function formatError(e: unknown): string;
/**
 * 在 sync function 中使用 setTimeout 调用 async function，解决 LLSE 回调调用 async 函数会出现的玄学 bug
 * @param func async function
 * @returns wrapped sync function
 */
export function wrapAsyncFunc<T extends unknown[]>(func: (...args: T) => Promise<unknown>): (...args: T) => void;
/**
 * 使用 json 序列化及反序列化深复制对象
 * @param obj 对象
 * @returns 复制后对象
 */
export function deepClone<T>(obj: T): T;
/**
 * 异步向玩家发送表单对象
 * @param player 玩家对象
 * @param form 表单对象
 * @returns 返回结果
 */
export function sendFormAsync(player: Player, form: SimpleForm): Promise<number | FormClose>;
export function sendFormAsync(player: Player, form: CustomForm): Promise<(string | boolean | number)[] | FormClose>;
export interface CustomFormLabelObject {
    type: 'label';
    /** 文本内容 */
    text: string;
}
export interface CustomFormInputObject {
    type: 'input';
    /** 输入框标题 */
    title: string;
    /** 输入框中显示的提示文本 */
    placeholder?: string;
    /** 输入框默认内容，默认为空 */
    defaultVal?: string;
}
export interface CustomFormSwitchObject {
    type: 'switch';
    /** 开关标题 */
    title: string;
    /** 开关默认状态，默认为 `false` */
    defaultVal?: boolean;
}
export interface CustomFormDropdownObject {
    type: 'dropdown';
    /** 下拉框标题 */
    title: string;
    /** 下拉框元素 */
    items: string[];
    /** 下拉框默认选择元素位置，默认为 `0` */
    defaultVal?: number;
}
export interface CustomFormSliderObject {
    type: 'slider';
    /** 滑块标题 */
    title: string;
    /** 滑块最小值 */
    min: number;
    /** 滑块最大值 */
    max: number;
    /** 滑块滑动一格加减的数值，默认为 `1` */
    step?: number;
    /** 滑块默认位置，默认为 `min` */
    defaultVal?: number;
}
export interface CustomFormStepSliderObject {
    type: 'stepSlider';
    /** 步进滑块标题 */
    title: string;
    /** 步进滑块元素列表 */
    items: string[];
    /** 滑块默认位置，默认为 `0` */
    defaultVal?: number;
}
export type CustomFormObject = CustomFormLabelObject | CustomFormInputObject | CustomFormSwitchObject | CustomFormDropdownObject | CustomFormSliderObject | CustomFormStepSliderObject;
/**
 * 使用 CustomFormObject 构建自定义表单对象
 * @param formTitle 表单标题
 * @param objects 表单元素
 * @returns 构建好的表单
 */
export function buildCustomForm(formTitle: string, objects: CustomFormObject[]): CustomForm;
export type CustomFormObjectReturnType<T extends CustomFormObject> = T extends CustomFormInputObject ? string : T extends CustomFormSwitchObject ? boolean : T extends CustomFormDropdownObject | CustomFormSliderObject | CustomFormStepSliderObject ? number : undefined;
export type CustomFormReturn<T extends {
    [id: string]: CustomFormObject;
}> = {
    [k in keyof T]: CustomFormObjectReturnType<T[k]>;
};
export interface CustomFormInputOptions {
    /** 输入框中显示的提示文本 */
    placeholder?: string;
    /** 输入框默认内容 */
    default?: string;
}
export interface CustomFormSliderOptions {
    /** 滑块滑动一格加减的数值，默认为 `1` */
    step?: number;
    /** 滑块默认位置，默认为 `min` */
    default?: number;
}
export class CustomFormEx<T extends {
    [id: string]: CustomFormObject;
} = {}> {
    #private;
    /** 表单标题 */
    title: string;
    /**
     * @param title 表单标题
     */
    constructor(title?: string);
    /**
     * 获取表单元素列表
     */
    get objects(): [string | undefined, CustomFormObject][];
    /**
     * 获取表单元素数量
     */
    get length(): number;
    /**
     * 设置表单标题
     * @param val 标题
     * @returns 自身，便于链式调用
     */
    setTitle(val: string): this;
    /**
     * 向表单尾部添加一个元素
     * @param id 元素 id
     * @param obj 元素
     * @returns 自身，便于链式调用
     */
    push<TObj extends CustomFormObject, TId extends TObj extends CustomFormLabelObject ? string | undefined : string>(id: TId, obj: TObj): CustomFormEx<T & (TId extends string ? {
        [k in TId]: TObj;
    } : {})>;
    /**
     * 向表单头部添加一个元素
     * @param id 元素 id
     * @param obj 元素
     * @returns 自身，便于链式调用
     */
    unshift<TObj extends CustomFormObject, TId extends TObj extends CustomFormLabelObject ? string | undefined : string>(id: TId, obj: TObj): CustomFormEx<T & (TId extends string ? {
        [k in TId]: TObj;
    } : {})>;
    /**
     * 向表单插入一个元素
     * @param index 插入位置
     * @param id 元素 id
     * @param obj 元素
     * @returns 自身，便于链式调用
     */
    insert<TObj extends CustomFormObject, TId extends TObj extends CustomFormLabelObject ? string | undefined : string>(index: number, id: TId, obj: TObj): CustomFormEx<T & (TId extends string ? {
        [k in TId]: TObj;
    } : {})>;
    /**
     * 删除表单元素
     * @param id 元素 id
     * @returns 自身，便于链式调用
     */
    remove<TId extends keyof T>(id: TId): CustomFormEx<Omit<T, TId>>;
    /**
     * 获取表单元素
     * @param index 元素下标
     * @returns 表单元素
     */
    get<TIndex extends number>(index: TIndex): this['objects'][TIndex];
    /**
     * 获取表单元素
     * @param id 表单元素 id
     * @returns 表单元素
     */
    get<TId extends keyof T>(id: TId): T[TId] | null;
    /**
     * 向表单尾部添加一个文本
     * @param text 文本内容
     * @returns 自身，便于链式调用
     */
    addLabel(text: string): CustomFormEx<T>;
    /**
     * 向表单尾部添加一个文本
     * @param id 元素 id
     * @param text 文本内容
     * @returns 自身，便于链式调用
     */
    addLabel<TId extends string>(id: TId, text: string): CustomFormEx<T & {
        [k in TId]: CustomFormLabelObject;
    }>;
    /**
     * 向表单添加一个输入框
     * @param id 元素 id
     * @param title 输入框标题
     * @param options 附加选项
     * @returns 自身，便于链式调用
     */
    addInput<TId extends string>(id: TId, title: string, options?: CustomFormInputOptions): CustomFormEx<T & {
        [k in TId]: CustomFormInputObject;
    }>;
    /**
     * 向表单添加一个开关
     * @param id 元素 id
     * @param title 开关标题
     * @param defaultVal 开关默认状态，默认为 `false`
     * @returns 自身，便于链式调用
     */
    addSwitch<TId extends string>(id: TId, title: string, defaultVal?: boolean): CustomFormEx<T & {
        [k in TId]: CustomFormSwitchObject;
    }>;
    /**
     * 向表单添加一个下拉框
     * @param id 元素 id
     * @param title 下拉框标题
     * @param items 下拉框元素
     * @param defaultVal 下拉框默认选择元素位置，默认为 `0`
     * @returns 自身，便于链式调用
     */
    addDropdown<TId extends string>(id: TId, title: string, items: string[], defaultVal?: number): CustomFormEx<T & {
        [k in TId]: CustomFormDropdownObject;
    }>;
    /**
     * 向表单添加一个滑块
     * @param id 元素 id
     * @param title 滑块标题
     * @param min 滑块最小值
     * @param max 滑块最大值
     * @param options 附加选项
     * @returns 自身，便于链式调用
     */
    addSlider<TId extends string>(id: TId, title: string, min: number, max: number, options?: CustomFormSliderOptions): CustomFormEx<T & {
        [k in TId]: CustomFormSliderObject;
    }>;
    /**
     * 向表单添加一个步进滑块
     * @param id 元素 id
     * @param title 步进滑块标题
     * @param items 步进滑块元素列表
     * @param defaultVal 滑块默认位置，默认为 `0`
     * @returns 自身，便于链式调用
     */
    addStepSlider<TId extends string>(id: TId, title: string, items: string[], defaultVal?: number): CustomFormEx<T & {
        [k in TId]: CustomFormStepSliderObject;
    }>;
    private parseReturn;
    /**
     * 异步向玩家发送该表单
     * @param player 玩家对象
     * @returns 返回结果，玩家关闭表单或发送失败返回 FormClose
     */
    sendAsync(player: Player): Promise<CustomFormReturn<T> | FormClose>;
}
/**
 * 异步向玩家发送模式表单
 * @param player 玩家对象
 * @param title 表单标题
 * @param content 表单内容
 * @param confirmButton 确认按钮标题
 * @param cancelButton 取消按钮标题
 * @returns 玩家选择的按钮
 */
export function sendModalFormAsync(player: Player, title: string, content: string, confirmButton?: string, cancelButton?: string): Promise<boolean>;
export interface SimpleFormAsyncOptions {
    /** 表单标题 */
    title?: string;
    /** 表单内容 */
    content?: string;
    /** 表单按钮 */
    buttons?: [string, string?][];
}
export class SimpleFormAsync {
    /** 表单标题 */
    title: string;
    /** 表单内容 */
    content: string;
    /** 表单按钮 `[ text, image ]` */
    buttons: [string, string?][];
    /**
     * @param options 附加选项
     */
    constructor(options?: SimpleFormAsyncOptions);
    /**
     * 设置表单标题
     * @param val 标题
     * @returns 自身，便于链式调用
     */
    setTitle(val: string): this;
    /**
     * 设置表单内容
     * @param val 内容
     * @returns 自身，便于链式调用
     */
    setContent(val: string): this;
    /**
     * 给表单添加一个按钮
     * @param text 按钮文本
     * @param image 按钮图片
     * @returns 自身，便于链式调用
     */
    addButton(text: string, image?: string): this;
    /**
     * 异步向玩家发送该表单
     * @param player 玩家对象
     * @returns 玩家选择的按钮序号，玩家关闭表单或发送失败返回 FormClose
     */
    sendAsync(player: Player): Promise<number | FormClose>;
}
export class SimpleFormEx<T> {
    /** 表单标题 */
    title: string;
    /**
     * 表单内容
     *
     * 可用变量
     * - `{{currentPage}}` - 当前页数
     * - `{{maxPage}}` - 最大页数
     * - `{{count}}` - 条目总数
     */
    content: string;
    /** 表单按钮参数列表 */
    buttons: T[];
    /**
     * 表单按钮格式化函数
     * @param v 表单按钮对应的参数
     * @param index 按钮对应的位置
     * @param array 整个表单按钮参数列表
     * @returns 格式化后的按钮 `[ text, image ]`
     */
    formatter: (v: T, index: number, array: T[]) => [string, string?];
    /** 表单是否可翻页 */
    canTurnPage: boolean;
    /** 表单是否显示跳页按钮 */
    canJumpPage: boolean;
    /** 表单每页最大项目数 */
    maxPageNum: number;
    /** 表单是否显示搜索按钮 */
    hasSearchButton: boolean;
    /**
     * 表单按钮搜索函数
     * @param buttons 整个表单按钮参数列表
     * @param param 搜索关键词参数
     * @returns 搜索到的按钮参数列表
     */
    searcher: (buttons: T[], param: string) => T[];
    /**
     * @param buttons 表单按钮参数
     */
    constructor(buttons?: T[]);
    /**
     * 格式化给定按钮
     * @param buttons 表单按钮参数列表
     * @returns 格式化后的按钮
     */
    formatButtons(buttons?: T[]): [string, string?][];
    /**
     * @returns 表单最大页数
     */
    getMaxPageNum(): number;
    /**
     * 获取对应页数的按钮参数列表
     * @param page 页码
     * @returns 按钮参数列表
     */
    getPage(page?: number): T[];
    /**
     * 异步向玩家发送搜索表单
     * @param player 玩家对象
     * @param defaultVal 搜索框默认内容
     * @returns 选择的搜索结果按钮参数。返回 null 为没搜到, FormClose 为取消搜索
     */
    sendSearchForm(player: Player, defaultVal?: string): Promise<T | null | FormClose>;
    /**
     * 异步向玩家发送表单
     * @param player 玩家对象
     * @param page 页码
     * @returns 给定的按钮参数，表单被玩家关闭或发送失败返回 FormClose
     */
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
