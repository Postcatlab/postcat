import { test, expect } from '@playwright/test';
const clickGroupBtn = async (page, name) => {
  await page.locator('nz-tree-node-title').filter({ hasText: name }).locator('div').nth(1).hover();
  await page.locator('nz-tree-node-title').filter({ hasText: name }).hover();
  await page.locator('nz-tree-node-title').filter({ hasText: name }).getByRole('button').click();
};
test.describe('Group Operate', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    //Add group
    await page.getByRole('banner').getByRole('button').hover();
    await page.locator('a').filter({ hasText: 'New Group' }).click();
    await page.getByPlaceholder('Group Name').fill('Parent Group');
    await page.getByPlaceholder('Group Name').press('Enter');
    await page.locator('eo-ng-tree-default').getByText('Parent Group').click();

    //Add sub group
    await clickGroupBtn(page, 'Parent Group');
    await page.getByText('Add Subgroup').click();
    await page.getByPlaceholder('Group Name').fill('Sub Group');
    //random click to save
    await page.locator('div').filter({ hasText: 'Authorization' }).first().click();
    await page.locator('eo-ng-tree-default').getByText('Sub Group').click();
    await page.getByRole('tab', { name: 'Sub Group Close tab' }).getByText('Sub Group').hover();
    await page.getByRole('button', { name: 'Close tab' }).click();
  });

  test('Basic Operate', async ({ page }) => {
    //Edit group
    await clickGroupBtn(page, 'Sub Group');
    await page.locator('nz-tree-node-title').getByText('Edit').first().click();
    await page.getByLabel('Group Name').fill('Sub Group after');
    await page.getByRole('button', { name: 'Confirm' }).click();

    //Delete group
    await clickGroupBtn(page, 'Sub Group after');
    await page.getByText('Delete').click();
    await page.getByRole('button', { name: 'Confirm' }).click();
  });
  test('Search', async ({ page }) => {
    //Search Group
    await page.getByPlaceholder('Search').click();
    await page.getByPlaceholder('Search').fill('Sub');
    await page.getByTitle('Sub Group').click();

    //Search API by Name
    await page.getByPlaceholder('Search').click();
    await page.getByPlaceholder('Search').fill('we');
    await page.getByText('Get City Weather Today').click({ timeout: 100 });

    //Search API by URL
    await page.getByPlaceholder('Search').click();
    await page.getByPlaceholder('Search').fill('inews');
    await page.locator('eo-ng-tree-default').getByText('COVID-19 national epidemic').click();
  });
  // test('Sort Group', async ({ page }) => {});

  test('State Synchronization', async ({ page }) => {
    //Add API
    //Change API Group
  });
});
