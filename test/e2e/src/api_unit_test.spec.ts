import { test, expect } from '@playwright/test';

import { addTextToEditor } from './commom.util';
test.describe('Test API', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
    //Add API
  });
  /**
   * Basic
   */
  test('Basic Test', async ({ page }) => {
    await page.getByText('COVID-19 national epidemic').click();
    await page.getByRole('link', { name: 'Test' }).click();
    await page.screenshot({ path: '../images/unit-test-basic.png', fullPage: true });
  });
  /**
   * XML
   */
  test('Formdata Test', async ({ page }) => {
    await page.getByPlaceholder('Enter URL').click();
    await page.getByPlaceholder('Enter URL').fill('http://demo.gokuapi.com:8280/Web/Test/all/print');
    await page.getByText('Form-Data').click();
    await page.getByPlaceholder('Name').click();
    await page.getByPlaceholder('Name').fill('test');
    await page.locator('.eo-table-default-td > div > .ant-input').first().click();
    await page.locator('.eo-table-default-td > div > .ant-input').first().fill('1');
    await page.getByPlaceholder('Name').nth(1).fill('test');
    await page.getByPlaceholder('Name').nth(1).click();
    await page.locator('.eo-table-default-td > div > .ant-input').nth(1).click();
    await page.locator('.eo-table-default-td > div > .ant-input').nth(1).fill('2');
    const responsePromise = page.waitForResponse('**/api/unit');
    await page.getByRole('button', { name: 'Send' }).click();
    const request = await responsePromise;
    const res = await request.json();
    const httpResult = JSON.parse(res.data.report.response.body);
    expect(httpResult.body).toEqual('test=1&test=2');
  });

  /**
   * Raw Test
   */
  test('Raw Test', async ({ page }) => {
    await page.getByPlaceholder('Enter URL').click();
    await page.getByPlaceholder('Enter URL').fill('http://demo.gokuapi.com:8280/Web/Test/all/print');
    //!Change to XML prevent JSON/Raw monaco editor autocompletel value
    await page.getByText('JSON').click();
    await page.getByText('XML').click();
    const monacoEditor = page.locator('.monaco-editor').nth(0);
    await addTextToEditor(page, monacoEditor, `{"test":1,"test1":2}`);
    const responsePromise = page.waitForResponse('**/api/unit');
    await page.getByRole('button', { name: 'Send' }).click();
    const request = await responsePromise;
    const res = await request.json();
    const httpResult = JSON.parse(res.data.report.response.body);
    expect(httpResult.body).toEqual(`{"test":1,"test1":2}`);
  });
});
