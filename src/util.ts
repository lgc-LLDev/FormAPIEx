import { FormClose } from './const';

/**
 * 格式化错误堆栈
 * @param e 错误对象
 * @returns 格式化后的错误
 */
export function formatError(e: unknown): string {
  return e instanceof Error ? `${e.message}\n${e.stack}` : String(e);
}

/**
 * 在 sync function 中使用 setTimeout 调用 async function，解决 LLSE 回调调用 async 函数会出现的玄学 bug
 * @param func async function
 * @returns wrapped sync function
 */
export function wrapAsyncFunc<T extends unknown[]>(
  func: (...args: T) => Promise<unknown>
): (...args: T) => void {
  return (...args: T) => {
    setTimeout(
      () => func(...args).catch((e) => logger.error(formatError(e))),
      0
    );
  };
}

/**
 * 使用 json 序列化及反序列化深复制对象
 * @param obj 对象
 * @returns 复制后对象
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 异步向玩家发送表单对象
 * @param player 玩家对象
 * @param form 表单对象
 * @returns 返回结果
 */
export function sendFormAsync(
  player: Player,
  form: SimpleForm
): Promise<number | FormClose>;
export function sendFormAsync(
  player: Player,
  form: CustomForm
): Promise<(string | boolean | number)[] | FormClose>;
export function sendFormAsync(
  player: Player,
  form: SimpleForm | CustomForm
): Promise<number | (string | boolean | number)[] | FormClose> {
  return new Promise((resolve) => {
    player.sendForm(form, (_, data) =>
      setTimeout(
        () => resolve(data === null || data === undefined ? FormClose : data),
        0
      )
    );
  });
}
