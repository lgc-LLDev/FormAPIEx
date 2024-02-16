import { FormClose } from './const';
import { sendFormAsync } from './util';

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
  public title = '';

  /** 表单内容 */
  public content = '';

  /** 表单按钮 `[ text, image ]` */
  public buttons: [string, string?][] = [];

  /**
   * @param options 附加选项
   */
  constructor(options: SimpleFormAsyncOptions = {}) {
    const { title, content, buttons } = options;
    if (title) this.title = title;
    if (content) this.content = content;
    if (buttons) this.buttons = buttons;
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

  /**
   * 设置表单内容
   * @param val 内容
   * @returns 自身，便于链式调用
   */
  setContent(val: string) {
    this.content = val;
    return this;
  }

  /**
   * 给表单添加一个按钮
   * @param text 按钮文本
   * @param image 按钮图片
   * @returns 自身，便于链式调用
   */
  addButton(text: string, image?: string) {
    this.buttons.push([text, image]);
    return this;
  }

  /**
   * 异步向玩家发送该表单
   * @param player 玩家对象
   * @returns 玩家选择的按钮序号，玩家关闭表单或发送失败返回 FormClose
   */
  sendAsync(player: Player): Promise<number | FormClose> {
    const form = mc
      .newSimpleForm()
      .setTitle(this.title)
      .setContent(this.content);
    this.buttons.forEach(([text, image]) => {
      if (image) form.addButton(text, image);
      else form.addButton(text);
    });
    return sendFormAsync(player, form);
  }
}
