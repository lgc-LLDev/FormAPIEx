'use strict';

var version = "0.5.2";

const NAME = 'FormAPIEx';
const VERSION = (version.split('.').map((v) => Number(v)));
const AUTHOR = 'student_2333 <lgc2333@126.com>';
const LICENSE = 'Apache-2.0';
const FormClose = Symbol(`${NAME}_FormClose`);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * 格式化错误堆栈
 * @param e 错误对象
 * @returns 格式化后的错误
 */
function formatError(e) {
    return e instanceof Error ? `${e.message}\n${e.stack}` : String(e);
}
/**
 * 在 sync function 中使用 setTimeout 调用 async function，解决 LLSE 回调调用 async 函数会出现的玄学 bug
 * @param func async function
 * @returns wrapped sync function
 */
function wrapAsyncFunc(func) {
    return (...args) => {
        setTimeout(() => func(...args).catch((e) => logger.error(formatError(e))), 0);
    };
}
/**
 * 使用 json 序列化及反序列化深复制对象
 * @param obj 对象
 * @returns 复制后对象
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
function sendFormAsync(player, form) {
    return new Promise((resolve) => {
        player.sendForm(form, (_, data) => setTimeout(() => resolve(data === null || data === undefined ? FormClose : data), 0));
    });
}

var _CustomFormEx_objects;
/**
 * 使用 CustomFormObject 构建自定义表单对象
 * @param formTitle 表单标题
 * @param objects 表单元素
 * @returns 构建好的表单
 */
function buildCustomForm(formTitle, objects) {
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
class CustomFormEx {
    /**
     * @param title 表单标题
     */
    constructor(title = '') {
        /** 表单标题 */
        this.title = '';
        _CustomFormEx_objects.set(this, []);
        this.title = title;
    }
    /**
     * 获取表单元素列表
     */
    get objects() {
        return deepClone(__classPrivateFieldGet(this, _CustomFormEx_objects, "f"));
    }
    /**
     * 获取表单元素数量
     */
    get length() {
        return __classPrivateFieldGet(this, _CustomFormEx_objects, "f").length;
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
        __classPrivateFieldGet(this, _CustomFormEx_objects, "f").push([id, obj]);
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
        __classPrivateFieldGet(this, _CustomFormEx_objects, "f").unshift([id, obj]);
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
        __classPrivateFieldGet(this, _CustomFormEx_objects, "f").splice(index, 0, [id, obj]);
        return this;
    }
    // remove object
    /**
     * 删除表单元素
     * @param id 元素 id
     * @returns 自身，便于链式调用
     */
    remove(id) {
        for (let i = 0; i < __classPrivateFieldGet(this, _CustomFormEx_objects, "f").length; i += 1) {
            const [objId] = __classPrivateFieldGet(this, _CustomFormEx_objects, "f")[i];
            if (objId === id) {
                __classPrivateFieldGet(this, _CustomFormEx_objects, "f").splice(i, 1);
                break;
            }
        }
        return this;
    }
    get(id) {
        if (typeof id === 'number')
            return __classPrivateFieldGet(this, _CustomFormEx_objects, "f")[id];
        for (const [objId, val] of __classPrivateFieldGet(this, _CustomFormEx_objects, "f")) {
            if (objId === id)
                return val;
        }
        return null;
    }
    addLabel(arg1, arg2) {
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
    addInput(id, title, options = {}) {
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
    addSwitch(id, title, defaultVal = false) {
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
    addDropdown(id, title, items, defaultVal = 0) {
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
    addSlider(id, title, min, max, options = {}) {
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
    addStepSlider(id, title, items, defaultVal = 0) {
        return this.push(id, { type: 'stepSlider', title, items, defaultVal });
    }
    // send
    parseReturn(data) {
        const res = {};
        for (let i = 0; i < data.length; i += 1) {
            const [id] = __classPrivateFieldGet(this, _CustomFormEx_objects, "f")[i];
            const val = data[i] ?? undefined;
            if (id)
                res[id] = val;
        }
        return res;
    }
    /**
     * 异步向玩家发送该表单
     * @param player 玩家对象
     * @returns 返回结果，玩家关闭表单或发送失败返回 FormClose
     */
    async sendAsync(player) {
        const data = await sendFormAsync(player, buildCustomForm(this.title, this.objects.map((v) => v[1])));
        if (data === FormClose)
            return FormClose;
        return this.parseReturn(data);
    }
}
_CustomFormEx_objects = new WeakMap();

/**
 * 异步向玩家发送模式表单
 * @param player 玩家对象
 * @param title 表单标题
 * @param content 表单内容
 * @param confirmButton 确认按钮标题
 * @param cancelButton 取消按钮标题
 * @returns 玩家选择的按钮
 */
function sendModalFormAsync(player, title, content, confirmButton = '§a确认', cancelButton = '§c取消') {
    // 不知道怎么回事按取消会返回 null / undefined，干脆直接转 boolean
    return new Promise((resolve) => {
        player.sendModalForm(title, content, confirmButton, cancelButton, (_, data) => setTimeout(() => resolve(!!data), 0));
    });
}

class SimpleFormAsync {
    /**
     * @param options 附加选项
     */
    constructor(options = {}) {
        /** 表单标题 */
        this.title = '';
        /** 表单内容 */
        this.content = '';
        /** 表单按钮 `[ text, image ]` */
        this.buttons = [];
        const { title, content, buttons } = options;
        if (title)
            this.title = title;
        if (content)
            this.content = content;
        if (buttons)
            this.buttons = buttons;
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
        const form = mc
            .newSimpleForm()
            .setTitle(this.title)
            .setContent(this.content);
        this.buttons.forEach(([text, image]) => {
            if (image)
                form.addButton(text, image);
            else
                form.addButton(text);
        });
        return sendFormAsync(player, form);
    }
}

class SimpleFormEx {
    /**
     * @param buttons 表单按钮参数
     */
    constructor(buttons = []) {
        /** 表单标题 */
        this.title = '';
        /**
         * 表单内容
         *
         * 可用变量
         * - `{{currentPage}}` - 当前页数
         * - `{{maxPage}}` - 最大页数
         * - `{{count}}` - 条目总数
         */
        this.content = '§a第 §e{{currentPage}} §f/ §6{{maxPage}} §a页 §7| §a共 §e{{count}} §a条';
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
        this.formatter = (v) => [`§3${String(v)}`];
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
                if (score)
                    result.push([score, buttons[formatted.indexOf(it)]]);
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
        return this.canTurnPage
            ? Math.ceil(this.buttons.length / this.maxPageNum)
            : 1;
    }
    /**
     * 获取对应页数的按钮参数列表
     * @param page 页码
     * @returns 按钮参数列表
     */
    getPage(page = 1) {
        if (page > this.getMaxPageNum())
            return [];
        return this.buttons.slice((page - 1) * this.maxPageNum, page * this.maxPageNum);
    }
    /**
     * 异步向玩家发送搜索表单
     * @param player 玩家对象
     * @param defaultVal 搜索框默认内容
     * @returns 选择的搜索结果按钮参数。返回 null 为没搜到, FormClose 为取消搜索
     */
    async sendSearchForm(player, defaultVal = '') {
        const form = new CustomFormEx(this.title);
        const res = await form
            .addInput('param', '请输入你要搜索的内容', { default: defaultVal })
            .sendAsync(player);
        if (res === FormClose)
            return FormClose;
        const searched = this.searcher(this.buttons, res.param);
        if (!searched.length) {
            await new SimpleFormAsync({
                title: this.title,
                content: '§6没有搜索到结果',
            }).sendAsync(player);
            return null;
        }
        const searchForm = new SimpleFormEx();
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
    async sendAsync(player, page = 1) {
        const buttons = this.canTurnPage ? this.getPage(page) : this.buttons;
        const formattedButtons = this.formatButtons(buttons);
        const maxPage = this.getMaxPageNum();
        const pageAboveOne = maxPage > 1;
        const hasJumpBtn = this.canJumpPage && pageAboveOne;
        const hasPreviousPage = page > 1 && pageAboveOne;
        const hasNextPage = page < maxPage && pageAboveOne;
        if (hasPreviousPage)
            formattedButtons.unshift(['§2<- 上一页']);
        if (hasJumpBtn)
            formattedButtons.unshift(['§1跳页']);
        if (this.hasSearchButton)
            formattedButtons.unshift(['§1搜索']);
        if (hasNextPage)
            formattedButtons.push(['§2下一页 ->']);
        const formatContent = (content) => {
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
        if (resultIndex === FormClose)
            return FormClose;
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

class SimpleFormOperational {
    constructor(title = '', content = '', buttons = []) {
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
        if (res === FormClose)
            return FormClose;
        return res.operation();
    }
}

exports.AUTHOR = AUTHOR;
exports.CustomFormEx = CustomFormEx;
exports.FormClose = FormClose;
exports.LICENSE = LICENSE;
exports.NAME = NAME;
exports.SimpleFormAsync = SimpleFormAsync;
exports.SimpleFormEx = SimpleFormEx;
exports.SimpleFormOperational = SimpleFormOperational;
exports.VERSION = VERSION;
exports.buildCustomForm = buildCustomForm;
exports.deepClone = deepClone;
exports.formatError = formatError;
exports.sendFormAsync = sendFormAsync;
exports.sendModalFormAsync = sendModalFormAsync;
exports.wrapAsyncFunc = wrapAsyncFunc;
