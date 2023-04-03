import { test, expect } from '@playwright/test';

import { ifTipsExist, operateGroup, seletGroup } from '../utils/commom.util';
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Got it' }).click();
  //Add group
  await page.getByRole('banner').getByRole('button').hover();
  await page.locator('a').filter({ hasText: 'New Group' }).click();

  await page.getByPlaceholder('Group Name').fill('Parent Group');
  await page.getByPlaceholder('Group Name').press('Enter');

  //Add sub group
  const subGroupName = 'Sub Group';
  await operateGroup(page, 'Parent Group', 'Add Subgroup');
  await page.getByPlaceholder('Group Name').fill(subGroupName);
  await page.getByPlaceholder('Group Name').press('Enter');

  //Close group tab
  await page.getByRole('tab').getByText(subGroupName).hover();
  await page.getByRole('button', { name: 'Close tab' }).click();
});

test('Basic Operate', async ({ page }) => {
  //Edit group
  await operateGroup(page, 'Sub Group', 'Edit');
  await page.locator('nz-form-control').filter({ hasText: 'Sub Group' }).getByRole('button').click();
  await page.getByPlaceholder('Group Name').fill('Sub Group after');
  await page.getByPlaceholder('Group Name').press('Enter');

  //Delete group
  await operateGroup(page, 'Sub Group', 'Delete');
  await page.getByRole('button', { name: 'Ok' }).click();
  await ifTipsExist(page, 'Successfully deleted');
});
test('Search', async ({ page }) => {
  //Search Group
  await page.getByPlaceholder('Search').click();
  await page.getByPlaceholder('Search').fill('Sub');
  await page.getByTitle('Sub Group').click();

  //Search API by Name
  await page.getByPlaceholder('Search').click();
  await page.getByPlaceholder('Search').fill('pet');
  await page.isVisible('Updates a pet in the store with form data');

  //Search API by URL
  await page.getByPlaceholder('Search').click();
  await page.getByPlaceholder('Search').fill('{petID}');
  await page.isVisible('Find pet by ID');
});
// test('Sort Group', async ({ page }) => {});

// test('API State Synchronization', async ({ page }) => {
//   //Add API
//   //Check Group has expand
//   //Change API Group
//   //Check group move to other group
//   //Close API
//   //Check group unselect this group
// });
