import { deepClone, sendFormAsync } from './util';

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

export type CustomFormObject =
  | CustomFormLabelObject
  | CustomFormInputObject
  | CustomFormSwitchObject
  | CustomFormDropdownObject
  | CustomFormSliderObject
  | CustomFormStepSliderObject;

/**
 * 使用 CustomFormObject 构建自定义表单对象
 * @param formTitle 表单标题
 * @param objects 表单元素
 * @returns 构建好的表单
 */
export function buildCustomForm(
  formTitle: string,
  objects: CustomFormObject[]
): CustomForm {
  const form = mc.newCustomForm();
  form.setTitle(formTitle);

  for (const obj of objects) {
    switch (obj.type) {
      case 'label': {
        form.addLabel(obj.text);
        break;
      }
      case 'input': {
        const { title, placeholder, defaultVal } = obj;
        form.addInput(title, placeholder ?? '', defaultVal ?? '');
        break;
      }
      case 'switch': {
        const { title, defaultVal } = obj;
        form.addSwitch(title, defaultVal ?? false);
        break;
      }
      case 'dropdown': {
        const { title, items, defaultVal } = obj;
        form.addDropdown(title, items, defaultVal ?? 0);
        break;
      }
      case 'slider': {
        const { title, min, max, step, defaultVal } = obj;
        form.addSlider(title, min, max, step ?? 1, defaultVal ?? min);
        break;
      }
      case 'stepSlider': {
        const { title, items, defaultVal } = obj;
        form.addStepSlider(title, items, defaultVal ?? 0);
        break;
      }
      // no default
    }
  }

  return form;
}

export type CustomFormObjectReturnType<T extends CustomFormObject> =
  T extends CustomFormInputObject
    ? string
    : T extends CustomFormSwitchObject
    ? boolean
    : T extends
        | CustomFormDropdownObject
        | CustomFormSliderObject
        | CustomFormStepSliderObject
    ? number
    : undefined;

export type CustomFormReturn<T extends { [id: string]: CustomFormObject }> = {
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

export class CustomFormEx<T extends { [id: string]: CustomFormObject } = {}> {
  /** 表单标题 */
  public title = '';

  #objects: [string | undefined, CustomFormObject][] = [];

  /**
   * @param title 表单标题
   */
  constructor(title = '') {
    this.title = title;
  }

  /**
   * 获取表单元素列表
   */
  get objects(): [string | undefined, CustomFormObject][] {
    return deepClone(this.#objects);
  }

  /**
   * 获取表单元素数量
   */
  get length(): number {
    return this.#objects.length;
  }

  /**
   * 设置表单标题
   * @param val 标题
   * @returns 自身，便于链式调用
   */
  setTitle(val: string) {
    this.title = val;
    return this;
  }

  // add object

  // 格式化之后着色有问题
  // prettier-ignore
  /**
   * 向表单尾部添加一个元素
   * @param id 元素 id
   * @param obj 元素
   * @returns 自身，便于链式调用
   */
  push<TObj extends CustomFormObject, TId extends TObj extends CustomFormLabelObject ? string | undefined : string>(
      id: TId,
      obj: TObj
    ): CustomFormEx<
      T &
        (TId extends string
          ? { [k in TId]: TObj }
          : {})
    > {
      this.#objects.push([id, obj]);
      return this as any;
    }

  // prettier-ignore
  /**
   * 向表单头部添加一个元素
   * @param id 元素 id
   * @param obj 元素
   * @returns 自身，便于链式调用
   */
  unshift<TObj extends CustomFormObject, TId extends TObj extends CustomFormLabelObject ? string | undefined : string>(
      id: TId,
      obj: TObj
    ): CustomFormEx<
      T & (TId extends string ? { [k in TId]: TObj } : {})
    > {
      this.#objects.unshift([id, obj]);
      return this as any;
    }

  // prettier-ignore
  /**
   * 向表单插入一个元素
   * @param index 插入位置
   * @param id 元素 id
   * @param obj 元素
   * @returns 自身，便于链式调用
   */
  insert<TObj extends CustomFormObject, TId extends TObj extends CustomFormLabelObject ? string | undefined : string>(
      index: number,
      id: TId,
      obj: TObj
    ): CustomFormEx<
      T & (TId extends string ? { [k in TId]: TObj } : {})
    > {
      this.#objects.splice(index, 0, [id, obj]);
      return this as any;
    }

  // remove object

  /**
   * 删除表单元素
   * @param id 元素 id
   * @returns 自身，便于链式调用
   */
  remove<TId extends keyof T>(id: TId): CustomFormEx<Omit<T, TId>> {
    for (let i = 0; i < this.#objects.length; i += 1) {
      const [objId] = this.#objects[i];
      if (objId === id) {
        this.#objects.splice(i, 1);
        break;
      }
    }
    return this as any;
  }

  // get object

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

  get(id: keyof T | number) {
    if (typeof id === 'number') return this.#objects[id];

    for (const [objId, val] of this.#objects) {
      if (objId === id) return val as any;
    }
    return null;
  }

  // manually add object methods

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
  addLabel<TId extends string>(
    id: TId,
    text: string
  ): CustomFormEx<T & { [k in TId]: CustomFormLabelObject }>;

  addLabel(arg1: string, arg2?: string) {
    const id = arg2 ? arg1 : undefined;
    const text = arg2 ?? arg1;
    return this.push(id, { type: 'label', text });
  }

  /**
   * 向表单添加一个输入框
   * @param id 元素 id
   * @param title 输入框标题
   * @param options 附加选项
   * @returns 自身，便于链式调用
   */
  addInput<TId extends string>(
    id: TId,
    title: string,
    options: CustomFormInputOptions = {}
  ): CustomFormEx<T & { [k in TId]: CustomFormInputObject }> {
    const { placeholder, default: defaultVal } = options;
    return this.push(id, {
      type: 'input',
      title,
      placeholder,
      defaultVal,
    });
  }

  /**
   * 向表单添加一个开关
   * @param id 元素 id
   * @param title 开关标题
   * @param defaultVal 开关默认状态，默认为 `false`
   * @returns 自身，便于链式调用
   */
  addSwitch<TId extends string>(
    id: TId,
    title: string,
    defaultVal = false
  ): CustomFormEx<T & { [k in TId]: CustomFormSwitchObject }> {
    return this.push(id, { type: 'switch', title, defaultVal });
  }

  /**
   * 向表单添加一个下拉框
   * @param id 元素 id
   * @param title 下拉框标题
   * @param items 下拉框元素
   * @param defaultVal 下拉框默认选择元素位置，默认为 `0`
   * @returns 自身，便于链式调用
   */
  addDropdown<TId extends string>(
    id: TId,
    title: string,
    items: string[],
    defaultVal = 0
  ): CustomFormEx<T & { [k in TId]: CustomFormDropdownObject }> {
    return this.push(id, { type: 'dropdown', title, items, defaultVal });
  }

  /**
   * 向表单添加一个滑块
   * @param id 元素 id
   * @param title 滑块标题
   * @param min 滑块最小值
   * @param max 滑块最大值
   * @param options 附加选项
   * @returns 自身，便于链式调用
   */
  addSlider<TId extends string>(
    id: TId,
    title: string,
    min: number,
    max: number,
    options: CustomFormSliderOptions = {}
  ): CustomFormEx<T & { [k in TId]: CustomFormSliderObject }> {
    const { step, default: defaultVal } = options;
    return this.push(id, { type: 'slider', title, min, max, step, defaultVal });
  }

  /**
   * 向表单添加一个步进滑块
   * @param id 元素 id
   * @param title 步进滑块标题
   * @param items 步进滑块元素列表
   * @param defaultVal 滑块默认位置，默认为 `0`
   * @returns 自身，便于链式调用
   */
  addStepSlider<TId extends string>(
    id: TId,
    title: string,
    items: string[],
    defaultVal = 0
  ): CustomFormEx<T & { [k in TId]: CustomFormStepSliderObject }> {
    return this.push(id, { type: 'stepSlider', title, items, defaultVal });
  }

  // send

  private parseReturn(
    data: (string | boolean | number | null | undefined)[]
  ): CustomFormReturn<T> {
    const res: any = {};
    for (let i = 0; i < data.length; i += 1) {
      const [id] = this.#objects[i];
      const val = data[i] ?? undefined;
      if (id) res[id] = val;
    }
    return res;
  }

  /**
   * 异步向玩家发送该表单
   * @param player 玩家对象
   * @returns 返回结果，玩家关闭表单或发送失败返回 null
   */
  async sendAsync(player: Player): Promise<CustomFormReturn<T> | null> {
    const data = await sendFormAsync(
      player,
      buildCustomForm(
        this.title,
        this.objects.map((v) => v[1])
      )
    );
    if (data === null || data === undefined) return null;
    return this.parseReturn(data);
  }
}
