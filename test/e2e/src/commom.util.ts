export const addTextToEditor = async (page, monacoEditor, text) => {
  await monacoEditor.click();
  await page.keyboard.press('Meta+KeyA');
  await page.keyboard.type(text);
};
