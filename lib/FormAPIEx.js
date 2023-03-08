"use strict";
// LiteLoaderScript Dev Helper
/// <reference path="d:\Coding\bds\LLSEAids/dts/llaids/src/index.d.ts"/>
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CustomFormEx_objects;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleFormEx = exports.SimpleFormAsync = exports.CustomFormEx = exports.buildCustomForm = exports.sendFormAsync = exports.sendModalFormAsync = exports.LICENSE = exports.AUTHOR = exports.VERSION = exports.NAME = void 0;
exports.NAME = 'FormAPIEx';
exports.VERSION = [0, 2, 2];
exports.AUTHOR = 'student_2333 <lgc2333@126.com>';
exports.LICENSE = 'Apache-2.0';
function sendModalFormAsync(player, title, content, confirmButton = '§a确认', cancelButton = '§c取消') {
    return new Promise((resolve) => {
        player.sendModalForm(title, content, confirmButton, cancelButton, (_, data) => setTimeout(() => resolve(data), 0));
    });
}
exports.sendModalFormAsync = sendModalFormAsync;
function sendFormAsync(player, form) {
    return new Promise((resolve) => {
        // @ts-expect-error 这里的错误是误报
        player.sendForm(form, (_, data) => setTimeout(() => resolve(data), 0));
    });
}
exports.sendFormAsync = sendFormAsync;
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
exports.buildCustomForm = buildCustomForm;
class CustomFormEx {
    constructor(title = '') {
        this.title = '';
        _CustomFormEx_objects.set(this, []);
        this.title = title;
    }
    get objects() {
        return __classPrivateFieldGet(this, _CustomFormEx_objects, "f");
    }
    setTitle(val) {
        this.title = val;
        return this;
    }
    // add object
    // 格式化之后着色有问题
    // prettier-ignore
    push(id, obj) {
        __classPrivateFieldGet(this, _CustomFormEx_objects, "f").push([id, obj]);
        return this;
    }
    // prettier-ignore
    unshift(id, obj) {
        __classPrivateFieldGet(this, _CustomFormEx_objects, "f").unshift([id, obj]);
        return this;
    }
    // prettier-ignore
    insert(index, id, obj) {
        __classPrivateFieldGet(this, _CustomFormEx_objects, "f").splice(index, 0, [id, obj]);
        return this;
    }
    // remove object
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
    // get object by id
    get(id) {
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
    addInput(id, title, options = {}) {
        const { placeholder, default: defaultVal } = options;
        return this.push(id, {
            type: 'input',
            title,
            placeholder,
            defaultVal,
        });
    }
    addSwitch(id, title, defaultVal = false) {
        return this.push(id, { type: 'switch', title, defaultVal });
    }
    addDropdown(id, title, items, defaultVal = 0) {
        return this.push(id, { type: 'dropdown', title, items, defaultVal });
    }
    addSlider(id, title, min, max, options = {}) {
        const { step, default: defaultVal } = options;
        return this.push(id, { type: 'slider', title, min, max, step, defaultVal });
    }
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
    async sendAsync(player) {
        const data = await sendFormAsync(player, buildCustomForm(this.title, this.objects.map((v) => v[1])));
        if (data === null || data === undefined)
            return null;
        return this.parseReturn(data);
    }
}
exports.CustomFormEx = CustomFormEx;
_CustomFormEx_objects = new WeakMap();
class SimpleFormAsync {
    constructor(options = {}) {
        this.title = '';
        this.content = '';
        /** [ text, image ] */
        this.buttons = [];
        const { title, content, buttons } = options;
        if (title)
            this.title = title;
        if (content)
            this.content = content;
        if (buttons)
            this.buttons = buttons;
    }
    setTitle(val) {
        this.title = val;
        return this;
    }
    setContent(val) {
        this.content = val;
        return this;
    }
    addButton(text, image) {
        this.buttons.push([text, image]);
        return this;
    }
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
exports.SimpleFormAsync = SimpleFormAsync;
class SimpleFormEx {
    constructor(buttons = []) {
        this.title = '';
        /**
         * {{currentPage}} - 当前页数
         * {{maxPage}} - 最大页数
         * {{count}} - 条目总数
         */
        this.content = '§a第 §e{{currentPage}} §f/ §6{{maxPage}} §a页 §7| §a共 §e{{count}} §a条';
        this.buttons = [];
        /** @returns [ text, image ] */
        // eslint-disable-next-line class-methods-use-this
        this.formatter = (v) => [`§3${String(v)}`];
        this.canTurnPage = false;
        this.canJumpPage = false;
        this.maxPageNum = 15;
        this.hasSearchButton = false;
        // eslint-disable-next-line class-methods-use-this
        this.searcher = (buttons, param) => {
            const params = param.split(/\s/g);
            const formatted = this.formatButtons(buttons).map((v) => v[0]);
            const result = [];
            formatted.forEach((v, i) => {
                for (const wd of params) {
                    if (v.includes(wd))
                        result.push(buttons[i]);
                }
            });
            return result;
        };
        this.buttons = buttons;
    }
    formatButtons(buttons = this.buttons) {
        return buttons.map(this.formatter);
    }
    getMaxPageNum() {
        return this.canTurnPage
            ? Math.ceil(this.buttons.length / this.maxPageNum)
            : 1;
    }
    getPage(page = 1) {
        if (page > this.getMaxPageNum())
            return [];
        return this.buttons.slice((page - 1) * this.maxPageNum, page * this.maxPageNum);
    }
    /**
     * @returns null 为没搜到, false 为取消搜索
     */
    async sendSearchForm(player, defaultVal = '') {
        const form = new CustomFormEx(this.title);
        const res = await form
            .addInput('param', '请输入你要搜索的内容', { default: defaultVal })
            .sendAsync(player);
        if (!res)
            return false;
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
        return selected === null ? false : selected;
    }
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
        if (resultIndex === null || resultIndex === undefined)
            return null;
        let offset = 0;
        if (this.hasSearchButton) {
            if (resultIndex === offset) {
                const res = await this.sendSearchForm(player);
                if (res === false || res === null) {
                    // eslint-disable-next-line no-return-await
                    return await this.sendAsync(player, page);
                }
                return res;
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
                // eslint-disable-next-line no-return-await
                return await this.sendAsync(player, res ? res.num : page);
            }
            offset += 1;
        }
        if (hasPreviousPage) {
            if (resultIndex === offset) {
                // eslint-disable-next-line no-return-await
                return await this.sendAsync(player, page - 1);
            }
            offset += 1;
        }
        if (hasNextPage && resultIndex + 1 === formattedButtons.length) {
            // eslint-disable-next-line no-return-await
            return await this.sendAsync(player, page + 1);
        }
        const realIndex = resultIndex - offset;
        return buttons[realIndex];
    }
}
exports.SimpleFormEx = SimpleFormEx;
