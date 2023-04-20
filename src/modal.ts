/**
 * 异步向玩家发送模式表单
 * @param player 玩家对象
 * @param title 表单标题
 * @param content 表单内容
 * @param confirmButton 确认按钮标题
 * @param cancelButton 取消按钮标题
 * @returns 玩家选择的按钮，发送失败返回 null
 */
export function sendModalFormAsync(
  player: Player,
  title: string,
  content: string,
  confirmButton = '§a确认',
  cancelButton = '§c取消'
): Promise<boolean | null | undefined> {
  return new Promise((resolve) => {
    player.sendModalForm(
      title,
      content,
      confirmButton,
      cancelButton,
      (_, data) => setTimeout(() => resolve(data), 0)
    );
  });
}
