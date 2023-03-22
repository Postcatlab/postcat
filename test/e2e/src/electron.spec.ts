import { expect, test } from '@playwright/test';
import { ElectronApplication, Page, _electron as electron } from 'playwright';

import { ECHO_API_URL, ifTipsExist, waitForResponse } from './commom.util';

let electronApp: ElectronApplication;

test.beforeAll(async () => {
  // set the CI environment variable to true
  process.env.CI = 'e2e';
  electronApp = await electron.launch({
    args: ['../../../out/app/electron-main/main.js']
  });
  electronApp.on('window', async page => {
    const filename = page.url()?.split('/').pop();
    console.log(`Window opened: ${filename}`);

    // capture errors
    page.on('pageerror', error => {
      console.error(error);
    });
    // capture console messages
    page.on('console', msg => {
      console.log(msg.text());
    });
  });
});

test.afterAll(async () => {
  await electronApp.close();
});

let page: Page;

/**
 * Basic Test
 */
test('Unit Test', async ({}) => {
  page = await electronApp.firstWindow();
  await page.getByPlaceholder('Enter URL').click();
  await page.getByPlaceholder('Enter URL').fill('http://demo.gokuapi.com:8280/Web/Test/{rest}/print');
  //Header
  await page.getByText('Headers').click();
  await page.getByPlaceholder('Name').nth(1).click();
  await page.getByPlaceholder('Name').nth(1).fill('header');
  await page.getByPlaceholder('Value').nth(1).click();
  await page.getByPlaceholder('Value').nth(1).fill('headervalue');
  //Query
  await page.getByText('Query').click();
  await page.getByPlaceholder('Name').click();
  await page.getByPlaceholder('Name').fill('query');
  await page.getByPlaceholder('Value').first().click();
  await page.getByPlaceholder('Value').first().fill('queryvalue');

  //Rest will auto generate from url when url input:blur
  await page.getByText('REST', { exact: true }).click();
  await page.getByPlaceholder('Value').first().click();
  await page.getByPlaceholder('Value').first().fill('all');

  //Asset test result
  const res = await waitForResponse(page);
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
});
