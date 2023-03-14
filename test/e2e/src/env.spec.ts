import { test, expect } from '@playwright/test';

import { ECHO_API_URL, ifTipsExist } from './commom.util';
test.describe('Env Operate', () => {
  const url = new URL(ECHO_API_URL);
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    //Add env
    await page.locator('a').filter({ hasText: 'Environment' }).click();
    await page.getByRole('banner').getByRole('button').click();
    await page.getByLabel('Name').fill('DEV');
    await page.getByLabel('Host').click({ timeout: 1000 });
    await page.getByLabel('Host').fill(url.host);
    await page.getByPlaceholder('Name').click({ timeout: 1000 });
    await page.getByPlaceholder('Name').fill('globalName');
    await page.getByPlaceholder('Value').first().dblclick();
    await page.getByPlaceholder('Value').first().fill('globalVariable');
    await page.getByPlaceholder('Description').first().click();
    await page.getByPlaceholder('Description').first().fill('globalDescription');
    await page.getByRole('button', { name: 'Save' }).click();
    await ifTipsExist(page, 'Added successfully');
  });
  test('Env Basic', async ({ page }) => {
    //Add first env will choose it

    //Edit env
    await page.locator('body').press('Meta+c');
    await page.getByRole('button', { name: 'Close tab' }).click();
    await page.locator('div').filter({ hasText: 'DEV' }).nth(2).click();
    await page.getByLabel('Name').press('Meta+s');
    await ifTipsExist(page, 'Edited successfully');

    //Delete env
  });
  // test('Use Env', async ({ page }) => {
  //   //Host uri
  //   //Global variable
  //   //Change env will change host uri
  // });
});
