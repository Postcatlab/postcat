import { test, expect } from '@playwright/test';
test.describe('Group Operate', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
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
  test('Search Group', async ({ page }) => {});
  // test('Sort Group', async ({ page }) => {});
});
