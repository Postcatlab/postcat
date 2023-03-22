import { expect } from '@playwright/test';
export const ECHO_API_URL = 'http://demo.gokuapi.com:8280/Web/Test/all/print';
export const addTextToEditor = async (page, text, monacoEditor = page.locator('.monaco-editor').nth(0)) => {
  await monacoEditor.click();
  await page.keyboard.press('Meta+KeyA');
  await page.keyboard.type(text);
};

export const ifTipsExist = async (page, tips) => {
  await expect(page.locator(`text=${tips}`)).toBeVisible();
};

export const login = async page => {
  await page.getByRole('button', { name: 'Sign in/Up' }).click();
  await page.getByPlaceholder('Enter Email').click();
  await page.getByPlaceholder('Enter Email').fill('scar@qq.com');
  await page.getByPlaceholder('Enter Email').press('Tab');
  await page.getByPlaceholder('Enter password').fill('123456');
  await page.getByPlaceholder('Enter password').press('Enter');
  await page.getByRole('button', { name: 'switch to the cloud workspace' }).click();
};

export const waitForResponse = async page => {
  const responsePromise = page.waitForResponse('**/api/unit');
  await page.getByRole('button', { name: 'Send' }).click();
  const request = await responsePromise;
  const res = await request.json();
  const result = JSON.parse(res.data.report.response.body);
  return result;
};
