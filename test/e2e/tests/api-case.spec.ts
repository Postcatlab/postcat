import { test } from '@playwright/test';

import { clickButtonByIconName, ifTipsExist, operateGroup, seletGroup } from '../utils/commom.util';
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Got it' }).click();
});

test('Basic Operate', async ({ page }) => {
  //Select API
  await page.locator('eo-ng-tree-default-node').filter({ hasText: 'pet' }).getByRole('emphasis').locator('svg').click();
  //Directly Add Case
  await operateGroup(page, 'Update an existing pet', 'Add Case');
  await ifTipsExist(page, 'Created Case successfully');
  //Change CaseName
  const NewName = 'Test Case';
  await page.locator('input[name="required"]').fill(NewName);
  await page.locator('form').first().click();
  await ifTipsExist(page, 'Edited Case Name successfully');
  //Edit Case
  await page.getByPlaceholder('Enter URL or Curl text').fill('/pet1');
  await page.getByText('REST').click();
  await page.getByText('Query').click();
  await page.getByText('Headers').click();
  await page.getByText('Authorization').click();
  await page.getByRole('button', { name: 'Save' }).click();
  await ifTipsExist(page, 'Edited Case successfully');
  //Delete Case
  await operateGroup(page, NewName, 'Delete');
  await page.getByRole('button', { name: 'OK' }).click();
  await ifTipsExist(page, 'Successfully deleted');
});

test('Add Test From API Test', async ({ page }) => {
  //Select API
  await page.locator('eo-ng-tree-default-node').filter({ hasText: 'pet' }).getByRole('emphasis').locator('svg').click();
  await page.getByText('Update an existing pet').click();
  await page.getByRole('link', { name: 'Test' }).click();
  await page.getByRole('button', { name: 'Save as Case' }).click();
  await ifTipsExist(page, 'Created Case successfully');
  //Change CaseName
  const NewName = 'Test Case';
  await page.locator('input[name="required"]').fill(NewName);
  await page.locator('form').first().click();
  await ifTipsExist(page, 'Edited Case Name successfully');
  //Edit Case
  await page.getByPlaceholder('Enter URL or Curl text').fill('/pet1');
  await page.getByText('REST').click();
  await page.getByText('Query').click();
  await page.getByText('Headers').click();
  await page.getByText('Authorization').click();
  await page.getByRole('button', { name: 'Save' }).click();
  await ifTipsExist(page, 'Edited Case successfully');
  //Delete Case
  await clickButtonByIconName(page, 'delete');
  await ifTipsExist(page, 'Successfully deleted');
});
