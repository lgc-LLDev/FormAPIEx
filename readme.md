<!-- markdownlint-disable MD033 -->

# FormAPIEx

让处理表单返回值变得更容易！

## 介绍

本工具库提供了一些类以及函数，可以让各位更方便地处理表单返回值，不用再为需要自己处理表单按钮的 ID 而烦恼了！  
它甚至可以直接让你不需要写太多代码即可发送一个可以翻页以及搜索的列表！  
快来使用吧~

本工具库几乎全部使用异步语法编写，详细内容可以直接看下方的示例代码

## 示例

见 [FormAPIExample.js](https://github.com/lgc-LLSEDev/FormAPIEx/blob/master/FormAPIExample.js)

## 引用

<details open>
<summary>LL3 用法</summary>

### LL3 - QuickJS

- 将本仓库作为 Lip 包安装到 BDS 的插件目录：

  ```bash
  lip install github.com/lgc-LLDev/FormAPIEx
  ```

  或者作为你插件的依赖：

  ```jsonc
  // tooth.json
  {
    // ...
    "dependencies": {
      "github.com/lgc-LLDev/FormAPIEx": ">0.0.0" // 自行修改依赖版本
      // ...
    }
    // ...
  }
  ```

- 之后使用 `require` 导入（没有试过能不能用 ES6 语法，可以自行尝试）：

  ```js
  // 可以接着导入其他本库已经导出的函数，类等
  const { CustomFormEx } = require('./FormAPIEx');
  ```

### LL3 - Rollup

参见下方 `LL2 - NodeJS` 的用法

</details>

<details>
<summary>LL2 用法</summary>

### LL2 - QuickJS

- 将编译好的 `FormAPIEx.js` 扔进 BDS 目录的 `plugins/lib` 文件夹中，之后使用下面的代码来导入

  ```js

  ```

  如果你使用的是 TypeScript，那么我更推荐你使用模块语法导入

  ```ts
  // 可以接着导入其他本库已经导出的函数，类，接口等
  import { CustomFormEx } from './lib/FormAPIEx';
  ```

### LL2 - NodeJS

#### 引用 `form-api-ex` npm 包

- 先将本包加入你项目的依赖项中

  推荐使用 `pnpm` 管理项目依赖  
  下面的命令假设你已经安装了 `pnpm`，如果你没有安装，可以往上翻翻看看如何安装，也可以换用其他包管理器  
  使用下面的命令将本包添加到你项目的依赖项中

  ```bash
  pnpm i form-api-ex
  ```

- 然后使用下面的语法导入

  ```js
  // 可以接着导入其他本库已经导出的函数，类等
  const { CustomFormEx } = require('form-api-ex');
  ```

  如果你使用的是 TypeScript，那么我更推荐你使用模块语法导入

  ```ts
  // 可以接着导入其他本库已经导出的函数，类，接口等
  import { CustomFormEx } from 'form-api-ex';
  ```

</details>

## 联系我

QQ：3076823485  
吹水群：[1105946125](https://jq.qq.com/?_wv=1027&k=Z3n1MpEp)  
邮箱：<lgc2333@126.com>

## 赞助

感谢大家的赞助！你们的赞助将是我继续创作的动力！

- [爱发电](https://afdian.net/@lgc2333)
- <details>
    <summary>赞助二维码（点击展开）</summary>

  ![讨饭](https://raw.githubusercontent.com/lgc2333/ShigureBotMenu/master/src/imgs/sponsor.png)

  </details>

## 更新日志

### 0.5.1

- 修复 `SimpleFormOperational` 的 `title` 与 `content` 不生效的 Bug

### 0.5.0

- 使用 `FormClose` 表示玩家手动关闭表单或表单发送失败

### 0.4.2 (0.4.1)

- 修复 `SimpleFormEx` 的默认 `searcher` 的一些问题

### 0.4.0

- 新增 `SimpleFormOperational` 类

### 0.3.1

- 小调整

### 0.3.0

- 拆分为多文件，使用 `rollup` 编译为单文件
- 导出一些工具函数
- 加上注释

### 0.2.2

- 修改元信息

### 0.2.1

- 修改一些类型上的细节

### 0.2.0

- 支持操作 `CustomFormEx` 中的表单元素

### 0.1.1

- 修复一些细节问题
