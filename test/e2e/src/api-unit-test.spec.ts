import { test, expect } from '@playwright/test';

import { adaTabledRow, addTextToEditor, ECHO_API_URL, ifTipsExist } from './commom.util';
const testAndWaitForResponse = async page => {
  const responsePromise = page.waitForResponse('**/api/unit');
  await page.getByRole('button', { name: 'Send' }).click();
  const request = await responsePromise;
  const res = await request.json();
  const result = JSON.parse(res.data.report.response.body);
  return result;
};
test.describe('Test API', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  /**
   * Basic Test
   */
  test('Unit Test', async ({ page }) => {
    await page.getByPlaceholder('Enter URL').click();
    await page.getByPlaceholder('Enter URL').fill('http://demo.gokuapi.com:8280/Web/Test/{rest}/print');
    //Header
    await page.getByText('Headers').click();
    //First row is content-type
    await adaTabledRow(page, {
      index: 1,
      valueByKey: {
        Name: 'header',
        Value: 'headervalue'
      }
    });

    //Query
    await page.getByText('Query').click();
    await adaTabledRow(page, {
      index: 0,
      valueByKey: {
        Name: 'query',
        Value: 'queryvalue'
      }
    });

    //Rest will auto generate from url when url input:blur
    await page.getByText('REST', { exact: true }).click();
    await page.getByPlaceholder('Value').first().click();
    await page.getByPlaceholder('Value').first().fill('all');

    //Asset test result
    const res = await testAndWaitForResponse(page);
    expect(res.path).toEqual('/Web/Test/all/print');
    expect(res.method).toEqual('POST');
    expect(res.query.query[0]).toEqual('queryvalue');
    expect(res.header.Header[0]).toEqual('headervalue');

    //Restore api test from history
    await page.locator('.ant-tabs-nav-list > div:nth-child(2)').first().click();
    await page.getByTitle('---').getByText(ECHO_API_URL).click({ timeout: 500 });
    const reRes = await testAndWaitForResponse(page);
    expect(reRes.path).toEqual('/Web/Test/all/print');
    expect(reRes.method).toEqual('POST');
    expect(reRes.query.query[0]).toEqual('queryvalue');
    expect(reRes.header.Header[0]).toEqual('headervalue');

    //Save API from test
    await page.getByRole('button', { name: 'Save as API' }).click();
    await page.locator('input[name="name"]').click();
    await page.locator('input[name="name"]').fill('test');
    await page.getByRole('button', { name: 'Save' }).click();
    await ifTipsExist(page, 'Added successfully');
  });
  /**
   * Basic Test
   */
  test('Import Data Unit Test', async ({ page }) => {
    await page.getByPlaceholder('Enter URL').click();
    await page.getByPlaceholder('Enter URL').fill('http://demo.gokuapi.com:8280/Web/Test/all/print');
    //Header
    await page.getByText('Headers').click();
    await adaTabledRow(page, {
      index: 0,
      valueByKey: {
        Name: 'header',
        Value: 'headervalue'
      }
    });
    //Import Header
    await page.getByRole('button', { name: 'Import' }).click();
    await addTextToEditor(page, 'headerName:headerValue\nheaderName2:headerValue2');
    await page.getByRole('button', { name: 'Replace Changed' }).click();

    //Import Query
    await page.getByText('Query').click();
    await page.getByRole('button', { name: 'Import' }).click();
    await addTextToEditor(page, '/api?name=Jack&age=18');
    await page.getByRole('button', { name: 'Replace Changed' }).click();

    //Body
    await page.getByText('Body').click();
    await page.getByText('Form-Data').click();
    await page.getByRole('button', { name: 'Import' }).click();
    await addTextToEditor(page, 'name: Jack\nage: 18');
    await page.getByRole('button', { name: 'Replace Changed' }).click();

    //Asset test result
    const res = await testAndWaitForResponse(page);
    expect(res.body).toEqual('name=Jack\u0026age=18');

    expect(res.query.age[0]).toEqual('18');
    expect(res.query.age[0]).toEqual('18');

    expect(res.header.Header[0]).toEqual('headervalue');
    expect(res.header.Headername[0]).toEqual('headerValue');
    expect(res.header.Headername2[0]).toEqual('headerValue2');

    expect(res.query.name[0]).toEqual('Jack');
    expect(res.header.Header[0]).toEqual('headervalue');
  });
  test('API Document Test', async ({ page }) => {
    await page.getByText('COVID-19 national epidemic').click();
    await page.getByRole('link', { name: 'Test' }).click();
    await page.getByRole('button', { name: 'Send' }).click();
  });
  /**
   * XML
   */
  test('Formdata Test', async ({ page }) => {
    await page.getByPlaceholder('Enter URL').click();
    await page.getByPlaceholder('Enter URL').fill(ECHO_API_URL);
    await page.getByText('Form-Data').click();
    await page.getByPlaceholder('Name').click();
    await page.getByPlaceholder('Name').fill('test');
    await page.locator('.eo-table-default-td > div > .ant-input').first().click();
    await page.locator('.eo-table-default-td > div > .ant-input').first().fill('1');
    await page.getByPlaceholder('Name').nth(1).fill('test');
    await page.getByPlaceholder('Name').nth(1).click();
    await page.locator('.eo-table-default-td > div > .ant-input').nth(1).click();
    await page.locator('.eo-table-default-td > div > .ant-input').nth(1).fill('2');
    const res = await testAndWaitForResponse(page);
    expect(res.body).toEqual('test=1&test=2');

    //restore from history
    await page.locator('.ant-tabs-nav-list > div:nth-child(2)').first().click();
    await page.getByTitle('---').getByText(ECHO_API_URL).click({ timeout: 500 });
    const res1 = await testAndWaitForResponse(page);
    expect(res1.body).toEqual('test=1&test=2');
  });

  /**
   * Raw Test
   */
  test('Raw Test', async ({ page }) => {
    await page.getByPlaceholder('Enter URL').click();
    await page.getByPlaceholder('Enter URL').fill(ECHO_API_URL);
    //!Change to XML prevent JSON/Raw monaco editor autocompletel value
    await page.getByText('JSON').click();
    await page.getByText('XML').click();
    await addTextToEditor(page, `{"test":1,"test1":2}`);
    const res = await testAndWaitForResponse(page);
    expect(res.body).toEqual(`{"test":1,"test1":2}`);

    //restore from history
    await page.locator('.ant-tabs-nav-list > div:nth-child(2)').first().click();
    await page.getByTitle('---').getByText(ECHO_API_URL).click({ timeout: 500 });
    const res1 = await testAndWaitForResponse(page);
    expect(res.body).toEqual(`{"test":1,"test1":2}`);
  });
});
