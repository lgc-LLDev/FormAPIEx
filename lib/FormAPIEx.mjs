// package.json
var version = "0.5.2";

// src/const.ts
var NAME = "FormAPIEx";
var VERSION = version.split(".").map((v) => Number(v));
var AUTHOR = "student_2333 <lgc2333@126.com>";
var LICENSE = "Apache-2.0";
var FormClose = Symbol(`${NAME}_FormClose`);

// src/util.ts
function formatError(e) {
  return e instanceof Error ? `${e.message}
${e.stack}` : String(e);
}
function wrapAsyncFunc(func) {
  return (...args) => {
    setTimeout(() => func(...args).catch((e) => logger.error(formatError(e))), 0);
  };
}
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
function sendFormAsync(player, form) {
  return new Promise((resolve) => {
    player.sendForm(
      form,
      (_, data) => setTimeout(
        () => resolve(data === null || data === void 0 ? FormClose : data),
        0
      )
    );
  });
}

// src/custom-ex.ts
function buildCustomForm(formTitle, objects) {
  const form = mc.newCustomForm();
  form.setTitle(formTitle);
  for (const obj of objects) {
    switch (obj.type) {
      case "label": {
        form.addLabel(obj.text);
        break;
      }
      case "input": {
        const { title, placeholder, defaultVal } = obj;
        form.addInput(title, placeholder ?? "", defaultVal ?? "");
        break;
      }
      case "switch": {
        const { title, defaultVal } = obj;
        form.addSwitch(title, defaultVal ?? false);
        break;
      }
      case "dropdown": {
        const { title, items, defaultVal } = obj;
        form.addDropdown(title, items, defaultVal ?? 0);
        break;
      }
      case "slider": {
        const { title, min, max, step, defaultVal } = obj;
        form.addSlider(title, min, max, step ?? 1, defaultVal ?? min);
        break;
      }
      case "stepSlider": {
        const { title, items, defaultVal } = obj;
        form.addStepSlider(title, items, defaultVal ?? 0);
        break;
      }
    }
  }
  return form;
}
var CustomFormEx = class {
  /**
   * @param title 表单标题
   */
  constructor(title = "") {
    /** 表单标题 */
    this.title = "";
    this.#objects = [];
    this.title = title;
  }
  #objects;
  /**
   * 获取表单元素列表
   */
  get objects() {
    return deepClone(this.#objects);
  }
  /**
   * 获取表单元素数量
   */
  get length() {
    return this.#objects.length;
  }
  /**
   * 设置表单标题
   * @param val 标题
   * @returns 自身，便于链式调用
   */
  setTitle(val) {
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
  push(id, obj) {
    this.#objects.push([id, obj]);
    return this;
  }
  // prettier-ignore
  /**
   * 向表单头部添加一个元素
   * @param id 元素 id
   * @param obj 元素
   * @returns 自身，便于链式调用
   */
  unshift(id, obj) {
    this.#objects.unshift([id, obj]);
    return this;
  }
  // prettier-ignore
  /**
   * 向表单插入一个元素
   * @param index 插入位置
   * @param id 元素 id
   * @param obj 元素
   * @returns 自身，便于链式调用
   */
  insert(index, id, obj) {
    this.#objects.splice(index, 0, [id, obj]);
    return this;
  }
  // remove object
  /**
   * 删除表单元素
   * @param id 元素 id
   * @returns 自身，便于链式调用
   */
  remove(id) {
    for (let i = 0; i < this.#objects.length; i += 1) {
      const [objId] = this.#objects[i];
      if (objId === id) {
        this.#objects.splice(i, 1);
        break;
      }
    }
    return this;
  }
  get(id) {
    if (typeof id === "number") return this.#objects[id];
    for (const [objId, val] of this.#objects) {
      if (objId === id) return val;
    }
    return null;
  }
  addLabel(arg1, arg2) {
    const id = arg2 ? arg1 : void 0;
    const text = arg2 ?? arg1;
    return this.push(id, { type: "label", text });
  }
  /**
   * 向表单添加一个输入框
   * @param id 元素 id
   * @param title 输入框标题
   * @param options 附加选项
   * @returns 自身，便于链式调用
   */
  addInput(id, title, options = {}) {
    const { placeholder, default: defaultVal } = options;
    return this.push(id, {
      type: "input",
      title,
      placeholder,
      defaultVal
    });
  }
  /**
   * 向表单添加一个开关
   * @param id 元素 id
   * @param title 开关标题
   * @param defaultVal 开关默认状态，默认为 `false`
   * @returns 自身，便于链式调用
   */
  addSwitch(id, title, defaultVal = false) {
    return this.push(id, { type: "switch", title, defaultVal });
  }
  /**
   * 向表单添加一个下拉框
   * @param id 元素 id
   * @param title 下拉框标题
   * @param items 下拉框元素
   * @param defaultVal 下拉框默认选择元素位置，默认为 `0`
   * @returns 自身，便于链式调用
   */
  addDropdown(id, title, items, defaultVal = 0) {
    return this.push(id, { type: "dropdown", title, items, defaultVal });
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
  addSlider(id, title, min, max, options = {}) {
    const { step, default: defaultVal } = options;
    return this.push(id, { type: "slider", title, min, max, step, defaultVal });
  }
  /**
   * 向表单添加一个步进滑块
   * @param id 元素 id
   * @param title 步进滑块标题
   * @param items 步进滑块元素列表
   * @param defaultVal 滑块默认位置，默认为 `0`
   * @returns 自身，便于链式调用
   */
  addStepSlider(id, title, items, defaultVal = 0) {
    return this.push(id, { type: "stepSlider", title, items, defaultVal });
  }
  // send
  parseReturn(data) {
    const res = {};
    for (let i = 0; i < data.length; i += 1) {
      const [id] = this.#objects[i];
      const val = data[i] ?? void 0;
      if (id) res[id] = val;
    }
    return res;
  }
  /**
   * 异步向玩家发送该表单
   * @param player 玩家对象
   * @returns 返回结果，玩家关闭表单或发送失败返回 FormClose
   */
  async sendAsync(player) {
    const data = await sendFormAsync(
      player,
      buildCustomForm(
        this.title,
        this.objects.map((v) => v[1])
      )
    );
    if (data === FormClose) return FormClose;
    return this.parseReturn(data);
  }
};

// src/modal.ts
function sendModalFormAsync(player, title, content, confirmButton = "\xA7a\u786E\u8BA4", cancelButton = "\xA7c\u53D6\u6D88") {
  return new Promise((resolve) => {
    player.sendModalForm(
      title,
      content,
      confirmButton,
      cancelButton,
      (_, data) => setTimeout(() => resolve(!!data), 0)
    );
  });
}

// src/simple-async.ts
var SimpleFormAsync = class {
  /**
   * @param options 附加选项
   */
  constructor(options = {}) {
    /** 表单标题 */
    this.title = "";
    /** 表单内容 */
    this.content = "";
    /** 表单按钮 `[ text, image ]` */
    this.buttons = [];
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
  setTitle(val) {
    this.title = val;
    return this;
  }
  /**
   * 设置表单内容
   * @param val 内容
   * @returns 自身，便于链式调用
   */
  setContent(val) {
    this.content = val;
    return this;
  }
  /**
   * 给表单添加一个按钮
   * @param text 按钮文本
   * @param image 按钮图片
   * @returns 自身，便于链式调用
   */
  addButton(text, image) {
    this.buttons.push([text, image]);
    return this;
  }
  /**
   * 异步向玩家发送该表单
   * @param player 玩家对象
   * @returns 玩家选择的按钮序号，玩家关闭表单或发送失败返回 FormClose
   */
  sendAsync(player) {
    const form = mc.newSimpleForm().setTitle(this.title).setContent(this.content);
    this.buttons.forEach(([text, image]) => {
      if (image) form.addButton(text, image);
      else form.addButton(text);
    });
    return sendFormAsync(player, form);
  }
};

// src/simple-ex.ts
var SimpleFormEx = class _SimpleFormEx {
  /**
   * @param buttons 表单按钮参数
   */
  constructor(buttons = []) {
    /** 表单标题 */
    this.title = "";
    /**
     * 表单内容
     *
     * 可用变量
     * - `{{currentPage}}` - 当前页数
     * - `{{maxPage}}` - 最大页数
     * - `{{count}}` - 条目总数
     */
    this.content = "\xA7a\u7B2C \xA7e{{currentPage}} \xA7f/ \xA76{{maxPage}} \xA7a\u9875 \xA77| \xA7a\u5171 \xA7e{{count}} \xA7a\u6761";
    /** 表单按钮参数列表 */
    this.buttons = [];
    /**
     * 表单按钮格式化函数
     * @param v 表单按钮对应的参数
     * @param index 按钮对应的位置
     * @param array 整个表单按钮参数列表
     * @returns 格式化后的按钮 `[ text, image ]`
     */
    // eslint-disable-next-line class-methods-use-this
    this.formatter = (v) => [
      `\xA73${String(v)}`
    ];
    /** 表单是否可翻页 */
    this.canTurnPage = false;
    /** 表单是否显示跳页按钮 */
    this.canJumpPage = false;
    /** 表单每页最大项目数 */
    this.maxPageNum = 15;
    /** 表单是否显示搜索按钮 */
    this.hasSearchButton = false;
    // eslint-disable-next-line class-methods-use-this
    /**
     * 表单按钮搜索函数
     * @param buttons 整个表单按钮参数列表
     * @param param 搜索关键词参数
     * @returns 搜索到的按钮参数列表
     */
    this.searcher = (buttons, param) => {
      const params = param.toLowerCase().split(/\s/g);
      const formatted = this.formatButtons(buttons).map((v) => v[0].toLowerCase());
      const result = [];
      for (const it of formatted) {
        const score = params.reduce((acc, cur) => acc + (it.includes(cur) ? 1 : 0), 0);
        if (score) result.push([score, buttons[formatted.indexOf(it)]]);
      }
      return result.sort(([a], [b]) => b - a).map((v) => v[1]);
    };
    this.buttons = buttons;
  }
  /**
   * 格式化给定按钮
   * @param buttons 表单按钮参数列表
   * @returns 格式化后的按钮
   */
  formatButtons(buttons = this.buttons) {
    return buttons.map(this.formatter);
  }
  /**
   * @returns 表单最大页数
   */
  getMaxPageNum() {
    return this.canTurnPage ? Math.ceil(this.buttons.length / this.maxPageNum) : 1;
  }
  /**
   * 获取对应页数的按钮参数列表
   * @param page 页码
   * @returns 按钮参数列表
   */
  getPage(page = 1) {
    if (page > this.getMaxPageNum()) return [];
    return this.buttons.slice((page - 1) * this.maxPageNum, page * this.maxPageNum);
  }
  /**
   * 异步向玩家发送搜索表单
   * @param player 玩家对象
   * @param defaultVal 搜索框默认内容
   * @returns 选择的搜索结果按钮参数。返回 null 为没搜到, FormClose 为取消搜索
   */
  async sendSearchForm(player, defaultVal = "") {
    const form = new CustomFormEx(this.title);
    const res = await form.addInput("param", "\u8BF7\u8F93\u5165\u4F60\u8981\u641C\u7D22\u7684\u5185\u5BB9", { default: defaultVal }).sendAsync(player);
    if (res === FormClose) return FormClose;
    const searched = this.searcher(this.buttons, res.param);
    if (!searched.length) {
      await new SimpleFormAsync({
        title: this.title,
        content: "\xA76\u6CA1\u6709\u641C\u7D22\u5230\u7ED3\u679C"
      }).sendAsync(player);
      return null;
    }
    const searchForm = new _SimpleFormEx();
    searchForm.title = this.title;
    searchForm.content = `\xA7a\u4E3A\u60A8\u627E\u5230\u4E86 \xA7l\xA76${searched.length} \xA7r\xA7a\u4E2A\u7ED3\u679C
${searchForm.content}`;
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
  async sendAsync(player, page = 1) {
    const buttons = this.canTurnPage ? this.getPage(page) : this.buttons;
    const formattedButtons = this.formatButtons(buttons);
    const maxPage = this.getMaxPageNum();
    const pageAboveOne = maxPage > 1;
    const hasJumpBtn = this.canJumpPage && pageAboveOne;
    const hasPreviousPage = page > 1 && pageAboveOne;
    const hasNextPage = page < maxPage && pageAboveOne;
    if (hasPreviousPage) formattedButtons.unshift(["\xA72<- \u4E0A\u4E00\u9875"]);
    if (hasJumpBtn) formattedButtons.unshift(["\xA71\u8DF3\u9875"]);
    if (this.hasSearchButton) formattedButtons.unshift(["\xA71\u641C\u7D22"]);
    if (hasNextPage) formattedButtons.push(["\xA72\u4E0B\u4E00\u9875 ->"]);
    const formatContent = (content) => {
      const count = this.buttons.length;
      const formatMap = {
        currentPage: page,
        maxPage,
        count
      };
      for (const [key, val] of Object.entries(formatMap)) {
        content = content.replaceAll(`{{${key}}}`, String(val));
      }
      return content;
    };
    const resultIndex = await new SimpleFormAsync({
      title: this.title,
      content: formatContent(this.content),
      buttons: formattedButtons
    }).sendAsync(player);
    if (resultIndex === FormClose) return FormClose;
    let offset = 0;
    if (this.hasSearchButton) {
      if (resultIndex === offset) {
        const res = await this.sendSearchForm(player);
        return res === null || res === FormClose ? this.sendAsync(player, page) : res;
      }
      offset += 1;
    }
    if (hasJumpBtn) {
      if (resultIndex === offset) {
        const res = await new CustomFormEx(this.title).addSlider("num", "\u8BF7\u9009\u62E9\u4F60\u8981\u8DF3\u8F6C\u7684\u9875\u6570", 1, maxPage, {
          default: page
        }).sendAsync(player);
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
};

// src/simple-operational.ts
var SimpleFormOperational = class {
  constructor(title = "", content = "", buttons = []) {
    this.title = title;
    this.content = content;
    this.buttons = buttons;
  }
  async sendAsync(player) {
    const form = new SimpleFormEx(this.buttons);
    form.title = this.title;
    form.content = this.content;
    form.formatter = ({ text, image }) => [text, image];
    const res = await form.sendAsync(player);
    if (res === FormClose) return FormClose;
    return res.operation();
  }
};
export {
  AUTHOR,
  CustomFormEx,
  FormClose,
  LICENSE,
  NAME,
  SimpleFormAsync,
  SimpleFormEx,
  SimpleFormOperational,
  VERSION,
  buildCustomForm,
  deepClone,
  formatError,
  sendFormAsync,
  sendModalFormAsync,
  wrapAsyncFunc
};
