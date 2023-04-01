import { test, expect } from '@playwright/test';

import { adaTabledRow, addTableParams, addTextToEditor, ifTipsExist } from '../utils/commom.util';

const addRowAndSettingMore = async (page, opts) => {
  await adaTabledRow(page, opts);

  const index = opts.index;
  //More settings
  await page.locator('.eo-table-btn-td').nth(index).locator('use[href="#more"]').click();
  await adaTabledRow(page, {
    index: 0,
    valueByKey: {
      enum: `${opts.id}Enum`
    }
  });
  await addTableParams(
    page.getByRole('row', { name: 'enum Description', exact: true }).first().getByPlaceholder('Description'),
    `${opts.id}EnumDescription`
  );
  await addTextToEditor(page, 'example');
  await page.getByRole('button', { name: 'Confirm' }).click();
};

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Got it' }).click();
  //?Wait for group to load
  await page.waitForTimeout(1000);
});

test('Basic Operate', async ({ page }) => {
  const name = 'JSON API';
  await page.getByRole('banner').getByRole('button').click();
  // //Url
  await page.locator('input[name="uri"]').fill('/?json');
  // //Name
  await page.locator('input[name="name"]').click();
  await page.locator('input[name="name"]').fill(name);
  //* Group
  await page.locator('eo-ng-tree-select div').click();
  await page.locator('eo-ng-tree-default-node').filter({ hasText: 'Root Group' }).locator('nz-tree-node-switcher').click();
  await page.locator('eo-ng-tree-default-node').getByText('pet').nth(1).click();

  //* Save API
  await page.getByRole('button', { name: 'Save' }).click();

  await ifTipsExist(page, 'Added successfully');
  //Check group folder is open
  await page.locator('.ant-tree-switcher_open').click();
  //Asset API at detail
  //Edit API
  await page.getByRole('link', { name: 'Edit' }).click();
  await page.locator('.ant-checkbox-input').nth(1).click();
  await page.keyboard.press('Meta+s');
  await ifTipsExist(page, 'Edited API successfully');
  //Delete API
  await page.locator('eo-ng-tree-default').getByText(name).hover();
  await page.getByTitle(name).getByRole('button').click();
  await page.getByText('Delete', { exact: true }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await ifTipsExist(page, 'Successfully deleted');
});

test('Check All Param Operate', async ({ page }) => {
  await page.getByRole('banner').getByRole('button').click();
  // //Url
  await page.locator('input[name="uri"]').fill('/?json');
  // //Name
  await page.locator('input[name="name"]').click();
  await page.locator('input[name="name"]').fill('JSON');
  //?example descript isRequire addChild delete
  //* Header
  await page.getByText('Request Headers').click();
  await page.getByPlaceholder('Key').click();
  //auto complete
  await page.getByText('Access-Control-Request-Method').click();
  await page.getByPlaceholder('Description').first().click();
  await page.getByPlaceholder('Description').first().fill('1');
  //Add twice
  await addRowAndSettingMore(page, {
    index: 1,
    id: 'header',
    valueByKey: {
      Key: 'header',
      Description: 'headerDescription',
      Example: 'headerExample'
    }
  });
  //Import
  await page.locator('eo-api-edit-form').getByRole('button', { name: 'Import' }).click();
  await addTextToEditor(page, 'headerName:headerValue\nheaderName2:headerValue2');
  await page.getByRole('button', { name: 'Replace Changed' }).click();

  //* Body,Default save json
  // Import;
  await page.getByText('Body').click();
  await page.locator('eo-api-edit-body').getByRole('button', { name: 'Import' }).first().click();
  await addTextToEditor(
    page,
    '{"string":"","array":[{"dom1":{},"dom2":false,"dom3":[]}],"object":{"dom1":"","dom2":0},"null":null,"float":11.11,"int":1,"boolean":false,"dataStructure":{"child":""}}'
  );
  await page.getByRole('button', { name: 'Replace Changed' }).click();

  //* Query
  await page.getByText('Query').click();
  await page.locator('eo-api-edit-form').getByRole('button', { name: 'Import' }).click();
  await addTextToEditor(page, '/api?name=Jack&age=18');
  await page.getByRole('button', { name: 'Replace Changed' }).click();

  //* Response Header
  await page.getByText('Response Headers').click();
  await page.getByPlaceholder('Key').click();
  //auto complete
  await page.getByText('Access-Control-Request-Method').click();
  await page.getByRole('row', { name: 'Key Description Example' }).getByPlaceholder('Description').first().click();
  await page.getByRole('row', { name: 'Key Description Example' }).getByPlaceholder('Description').first().fill('1');
  //Import
  await page.locator('eo-api-edit-form').getByRole('button', { name: 'Import' }).nth(1).click();
  await addTextToEditor(page, 'headerName:headerValue\nheaderName2:headerValue2');
  await page.getByRole('button', { name: 'Replace Changed' }).click();

  //* Response Body
  await page.getByRole('tab', { name: 'Response', exact: true }).getByText('Response').click();
  await page.locator('eo-api-edit-body').getByRole('button', { name: 'Import' }).first().click();
  await addTextToEditor(
    page,
    '{"string":"","array":[{"dom1":{},"dom2":false,"dom3":[]}],"object":{"dom1":"","dom2":0},"null":null,"float":11.11,"int":1,"boolean":false,"dataStructure":{"child":""}}'
  );
  await page.getByRole('button', { name: 'Replace Changed' }).click();

  //Save API
  await page.getByRole('button', { name: 'Save' }).click();
  await ifTipsExist(page, 'Added successfully');
  //Asset detail check api data
});

test('Save Form Data  API', async ({ page }) => {
  //* Form-data
  await page.getByRole('banner').getByRole('button').click();
  await page.locator('input[name="uri"]').fill('/?formdata');
  await page.locator('input[name="name"]').click();
  await page.locator('input[name="name"]').fill('FormData');

  await page.getByText('Form-Data').click();
  await addRowAndSettingMore(page, {
    index: 1,
    id: 'body',
    valueByKey: {
      Name: 'name',
      Description: 'description',
      Example: 'value'
    }
  });
  //Import

  //Save API
  await page.locator('input[name="uri"]').press('Meta+s');
  await ifTipsExist(page, 'Added successfully');

  //XML
  //Raw
});

test('Save XML API', async ({ page }) => {
  //* Form-data
  await page.getByRole('banner').getByRole('button').click();
  await page.locator('input[name="uri"]').fill('/?formdata');
  await page.locator('input[name="name"]').click();
  await page.locator('input[name="name"]').fill('FormData');

  await page.getByText('Form-Data').click();
  await addRowAndSettingMore(page, {
    index: 1,
    id: 'body',
    valueByKey: {
      Name: 'name',
      Description: 'description',
      Example: 'value'
    }
  });
  //Import

  //Save API
  await page.locator('input[name="uri"]').press('Meta+s');
  await ifTipsExist(page, 'Added successfully');

  //XML
  //Raw
});

test('Save Raw API', async ({ page }) => {
  //* Form-data
  await page.getByRole('banner').getByRole('button').click();
  await page.locator('input[name="uri"]').fill('/?formdata');
  await page.locator('input[name="name"]').click();
  await page.locator('input[name="name"]').fill('FormData');

  await page.getByText('Form-Data').click();
  await addRowAndSettingMore(page, {
    index: 1,
    id: 'body',
    valueByKey: {
      Name: 'name',
      Description: 'description',
      Example: 'value'
    }
  });
  //Import

  //Save API
  await page.locator('input[name="uri"]').press('Meta+s');
  await ifTipsExist(page, 'Added successfully');

  //XML
  //Raw
});
