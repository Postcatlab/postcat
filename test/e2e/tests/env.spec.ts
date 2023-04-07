import { test, expect } from '@playwright/test';

import { adaTabledRow, addEnv, ECHO_API_URL, ifTipsExist } from '../utils/commom.util';
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Got it' }).click();
  await addEnv(page, {
    name: 'DEV'
  });
});
test('Env Basic', async ({ page }) => {
  //Add first env will choose it
  await page.locator('nz-tree-node-title div').first().click();

  //Edit env
  await page.getByLabel('Name').press('Meta+s');
  await ifTipsExist(page, 'Edited successfully');

  //Delete env
  await page.locator('nz-tree-node-title div').first().hover();
  await page.locator('nz-tree-node-title').getByRole('button').click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await ifTipsExist(page, 'Successfully deleted');
});
// test('Preview Env', async ({ page }) => {
//   //Host uri
//   //Global variable
//   //Change env will change host uri
// });
