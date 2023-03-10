import { expect } from '@playwright/test';
export const addTextToEditor = async (page, monacoEditor, text) => {
  await monacoEditor.click();
  await page.keyboard.press('Meta+KeyA');
  await page.keyboard.type(text);
};

export const ifTipsExist = async (page, tips) => {
  await expect(page.locator(`text=${tips}`)).toBeVisible();
};
