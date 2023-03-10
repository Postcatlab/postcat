import { test, expect } from '@playwright/test';
test.describe('Add API', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Add Form-data API', async ({ page }) => {
    await page.getByRole('banner').getByRole('button').click();
    await page.locator('input[name="uri"]').fill('/formdata');
    await page.locator('input[name="name"]').click();
    await page.locator('input[name="name"]').fill('FormData');
    await page.getByText('Form-Data').click();

    await page.locator('#cdk-drop-list-10').getByPlaceholder('Name').click();
    await page.locator('#cdk-drop-list-10').getByPlaceholder('Name').fill('test');
    await page.getByPlaceholder('Example').first().click();
    await page.getByPlaceholder('Example').first().fill('test');
    await page.getByPlaceholder('Description').first().click();
    await page.getByPlaceholder('Description').first().fill('test');
    await page.getByRole('button', { name: 'Save' }).click();
  });
  // test('Add JSON API', async ({ page }) => {});
  // test('Add XML API', async ({ page }) => {});
  // test('Add Binary API', async ({ page }) => {});
});
