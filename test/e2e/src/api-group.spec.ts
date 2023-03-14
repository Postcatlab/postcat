import { test, expect } from '@playwright/test';
test.describe('Group Operate', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    //Add group
    await page.getByRole('banner').getByRole('button').hover();
    await page.locator('a').filter({ hasText: 'New Group' }).click();
    await page.getByLabel('Group Name').fill('Parent Group');
    await page.getByRole('button', { name: 'Confirm' }).click();
    //Add sub group
    await page.getByTitle('Parent Group').locator('div').nth(1).hover();
    await page.getByTitle('Parent Group').getByRole('button').click();
    await page.getByText('Add Subgroup').click();
    await page.getByLabel('Group Name').fill('Sub Group');
    await page.getByRole('button', { name: 'Confirm' }).click();
  });

  test('Basic Operate', async ({ page }) => {
    //Edit group
    await page.getByTitle('Sub Group').locator('div').nth(1).hover();
    await page.getByTitle('Sub Group').getByRole('button').click();
    await page.getByText('Edit').click();
    await page.getByLabel('Group Name').fill('Sub Group after');
    await page.getByRole('button', { name: 'Confirm' }).click();

    //Delete group
    await page.getByTitle('Sub Group after').locator('div').nth(1).hover();
    await page.getByTitle('Sub Group after').getByRole('button').click();
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
