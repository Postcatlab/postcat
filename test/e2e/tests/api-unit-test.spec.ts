import { test, expect, chromium } from '@playwright/test';

import { adaTabledRow, addEnv, addTextToEditor, ECHO_API_URL, ifTipsExist } from '../utils/commom.util';
const testAndWaitForResponse = async page => {
  const responsePromise = page.waitForResponse('**/api/unit');
  await page.getByRole('button', { name: 'Send' }).click();
  const request = await responsePromise;
  const res = await request.json();
  const result = JSON.parse(res.data.report.response.body);
  return result;
};
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Got it' }).click();
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
  await adaTabledRow(page, {
    valueByKey: {
      Value: 'all'
    }
  });

  //Asset test result
  const res = await testAndWaitForResponse(page);
  expect(res.path).toEqual('/Web/Test/all/print');
  expect(res.method).toEqual('POST');
  expect(res.query.query[0]).toEqual('queryvalue');
  expect(res.header.Header[0]).toEqual('headervalue');

  //Restore api test from history
  await page.locator('.ant-tabs-nav-list > div:nth-child(2)').first().click();
  await page.getByTitle('---').getByText(ECHO_API_URL).click({ timeout: 500 });

  //Save API from test
  await page.getByRole('button', { name: 'Save as API' }).click();
  await page.locator('input[name="name"]').click();
  await page.locator('input[name="name"]').fill('test');
  await page.getByRole('button', { name: 'Save' }).click();
  await ifTipsExist(page, 'Added successfully');

  //API Document Test
  await page.getByRole('link', { name: 'Test' }).click();
  await page.getByRole('button', { name: 'Send' }).click();
});
/**
 * Basic Test
 */
test('Import Data Unit Test', async ({ page }) => {
  await page.getByPlaceholder('Enter URL').click();
  await page.getByPlaceholder('Enter URL').fill(ECHO_API_URL);
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

/**
 * Formdata Test
 */
test('Formdata Test', async ({ page }) => {
  await page.getByPlaceholder('Enter URL').click();
  await page.getByPlaceholder('Enter URL').fill(ECHO_API_URL);
  await page.getByText('Form-Data').click();

  await adaTabledRow(page, {
    enums: [
      {
        Name: 'test',
        Value: '1'
      },
      {
        Name: 'test',
        Value: '2'
      }
    ]
  });
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
  await page.getByText('Text').click();
  await page.getByText('XML').click();
  await addTextToEditor(page, `{"test":1,"test1":2}`);
  const res = await testAndWaitForResponse(page);
  expect(res.body).toEqual(`{"test":1,"test1":2}`);

  //restore from history
  await page.locator('.ant-tabs-nav-list > div:nth-child(2)').first().click();
  await page.getByTitle('---').getByText(ECHO_API_URL).click({ timeout: 500 });
  const res1 = await testAndWaitForResponse(page);
  expect(res1.body).toEqual(`{"test":1,"test1":2}`);
});

/**
 * Global Varibale Test
 */
test('Global Variable Test', async ({ page }) => {
  //Env Globals
  await addEnv(page);

  await page.getByPlaceholder('Enter URL').click();
  await page.getByPlaceholder('Enter URL').fill('/Web/Test/all/{{pathVariable}}');
  //JSON Body
  await addTextToEditor(page, `{"{{globalName}}":"{{globalName}}"}`);
  //Header
  await page.getByText('Headers').click();
  //First row is content-type
  await adaTabledRow(page, {
    index: 1,
    valueByKey: {
      Name: '{{globalName}}',
      Value: '{{globalName}}'
    }
  });

  //Query
  await page.getByText('Query').click();
  await adaTabledRow(page, {
    index: 0,
    valueByKey: {
      Name: '{{globalName}}',
      Value: '{{globalName}}'
    }
  });
  const res = await testAndWaitForResponse(page);
  expect(res.path).toEqual('/Web/Test/all/print');
  expect(res.body).toEqual(`{"globalVariable":"globalVariable"}`);
  expect(res.query.globalVariable[0]).toEqual('globalVariable');
  expect(res.header.Globalvariable[0]).toEqual('globalVariable');

  //Script Globals
  await page.getByText('Script Action').click();
  await addTextToEditor(page, `pc.globals.set("scriptVariable","scriptVariable");`);
  await page.getByText('Body').first().click();
  await addTextToEditor(page, `{"{{globalName}}":"{{globalName}}","{{scriptVariable}}":"{{scriptVariable}}"}`);
  const res1 = await testAndWaitForResponse(page);
  expect(res1.body).toEqual(`{"globalVariable":"globalVariable","scriptVariable":"scriptVariable"}`);

  //Form-data
  await page.getByText('Form-Data').click();
  await adaTabledRow(page, {
    index: 0,
    valueByKey: {
      Name: '{{globalName}}',
      Value: '{{globalName}}'
    }
  });
  const res2 = await testAndWaitForResponse(page);
  expect(res2.body).toEqual(`globalVariable=globalVariable`);
});

test('Import Curl Test', async ({ page }) => {
  await page.getByPlaceholder('Enter URL').click();
  //Form-Data application/x-www-form-urlencoded
  await page.getByPlaceholder('Enter URL').fill(`curl 'http://demo.gokuapi.com:8280/Web/Test/all/print?query=query' \
  -H 'Accept: */*' \
  -H 'Accept-Language: en,zh-CN;q=0.9,zh;q=0.8' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Cookie: uid=1' \
  -H 'Eo-Token: 85f3cfbb-e185-48d9-8dc0-f5da86177329' \
  -H 'Origin: chrome-extension://plecpgbpgkbmgigendedfaahcajeaimi' \
  -H 'Proxy-Connection: keep-alive' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36' \
  -H 'header: header' \
  --data-raw 'form=value&form2=value' \
  --compressed \
  --insecure`);
  const res = await testAndWaitForResponse(page);
  expect(res.body).toEqual(`form=value&form2=value`);
  expect(res.query.query[0]).toEqual('query');
  expect(res.header.Header[0]).toEqual('header');

  //Form-Dara
  // await page.getByPlaceholder('Enter URL').click();
  // await page.getByPlaceholder('Enter URL').fill(`curl 'http://demo.gokuapi.com:8280/Web/Test/all/print?query=query' \
  // -H 'Accept: */*' \
  // -H 'Accept-Language: en,zh-CN;q=0.9,zh;q=0.8' \
  // -H 'Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryVBz1dMCpoC5JE3xx' \
  // -H 'Cookie: uid=1' \
  // -H 'Eo-Token: 5815ecc4-20ab-40ba-a943-f5e7c3624274' \
  // -H 'Origin: chrome-extension://plecpgbpgkbmgigendedfaahcajeaimi' \
  // -H 'Proxy-Connection: keep-alive' \
  // -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36' \
  // -H 'header: header' \
  // --data-raw $'------WebKitFormBoundaryVBz1dMCpoC5JE3xx\r\nContent-Disposition: form-data; name="form"\r\n\r\nvalue\r\n------WebKitFormBoundaryVBz1dMCpoC5JE3xx\r\nContent-Disposition: form-data; name="file"; filename="latest.yml"\r\nContent-Type: application/x-yaml\r\n\r\nversion: 0.5.0\nfiles:\n  - url: Postcat-Setup-0.5.0.exe\n    sha512: Hu07AiOfO9xGuddFfvP9BItyWjylYi5Kc2BLbGTj22P4damBk8oR+2yacaW4t/M0fMdHnmyXMXGRYLN/u6PhAQ==\n    size: 90365912\npath: Postcat-Setup-0.5.0.exe\nsha512: Hu07AiOfO9xGuddFfvP9BItyWjylYi5Kc2BLbGTj22P4damBk8oR+2yacaW4t/M0fMdHnmyXMXGRYLN/u6PhAQ==\nreleaseDate: \'2023-04-04T12:03:57.000Z\'\n\r\n------WebKitFormBoundaryVBz1dMCpoC5JE3xx--\r\n' \
  // --compressed \
  // --insecure`);
  // const res1 = await testAndWaitForResponse(page);
  // expect(res1.body).toEqual(`form=value&f1orm2=value`);
});
