import { test, expect } from '@playwright/test';
test('Export API', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.locator('a:has-text("Setting")').click();
  await page.getByRole('button', { name: 'Export' }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
});
