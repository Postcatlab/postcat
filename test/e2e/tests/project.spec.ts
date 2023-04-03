import { test, expect } from '@playwright/test';
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Got it' }).click();
});
test('Basic Operate', async ({ page }) => {
  //Back to Project List
  //Add project
  //Edit project
  //Delete project
});
