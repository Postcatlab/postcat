import { expect } from '@playwright/test';
export const ECHO_API_URL = 'http://demo.gokuapi.com:8280/Web/Test/all/print';
export const addTextToEditor = async (page, text, monacoEditor = page.locator('.ant-modal-body .monaco-editor').first()) => {
  const isExist = await monacoEditor.count();
  monacoEditor = isExist ? monacoEditor : await page.locator('.monaco-editor').first();
  await monacoEditor.click();
  await page.keyboard.press('Meta+KeyA');
  await page.keyboard.type(text);
};
export const clickButtonByIconName = async (page, name) => {
  await page.locator(`eo-iconpark-icon[name="${name}"]`).click();
};
export const seletGroup = async (page, groupName) => {
  await page.locator('eo-ng-tree-default').getByText(groupName).click();
};
/**
 * Operate group by name and operateName
 *
 * @param page
 * @param groupName operted group name
 * @param operateName such as 'Add', 'Edit', 'Delete'
 */
export const operateGroup = async (page, groupName, operateName) => {
  await page.locator('eo-ng-tree-default').getByText(groupName).hover();
  await page.getByTitle(groupName).getByRole('button').click();
  if (operateName) {
    await page.getByText(operateName, { exact: true }).click();
  }
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

export const addTableParams = async (dom, value) => {
  await dom.click();
  await dom.fill(value);
};
/**
 * Add table row value
 *
 * @param page
 * @param opts.index row index
 * @param opts.valueByKey input placeholder and value
 */
export const adaTabledRow = async (
  page,
  opts: { index?: number; enums?: Array<{ [key: string]: string }>; valueByKey?: { [key: string]: string } }
) => {
  let index = opts.index || 0;
  if (opts.enums) {
    const promiseArr = opts.enums.map(async (item, key) => {
      for (const name in item) {
        const value = item[name];
        await addTableParams(page.getByPlaceholder(name).nth(index + key), value);
      }
    });
    await Promise.all(promiseArr);
  }
  for (const name in opts.valueByKey) {
    const value = opts.valueByKey[name];
    await addTableParams(page.getByPlaceholder(name).nth(index), value);
  }
};
