import { FormClose } from './const';
import { CustomFormEx } from './custom-ex';
import { SimpleFormAsync } from './simple-async';

export class SimpleFormEx<T> {
  /** 表单标题 */
  public title = '';

  /**
   * 表单内容
   *
   * 可用变量
   * - `{{currentPage}}` - 当前页数
   * - `{{maxPage}}` - 最大页数
   * - `{{count}}` - 条目总数
   */
  public content =
    '§a第 §e{{currentPage}} §f/ §6{{maxPage}} §a页 §7| §a共 §e{{count}} §a条';

  /** 表单按钮参数列表 */
  public buttons: T[] = [];

  /**
   * 表单按钮格式化函数
   * @param v 表单按钮对应的参数
   * @param index 按钮对应的位置
   * @param array 整个表单按钮参数列表
   * @returns 格式化后的按钮 `[ text, image ]`
   */
  // eslint-disable-next-line class-methods-use-this
  public formatter: (v: T, index: number, array: T[]) => [string, string?] = (
    v
  ) => [`§3${String(v)}`];

  /** 表单是否可翻页 */
  public canTurnPage = false;

  /** 表单是否显示跳页按钮 */
  public canJumpPage = false;

  /** 表单每页最大项目数 */
  public maxPageNum = 15;

  /** 表单是否显示搜索按钮 */
  public hasSearchButton = false;

  // eslint-disable-next-line class-methods-use-this
  /**
   * 表单按钮搜索函数
   * @param buttons 整个表单按钮参数列表
   * @param param 搜索关键词参数
   * @returns 搜索到的按钮参数列表
   */
  public searcher: (buttons: T[], param: string) => T[] = (
    buttons,
    param
  ): T[] => {
    const params = param.toLowerCase().split(/\s/g);
    const formatted = this.formatButtons(buttons).map((v) =>
      v[0].toLowerCase()
    );
    const result: [number, T][] = [];
    for (const it of formatted) {
      const score = params.reduce(
        (acc, cur) => acc + (it.includes(cur) ? 1 : 0),
        0
      );
      if (score) result.push([score, buttons[formatted.indexOf(it)]]);
    }
    return result.sort(([a], [b]) => b - a).map((v) => v[1]);
  };

  /**
   * @param buttons 表单按钮参数
   */
  constructor(buttons: T[] = []) {
    this.buttons = buttons;
  }

  /**
   * 格式化给定按钮
   * @param buttons 表单按钮参数列表
   * @returns 格式化后的按钮
   */
  formatButtons(buttons: T[] = this.buttons): [string, string?][] {
    return buttons.map(this.formatter);
  }

  /**
   * @returns 表单最大页数
   */
  getMaxPageNum(): number {
    return this.canTurnPage
      ? Math.ceil(this.buttons.length / this.maxPageNum)
      : 1;
  }

  /**
   * 获取对应页数的按钮参数列表
   * @param page 页码
   * @returns 按钮参数列表
   */
  getPage(page = 1): T[] {
    if (page > this.getMaxPageNum()) return [];
    return this.buttons.slice(
      (page - 1) * this.maxPageNum,
      page * this.maxPageNum
    );
  }

  /**
   * 异步向玩家发送搜索表单
   * @param player 玩家对象
   * @param defaultVal 搜索框默认内容
   * @returns 选择的搜索结果按钮参数。返回 null 为没搜到, FormClose 为取消搜索
   */
  async sendSearchForm(
    player: Player,
    defaultVal = ''
  ): Promise<T | null | FormClose> {
    const form = new CustomFormEx(this.title);
    const res = await form
      .addInput('param', '请输入你要搜索的内容', { default: defaultVal })
      .sendAsync(player);
    if (res === FormClose) return FormClose;

    const searched = this.searcher(this.buttons, res.param);
    if (!searched.length) {
      await new SimpleFormAsync({
        title: this.title,
        content: '§6没有搜索到结果',
      }).sendAsync(player);
      return null;
    }

    const searchForm = new SimpleFormEx<T>();
    searchForm.title = this.title;
    searchForm.content = `§a为您找到了 §l§6${searched.length} §r§a个结果\n${searchForm.content}`;
    searchForm.buttons = searched;
    searchForm.formatter = this.formatter;
    searchForm.canTurnPage = this.canTurnPage;
    searchForm.canJumpPage = this.canJumpPage;
    searchForm.maxPageNum = this.maxPageNum;
    searchForm.hasSearchButton = false;
    const selected = await searchForm.sendAsync(player);

    return selected === FormClose ? FormClose : selected;
  }

  /**
   * 异步向玩家发送表单
   * @param player 玩家对象
   * @param page 页码
   * @returns 给定的按钮参数，表单被玩家关闭或发送失败返回 FormClose
   */
  async sendAsync(player: Player, page = 1): Promise<T | FormClose> {
    const buttons = this.canTurnPage ? this.getPage(page) : this.buttons;
    const formattedButtons = this.formatButtons(buttons);

    const maxPage = this.getMaxPageNum();
    const pageAboveOne = maxPage > 1;

    const hasJumpBtn = this.canJumpPage && pageAboveOne;
    const hasPreviousPage = page > 1 && pageAboveOne;
    const hasNextPage = page < maxPage && pageAboveOne;

    if (hasPreviousPage) formattedButtons.unshift(['§2<- 上一页']);
    if (hasJumpBtn) formattedButtons.unshift(['§1跳页']);
    if (this.hasSearchButton) formattedButtons.unshift(['§1搜索']);
    if (hasNextPage) formattedButtons.push(['§2下一页 ->']);

    const formatContent = (content: string): string => {
      const count = this.buttons.length;
      const formatMap = {
        currentPage: page,
        maxPage,
        count,
      };
      for (const [key, val] of Object.entries(formatMap)) {
        content = content.replaceAll(`{{${key}}}`, String(val));
      }
      return content;
    };

    const resultIndex = await new SimpleFormAsync({
      title: this.title,
      content: formatContent(this.content),
      buttons: formattedButtons,
    }).sendAsync(player);
    if (resultIndex === FormClose) return FormClose;

    let offset = 0;
    if (this.hasSearchButton) {
      if (resultIndex === offset) {
        const res = await this.sendSearchForm(player);
        return res === null || res === FormClose
          ? this.sendAsync(player, page)
          : res;
      }
      offset += 1;
    }

    if (hasJumpBtn) {
      if (resultIndex === offset) {
        const res = await new CustomFormEx(this.title)
          .addSlider('num', '请选择你要跳转的页数', 1, maxPage, {
            default: page,
          })
          .sendAsync(player);
        return this.sendAsync(player, res === FormClose ? page : res.num);
      }
      offset += 1;
    }

    if (hasPreviousPage) {
      if (resultIndex === offset) {
        return this.sendAsync(player, page - 1);
      }
      offset += 1;
    }

    if (hasNextPage && resultIndex + 1 === formattedButtons.length) {
      return this.sendAsync(player, page + 1);
    }

    const realIndex = resultIndex - offset;
    return buttons[realIndex];
  }
}
