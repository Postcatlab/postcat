import { test, expect } from '@playwright/test';

import { addTextToEditor, ifTipsExist } from './commom.util';
const addParams = async (dom, value) => {
  await dom.click();
  await dom.fill(value);
};

const addRow = async (page, opts: { index: number; where: string; valueByKey: { [key: string]: string } }) => {
  const index = opts.index;
  for (const name in opts.valueByKey) {
    const value = opts.valueByKey[name];
    await addParams(page.getByPlaceholder(name).nth(index), value);
  }
};
const addRowAndSettingMore = async (page, opts) => {
  await addRow(page, opts);

  const index = opts.index;
  //More settings
  await page.locator('.eo-table-btn-td').nth(index).locator('use[href="#more"]').click();
  await addRow(page, {
    index: 0,
    where: opts.where,
    valueByKey: {
      enum: `${opts.where}Enum`
    }
  });
  await addParams(
    page.getByRole('row', { name: 'enum Description', exact: true }).first().getByPlaceholder('Description'),
    `${opts.where}EnumDescription`
  );
  await addTextToEditor(page, 'example');
  await page.getByRole('button', { name: 'Confirm' }).click();
};
test.describe('Operate API', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  //Default save json
  test('Basic Operate', async ({ page }) => {
    await page.getByRole('banner').getByRole('button').click();
    //Url
    await page.locator('input[name="uri"]').fill('/?json');
    await page.locator('input[name="name"]').click();
    await page.locator('input[name="name"]').fill('JSON');

    //Header
    await page.getByText('Request Headers').click();
    await page.getByPlaceholder('Key').click();
    //auto complete
    await page.getByText('Access-Control-Request-Method').click();
    await page.getByPlaceholder('Description').first().click();
    await page.getByPlaceholder('Description').first().fill('1');
    //Add twice
    await addRowAndSettingMore(page, {
      index: 1,
      where: 'header',
      valueByKey: {
        Key: 'header',
        Description: 'headerDescription',
        Example: 'headerExample'
      }
    });
    //Body

    //Save API
    await page.getByRole('button', { name: 'Save' }).click();
    await ifTipsExist(page, 'Added successfully');
    //Asset API at detail
    //Edit API
    //Delete API
  });
  test('Check Param Operate', async ({ page }) => {
    //Header
    //Query
    //REST
    //JSON Body
    //Response Headers
    //Response
    //Save API
    //Repeated Opeate
    //Asset detail check api data
  });
  test('Diff Content-Type', async ({ page }) => {
    //Form-data
    await page.getByRole('banner').getByRole('button').click();
    await page.locator('input[name="uri"]').fill('/?formdata');
    await page.locator('input[name="name"]').click();
    await page.locator('input[name="name"]').fill('FormData');
    await page.getByText('Form-Data').click();
    await page.locator('#cdk-drop-list-10').getByPlaceholder('Name').click();
    await page.locator('#cdk-drop-list-10').getByPlaceholder('Name').fill('name');
    await page.getByPlaceholder('Example').first().click();
    await page.getByPlaceholder('Example').first().fill('value');
    await page.getByPlaceholder('Description').first().click();
    await page.getByPlaceholder('Description').first().fill('description');
    //Save API
    await page.locator('input[name="uri"]').press('Meta+s');
    await ifTipsExist(page, 'Added successfully');

    //XML
    //Raw

    //Edit JSON API
    // await page.getByRole('banner').getByRole('button').click();
    // await page.locator('input[name="uri"]').fill('/?json');
    // await page.locator('input[name="name"]').click();
    // await page.locator('input[name="name"]').fill('JSON');
    // await page.getByText('JSON').click();
    // await page.getByRole('button', { name: 'Save' }).click();
    // await ifTipsExist(page, 'Added successfully');
  });
  test('Import Data', async ({ page }) => {
    //JSON
    //Header
    //Query
    //Form-data
    //XML
  });
});
